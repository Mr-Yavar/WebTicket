import ApiService from "./ApiService";

export const ConcertsQueryKeys = {
  get_apiConcertsGetAllConcerts: (CityIds,CategoryIds,searchTxt)=> `api/Concerts/GetAllConcerts?CityIds=${CityIds}&CategoryIds=${CategoryIds}&searchTxt=${searchTxt}`,
  get_apiConcertsGetSpecificConcert: (concertId)=> `api/Concerts/GetSpecificConcert/${concertId}`,
  get_apiConcertsGetSpecificEvent: (eventId)=> `api/Concerts/GetSpecificEvent/${eventId}`,
	/** اطلاعات کلی کنسرت */
  get_apiConcertsGetConcertInfo: (ConcertId)=> `api/Concerts/GetConcertInfo/${ConcertId}`,
	/** رزرو موقت کاربر */
  get_apiConcertsGetReservation: "api/Concerts/GetReservation",
  get_apiConcertsGetUserReservation: (ReservationId)=> `api/Concerts/GetUserReservation/${ReservationId}`,
	/** زمانی که کاربر به مرحله سوم رفت باید اضافه شود */
  post_apiConcertsAddToResevation: "api/Concerts/AddToResevation",
	/** زمانی که کاربر از مرحله سوم برمیگردد */
  post_apiConcertsRemoveFromResevation: "api/Concerts/RemoveFromResevation",
};

export async function get_apiConcertsGetAllConcerts(CityIds,CategoryIds,searchTxt) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetAllConcerts(CityIds,CategoryIds,searchTxt),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiConcertsGetSpecificConcert(concertId) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetSpecificConcert(concertId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiConcertsGetSpecificEvent(eventId) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetSpecificEvent(eventId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* اطلاعات کلی کنسرت
 */
export async function get_apiConcertsGetConcertInfo(ConcertId) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetConcertInfo(ConcertId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* رزرو موقت کاربر
 */
export async function get_apiConcertsGetReservation(data) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetReservation,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiConcertsGetUserReservation(ReservationId) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.get_apiConcertsGetUserReservation(ReservationId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* زمانی که کاربر به مرحله سوم رفت باید اضافه شود
 */
export async function post_apiConcertsAddToResevation(data) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.post_apiConcertsAddToResevation,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

/**
* زمانی که کاربر از مرحله سوم برمیگردد
 */
export async function post_apiConcertsRemoveFromResevation(data) {
  return ApiService.fetchData({
    url: ConcertsQueryKeys.post_apiConcertsRemoveFromResevation,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

