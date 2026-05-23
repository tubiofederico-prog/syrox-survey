# Syrox Survey Platform

A full-stack survey application with Next.js frontend and NestJS backend.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities (API client, etc.)
├── backend/                # NestJS backend
│   ├── src/               # Backend source code
│   ├── package.json       # Backend dependencies
│   └── ...
├── package.json           # Root dependencies
└── vercel.json           # Vercel monorepo configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
npm install --prefix backend
```

### Development

Run both frontend and backend simultaneously:

```bash
npm run dev:all
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Or run them separately:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run start:dev --prefix backend
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For backend configuration, see `backend/README.md`

## Building

Build both frontend and backend:

```bash
npm run build
```

## Deployment on Vercel

The monorepo is configured for Vercel via `vercel.json`. When you push to GitHub, Vercel will:

1. Install dependencies for both projects
2. Build the Next.js frontend
3. Build the NestJS backend

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-backend-domain.com`)

## API Integration

The frontend uses the API client at `lib/api.ts` which points to `NEXT_PUBLIC_API_URL`.

Available endpoints:
- `POST /api/surveys` - Submit survey
- `POST /api/auth/login` - Admin login
- `GET /api/surveys` - Get surveys (requires token)
- `GET /api/surveys/analytics` - Get analytics (requires token)

## Documentation

- [Backend Documentation](./backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
