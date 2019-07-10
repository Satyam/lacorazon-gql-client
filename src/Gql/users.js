import gql from 'graphql-tag';

export const USERS_QUERY = gql`
  query {
    users {
      id
      nombre
      email
    }
  }
`;

export const USER_QUERY = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      nombre
      email
    }
  }
`;

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      nombre
      email
    }
  }
`;

export const CREATE_USER = gql`
  mutation($nombre: String!, $email: String, $password: String!) {
    createUser(nombre: $nombre, email: $email, password: $password) {
      id
      nombre
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($id: ID!, $nombre: String, $email: String, $password: String) {
    updateUser(id: $id, nombre: $nombre, email: $email, password: $password) {
      id
      nombre
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
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
