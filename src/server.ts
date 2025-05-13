/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/*
 * Title: Steady Hands
 * Description: A tatto sales backend system using express
 * Author: Md Naim Uddin
 * Github: naimuddin94
 * Date: 25/03/2025
 *
 */

import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedingAdmin from './app/utils/seeding';
import { Logger } from './app/utils';
import socketIO from 'socket.io';
import { SOCKET_EVENTS } from './app/modules/Message/message.constant';

let server: Server;

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  if (server) {
    server.close((error) => {
      console.error('Server closed due to unhandled rejection');
      Logger.error('Server closed due to unhandled rejection', error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('🛢 Database connected successfully');
    await seedingAdmin();
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });

    // Set up Socket.io
    const io = new socketIO.Server(server, {
      cors: {
        origin: '*',
        // credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Authorization', 'Content-Type'],
      },
      pingTimeout: 60000, // How long to wait for ping response
      pingInterval: 25000, // How often to ping
      transports: ['websocket', 'polling'], // Enable WebSocket first, fallback to polling
      allowUpgrades: true,
      maxHttpBufferSize: 2e6, // 1MB - Adjust based on your needs
      connectTimeout: 45000,
    });

    // Handle Socket.io connections
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
      console.log('A user connected', socket.id);

      // Handle sending messages
      socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
        console.log('From receive message: ', data);
      });

      // Handle joining a room for group chat
      socket.on(SOCKET_EVENTS.JOIN_ROOM, (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });

      // Handle sending messages
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data) => {
        const { message, room, userId } = data;
        console.log(`Message from ${userId}: ${message}`);
        if (room) {
          // Emit message to a specific room
          io.to(room).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, { userId, message });
        } else {
          // Emit message to the user or all clients
          io.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, { userId, message });
        }
      });

      // Handle user disconnect
      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(`User ${socket.id} disconnected`);
      });
    });
  } catch (err: any) {
    Logger.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close((error) => {
      Logger.error('Server closed due to SIGTERM', error);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  if (server) {
    server.close((error) => {
      console.log('Server closed due to SIGINT');
      Logger.error('Server closed due to SIGINT', error);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
