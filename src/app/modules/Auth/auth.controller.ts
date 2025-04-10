import status from 'http-status';
import { AppResponse, asyncHandler, options } from '../../utils';
import { AuthService } from './auth.service';
import { CookieOptions } from 'express';
import { TProfileFileFields } from '../../types';

const createAuth = asyncHandler(async (req, res) => {
  const result = await AuthService.createAuth(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP send successfully'));
});

const signupOtpSendAgin = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const result = await AuthService.signupOtpSendAgin(token);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP send again successfully'));
});

const saveAuthData = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const otp = req.body.otp;
  const result = await AuthService.saveAuthIntoDB(token, otp);

  res
    .status(status.CREATED)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(
      new AppResponse(
        status.CREATED,
        { token: result.accessToken },
        'OTP verified successfully'
      )
    );
});

const createProfile = asyncHandler(async (req, res) => {
  const files = (req.files as TProfileFileFields) || {};
  const user = req.user;
  const result = await AuthService.saveProfileIntoDB(req.body, user, files);
  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, result, 'Account created successfully')
    );
});

const signin = asyncHandler(async (req, res) => {
  const result = await AuthService.signinIntoDB(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const socialSignin = asyncHandler(async (req, res) => {
  const { response, accessToken, refreshToken } =
    await AuthService.socialLoginServices(req.body);

  res
    .status(status.OK)
    .cookie('accessToken', accessToken, options as CookieOptions)
    .cookie('refreshToken', refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, response, 'Signin successfully'));
});

export const AuthController = {
  createAuth,
  saveAuthData,
  signupOtpSendAgin,
  createProfile,
  signin,
  socialSignin,
};
