import { MessageType } from '../modules/Message/message.interface';
import { TRole } from './../modules/Auth/auth.constant';

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send-message',
  MESSAGE_RECEIVE: 'message-receive',
  ERROR: 'error',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
} as const;

export type JoinRoomData = {
  receiver_id: string;
};

export type SocketUser = {
  _id: string;
  email: string;
  role: TRole;
};

export type MessageData = {
  message: string;
  receiver_id: string;
  message_type?: MessageType;
};
