import { IEventCategory, ITicketType } from "./types";
import * as Yup from "yup";

export const getPaginatedData = (dataArray: ITicketType[], currentPage: number, itemsPerPage: number) => {
    const result = dataArray.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return result
}
export const getCategoryPaginatedData = (dataArray: IEventCategory[], currentPage: number, itemsPerPage: number) => {
    const result = dataArray.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return result
}

export const getSearchResults = (dataArray: ITicketType[], keyword: string) => {
    const lowerKeyword = keyword.toString().toLowerCase();
    return dataArray.filter(item =>
        item.name.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword)
    );
}

export const getCategorySearchResults = (dataArray: IEventCategory[], keyword: string) => {
    const lowerKeyword = keyword.toString().toLowerCase();
    return dataArray.filter(item => item.name.toLowerCase().includes(lowerKeyword));
}

export const TicketTypeValidationSchema = Yup.object().shape({
    name: Yup.string().required("Ticket type name is required"),
    description: Yup.string(),
});

export const initialTicketTypeFormValues = {
    id: "",
    name: "",
    description: ""
}

export const initialCategoryFormValues = {
    id: "",
    name: "",
    color: "#48A6A7",
    bgColor: "#D1F8EF",
    icon: {
        file: null,
        url: "",
        imageId: ""
    }
}

export const categoryValidationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required")
        .max(30, "Category name must be at most 30 characters"),
    color: Yup.string()
        .required("Please select color")
        .matches(/^#[0-9A-F]{6}$/i, "Invalid hex color format"),
    bgColor: Yup.string()
        .required("Please select color")
        .matches(/^#[0-9A-F]{6}$/i, "Invalid hex color format"),
    icon: Yup.mixed()
        .nullable()
        .test(
            "fileType",
            "Only image files are allowed (JPEG, PNG, SVG, etc.)",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: any) => {
                if (!value || !value.file) return true;
                if (value.file instanceof File) {
                    return value.file.type.startsWith("image/");
                }
                if (value.url) return true;
                return false;
            }
        )
});