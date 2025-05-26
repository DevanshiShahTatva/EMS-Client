// Libraries
import Cookie from 'js-cookie'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const getAuthToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    return token
}

export const getUserRole = () => {
    const role = localStorage.getItem("role") || sessionStorage.getItem("role") || ""
    return role
}

export const getUserLogo = () => {
    const profileImage = localStorage.getItem("profileImage") || ""
    return profileImage
}

export const setUserLogo = (imgUrl: string) => {
    return localStorage.setItem("profileImage", imgUrl)
}

export const setUserName = (name: string) => {
    localStorage.setItem("name", name);
}

export const getUserName = () => {
    const name = localStorage.getItem("name");
    return name;
}

export const getTruthyString = (value: number | string | undefined | null): string => {
    if (value === null || value === undefined) return "";

    if (typeof value === "number") {
        return isNaN(value) ? "" : value.toString();
    }

    if (typeof value === "string") {
        return value.trim() === "" ? "" : value;
    }

    return "";
};

export const formatNumberShort = (value: number): string => {
    const format = (val: number, suffix: string) =>
        Number.isInteger(val) ? `${val} ${suffix}` : `${val.toFixed(1)} ${suffix}`;

    if (value >= 1_000_000_000) return format(value / 1_000_000_000, 'B');
    if (value >= 1_000_000) return format(value / 1_000_000, 'M');
    if (value >= 1_000) return format(value / 1_000, 'K');
    return value.toString();
};

export const getTruthyNumber = (value: number | string | undefined | null): number => {
    if (value === null || value === undefined) return 0;

    const num = typeof value === "string" ? parseFloat(value) : value;

    return isNaN(num) ? 0 : num;
};

export const RupeeSymbol = "₹"
export const StarSymbol = "⭐"
export const Logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    Cookie.remove("authToken")
}

export const exportToExcel = <T>(data: T[], fileName = "data.xlsx") => {
  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Save to file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
