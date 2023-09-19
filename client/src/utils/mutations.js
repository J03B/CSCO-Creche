import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
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

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $phoneNumber: String!, $password: String!) {
    addUser(username: $username, email: $email, phoneNumber: $phoneNumber, password: $password) {
      token
      user {
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

export const ADD_CRECHE = gql`
  mutation addCreche($crecheOrigin: String!, $crecheDescription: String!, $crecheImage: String!) {
    addCreche(crecheOrigin: $crecheOrigin, crecheDescription: $crecheDescription, crecheImage: $crecheImage) {
      _id
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      createdAt
    }
  }
`;

export const REMOVE_CRECHE = gql`
  mutation removeCreche($crecheId: ID!) {
    removeCreche(crecheId: $crecheId) {
      _id
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      createdAt
    }
  }
`;
