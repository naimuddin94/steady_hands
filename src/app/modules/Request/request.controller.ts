import { AppResponse, asyncHandler } from '../../utils';
import { RequestService } from './request.service';
import status from 'http-status';

const createRequest = asyncHandler(async (req, res) => {
  const { artistId } = req.body;
  const user = req.user;

  // Call the service to create the request
  const result = await RequestService.createRequestIntoDB(user, artistId);

  // Send the response
  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Request send successfully'));
});

const fetchRequestByArtist = asyncHandler(async (req, res) => {
  const result = await RequestService.fetchRequestByArtist(req.user);

  // Send the response
  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Requests retrieved successfully')
    );
});

export const RequestController = {
  createRequest,
  fetchRequestByArtist,
};
