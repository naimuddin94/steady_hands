import { Router } from 'express';
import { ArtistController } from './artist.controller';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';
import { ArtistValidation } from './artist.validation';
import { upload } from '../../lib';

const router = Router();

// Route for updating artist profile
router
  .route('/')
  .patch(
    auth(ROLE.ARTIST),
    validateRequest(ArtistValidation.updateSchema),
    ArtistController.updateArtistPersonalInfo
  );

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

router
  .route('/flashes')
  .post(
    auth(ROLE.ARTIST),
    upload.array('files'),
    ArtistController.updateArtistFlashes
  );

router
  .route('/remove-image')
  .delete(auth(ROLE.ARTIST), ArtistController.removeImage);

export const ArtistRoutes = router;
