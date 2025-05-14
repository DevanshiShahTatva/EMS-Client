import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

interface SelectItem {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectFieldProps {
    value: string;
    onChange: (value: string) => void;
    items: SelectItem[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
}

const SelectField = ({
    value,
    onChange,
    items,
    placeholder = "Select an option",
    disabled = false,
    className = "",
    triggerClassName = "",
}: SelectFieldProps) => {
    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={`w-full focus:outline-none focus:ring-0 focus:ring-offset-0 border-gray-300 ${triggerClassName}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={className}>
                {items.map((item) => (
                    <SelectItem
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SelectField;