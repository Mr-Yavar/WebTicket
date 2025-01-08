import ApiService from "./ApiService";

export const AdminQueryKeys = {
	/** گرفتن همه کاربران به صورت صفحه بندی
نقش ادمین سیستم */
  get_apiAdminGetUsers: (pageSize,currentPage,name)=> `api/Admin/GetUsers/${pageSize}/${currentPage}?name=${name}`,
	/** گرفتن  کاربر
نقش ادمین سیستم */
  get_apiAdminGetUser: (UserId)=> `api/Admin/GetUser/${UserId}`,
  get_apiAdminGetUserPayments: (UserId,pageSize,currentPage)=> `api/Admin/GetUserPayments/${UserId}/${pageSize}/${currentPage}`,
  get_apiAdminGetUserReservations: (UserId,pageSize,currentPage)=> `api/Admin/GetUserReservations/${UserId}/${pageSize}/${currentPage}`,
  get_apiAdminGetConcertReservations: (ConcertId,pageSize,currentPage)=> `api/Admin/GetConcertReservations/${ConcertId}/${pageSize}/${currentPage}`,
	/** ویرایش اطلاعات کاربر
نقش ادمین سیستم */
  put_apiAdminUpdateUser: "api/Admin/UpdateUser",
};

/**
* گرفتن همه کاربران به صورت صفحه بندی
نقش ادمین سیستم
 */
export async function get_apiAdminGetUsers(pageSize,currentPage,name) {
  return ApiService.fetchData({
    url: AdminQueryKeys.get_apiAdminGetUsers(pageSize,currentPage,name),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن  کاربر
نقش ادمین سیستم
 */
export async function get_apiAdminGetUser(UserId) {
  return ApiService.fetchData({
    url: AdminQueryKeys.get_apiAdminGetUser(UserId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiAdminGetUserPayments(UserId,pageSize,currentPage) {
  return ApiService.fetchData({
    url: AdminQueryKeys.get_apiAdminGetUserPayments(UserId,pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiAdminGetUserReservations(UserId,pageSize,currentPage) {
  return ApiService.fetchData({
    url: AdminQueryKeys.get_apiAdminGetUserReservations(UserId,pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiAdminGetConcertReservations(ConcertId,pageSize,currentPage) {
  return ApiService.fetchData({
    url: AdminQueryKeys.get_apiAdminGetConcertReservations(ConcertId,pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* ویرایش اطلاعات کاربر
نقش ادمین سیستم
 */
export async function put_apiAdminUpdateUser(data) {
  return ApiService.fetchData({
    url: AdminQueryKeys.put_apiAdminUpdateUser,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

