import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ClientRoutes } from '../modules/Client/client.route';
import { ArtistRoutes } from '../modules/Artist/artist.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/clients',
    route: ClientRoutes,
  },
  {
    path: '/artists',
    route: ArtistRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
