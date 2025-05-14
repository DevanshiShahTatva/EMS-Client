import { IHistory } from "./page";

export const filterBySearch = (data: IHistory[], search: string) => {
  if (search && search.trim() !== "") {
    const lowerKeyword = search.toString().toLowerCase();
    return data.filter(item =>
      item.description.toLowerCase().includes(lowerKeyword) ||
      item.activityType.toLowerCase().includes(lowerKeyword) ||
      item.points.toString().includes(lowerKeyword) ||
      item.createdAt.toLowerCase().includes(lowerKeyword)
    );
  }
  return data;
}

export const sortData = (
  data: IHistory[],
  key: string,
  order: "asc" | "desc" = "asc"
): IHistory[] => {

  return [...data].sort((a, b) => {
    let valA = a[key as keyof IHistory];
    let valB = b[key as keyof IHistory];

    if (key === "createdAt") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    if (typeof valA === "string" && typeof valB === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
};

export const getPaginatedData = (dataArray: IHistory[], currentPage: number, itemsPerPage: number) => {
  const result = dataArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return result;
} 