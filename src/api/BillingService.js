import ApiService from "./ApiService";

export const BillingQueryKeys = {
  get_apiBillingGetDiscount: (TempReservationId,Code)=> `api/Billing/GetDiscount/${TempReservationId}/${Code}`,
  post_apiBillingPay: "api/Billing/Pay",
  post_apiBillingVerify: "api/Billing/Verify",
};

export async function get_apiBillingGetDiscount(TempReservationId,Code) {
  return ApiService.fetchData({
    url: BillingQueryKeys.get_apiBillingGetDiscount(TempReservationId,Code),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiBillingPay(data) {
  return ApiService.fetchData({
    url: BillingQueryKeys.post_apiBillingPay,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiBillingVerify(data) {
  return ApiService.fetchData({
    url: BillingQueryKeys.post_apiBillingVerify,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

