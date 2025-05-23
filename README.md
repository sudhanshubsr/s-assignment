# Assignment

This project consists of a full-stack application with a Node.js/Express backend and a Next.js frontend.

## Project Structure

```
company-assignment/
├── backend/             # Node.js Express backend
│   ├── controllers/     # API controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── Dockerfile       # Docker configuration for backend
│   └── server.js        # Main server file
└── frontend/            # Next.js frontend application
    ├── app/             # Next.js app directory
    ├── components/      # Reusable UI components
    ├── lib/             # Utility functions
    ├── public/          # Static assets
    ├── Dockerfile       # Docker configuration for frontend
    └── next.config.ts   # Next.js configuration
```

## Backend

The backend is built with Express.js and uses MongoDB for data storage.

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Express Validator for request validation
- CORS for cross-origin requests

### Setup and Installation

#### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or connection string)

#### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/suzuki-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

#### Running with Docker

1. Build the Docker image:

   ```bash
   docker build -t company-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 -e MONGODB_URI=your_mongodb_uri company-backend
   ```

### API Endpoints

| Method | Endpoint   | Description       |
| ------ | ---------- | ----------------- |
| GET    | /users     | Get all users     |
| GET    | /users/:id | Get user by ID    |
| POST   | /users     | Create a new user |
| PUT    | /users/:id | Update user by ID |
| DELETE | /users/:id | Delete user by ID |

## Frontend

The frontend is built with Next.js and uses modern React patterns.

### Technologies Used

- Next.js 15.3.2
- React 19
- Tailwind CSS
- Axios for API requests
- React Hook Form for form handling

### Setup and Installation

#### Prerequisites

- Node.js (v16 or higher)

#### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Start the production server:
   ```bash
   npm start
   ```

#### Running with Docker

1. Build the Docker image:

   ```bash
   docker build -t company-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000/ company-frontend
   ```
