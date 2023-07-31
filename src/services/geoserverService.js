const axios = require('axios');

const GEOSERVER_URL = 'http://admin:geoserver@geoserver:8080/geoserver/rest/workspaces/ne';

// Function to create a coverage store on GeoServer
exports.createCoverageStore = async (layerName, minioImageUrl) => {
  const coverageStorePayload = {
    coverageStore: {
      name: layerName,
      workspace: 'ne',
      type: 'GeoTIFF',
      url: `http://minio:9000/${minioImageUrl}`,
      enabled: true,
    },
  };
  await axios.post(`${GEOSERVER_URL}/coveragestores`, coverageStorePayload);
};

// Function to create a coverage on GeoServer
exports.createCoverage = async (layerName) => {
  const coveragePayload = {
    coverage: {
      enabled: true,
      name: layerName,
      store: {
        '@class': 'coverageStore',
        name: layerName,
        href: `${GEOSERVER_URL}/coveragestores/${layerName}.json`,
      },
      nativeFormat: 'GeoTIFF',
      title: 'Layer created via shell script',
    },
  };
  await axios.post(`${GEOSERVER_URL}/coverages`, coveragePayload);
};

// Function to get coverage data from GeoServer
exports.getCoverageData = async (layerName) => {
  const coverageURL = `${GEOSERVER_URL}/coveragestores/${layerName}/coverages/${layerName}`;
  const response = await axios.get(coverageURL, {
    headers: {
      Accept: 'application/json',
    },
  });

  console.log("exports.getCoverageData  response.data");
  console.log(response.data);
  return response.data;
};
