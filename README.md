# 🚀 User Management System | MERN Stack

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-61dafb)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A **production-ready** User Management System built with the MERN stack featuring **Role-Based Access Control (RBAC)**, JWT authentication, and a premium dark-themed UI.

## ✨ Live Demo

- **Frontend:** [https://user-management-system.vercel.app](https://user-management-system.vercel.app)
- **Backend API:** [https://user-management-api.onrender.com](https://user-management-api.onrender.com)

> ⚠️ Replace with your actual deployed URLs after deployment

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Demo Credentials](#-demo-credentials)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Assessment Requirements](#-assessment-requirements)
- [Author](#-author)

## 🎯 Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Manager/User)
- Protected routes and API endpoints
- Persistent login state

### 👥 User Management
- **Admin**: Full CRUD operations on all users
- **Manager**: View and edit non-admin users
- **User**: Manage only their own profile
- Soft delete (deactivate/reactivate users)
- Search users by name/email
- Filter by role (Admin/Manager/User)
- Filter by status (Active/Inactive)
- Pagination for user list

### 📊 Audit & Activity
- Track `createdAt` and `updatedAt` timestamps
- Track `createdBy` and `updatedBy` user references
- Display audit information in dashboard

### 🎨 UI/UX
- Premium dark theme with glass morphism
- Fully responsive design (Mobile/Tablet/Desktop)
- Toast notifications for actions
- Loading states and error handling
- Login/Register toggle
- Show/Hide password functionality
- One-click demo credentials autofill

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| Context API | State management |
| Axios | HTTP client |
| React Router DOM | Routing |

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| 👑 **Admin** | admin@example.com | admin123 | Full access (create/edit/delete all users) |
| 📊 **Manager** | manager@example.com | manager123 | View users, edit non-admin users |
| 👤 **User** | user@example.com | user123 | Manage own profile only |

> 💡 **Tip:** Click on the credential cards on the login page to autofill!

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/user-management-system.git
cd user-management-system
