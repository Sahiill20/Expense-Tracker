# Expense Tracker

A tracking application built with the MERN stack (MongoDB, Express, React, Node.js). 

This project prioritizes **data integrity**, **idempotency**, and **production-readiness** over a wide feature set, designed to handle real-world conditions like unreliable networks and precise financial calculations.

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB 

## 💎 Key Design Decisions

### 1. Idempotency & Network Reliability
To satisfy the requirement of handling "unreliable networks" and "double submits":
- The frontend generates a unique `idempotencyKey` (UUID) for every new form session.
- The backend enforces a `unique` constraint on this key.

### 2. Money Handling (Integer Math)
- **Decision:** I chose NOT to use floating-point numbers for money (e.g., `10.55`) to avoid IEEE 754 precision errors (e.g., `0.1 + 0.2 = 0.300000004`).
- **Implementation:** - Frontend sends standard amounts (e.g., `10.50`).
  - Backend transforms this into **minor currency units** (Paise) before storage (e.g., `1050`).
  - Data is converted back to human-readable format only when sending the JSON response.

### 3. Server-Side Architecture
- **Validation:** Inputs are validated on both the Frontend (UX) and Backend (Security). Negative amounts are strictly blocked.
- **Filtering & Sorting:** Performed at the database level (MongoDB `find` and `sort`) rather than in memory, ensuring scalability as the dataset grows.

## ⚖️ Trade-offs
Due to the 4-hour time constraint, I prioritized depth in the core API over breadth of features:
- **Authentication:** Skipped to focus on the core transactional logic
- Implemented only essential functionality and avoided extra features (such as edit/delete expenses) to keep scope focused.
- Kept UI styling minimal and functional

## Why MongoDB Was Chosen

MongoDB was selected as the database for this project based on the following considerations:

- **Flexible schema:** Expense records are simple but may evolve over time (e.g., adding tags, notes, or metadata). MongoDB allows schema flexibility without requiring migrations.
- **Fast development speed:** Since this project was timeboxed, MongoDB allowed rapid iteration without designing rigid relational schemas.
- **Natural JSON structure:** The expense object maps directly to MongoDB documents, which reduces transformation logic between API and database.
- **Simple setup and deployment:** MongoDB Atlas provides a managed cloud database that integrates easily with Node.js applications.
- For this scale and scope, MongoDB provides an optimal balance of flexibility, speed of development, and sufficient consistency guarantees.

