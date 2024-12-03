import axios from 'axios'

const axiosInstance = axios.create()

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    let authToken = undefined
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('authToken')
    }

    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`
    } else {
      // change this auth token
      config.headers['Authorization'] =
        'Basic eyJ1c2VyX2lkIjoiNTQ2MSIsInVzZXJfbmFtZSI6Im1hbmFnZXIxQG1haWxpbmF0b3IuY29tIiwidXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlwX2FkZHJlc3MiOiIyMTAuODkuMzQuMTI2IiwiZXhwIjoxNzA3MzgyNzYyfQ'
    }

    // config.headers["Content-Type"] = "application/json";

    return config
  },

  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
