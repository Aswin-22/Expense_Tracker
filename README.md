# Expense Tracker

A full-stack expense tracking app built with the MERN stack. Track income and expenses, categorize transactions, and visualize spending patterns.

**Live demo:** https://expense-tracker-ten-jet-39.vercel.app

## Tech stack

- **Frontend:** React, Vite, Redux Toolkit
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Auth:** JWT via HTTP-only cookies
- **Charts:** Recharts

## Features

- Register and login with secure JWT authentication
- Add, view, and delete income and expense transactions
- Assign categories to transactions
- Filter transactions by type and date range
- Dashboard with financial summary and recent transactions
- Reports page with monthly income vs expense chart and top transactions
- Category management — create, rename, and delete categories

## Getting started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. Clone the repo
```bash
git clone https://github.com/Aswin-22/Expense_Tracker.git
cd Expense_Tracker
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Open .env and fill in your values
```

4. Seed default categories
```bash
npm run seed
```

5. Start the backend
```bash
npm run dev
```

Backend runs at `http://localhost:3000`

6. Install frontend dependencies and start
```bash
cd ../client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Project structure

```
expense-tracker/
├── server/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth and error middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── scripts/        # Seed scripts
│   └── utils/          # Token generation
└── client/
    ├── src/
    │   ├── components/ # React components and pages
    │   ├── redux/      # Redux slices and store
    │   ├── styles/     # CSS variables
    │   └── utils/      # Date helpers
```

## Environment variables

See `server/.env.example` for all required variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default 3000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL (for CORS in production) |

## Known limitations

- Category breakdown chart requires transactions with assigned categories
- No edit transaction support yet — delete and re-add as a workaround
- Free tier on Render may have cold start delay of ~30 seconds

## License

MIT