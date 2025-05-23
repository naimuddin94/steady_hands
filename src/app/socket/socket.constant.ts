import { MessageType } from '../modules/Message/message.interface';
import { TRole } from './../modules/Auth/auth.constant';

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join_room',
  MESSAGE: 'message',
  ERROR: 'error',
  NOTIFICATION: 'notification',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
} as const;

export type SocketUser = {
  _id: string;
  email: string;
  role: TRole;
};

export type MessageData = {
  message: string;
  receiverId: string;
  messageType?: MessageType;
  roomId?: string;
};
