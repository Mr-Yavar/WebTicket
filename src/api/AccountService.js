import ApiService from "./ApiService";

export const AccountQueryKeys = {
  get_apiAccountGetProfile: "api/Account/GetProfile",
  get_apiAccountMyReservation: (pageSize,currentPage)=> `api/Account/MyReservation/${pageSize}/${currentPage}`,
  get_apiAccountAllPayments: (pageSize,currentPage)=> `api/Account/AllPayments/${pageSize}/${currentPage}`,
  put_apiAccountUpdateProfile: "api/Account/UpdateProfile",
  put_apiAccountUpdatePassword: "api/Account/UpdatePassword",
};

export async function get_apiAccountGetProfile(data) {
  return ApiService.fetchData({
    url: AccountQueryKeys.get_apiAccountGetProfile,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiAccountMyReservation(pageSize,currentPage) {
  return ApiService.fetchData({
    url: AccountQueryKeys.get_apiAccountMyReservation(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiAccountAllPayments(pageSize,currentPage) {
  return ApiService.fetchData({
    url: AccountQueryKeys.get_apiAccountAllPayments(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function put_apiAccountUpdateProfile(data) {
  return ApiService.fetchData({
    url: AccountQueryKeys.put_apiAccountUpdateProfile,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

export async function put_apiAccountUpdatePassword(data) {
  return ApiService.fetchData({
    url: AccountQueryKeys.put_apiAccountUpdatePassword,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

