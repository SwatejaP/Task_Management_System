# ⚡ TaskPulse — Real-Time Task & Project Management App

A production-ready full-stack application built with the **MERN** stack (**M**ongoDB Atlas, **E**xpress.js, **R**eact, **N**ode.js) featuring JWT authentication, RESTful APIs, responsive Tailwind CSS styling, and comprehensive task management.

---

## 📁 Project Structure

```
intern/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/                # Axios configuration & interceptors
│   │   ├── components/         # Reusable UI components (Navbar, Modal, Cards)
│   │   ├── context/            # AuthContext (state management for auth)
│   │   ├── pages/              # Pages (Login, Register, Dashboard)
│   │   ├── App.jsx             # Router & route protection
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # Database connection (MongoDB Atlas)
│   │   ├── controllers/        # Request logic (Auth, Items)
│   │   ├── middleware/         # JWT Auth & error handling
│   │   ├── models/             # Mongoose Schemas (User, Item)
│   │   ├── routes/             # Express API Routes
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── package.json                # Root package for running scripts
└── README.md
```

---

## 👤 Demo Login Credentials

You can use the pre-seeded account:
- **Email:** `alice@gmail.com`
- **Password:** `Abc@123`

---

## 🛠️ Step 1: Install Node.js

Node.js is currently required on your machine to run the server and frontend.

### Option A: Official Installer (Recommended)
1. Download Node.js LTS from: **[nodejs.org](https://nodejs.org/en/download)**
2. Run the installer and finish the setup.
3. Restart your terminal / VS Code.

### Option B: Windows Terminal / PowerShell
Open PowerShell as Administrator and run:
```powershell
winget install OpenJS.NodeJS.LTS
```

Verify the installation:
```bash
node -v
npm -v
```

---

## 🍃 Step 2: Set Up Free MongoDB Atlas Cloud Database

1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and create a free account.
2. Create a **Free Shared Cluster (M0 Sandbox)**.
3. In **Database Access**, create a database user with username and password.
4. In **Network Access**, click **Add IP Address** -> Choose **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
5. In your cluster dashboard, click **Connect** -> **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://swatejapatil3_db_user:<password>@cluster0.ojoezf2.mongodb.net/mern_db?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 3: Configure Environment Variables

The `.env` file in the `server` directory is configured:

```env
PORT=5000
MONGODB_URI=mongodb+srv://swatejapatil3_db_user:<password>@cluster0.ojoezf2.mongodb.net/mern_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_mern_app_2026
CLIENT_URL=http://localhost:5173
```

---

## 📦 Step 4: Install Dependencies

From the root `intern` directory:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🚀 Step 5: Run the Application

Open two terminal tabs:

### Terminal 1: Backend API
```bash
cd server
npm run dev
```
Backend will start at: `http://localhost:5000`

### Terminal 2: Frontend App
```bash
cd client
npm run dev
```
Frontend will start at: `http://localhost:5173`

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | ❌ No |
| `POST` | `/api/auth/login` | Login user & receive JWT token | ❌ No |
| `GET` | `/api/auth/me` | Get current user profile | ✅ Yes (Bearer Token) |

### 📋 Items & Tasks (`/api/items`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/items` | Get all user items (with search & filters) | ✅ Yes |
| `GET` | `/api/items/:id` | Get specific item details | ✅ Yes |
| `POST` | `/api/items` | Create new item | ✅ Yes |
| `PUT` | `/api/items/:id` | Update existing item | ✅ Yes |
| `DELETE` | `/api/items/:id` | Delete item | ✅ Yes |

