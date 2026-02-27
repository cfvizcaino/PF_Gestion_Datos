# PF_Gestion_Datos

PF_Gestion_Datos es una plataforma integral para la gestión y consulta de datos de personas, diseñada con una arquitectura moderna basada en microservicios y contenedores Docker. El proyecto incluye un frontend interactivo, varios servicios backend, una base de datos PostgreSQL, un proxy Nginx para orquestación y capacidades de inteligencia artificial mediante LLM (Large Language Models).

## Tabla de Contenidos
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Servicios](#servicios)
- [Integración LLM / IA](#integración-llm--ia)
- [Tecnologías](#tecnologías)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características
- Consulta, creación, modificación y eliminación de personas.
- Registro y consulta de logs asociados a las operaciones.
- **Consultas en lenguaje natural** sobre los datos mediante integración con Google Gemini (LLM).
- Interfaz web moderna y responsiva.
- API RESTful para integración y automatización.
- Orquestación de servicios con Docker Compose.

## Arquitectura
El proyecto está compuesto por los siguientes módulos:
- **frontend/**: Aplicación React para la interfaz de usuario, incluyendo la página de Consulta en Lenguaje Natural.
- **services/**: Microservicios Node.js para CRUD de personas, consulta de logs, consulta de personas y el servicio de IA con Gemini.
- **postgres/**: Base de datos PostgreSQL con scripts de inicialización.
- **nginx/**: Proxy reverso para enrutar peticiones a los servicios correspondientes.
- **docker-compose.yml**: Orquestación de todos los servicios y contenedores.

```
frontend (React)
   |
nginx (Proxy)
   |
services/
   |-- personas-crud (Node.js)        → CRUD de personas
   |-- consultar-personas (Node.js)   → Consulta estándar
   |-- logs-personas (Node.js)        → Logs de operaciones
   |-- gemini (Node.js + Gemini AI)   → Consultas en lenguaje natural (LLM)
   |
postgres (DB)
```

## Instalación
1. Clona el repositorio:
   ```sh
   git clone https://github.com/cfvizcaino/PF_Gestion_Datos.git
   cd PF_Gestion_Datos
   ```
2. Configura las variables de entorno (ver [Configuración](#configuración)).
3. Levanta los servicios con Docker Compose:
   ```sh
   docker-compose up --build
   ```
4. Accede a la aplicación web en [http://localhost](http://localhost).

## Configuración

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente template:

```env
# Clave de API de Google Gemini (requerida para el servicio de IA)
GEMINI_API_KEY=tu_clave_api_aqui
```

> ⚠️ **El archivo `.env` ya está incluido en `.gitignore`** y no debe ser commiteado al repositorio. Nunca expongas tu clave de API en el código fuente.

Puedes obtener una clave de API de Gemini en [Google AI Studio](https://aistudio.google.com/app/apikey).

> **Nota:** Sin la variable `GEMINI_API_KEY`, el servicio de Gemini no funcionará. Los demás servicios operan de manera independiente.

## Uso
- Utiliza la interfaz web para gestionar personas y consultar logs.
- Accede a la sección **Consulta en Lenguaje Natural** para hacer preguntas sobre los datos usando texto libre (impulsado por Gemini AI).
- Accede a las APIs REST de los microservicios para integraciones externas.
- Consulta la documentación de cada servicio en su respectivo README.

## Servicios
- **personas-crud**: CRUD de personas.
- **consultar-personas**: Consulta avanzada de personas.
- **logs-personas**: Registro y consulta de logs.
- **gemini**: Servicio de inteligencia artificial para consultas en lenguaje natural sobre los datos del sistema.

## Integración LLM / IA

### Servicio Gemini (`services/gemini`)
El servicio `gemini` integra el modelo de lenguaje **Google Gemini** para permitir consultas en lenguaje natural sobre los datos de personas registradas.

**Endpoint principal:**
- `POST /api/services/gemini/query`
  - **Body:** `{ "prompt": "¿Cuántas personas están registradas?" }`
  - **Respuesta:** Texto generado por el LLM con información actualizada de la base de datos.

**Funcionamiento:**
1. El servicio consulta estadísticas en tiempo real de la base de datos (total de usuarios, distribución por género, rangos de edad, últimos registros, etc.).
2. Construye un contexto enriquecido con esos datos.
3. Envía el contexto junto con la pregunta del usuario al modelo `gemini-pro`.
4. Retorna la respuesta generada por el LLM.

**Ejemplo de preguntas soportadas:**
- "¿Cuántas personas están registradas en el sistema?"
- "¿Cuál es la distribución de género de los usuarios?"
- "¿Cuál es la edad promedio de las personas registradas?"
- "¿Quiénes son los últimos 5 registros ingresados?"

### Servicio de Consulta en Lenguaje Natural (`services/consultar-personas-nl`)
Módulo complementario para la consulta de personas mediante procesamiento de lenguaje natural, con soporte para soluciones basadas en RAG (Retrieval-Augmented Generation) usando pgvectorscale. Este servicio está orientado a búsquedas semánticas sobre los datos de personas usando embeddings vectoriales almacenados en PostgreSQL.

### Página de Consulta NL (Frontend)
La interfaz React incluye la página **ConsultaNL** (`frontend/src/components/pages/ConsultaNL.jsx`), que permite a los usuarios escribir preguntas en lenguaje natural y recibir respuestas generadas por la IA directamente en la aplicación web. Esta página se conecta al **servicio Gemini** a través del endpoint `POST /api/services/gemini/query`.

## Tecnologías
- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **IA / LLM**: Google Gemini (`gemini-pro`), `@google/generative-ai`
- **RAG**: pgvectorscale (consulta en lenguaje natural con vectores)
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
