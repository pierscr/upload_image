// Define CropMap model schema if needed
// /src/models/cropmap.js
const getMongoObject = (parcelId, date, type, source, layerName, coverageData) => {
  const imageName = `${type}-${parcelId}-${date}-${source}.tif`;

  return {
    requestDate: date,
    sensingDate: new Date().toISOString(),
    status: 'completed',
    style: `cropgrowth_${type}`,
    workspace: 'ne',
    layername: layerName,
    layerlabel: layerName,
    type: type,
    parcelId: parseInt(parcelId),
    coverage: coverageData.coverage // Add coverage data to mongoObject
  };
};

module.exports = {
  getMongoObject
};
