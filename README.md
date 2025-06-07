# 📝 Note App

A full-stack Note-Taking Application with authentication, real-time search, and Markdown support. Built with **NestJS**, **React**, and **MongoDB** following a clean 3-tier architecture.

---

## 📐 Architecture & Tech Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [React](https://reactjs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **API**: RESTful API
- **Architecture Pattern**: Three-tier (Presentation, Business Logic, Data Access)

---

## ✅ Features

### 🔐 1. User Authentication

- **Register & Login**: Secure account creation with email and password. Passwords are hashed using `bcrypt`.
- **JWT-based Security**: After login, a JSON Web Token (JWT) is issued and used to authenticate subsequent requests.
- **Persistent Session**: JWT is stored in `localStorage` to maintain login state across browser sessions.
- **Protected Routes**: Only authenticated users can access personal routes and APIs. Unauthenticated users are redirected to the login page.

---

### 🗒️ 2. Note Management (CRUD)

- **Create Note**: Add new notes with a title and content.
- **View Notes**: List all notes sorted by the latest creation time.
- **Update Note**: Edit the title and content of existing notes.
- **Delete Note**: Permanently remove any unwanted note.
- **Data Access Control**: Each user can only access, update, or delete their own notes.

---

### 🔍 3. Real-time Search

- **Instant Search**: Search notes by keyword with results updating as you type.
- **Search Scope**: Works on both title and content fields.
- **Performance Optimization**: Implements **debouncing** on the frontend to reduce server load during typing.

---

### ✨ 4. Bonus Features

- **Markdown Support**: Format notes using Markdown syntax (e.g., `#`, `*`, `**`, lists...).
- **Markdown to HTML Conversion**: Notes are auto-converted to HTML on the backend upon saving for fast rendering.
- **Timestamps**: Each note shows creation and last updated time.
- **Dark Mode**: Toggle between Light and Dark themes. The selected theme is remembered across visits.

---