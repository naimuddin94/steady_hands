import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { AdminService } from './admin.service';

const getFolders = asyncHandler(async (req, res) => {
  const result = await AdminService.getArtistFolders(req.query.status as string);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Folder retrieved successfully'));
});

export const AdminController = {
  getFolders,
};
