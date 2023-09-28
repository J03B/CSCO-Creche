const { AuthenticationError } = require('apollo-server-express');
const { User, Creche, Exhibit } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { userName }) => {
      return User.findOne({ userName }).populate('creches');
    },
    exhibit: async(parent, { exhibitYear }) => {
      return Exhibit.findOne({exhibitYear}).populate('creches');
    },
    creches: async (parent, { userName }) => {
      const params = userName ? { crecheUser } : {};
      return Creche.find(params).sort({ createdAt: -1 });
    },
    creche: async (parent, { crecheId }) => {
      return Creche.findOne({ _id: crecheId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('creches');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { firstName, lastName, email, phoneNumber, password, wardName }) => {
      const user = await User.create({ firstName, lastName, email, phoneNumber, password, wardName });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addCreche: async (parent, { crecheTitle, crecheOrigin, crecheDescription, crecheImage, yearsDonated }, context) => {
      if (context.user) {
        const creche = await Creche.create({
          crecheTitle,
          crecheOrigin,
          crecheDescription,
          crecheImage,
          crecheUser: context.user.userName,
          yearsDonated,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { creches: creche._id } }
        );

        return creche;
      }
      throw new AuthenticationError('You need to be logged in!');
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
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
