




import axios from 'axios'

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://sm-tech-sphere-mem9.onrender.com/api',
})

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sm_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // FormData requests need the browser to set
    // Content-Type with the correct multipart boundary.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else if (config.data !== undefined && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default API
