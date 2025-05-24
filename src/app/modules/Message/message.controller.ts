import { Request, Response } from 'express';
import { AppResponse } from '../../utils';
import status from 'http-status';
import { asyncHandler } from '../../utils';
import { MessageService } from './message.service';

const getMessagesByRoom = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  const messages = await MessageService.fetchMessagesByRoomId(roomId);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, messages, 'Messages fetched successfully')
    );
});

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  // Expect senderId, receiverId, message, messageType, etc. in body
  const messagePayload = req.body;
  const newMessage = await MessageService.createMessage(messagePayload);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, newMessage, 'Message sent successfully'));
});

const removeMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const deletedMessage = await MessageService.deleteMessage(messageId);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, deletedMessage, 'Message deleted successfully')
    );
});

const readMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const updatedMessage = await MessageService.markMessageAsRead(messageId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, updatedMessage, 'Message marked as read'));
});

const pinOrUnpinMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { pin } = req.body; // expecting { pin: true/false }
  const updatedMessage = await MessageService.pinMessage(messageId, pin);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        updatedMessage,
        pin ? 'Message pinned' : 'Message unpinned'
      )
    );
});

const updatePriority = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { priority } = req.body; // expecting { priority: 'low' | 'normal' | 'high' }
  const updatedMessage = await MessageService.updateMessagePriority(
    messageId,
    priority
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, updatedMessage, 'Message priority updated')
    );
});

export const MessageController = {
  getMessagesByRoom,
  sendMessage,
  removeMessage,
  readMessage,
  pinOrUnpinMessage,
  updatePriority,
};
