# TIMДА | Social Media REST API

![Node.js](https://shields.io)
![Express.js](https://shields.io)
![MongoDB](https://shields.io)
![Jest](https://shields.io)

A production-quality RESTful API built by **OKWOR KINGDAVID** under the **TIMДА** brand. This platform serves as a robust backbone for social media applications, supporting complex relationships, real-time feed generation, and rigorous security standards.

## 🚀 Key Features

- **Advanced Auth:** Secure Sign-up/Sign-in with JWT (1hr expiry) and Bcrypt hashing.
- **Content Lifecycle:** Full CRUD for posts with a Draft/Published state workflow.
- **Granular Authorization:** Strict ownership rules; only creators can modify or publish content.
- **Social Graph:** Fully optimized Follow/Unfollow system with duplicate prevention.
- **Engagement:** Real-time like/unlike system with automated counter updates.
- **Smart Discovery:** Paginated public listings with advanced filtering (author, tags, title) and multi-criteria sorting.
- **Personalized Feed:** Aggregated content stream from the user and their followed accounts.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Testing:** Jest, Supertest, `mongodb-memory-server`
- **Security:** JWT, Dotenv, Bcrypt

---

## 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/social-app-api.git
   cd social-app-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secure_random_string
   ```

4. **Launch:**
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

---

## 📑 API Documentation

### Authentication

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Public | Register a new user |
| `POST` | `/auth/signin` | Public | Receive JWT token |

### Posts & Discovery

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Public | List published posts (paginated) |
| `GET` | `/posts/:id` | Public | Detailed post view + author info |
| `POST` | `/posts` | Auth | Create a draft post |
| `PATCH` | `/posts/:id` | Owner | Edit title, content, or tags |
| `PUT` | `/posts/:id/publish` | Owner | Move draft to public state |
| `DELETE` | `/posts/:id` | Owner | Permanent removal |

### Social & Interactions

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/me/posts` | Auth | View personal drafts/published posts |
| `POST` | `/me/follow/:id` | Auth | Follow a user |
| `GET` | `/feed` | Auth | View personalized social feed |
| `POST` | `/posts/:id/like` | Auth | Like a post |

---

## 🧪 Testing Suite
This project maintains high code reliability through an automated testing pipeline.
- **Coverage:** Auth validation, CRUD ownership, Edge-case follow logic, Feed aggregation.
- **Tooling:** Jest & Supertest.
- **Database:** Uses an isolated In-memory MongoDB for clean test runs.

```bash
npm test
```

---

## 🔗 Project Links
- **Live API:** [View Hosted Demo]()
- **Developer:** OKWOR KINGDAVID
- **Brand:** TIMДА

---
*License: ISC | Built for Scalability.*
