/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { AppError } from '../../utils';
import Business from '../Business/business.model';
import { IAuth } from './../Auth/auth.interface';
import RequestModel from './request.model';
import Artist from '../Artist/artist.model';
import mongoose from 'mongoose';

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

const acceptRequestFromArtist = async (user: IAuth, requestId: string) => {
  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.OK, 'Artist not found');
  }

  const request = await RequestModel.findOne({
    _id: requestId,
    artistId: artist._id,
  });

  if (!request) {
    throw new AppError(status.OK, 'Request not found');
  }

  const business = await Business.findById(request.businessId);

  if (!business) {
    throw new AppError(status.OK, 'Business not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Business.findByIdAndUpdate(
      business._id,
      {
        $addToSet: { residentArtists: request.artistId },
      },
      { session }
    );

    await RequestModel.findByIdAndDelete(request._id, { session });

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Something went wrong when accept request: ${error?.message}`
    );
  }
};

const removeRequest = async (requestId: string) => {
  return await RequestModel.findByIdAndDelete(requestId);
};

export const RequestService = {
  createRequestIntoDB,
  fetchRequestByArtist,
  acceptRequestFromArtist,
  removeRequest,
};
