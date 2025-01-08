import ApiService from "./ApiService";

export const ManagerQueryKeys = {
  get_apiManagerGetDashboardItem: "api/Manager/GetDashboardItem",
	/** صرفا کنسرت هایی که جاری هستند یعنی زمان پایان آنها فرا نرسیده
صفحه داشبود */
  get_apiManagerGetAllActiveConcerts: (pageSize,currentPage)=> `api/Manager/GetAllActiveConcerts/${pageSize}/${currentPage}`,
  get_apiManagerGetAllConcerts: (pageSize,currentPage)=> `api/Manager/GetAllConcerts/${pageSize}/${currentPage}`,
	/** گرفتن کنتسرهای مرتبط با کاربر
کاربر مدیر مکان برگزاری */
  get_apiManagerGetAllRelatedConcerts: (pageSize,currentPage)=> `api/Manager/GetAllRelatedConcerts/${pageSize}/${currentPage}`,
	/** اطلاعات کنسرت برای ویرایش */
  get_apiManagerGetConcertWithDetails: (ConcertId)=> `api/Manager/GetConcertWithDetails/${ConcertId}`,
	/** اطلاعات کلی کنسرت */
  get_apiManagerGetConcertInfo: (ConcertId)=> `api/Manager/GetConcertInfo/${ConcertId}`,
  get_apiManagerGetAllDiscount: (pageSize,currentPage)=> `api/Manager/GetAllDiscount/${pageSize}/${currentPage}`,
  get_apiManagerGetDiscountById: (Id)=> `api/Manager/GetDiscountById/${Id}`,
  get_apiManagerToggleDiscount: (Id)=> `api/Manager/ToggleDiscount/${Id}`,
	/** ایجاد کنسرت */
  post_apiManagerCreateConcert: "api/Manager/CreateConcert",
  post_apiManagerAddDiscount: "api/Manager/AddDiscount",
  put_apiManagerUpdateDiscount: "api/Manager/UpdateDiscount",
	/** ویرایش کنسرت */
  patch_apiManagerUpdateConcert: "api/Manager/UpdateConcert",
	/** ویرایش اطلاعات کلی کنسرت */
  patch_apiManagerUpdateConcertInfo: "api/Manager/UpdateConcertInfo",
};

export async function get_apiManagerGetDashboardItem(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetDashboardItem,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* صرفا کنسرت هایی که جاری هستند یعنی زمان پایان آنها فرا نرسیده
صفحه داشبود
 */
export async function get_apiManagerGetAllActiveConcerts(pageSize,currentPage) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetAllActiveConcerts(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiManagerGetAllConcerts(pageSize,currentPage) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetAllConcerts(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن کنتسرهای مرتبط با کاربر
کاربر مدیر مکان برگزاری
 */
export async function get_apiManagerGetAllRelatedConcerts(pageSize,currentPage) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetAllRelatedConcerts(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* اطلاعات کنسرت برای ویرایش
 */
export async function get_apiManagerGetConcertWithDetails(ConcertId) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetConcertWithDetails(ConcertId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* اطلاعات کلی کنسرت
 */
export async function get_apiManagerGetConcertInfo(ConcertId) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetConcertInfo(ConcertId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiManagerGetAllDiscount(pageSize,currentPage) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetAllDiscount(pageSize,currentPage),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiManagerGetDiscountById(Id) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerGetDiscountById(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiManagerToggleDiscount(Id) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.get_apiManagerToggleDiscount(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* ایجاد کنسرت
 */
export async function post_apiManagerCreateConcert(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.post_apiManagerCreateConcert,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiManagerAddDiscount(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.post_apiManagerAddDiscount,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

export async function put_apiManagerUpdateDiscount(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.put_apiManagerUpdateDiscount,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

/**
* ویرایش کنسرت
 */
export async function patch_apiManagerUpdateConcert(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.patch_apiManagerUpdateConcert,
    method: 'PATCH',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

/**
* ویرایش اطلاعات کلی کنسرت
 */
export async function patch_apiManagerUpdateConcertInfo(data) {
  return ApiService.fetchData({
    url: ManagerQueryKeys.patch_apiManagerUpdateConcertInfo,
    method: 'PATCH',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

