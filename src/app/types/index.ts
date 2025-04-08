export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type TProfileFileFields = {
  idFrontPart?: Express.Multer.File[];
  idBackPart?: Express.Multer.File[];
  selfieWithId?: Express.Multer.File[];
};