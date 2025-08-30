# vue-kavia

This template should help get you started developing with Vue 3 in Vite.

## Backend API configuration (IMPORTANT for login)

The frontend calls the FastAPI backend using the `VITE_API_BASE_URL` environment variable.
In split deployments (frontend and backend on different ports/hosts), this must be set; otherwise login and other API calls will fail.

1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL` to your backend base URL. Examples:
   - Local dev: `VITE_API_BASE_URL="http://localhost:3001"`
   - Kavia environment: `VITE_API_BASE_URL="https://<your-host>:3001"`
3. Optionally set `VITE_APP_STORAGE_PREFIX` to customize localStorage key prefix.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
