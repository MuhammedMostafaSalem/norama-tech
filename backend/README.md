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

| Variable                 | Purpose                          | Default                 |
| ------------------------ | -------------------------------- | ----------------------- |
| `PORT`                   | API server port                  | `5000`                  |
| `NODE_ENV`               | Runtime environment              | `development`           |
| `FRONTEND_URL`           | Allowed frontend origin for CORS | `http://localhost:3000` |
| `DB_URI`                 | MongoDB connection string        | unset                   |
| `JWT_SECRET`             | Fallback secret for API tokens   | unset                   |
| `JWT_ACCESS_SECRET`      | Access-token signing secret      | `JWT_SECRET`            |
| `JWT_REFRESH_SECRET`     | Refresh-token signing secret     | `JWT_SECRET`            |
| `JWT_ACCESS_EXPIRES_IN`  | Access-token lifetime            | `15m`                   |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime           | `7d`                    |
| `JWT_EXPIRES_IN`         | Legacy refresh-token lifetime    | `7d`                    |
| `SMTP_HOST`              | SMTP server hostname             | unset                   |
| `SMTP_PORT`              | SMTP server port                 | `587`                   |
| `SMTP_SECURE`            | Use TLS for SMTP                 | `false`                 |
| `SMTP_USER`              | SMTP username                    | unset                   |
| `SMTP_PASSWORD`          | SMTP password                    | unset                   |

The server requires a valid `DB_URI` to start. The database config also exports the Mongoose auto-increment plugin for future models. Auth services handle token creation and rotation, request validation, and verification/reset emails. Shared utilities provide slug and ID helpers.

## Authentication API

All auth endpoints are mounted under `/api/auth`:

| Method  | Path               | Purpose                                                       |
| ------- | ------------------ | ------------------------------------------------------------- |
| `POST`  | `/signup`          | Create an account and send an email-verification OTP          |
| `POST`  | `/register`        | Alias for `/signup`                                           |
| `POST`  | `/verify-otp`      | Verify email or password-reset OTP                            |
| `POST`  | `/resend-otp`      | Resend an OTP for the specified purpose                       |
| `POST`  | `/login`           | Authenticate and create a session                             |
| `POST`  | `/refresh-token`   | Rotate the refresh token and issue a new access token         |
| `POST`  | `/refresh`         | Alias for `/refresh-token`                                    |
| `POST`  | `/logout`          | Revoke the current refresh token                              |
| `POST`  | `/forgot-password` | Send a password-reset OTP                                     |
| `PATCH` | `/reset-password`  | Reset a password using its one-time token and confirmation    |
| `POST`  | `/reset-password`  | Alias for the PATCH endpoint                                  |
| `GET`   | `/me`              | Return the authenticated user; requires a Bearer access token |

The access token is returned in the JSON response. The refresh token is stored as a hash in MongoDB and sent to browsers in an HttpOnly cookie. Configure `SMTP_*` values to deliver verification and password-reset emails. Registration requires `firstName`, `lastName`, `email`, `phone`, and `password`. For password recovery, call `/forgot-password`, verify the returned email OTP using `/verify-otp` with `purpose: "forgot_password"`, then submit its `resetToken` and matching `password`/`confirmPassword` to `/reset-password`.

## User API

All user routes require an access token. Profile routes are scoped to the signed-in user; listing, creating, reading by ID, changing roles/status, and deleting users require the `admin` role.

| Method   | Path                     | Access                                                   |
| -------- | ------------------------ | -------------------------------------------------------- |
| `GET`    | `/api/users/me`          | Signed-in user                                           |
| `PATCH`  | `/api/users/me`          | Signed-in user; update name, email, or phone             |
| `PATCH`  | `/api/users/me/password` | Signed-in user; change own password                      |
| `GET`    | `/api/users`             | Admin; paginated/searchable list excluding current admin |
| `GET`    | `/api/users/:id`         | Admin                                                    |
| `PATCH`  | `/api/users/:id/role`    | Admin; update role or active status                      |
| `PATCH`  | `/api/users/:id`         | Signed-in user; own profile only                         |
| `DELETE` | `/api/users/:id`         | Admin; cannot delete current admin                       |

## Source structure

- `src/config`: application configuration
- `src/controllers`: request handlers
- `src/models`: data models
- `src/routes`: API routes
- `src/services`: application services
- `src/schemas`: request validation schemas
- `src/middlewares`: shared Express middleware
- `src/templates`: branded HTML email templates
- `src/utils`: shared utilities
- `src/uploads`: uploaded files (ignored by Git)
