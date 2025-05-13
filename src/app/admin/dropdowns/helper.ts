import { ITicketType } from "./types";
import * as Yup from "yup";

export const getPaginatedData = (dataArray: ITicketType[], currentPage: number, itemsPerPage: number) => {
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

export const TicketTypeValidationSchema = Yup.object().shape({
    name: Yup.string().required("Ticket type name is required"),
    description: Yup.string(),
});

export const initialTicketTypeFormValues = {
    id: "",
    name: "",
    description: ""
}