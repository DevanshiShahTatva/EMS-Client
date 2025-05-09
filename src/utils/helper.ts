
export const getAuthToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    return token
}

export const getUserLogo = () => {
    const profileImage = localStorage.getItem("profileImage") || ""
    return profileImage
}

export const setUserLogo = (imgUrl : string) => {
    return localStorage.setItem("profileImage", imgUrl)
}

export const setUserName = (name: string) => {
    localStorage.setItem("name", name);
}

export const setUserAddress = (country: string, state: string, city: string) => {
    localStorage.setItem("country", country);
    localStorage.setItem("state", state);
    localStorage.setItem("city", city);
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