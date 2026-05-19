# Expense Tracker

A full-stack expense tracking app built with the MERN stack. Track income and
expenses, categorize transactions, and visualize spending patterns.

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Auth:** JWT via HTTP-only cookies

## Getting started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. Clone the repo
```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
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

5. Start the development server
```bash
   npm run dev
```

Backend runs at `http://localhost:3000`

### Frontend setup
```bash
   cd client
   npm install
   npm run dev
```

Frontend runs at `http://localhost:5173`

## Project status

Currently in active development. See [Issues](https://github.com/Aswin-22/Expense_Tracker/issues) for the current backlog.