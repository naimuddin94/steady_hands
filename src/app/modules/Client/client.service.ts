import { IClient } from './client.interface';

const saveClientIntoDB = async (payload: IClient) => {
  console.log(payload);
};

export const ClientService = {
  saveClientIntoDB,
};
