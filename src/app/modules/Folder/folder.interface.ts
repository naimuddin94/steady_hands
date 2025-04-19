import { Document, Types } from 'mongoose';
import { TFolderFor } from './folder.constant';

export interface IFolder extends Document {
  auth: Types.ObjectId;
  name: string;
  images: string[];
  isPublished: boolean;
  for: TFolderFor;
}
