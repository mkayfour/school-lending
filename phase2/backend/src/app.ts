import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.ts';
import equipmentRouter from './routes/equipment.ts';
import borrowRouter from './routes/borrow.ts';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../swagger/swagger.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/equipment', equipmentRouter);
app.use('/borrow', borrowRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;