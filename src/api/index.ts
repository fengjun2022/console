import { http } from "@/utils/http";
import type { GetParamDTO, Result } from "@/type";
import { ContentTypeEnum } from "@/enums/requestEnum";

export function getUserInfo<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/user/info`,
    method: "GET",
    params
  });
}

export function userLogin<T>(data?: object): Promise<Result<T>> {
  return http.request({
    url: "/login",
    method: "POST",
    data
  });
}

export function uploadBookFile<T>(file: File): Promise<Result<T>> {
  const formData = new FormData();
  formData.append("file", file);
  return http.request({
    url: `/file/upload/book`,
    headers: {
      "Content-Type": ContentTypeEnum.FORM_DATA
    },
    method: "POST",
    data: formData
  });
}

// 获取招标文件审核表格接口
export function getTenderQuery<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/api/tender/query',
        method: 'POST',
        data
    })
}

// 新增招标信息
export function tenderQueryAdd<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/api/tender/add',
        method: 'PUT',
        data
    })
}

// 根据ID删除单条记录
export function tenderDelById<T>(id: any): Promise<Result<T>> {
    return http.request({
        url: `/api/tender/delById/${id}`,
        method: 'DELETE',
    })
}