import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { AuthService } from './auth.service';

const createAuth = asyncHandler(async (req, res) => {
  const result = await AuthService.createAuth(req.body);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'OTP send successfully'));
});

export const AuthController = {
  createAuth,
};
