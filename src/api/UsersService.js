import ApiService from "./ApiService";

export const UsersQueryKeys = {
	/** گرفتن همه کابران */
  get_apiUsers: "api/Users",
	/** گرفتن همه نقش های */
  get_apiUsersListRoles: "api/Users/ListRoles",
	/** ایجاد نقش جدید */
  post_apiUsersCreateRole: "api/Users/CreateRole",
	/** بروزرسانی کاربران */
  put_apiUsersUpdateUser: "api/Users/UpdateUser",
};

/**
* گرفتن همه کابران
 */
export async function get_apiUsers(data) {
  return ApiService.fetchData({
    url: UsersQueryKeys.get_apiUsers,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* گرفتن همه نقش های
 */
export async function get_apiUsersListRoles(data) {
  return ApiService.fetchData({
    url: UsersQueryKeys.get_apiUsersListRoles,
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

/**
* ایجاد نقش جدید
 */
export async function post_apiUsersCreateRole(data) {
  return ApiService.fetchData({
    url: UsersQueryKeys.post_apiUsersCreateRole,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

/**
* بروزرسانی کاربران
 */
export async function put_apiUsersUpdateUser(data) {
  return ApiService.fetchData({
    url: UsersQueryKeys.put_apiUsersUpdateUser,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'api-version': '1.0' },
  });
}

