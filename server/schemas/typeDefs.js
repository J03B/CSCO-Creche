const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    phoneNumber: String
    password: String
    creches: [Creche]!
    totalCreches: Int
  }

  type Creche {
    _id: ID
    crecheOrigin: String
    crecheDescription: String
    crecheImage: String
    crecheUser: String
    createdAt: String
  }

  type Exhibit {
    _id: ID
    creches: [Creche]!
    totalCreches: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User
    allCreches: [Creche]!
    creches(username: String!): [Creche]!
    creche(crecheId: ID!): Creche
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, phoneNumber: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addCreche(crecheOrigin: String!, crecheDescription: String!, crecheImage: String!): Creche
    removeCreche(crecheId: ID!): Creche
  }
`;

module.exports = typeDefs;
