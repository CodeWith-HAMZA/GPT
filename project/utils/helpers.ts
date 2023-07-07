export function setLocalStorage(name: string, data: object[]) {
  localStorage.setItem(name, JSON.stringify(data));
}
export function getLocalStorage(name: string) {
  const data = JSON.parse(localStorage.getItem(name) ?? "");
  return data ?? [];
}
