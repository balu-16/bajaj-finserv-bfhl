# SRM Full Stack Engineering Challenge

This repository contains a complete solution for the challenge with:

- a Vercel-ready Express backend exposed publicly at `/bfhl`
- a React single-page frontend that submits edge input and renders the API output

## Project layout

```text
backend/
  api/bfhl.js
  src/
  tests/
frontend/
  src/
package.json
README.md
```

## What the backend does

The API accepts a payload like:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

It then:

1. trims every entry before validation
2. validates against the exact pattern `^[A-Z]->[A-Z]$`
3. rejects self-loops such as `A->A`
4. records repeated valid edges exactly once in `duplicate_edges`
5. keeps only the first valid parent assignment for any child
6. builds connected components with undirected adjacency
7. detects cycles at the component level
8. returns deterministic hierarchies in lexicographic order

## Determinism notes

To keep the output evaluator-friendly, the implementation applies deterministic ordering at:

- root selection
- child ordering inside each tree
- component processing
- the final `hierarchies` array

## Local setup

Install dependencies from the repository root:

```bash
npm run install:all
```

Run backend tests:

```bash
npm test
```

Run the frontend:

```bash
cd frontend
npm run dev
```

To test the backend locally as a Vercel function:

```bash
cd backend
npx vercel dev
```

If you want the local frontend to talk to the backend running through Vercel dev, create `frontend/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Sample API request

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

Deploy the backend and frontend as two separate Vercel projects from the same repository.

### Backend deployment

1. Create a new Vercel project.
2. Set the project root to `backend`.
3. Deploy it as-is. The function file is `backend/api/bfhl.js`, and `backend/vercel.json` rewrites the public route to it.

```text
https://<your-backend-domain>/bfhl
```

No `app.listen()` call is used in the deployed path.

### Frontend deployment

1. Create a second Vercel project.
2. Set the project root to `frontend`.
3. Add the environment variable from `frontend/.env.example`:

```text
VITE_API_BASE_URL=https://<your-backend-domain>
```

4. Deploy the frontend.

The SPA will call `${VITE_API_BASE_URL}/bfhl`, which matches the public backend route in both local and deployed environments.

## Submission checklist

Before publishing the final challenge submission:

1. replace the placeholder identity values in `backend/src/config/identity.js`
2. make sure `user_id` follows the `fullname_ddmmyyyy` format exactly
3. re-run backend tests
4. verify the deployed frontend is pointed at the deployed backend

## Verification completed

The current implementation has already been checked with:

- backend integration tests for the required sample and edge cases
- frontend linting
- frontend production build
