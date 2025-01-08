import ApiService from "./ApiService";

export const PromotersQueryKeys = {
	/** شطح ادمین */
  get_apiPromotersGetAllPromoters: "api/Promoters/GetAllPromoters",
  get_apiPromotersGetPromoters: "api/Promoters/GetPromoters",
	/** گرفتن  مکان  برگزاری */
  get_apiPromotersGetPromoter: (id)=> `api/Promoters/GetPromoter/${id}`,
  get_apiPromotersTogglePromoter: (PromoterId)=> `api/Promoters/TogglePromoter/${PromoterId}`,
  post_apiPromotersCreatePromoter: "api/Promoters/CreatePromoter",
  put_apiPromotersUpdatePromoter: "api/Promoters/UpdatePromoter",
};

/**
* شطح ادمین
 */
export async function get_apiPromotersGetAllPromoters(data) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.get_apiPromotersGetAllPromoters,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiPromotersGetPromoters(data) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.get_apiPromotersGetPromoters,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن  مکان  برگزاری
 */
export async function get_apiPromotersGetPromoter(id) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.get_apiPromotersGetPromoter(id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiPromotersTogglePromoter(PromoterId) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.get_apiPromotersTogglePromoter(PromoterId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiPromotersCreatePromoter(data) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.post_apiPromotersCreatePromoter,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

export async function put_apiPromotersUpdatePromoter(data) {
  return ApiService.fetchData({
    url: PromotersQueryKeys.put_apiPromotersUpdatePromoter,
    method: 'PUT',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

