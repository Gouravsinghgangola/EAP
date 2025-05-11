# Excel-Analytics-Platform

## Project Overview
The Excel Analytics Platform (EAP) is a web-based application designed to provide users with a seamless experience for managing and analyzing Excel files. The platform includes user authentication, file uploads, and secure data processing. It is built with a modern tech stack to ensure scalability, performance, and ease of use.

---

## Project Flow
1. **User Registration**: Users can create an account by providing their name, email, and password.
2. **User Login**: Registered users can log in securely using their credentials.
3. **Dashboard Access**: After logging in, users can access their personalized dashboard.
4. **File Upload**: Users can upload Excel files for analysis.
5. **Data Processing**: Uploaded files are processed, and insights are generated.
6. **Results Display**: The processed data and analytics are displayed to the user in an intuitive format.

---

## Features
- **User Authentication**:
  - Secure account creation and login using JSON Web Tokens (JWT).
  - Role-based access control (e.g., admin and user roles).
- **File Upload**:
  - Support for uploading Excel files.
  - Validation for file size and format.
- **Data Processing**:
  - Analyze and process Excel files to generate insights.
- **Dashboard**:
  - Personalized dashboard for users to view and manage their data.
- **Security**:
  - Password hashing using bcrypt.
  - Secure API endpoints with JWT-based authentication.

---

## Tech Stack
### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For styling and responsive design.

### Backend
- **Express.js**: For building the RESTful API.
- **MongoDB**: For storing user and file data.
- **Mongoose**: For object data modeling (ODM) with MongoDB.

### Authentication
- **JSON Web Tokens (JWT)**: For secure user authentication.

### Additional Tools
- **Multer**: For handling file uploads.
- **Winston**: For logging server activities.
- **dotenv**: For managing environment variables.
- **Bull**: For background job processing (e.g., file processing).

---

## Setup

### Frontend
1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd client
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example` for reference).
4. Start the development server:
   ```bash
   npm run dev
   ```
