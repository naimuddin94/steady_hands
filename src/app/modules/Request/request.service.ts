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

const fetchRequestByArtist = async (user: IAuth) => {
  const requests = await RequestModel.find({
    $or: [{ artistId: user._id }, { businessId: user._id }],
  }).populate([
    {
      path: 'artistId',
      select: '',
      populate: {
        path: 'auth',
        model: 'Auth',
        select: 'fullName email image',
      },
    },
    {
      path: 'businessId',
      select: '',
      populate: {
        path: 'auth',
        model: 'Auth',
        select: 'fullName email image',
      },
    },
  ]);
  return requests;
};

export const RequestService = {
  createRequestIntoDB,
  fetchRequestByArtist,
};
