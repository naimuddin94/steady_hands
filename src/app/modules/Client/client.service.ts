import mongoose from 'mongoose';
import status from 'http-status';
import { AppError } from '../../utils';
import Client from './client.model';
import { IAuth } from '../Auth/auth.interface';
import { TProfilePayload } from '../Auth/auth.validation';
import { TProfileFileFields } from '../../types';
import ClientPreferences from '../ClientPreferences/clientPreferences.model';
import { IClientPreferences } from '../ClientPreferences/clientPreferences.interface';

const updateClientProfile = async (
  user: IAuth,
  payload: TProfilePayload,
  files: TProfileFileFields
) => {};

const updateClientPreferences = async (
  user: IAuth,
  payload: IClientPreferences
) => {};

export const ClientService = {
  updateClientProfile,
  updateClientPreferences,
};
