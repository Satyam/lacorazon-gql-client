export const USERS_QUERY = `
query  {
  users {
    id
    nombre
    email
  }
}
`;

export const USER_QUERY = `
query ($id: ID!) {
  user(id:$id) {
    id
    nombre
    email
  }
}
`;

export const CURRENT_USER_QUERY = `
query {
  currentUser {
    id
    nombre
    email
  }
}`;

export const CREATE_USER = `mutation ($nombre: String!, $email: String, $password: String!) {
  createUser(nombre: $nombre, email: $email, password: $password) {
    id
    nombre
    email
  }
}
`;

export const UPDATE_USER = `mutation ($id: ID!, $nombre: String, $email: String, $password: String) {
  updateUser(id: $id, nombre: $nombre, email: $email, password: $password) {
    id
    nombre
    email
  }
}`;

export const DELETE_USER = `mutation ($id: ID!) {
  deleteUser(id: $id) {
    id
    nombre
    email
  }
}`;

export const LOGIN = `mutation ($nombre: String!, $password: String!) {
  login(nombre: $nombre, password: $password) {
    id
  }
}`;

export const LOGOUT = `mutation {
  logout
}`;
