import mongoose, { Document } from 'mongoose';
// import { locationSchema } from '../Location/location.model';
import {
  ArtistType,
  DateFormat,
  FavoritePiercing,
  FavoriteTattoo,
  HomeView,
  ServiceType,
} from './client.constant';

export interface IClient extends Document {
  image?: string;
  location: { type: 'Point'; coordinates: [number, number] };
  radius: number;
  lookingFor: ServiceType[];
  country: string;
  favoriteTattoos: FavoriteTattoo[];
  favoritePiercing: FavoritePiercing[];
  homeView: HomeView;
  preferredArtistType: ArtistType;
  language: string;
  dateFormat: DateFormat;
  auth: mongoose.Types.ObjectId;
}
