# Consulta MongoDB

## Instructor
**Christian Martinez**

## Integrantes

- Thomas Avila
- Brayan Mosos
- David Sopo
- Cristian Rojas

## Descripción

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- JavaScript
- Node.js
- Express.js
- MongoDB
- HTML5
- CSS3

La aplicación permite realizar consultas a una base de datos MongoDB mediante una interfaz web.

| Método     | Endpoint                           | Descripción                                      |
| ---------- | ---------------------------------- | ------------------------------------------------ |
| **GET**    | `/api/v1/salud`                    | Verifica el estado de la API.                    |
| **GET**    | `/api/v1/contenidos`               | Obtiene todos los contenidos registrados.        |
| **GET**    | `/api/v1/contenidos/:id`           | Obtiene un contenido por su ID.                  |
| **POST**   | `/api/v1/contenidos`               | Crea un nuevo contenido.                         |
| **PUT**    | `/api/v1/contenidos/:id`           | Actualiza un contenido existente.                |
| **DELETE** | `/api/v1/contenidos/:id`           | Elimina un contenido.                            |
| **GET**    | `/api/v1/aprendices`               | Obtiene todos los aprendices registrados.        |
| **POST**   | `/api/v1/aprendices/solicitud`     | Registra una nueva solicitud de aprendiz.        |
| **PUT**    | `/api/v1/aprendices/solicitud/:id` | Actualiza la información de una solicitud.       |
| **PATCH**  | `/api/v1/aprendices/solicitud/:id` | Actualiza únicamente el estado de una solicitud. |
| **DELETE** | `/api/v1/aprendices/solicitud/:id` | Elimina una solicitud de aprendiz.               |

## Despliegue

La aplicación fue desplegada en Vercel.

🔗 https://consulta-mongod-ijhodpxvz-toma7.vercel.app/

> **Nota:** El despliegue puede no mostrar los datos correctamente si el servidor backend o la base de datos MongoDB no se encuentran disponibles públicamente o si la API está configurada para ejecutarse únicamente en un entorno local.

## Requisitos

- Node.js
- MongoDB
- Visual Studio Code (opcional)

## Autor

Proyecto desarrollado por:

- Thomas Avila
- Brayan Mosos
- David Sopo
- Cristian Rojas
