# RIU-Frontend-MilenaPavichevich

Aplicación SPA para el mantenimiento de superhéroes.

## Requisitos previos

- Node.js 24.x
- npm
- Docker (opcional)

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/mmilaa/RIU-Frontend-MilenaPavichevich.git
cd RIU-Frontend-MilenaPavichevich
npm install
```

### Levantar en local

```bash
npm run start
```

La app queda disponible en `http://localhost:4200`.

### Levantar con Docker

```bash
npm run docker
```

La app queda disponible en `http://localhost:8080`.

Para detenerlo:

```bash
docker compose down
```

## Tecnologías

- Angular 20
- Angular Material
- TypeScript
- SCSS
- Karma + Jasmine
- Docker + Nginx
