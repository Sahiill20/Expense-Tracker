# Production-Grade Expense Tracker

A robust, full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js). 

This project prioritizes **data integrity**, **idempotency**, and **production-readiness** over a wide feature set, designed to handle real-world conditions like unreliable networks and precise financial calculations.

## 🚀 Live Demo
- **Frontend:** [Link to your Vercel App]
- **Backend:** [Link to your Render API]

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (Atlas)
- **Tooling:** UUID (for idempotency), Dotenv

## 💎 Key Design Decisions

### 1. Idempotency & Network Reliability
To satisfy the requirement of handling "unreliable networks" and "double submits":
- The frontend generates a unique `idempotencyKey` (UUID) for every new form session.
- The backend enforces a `unique` constraint on this key.
- **Scenario:** If a user clicks "Submit" twice, or if the network retries a request, the backend detects the duplicate key. Instead of creating a duplicate charge, it returns the existing record with a `200 OK` status. This ensures the user is never charged twice for the same transaction.

### 2. Money Handling (Integer Math)
- **Decision:** I chose NOT to use floating-point numbers for money (e.g., `10.55`) to avoid IEEE 754 precision errors (e.g., `0.1 + 0.2 = 0.300000004`).
- **Implementation:** - Frontend sends standard amounts (e.g., `10.50`).
  - Backend transforms this into **minor currency units** (Paise/Cents) before storage (e.g., `1050`).
  - Data is converted back to human-readable format only when sending the JSON response.

### 3. Server-Side Architecture
- **Validation:** Inputs are validated on both the Frontend (UX) and Backend (Security). Negative amounts are strictly blocked.
- **Filtering & Sorting:** Performed at the database level (MongoDB `find` and `sort`) rather than in memory, ensuring scalability as the dataset grows.

## ⚖️ Trade-offs & Future Improvements
Due to the 4-hour time constraint, I prioritized depth in the core API over breadth of features:
- **Authentication:** Skipped to focus on the core transactional logic. Currently, the app is single-tenant.
- **Pagination:** The list loads all expenses. In a real production environment, I would implement cursor-based pagination.
- **Testing:** Added a basic integration test suite but did not aim for 100% coverage.

## 🏃‍♂️ How to Run Locally

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
