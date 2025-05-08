import { Router } from 'express';
import { RequestController } from './request.controller';

const router = Router();

router
  .route('/')
  .post(RequestController.createRequest)
  .get(RequestController.fetchPendingRequests);

export const RequestRoute = router;
