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
      role
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
      role
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

export const QUERY_USERS_BY_YEAR = gql`
  query usersByYear($year: Int) {
    usersByYear(year: $year) {
      userName
      phoneNumber
      email
      wardName
    }
  }
`;

export const QUERY_ALL_USERS = gql`
  query allUsers {
    allUsers {
      userName
      phoneNumber
      email
      wardName
      role
    }
  }
`;