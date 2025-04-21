import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { BusinessService } from './business.service';

const updateBusinessProfile = asyncHandler(async (req, res) => {
  const result = await BusinessService.updateBusinessProfile(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Business profile updated successfully'
      )
    );
});

const updateBusinessPreferences = asyncHandler(async (req, res) => {
  const result = await BusinessService.updateBusinessPreferences(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Business preferences updated successfully'
      )
    );
});

const updateBusinessNotificationPreferences = asyncHandler(async (req, res) => {
  const result = await BusinessService.updateBusinessNotificationPreferences(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Business notification preferences updated successfully'
      )
    );
});

const updateBusinessSecuritySettings = asyncHandler(async (req, res) => {
  const result = await BusinessService.updateBusinessSecuritySettings(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Business security and privacy settings updated successfully'
      )
    );
});

const updateAvailability = asyncHandler(async(req, res)=>{
  const result = await BusinessService.updateGuestSpots(req.user, req.body);
    res.status(status.OK).json(new AppResponse(status.OK, result, 'Guest spots updated successfully'));
})

const updateTimeOff = asyncHandler(async(req, res)=>{
  const result = await BusinessService.updateTimeOff(req.user, req.body);
    res.status(status.OK).json(new AppResponse(status.OK, result, 'Time off updated successfully'));
})

export const BusinessController = {
  updateBusinessProfile,
  updateBusinessPreferences,
  updateBusinessNotificationPreferences,
  updateBusinessSecuritySettings,
  updateAvailability,
  updateTimeOff
};
