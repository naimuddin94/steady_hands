import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { ClientService } from './client.service';

const updateProfile = asyncHandler(async (req, res) => {
  const result = await ClientService.updateProfile(req.user, req.body);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Profile information update successfully'
      )
    );
});

const updatePreferences = asyncHandler(async (req, res) => {
  const result = await ClientService.updatePreferences(req.user, req.body);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Preferences updated successfully')
    );
});

export const ClientController = {
  updateProfile,
  updatePreferences,
};
