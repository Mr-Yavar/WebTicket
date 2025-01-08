import ApiService from "./ApiService";

export const AuthenticationQueryKeys = {
  post_apiauthenticationregister: "api/authentication/register",
  post_apiauthenticationlogin: "api/authentication/login",
  post_apiauthenticationrefresh: "api/authentication/refresh",
};

export async function post_apiauthenticationregister(data) {
  return ApiService.fetchData({
    url: AuthenticationQueryKeys.post_apiauthenticationregister,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiauthenticationlogin(data) {
  return ApiService.fetchData({
    url: AuthenticationQueryKeys.post_apiauthenticationlogin,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiauthenticationrefresh(data) {
  return ApiService.fetchData({
    url: AuthenticationQueryKeys.post_apiauthenticationrefresh,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

