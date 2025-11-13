# PLAN.md

## Project: Quiz Management System (MVP)

### Goals & Deliverables

* A working Quiz Management System with:

  * **Admin Panel** to create quizzes (title + various question types: MCQ, True/False, Text).
  * **Public Page** where anyone can take a quiz and see results after completion (score, correct answers, etc.).
* Single GitHub repo containing all source code.
* `PLAN.md` describing assumptions, scope, architecture, schema, and approach.
* Minimum **4 commits**, at least one every 30 minutes.
* A short recorded session showing development and a final demo.
* Optional: deployed app (Render/Netlify/Vercel + MongoDB Atlas).

---

## Assumptions

1. Tech stack:

   * **Backend:** Node.js with Express (JavaScript).
   * **Database:** MongoDB Atlas (Mongoose ODM).
   * **Frontend:** React (JavaScript) with Tailwind CSS.
2. The project is single-developer; security and scalability will be minimal for MVP.
3. Admin access will be handled through a simple password or environment variable (no full authentication system yet).
4. Quizzes are small (≤ 50 questions), so performance is not a bottleneck.

---

## Scope

### Must-haves (MVP)

* **Admin Panel**

  * Create, view, and manage quizzes.
  * Add questions of multiple types: MCQ (single/multiple correct), True/False, and Text.
  * Save and publish quizzes.

* **Public Page**

  * List published quizzes.
  * Take a quiz interactively.
  * Submit answers and view results (score, correct answers, feedback).

### Nice-to-haves (time permitting)

* User login and quiz history.
* Quiz timer.
* Result analytics.
* Deployment on Render/Netlify.

---

## High-Level Architecture

**Frontend (React + Tailwind)**

* Pages:

  * `/admin` → Admin dashboard.
  * `/admin/create` → Quiz creation form.
  * `/` → List of public quizzes.
  * `/quiz/:id` → Take quiz page.
  * `/result/:id` → View results.
* Components:

  * `QuizForm`, `QuestionForm`, `QuizCard`, `QuizPlayer`, `ResultView`.

**Backend (Express + MongoDB)**

* Routes:

  * `POST /api/admin/login` → Basic password auth.
  * `POST /api/quizzes` → Create quiz (admin only).
  * `GET /api/quizzes` → List all published quizzes.
  * `GET /api/quizzes/:id` → Fetch quiz (without correct answers).
  * `POST /api/quizzes/:id/attempt` → Submit answers.
  * `GET /api/attempts/:id` → Get result data.

**Database (MongoDB)**

* Hosted on MongoDB Atlas.

---

## MongoDB Schema (Mongoose)

```js
// models/Quiz.js
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  prompt: String,
  type: { type: String, enum: ['MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE', 'TEXT'] },
  options: [OptionSchema],
  order: Number,
  required: { type: Boolean, default: true },
});

const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  published: { type: Boolean, default: false },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', QuizSchema);
```

```js
// models/Attempt.js
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  value: mongoose.Schema.Types.Mixed, // could be string, array, etc.
  isCorrect: Boolean,
});

const AttemptSchema = new mongoose.Schema({
  quizId: String,
  answers: [AnswerSchema],
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', AttemptSchema);
```

---

## API Logic

* On submission, backend compares answers:

  * **MCQ_SINGLE / TRUE_FALSE:** mark correct if user answer matches the correct option.
  * **MCQ_MULTIPLE:** compare arrays of selected vs. correct options.
  * **TEXT:** optional exact match; otherwise mark as `pending` or `incorrect`.
* Return a summary with:

  ```js
  {
    score: Number,
    total: Number,
    correctAnswers: [...],
    userAnswers: [...]
  }
  ```

---

## UI / UX Plan

* Clean, minimal layout with Tailwind.
* Admin quiz builder uses dynamic forms.
* Quiz player is a card-based interactive UI.
* Results page displays user score and per-question feedback.

---

## Folder Structure

```
/ (repo root)
  /client  → React app
    /src
      /components
      /pages
      /services (API calls)
  /server  → Node.js Express app
    /models
    /routes
    /controllers
  package.json
  README.md
  PLAN.md
```

---

## Commit Plan

At least **4 commits**, every ~30 minutes:

1. **init:** project scaffold (Express + React setup).
2. **feat:** models and API routes.
3. **feat:** admin panel + quiz creation.
4. **feat:** public quiz page + scoring logic.
5. (optional) **chore:** deploy + polish.

---

## Testing Plan

* Manual tests:

  * Create quiz via Admin.
  * Take quiz and submit answers.
  * Check results correctness.
* Optional Jest tests for scoring logic.

---

## Deployment Plan

* **Backend:** Render or Railway (Node.js Express).
* **Frontend:** Netlify or Vercel (React build).
* **Database:** MongoDB Atlas.

---

## Reflection (if more time)

If more time were available:

* Add full authentication for admin/users.
* Implement leaderboard and analytics.
* Add time-based quiz enforcement.
* Add better validation and question weights.
* Improve UI animations and transitions.

---

## Next Steps

1. Initialize Node.js + Express project structure.
2. Setup MongoDB Atlas connection.
3. Create Mongoose models.
4. Build core API routes.
5. Setup React app and Tailwind.
6. Build Admin and Public UI components.
