//este archivo es el modelo de usuario que se utiliza en la aplicacion, contiene las propiedades que se utilizan para autenticar al usuario y su informacion personal
export class User {
    id ?: number;
    username ?: string;
    password ?: string;
    firstName ?: string;
    lastName ?: string;
    token ?: string;
}