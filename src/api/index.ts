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



// 书籍管理相关
export function selectBooks<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/book/query',
    method: 'POST',
    data
  })
}

export function addNewBooks<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/book/add',
    method: 'PUT',
    data
  })
}

export function updateBooks<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/book/update',
    method: 'POST',
    data
  })
}

export function delBookAndCourseAndWord<T>(data: { id: string | number }): Promise<Result<T>> {
  return http.request({
    url: `/api/book/delById/${data.id}`,
    method: 'DELETE'
  })
}

export function getSelectBooks<T>(data?: any): Promise<Result<T>> {
  return http.request({
    url: '/api/book/select',
    method: 'POST',
    data
  })
}

// 课程管理相关
export function selectCourse<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/course/query',
    method: 'POST',
    data
  })
}

export function addNewCourses<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/course/add',
    method: 'PUT',
    data
  })
}

export function delCourseAndWord<T>(data: { id: string | number }): Promise<Result<T>> {
  return http.request({
    url: `/api/course/delById/${data.id}`,
    method: 'DELETE'
  })
}

export function getCourseBooks<T>(data: { courseId: string | number }): Promise<Result<T>> {
  return http.request({
    url: '/api/course/books',
    method: 'POST',
    data
  })
}

// 单词（词-音频映射）相关
export function getWordsAll<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/word/query',
    method: 'POST',
    data
  })
}

export function addWords<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/word/add',
    method: 'PUT',
    data
  })
}

export function updateWord<T>(data: any): Promise<Result<T>> {
  return http.request({
    url: '/api/word/update',
    method: 'POST',
    data
  })
}

export function delWord<T>(data: { id: string | number }): Promise<Result<T>> {
  return http.request({
    url: `/api/word/delById/${data.id}`,
    method: 'DELETE'
  })
}

export function getTemplateList<T>(): Promise<Result<T>> {
  return http.request({
    url: `/tem/tem_list`,
    method: "GET",
  });
}

export function getTemplateSearchList<T>(params: any): Promise<Result<T>> {
  return http.request({
    url: `/tem/search_list`,
    method: "GET",
    params
  });
}



