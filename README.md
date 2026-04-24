# SRM Full Stack Engineering Challenge

This is my submission for the SRM Full Stack Engineering Challenge.

The project has two parts:

- a backend API built with Node.js and Express
- a single-page frontend built with React

The backend exposes `POST /bfhl`, and the frontend lets the evaluator paste the node list, submit it to the hosted API, and view the response in a clean structured layout.

## What this project does

The API accepts input in this form:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

From that input, it:

- validates each entry after trimming whitespace
- rejects malformed edges and self-loops
- detects duplicate edges
- enforces the first-parent rule
- builds disconnected hierarchies correctly
- detects cyclic components
- returns nested tree objects for valid components
- generates the required summary fields

The frontend is kept intentionally simple for evaluation:

- a textarea to enter the node list
- a submit button that calls the hosted `/bfhl` API
- a readable response section for hierarchies, invalid entries, duplicates, and summary
- a visible error message when the API request fails

## Tech stack

- Backend: Node.js, Express
- Frontend: React, Vite
- Deployment: Vercel

## Project structure

```text
backend/
  api/
  src/
frontend/
  src/
README.md
```

## Running locally

Install everything from the root:

```bash
npm run install:all
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Run the backend with Vercel dev:

```bash
cd backend
npx vercel dev
```

If the frontend should call the backend running on your machine, set this in `frontend/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## API endpoint

Public route:

```text
POST /bfhl
```

Sample local request:

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      "A->B", "A->C", "B->D", "C->E", "E->F",
      "X->Y", "Y->Z", "Z->X",
      "P->Q", "Q->R",
      "G->H", "G->H", "G->I",
      "hello", "1->2", "A->"
    ]
  }'
```

## Deployment

Both frontend and backend are meant to be deployed as separate Vercel projects from the same repository.

### Backend

- Set the Vercel project root to `backend`
- The function entry is `backend/api/bfhl.js`
- `backend/vercel.json` routes incoming requests to the backend function

Deployed API format:

```text
https://<your-backend-domain>/bfhl
```

### Frontend

- Set the Vercel project root to `frontend`
- Add the backend base URL as an environment variable

```text
VITE_API_BASE_URL=https://<your-backend-domain>
```

The frontend then sends requests to:

```text
${VITE_API_BASE_URL}/bfhl
```

## Notes

- `user_id` follows the required `fullname_ddmmyyyy` format
- the API is public and can be accessed from any website
- the response is deterministic and follows the structure required in the challenge
