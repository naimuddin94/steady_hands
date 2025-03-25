import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { AuthService } from './auth.service';

// For forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const result = await AuthService.forgotPassword(email);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Your OTP has been successfully sent to your email. If you do not find the email in your inbox, please check your spam or junk folder.'
      )
    );
});

const verifyOtpForForgetPassword = asyncHandler(async (req, res) => {
  const otp = req.body.otp;
  const email = req.params.email;

  const result = await AuthService.verifyOtpForForgetPassword(email, otp);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.cookies?.resetPasswordToken;
  const result = await AuthService.resetPasswordIntoDB(
    resetPasswordToken,
    req.body.newPassword
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Reset password successfully'));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const otp = req.body.otp;
  const email = req.params.email;

  const result = await AuthService.verifyOtpInDB(email, otp);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const resendOtp = asyncHandler(async (req, res) => {
  const result = await AuthService.resendOtp(req.body.email);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await AuthService.refreshToken(refreshToken);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Refresh access token successfully')
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const result = await AuthService.changePasswordIntoDB(accessToken, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Password change successfully'));
});

export const AuthController = {
  resetPassword,
  forgetPassword,
  verifyOtp,
  resendOtp,
  refreshToken,
  changePassword,
  verifyOtpForForgetPassword,
};
