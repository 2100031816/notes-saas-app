# SaaS Notes App Backend

## Multi-Tenancy Approach
This app uses a shared schema with a `tenantId` field on all user and note records to ensure strict tenant isolation.

## Environment Variables
- `PORT`: Port to run the server (e.g., 5000)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret for JWT signing

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file as described above.
3. Start the server:
   ```bash
   npm run dev
   ```

## Test Accounts
- admin@acme.test (Admin, Acme)
- user@acme.test (Member, Acme)
- admin@globex.test (Admin, Globex)
- user@globex.test (Member, Globex)
- All passwords: `password`

## Endpoints
- `/health` - Health check
- `/api/auth/login` - Login
- `/api/auth/invite` - Invite user (Admin)
- `/api/auth/tenants/:slug/upgrade` - Upgrade plan (Admin)
- `/api/notes` - CRUD for notes

## Deployment
Deploy this backend to Vercel as a Node.js serverless API.
