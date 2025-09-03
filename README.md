# University Course Management System

A full-stack application built with Spring Boot and React to manage course offerings, student registrations, and results.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot 3.x + Java 17
- Database: MySQL 8
- Infrastructure: Docker

## Local Development

### Prerequisites

- Docker Desktop
- Node.js 20+
- Java 17
- Maven

### Running Locally

1. Clone the repository

```bash
git clone <repository-url>
```

2. Update `.env` file in root directory if needed:

```env
MYSQL_PORT=3308
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=university_db
MYSQL_USER=dbuser
MYSQL_USER_PASSWORD=userpassword
SPRING_APP_PORT=8081
VITE_REACT_APP_API_BASE_URL=http://localhost:8081/api
```

3. Start all services:

```bash
docker-compose up --build
```

Access the applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8081/api
- MySQL: localhost:3308

Default Admin Credentials:
```
Username: admin
Password: adminadmin
```

## Deployment to Render

### Database Setup (Aiven MySQL)

1. Create free account at [Aiven](https://aiven.io)
2. Create MySQL service
3. From service details, copy:
   - Host
   - Port
   - Database name
   - Username
   - Password
4. Construct MySQL URI:
   ```
   jdbc:mysql://<host>:<port>/<database-name>
   ```

### Backend Deployment

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set Root Directory to ./backend
4. Select "Docker" as runtime
5. Add Environment Variables:
   ```
   MYSQL_DATABASE=<aiven-database-name>
   MYSQL_USER=<aiven-username>
   MYSQL_USER_PASSWORD=<aiven-password>
   MYSQL_URI=<constructed-mysql-uri>
   ```

### Frontend Deployment

1. Create new Static Site on Render
2. Connect GitHub repository
3. Set Root Directory to ./frontend
4. Select "Docker" as runtime
5. Add Environment Variable:
   ```
   VITE_REACT_APP_API_BASE_URL=https://<your-backend-url>.onrender.com/api
   ```

Render will automatically:

- Detect Dockerfiles in both services
- Build and run the containers
- Handle SSL certificates

## API Documentation

- Admin Routes: `/api/admin/*`
- Student Routes: `/api/students/*`

## Features

- User Authentication (JWT)
- Course Management
- Student Management and Offer Courses
- Result Management
- Responsive UI
