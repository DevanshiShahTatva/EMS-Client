"use client";
import Image from "next/image";
import { useFormik } from "formik";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TCategoryFormValues } from "@/app/admin/dropdowns/types";
import { Badge } from "@/components/ui/badge";
import { getTruthyString } from "@/utils/helper";
import { categoryValidationSchema } from "@/app/admin/dropdowns/helper";
import ModalLayout from "../common/CommonModalLayout";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: TCategoryFormValues) => void;
    formData: TCategoryFormValues;
    submitLoading?: boolean
};

export default function EventCategoryFormModal({
    onClose,
    onSubmit,
    formData,
    submitLoading = false
}: Props) {
    const formik = useFormik({
        initialValues: formData,
        validationSchema: categoryValidationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                formik.setFieldValue("icon", {
                    ...formik.values.icon,
                    file,
                    previewUrl: event.target?.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveIcon = () => {
        formik.setFieldValue("icon", {
            ...formik.values.icon,
            file: null,
            previewUrl: null,
        });
        const fileInput = document.getElementById('icon-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div>
            {/* FORM */}
            <form onSubmit={formik.handleSubmit} className="">
                <ModalLayout
                    onClose={onClose}
                    modalTitle={`${formData?.id ? "Edit" : "Add"} Category`}
                    footerActions={[
                        { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
                        { label: submitLoading ? "Saving..." : "Save", type: "submit", variant: "primary" }
                    ]}
                >
                    <div className="space-y-6 py-6 px-2">


                        <div>
                            <Label className="mb-2">Category Name</Label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                placeholder="Enter Category Name"
                                className={`w-full px-4 py-2 border 
                                ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"}
                                focus:ring-blue-500 focus:border-blue-500 rounded-lg 
                                focus:outline-none focus:ring-1
                                outline-none transition-all`}
                                maxLength={30}
                                autoFocus={false}
                                autoComplete="off"
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                            ) : null}
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label className="mb-2">Text Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        name="color"
                                        value={formik.values.color}
                                        onChange={formik.handleChange}
                                        className={`h-10 w-full px-4 py-2 border 
                                    ${formik.touched.color && formik.errors.color ? "border-red-500" : "border-gray-300"}
                                    focus:ring-blue-500 focus:border-blue-500 rounded-lg 
                                    focus:outline-none focus:ring-1
                                    outline-none transition-all cursor-pointer`}
                                    />
                                </div>
                                {formik.touched.color && formik.errors.color ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.color}</div>
                                ) : null}
                            </div>

                            <div className="w-1/2">
                                <Label className="mb-2">Background Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        name="bgColor"
                                        value={formik.values.bgColor}
                                        onChange={formik.handleChange}
                                        className={`h-10 w-full px-4 py-2 border 
                                    ${formik.touched.bgColor && formik.errors.bgColor ? "border-red-500" : "border-gray-300"}
                                    focus:ring-blue-500 focus:border-blue-500 rounded-lg 
                                    focus:outline-none focus:ring-1
                                    outline-none transition-all cursor-pointer`}
                                    />
                                </div>
                                {formik.touched.bgColor && formik.errors.bgColor ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.bgColor}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-1/2">
                                <Label className="mb-2">Upload Icon</Label>
                                <div className="relative flex justify-center items-center rounded-lg bg-gray-100">
                                    <Input
                                        id="icon-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {!formik.values.icon?.previewUrl ? (
                                        <label
                                            htmlFor="icon-upload"
                                            className="flex flex-col items-center justify-center w-full h-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                                        >
                                            <Upload className="w-4 h-4 text-black " />
                                        </label>
                                    ) : (
                                        <div className="relative w-10 h-10 flex justify-center items-center">
                                            <Image
                                                src={formik.values.icon?.previewUrl || formik.values.icon?.url}
                                                alt="Icon"
                                                height={24}
                                                width={24}
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveIcon}
                                                className="cursor-pointer absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-2 h-2" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                                {formik.touched.icon && formik.errors.icon ? (
                                    <div className="text-red-500 text-sm mt-1">
                                        {getTruthyString(formik.errors.icon as string)}
                                    </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <Label className="mb-2">Preview</Label>
                                {formik.values?.name ?
                                    <Badge
                                        style={{
                                            color: formik.values?.color,
                                            backgroundColor: formik.values?.bgColor,
                                        }}
                                        className="h-10 rounded-3xl px-4 gap-2"
                                    >
                                        {formik.values.icon?.previewUrl ?
                                            <Image
                                                src={formik.values.icon?.previewUrl}
                                                alt="Icon preview"
                                                className="object-cover"
                                                width={16}
                                                height={16}
                                            /> : <></>}
                                        {formik.values?.name}
                                    </Badge>
                                    : <></>}
                            </div>
                        </div>

                    </div>

                </ModalLayout>
            </form>
        </div>
    );
}