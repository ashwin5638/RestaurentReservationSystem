# Restaurant Reservation Management System

A full-stack Restaurant Reservation Management System built with **React, Node.js, Express.js, and MongoDB**. The application enables customers to reserve restaurant tables while providing administrators with tools to manage reservations and tables through secure role-based access.

---

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based access control (Customer & Admin)
* Secure password hashing with bcrypt

### Customer Features

* Create table reservations
* View personal reservations
* Cancel reservations
* Automatic table assignment based on guest capacity

### Admin Features

* View all reservations
* Filter reservations by date
* Update reservation details
* Cancel any reservation
* Manage restaurant tables

### Reservation Management

* Prevents double booking of tables
* Checks table availability for selected date and time
* Validates guest capacity before assigning tables
* Displays meaningful validation and error messages

---

## Tech Stack

### Frontend

* React
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js

---

## Project Structure

```text
restaurant-reservation-system/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── seed/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/ashwin5638/RestaurentReservationSystem.git
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

---

## Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Reservations

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/api/reservations`     | Create reservation        |
| GET    | `/api/reservations/my`  | Get customer reservations |
| DELETE | `/api/reservations/:id` | Cancel reservation        |

### Admin

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/reservations`            | View all reservations       |
| GET    | `/api/reservations/date/:date` | Filter reservations by date |
| PUT    | `/api/reservations/:id`        | Update reservation          |
| DELETE | `/api/reservations/:id`        | Cancel any reservation      |

### Tables

| Method | Endpoint          | Description  |
| ------ | ----------------- | ------------ |
| GET    | `/api/tables`     | View tables  |
| POST   | `/api/tables`     | Add table    |
| PUT    | `/api/tables/:id` | Update table |
| DELETE | `/api/tables/:id` | Delete table |

---

## Future Improvements

* Email confirmation for reservations
* Reservation reminders
* Restaurant operating hours
* Multiple restaurant support
* Online payment integration
* Reservation analytics dashboard

---

## Author

**Ashwin**

GitHub: https://github.com/ashwin5638
