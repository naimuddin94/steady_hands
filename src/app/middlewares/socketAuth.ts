import { Socket } from 'socket.io';
import status from 'http-status';
import { AppError } from '../utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { ROLE } from '../modules/Auth/auth.constant';
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

    const user = await Auth.findById(verifiedUser._id).select('-password');

    const admin = await Auth.findOne({ role: ROLE.SUPER_ADMIN });

    if (!user || user === null) {
      throw new AppError(status.NOT_FOUND, 'User not found');
    }

    // Attach user to socket
    socket.data.user = user;
    socket.data.admin = admin;
    next();
  } catch {
    next(new Error('Authentication error'));
  }
};
