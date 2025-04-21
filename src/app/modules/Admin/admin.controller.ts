import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { AdminService } from './admin.service';

const getFolders = asyncHandler(async (req, res) => {
  const result = await AdminService.getArtistFolders();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Folder retrieved successfully'));
});

const changeStatusOnFolder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const permission = req.body.permission;
  const result = await AdminService.changeStatusOnFolder(id, permission);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Action is successful on folder'));
});

const verifiedArtistByAdmin = asyncHandler(async (req, res) => {
  const artistId = req.params.artistId;
  const result = await AdminService.verifiedArtistByAdminIntoDB(artistId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Artist verified successfully'));
});

export const AdminController = {
  getFolders,
  changeStatusOnFolder,
  verifiedArtistByAdmin,
};
