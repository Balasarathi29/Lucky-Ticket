
# Lucky Ticket Redemption System

A premium, production-ready full-stack application for managing and redeeming lucky tickets. Built with Next.js 15, Node.js, Express, and MongoDB.

## 🚀 Features

- **Admin Dashboard**: Generate unique lucky ticket codes with defined rewards.
- **User Redemption**: Users can redeem tickets to earn points.
- **Strict Validation**: One-time use enforcement, race condition prevention.
- **Rich Aesthetics**: Glassmorphism UI, smooth animations (Framer Motion), and responsive design.
- **Security**: Environment variable configuration, input validation.

## 🛠️ Tech Stack

**Frontend:**
- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Integration)

**Backend:**
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **CORS** & **Dotenv**

## 📂 Project Structure

```
Lucky Ticket/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── app/            # Next.js App Router pages
│   ├── components/ui/  # Reusable UI components
│   ├── lib/            # Utilities & API helpers
│   └── public/         # Static assets
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or AtlasURI)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/luckyticket_db
```

Start the server:
```bash
npm start
# OR for development
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory (optional if defaults work):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/luckyticket
```

Start the application:
```bash
npm run dev
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push `backend` folder to a repository.
2. Set environment variables (`MONGO_URI`, `PORT`).
3. Build command: `npm install`
4. Start command: `node server.js`

### Frontend (Vercel/Netlify)
1. Push `frontend` folder to a repository.
2. Connect to Vercel.
3. Set environment variable `NEXT_PUBLIC_API_URL` to your live backend URL.
4. Deploy.

## 🧪 API Endpoints

- `POST /luckyticket/generate` - Generate a ticket (Admin)
- `GET /luckyticket/list` - List all tickets (Admin)
- `POST /luckyticket/redeem` - Redeem a ticket (User)

## 📝 License

MIT
