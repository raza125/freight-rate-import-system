Freight Rate Import System

This is a full-stack application to import messy freight rate files (CSV/XLSX), map arbitrary columns to standard system fields, and store them in a PostgreSQL database. The UI is built with React + Tailwind CSS. The backend is a simple Express.js server using the `pg` library to interface with PostgreSQL.


---

1. Clone the Repo

```bash
git clone https://github.com/yourusername/freight-rate-import-system.git
cd freight-rate-import-system
```

2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

Database Setup (PostgreSQL)

This project uses PostgreSQL as the backend database. The table required for the freight rate import system must be created before starting the backend.

Step 1: Ensure PostgreSQL is installed and running

By default, the app connects using:

User: postgres
Password: 1234
Database: postgres
Port: 5432

Update `backend/db.js` if your local credentials differ.

---

Step 2: Apply the Schema

To create the required table (`freight_rates`), run:

```bash
cd backend
npm run setup-db
```

This command:

* Loads the SQL from `backend/database/schema.sql`
* Connects to your PostgreSQL instance
* Creates the table if it doesn't already exist

You only need to run this once unless you reset the database or update the schema.

---

Schema File Reference

 `backend/database/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS freight_rates (
  id SERIAL PRIMARY KEY,
  shipment_id TEXT UNIQUE,
  origin_country TEXT,
  destination_country TEXT,
  shipper_name TEXT,
  agent_name TEXT,
  proof_of_delivery TEXT,
  container_20gp NUMERIC,
  container_40gp NUMERIC,
  shipment_datetime TIMESTAMP
);

---

Running the App

Backend (Port 3001)

```bash
cd backend
npm start
```

Frontend (Port 5173)

```bash
cd frontend
npm run dev
```