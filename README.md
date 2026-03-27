# Monthly Collection System 📊💳

A comprehensive, premium web application built for managing organization members, monthly payment collections, and expenditures tracking. The system features a modern, responsive UI with Role-Based Access Control (RBAC), robust financial reporting, and comprehensive dashboard analytics.

## 🌟 Key Features

- **Dashboard Analytics**: Real-time overview of total members, collected funds, pending payments, and payment method summaries.
- **Member Management**: Add, update, and manage members with detailed profiles and photo uploads.
- **Payment Collections**: Track monthly payments, mark as paid/pending, and generate digital receipts.
- **Expense Tracking**: Manage organization expenditures, automatically validated against available funds in specific payment methods (e.g., Evc Plus, e-Dahab, Premier Wallet).
- **Financial Reports**: Dynamic reporting suite with automated calculations for Total Collected, Total Expenses, and Net Balance. Includes Excel export and PDF printing capabilities.
- **Role-Based Access Control (RBAC)**: Highly granular permission system. Create custom roles and assign specific CRUD (Create, Read, Update, Delete, Export) permissions for different modules.
- **Premium UI/UX**: Designed with a sleek, modern, glassmorphic aesthetic using vanilla CSS and Lucide icons.

## 🛠️ Technology Stack

**Frontend:**
- React 18 (with Hooks)
- TypeScript
- Vite
- Axios (for API communication)
- Lucide React (Icons)
- SheetJS (Excel Exports)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose ODM)
- JWT (JSON Web Tokens for Authentication)
- Multer (for handling file/image uploads)

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/zakaribene/Monthely-Collection.git
cd Monthely-Collection
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/monthly-collection
JWT_SECRET=your_super_secret_jwt_key
```
Run the backend server:
```bash
# For development (auto-restarts on changes)
npm run dev

# For production
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000` (or the port specified by Vite).

## 🛡️ Default Administrator Account
For the initial setup, you can seed the default permissions and admin account by running the seeders (if available):
- **Username**: `admin`
- **Password**: `123456`

## 📄 License
This project is proprietary and built for internal organizational use.

---
*Built with ❤️ to streamline financial collections and management.*
