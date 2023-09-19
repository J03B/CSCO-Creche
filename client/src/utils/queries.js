import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      phoneNumber
      password
      totalCreches
      creches {
        _id
        crecheOrigin
        crecheDescription
        crecheImage
        crecheUser
        createdAt
      }
    }
  }
`;

export const QUERY_ALL_CRECHES = gql`
  query allCreches {
    allCreches {
      _id
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      createdAt
    }
  }
`;

export const QUERY_MY_CRECHES = gql`
  query creches($username: String!) {
    creches(username: $username) {
      _id
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      createdAt
    }
  }
`;

export const QUERY_CRECHE = gql`
  query creche($crecheId: ID!) {
    creche(crecheId: $crecheId) {
      _id
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      createdAt
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      user(username: $username) {
        _id
        username
        email
        phoneNumber
        password
        totalCreches
        creches {
          _id
          crecheOrigin
          crecheDescription
          crecheImage
          crecheUser
          createdAt
        }
      }
    }
  }
`;
