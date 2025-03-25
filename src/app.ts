/*
 * Title: Creativecventur
 * Description: A donate application backend system using express
 * Author: Md Naim Uddin
 * Date: 12/03/2025
 *
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import routes from './app/routes';
import { globalErrorHandler, notFound } from './app/utils';

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001'],
  })
);
app.use(cookieParser());

// static files
app.use('/public', express.static('public'));

// ✅ Apply Stripe raw body middleware BEFORE json parser
app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Express server is running :(' });
});

//global error handler
app.use(globalErrorHandler as unknown as express.ErrorRequestHandler);

//handle not found
app.use(notFound);

export default app;
