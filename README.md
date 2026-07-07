# 🚀 JEXO - Project Management Web App

JEXO is a modern project management web application built with **Next.js**, **Prisma ORM**, and **Neon PostgreSQL**. It helps teams organize projects, manage tasks, track progress, and collaborate efficiently through a clean and responsive interface.

---

## 📸 Preview

| Dashboard
<img width="1293" height="626" alt="image" src="https://github.com/user-attachments/assets/166f7fdc-51dd-4499-bb4c-275b50052155" />

| Project Board
<img width="1280" height="595" alt="image" src="https://github.com/user-attachments/assets/ce89849e-9585-4ec3-a945-d39aabe9c89b" />

| Issue Management
<img width="1187" height="514" alt="image" src="https://github.com/user-attachments/assets/78948c5d-f537-4897-9a0b-063efa9673c6" />

---

## ✨ Features

- 🔐 Secure Authentication
- 📁 Create & Manage Projects
- ✅ Task Creation & Management
- 👥 Team Collaboration
- 📊 Project Dashboard
- 📅 Task Status Tracking
- 🔍 Search & Filter
- 📱 Fully Responsive UI
- 🌙 Modern User Interface
- ⚡ Fast Performance with Next.js

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Lucide React

### Backend

- Next.js Server Actions
- Prisma ORM

### Database

- Neon Database
- PostgreSQL

### Authentication

- Clerk Authentication *(or replace with your auth provider)*

### Deployment

- Vercel

---

## 📂 Project Structure

```
JEXO/
│
├── app/
├── components/
├── actions/
├── prisma/
├── lib/
├── hooks/
├── public/
├── styles/
├── types/
├── middleware.ts
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone [https://github.com/codewithkamal01/Jexo-Project-Management-App]

cd Jexo-Project-Management-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migration

```bash
npx prisma migrate dev
```

---

### 6. Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📦 Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

---

## 🗄 Database

This project uses

- **Neon Database**
- **PostgreSQL**
- **Prisma ORM**

Useful Prisma Commands

```bash
npx prisma generate

npx prisma migrate dev

npx prisma studio
```

---

## 🚀 Deployment

The application is deployed using **Vercel**.

Production build:

```bash
npm run build
```

---

## 📈 Future Improvements

- 📌 Kanban Drag & Drop
- 🔔 Real-time Notifications
- 💬 Team Chat
- 📎 File Attachments
- 📅 Calendar View
- 📊 Analytics Dashboard
- 📱 PWA Support
- 📧 Email Notifications

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Kamal Manna**

- GitHub: https://github.com/codewithkamal01
- LinkedIn: https://linkedin.com/in/kamalmanna

---

⭐ If you like this project, don't forget to give it a star!
