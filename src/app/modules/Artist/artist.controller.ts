import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { ArtistService } from './artist.service';

const updateProfile = asyncHandler(async (req, res) => {
  const result = await ArtistService.updateProfile(req.user, req.body);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Artist profile updated successfully')
    );
});

const updatePreferences = asyncHandler(async (req, res) => {
  const result = await ArtistService.updatePreferences(req.user, req.body);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Artist preferences updated successfully'
      )
    );
});

const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const result = await ArtistService.updateNotificationPreferences(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Artist notification preferences updated successfully'
      )
    );
});

const updatePrivacySecuritySettings = asyncHandler(async (req, res) => {
  const result = await ArtistService.updatePrivacySecuritySettings(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Artist privacy and security settings updated successfully'
      )
    );
});

const updateArtistFlashes = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ArtistService.addFlashesIntoDB(req.user, files);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Flashes update successfully'));
});

const updateArtistPortfolio = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ArtistService.addPortfolioImages(req.user, files);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Flashes update successfully'));
});

const removeImage = asyncHandler(async (req, res) => {
  const filePath = req.body.filePath;
  const result = await ArtistService.removeImage(req.user, filePath);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Flash remove successfully'));
});

const updateArtistPersonalInfo = asyncHandler(async (req, res) => {
  const result = await ArtistService.updateArtistPersonalInfoIntoDB(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Update profile successfully'));
});

const saveAvailability = asyncHandler(async (req, res) => {
  const result = await ArtistService.saveAvailabilityIntoDB(req.user, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Save availability successfully'));
});

const fetchAllArtists = asyncHandler(async (req, res) => {
  const { data, meta } = await ArtistService.fetchAllArtistsFromDB(req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, data, 'Artists retrieved successfully', meta)
    );
});

export const ArtistController = {
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySecuritySettings,
  updateArtistFlashes,
  removeImage,
  updateArtistPersonalInfo,
  updateArtistPortfolio,
  saveAvailability,
  fetchAllArtists,
};
