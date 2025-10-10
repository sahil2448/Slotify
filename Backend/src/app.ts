// src/app.ts
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import slotsRouter from './routes/slots';

dotenv.config();

const app = express();

// Parse FRONTEND_ORIGIN env var as a comma-separated list, with sensible defaults
const rawOrigins = process.env.FRONTEND_ORIGIN || 'http://localhost:5173,https://slotify-five.vercel.app';
const ALLOWED_ORIGINS = rawOrigins
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

// CORS options with dynamic origin checking
const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    // allow requests with no origin (like curl, Postman) or same-origin server-side calls
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    // not allowed
    return cb(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204, // some legacy browsers choke on 204
};

// Ensure CORS middleware runs before other middleware/routes so even errors include CORS headers
app.use(cors(corsOptions));


app.use(express.json({ limit: '1mb' }));

app.use('/slots', slotsRouter);

app.get('/', (_req, res) => {
  res.send('Scheduler backend is up');
});

// Optional 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

// Central error handler (must be last)
const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  // Handle malformed JSON from body parser
  if (err?.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    // make sure CORS headers are present on this response as well (cors middleware already ran)
    return res.status(400).json({ status: 'fail', message: 'Invalid JSON body' });
  }

  const status = Number.isInteger(err?.status) ? err.status : 500;

  // Log useful context in dev
  console.error(`[${req.method}] ${req.originalUrl}`, err.stack || err);

  // Avoid leaking internal error details in production
  const message = process.env.NODE_ENV === 'production' && status === 500 ? 'Internal Server Error' : err?.message || 'Internal Server Error';

  res.status(status).json({ status: 'error', message });
};
app.use(errorHandler);

export default app;
