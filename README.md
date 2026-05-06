# ShamirSas-collinson-assessment-api

GraphQL API for the Collinson senior back-end developer assessment.

## What this GraphQL API does

This service exposes two query operations:

- `getLocations(name: String!)`
  - Searches locations (city/town) by name.
  - Returns either:
    - `Locations` with a `locations` array, or
    - `ResponseMessage` when no data is found.
- `getRanking(longitude: Float!, latitude: Float!)`
  - Computes and returns activity ranking for a location using forecast data.
  - Returns `Ranking` with an `activities` array.

The schema is composed from GraphQL files under `src/modules/**/*.graphql`, and resolvers are attached at startup.

## Tech stack

- Node.js + TypeScript
- Apollo Server
- GraphQL Tools
- Zod (schema validation)
- Jest (unit + e2e tests)

## Checkout and setup

1. Clone the repository:

```bash
git clone https://github.com/ShamirSas/ShamirSas-collinson-assessment-api
cd ShamirSas-collinson-assessment-api
```

2. Install dependencies:

```bash
npm install
```

## Run the project

### Development mode

```bash
npm run dev
```

- Uses `nodemon` for auto-restarts while developing.

### Production-style run

```bash
npm start
```

- Compiles TypeScript, then runs the compiled app from `dist`.

### API endpoint

By default, the server starts on port `4000`:

- GraphQL server URL: `http://localhost:4000/`

On startup you should see:

```text
🚀  Server ready at: http://localhost:4000/
```

## package.json scripts breakdown

- `npm run compile`
  - Runs TypeScript compiler (`tsc`) to generate `dist/`.
- `npm start`
  - Runs `compile`, then starts the compiled server (`node ./dist/index.js`).
- `npm run dev`
  - Starts development mode via `nodemon`.
- `npm test`
  - Runs all Jest test suites.
- `npm run test:unit`
  - Runs only the unit test project (`jest --selectProjects unit`).
- `npm run test:e2e`
  - Runs only the e2e test project (`jest --selectProjects e2e`).
- `npm run prepare`
  - Installs/sets up Husky hooks.

## Test commands

```bash
npm test
npm run test:unit
npm run test:e2e
```
