import { Router } from 'express';
import { auth } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';
import { AdminController } from './admin.controller';

const router = Router();

router.route('/folders').get(
  //! auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  AdminController.getFolders
);

router
  .route('/folders/:id')
  .patch(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    AdminController.changeStatusOnFolder
  );

router
  .route('/verified-artist/:artistId')
  .patch(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    AdminController.verifiedArtistByAdmin
  );

router
  .route('/verified-business/:businessId')
  .patch(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    AdminController.verifiedBusinessByAdmin
  );


router.route("/fetch-artists").get(AdminController.fetchAllArtists);
router.route("/fetch-business").get(AdminController.fetchAllBusiness);
router.route("/fetch-client").get(AdminController.fetchAllClient);

export const AdminRoutes = router;
