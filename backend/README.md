# Norama Tech Backend

Express API scaffold for the Norama Tech frontend.

## Requirements

- Node.js 20 or newer
- npm

## Run

Install dependencies with `npm install`, then start the development server with `npm run dev`. For a regular start, use `npm start`.

The API listens on port `5000` by default. Its health check is available at `http://localhost:5000/api/health`.

Create a `.env` file in this directory before starting the server. A minimal local configuration is:

```dotenv
NODE_ENV=development
PORT=5000
DB_URI=mongodb://127.0.0.1:27017/norama-tech
FRONTEND_URL=http://localhost:3000
DEFAULT_LANGUAGE=ar
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=use-a-different-long-random-secret
```

For production, use a managed MongoDB connection string and separate random JWT secrets of at least 32 characters; see the production requirements below.

## Environment

Set these values in `.env`:

| Variable                 | Purpose                                   | Default                 |
| ------------------------ | ----------------------------------------- | ----------------------- |
| `PORT`                   | API server port                           | `5000`                  |
| `NODE_ENV`               | Runtime environment                       | `development`           |
| `FRONTEND_URL`           | Allowed frontend origin for CORS          | `http://localhost:3000` |
| `CORS_ORIGINS`           | Comma-separated CORS origin allowlist     | `FRONTEND_URL`          |
| `TRUST_PROXY_HOPS`       | Number of trusted reverse proxies         | `0`                     |
| `DEFAULT_LANGUAGE`       | Default API response language (`ar`/`en`) | `ar`                    |
| `DB_URI`                 | MongoDB connection string                 | unset                   |
| `JWT_ACCESS_SECRET`      | Access-token signing secret               | required                |
| `JWT_REFRESH_SECRET`     | Refresh-token signing secret              | required                |
| `JWT_ACCESS_EXPIRES_IN`  | Access-token lifetime                     | `15m`                   |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime                    | `7d`                    |
| `SMTP_HOST`              | SMTP server hostname                      | unset                   |
| `SMTP_PORT`              | SMTP server port                          | `587`                   |
| `SMTP_SECURE`            | Use TLS for SMTP                          | `false`                 |
| `SMTP_USER`              | SMTP username                             | unset                   |
| `SMTP_PASSWORD`          | SMTP password                             | unset                   |
| `SMTP_FROM`              | Sender address shown on outgoing mail     | `SMTP_USER`             |
| `CONTACT_EMAIL`          | Inbox for contact notifications           | `SMTP_USER`             |
| `REFRESH_TOKEN_COOKIE_NAME` | Refresh-token cookie name              | `refreshToken`           |

The server requires a valid `DB_URI` to start. `SMTP_HOST` is required when sending mail; the server can start without it, but signup and password-reset email delivery will fail until SMTP is configured. Auth services handle token creation and rotation, request validation, and verification/reset emails. Shared utilities provide slug and ID helpers.

## Language and Security

API messages support Arabic and English. Choose a language with `X-Language: ar` or `X-Language: en`; `X-Locale` and `Accept-Language` are also supported. Arabic is the default unless `DEFAULT_LANGUAGE=en` is set.

CORS only grants browser access to origins in `CORS_ORIGINS` (or `FRONTEND_URL`). In production, configure a MongoDB URI, distinct `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values of at least 32 characters, and the correct frontend origin. Set `TRUST_PROXY_HOPS` only to the exact number of trusted reverse proxies in front of the server. The API also applies Helmet headers, request-size limits, validation schemas, per-route/global rate limits, secure refresh-token cookies, and generic production 5xx responses.

When `NODE_ENV=production`, startup validation requires `DB_URI`, both JWT secrets, distinct secret values, and `CORS_ORIGINS` or `FRONTEND_URL`. Wildcard CORS origins are rejected. If the app runs behind a reverse proxy, set `TRUST_PROXY_HOPS` to the number of trusted proxy hops so client IP handling and rate limiting work correctly.

## API conventions

- API routes use the `/api` prefix. Send JSON request bodies with `Content-Type: application/json`; project image uploads use `multipart/form-data`.
- Protected routes use `Authorization: Bearer <access-token>`. Access tokens are short-lived; the refresh endpoint rotates the refresh token.
- List endpoints that support pagination accept `page` and `limit`. Responses include pagination metadata such as `total`, `limit`, `skip`, and `hasMore` under `meta`.
- List endpoints may also accept `search`, `sort`, and resource-specific filters as documented below. Sort fields may be prefixed with `-` for descending order; comma-separated fields are supported by the shared query helper.
- Responses use `success` plus `data`; failures use `success: false`, `statusCode`, and a localized `message`. Validation failures may also include an `errors` array.
- Select response language per request with `X-Language: ar|en`, `X-Locale: ar|en`, or `Accept-Language`. The explicit headers take precedence; otherwise the server uses `DEFAULT_LANGUAGE`.

The general API rate limit is 100 requests per IP per 15 minutes. Authentication limits are 5 signup attempts per hour, and 10 login or OTP actions per IP per 15 minutes. Contact form submissions are limited to five per IP every 15 minutes.

## Settings API

Website settings use a single global document for site name, default language, registration availability, contact information, branding, social links, and SEO metadata. Public clients can read safe settings; admin access is required for changes.

| Method   | Path                  | Access                                          |
| -------- | --------------------- | ----------------------------------------------- |
| `GET`    | `/api/settings`       | Public settings                                 |
| `GET`    | `/api/settings/admin` | Admin settings list                             |
| `POST`   | `/api/settings`       | Admin; create the global settings document once |
| `GET`    | `/api/settings/:id`   | Admin                                           |
| `PATCH`  | `/api/settings/:id`   | Admin                                           |
| `DELETE` | `/api/settings/:id`   | Admin; the global settings document cannot be deleted |

The create endpoint can create the global document only once. The public endpoint omits administrative fields such as `allowRegistration` and `updatedBy`.

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

The access token is returned in the JSON response. The refresh token is stored as a hash in MongoDB and sent to browsers in an HttpOnly cookie. Configure `SMTP_*` values to deliver verification and password-reset emails; the HTML email templates are in English. Registration requires `firstName`, `lastName`, `email`, `phone`, and `password` (8-72 characters/bytes). OTP codes expire after 10 minutes. Signup is limited to five attempts per IP per hour; login and OTP actions are limited to 10 requests per IP every 15 minutes. For password recovery, call `/forgot-password`, verify the returned email OTP using `/verify-otp` with `purpose: "forgot_password"`, then submit its `resetToken` and matching `password`/`confirmPassword` to `/reset-password`.

## User API

All user routes require an access token. Profile routes are scoped to the signed-in user; listing, reading by ID, changing roles/status, and deleting users require the `admin` role.

| Method   | Path                     | Access                                                   |
| -------- | ------------------------ | -------------------------------------------------------- |
| `GET`    | `/api/users/me`          | Signed-in user                                           |
| `PATCH`  | `/api/users/me`          | Signed-in user; update name or phone                     |
| `PATCH`  | `/api/users/me/password` | Signed-in user; change own password                      |
| `GET`    | `/api/users`             | Admin; paginated/searchable list excluding current admin |
| `GET`    | `/api/users/:id`         | Admin                                                    |
| `PATCH`  | `/api/users/:id/role`    | Admin; update role or active status                      |
| `PATCH`  | `/api/users/:id`         | Signed-in user; own profile only                         |
| `DELETE` | `/api/users/:id`         | Admin; cannot delete current admin                       |

New accounts receive the `user` role. There is no public admin-bootstrap endpoint: after verifying the first account, assign it the `admin` role directly in MongoDB, then use that account to manage other users and site content.

## Categories API

Category reads are public. Creating, updating, and deleting categories require an authenticated admin. Projects store a required `category` ObjectId referencing `Category`; category responses populate a summary of linked projects. A category cannot be deleted while projects reference it.

| Method   | Path                  | Access                                           |
| -------- | --------------------- | ------------------------------------------------ |
| `GET`    | `/api/categories`     | Public, searchable and paginated                 |
| `GET`    | `/api/categories/:id` | Public; accepts ID or slug                       |
| `POST`   | `/api/categories`     | Admin                                            |
| `PATCH`  | `/api/categories/:id` | Admin                                            |
| `DELETE` | `/api/categories/:id` | Admin; returns conflict when projects are linked |

Categories have `name`, generated unique `slug`, `description`, and `isActive` fields.

## Projects API

Published projects are publicly readable and support `search`, `category`, `page`, `limit`, and `sort` query parameters. Drafts and project mutations require an authenticated admin. Project create/update requests use `multipart/form-data`: upload one `image` cover and up to 12 `gallery` images. Images must be JPEG, PNG, WebP, or GIF and are served from `/uploads`. Gallery files replace the existing gallery on update; send `clearGallery=true` to clear it without uploading new gallery images. `features` and `technologies` accept JSON arrays or comma-separated values.

| Method   | Path                      | Access                                                   |
| -------- | ------------------------- | -------------------------------------------------------- |
| `GET`    | `/api/projects`           | Public; published projects with search/filter/pagination |
| `GET`    | `/api/projects/:id`       | Public; accepts project ID or slug                       |
| `GET`    | `/api/projects/admin`     | Admin; includes drafts and supports status filtering     |
| `GET`    | `/api/projects/admin/:id` | Admin; project by ID or slug                             |
| `POST`   | `/api/projects`           | Admin; create project with cover image                   |
| `PATCH`  | `/api/projects/:id`       | Admin; update fields and/or replace images               |
| `DELETE` | `/api/projects/:id`       | Admin; deletes associated local image files              |

Projects store their category as an ObjectId reference. A category cannot be deleted while projects remain assigned to it. Project image uploads are limited to 5 MB per file; each request supports one cover image and up to 12 gallery images. The server checks both the declared image type and file signature. Uploaded files are stored locally under `src/uploads` and served from `/uploads`; use persistent storage or external object storage when deploying to an environment with ephemeral filesystems.

## Reviews API

Reviews reference both a user and a project. A signed-in user can submit one review per published project and manage their own review. Public reads return approved reviews only; admin routes can list all moderation states and approve or reject reviews. Editing a review as its author sends it back to `pending` moderation.

| Method   | Path                      | Access                                                              |
| -------- | ------------------------- | ------------------------------------------------------------------- |
| `GET`    | `/api/reviews`            | Public; approved reviews with project/rating filters and pagination |
| `GET`    | `/api/reviews/:id`        | Public; approved review only                                        |
| `POST`   | `/api/reviews`            | Signed-in user; one review per published project                    |
| `GET`    | `/api/reviews/me`         | Signed-in user; own reviews                                         |
| `PATCH`  | `/api/reviews/:id`        | Author or admin; author edits return to pending                     |
| `DELETE` | `/api/reviews/:id`        | Author or admin                                                     |
| `GET`    | `/api/reviews/admin`      | Admin; includes all statuses and supports filters                   |
| `GET`    | `/api/reviews/admin/:id`  | Admin                                                               |
| `PATCH`  | `/api/reviews/:id/status` | Admin; approve or reject                                            |

Review fields are `project`, `rating` (1-5), optional `title`, `comment`, and moderation `status` (`pending`, `approved`, or `rejected`).

## Messages API

`POST /api/messages` publicly accepts contact form submissions and is limited to five requests per IP every 15 minutes. A valid message is stored even if email notification delivery fails; admins can see `notificationStatus` as `sent` or `failed`. Listing, reading, updating status, and deleting messages require an admin access token.

| Method   | Path                | Access                                                       |
| -------- | ------------------- | ------------------------------------------------------------ |
| `POST`   | `/api/messages`     | Public, rate-limited                                         |
| `GET`    | `/api/messages`     | Admin; searchable, filterable, paginated                     |
| `GET`    | `/api/messages/:id` | Admin                                                        |
| `PATCH`  | `/api/messages/:id` | Admin; set status to `new`, `read`, `replied`, or `archived` |
| `DELETE` | `/api/messages/:id` | Admin                                                        |

Contact payload fields are `fullName`, `email`, `message`, and optional `phone`, `projectType`, and `subject`. Notifications use `CONTACT_EMAIL` or fall back to `SMTP_USER`.

## Website Content API

Website content is stored as one validated document per page. Admins can create, list, update, publish/unpublish, and delete the `home`, `about`, `services`, and `contact` documents. Public reads return published page content only. Content schemas cover hero copy/actions/images, section headings and descriptions, cards/lists, process steps, calls to action, contact channels, and contact form fields/options.

| Method   | Path                       | Access                                                                |
| -------- | -------------------------- | --------------------------------------------------------------------- |
| `GET`    | `/api/content/pages/:page` | Public; published page content                                        |
| `GET`    | `/api/content/admin`       | Admin; paginated page list, optional `pageType`/`isPublished` filters |
| `GET`    | `/api/content/admin/:id`   | Admin                                                                 |
| `POST`   | `/api/content`             | Admin; create one page document                                       |
| `PATCH`  | `/api/content/:id`         | Admin; replace validated page content and/or publication status       |
| `DELETE` | `/api/content/:id`         | Admin                                                                 |

Creation uses `{ "page": "home|about|services|contact", "content": { ... } }`. Each page's `content` is validated against its own strict schema. No default content is seeded; create each page document before expecting its public endpoint to return content.

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
