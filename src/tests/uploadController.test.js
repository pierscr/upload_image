// tests/uploadController.test.js

const { createMockProxy } = require('jest-mock-extended');
const uploadController = require('../controllers/uploadController');
const geoserverService = require('../services/geoserverService');
const imageUploader = require('../utils/imageUploader');

describe('Upload Controller', () => {
  let mockGeoserverService;
  let mockImageUploader;

  beforeEach(() => {
    // Crea i mock delle dipendenze
    mockGeoserverService = createMockProxy(geoserverService);
    mockImageUploader = createMockProxy(imageUploader);

    // Inietta i mock nel controller
    uploadController.setGeoserverService(mockGeoserverService);
    uploadController.setImageUploader(mockImageUploader);
  });

  it('should upload file to Minio', async () => {
    // Mock delle dipendenze
    const mockMinioImageUrl = 'public-tif-bucket/image-123.tif';
    mockImageUploader.uploadImage.mockResolvedValue(mockMinioImageUrl);

    // Chiamata alla funzione del controller
    const req = { query: { parcelId: '123', date: '2023-07-30', type: 'crop', source: 'satellite' }, file: { path: 'test/image-123.tif' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await uploadController.uploadImage(req, res);

    // Verifica dei risultati
    expect(mockImageUploader.uploadImage).toHaveBeenCalledWith('test/image-123.tif');
    expect(mockGeoserverService.createCoverageStore).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(mockGeoserverService.createCoverage).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image uploaded and processed successfully.' });
  });

  it('should handle errors during upload', async () => {
    // Mock delle dipendenze
    const mockError = new Error('Upload error');
    mockImageUploader.uploadImage.mockRejectedValue(mockError);

    // Chiamata alla funzione del controller
    const req = { query: { parcelId: '123', date: '2023-07-30', type: 'crop', source: 'satellite' }, file: { path: 'test/image-123.tif' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await uploadController.uploadImage(req, res);

    // Verifica dei risultati
    expect(mockImageUploader.uploadImage).toHaveBeenCalledWith('test/image-123.tif');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
  });

  // Altri test per casi di errore e comportamenti del controller...
});
