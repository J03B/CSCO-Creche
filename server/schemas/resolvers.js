const { AuthenticationError, Error } = require("apollo-server-express");
const { User, Creche, Exhibit, Ward } = require("../models");
const { signToken } = require("../utils/auth");
const fs = require("fs");
const path = require("path"); // for working with file paths
const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary").v2;

async function storeUpload({ stream, filename }) {
  let cloudUrl;
  cloudinary.config({
    cloud_name: process.env.CLOUD_API_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
  });

  await new Promise((resolve, reject) => {
    stream
      .pipe(fs.createWriteStream(filename))
      .on("finish", () => resolve())
      .on("error", reject);
  });
  console.log("file saved locally successfully");
  await cloudinary.uploader.upload(filename, function (error, result) {
    console.log(result, error);
    cloudUrl = result.url;
  });
  return cloudUrl;
}

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    user: async (parent, { userName }) => {
      return User.findOne({ userName }).populate("creches");
    },
    exhibit: async (parent, { exhibitYear }) => {
      return Exhibit.findOne({ exhibitYear }).populate("creches");
    },
    creches: async (parent, { userName }) => {
      const params = userName ? { crecheUser } : {};
      return Creche.find(params).sort({ createdAt: -1 });
    },
    creche: async (parent, { crecheId }) => {
      return Creche.findOne({ _id: crecheId });
    },
    wards: async (parent) => {
      const results = await Ward.find({});
      return results;
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("creches");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    usersByYear: async (parent, { year, include }) => {
      let returnUsers = [];
      const users = await User.find({}).populate("creches");
      let userAdded = !include;

      // Loop through each user to find ones with a creche in the year
      users.forEach(async (user) => {
        if (user.creches.length > 0) {
          for (let i = 0; i < user.creches.length; i++) {
            const creche = user.creches[i];
            if (include) {
              if (creche.yearsDonated.includes(year)) {
                returnUsers.push(user);
                userAdded = true;
              }
              if (userAdded) {
                userAdded = false;
                return;
              }
            } else {
              if (creche.yearsDonated.includes(year)) {
                userAdded = true;
                return;
              }
              userAdded = false;
            }
          }
          if (!include && !userAdded) {
            returnUsers.push(user);
          }
        } else {
          if (!include) {
            returnUsers.push(user);
          }
        }
      });
      return returnUsers;
    },
    allUsers: async (parent, args, context) => {
      return await User.find({});
    },
  },

  Mutation: {
    addUser: async (
      parent,
      { firstName, lastName, email, phoneNumber, password, wardName }
    ) => {
      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        wardName,
      });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addCreche: async (
      parent,
      {
        crecheTitle,
        crecheOrigin,
        crecheDescription,
        crecheImage /* This is the file Upload */,
        yearsDonated,
      },
      context
    ) => {
      console.log({
        crecheTitle,
        crecheOrigin,
        crecheDescription,
        crecheImage,
        yearsDonated,
      });
      if (context.user) {
        // Check if crecheImage exists and is not empty
        const { createReadStream, filename, mimetype, encoding } =
          await crecheImage;
        console.log({ createReadStream, filename, mimetype, encoding });

        if (filename) {
          const stream = createReadStream();
          const uploadName = `${Date.now()}-${filename.replace(/\s+/g, "")}`;
          let filePath;
          if (process.env.NODE_ENV === "production") {
            const dir = "/app/uploads/images";
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            filePath = path.join(dir, uploadName);
          } else {
            filePath = path.join("../client/public/images/", uploadName);
          }

          try {
            // Write the file to the server's filesystem
            const cloudUrl = await storeUpload({ stream, filename: filePath });

            // Create the Creche document with the image path
            const creche = await Creche.create({
              crecheTitle,
              crecheOrigin,
              crecheDescription,
              crecheImage: cloudUrl, // Store the image path
              crecheUser: context.user.userName,
              yearsDonated,
            });

            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { creches: creche._id } }
            );

            await Exhibit.findOneAndUpdate(
              { exhibitYear: yearsDonated },
              { $addToSet: { creches: creche._id } }
            );

            return creche;
          } catch (error) {
            // Handle any errors that occur during file writing
            console.error("Error saving the image:", error);
            throw new Error("Error saving the image.");
          }
        } else {
          // Handle the case where crecheImage is missing
          throw new Error("crecheImage is required.");
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeCreche: async (parent, { crecheId }, context) => {
      if (context.user) {
        const creche = await Creche.findOneAndDelete({
          _id: crecheId,
          crecheUser: context.user.userName,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { creches: creche._id } }
        );

        // Update the Exhibits
        async function updateExhibit(year) {
          await Exhibit.findOneAndUpdate(
            { exhibitYear: year },
            { $pull: { creches: creche._id } }
          );
        }
        creche.yearsDonated.forEach((year) => {
          updateExhibit(year);
        });

        // Delete the image from the Cloudinary database
        try {
          cloudinary.config({
            cloud_name: process.env.CLOUD_API_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
            secure: true,
          });

          const publicId = creche.crecheImage.split("/")[-1].split(".")[0];
          console.log(publicId);
          cloudinary.uploader.destroy(
            publicId,
            function (err, result) {
              console.log(result ? result : err);
            }
          );
        } catch (err) {
          console.log(err);
        }

        return creche;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    redonateCreche: async (parent, { crecheId, yearToDonate }, context) => {
      const creche = await Creche.findOne({
        _id: crecheId,
      });

      // Make sure we match the Creche's user to the one logged in
      if (context.user.userName === creche.crecheUser) {
        const updatedYears = creche.yearsDonated;
        updatedYears.push(yearToDonate);

        // Perform update operation
        const updatedCreche = await Creche.findOneAndUpdate(
          {
            _id: crecheId,
          },
          {
            yearsDonated: updatedYears,
          },
          {
            new: true,
          }
        );
        const exhibit = await Exhibit.findOneAndUpdate(
          { exhibitYear: yearToDonate },
          { $addToSet: { creches: crecheId } }
        );
        return updatedCreche;
      }
      throw new AuthenticationError("Unable to update creche contribution");
    },
    resetPassword: async (parent, { email }, context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const pwOptions = [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789",
        "!@#$%^&",
      ];
      let generatedPW = "";
      for (let i = 0; i < 8; i++) {
        const option = pwOptions[Math.floor(Math.random() * 4)];
        generatedPW += option[Math.floor(Math.random() * option.length)];
      }
      console.log(generatedPW);
      /*const userData = await User.findOneAndUpdate(
        { email },
        { password: generatedPW }
      );
      await sendEmail(email, "Colorado Springs Creche Password Reset", `Dear ${userData.firstName},\n\nYour new password is ${generatedPW}. Please save this password in a secure location.\n\nThank you,\nColorado Springs Creche`);
      
      return userData;
      */
      return user;
    },
    grantAdmin: async (parent, { email }, context) => {
      const user = await User.findOneAndUpdate({ email }, { role: "admin" });
      if (!user) {
        throw new Error("User does not exist");
      }
      return user;
    },
    editCreche: async (
      parent,
      { crecheId, crecheTitle, crecheOrigin, crecheDescription },
      context
    ) => {
      const creche = await Creche.findOneAndUpdate(
        { _id: crecheId },
        {
          crecheTitle,
          crecheOrigin,
          crecheDescription,
        }
      );
      if (!creche) {
        throw new Error("Creche not found");
      }
      return creche;
    },
  },
};

module.exports = resolvers;
