import { FilterQuery } from 'mongoose';
import Folder from '../Folder/folder.model';
import { IFolder } from '../Folder/folder.interface';

const getArtistFolders = async (params: string) => {
  const query: FilterQuery<IFolder> = {};
  if (params === 'pending') {
    query.isPublished = false;
  } else if (params === 'published') {
    query.isPublished = true;
  }

  return await Folder.find(query);
};

export const AdminService = {
  getArtistFolders,
};
