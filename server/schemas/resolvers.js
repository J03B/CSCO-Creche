const { AuthenticationError } = require("apollo-server-express");
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
          const uploadName = `${Date.now()}-${filename}`;
          const filePath = path.join(__dirname, "../uploads/", uploadName);
          try {
            // Write the file to the server's filesystem
            await storeUpload({ stream, filename: filePath });

            // Create the Creche document with the image path
            const creche = await Creche.create({
              crecheTitle,
              crecheOrigin,
              crecheDescription,
              crecheImage: filePath, // Store the image path
              crecheUser: context.user.userName,
              yearsDonated,
            });

            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { creches: creche._id } }
            );

            await Exhibit.findOneAndUpdate(
              { exhibitYear: yearsDonated[-1] },
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
  },
};

module.exports = resolvers;
