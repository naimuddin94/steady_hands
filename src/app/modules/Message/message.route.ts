import { Router } from 'express';
import { auth } from '../../middlewares';
import { MessageController } from './message.controller';

const router = Router();

router
  .route('/room/:roomId/messages')
  .get(auth(), MessageController.getMessagesByRoom);
router.route('/message').post(auth(), MessageController.sendMessage);
router
  .route('/message/:messageId')
  .delete(auth(), MessageController.removeMessage);
router
  .route('/message/:messageId/read')
  .patch(auth(), MessageController.readMessage);
router
  .route('/message/:messageId/pin')
  .patch(auth(), MessageController.pinOrUnpinMessage);
router
  .route('/message/:messageId/priority')
  .patch(auth(), MessageController.updatePriority);

export const MessageRoutes = router;
