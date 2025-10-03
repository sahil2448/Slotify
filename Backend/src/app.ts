// src/app.ts
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import slotsRouter from './routes/slots';

dotenv.config();

const app = express();

// Normalize origin (no trailing slash) and allowlist
const ALLOWED_ORIGIN = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').replace(/\/$/, '');

app.use(cors({
  origin: (origin, cb) => {
    // allow same-origin or no origin (e.g., curl/Postman)
    if (!origin || origin === ALLOWED_ORIGIN) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
}));

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
    return res.status(400).json({ status: 'fail', message: 'Invalid JSON body' });
  }
  const status = Number.isInteger(err?.status) ? err.status : 500;
  // Log useful context in dev
  console.error(`[${req.method}] ${req.originalUrl}`, err.stack || err);
  res.status(status).json({ status: 'error', message: err?.message || 'Internal Server Error' });
};
app.use(errorHandler);

export default app;
