## 📝 Todo App — Next.js + Tailwind CSS + API

A modern, full-stack **Todo List application** built with **Next.js**, **Tailwind CSS**, and an **Express.js backend** (via REST API). Users can create, update, complete, and delete todos seamlessly with real-time UI updates.

---

### 🚀 Live Preview

> 🔗 Coming Soon (e.g., Vercel/Netlify deployment link)

---

### ✨ Features

- ✅ Add new todos with input sanitization
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Real-time UI updates after every action
- ✅ Fully responsive UI using **Tailwind CSS**
- ✅ Clean architecture with `fetch()` and `useEffect()`

---

### 🧠 Tech Stack

| Frontend             | Backend           | Styling                  | Other                 |
| -------------------- | ----------------- | ------------------------ | --------------------- |
| Next.js (App Router) | Node.js + Express | Tailwind CSS + Shadcn/ui | REST API              |
| TypeScript           |                   |                          | dotenv-based env vars |

---

### 🔧 Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/Haseeb7689/Todo-Frontend.git
cd Todo-Frontend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Environment Variables

Create a `.env.local` file in the root and add your backend API base URL:

```env
NEXT_PUBLIC_API_URL_RESPONSE=http://localhost:3001
```

> Replace `3001` with your backend port or deployed API URL.

#### 4. Run the App Locally

```bash
npm run dev
```

> App runs at `http://localhost:3000`

---

### 📂 Folder Structure

```
todo-list/
│
├── components/
│   └── ui/               # Reusable UI components (Input, Button, Checkbox)
├── app/                  # Main app logic (App Router)
├── public/               # Static assets
├── styles/               # Tailwind & global CSS
├── .env.local            # Local environment variables
├── README.md             # Project docs
└── package.json
```

---

### 👨‍💻 Author

- **Haseeb ur Rehman**
- 🔗 GitHub: [@Haseeb7689](https://github.com/Haseeb7689)

---

### 📄 License

This project is open-source and available under the [MIT License](LICENSE).
