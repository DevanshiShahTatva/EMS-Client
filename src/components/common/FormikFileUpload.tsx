import React, { useRef, useState, useEffect } from "react";
import { ErrorMessage } from "formik";

// icons
import { TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { API_ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/services/request";
import { toast } from "react-toastify";
import Image from "next/image";
import CustomButton from "./CustomButton";

interface Props {
  name: string;
  defaultImage?: string;
  label?: string;
  fetchUserInfo: () => void;
  userName: string;
  points: number;
  currentBadge: string;
}

const FormikFileUpload: React.FC<Props> = ({
  name,
  defaultImage,
  label = "",
  fetchUserInfo,
  userName,
  points,
  currentBadge
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImage || null
  );
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      // Generate preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      handleProfileImageSubmit(file, false);
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    handleProfileImageSubmit(null, true);
  };

  // Cleanup URL object on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl(defaultImage || null);
  }, [defaultImage]);

  const handleProfileImageSubmit = async (
    file: File | null,
    deleteImage: boolean
  ) => {
    setIsImageLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("profileimage", file);
    }

    if (deleteImage) {
      formData.append("deleteImage", "true");
    }

    const result = await apiCall({
      headers: {},
      endPoint: API_ROUTES.USER.PROFILE.UPDATE_USER_INFO,
      method: "PUT",
      body: formData,
      isFormData: true,
      withToken: true,
    });

    if (result && result.success) {
      toast.success("Profile Updated successfully");
      fetchUserInfo();
    }
    setIsImageLoading(false);
  };

  return (
    <div className="my-4 flex flex-col items-center">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          {label}
        </label>
      )}
      <div className="relative mb-5">
        <div className="w-50 h-50 rounded-full overflow-hidden cursor-pointer border-8 border-white flex items-center justify-center">
          {previewUrl ? (
            <Image
              height={30}
              width={30}
              src={previewUrl}
              alt="Logo"
              className="w-full h-full object-cover bg-white"
            />
          ) : (
            <button className="w-full h-full text-8xl rounded-full bg-indigo-600 text-white font-bold">
              {userName?.charAt(0).toUpperCase()}
            </button>
          )}
        </div>
      </div>

      <p className="text-2xl font-bold text-center">Photo</p>
      <CustomButton
        onClick={handleImageClick}
        startIcon={<ArrowUpTrayIcon className="w-5 h-5 text-white mr-1" />}
        variant="primary"
        className="w-40 mt-10 rounded-[32px] whitespace-nowrap flex justify-center items-center gap-2"
        type="button"
      >
        
        {isImageLoading ? "Uploading..." : "Upload Photo"}
      </CustomButton>

      {previewUrl && previewUrl !== "/assets/ProfileIcon.svg" && (
        <CustomButton
          onClick={handleDelete}
          className="w-40 mt-10 rounded-[32px] whitespace-nowrap flex justify-center items-center gap-2"
          type="button"
          startIcon={<TrashIcon className="w-5 h-5 mr-1 text-white cursor-pointer" />}
          disabled={isImageLoading}
          variant="delete"
        >
           Delete Photo
        </CustomButton>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
        className="hidden"
      />

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormikFileUpload;
