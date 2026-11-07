# Norama Tech Backend

Express API scaffold for the Norama Tech frontend.

## Requirements

- Node.js 20 or newer
- npm

## Run

Install dependencies with `npm install`, then start the development server with `npm run dev`. For a regular start, use `npm start`.

The API listens on port `5000` by default. Its health check is available at `http://localhost:5000/api/health`.

## Environment

Set these values in `.env`:

| Variable         | Purpose                          | Default                 |
| ---------------- | -------------------------------- | ----------------------- |
| `PORT`           | API server port                  | `5000`                  |
| `NODE_ENV`       | Runtime environment              | `development`           |
| `FRONTEND_URL`   | Allowed frontend origin for CORS | `http://localhost:3000` |
| `DB_URI`         | MongoDB connection string        | unset                   |
| `JWT_SECRET`     | Secret used to sign API tokens   | unset                   |
| `JWT_EXPIRES_IN` | Token lifetime                   | `7d`                    |
| `SMTP_HOST`      | SMTP server hostname             | unset                   |
| `SMTP_PORT`      | SMTP server port                 | `587`                   |
| `SMTP_SECURE`    | Use TLS for SMTP                 | `false`                 |
| `SMTP_USER`      | SMTP username                    | unset                   |
| `SMTP_PASSWORD`  | SMTP password                    | unset                   |

The server requires a valid `DB_URI` to start. The database config also exports the Mongoose auto-increment plugin for future models. Shared helpers are available for token signing, email validation, slugs, IDs, file uploads, and SMTP transport creation.

## Source structure

- `src/config`: application configuration
- `src/controllers`: request handlers
- `src/models`: data models
- `src/routes`: API routes
- `src/services`: application services
- `src/middlewares`: shared Express middleware
- `src/utils`: shared utilities
- `src/uploads`: uploaded files (ignored by Git)

Controllers, models, routes, and services are intentionally left empty until their requirements are defined.
