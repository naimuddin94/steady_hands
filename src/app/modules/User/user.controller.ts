import { CookieOptions } from 'express';
import status from 'http-status';
import { AppResponse, asyncHandler, options } from '../../utils';
import { UserService } from './user.service';

const signup = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await UserService.saveUserIntoDB(payload, req.file);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(
        status.CREATED,
        result,
        'Your OTP has been successfully sent to your email. If you do not find the email in your inbox, please check your spam or junk folder.'
      )
    );
});

const signin = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await UserService.signinUserIntoDB(payload);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const signout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies?.accessToken;

  await UserService.signoutUserFromDB(accessToken);

  res
    .status(status.OK)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new AppResponse(status.OK, null, 'Signout successfully'));
});

const profileData = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;

  const result = await UserService.getProfieFromDB(accessToken);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Profile information fetched successfully'
      )
    );
});

const updateProfie = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;

  const result = await UserService.updateUserIntoDB(
    accessToken,
    req.body,
    req.file
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Profile update successfully'));
});

export const UserController = {
  signup,
  signin,
  signout,
  profileData,
  updateProfie,
};
