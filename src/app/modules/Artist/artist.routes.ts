import { Router } from 'express';
import { ArtistController } from './artist.controller';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';
import { ArtistValidation } from './artist.validation';

const router = Router();

// Route for updating artist profile
router
  .route('/profile')
  .patch(
    auth(ROLE.ARTIST),
    validateRequest(ArtistValidation.artistProfileSchema),
    ArtistController.updateProfile
  );

// Route for updating artist preferences
router
  .route('/preferences')
  .patch(
    auth(ROLE.ARTIST),
    validateRequest(ArtistValidation.artistPreferencesSchema),
    ArtistController.updatePreferences
  );

// Route for updating artist notification preferences
router
  .route('/notification-preferences')
  .patch(
    auth(ROLE.ARTIST),
    validateRequest(ArtistValidation.artistNotificationSchema),
    ArtistController.updateNotificationPreferences
  );

// Route for updating artist privacy and security settings
router
  .route('/privacy-security')
  .patch(
    auth(ROLE.ARTIST),
    validateRequest(ArtistValidation.artistPrivacySecuritySchema),
    ArtistController.updatePrivacySecuritySettings
  );

export const ArtistRoutes = router;
