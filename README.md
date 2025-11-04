# AI-Driven Farmers' Disease Diagnosis & Reporting Portal

A modern web application for farmers to diagnose crop diseases using AI, report incidents, and track disease spread through an interactive map.

## Features

- 🔐 Complete authentication system (Login, Register, Forgot Password)
- 📸 Photo upload for disease diagnosis
- 🗺️ Interactive map showing disease reports
- 📊 Real-time updates via WebSocket
- 📱 Fully responsive design
- 🎨 Beautiful agricultural-themed UI
- ⚡ React Query for optimized data fetching
- 🔄 Optimistic UI updates

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoints
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:8080`

## Project Structure

```
src/
├── api/              # API configuration
│   ├── axios.ts      # Axios instance with interceptors
│   └── endpoints.ts  # API endpoint definitions
├── services/         # API service layer
│   ├── authService.ts
│   ├── reportService.ts
│   └── diseaseService.ts
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useReports.ts
│   └── useRealtime.ts
├── pages/            # Page components
├── components/       # Reusable components
├── context/          # React Context providers
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State:** React Query, Context API
- **Maps:** Leaflet
- **Forms:** React Hook Form, Zod validation
- **HTTP:** Axios
- **Real-time:** WebSocket/Socket.IO

## Development Notes

- Replace `process.env.VITE_API_URL` in `.env` with your backend URL
- WebSocket URL should point to your real-time server
- JWT tokens are stored in httpOnly cookies (recommended) or localStorage
- File uploads are handled via multipart/form-data

## API Integration

The app is structured to easily integrate with your backend:

1. Update `src/api/endpoints.ts` with your actual API routes
2. Services in `src/services/` return axios promises
3. React Query hooks handle caching and revalidation
4. WebSocket hook (`useRealtime`) connects to your real-time server

## License

MIT
