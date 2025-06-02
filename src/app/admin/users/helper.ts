import { IApplyUserFiltersKey, IUserPoints } from "@/utils/types";
import { IUserData } from "./types";
import * as Yup from "yup";

export const SingleUserFormSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be no more than 50 characters")
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
    role: Yup.string().oneOf(["user", "organizer"]).required("Role is required"),
});

export const InitialSingleUserValues = {
    name: "",
    email: "",
    role : ""
}


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