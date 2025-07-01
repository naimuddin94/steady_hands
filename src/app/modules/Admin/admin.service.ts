import status from 'http-status';
import { AppError } from '../../utils';
import Folder from '../Folder/folder.model';
import fs from 'fs';
import Artist from '../Artist/artist.model';
import Business from '../Business/business.model';

const getArtistFolders = async () => {
  return await Folder.find({ isPublished: false });
};

const changeStatusOnFolder = async (folderId: string, permission: boolean) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new AppError(status.NOT_FOUND, 'Folder not found');
  }

  const artist = await Artist.findOne({ auth: folder.auth });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  if (permission) {
    if (folder.for === 'portfolio') {
      await Artist.findByIdAndUpdate(artist?._id, {
        $addToSet: {
          portfolio: {
            folder: folder._id,
            position: artist?.portfolio?.length + 1,
          },
        },
      });
      return await Folder.findByIdAndUpdate(folderId, {
        isPublished: true,
      });
    }
  } else {
    const deletedFolder = await Folder.findByIdAndDelete(folderId);
    deletedFolder?.images?.forEach((path) => fs.unlink(path, () => {}));
  }
};

const verifiedArtistByAdminIntoDB = async (artistId: string) => {
  const result = await Artist.findByIdAndUpdate(
    artistId,
    { isVerified: true },
    { new: true }
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  return result;
};

const verifiedBusinessByAdminIntoDB = async (businessId: string) => {
  const result = await Business.findByIdAndUpdate(
    businessId,
    { isVerified: true },
    { new: true }
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  return result;
};

export const AdminService = {
  getArtistFolders,
  changeStatusOnFolder,
  verifiedArtistByAdminIntoDB,
  verifiedBusinessByAdminIntoDB,
};
