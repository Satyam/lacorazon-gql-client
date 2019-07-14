import { object, string } from 'yup';

export default object().shape({
  nombre: string()
    .required()
    .trim()
    .default(''),
  localidad: string()
    .trim()
    .default(''),
  contacto: string()
    .trim()
    .default(''),
  telefono: string()
    .trim()
    .matches(/[\d\s\-()]+/, { excludeEmptyString: true })
    .default(''),
  email: string()
    .trim()
    .email()
    .default(''),
  direccion: string()
    .trim()
    .default(''),
});
