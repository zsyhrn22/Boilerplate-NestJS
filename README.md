# 🚀 Boilerplate-NestJS

NestJS boilerplate for building scalable, production-ready backend APIs — batteries included.

**Stack:** NestJS · PostgreSQL · Redis · Supabase Storage · Docker

---

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Database | PostgreSQL |
| Caching | Redis |
| File Storage | Supabase Storage |
| Containerization | Docker Compose |

---

## ⚡ Quick Start

### 1. Clone & Setup Environment

```bash
git clone https://github.com/your-username/boilerplate-nestjs.git
cd boilerplate-nestjs
```

Copy and rename the environment files:

```bash
# Docker Compose (root folder)
cp .env.example .env

# NestJS App (restful-api/environments/)
cp restful-api/environments/.env.example restful-api/environments/.env.development
cp restful-api/environments/.env.example restful-api/environments/.env.production
```

---

### 2. Fill in Environment Variables

**`.env` — Docker Compose Config** *(root folder)*

```env
# App
NODE_ENV=                        # development | staging | production

# REST API
RESTFUL_API_HOST_PORT=           # host port (e.g. 3000)
RESTFUL_API_CONTAINER_PORT=      # container port (e.g. 3000)

# PostgreSQL
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_HOST_PORT=              # host port (e.g. 5432)
POSTGRES_CONTAINER_PORT=         # container port (e.g. 5432)

# Redis
REDIS_PASSWORD=
REDIS_HOST_PORT=                 # host port (e.g. 6379)
REDIS_CONTAINER_PORT=            # container port (e.g. 6379)
```

**`restful-api/environments/.env.*` — NestJS App Config**

```env
# App
APP_HOST=
APP_PORT=

# Database
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

# Cache
CACHE_URL=                       # Redis connection URL

# Supabase
SUPABASE_URL=
SUPABASE_KEY=
```

---

### 3. Run the Application

**Development**
```bash
docker compose -f docker-compose.development.yaml up
```

**Production**
```bash
docker compose -f docker-compose.production.yaml up -d
```

---

## 📁 Project Structure

```
boilerplate-nestjs/
├── restful-api/                    # NestJS application
│   ├── environments/               # Environment files per stage
│   │   ├── .env.example
│   │   ├── .env.development
│   │   ├── .env.production
│   │   └── .env.staging
│   ├── src/                        # Source code
│   ├── test/                       # Unit & e2e tests
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
├── .env                            # Docker Compose environment
├── .env.example
├── docker-compose.development.yaml
└── docker-compose.production.yaml
```

---

## 🛠️ Requirements

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+ *(for local dev without Docker)*
- Supabase project *(for file storage)*

---
