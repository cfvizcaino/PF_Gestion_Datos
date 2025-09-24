# PF_Gestion_Datos

PF_Gestion_Datos es una plataforma integral para la gestión y consulta de datos de personas, diseñada con una arquitectura moderna basada en microservicios y contenedores Docker. El proyecto incluye un frontend interactivo, varios servicios backend, una base de datos PostgreSQL y un proxy Nginx para orquestación.

## Tabla de Contenidos
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Servicios](#servicios)
- [Tecnologías](#tecnologías)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características
- Consulta, creación, modificación y eliminación de personas.
- Registro y consulta de logs asociados a las operaciones.
- Interfaz web moderna y responsiva.
- API RESTful para integración y automatización.
- Orquestación de servicios con Docker Compose.

## Arquitectura
El proyecto está compuesto por los siguientes módulos:
- **frontend/**: Aplicación React para la interfaz de usuario.
- **services/**: Microservicios Node.js para CRUD de personas, consulta de logs y consulta de personas.
- **postgres/**: Base de datos PostgreSQL con scripts de inicialización.
- **nginx/**: Proxy reverso para enrutar peticiones a los servicios correspondientes.
- **docker-compose.yml**: Orquestación de todos los servicios y contenedores.

```
frontend (React)
   |
nginx (Proxy)
   |
services/
   |-- personas-crud (Node.js)
   |-- consultar-personas (Node.js)
   |-- logs-personas (Node.js)
   |
postgres (DB)
```

## Instalación
1. Clona el repositorio:
   ```sh
   git clone https://github.com/cfvizcaino/PF_Gestion_Datos.git
   cd PF_Gestion_Datos
   ```
2. Levanta los servicios con Docker Compose:
   ```sh
   docker-compose up --build
   ```
3. Accede a la aplicación web en [http://localhost](http://localhost).

## Uso
- Utiliza la interfaz web para gestionar personas y consultar logs.
- Accede a las APIs REST de los microservicios para integraciones externas.
- Consulta la documentación de cada servicio en su respectivo README.

## Servicios
- **personas-crud**: CRUD de personas.
- **consultar-personas**: Consulta avanzada de personas.
- **logs-personas**: Registro y consulta de logs.

## Tecnologías
- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **Orquestación**: Docker, Docker Compose
- **Proxy**: Nginx

## Contribuir
1. Haz un fork del repositorio.
2. Crea una rama para tu feature/fix: `git checkout -b mi-feature`
3. Realiza tus cambios y haz commit: `git commit -m "Agrega mi feature"`
4. Haz push a tu rama: `git push origin mi-feature`
5. Abre un Pull Request.

## Licencia
Este proyecto está bajo la licencia MIT.

---

> Para dudas o sugerencias, contacta a los mantenedores en GitHub.
