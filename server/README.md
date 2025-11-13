# Server

Express + Mongoose server for the Quiz Management MVP.

Quick start

1. cd server
2. npm install
3. Create a `.env` with `MONGO_URI` if you want DB connectivity.
4. npm start

Endpoints

- GET /api/health
- GET /api/quizzes
- POST /api/quizzes
- GET /api/quizzes/:id
- POST /api/quizzes/:id/attempt

Admin notes

- Protected admin endpoint: `POST /api/quizzes` requires header `x-admin-password` to match the `ADMIN_PASSWORD` environment variable (default: `adminpass`).

Seeding

Run the seed script to insert a demo published quiz (requires `MONGO_URI`):

```
node seed.js
```
