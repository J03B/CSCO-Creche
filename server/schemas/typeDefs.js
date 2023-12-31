const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    password: String
    wardName: String
    creches: [Creche]!
    userName: String
    role: String
    totalCreches: Int
  }

  type Creche {
    _id: ID
    crecheTitle: String
    crecheOrigin: String
    crecheDescription: String
    crecheImage: String
    crecheUser: String
    yearsDonated: [Int]
    createdAt: String
  }

  type Exhibit {
    _id: ID
    exhibitYear: Int
    creches: [Creche]!
  }

  type Ward {
    _id: ID
    wardName: String
    stakeName: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(userName: String!): User
    exhibit(exhibitYear: Int!): Exhibit
    creches(userName: String!): [Creche]!
    creche(crecheId: ID!): Creche
    wards: [Ward]!
    me: User
    usersByYear(year: Int!, include: Boolean!): [User]!
    allUsers: [User]
    allCreches: [Creche]!
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, phoneNumber: String!, password: String!, wardName: String!): Auth
    login(email: String!, password: String!): Auth
    addCreche(crecheTitle: String!, crecheOrigin: String!, crecheDescription: String!, crecheImage: Upload, yearsDonated: [Int]!): Creche
    removeCreche(crecheId: ID!): Creche
    redonateCreche(crecheId: ID!, yearToDonate: Int!): Creche
    resetPassword(email: String!): User
    grantAdmin(email: String!): User
    editCreche(crecheId: ID!, crecheTitle: String!, crecheOrigin: String!, crecheDescription: String!, crecheImage: Upload): Creche
  }
`;

module.exports = typeDefs;
