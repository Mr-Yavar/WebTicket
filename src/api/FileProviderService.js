import ApiService from "./ApiService";

export const FileProviderQueryKeys = {
  get_apiFileProviderFile: (fileName)=> `api/FileProvider/File/${fileName}`,
  get_apiFileProviderFile: (FileId)=> `api/FileProvider/File?FileId=${FileId}`,
};

export async function get_apiFileProviderFile(fileName) {
  return ApiService.fetchData({
    url: FileProviderQueryKeys.get_apiFileProviderFile(fileName),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

export async function get_apiFileProviderFile(FileId) {
  return ApiService.fetchData({
    url: FileProviderQueryKeys.get_apiFileProviderFile(FileId),
    method: 'GET',
    headers: { 'api-version': '1.0' },
  });
}

