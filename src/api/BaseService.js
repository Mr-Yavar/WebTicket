const REQUEST_HEADER_AUTH_KEY = 'Authorization'
const TOKEN_TYPE = 'Bearer'

import useUserStore from '@/stores/user'

// Assuming your refresh token logic is in the authSlice
//import { refreshAccessToken } from "../store/auth/sessionSlice"; // Adjust path if needed

const unauthorizedCodes = [401]
const requestTimeout = 60000 // 60 seconds


const getAccessToken = () => {
    return localStorage.getItem('JWTToken')
}

const getRefreshToken = () => {
    return localStorage.getItem('REFRESH_TOKEN') // Assuming you store it like this
}

const baseFetch = async (baseUrl, url, options = {}) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout)

    let headers = {}

    try {
        let accessToken = getAccessToken()

        if (options.headers['content-type'] === null) {
            headers = { 'api-version': options.headers['api-version'] }
        } else if (options.headers['content-type']) {
            headers = {
                // "content-type": options.headers["content-type"],
                ...options.headers
            }
        } else {
            headers = { 'content-type': 'application/json', ...options.headers }
        }

        if (accessToken) {
            headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
        }
        const response = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: headers,
            signal: controller.signal // Enable timeout
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status === 401 && getRefreshToken()) {
                try {
                    // Attempt to refresh the access token
                    //  const newAccessToken = await refreshAccessToken();

                    // Update the access token in localStorage
                    // localStorage.setItem("TOKEN", newAccessToken);

                    // Retry the original request with the new token
                    return baseFetch(url, options)
                } catch (refreshError) {
                    const userStore = useUserStore()
                    console.error('Token refresh failed:', refreshError)
                    // Handle refresh token failure, e.g., redirect to login
                    userStore.logOut()
                }
            } else if (unauthorizedCodes.includes(response.status)) {
                const userStore = useUserStore()
                userStore.logOut()
            }
            throw new Error(`Request failed with status ${response.status}`)
        }

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            return response.json()
        } else {
            return response
        }
    } catch (error) {
        // Handle timeouts
        if (error.name === 'AbortError') {
            console.error('Request timed out')
            throw new Error('Request timed out') // Or handle differently
        }
        throw error
    }
}

// Example usage (same as before):
// ... (getData, postData functions)

export { baseFetch }
