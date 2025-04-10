import { SharedValidation, TUpdateProfilePayload } from './../../schema/shared';
import ClientPreferences from '../ClientPreferences/clientPreferences.model';
import Client from './client.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose from 'mongoose';
import { TProfilePayload } from '../Auth/auth.validation';
import fs from 'fs';
import { FavoriteTattoo } from './client.constant';
import { z } from 'zod';

const updateProfile = async (user: IAuth, payload: TUpdateProfilePayload) => {
  
};

export const ClientService = {
  updateProfile,
};
