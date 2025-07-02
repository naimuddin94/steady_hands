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

const verifiedBusinessByAdmin = asyncHandler(async (req, res) => {
  const businessId = req.params.businessId;
  const result = await AdminService.verifiedBusinessByAdminIntoDB(businessId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Business verified successfully'));
});

const fetchAllArtists = asyncHandler(async (req, res) => {
  const result = await AdminService.fetchAllArtists(req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result.data,
        'Artists retrieved successFully',
        result.meta
      )
    );
});

const fetchAllBusiness = asyncHandler(async (req, res) => {
  const result = await AdminService.fetchAllBusiness(req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result.data,
        'Business retrieved successFully',
        result.meta
      )
    );
});

const fetchAllClient = asyncHandler(async (req, res) => {
  const result = await AdminService.fetchAllClient(req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result.data,
        'Clients retrieved successFully',
        result.meta
      )
    );
});

export const AdminController = {
  getFolders,
  changeStatusOnFolder,
  verifiedArtistByAdmin,
  verifiedBusinessByAdmin,
  fetchAllArtists,
  fetchAllBusiness,
  fetchAllClient,
};
