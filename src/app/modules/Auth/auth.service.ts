import { IAuth } from './auth.interface';

const createAuth = async (payload: Partial<IAuth>) => {
  console.log(payload);
};

export const AuthService = {
  createAuth,
};
