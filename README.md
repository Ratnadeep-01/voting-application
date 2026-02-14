# VOTEX Ecosystem - Digital Voting Platform

VOTEX is a modern, secure, and transparent voting platform designed to power the next generation of digital democracy. It provides a seamless experience for both voters and administrators, ensuring auditability and real-time results verification.

## 🚀 Key Features

- **Secure Voting**: Built with security at the core, ensuring every vote is encrypted and tamper-proof.
- **Instant Results**: Real-time tallying and verification of polls as votes come in.
- **Transparents Process**: Auditable logs and clear voting procedures for all participants.
- **Admin Dashboard**: Comprehensive tools for managing candidates and monitoring election status.
- **Responsive UI**: A premium, modern interface built with Framer Motion for smooth interactions.

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Modern web framework for high performance.
- **Framer Motion**: For fluid animations and rich aesthetics.
- **Lucide React**: For beautiful, consistent iconography.
- **Axios**: For seamless API communication.
- **Standard CSS**: Custom styled for a premium feel.

### Backend
- **Node.js & Express**: Scalable and fast server environment.
- **MongoDB & Mongoose**: Flexible document-based database.
- **JWT (JSON Web Tokens)**: Secure handled authentication and authorization.
- **Bcrypt**: Industry-standard password hashing.

## ⚙️ Project Structure

```bash
voting-application/
├── backend/          # Node.js & Express server
│   ├── models/       # Mongoose schemas (User, Candidate)
│   ├── routes/       # API endpoints (Auth, Candidates)
│   ├── jwt.js        # Auth middleware
│   └── server.js     # Entry point
└── frontend/         # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth states
    │   └── pages/      # View components (Home, Admin, Profile, etc.)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or local instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ratnadeep-01/voting-application.git
   cd voting-application
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🔐 Credentials (Demo)

- **Admin Access**: (Configure via `role: 'admin'` in MongoDB)
- **User Access**: Register via the Signup page using a valid 12-digit Adhar Card Number.

---

© 2026 VOTEX Ecosystem. Powering the future of decisions.
