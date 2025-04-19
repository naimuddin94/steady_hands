import { AppError } from '../../utils';
import { IAuth } from '../Auth/auth.interface';
import status from 'http-status';
import Folder from './folder.model';
import { TFolderPayload } from './folder.validation';

const saveFolderIntoDB = async (
  user: IAuth,
  payload: TFolderPayload,
  files: Express.Multer.File[] | undefined
) => {
  if (!files || !files?.length) {
    throw new AppError(status.BAD_REQUEST, 'Files are required');
  }

  const folder = await Folder.findOne({ name: payload.name, auth: user._id });

  if (folder) {
    throw new AppError(status.BAD_REQUEST, 'Folder name already exists!');
  }

  return await Folder.create({
    auth: user._id,
    images: files.map((file) => file.path),
    ...payload,
  });
};

export const FolderService = {
  saveFolderIntoDB,
};
