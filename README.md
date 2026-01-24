# 🎫 Support Ticket Desk

A full-stack **Support Ticket Management System** where users can raise support tickets and admins can manage, track, and resolve them using a structured workflow.

---

## 🚀 Features

### User Features
- User registration & login
- Create support tickets
- View own tickets
- Add comments to tickets
- Upload attachments

### Admin Features
- View all tickets
- Filter & search tickets
- Update ticket status (Open → In Progress → Resolved → Closed)
- Pagination on all tickets page

## 🔐 Admin Access

This application supports a single admin user.

- The admin account is **pre-created and stored in the database**
- Admin credentials are **not exposed in the codebase**
- Admin login is handled using the same authentication flow as regular users
- Admin role is identified using the `role: "admin"` field in the database

> Note: Admin credentials can be updated directly in the database if required.
### Admin credentials:
- email: admin@gmail.com
- password: admin123

## 🛠️ Tech Stack

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (HTTP-only cookies)
- Multer + Cloudinary
- CORS

### Deployment
- Frontend: Vercel
- Backend: Render

### Postman Documentation
[Postman API Documentation](https://documenter.getpostman.com/view/33214776/2sBXVkBp6x)

### Deployed Link
[Live Deployed Link](https://support-ticket-desk-r4yt.vercel.app/)

## ⚙️ Setup Instructions

###  Clone the Repository
git clone https://github.com/Pooja184/Support_Ticket_Desk.git

### Backend setup:

- cd Backend
- npm install

### Backend .env variables
- PORT=8000
- MONGODB_URL=mongodb+srv://poojabhambid2004:awdizBackendDB@cluster0.mdlcf.mongodb.net/ticketmanagertask
- JWT_SECRET=ticketmanager
- CLOUDINARY_CLOUD_NAME=dovcqwgxw
- CLOUDINARY_API_KEY=491827943659752
- CLOUDINARY_API_SECRET=u-UquIY2LRYZVa7RJvQiFsoPGIc

### Start backend server:
npm run server

### Frontend setup:

- cd Frontend
- npm install

### Frontend .env variables
VITE_BACKEND_URL=https://support-ticket-desk-backend.onrender.com

### Start frontend 
npm run dev

