/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';

import { socketAuth } from '../middlewares';
import {
  JoinRoomData,
  MessageData,
  SOCKET_EVENTS,
  SocketUser,
} from './socket.constant';
import { ROLE } from '../modules/Auth/auth.constant';
import { IMessage, MessageType } from '../modules/Message/message.interface';
import { MessageModel } from '../modules/Message/message.model';

const initSocketIo = (io: Server): void => {
  const chatNamespace = io.of('/chat');
  chatNamespace.use(socketAuth);

  chatNamespace.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    const userData: SocketUser = socket.data?.user;
    const adminData: SocketUser = socket.data?.admin;

    console.log(`User connected: ${userData?.email}`);

    ////! join room listener
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (data: JoinRoomData) => {
      handleJoinRoom(socket, data, userData, adminData);
    });
    //! message listener
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data: MessageData) => {
      handleMessageSent(socket, data, userData, adminData);
    });

    // Cleanup on disconnect
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`User disconnected: ${userData?.email}`);
      socket.removeAllListeners(SOCKET_EVENTS.SEND_MESSAGE);
      socket.removeAllListeners(SOCKET_EVENTS.JOIN_ROOM);
    });
  });
};

const generateRoomId = (adminId: string, userId: string): string => {
  return `${adminId}-${userId}`;
};

const handleMessageSent = async (
  socket: Socket,
  data: MessageData,
  userData: SocketUser,
  adminData: SocketUser
): Promise<void> => {
  try {
    if (!data?.message?.trim()) {
      socket.emit(SOCKET_EVENTS.ERROR, {
        status: 400,
        message: 'Message is required',
      });
      return;
    }

    const receiverId =
      userData?.role === ROLE.CLIENT ? adminData?._id : data.receiver_id;

    const roomId = generateRoomId(
      adminData?._id,
      userData?.role === ROLE.CLIENT ? userData?._id : data.receiver_id
    );

    const messageData: Partial<IMessage> = {
      senderId: new Types.ObjectId(userData?._id) as any,
      receiverId: new Types.ObjectId(receiverId) as any,
      message: data.message.trim(),
      roomId: roomId,
      messageType: data.message_type ?? MessageType.text,
      senderRole: userData?.role,
    };

    // console.log(messageData, 'messageData');

    const createdMessage = await MessageModel.create(messageData);
    // console.log(createdMessage, 'createdMessage');
    socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, createdMessage);
    socket.emit(roomId, createdMessage);
    // socket.emit("admin-users", { room_id: roomId });
    socket.on('new-message-notification', (data) => {
      // Handle new message notification
      // For example, update unread messages count or show a notification
      console.log('New message received:', data);
    });
  } catch (error) {
    console.error('Error in handleMessageSent:', error);
    socket.emit(SOCKET_EVENTS.ERROR, {
      status: 500,
      message: 'An unexpected error occurred. Please try again.',
    });
  }
};

const handleJoinRoom = (
  socket: Socket,
  data: JoinRoomData,
  userData: SocketUser,
  adminData: SocketUser
): void => {
  try {
    const roomId = generateRoomId(
      adminData?._id,
      userData?.role === ROLE.CLIENT ? userData?._id : data.receiver_id
    );

    socket.join(roomId);
    console.log(`User ${userData?.email} joined room: ${roomId}`);
    socket.emit('joined_message', { room_id: roomId });
  } catch (error) {
    console.error('Error in handleJoinRoom:', error);
    socket.emit(SOCKET_EVENTS.ERROR, {
      status: 500,
      message: 'Failed to join room',
    });
  }
};

export default initSocketIo;
