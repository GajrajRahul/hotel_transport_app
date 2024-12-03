export const API_RESPONSE = (data, status, statusCode, error, webVersion, projectVersion) => {
  return {
    data,
    status,
    statusCode,
    error,
    webVersion,
    projectVersion
  }
}
