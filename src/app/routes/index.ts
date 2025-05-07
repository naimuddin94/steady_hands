import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ClientRoutes } from '../modules/Client/client.route';
import { ArtistRoutes } from '../modules/Artist/artist.routes';
import { BusinessRoutes } from '../modules/Business/business.routes';
import { BookingRoutes } from '../modules/Booking/booking.route';
import { FolderRoutes } from '../modules/Folder/folder.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { RequestRoute } from '../modules/Request/request.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
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
  {
    path: '/business',
    route: BusinessRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/folders',
    route: FolderRoutes,
  },
  {
    path: '/requests',
    route: RequestRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
