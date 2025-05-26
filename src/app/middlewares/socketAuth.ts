import { Socket } from 'socket.io';
import status from 'http-status';
import { AppError } from '../utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import Auth from '../modules/Auth/auth.model';

// import { NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }

    // Remove Bearer from token if present
    const cleanToken = token.replace('Bearer ', '');

    const verifiedUser = jwt.verify(
      cleanToken,
      config.jwt_access_secret!
    ) as JwtPayload;

    const user = await Auth.findById(verifiedUser.id).select('-password');

    if (!user || user === null) {
      throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (user?._id) {
      socket.join(user?._id.toString());
    }

    // Attach user to socket
    socket.data.user = user;
    next();
  } catch {
    next(new Error('Authentication error'));
  }
};
