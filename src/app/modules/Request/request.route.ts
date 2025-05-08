import { Router } from 'express';
import { RequestController } from './request.controller';
import { auth } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(auth(ROLE.BUSINESS), RequestController.createRequest)
  .get(
    auth(ROLE.BUSINESS, ROLE.ARTIST),
    RequestController.fetchPendingRequests
  );

router
  .route('/:id')
  .put(auth(ROLE.ARTIST), RequestController.acceptRequestFromArtist)
  .delete(auth(ROLE.ARTIST, ROLE.BUSINESS), RequestController.removeRequest);

export const RequestRoute = router;
