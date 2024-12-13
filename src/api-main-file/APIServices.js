import { API_RESPONSE } from 'src/api-main-file/APIResponse'
import axiosInstance from './APIInterceptor'

export const successResponse = ({ data: response, headers }) => {
  const errorMessage =
    typeof response.error == 'object'
      ? Object.entries(response.error)
          .map(item => `${item[1]}`)
          .join(', ')
      : response.error
  return API_RESPONSE(response.data, response.status, 200, errorMessage, response.webVersion, headers.pv)
}

export const errorResponse = (error, url) => {
  let statusCode, errorMessage, webVersion

  if (error.response && error.response.data?.error) {
    statusCode = error.response.status
    errorMessage = typeof error.response.data.error == 'object' ? 'Something went wrong' : error.response.data.error
    webVersion = error.response.data.webVersion
  } else {
    statusCode = 500
    errorMessage = 'Something went wrong'
  }

  if (statusCode == 401) {
    window.location.reload()
    return API_RESPONSE(null, false, statusCode, errorMessage, webVersion, null)
  }

  return API_RESPONSE(null, false, statusCode, errorMessage, webVersion)
}

export const getRequest = async (url, headers = {}) => {
  try {
    const response = await axiosInstance.get(url, {
      headers
    })
    return successResponse(response)
  } catch (err) {
    return errorResponse(err)
  }
}

export const postRequest = async (url, params, headers = {}) => {
  try {
    const response = await axiosInstance.post(url, params, {
      headers: headers
    })

    return successResponse(response)
  } catch (err) {
    return errorResponse(err, url)
  }
}

export const putRequest = async (url, params, headers = {}) => {
  try {
    const response = await axiosInstance.put(url, params, {
      headers: headers
    })

    return successResponse(response)
  } catch (err) {
    return errorResponse(err)
  }
}

export const deleteRequest = async (url, params, headers = {}) => {
  try {
    const response = await axiosInstance.delete(url, {
      data: params,
      headers: headers
    })

    return successResponse(response)
  } catch (err) {
    return errorResponse(err)
  }
}

export const patchRequest = async (url, params, headers = {}) => {
  try {
    const response = await axiosInstance.patch(url, params, {
      headers: headers
    })

    return successResponse(response)
  } catch (err) {
    return errorResponse(err, url)
  }
}

export const downloadGetRequest = async url => {
  try {
    // const response = await axiosInstance.get(url, {
    //   responseType: "blob",
    //   observe: "response"
    // });
    const response = await axiosInstance.post(url, pramas)

    return response
    // return successResponse(response);
  } catch (err) {
    return errorResponse(err)
  }
}
