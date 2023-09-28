const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
    totalCreches: Int
  }

  type Ward {
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
    me: User
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, phoneNumber: String!, password: String!, wardName: String!): Auth
    login(email: String!, password: String!): Auth
    addCreche(crecheTitle: String!, crecheOrigin: String!, crecheDescription: String!, crecheImage: String!, yearsDonated: [Int]!): Creche
    removeCreche(crecheId: ID!): Creche
  }
`;

module.exports = typeDefs;
