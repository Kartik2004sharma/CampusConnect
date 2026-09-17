# CampusConnect — Where Every Concern Finds a Resolution

CampusConnect is a premium, full-stack campus management platform that helps students report issues digitally, track their resolution in real time, and gives staff and administrators the tools to prioritize, assign, escalate, and resolve complaints efficiently. 

Built with a highly responsive **Next.js App Router** frontend and a robust **Express.js** backend, CampusConnect is designed to scale across any enterprise or educational institution.

---

## ✨ What CampusConnect Does

- **Role-Based Access Control (RBAC):** Distinct dashboards and routing for Students, Staff, and Administrators using JWT + bcrypt security.
- **Smart Complaint Pipeline:** Submit complaints with titles, descriptions, categories, exact locations, priorities, and image attachments.
- **AI-Assisted Classification:** NLP engine automatically reads complaint text, detects urgency, assigns categories (electrical, plumbing, IT, security), and suggests priority levels using OpenAI.
- **Automated Assignment:** Intelligently matches complaints to the right department and the least-loaded staff member.
- **SLA Enforcement & Escalation:** Auto-escalates tickets that stay unresolved past their SLA deadlines and alerts admins.
- **Real-Time Analytics:** Live dashboards for admins featuring category trends, peak submission hours, and department performance metrics.
- **Real-Time Push Notifications:** Powered by Firebase and Socket.io to keep students updated the second their ticket status changes.
- **Transactional Emails:** Instant email alerts powered by the Resend SDK.
- **Premium UI/UX:** Built with Tailwind CSS v4, featuring a modern, brutalist SaaS aesthetic (Indigo & Slate theme) and Space Grotesk typography.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **AI / NLP** | OpenAI SDK, Natural |
| **Real-time** | Socket.IO, Firebase |
| **Media Storage** | Cloudinary, Multer |
| **Email Services** | Resend API |

## 🏗️ Architecture & Project Structure

CampusConnect is structured as a monorepo containing a Next.js frontend and an Express backend:

```text
CAMPUSCONNECT/
├── client/                     # Next.js 15 Frontend (App Router)
│   ├── src/
│   │   ├── app/                # App Router (Pages, Layouts, Routing Groups)
│   │   ├── components/         # Reusable UI Components & Icons
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── layouts/            # Dashboard AppShell & Sidebars
│   │   ├── api/                # Axios API instances
│   │   └── firebase.js         # Firebase Client Initialization
│   ├── public/                 # Static assets (Logos, Favicons)
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── controllers/            # Route business logic
│   ├── models/                 # Mongoose Data Models
│   ├── routes/                 # Express API Routes
│   ├── middleware/             # Auth guards & Validation
│   ├── utils/                  # Resend, Cloudinary, JWT helpers
│   ├── .env                    # Secrets & API Keys
│   └── server.js               # Express entry point
│
└── README.md
```

## 📋 Prerequisites

Before running CampusConnect locally, you will need:
- **Node.js** (v18 or higher)
- **MongoDB Atlas** URI (or a local MongoDB instance)
- **Resend API Key** (for emails)
- **Cloudinary Credentials** (for image uploads)
- **OpenAI API Key** (for AI auto-classification)
- **Firebase Project Config** (for push notifications)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Kartik2004sharma/CAMPUSCONNECT.git
cd CAMPUSCONNECT
```

### 2. Start the Backend (Express)

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure your keys:
```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster...
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Resend API
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@campusconnect.edu

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

Start the backend development server:
```bash
npm run dev
```
*The backend runs on http://localhost:5001*

### 3. Start the Frontend (Next.js)

Open a new terminal window:
```bash
cd client
npm install --legacy-peer-deps
```

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Firebase Config (Optional for local dev)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Start the Next.js development server:
```bash
npm run dev
```
*The frontend runs on http://localhost:3000*

## 🔐 Security Highlights

CampusConnect enforces strict security measures out of the box:
- **Stateless JWT Auth:** Tokens are signed and verified on every protected request.
- **Password Hashing:** Passwords are never stored in plaintext (bcrypt).
- **Role-Based Guards:** API endpoints strictly verify the user's role (`student`, `staff`, `admin`) before executing operations.
- **Next.js Server Components:** Environment variables (`NEXT_PUBLIC_`) are heavily segregated to prevent exposing secrets to the client browser.

## 🚢 Deployment Guide

### Deploying the Frontend (Vercel)
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Set the **Framework Preset** to `Next.js`.
4. Set the **Root Directory** to `client`.
5. Add the Environment Variables from your `client/.env.local` file.
6. Click Deploy.

### Deploying the Backend (Render / Railway)
Because the backend relies heavily on WebSockets (`socket.io`), it should be deployed to a persistent server environment (like Render, Railway, or DigitalOcean) rather than a serverless environment like Vercel.
1. Connect your GitHub repository to Render/Railway.
2. Set the Root Directory to `server`.
3. Set the build command to `npm install` and start command to `npm start` (or `node server.js`).
4. Add the Environment Variables from your `server/.env` file.

## 📄 License

This project is licensed under the MIT License.

---
<p align="center">
  Built as <strong>CampusConnect</strong> — a smarter way to report, route, and resolve campus issues.
</p>
