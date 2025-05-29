import { Badge } from "../ui/badge";
import Image from "next/image"
import { IEventCategory } from "@/app/admin/dropdowns/types";
import React from "react";

interface CategoryChipProps {
    item: IEventCategory;
    style?: React.CSSProperties;
}
const CategoryChip=({item,style}:CategoryChipProps)=>{
    return (
        <Badge
            style={{
                color: item.color,
                backgroundColor: item.bgColor,
                ...style
            }}
            className="h-10 rounded-3xl px-4 gap-2"

        >
            {item?.icon?.url ?
                <Image
                    src={item?.icon?.url}
                    alt="Icon preview"
                    className="object-cover"
                    width={16}
                    height={16}
                /> : <></>}
            {item.name}
        </Badge>
    )
}
export default CategoryChip;