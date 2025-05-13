/* eslint-disable no-unused-vars */

import { Model, Types } from 'mongoose';
import { TRole } from '../Auth/auth.constant';

export enum MessageType {
  text = 'text',
  image = 'image',
  video = 'video',
  audio = 'audio',
  link = 'link',
}

export const MessageTypeValues = Object.values(MessageType);

export type IMessage = {
  senderId: Types.ObjectId;
  senderRole: TRole;
  receiverId: Types.ObjectId;
  message: string;
  messageType: MessageType;
  replyTo?: Types.ObjectId;
  is_read?: boolean;
  priorityLevel?: 'low' | 'normal' | 'high';
  isPinned?: boolean;
  roomId?: string;
  readAt?: Date;
  isDeleted?: boolean;
};

export type Message = Model<IMessage, Record<string, unknown>>;
