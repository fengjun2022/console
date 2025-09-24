// 存储数据到localStorage
export function saveToLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}

// 从localStorage获取数据
export function getFromLocalStorage(key: string) {
  return localStorage.getItem(key);
}

// 从localStorage删除特定的数据项
export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}
