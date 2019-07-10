import gql from 'graphql-tag';

export const DISTRIBUIDORES_QUERY = gql`
  query($offset: Int, $limit: Int) {
    distribuidores(offset: $offset, limit: $limit) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
      entregados
      existencias
    }
  }
`;

export const DISTRIBUIDOR_QUERY = gql`
  query($id: ID!) {
    distribuidor(id: $id) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
      entregados
      existencias
    }
  }
`;

export const CREATE_DISTRIBUIDOR = gql`
  mutation(
    $nombre: String!
    $email: String
    $localidad: String
    $contacto: String
    $telefono: String
    $direccion: String
  ) {
    createDistribuidor(
      nombre: $nombre
      email: $email
      localidad: $localidad
      contacto: $contacto
      telefono: $telefono
      direccion: $direccion
    ) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
    }
  }
`;

export const UPDATE_DISTRIBUIDOR = gql`
  mutation(
    $id: ID!
    $nombre: String
    $email: String
    $localidad: String
    $contacto: String
    $telefono: String
    $direccion: String
  ) {
    updateDistribuidor(
      id: $id
      nombre: $nombre
      email: $email
      localidad: $localidad
      contacto: $contacto
      telefono: $telefono
      direccion: $direccion
    ) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
    }
  }
`;

export const DELETE_DISTRIBUIDOR = gql`
  mutation($id: ID!) {
    deleteDistribuidor(id: $id) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
    }
  }
`;
