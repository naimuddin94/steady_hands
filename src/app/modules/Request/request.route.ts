import { Router } from 'express';
import { RequestController } from './request.controller';

const router = Router();

router.route('/').post(RequestController.createRequest);

export const RequestRoute = router;
