# 💰 Budget Tracker App

A beautiful and modern income/expense tracking application built with Next.js, MongoDB, and TailwindCSS.

## ✨ Features

- 📊 **Real-time Balance Tracking** - Monitor your total balance, income, and expenses
- 💾 **Cloud Storage** - All transactions are saved to MongoDB
- 🎨 **Beautiful UI** - Modern gradient design with dark mode support
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Next.js 16 and React 19
- 🔐 **Type-Safe** - Fully written in TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure your environment variables in `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── lib/
│   │   │   └── mongodb.ts          # MongoDB connection handler
│   │   ├── models/
│   │   │   └── Item.ts              # Transaction model schema
│   │   └── transactions/
│   │       ├── route.ts             # GET, POST, DELETE all transactions
│   │       └── [id]/
│   │           └── route.ts         # DELETE, PUT single transaction
│   ├── page.tsx                     # Main application page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
└── public/                          # Static assets
```

## 🛠️ API Routes

### `GET /api/transactions`
Fetch all transactions sorted by date (newest first)

### `POST /api/transactions`
Create a new transaction
```json
{
  "type": "income" | "expense",
  "amount": number,
  "category": string,
  "description": string (optional),
  "date": Date
}
```

### `DELETE /api/transactions/[id]`
Delete a specific transaction by ID

### `PUT /api/transactions/[id]`
Update a specific transaction by ID

## 💡 Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (recommended)

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ using Next.js and MongoDB

