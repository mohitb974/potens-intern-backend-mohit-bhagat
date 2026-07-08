# Potens Backend Internship Assignment - Mohit Bhagat

## Overview

This project implements a tamper-evident logging service using Node.js, Express, Prisma, and SQLite.

Features:

- Append-only log creation
- SHA-256 hash chaining
- Log integrity verification
- API key authentication
- Rate limiting
- Structured logging using Pino
- Export logs by actor

---

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite
- Pino
- Express Rate Limit

---

## Installation

```bash
npm install
```

---

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

## Run Server

```bash
node src/server.js
```

Server runs on:

```text
http://localhost:3000
```

---

## API Endpoints

### Create Log

POST /log

Headers:

```text
x-api-key: potens-secret-key
```

Body:

```json
{
  "actor": "Mohit",
  "action": "Login",
  "payload": {
    "ip": "127.0.0.1"
  }
}
```

---

### Get Log

GET /log/:id

Example:

```text
GET /log/1
```

---

### Verify Entire Chain

```text
GET /log/verify/all
```

---

### Export Logs By Actor

```text
GET /log/export?actor=Mohit
```

---

## Design Decisions

- SQLite chosen for simplicity and portability.
- SHA-256 used for tamper-evident hash generation.
- Each log stores previousHash and currentHash to create a chain.
- API key middleware provides basic access control.
- Pino used for structured request logging.
- Rate limiting protects log creation endpoint.

---

## Known Limitations

- API key is hardcoded.
- SQLite is not suitable for high-scale production workloads.
- Export endpoint currently returns JSON only.

---

## Future Improvements

- JWT authentication
- PostgreSQL support
- CSV export
- Pagination
- Role-based access control
- Docker deployment

---

## AI Use Log

### ChatGPT

Approximate Usage:
- 100+ messages

Used For:
- Prisma setup troubleshooting
- Hash chain design guidance
- Express route implementation
- Git/GitHub troubleshooting
- README drafting assistance