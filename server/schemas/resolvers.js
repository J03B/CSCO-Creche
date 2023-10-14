const { AuthenticationError, Error } = require("apollo-server-express");
const { User, Creche, Exhibit, Ward } = require("../models");
const { signToken } = require("../utils/auth");
const fs = require("fs");
const path = require("path"); // for working with file paths
const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");

const storeUpload = ({ stream, filename }) =>
  new Promise((resolve, reject) => {
    stream
      .pipe(fs.createWriteStream(filename))
      .on("finish", () => resolve())
      .on("error", reject);
  });

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
    usersByYear: async (parent, { year }) => {
      const users = User.find((u) => {
        const yearIncluded = false;
        u.creches.forEach((creche) => {
          if (creche.yearsDonated.includes(year)) {
            yearIncluded = true;
          }
        });
        return yearIncluded;
      });
      return users;
    },
    allUsers: async (parent, args, context) => {
      return User.find({});
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
        context,
      });
      if (context.user) {
        // Check if crecheImage exists and is not empty
        const { createReadStream, filename, mimetype, encoding } =
          await crecheImage;
        console.log({ createReadStream, filename, mimetype, encoding });

        if (filename) {
          const stream = createReadStream();
          const uploadName = `${Date.now()}-${filename.replace(/\s+/g, "")}`;
          const filePath = path.join("../client/public/images/", uploadName);
          try {
            // Write the file to the server's filesystem
            await storeUpload({ stream, filename: filePath });

            // Create the Creche document with the image path
            const creche = await Creche.create({
              crecheTitle,
              crecheOrigin,
              crecheDescription,
              crecheImage: uploadName, // Store the image path
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
      const userData = await User.findOneAndUpdate(
        { email },
        { password: generatedPW }
      );
      return userData;
    },
  },
};

module.exports = resolvers;
