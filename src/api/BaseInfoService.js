import ApiService from "./ApiService";

export const BaseInfoQueryKeys = {
  get_apiBaseInfoGetCategories: "api/BaseInfo/GetCategories",
  get_apiBaseInfoGetPlaces: "api/BaseInfo/GetPlaces",
  get_apiBaseInfoGetHallsByPlaceId: (Id)=> `api/BaseInfo/GetHallsByPlaceId?Id=${Id}`,
  get_apiBaseInfoGetHallsAndFloorsByPlaceId: (Id)=> `api/BaseInfo/GetHallsAndFloorsByPlaceId?Id=${Id}`,
  get_apiBaseInfoGetPromoters: "api/BaseInfo/GetPromoters",
  get_apiBaseInfoGetParametersByKey: (Key)=> `api/BaseInfo/GetParametersByKey/${Key}`,
};

export async function get_apiBaseInfoGetCategories(data) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetCategories,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiBaseInfoGetPlaces(data) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetPlaces,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiBaseInfoGetHallsByPlaceId(Id) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetHallsByPlaceId(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiBaseInfoGetHallsAndFloorsByPlaceId(Id) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetHallsAndFloorsByPlaceId(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiBaseInfoGetPromoters(data) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetPromoters,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiBaseInfoGetParametersByKey(Key) {
  return ApiService.fetchData({
    url: BaseInfoQueryKeys.get_apiBaseInfoGetParametersByKey(Key),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

