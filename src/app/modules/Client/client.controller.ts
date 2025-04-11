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

export const ClientController = {
  updateProfile,
};
