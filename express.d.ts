import { IUser } from './src/app/modules/User/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
