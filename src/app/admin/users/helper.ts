import { IApplyUserFiltersKey, IUserPoints } from "@/utils/types";
import { IUserData } from "./types";

export const getMaxPoints = (userArr: IUserData[]): number => {
    const pointsArray = userArr.map(item => item.points)
    return Math.max(...pointsArray);
};

export const filterBySearch = (array: IUserData[], searchVal: string) => {
    const lowerKeyword = searchVal.toString().toLowerCase();
    return array.filter(user =>
        user.name.toLowerCase().includes(lowerKeyword) ||
        user.email.toLowerCase().includes(lowerKeyword) ||
        user.badge.toLowerCase().includes(lowerKeyword) ||
        user.address.toLowerCase().includes(lowerKeyword) ||
        user.points.toString().toLowerCase().includes(lowerKeyword) ||
        user.role.toString().toLowerCase().includes(lowerKeyword)
    );
}

export const filterByPointRange = (
  users: IUserData[],
  pointsrange: IUserPoints
): IUserData[] => {
  const { min, max } = pointsrange;

  return users.filter(user => user.points >= min && user.points <= max);
};

export const getFilteredData = (userData: IUserData[], filterValues: IApplyUserFiltersKey) => {
    let data = [...userData]
    let activeFiltersKey = 0

    const { badges, role, pointRange ,search } = filterValues

    if (search && search.trim() !== "") {
        data = filterBySearch(data, search)
    }

    if (badges && badges.length > 0) {
        data = data.filter(item => badges.includes(item.badge.toLowerCase()))
        activeFiltersKey = activeFiltersKey + 1
    }

    if (role && role.trim() !== "") {
        data = data.filter(item => item.role === role)
        activeFiltersKey = activeFiltersKey + 1
    }

    if (pointRange && pointRange.max && pointRange.min > -1) {
        data = filterByPointRange(data, pointRange)
        activeFiltersKey = activeFiltersKey + 1
    }

    return { data, filterCount: activeFiltersKey }
}