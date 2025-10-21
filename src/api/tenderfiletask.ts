import { http } from "@/utils/http";
import type { GetParamDTO, Result } from "@/type";
import { ContentTypeEnum } from "@/enums/requestEnum";

export function addTenderData<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/tenderFileTask/add',
    method: 'POST',
    data
  })
}


export function searchTenderDataList<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/tenderFileTask/search',
    method: 'POST',
    data
  })
}
// 根据ID删除单条记录
export function tenderDelById<T>(data): Promise<Result<T>> {
  return http.request({
    url: `/tenderFileTask/del`,
    method: 'DELETE',
    data
  })
}



export function tenderStart<T>(id: any): Promise<Result<T>> {
  return http.request({
    url: `/tenderFileTask/start/${id}`,
    method: 'POST',
  })
}


export function getResult<T>(params: any): Promise<Result<T>> {
  return http.request({
    url: `/result/get`,
    method: 'GET',
    params
  })
}

