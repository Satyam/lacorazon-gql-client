export const DISTRIBUIDORES_QUERY = `
query($offset: Int, $limit: Int )  {
  distribuidores(offset: $offset, limit: $limit ) {
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

export const DISTRIBUIDOR_QUERY = `
query ($id: ID!) {
  distribuidor(id:$id) {
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

export const CREATE_DISTRIBUIDOR = ``;
export const UPDATE_DISTRIBUIDOR = ``;
export const DELETE_DISTRIBUIDOR = ``;
