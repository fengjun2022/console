import { http } from "@/utils/http";
import type { GetParamDTO, Result } from "@/type";
import { ContentTypeEnum } from "@/enums/requestEnum";

export function userRegisterVerification<T>(params:any): Promise<Result<T>> {
  return http.request({
    url: `/user/verification`,
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


export function passwordChange<T>(data?: object): Promise<Result<T>> {
  return http.request({
    url: "/user/change",
    method: "POST",
    data
  });
}


export function getBookAll<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/word/book/all`,
    method: "GET",
    params
  });
}

export function BookInsertBookSheIf<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: "/shelf/book",
    method: "POST",
    params
  });
}

export function getMyBookShelf<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/shelf/my/shelf`,
    method: "GET",
    params
  });
}

export function getBookAllCourse<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/word/book/course`,
    method: "GET",
    params
  });
}

export function delMyShelf<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: "/shelf/del/my/shelf",
    method: "POST",
    params
  });
}

export function getCourseWord<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/word/all`,
    method: "GET",
    params
  });
}

export function addWordRecite<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/memory/add",
    method: "POST",
    data
  });
}

export function calculateMemory<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/memory/computing`,
    method: "GET",
    params
  });
}

export function getAllPeriodicWord<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/memory/word`,
    method: "POST",
    data
  });
}

export function getAllRecommend<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/memory/select/recommend`,
    method: "POST",
    data
  });
}

export function updateMemoryCycle<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/memory/update",
    method: "POST",
    data
  });
}

export function updateRecommendMemoryCycle<T>(
  data: object
): Promise<Result<T>> {
  return http.request({
    url: "/memory/recommend/next",
    method: "POST",
    data
  });
}

export function updateRecommendMemoryCycleOver<T>(
  data: object
): Promise<Result<T>> {
  return http.request({
    url: "/memory/recommend/over",
    method: "POST",
    data
  });
}

export function GetCycleLog<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/shelf/cycle/log`,
    method: "GET",
    params
  });
}

export function delMyCycleLog<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/shelf/del/cycle/log`,
    method: "POST",
    params
  });
}

export function uploadFile<T>(file: File): Promise<Result<T>> {
  const formData = new FormData();
  formData.append("file", file);
  return http.request({
    url: `/user/upload/img`,
    headers: {
      "Content-Type": ContentTypeEnum.FORM_DATA
    },
    method: "POST",
    data: formData
  });
}

export function UserUpdate<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/user/update",
    method: "POST",
    data
  });
}

export function getUserInfo<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/user/info`,
    method: "GET",
    params
  });
}

export function getAllGrammar<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/grammar/all`,
    method: "GET",
    params
  });
}

export function getNoteThreeAllSearchTitle<T>(
  params: object
): Promise<Result<T>> {
  return http.request({
    url: `/note/all/search`,
    method: "GET",
    params
  });
}

export function getNoteThreeAllSearchTitleList<T>(
  params: object
): Promise<Result<T>> {
  return http.request({
    url: `/note/all/list`,
    method: "GET",
    params
  });
}


export function userUpdateWordForm<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/note/update/form`,
    method: "POST",
    data
  });
}

export function getNoteById<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/all`,
    method: "GET",
    params
  });
}

export function userUpdateForm<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/note/update`,
    method: "POST",
    data
  });
}

export function userDelForm<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/del`,
    method: "POST",
    params
  });
}

export function getNoteContentById<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/content`,
    method: "GET",
    params
  });
}

export function postAnalysis<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/analysis`,
    method: "POST",
    params
  });
}

export function getNoteAllTitle<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/all/title`,
    method: "GET",
    params
  });
}

export function getNoteThreeAllTitle<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: `/note/all/three/title`,
    method: "GET",
    params
  });
}

export function addNoteCycle<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/note/cycle/add`,
    method: "POST",
    data
  });
}

export function getNoteCycleLog<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: `/note/cycle/log`,
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

// 课程管理API
export function getCourseList<T>(params?: object): Promise<Result<T>> {
  return http.request({
    url: `/course/list`,
    method: "GET",
    params
  });
}

export function addCourse<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/course/add",
    method: "POST",
    data
  });
}

export function updateCourse<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/course/update",
    method: "POST",
    data
  });
}

export function deleteCourse<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: "/course/delete",
    method: "POST",
    params
  });
}

// 书籍管理API
export function getBookList<T>(params?: object): Promise<Result<T>> {
  return http.request({
    url: `/book/list`,
    method: "GET",
    params
  });
}

export function addBook<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/book/add",
    method: "POST",
    data
  });
}

export function updateBook<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/book/update",
    method: "POST",
    data
  });
}

export function deleteBook<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: "/book/delete",
    method: "POST",
    params
  });
}

// 单词音频映射API
export function getWordAudioList<T>(params?: object): Promise<Result<T>> {
  return http.request({
    url: `/word-audio/list`,
    method: "GET",
    params
  });
}

export function addWordAudio<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/word-audio/add",
    method: "POST",
    data
  });
}

export function updateWordAudio<T>(data: object): Promise<Result<T>> {
  return http.request({
    url: "/word-audio/update",
    method: "POST",
    data
  });
}

export function deleteWordAudio<T>(params: object): Promise<Result<T>> {
  return http.request({
    url: "/word-audio/delete",
    method: "POST",
    params
  });
}

// 真实API函数
export function addNewBooks<T>(data: { name: string}): Promise<Result<T>> {
    return http.request({
        url: '/word/book/add',
        method: 'POST',
        params: data
    })
}

export function selectBooks<T>(params?: any): Promise<Result<T>> {
    return http.request({
        url: '/word/book/all',
        method: 'GET',
        params
    })
}

export function delBookAndCourseAndWord<T>(params: any): Promise<Result<T>> {
    return http.request({
        url: '/word/book/del',
        method: 'POST',
        params
    })
}

export function updateBooks<T>(params: any): Promise<Result<T>> {
    return http.request({
        url: '/word/book/update',
        method: 'POST',
        params
    })
}

export function getSelectBooks<T>(params?: any): Promise<Result<T>> {
    return http.request({
        url: '/word/book/select',
        method: 'GET',
        params
    })
}

export function addNewCourses<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/word/course/add',
        method: 'POST',
        data
    })
}

export function selectCourse<T>(params?: any): Promise<Result<T>> {
    return http.request({
        url: '/word/course/all',
        method: 'GET',
        params
    })
}

export function delCourseAndWord<T>(params: any): Promise<Result<T>> {
    return http.request({
        url: '/word/course/del',
        method: 'POST',
        params
    })
}

export function getCourseBooks<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/word/course/select',
        method: 'POST',
        data
    })
}

export function addWords<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/word/add',
        method: 'POST',
        data
    })
}

export function getWordsAll<T>(params?: any): Promise<Result<T>> {
    return http.request({
        url: '/word/all',
        method: 'GET',
        params
    })
}

export function delWord<T>(params: any): Promise<Result<T>> {
    return http.request({
        url: '/word/del',
        method: 'POST',
        params
    })
}

export function updateWord<T>(data: any): Promise<Result<T>> {
    return http.request({
        url: '/word/update',
        method: 'POST',
        data
    })
}
