import ApiService from "./ApiService";

export const PlaceQueryKeys = {
	/** گرفتن تمامی مکان های برگزاری */
  get_apiPlaceGetAllPlaces: "api/Place/GetAllPlaces",
	/** گرفتن  مکان  برگزاری */
  get_apiPlaceGetPlace: (id)=> `api/Place/GetPlace?id=${id}`,
	/** گرفتن تمامی سالن های یک مکان برگزاری */
  get_apiPlaceGetHallsByPlaceId: (placeId)=> `api/Place/GetHallsByPlaceId?placeId=${placeId}`,
	/** گرفتن جزئیات یک سالن */
  get_apiPlaceGetHallById: (Id)=> `api/Place/GetHallById?Id=${Id}`,
  get_apiPlaceTogglePlace: (PlaceId)=> `api/Place/TogglePlace/${PlaceId}`,
  get_apiPlaceToggleHall: (PlaceId)=> `api/Place/ToggleHall/${PlaceId}`,
	/** ساختن مکان برگزاری */
  post_apiPlaceCreatePlace: "api/Place/CreatePlace",
	/** ایجاد یک سالن */
  post_apiPlaceCreateHall: "api/Place/CreateHall",
	/** ویرایش اطلاعات یک مکان برگزاری */
  put_apiPlaceUpdatePlace: "api/Place/UpdatePlace",
  patch_apiPlaceUpdateHall: "api/Place/UpdateHall",
};

/**
* گرفتن تمامی مکان های برگزاری
 */
export async function get_apiPlaceGetAllPlaces(data) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceGetAllPlaces,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن  مکان  برگزاری
 */
export async function get_apiPlaceGetPlace(id) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceGetPlace(id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن تمامی سالن های یک مکان برگزاری
 */
export async function get_apiPlaceGetHallsByPlaceId(placeId) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceGetHallsByPlaceId(placeId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن جزئیات یک سالن
 */
export async function get_apiPlaceGetHallById(Id) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceGetHallById(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiPlaceTogglePlace(PlaceId) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceTogglePlace(PlaceId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiPlaceToggleHall(PlaceId) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.get_apiPlaceToggleHall(PlaceId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* ساختن مکان برگزاری
 */
export async function post_apiPlaceCreatePlace(data) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.post_apiPlaceCreatePlace,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

/**
* ایجاد یک سالن
 */
export async function post_apiPlaceCreateHall(data) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.post_apiPlaceCreateHall,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

/**
* ویرایش اطلاعات یک مکان برگزاری
 */
export async function put_apiPlaceUpdatePlace(data) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.put_apiPlaceUpdatePlace,
    method: 'PUT',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

export async function patch_apiPlaceUpdateHall(data) {
  return ApiService.fetchData({
    url: PlaceQueryKeys.patch_apiPlaceUpdateHall,
    method: 'PATCH',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

