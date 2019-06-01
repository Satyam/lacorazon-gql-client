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

export const CREATE_USER = `mutation ($nombre: String!, $email: String) {
  createUser(nombre: $nombre, email: $email) {
    id
    nombre
    email
  }
}
`;

export const UPDATE_USER = `mutation ($id: ID!, $nombre: String, $email: String) {
  updateUser(id: $id, nombre: $nombre, email: $email) {
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
