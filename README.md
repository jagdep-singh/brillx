# BrillX

BrillX is a powerful SaaS learning platform that allows users to learn **anything they ask**—instantly. Built with a modern tech stack, BrillX uses AI and dynamic content delivery to tailor knowledge based on user input.

---

## 🚀 Features

- 🔎 Ask any question, get a personalized explanation
- 📚 Dynamic learning sessions tailored to user queries
- 🧠 AI-assisted teaching engine (coming soon)
- 🧾 User accounts with learning history (in progress)
- 📈 Future support for learning analytics and progress tracking

---

## 🧰 Tech Stack

| Layer        | Tech          |
|--------------|---------------|
| Frontend     | Next.js       |
| Backend      | Node.js       |
| Styling      | Tailwind CSS *(if used)* |
| Auth (TBD)   |  Clerk |
| Database     |MongoDB  |
| Hosting      | idk |

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/jagdep-singh/brillx.git
cd brillx

# 2. Install dependencies for frontend and backend
cd frontend
npm install
cd ../backend
npm install

# 3. Set up environment variables
# Create a .env file in both frontend/ and backend/ (see .env.example)

# 4. Run the app
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev

