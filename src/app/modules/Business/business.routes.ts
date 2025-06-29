import { Router } from 'express';
import { BusinessController } from './business.controller';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';
import { BusinessValidation } from './business.validation';

const router = Router();

router
  .route('/profile')
  .patch(
    auth(ROLE.BUSINESS),
    validateRequest(BusinessValidation.businessProfileSchema),
    BusinessController.updateBusinessProfile
  );

router
  .route('/preferences')
  .patch(
    auth(ROLE.BUSINESS),
    validateRequest(BusinessValidation.businessPreferencesSchema),
    BusinessController.updateBusinessPreferences
  );

router
  .route('/notification-preferences')
  .patch(
    auth(ROLE.BUSINESS),
    validateRequest(BusinessValidation.businessNotificationSchema),
    BusinessController.updateBusinessNotificationPreferences
  );

router
  .route('/security-settings')
  .patch(
    auth(ROLE.BUSINESS),
    validateRequest(BusinessValidation.businessSecuritySettingsSchema),
    BusinessController.updateBusinessSecuritySettings
  );

// Route to block new dates manually for a business
router
  .route('/time-off')
  .patch(
    auth(ROLE.BUSINESS),
    validateRequest(BusinessValidation.timeOffSchema),
    BusinessController.updateTimeOff
  );

router
  .route('/resident-artist/:artistId')
  .delete(BusinessController.removeArtist);

export const BusinessRoutes = router;
