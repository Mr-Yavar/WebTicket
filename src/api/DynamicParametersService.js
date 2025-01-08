import ApiService from "./ApiService";

export const DynamicParametersQueryKeys = {
  get_apiDynamicParametersGetAllParameters: "api/DynamicParameters/GetAllParameters",
  get_apiDynamicParametersGetChildrenbyParentId: (Id)=> `api/DynamicParameters/GetChildrenbyParentId/${Id}`,
  get_apiDynamicParametersDeleteData: (Id)=> `api/DynamicParameters/DeleteData/${Id}`,
  post_apiDynamicParametersManipulateParameter: "api/DynamicParameters/ManipulateParameter",
};

export async function get_apiDynamicParametersGetAllParameters(data) {
  return ApiService.fetchData({
    url: DynamicParametersQueryKeys.get_apiDynamicParametersGetAllParameters,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiDynamicParametersGetChildrenbyParentId(Id) {
  return ApiService.fetchData({
    url: DynamicParametersQueryKeys.get_apiDynamicParametersGetChildrenbyParentId(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiDynamicParametersDeleteData(Id) {
  return ApiService.fetchData({
    url: DynamicParametersQueryKeys.get_apiDynamicParametersDeleteData(Id),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function post_apiDynamicParametersManipulateParameter(data) {
  return ApiService.fetchData({
    url: DynamicParametersQueryKeys.post_apiDynamicParametersManipulateParameter,
    method: 'POST',
body: data,
    headers: { 'api-version': '1.0' },
  });
}

