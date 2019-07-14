import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      nombre
      email
    }
  }
`;

export const LOGIN = gql`
  mutation($nombre: String!, $password: String!) {
    login(nombre: $nombre, password: $password) {
      id
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;
