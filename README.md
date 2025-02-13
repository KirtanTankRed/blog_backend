
# BlogOpinion Backend

## Objective
Build a backend for a blog service with basic functionality, focusing on user management and blog operations.

# BlogOpinion Backend

BlogOpinion is a backend service built with Node.js, Express.js, and MongoDB, providing RESTful APIs for managing blogs, users, likes, and comments.

## Features
- User authentication (signup, login, logout)
- Blog creation, updating, deleting, and fetching
- Like and comment functionality
- Role-based access control (Admin, Blogger, Reader)

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** Session-based authentication

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/BlogOpinion-Backend.git
   cd BlogOpinion-Backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and configure the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### User Routes
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Log in a user
- `POST /api/users/logout` - Log out a user
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user info (Admin only)
- `DELETE /api/users/:id` - Delete a user (Admin only)

### Blog Routes
- `POST /api/blogs` - Create a new blog (Blogger/Admin only)
- `GET /api/blogs` - Get all blogs with pagination
- `GET /api/blogs/:id` - Get a single blog by ID
- `PUT /api/blogs/:id` - Update a blog (Author/Admin only)
- `DELETE /api/blogs/:id` - Delete a blog (Author/Admin only)

### Like Routes
- `POST /api/blogs/:id/like` - Like or unlike a blog (Any registered user)

### Comment Routes
- `POST /api/blogs/:id/comments` - Add a comment to a blog
- `GET /api/blogs/:id/comments` - Fetch comments for a blog

## License
This project is open for review but **cannot be used, modified, or distributed without written approval from the creator.** Unauthorized usage is strictly prohibited.

## Author
- **Creator:** Kirtan Tank
- **Contact:** kirtan.tank@redsoftware.in
