# Penta Financial Analytics Dashboard

A full-stack financial analytics application built for the assignment brief. It provides JWT-cookie authentication, a responsive dashboard, transaction search/filtering/sorting with pagination, revenue-versus-expense trends, and configurable CSV exports.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, React Router
- Backend: Express, TypeScript, MongoDB/Mongoose, JWT, bcrypt, Zod, json2csv

## Features

- Sign up, sign in, sign out, and cookie-based JWT authentication
- Protected dashboard and transaction API routes
- Auth context that loads the signed-in user from `/api/auth/me`
- Financial summary cards and a monthly revenue/expense chart
- Paginated transaction table with 10 transactions per page
- Search by user name, username, ID, category, or status
- Category/status filters and sortable transaction columns
- Configurable browser CSV downloads
- Backend health checks plus offline and 404 pages
- User name/avatar enrichment with a default avatar fallback

## Project structure

```text
Loopr/
├── Frontend/                 # React application
│   ├── src/components/       # Dashboard, chart, table, sidebar, CSV modal
│   ├── src/context/          # Auth context
│   ├── src/pages/            # Sign in, sign up, dashboard, error pages
│   └── .env
├── backend/                  # Express API
│   ├── src/controllers/
│   ├── src/middleware/
│   ├── src/models/
│   ├── src/routes/
│   └── .env
└── readme.md
```

## Prerequisites

- Node.js 20 or later
- npm
- MongoDB running locally, or a MongoDB connection string

## Setup

### Start the full application

After installing dependencies and configuring both environment files below, start the frontend and backend together from the project root:

```bash
npm install
npm run dev
```

This runs the Vite frontend and Express backend concurrently. Open `http://localhost:5173` in your browser.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/Penta
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Start the API:

```bash
npm run start
```

The API runs at `http://localhost:3000`.

### Frontend

In a separate terminal:

```bash
cd Frontend
npm install
```

Create or update `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000/api/auth
VITE_API_URL=http://localhost:3000/api
```

Start Vite:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| Root | `npm run dev` | Start frontend and backend together |
| Root | `npm run start:frontend` | Start only the frontend development server |
| Root | `npm run start:backend` | Build and start only the backend server |
| `backend` | `npm run build` | Type-check and compile backend files to `dist` |
| `backend` | `npm run start` | Build and start the API server |
| `Frontend` | `npm run dev` | Start the Vite development server |
| `Frontend` | `npm run build` | Type-check and create the production frontend bundle |
| `Frontend` | `npm run lint` | Run ESLint |

## API reference

Protected routes require the `pact_token` HTTP-only cookie created during sign-in or sign-up. Browser requests must send credentials.

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/ping` | Checks whether the backend is reachable |
| GET | `/api/checkbackend` | Alias for the health check |

### Authentication

| Method | Endpoint | Body / Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | `{ name, username, email, password }` — creates an account and session cookie |
| POST | `/api/auth/signin` | `{ email, password }` or `{ username, password }` — creates a session cookie |
| POST | `/api/auth/signout` | Clears the session cookie |
| GET | `/api/auth/me` | Returns the authenticated user without password |

Sign-up returns field-specific validation messages. Existing emails or usernames return HTTP `409` with a clear message.

### Transactions

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/transactions` | Paginated, filtered, searched, and sorted transactions |
| GET | `/api/transactions/:id` | A transaction by numeric transaction ID |
| GET | `/api/transactions/analytics` | Revenue, expenses, balance, category totals, and monthly trends |
| GET | `/api/transactions/export` | Downloads a configured CSV report |

`GET /api/transactions` query parameters:

| Parameter | Example | Description |
| --- | --- | --- |
| `page` | `1` | Page number, starting at 1 |
| `limit` | `10` | Records per page |
| `search` | `tom` | Matches user name, username, user ID, category, or status |
| `category` | `Revenue` | `Revenue` or `Expense` |
| `status` | `Paid` | `Paid` or `Pending` |
| `startDate`, `endDate` | `2024-01-01` | Inclusive date range |
| `minAmount`, `maxAmount` | `1000` | Amount range |
| `sortBy` | `date` | `date`, `amount`, `id`, `category`, `status`, or `user_id` |
| `sortOrder` | `desc` | `asc` or `desc`; default is newest first |

CSV exports accept a comma-separated `columns` parameter. Supported fields are `id`, `date`, `amount`, `category`, `status`, `user_id`, and `user_profile`.

Example:

```text
GET /api/transactions/export?columns=id,date,amount,category,status
```

## Transaction data

The MongoDB `Transaction` collection expects data in this shape:

```json
{
  "id": 1,
  "date": "2024-12-10T00:00:00.000Z",
  "amount": 1100,
  "category": "Expense",
  "status": "Pending",
  "user_id": "user_001",
  "user_profile": ""
}
```

`user_id` should correspond to `User.userId`. The transaction response is enriched with `user_name` and `avtar`. If the avatar is empty or invalid, the frontend uses `Frontend/src/assets/defaultAvtar.svg`.

## Notes

- Restart Vite after changing `Frontend/.env`.
- Restart the backend after changing `backend/.env`.
- MongoDB must be running for authentication, transactions, and analytics. `/api/ping` verifies API reachability only.
