import status from 'http-status';
import { AppError } from '../../utils';
import Business from '../Business/business.model';
import { IAuth } from './../Auth/auth.interface';
import RequestModel from './request.model';
import Artist from '../Artist/artist.model';

const createRequestIntoDB = async (user: IAuth, artistId: string) => {
  // Step 1: Find the business
  const business = await Business.findOne({ auth: user._id });
  
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Step 2: Check if the artistId is valid
  const artist = await Artist.findById(artistId);

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Step 3: Create the request
  const request = await RequestModel.create({
    artistId,
    businessId: business._id,
  });

  return request;
};

export const RequestService = {
  createRequestIntoDB,
};
