SE2 Lab 7 — Backend API (minimal)

Quick start

1. Copy `.env.example` to `.env` and fill in database credentials.
2. Install dependencies and start the server:

```powershell
cd api
npm install
npm run start
```

3. Create the DB table (if using local MySQL):

```sql
-- from MySQL shell or a client
SOURCE create_table.sql;
```

Endpoints

- GET /health — health check
- GET /moods — return recent mood entries
- POST /moods — insert a mood entry (expects JSON: { mood_level, journal_entry })

Logging & debugging notes
- The server prints logs (morgan for requests and console.log for important events).
- To demonstrate the "Incorrect DB credentials" lab bug, set DB_PASSWORD to a wrong value in `.env` and start the server — observe the connection error in the terminal.
- To demonstrate the "Incorrect table name" bug, temporarily change the query in `server.js` from `mood_log` to `mood_logs` and re-run the failing request — the SQL error will be shown in the server logs.

Security notes
- All queries use parameterized placeholders (?) to avoid SQL injection.
- Sensitive credentials are read from environment variables (see `.env.example`).
