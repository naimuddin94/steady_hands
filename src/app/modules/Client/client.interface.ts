import { Document } from 'mongoose';
import { locationSchema } from '../Location/location.model';
import {
  ArtistType,
  DateFormat,
  FavoritePiercing,
  FavoriteTattoo,
  HomeView,
  ServiceType,
} from './client.constant';

export interface IClient extends Document {
  fullName: string;
  image?: string;
  location: typeof locationSchema;
  radius: number;
  lookingFor: ServiceType[];
  country: string;
  favoriteTattoos: FavoriteTattoo[];
  favoritePiercing: FavoritePiercing[];
  homeView: HomeView;
  preferredArtistType: ArtistType;
  language: string;
  dateFormat: DateFormat;
}
