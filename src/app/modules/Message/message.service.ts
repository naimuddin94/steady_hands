/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageModel } from './message.model';
import mongoose from 'mongoose';
import status from 'http-status';
import { AppError } from '../../utils';
import { IMessage } from './message.interface';

const fetchMessagesByRoomId = async (roomId: string): Promise<IMessage[]> => {
  if (!roomId) {
    throw new AppError(status.BAD_REQUEST, 'Room ID is required');
  }

  // Simple fetch, no transaction needed as no writes happen
  const messages = await MessageModel.find({ roomId, isDeleted: false })
    .sort({ createdAt: 1 })
    .populate('senderId', 'fullName email image')
    .populate('receiverId', 'fullName email image')
    .exec();

  return messages;
};

const createMessage = async (payload: Partial<IMessage>): Promise<IMessage> => {
  if (!payload.senderId || !payload.receiverId || !payload.message) {
    throw new AppError(status.BAD_REQUEST, 'Missing required message fields');
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const message = new MessageModel(payload);
    const savedMessage = await message.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return savedMessage;
  } catch (error: any) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to create message: ${error.message}`
    );
  }
};

const deleteMessage = async (messageId: string): Promise<IMessage | null> => {
  if (!messageId) {
    throw new AppError(status.BAD_REQUEST, 'Message ID is required');
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    // Soft delete
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true, session: mongoSession }
    );

    if (!message) {
      throw new AppError(status.NOT_FOUND, 'Message not found');
    }

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return message;
  } catch (error: any) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to delete message: ${error.message}`
    );
  }
};

const markMessageAsRead = async (messageId: string): Promise<IMessage | null> => {
  if (!messageId) {
    throw new AppError(status.BAD_REQUEST, 'Message ID is required');
  }

  try {
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { is_read: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      throw new AppError(status.NOT_FOUND, 'Message not found');
    }

    return message;
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to mark message as read: ${error.message}`
    );
  }
};

const pinMessage = async (messageId: string, pin: boolean): Promise<IMessage | null> => {
  if (!messageId) {
    throw new AppError(status.BAD_REQUEST, 'Message ID is required');
  }

  try {
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { isPinned: pin },
      { new: true }
    );

    if (!message) {
      throw new AppError(status.NOT_FOUND, 'Message not found');
    }

    return message;
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to update pin status: ${error.message}`
    );
  }
};

const updateMessagePriority = async (
  messageId: string,
  priority: 'low' | 'normal' | 'high'
): Promise<IMessage | null> => {
  if (!messageId) {
    throw new AppError(status.BAD_REQUEST, 'Message ID is required');
  }

  if (!['low', 'normal', 'high'].includes(priority)) {
    throw new AppError(status.BAD_REQUEST, 'Invalid priority level');
  }

  try {
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { priorityLevel: priority },
      { new: true }
    );

    if (!message) {
      throw new AppError(status.NOT_FOUND, 'Message not found');
    }

    return message;
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to update priority: ${error.message}`
    );
  }
};

export const MessageService = {
  fetchMessagesByRoomId,
  createMessage,
  deleteMessage,
  markMessageAsRead,
  pinMessage,
  updateMessagePriority,
};
