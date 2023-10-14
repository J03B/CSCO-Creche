import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        firstName
        lastName
        email
        phoneNumber
        password
        wardName
        userName
        totalCreches
        creches {
          _id
          crecheTitle
          crecheOrigin
          crecheDescription
          crecheImage
          crecheUser
          yearsDonated
          createdAt
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $phoneNumber: String!, $password: String!, $wardName: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, phoneNumber: $phoneNumber, password: $password, wardName: $wardName) {
      token
      user {
        _id
        firstName
        lastName
        email
        phoneNumber
        password
        wardName
        userName
        totalCreches
        creches {
          _id
          crecheTitle
          crecheOrigin
          crecheDescription
          crecheImage
          crecheUser
          yearsDonated
          createdAt
        }
      }
    }
  }
`;

export const ADD_CRECHE = gql`
  mutation addCreche($crecheTitle: String!, $crecheOrigin: String!, $crecheDescription: String!, $crecheImage: Upload!, $yearsDonated: [Int]!) {
    addCreche(crecheTitle: $crecheTitle, crecheOrigin: $crecheOrigin, crecheDescription: $crecheDescription, crecheImage: $crecheImage, yearsDonated: $yearsDonated) {
      _id
      crecheTitle
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      yearsDonated
      createdAt
    }
  }
`;

export const REMOVE_CRECHE = gql`
  mutation removeCreche($crecheId: ID!) {
    removeCreche(crecheId: $crecheId) {
      _id
      crecheTitle
      crecheOrigin
      crecheDescription
      crecheImage
      crecheUser
      yearsDonated
      createdAt
    }
  }
`
export const REDONATE_CRECHE = gql`
  mutation redonateCreche($crecheId: ID!, $yearToDonate: Int!) {
    redonateCreche(crecheId: $crecheId, yearToDonate: $yearToDonate) {
      _id
      yearsDonated
    }
  }
`
;
