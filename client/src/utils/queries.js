import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
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
`;

export const QUERY_EXHIBIT = gql`
  query exhibit($exhibitYear: Int!) {
    exhibit(exhibitYear: $exhibitYear) {
      _id
      exhibitYear
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
`;

export const QUERY_MY_CRECHES = gql`
  query creches($userName: String!) {
    creches(userName: $userName) {
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

export const QUERY_CRECHE = gql`
  query creche($crecheId: ID!) {
    creche(crecheId: $crecheId) {
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

export const QUERY_WARDS = gql`
  query wards {
    wards {
      _id
      wardName
      stakeName
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      firstName
      lastName
      email
      phoneNumber
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
`;
