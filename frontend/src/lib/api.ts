import axios, { type AxiosError } from "axios"

type ApiErrorResponse = {
  detail: string
  instance?: string
  status: number
  title?: string
  errorCode?: string
  timestamp?: string
}

type ApiError = AxiosError<ApiErrorResponse>

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh token logic
let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config

    console.debug("err object", err)

    const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/verify"]

    const isPublicRequest = PUBLIC_PATHS.some((path) =>
      err.config.url.includes(path)
    )

    if (
      err.response?.status === 401 &&
      !isPublicRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            // Recall api
            return api(originalRequest)
          })
          .catch((e) => Promise.reject(e)) // Propagate error
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post("/auth/refresh")
        const newAccessToken = data.accessToken

        localStorage.setItem("access_token", newAccessToken)
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        
        // Recall api
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("access_token")
        window.location.href = "/"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Propagate error
    return Promise.reject(err)
  }
)

export { api, type ApiError }
