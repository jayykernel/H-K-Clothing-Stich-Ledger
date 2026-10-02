import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import styleRoutes from './routes/style';
import fabricRoutes from './routes/fabric';
import componentRoutes from './routes/component';
import costingRoutes from './routes/costing';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/fabrics', fabricRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/costings', costingRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors: err.errors.reduce((acc: any, e: any) => {
        acc[e.path.join('.')] = e.message;
        return acc;
      }, {}),
    });
  }
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;