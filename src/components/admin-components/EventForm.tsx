"use client"

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'

// Custom Compoents
import Loader from '@/components/common/Loader';
import CustomTextField from './InputField';
import QuilEditor from './QuilEditor';
import AddressAutocomplete from './AddressAutoComplete.web';
import CustomSelectField from './SelectField';
import CustomDateTimePicker from './DateTimePicker';
import CustomButton from '../common/CustomButton';
import Breadcrumbs from '../common/BreadCrumbs';
import TitleSection from '../common/TitleSection';
import ImageUploadGrid from './ImageUploadSection';
import SeatingModal from './SeatingModal';
import AddEditSeatLayout from './AddEditSeatLayout';
import ViewSeatLayout from './ViewSeatLayout';

// types import
import { EventDataObjResponse, EventImage } from '@/utils/types';
import { IEventFormData, IEventFormDataErrorTypes, IEventFormProps, ILocationField, ISeatLayout, ISeatLayoutResponse, ITicket, ITicketInfo } from '../../app/admin/event/types';
import { IEventCategory, ITicketType, ITicketTypesResp, IEventCategoryResp } from '@/app/admin/dropdowns/types';

// library support 
import moment from 'moment';
import { PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { marked } from "marked";

// constant import
import { ALLOWED_FILE_FORMATS, API_ROUTES, MAX_FILE_SIZE_MB, ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant';

// helper functions
import { apiCall } from '@/utils/services/request';
import { InitialEventFormDataErrorTypes, InitialEventFormDataValues, InitialTicketItems, handleFreeTicketType, urlToFileArray } from '../../app/admin/event/helper';

const EventForm: React.FC<IEventFormProps> = ({ eventType , isCloneEvent = false }) => {

  const router = useRouter();
  const isEditMode = eventType !== "create" ? true : false

  const [formValues, setFormValues] = useState<IEventFormData>(InitialEventFormDataValues)
  const [formValuesError, setFormValuesError] = useState<IEventFormDataErrorTypes>(InitialEventFormDataErrorTypes)
  const [cloneEventTitle, setCloneEventTitle] = useState("")

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [addRowVisible, setAddRowVisible] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<boolean>(false);

  const [ticketErrorMsg, setTicketErrorMsg] = useState("")

  const [newTicket, setNewTicket] = useState<Omit<ITicket, "id">>({
    type: "",
    price: "",
    maxQty: "",
    description: "",
    _id: "",
    isDisabled: true,
  });

  const [editCache, setEditCache] = useState<{ [key: string]: Partial<ITicket> }>({});

  const [images, setImages] = useState<File[]>([]);
  const [fileError, setFileError] = useState<null | string>(null)
  const [existingImages, setExistingImages] = useState<(EventImage | File)[]>([])
  const [loader, setLoder] = useState(false)

   const hasTouchedDescription = useRef(false);

  // CATEGORY AND TICKET TYPE
  const [categoriesOptions, setCategoriesOptions] = useState<IEventCategory[]>([])
  const [ticketTypeOptions, setTicketTypeOptions] = useState<ITicketType[]>([])


  const [selectedLayoutItems, setSelectedLayoutItems] = useState<ITicketInfo>(InitialTicketItems);
  const [openLayoutModal, setOpenLayoutModal] = useState(false);
  const [viewLayoutModal, setViewLayoutModal] = useState(false);
  const [editableId, setEditableId] = useState("");

  const [layoutArray, setLayoutArray] = useState<ISeatLayout[]>([])
  const [editableLayoutArray, setEditableLayoutArray] = useState<ISeatLayout[]>([])


  const openViewModal = () => {
     setViewLayoutModal(true)
  }

  const closeViewModal = () => {
     setViewLayoutModal(false)
  }

  const openEditModal = (ticketInfo: ITicket) => {
    const editArray = layoutArray.filter(item => item.id === ticketInfo.type)
    const label = ticketTypeOptions.find(item => item._id === ticketInfo.type)?.name
    
    const selectedTicketItem: ITicketInfo = {
      id: ticketInfo.type || "",
      ticketPrice: ticketInfo.price || "",
      ticketType: label || "",
      totalSeats: ticketInfo.maxQty || "",
    }
    setEditableLayoutArray(editArray)
    setEditableId(ticketInfo.type)
    setSelectedLayoutItems(selectedTicketItem)
    setOpenLayoutModal(true)
  }

  const closeEditModal = () => {
    setOpenLayoutModal(false)
    setSelectedLayoutItems(InitialTicketItems)
    setEditableLayoutArray([])
    setEditableId("")
  }

  const openModal = (ticket : ITicket) => {
    const { type, maxQty, price } = ticket

    const label = ticketTypeOptions.find(item => item._id === type)?.name ?? "";

    const receivedObj = {
      id: type,
      ticketPrice: price,
      ticketType: label,
      totalSeats: maxQty,
    }
    setSelectedLayoutItems(receivedObj)
    setOpenLayoutModal(true)
  }

  const closeModal = () => {
    setSelectedLayoutItems(InitialTicketItems)
    setOpenLayoutModal(false)
    setEditableLayoutArray([])
    setEditableId("")
  } 

  const saveLayout = (newLayouts: ISeatLayout[]) => {
    setLayoutArray((prevLayoutArray) => {
      const updatedLayoutArray = [...prevLayoutArray];

      newLayouts.forEach((newLayout) => {
        const existingIndex = updatedLayoutArray.findIndex(
          (layout) => layout.id === newLayout.id
        );

        if (existingIndex !== -1) {
          // If layout with same ticketType exists, replace it (edit case)
          updatedLayoutArray[existingIndex] = newLayout;
        } else {
          // Otherwise, push it as new
          updatedLayoutArray.push(newLayout);
        }
      });

      return updatedLayoutArray;
    });

    setTickets((prevTicketsArray) => {
      return prevTicketsArray.map((ticket) => {
        const matchingLayout = newLayouts.find((layout) => layout.id === ticket.type);

        if (matchingLayout) {
          return {
            ...ticket,
            isLayoutAdded: true, // or `matchingLayout.isLayoutAdded` if you want to copy that value
          };
        }

        return ticket;
      });
    });
    closeModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles: File[] = [];
    let hasInvalid = false;

    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isValidExt = ext && ALLOWED_FILE_FORMATS.includes(ext);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      if (isValidExt && isValidSize) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      setFileError("Only JPG, JPEG, PNG, WEBP formats under 2MB are allowed.");
    } else {
      setFileError(null);
    }

    const newFiles = validFiles.slice(0, 3 - images.length);
    if (newFiles.length > 0) {
      setImages((prev) => [...prev, ...newFiles]);
      setFormValuesError((prevState) => ({
        ...prevState,
        "images": false,
      }));
    }

    e.target.value = "";
  };

  const handleExistingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles: File[] = [];
    let hasInvalid = false;

    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isValidExt = ext && ALLOWED_FILE_FORMATS.includes(ext);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      if (isValidExt && isValidSize) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      setFileError("Only JPG, JPEG, PNG, WEBP formats under 2MB are allowed.");
    } else {
      setFileError(null);
    }

    const slotsLeft = 3 - existingImages.length;
    const newFiles = validFiles.slice(0, slotsLeft);
    if (newFiles.length > 0) {
      setExistingImages((prev) => [...prev, ...newFiles]);
      setFormValuesError((prevState) => ({
        ...prevState,
        "images": false,
      }));
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const ticketAddValidation = () => {
    const { type, price, maxQty, description } = newTicket;

    const label = ticketTypeOptions.find(item => item._id === type)?.name.toLowerCase();

    // Basic blank field validation
    if (
      !type.trim() ||
      !price.trim() ||
      !maxQty.toString().trim() ||
      !description.trim()
    ) {
      setTicketErrorMsg("All fields are required.");
      return;
    }

    // Price must be > 50 if type is not Free
    if (label && label.toLowerCase() !== "free" && Number(price) <= 50) {
      setTicketErrorMsg("Price must be greater than ₹50 for required ticket types.");
      return;
    }

    // Qty must be > 0
    if (Number(maxQty) <= 0) {
      setTicketErrorMsg("Quantity must be greater than 0");
      return;
    }

    setTicketErrorMsg(""); // Clear error

    handleAdd();
  }

  const ticketEditValidation = (ticketValues: Partial<ITicket>) => {
    const { type, price, maxQty, description } = ticketValues;

    const label = ticketTypeOptions.find(item => item._id === type)?.name.toLowerCase();
    
    // Strict blank field validation
    if (
      !type?.toString().trim() ||
      !price?.toString().trim() ||
      !maxQty?.toString().trim() ||
      !description?.toString().trim()
    ) {
      setTicketErrorMsg("All fields are required.");
      return false;
    }

    // Price must be > 50 if type is not Free
    if (label !== "free" && Number(price) <= 50) {
      setTicketErrorMsg("Price must be greater than ₹50 for required ticket types.");
      return false;
    }

    // Qty must be > 0
    if (Number(maxQty) <= 0) {
      setTicketErrorMsg("Quantity must be greater than 0");
      return;
    }

    setTicketErrorMsg(""); // Clear error
    return true;
  }

  const handleAdd = () => {
    const newItem: ITicket = {
      ...newTicket,
      id: Date.now().toString(),
      isDisabled: false,
    };
    setTickets([...tickets, newItem]);
    setNewTicket({ type: "", price: "", maxQty: "", description: "", _id: "", isDisabled: true });
    setAddRowVisible(false)
    setTicketErrorMsg("")
    setFormValuesError({ ...formValuesError, ticket_type : false})
    openModal(newItem)
  };

  const handleEdit = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;
    setEditCache((prev) => ({
      ...prev,
      [id]: { ...ticket },
    }));
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEditing: true } : t))
    );
  };

  const handleSave = (id: string) => {
    const updated = editCache[id];
    const validate = ticketEditValidation(updated)

    if(!validate) return;
 
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updated, isEditing: false } : t
      )
    );
    const newCache = { ...editCache };
    delete newCache[id];
    setEditCache(newCache);
    const selectedTicketItem = {
      id: updated.id || "",
      type: updated.type || "",
      price: updated.price || "",
      maxQty: updated.maxQty || "",
      description: updated.description || "",
      _id: updated._id || "",
    }

    openEditModal(selectedTicketItem)

  };

  const handleCancel = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isEditing: false } : t
      )
    );
    const newCache = { ...editCache };
    delete newCache[id];
    setEditCache(newCache);
    setTicketErrorMsg("")
  };

  const handleUpdate = (id: string, key: keyof ITicket, value: string | number) => {
    setEditCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  }

  const handleDelete = (id: string, ticketId : string) => {
    const filteredLayoutArray = layoutArray.filter(item => item.id !== ticketId)
    setLayoutArray(filteredLayoutArray)

    setTickets((prev) => {
      const updated = prev.filter((t) => t.id !== id);

      if (updated.length === 0) {
        setFormValuesError((prevErrors) => ({
          ...prevErrors,
          ticket_type: true,
        }));
      }

      return updated;
    });
  };

  const handleTitleChange = (value: string) => {
    if (value.trim() === "" || value.length < 5 || value.length > 100) {
      setFormValuesError((prevState) => ({
        ...prevState,
        "title": true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        "title": false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "title": value,
    }));
  }

  const handlePointChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      if (value.trim() === "") {
        setFormValuesError((prevState) => ({
          ...prevState,
          "points": true,
        }));
      } else {
        setFormValuesError((prevState) => ({
          ...prevState,
          "points": false,
        }));
      }
      setFormValues((prevState) => ({
        ...prevState,
        "points": value,
      }));
    }
  }

  const handleDescriptionChange = (value: string) => {

    const input = value;
    
    // Convert HTML to plain text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = input;
    const text = (tempElement.textContent || tempElement.innerText || "").trim();
    
    // Skip validation on first render/input
    if (!hasTouchedDescription.current) {
      hasTouchedDescription.current = true;
      return;
    }

    if (text.length === 0) {
      setFormValuesError((prevState) => ({
        ...prevState,
        description: true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        description: false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "description": text.length > 0 ? value : "",
    }));
  }

  const handleLocationChange = (location: ILocationField) => {
    if (location.location.trim() === "") {
      setFormValuesError((prevState) => ({
        ...prevState,
        location: true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        location: false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      location: {
        address: location.location, // This should be a string
        lat: location.latitude, // number
        long: location.longitude, // number
      },
    }));
  };

  const handleStartTimeChange = (value: Date | null) => {
    if (value === null) {
      setFormValuesError((prevState) => ({
        ...prevState,
        "start_time": true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        "start_time": false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "start_time": value,
    }));
  }

  const handleEndTimeChange = (value: Date | null) => {
    if (value === null) {
      setFormValuesError((prevState) => ({
        ...prevState,
        "end_time": true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        "end_time": false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "end_time": value,
    }));
  }

  const handleDurationField = (value: string) => {
    if (value.trim() === "") {
      setFormValuesError((prevState) => ({
        ...prevState,
        "duration": true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        "duration": false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "duration": value,
    }));
  }

  const handleCatogoryField = (value: string) => {
    if (!value) {
      setFormValuesError((prevState) => ({
        ...prevState,
        "category": true,
      }));
    } else {
      setFormValuesError((prevState) => ({
        ...prevState,
        "category": false,
      }));
    }

    setFormValues((prevState) => ({
      ...prevState,
      "category": value,
    }));
  }

  const calculateDuration = () => {
    const startTime = formValues.start_time;
    const endTime = formValues.end_time;

    const startMoment = moment(startTime);
    const endMoment = moment(endTime);

    if (!startMoment.isValid() || !endMoment.isValid()) return "";

    if (endMoment.isSameOrBefore(startMoment)) return "";

    // Clone to avoid mutating the original moment
    const tempStart = startMoment.clone();

    const years = endMoment.diff(tempStart, 'years');
    tempStart.add(years, 'years');

    const months = endMoment.diff(tempStart, 'months');
    tempStart.add(months, 'months');

    const days = endMoment.diff(tempStart, 'days');
    tempStart.add(days, 'days');

    const hours = endMoment.diff(tempStart, 'hours');
    tempStart.add(hours, 'hours');

    const minutes = endMoment.diff(tempStart, 'minutes');

    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? "s" : ""} `;
    if (months > 0) result += `${months} month${months > 1 ? "s" : ""} `;
    if (days > 0) result += `${days} day${days > 1 ? "s" : ""} `;
    if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
    const remainingMinutes = minutes - (years * 525600 + months * 43800 + days * 1440 + hours * 60);
    if (remainingMinutes > 0) result += `${remainingMinutes} min`;

    return result.trim();
  };


  const handleAllValidations = () => {

    const errorFields = {
      title: false,
      points: false,
      description: false,
      location: false,
      start_time: false,
      end_time: false,
      duration: false,
      category: false,
      ticket_type: false,
      images: false,
    };

    const { title, description, points, location, start_time, end_time, category, duration } = formValues

    if (title.trim() === "") {
      errorFields.title = true;
    }
    if (points.trim() === "") {
      errorFields.points = true;
    }
    if (description.length === 11 || description.length < 20) {
      errorFields.description = true;
    }
    if (location.address.trim() === "") {
      errorFields.location = true;
    }
    if (start_time === null) {
      errorFields.start_time = true;
    }
    if (end_time === null) {
      errorFields.end_time = true;
    }
    if (duration.trim() === "") {
      errorFields.duration = true;
    }
    if (category.trim() === "") {
      errorFields.category = true;
    }
    if (tickets.length === 0) {
      errorFields.ticket_type = true;
    }
    if (!isEditMode && images.length === 0) {
      errorFields.images = true;
    }
    if (isEditMode && existingImages.length === 0) {
      errorFields.images = true;
    }

    setFormValuesError(errorFields)

    return Object.values(errorFields).every((value) => value === false);
  }

  const handleSubmit = async () => {
    if (!handleAllValidations()) {
      return false
    }

    if (!tickets.every(item => item.isLayoutAdded)) {
      toast.error("Please add all layouts to continue");
      return false;
    }


    const existingImageIdsArray = existingImages
      .filter((item): item is EventImage => 'imageId' in item)
      .map((item) => item.imageId);

    const updatedImagesArray = existingImages.filter(
      (item): item is File => item instanceof File
    );

    setLoder(true)

    const formData = new FormData();

    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    formData.append("numberOfPoint", formValues.points.toString());

    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", formValues.location.long.toString());
    formData.append("location[coordinates][1]", formValues.location.lat.toString());
    formData.append("location[address]", formValues.location.address);
    formData.append("location[lat]", formValues.location.lat.toString());
    formData.append("location[lng]", formValues.location.long.toString());

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formValues.start_time && formData.append("startDateTime", formValues.start_time.toString());
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formValues.end_time && formData.append("endDateTime", formValues.end_time.toString());
    formData.append("duration", formValues.duration);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formValues.category && formData.append("category", formValues.category);

    // Append ticket_type array items
    tickets.forEach((ticket, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !isCloneEvent && isEditMode && ticket._id === ticket.id && formData.append(`tickets[${index}][_id]`, ticket.id);
      formData.append(`tickets[${index}][type]`, ticket.type);
      formData.append(`tickets[${index}][price]`, ticket.price);
      formData.append(`tickets[${index}][totalSeats]`, `${ticket.maxQty}`);
      formData.append(`tickets[${index}][description]`, ticket.description);
    });

    // Append files
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    {
     !isCloneEvent && !isEditMode && images.forEach((file) => {
        formData.append("images", file); // assuming `file` is a File object
      })
    }


    // update exisitng iamges (edit mode)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    { !isCloneEvent && isEditMode && existingImageIdsArray.length > 0 && formData.append("existingImages", JSON.stringify(existingImageIdsArray)); }

    // update new images (edit mode)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    {
     !isCloneEvent &&  isEditMode && updatedImagesArray.forEach((file) => {
        formData.append("images", file); // assuming `file` is a File object
      })
    }

    // clone event images
    let clonedImagesFiles: File[] = [];

    // 1. Convert existingImages (EventImage[]) -> File[]
    const imageUrls = existingImages
      .filter((item): item is EventImage => 'url' in item)
      .map((item) => item.url);

    const fileArray = await urlToFileArray(imageUrls);

    // 2. Combine both arrays
    clonedImagesFiles = [...fileArray, ...updatedImagesArray];

    {
     isCloneEvent &&  clonedImagesFiles.forEach((file) => {
        formData.append("images", file); // assuming `file` is a File object
      })
    }

    try {
      const result = await apiCall({
        endPoint: (!isCloneEvent && isEditMode) ? API_ROUTES.ADMIN.UPDATE_EVENT(eventType) : API_ROUTES.ADMIN.CREATE_EVENT,
        method: (!isCloneEvent && isEditMode) ? "PUT" : "POST",
        body: formData,
        isFormData: true,
        headers: {}
      })

      if (result.success) {
        (!isCloneEvent && isEditMode) ? await handleSubmitLayout(eventType) : await handleSubmitLayout(result.data._id)
      }

    } catch (error) {
      console.error(error)
    } 
  }

  const handleSubmitLayout = async (eventId: string) => {
    try {

      const bodyArray = layoutArray.map(item => {
        return {
          ticketType: item.id,
          price: item.price,
          rows: item.rows,
        }
      })

      const httpBody = {
        eventId : eventId,
        seatLayout: bodyArray
      }

      const result = await apiCall({
        endPoint: (!isCloneEvent && isEditMode) ? API_ROUTES.ADMIN.UPDATE_LAYOUT(eventType) :  API_ROUTES.ADMIN.SAVE_LAYOUT,
        method: (!isCloneEvent && isEditMode) ? "PUT" : "POST",
        body: httpBody,
      })

      if(result && result.success) {
        router.push(ROUTES.ADMIN.EVENTS)
        toast.success(isCloneEvent ? "Event cloned successfully." : isEditMode ? "Event updated successfully." : "Event added successfully.")
        setFormValues(InitialEventFormDataValues)
      }
      
    } catch (error) {
      console.error(error)
    } finally {
      setLoder(false)
    }
  }

  useEffect(() => {
    if (formValues.start_time && formValues.end_time) {
      const duration = calculateDuration();
      handleDurationField(duration)
    }
  }, [formValues.start_time, formValues.end_time]);

  const fetchEventWithId = async () => {
    setLoder(true)

    const result = await apiCall({
      endPoint: API_ROUTES.ADMIN.SHOW_EVENT(eventType),
      method: "GET",
    });

    if (result && result.success && result.data) {
      const receivedObj: EventDataObjResponse = result.data;

      const ticketsArray = receivedObj.tickets.map(item => {
        return {
          id: item._id,
          type: item.type?._id,
          price: item.price.toString(),
          maxQty: item.totalSeats.toString(),
          description: item.description,
          _id: item._id,
        }
      })

      const existingImagesArr = receivedObj.images.length > 0 ? receivedObj.images : []

      const modifiedObj = {
        title: receivedObj.title,
        description: receivedObj.description,
        points: receivedObj.numberOfPoint.toString(),
        location: {
          address: receivedObj.location.address,
          lat: receivedObj.location.lat,
          long: receivedObj.location.lng,
        },
        start_time: isCloneEvent ? null : new Date(receivedObj.startDateTime),
        end_time: isCloneEvent? null : new Date(receivedObj.endDateTime),
        duration: isCloneEvent ? "" :  receivedObj.duration,
        category: receivedObj.category?._id,
        ticket_type: [
          {
            type: "",
            price: "",
            max_qty: "",
            description: "",
          },
        ],
        images: [],
      };
      setFormValues(modifiedObj)
      setTickets(ticketsArray)
      setExistingImages(existingImagesArr)
      setCloneEventTitle(receivedObj.title)
      setLoder(false)
    } else {
      setLoder(false)
    }
  };
  const getCategories = useCallback(async () => {
    try {
      const response: IEventCategoryResp = await apiCall({
        endPoint: API_ROUTES.CATEGORY,
        method: 'GET',
      });

      if (response && response.success) {
        const receivedArray = response.data || [];
        setCategoriesOptions(receivedArray)
      }
    } catch (err) {
      console.error('Error fetching ticket types', err);
    }
  }, []);

  const getTicketTypes = useCallback(async () => {
    try {
      const response: ITicketTypesResp = await apiCall({
        endPoint: API_ROUTES.ADMIN.TICKET_TYPE,
        method: 'GET',
      });

      if (response && response.success) {
        const receivedArray = response.data || [];
        setTicketTypeOptions(receivedArray)
      }
    } catch (err) {
      console.error('Error fetching ticket types', err);
    }
  }, []);

  const getSeatLayout = useCallback(async () => {
    try {
      const response: ISeatLayoutResponse = await apiCall({
        endPoint: API_ROUTES.ADMIN.GET_LAYOUT(eventType),
        method: 'GET',
      });

      if (response && response.success && response.data.length > 0) {
        const receivedArray = response.data[0].seatLayout.map(item => {
          return {
            ticketType: item.ticketType.name, // ObjectId as string
            price: item.price,
            rows: item.rows,
            id: item.ticketType._id
          }
        });
        setLayoutArray(receivedArray)
        return receivedArray
      }
    } catch (err) {
      console.error('Error fetching ticket types', err);
    }
    return []
  }, []);

  useEffect(() => {
    getCategories()
    getTicketTypes()
    if (eventType !== "create") {
      fetchLayoutAndEventData()
    }
  }, [eventType, getCategories, getTicketTypes])

  const fetchLayoutAndEventData = async () => {
    const [_, layout] = await Promise.all([
      fetchEventWithId(),
      getSeatLayout(),
    ]);
    if (!layout) return;
    setTickets((prevTicketsArray) => {
      return prevTicketsArray.map((ticket) => {
        const matchingLayout = layout.filter((layout) => layout.id === ticket.type && layout.rows.length > 0);

        return {
          ...ticket,
          isLayoutAdded: matchingLayout.length > 0 ? true : false,
        };
      });
    });

  }

  const formattedTicketTypes = useMemo(() => {
    const selectedTypeIds = tickets.map(t => t.type);
    return ticketTypeOptions
      .filter(item => !selectedTypeIds.includes(item._id))
      .map(item => ({
        value: item._id,
        label: item.name,
        disabled: !item.isActive
      }));
  }, [ticketTypeOptions, tickets]);

  const formattedTicketTypesEdit = useCallback((currentTypeId?: string) => {
    const otherSelectedTypeIds = tickets
      .filter(t => t.type !== currentTypeId)
      .map(t => t.type);

    return ticketTypeOptions
      .filter(item => !otherSelectedTypeIds.includes(item._id))
      .map(item => ({
        value: item._id,
        label: item.name,
        disabled: !item.isActive
      }));
  }, [tickets, ticketTypeOptions]);

  const getTicketType = useCallback((itemId: string) => {
    return ticketTypeOptions.find(item => item._id == itemId)?.name || "";
  }, [ticketTypeOptions]);

  const handleGenerateDescription = useCallback(async () => {
    try {
      setIsGeneratingDescription(true);

      const body = {
        title: formValues.title,
        start_time: moment(formValues.start_time).format(
            "DD MMM YYYY, [at] hh:mm:ss A"
          ),
        end_time: moment(formValues.end_time).format(
            "DD MMM YYYY, [at] hh:mm:ss A"
          ),
        location: formValues.location.address
      }

      const res = await apiCall({
        method: "POST",
        endPoint: API_ROUTES.ADMIN.AI_GENERATE_DESCRIPTION,
        body: body,
      });

      if (res.success) {
        const markdown = res.data.replace(/\\n/g, "\n");

        const html = marked(markdown);

        handleDescriptionChange(html as string);
        setIsGeneratingDescription(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      setIsGeneratingDescription(false);
    }
  }, [formValues]);

  const handleCheckButtonDisabled = useCallback(() => {
    let value = true;

    value =
      formValues.title == "" &&
      formValues.start_time == null &&
      formValues.end_time == null &&
      formValues.location.address == "";

    return value;
  }, [formValues]);

  return (
    <div className="mx-8 my-5">
      {loader && <Loader />}

      <Breadcrumbs breadcrumbsItems={
        isCloneEvent ? BREAD_CRUMBS_ITEMS.EVENT.CLONE_PAGE : isEditMode ? BREAD_CRUMBS_ITEMS.EVENT.UPDATE_PAGE : BREAD_CRUMBS_ITEMS.EVENT.CREATE_PAGE
      }
      />

      <div className="rounded-[12px] bg-white p-6 shadow-lg border-2 border-gray-200">


        <div className='mb-5'>
          <TitleSection title={isCloneEvent ? `Clone ${cloneEventTitle}`  : isEditMode ? "Update Event" : "Create Event"} />
        </div>

        <CustomTextField
          label="Title"
          name={"title"}
          value={formValues.title}
          type="text"
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter event title"
          errorKey={formValuesError.title}
          errorMsg={
            formValues.title === ""
              ? "Enter valid event title"
              : "Event title must be between 5 and 100 characters"
          }
        />

        <AddressAutocomplete
          getLocationData={(location) => handleLocationChange(location)}
          label="Location"
          name={"location"}
          defaultValue={formValues.location}
          placeholder="Enter event location"
          errorKey={formValuesError.location}
          errorMsg="Enter valid event location"
        />

        <CustomTextField
          label="Points"
          name={"points"}
          value={formValues.points}
          type="text"
          onChange={(e) => handlePointChange(e.target.value)}
          placeholder="Enter event points"
          errorKey={formValuesError.points}
          errorMsg={
            formValues.points === ""
              ? "Enter event points"
              : ""
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-3 gap-0">
          <div className="md:col-span-6 col-span-12">
            <CustomDateTimePicker
              label="Event Starts"
              name={"start_time"}
              value={formValues.start_time}
              onChange={(val) => handleStartTimeChange(val)}
              errorKey={formValuesError.start_time}
              errorMsg="Enter valid event start time"
              minDate={!isEditMode ? new Date() : formValues.start_time === null
                ? new Date()
                : formValues.start_time}
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <CustomDateTimePicker
              value={formValues.end_time}
              onChange={(val) => handleEndTimeChange(val)}
              label="Event Ends"
              name={"end_time"}
              minDate={
                formValues.start_time === null
                  ? new Date()
                  : formValues.start_time
              }
              errorKey={formValuesError.end_time}
              errorMsg="Enter valid event end time"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-3 gap-0">
          <div className="md:col-span-6 col-span-12">
            <CustomTextField
              label="Durtion"
              name={"duration"}
              value={formValues.duration}
              onChange={() => { }}
              placeholder="Event duration"
              errorKey={formValuesError.duration}
              errorMsg="Enter valid event timings"
              readOnly
              disabled
            />
          </div>
          <div className="md:col-span-6 col-span-12">
            <div className="mb-4">
              <CustomSelectField
                label="Catogory"
                name={"category"}
                value={formValues.category}
                onChange={(value) => handleCatogoryField(value)}
                placeholder="Select category"
                options={categoriesOptions}
                errorKey={formValuesError.category}
                errorMsg="Enter valid event category"
                height='3rem'
              />
            </div>
          </div>
        </div>

          <QuilEditor
            label="Description"
            name={"description"}
            value={formValues.description}
            onChange={(value) => handleDescriptionChange(value)}
            handleGenerateDescription={handleGenerateDescription}
            isDescriptionGenerating={isGeneratingDescription}
            iSGenerateButtonDisabled={handleCheckButtonDisabled()}
            placeholder="Describe your event"
            errorKey={formValuesError.description}
            errorMsg={
              formValues.description.length < 11
                ? "Enter valid event description"
                : formValues.description.length < 20
                ? 
                "Event description must be at least 20 characters long"
                : ""
            }
          />

        <div className="mb-4">
          <label
            htmlFor={"Ticket types"}
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Ticket types
          </label>

          <div className="w-full overflow-x-auto sm:overflow-x-visible">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2 w-1/5 font-semibold">
                    Ticket Type
                  </th>
                  <th className="border px-4 py-2 w-1/6">Price (₹)</th>
                  <th className="border px-4 py-2 w-1/6">Max Qty</th>
                  <th className="border px-4 py-2 w-1/6">Description</th>
                  <th className="border px-4 py-2 w-1/6 text-center">
                    Actions
                  </th>
                  <th className="border px-4 py-2 w-1/6 text-center">Layout</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) =>
                  ticket.isEditing ? (
                    <tr key={ticket.id}>
                      <td className="border px-2 py-1">
                        <CustomSelectField
                          placeholder='Select'
                          errorKey={false}
                          name='select'
                          options={formattedTicketTypesEdit(editCache[ticket.id]?.type)}
                          value={editCache[ticket.id]?.type || ""}
                          // onChange={(value) => handleUpdate(ticket.id, "type", value)}
                          onChange={(value) => {
                            // If selected type is 'Free', set price = "0"
                            const label = formattedTicketTypesEdit(value).find(item => item.value === value)?.label.toLowerCase();
                            handleUpdate(ticket.id, "type", value);
                            if (label === "free") {
                              handleUpdate(ticket.id, "price", "0");
                            } else if (editCache[ticket.id]?.price === "0") {
                              // reset price to empty if previously 0 and type changed
                              handleUpdate(ticket.id, "price", "");
                            }
                          }}
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          value={editCache[ticket.id]?.price || ""}
                          disabled={handleFreeTicketType(formattedTicketTypes, editCache[ticket.id]?.type || "")}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              handleUpdate(ticket.id, "price", value);
                            }
                          }}
                          className="w-full border px-2 py-1 rounded"
                          placeholder='Price'
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          placeholder='Qty'
                          value={editCache[ticket.id]?.maxQty}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              handleUpdate(ticket.id, "maxQty", value);
                            }
                          }}
                          className="w-full border px-2 py-1 rounded"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          value={editCache[ticket.id]?.description || ""}
                          onChange={(e) =>
                            handleUpdate(
                              ticket.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full border px-2 py-1 rounded"
                          placeholder='Description'
                        />
                      </td>
                      <td className="border text-center px-2 py-1 space-x-2">
                        <button
                          onClick={() => handleSave(ticket.id)}
                          className="bg-green-600 p-1 text-white rounded-full hover:bg-green-700"
                        >
                          <CheckIcon className="h-5 w-5 cursor-pointer font-bold" />
                        </button>
                        <button
                          onClick={() => handleCancel(ticket.id)}
                          className="bg-gray-600 p-1 text-white rounded-full hover:bg-gray-700"
                        >
                          <XMarkIcon className="h-5 w-5 cursor-pointer font-bold" />
                        </button>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {ticket.isLayoutAdded ?
                          <button
                            className='underline text-md text-blue-500 hover:text-blue-700 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed'
                            disabled
                          >
                            Edit Layout
                          </button>
                          :
                          <button
                            className='underline text-md text-blue-500 hover:text-blue-700 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed'
                            disabled
                          >
                            Add Layout
                          </button>
                        }
                      </td>
                    </tr>
                  ) : (
                    <tr key={ticket.id}>
                      <td className="border px-4 py-2">{getTicketType(ticket.type)}</td>
                      <td className="border px-4 py-2">{ticket.price}</td>
                      <td className="border px-4 py-2">{ticket.maxQty}</td>
                      <td className="border px-4 py-2">
                        {ticket.description}
                      </td>
                      <td className="border px-4 py-2 text-center md:space-x-2">
                        <button
                          className="text-blue-600 p-1 cursor-pointer font-bold"
                          onClick={() => handleEdit(ticket.id)}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-800 p-1 cursor-pointer font-bold"
                          onClick={() => handleDelete(ticket.id, ticket.type)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="border px-4 py-2 text-center">
                          {ticket.isLayoutAdded ?
                            <button
                              className='underline text-md text-blue-500 hover:text-blue-700 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed'
                              disabled={ticket.isDisabled}
                              onClick={() => openEditModal(ticket)}
                            >
                              Edit Layout
                            </button>
                            :
                            <button
                              className='underline text-md text-blue-500 hover:text-blue-700 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed'
                              onClick={() => openModal(ticket)}
                            >
                              Add Layout
                            </button>
                          }
                      </td>
                    </tr>
                  )
                )}

                {/* Add New Row */}
                {addRowVisible && (
                  <tr className="bg-white">
                    <td className="border px-2 py-1">
                      <CustomSelectField
                        placeholder='Select'
                        errorKey={false}
                        name='select'
                        options={formattedTicketTypes}
                        value={newTicket.type}
                        onChange={(value) => {
                          const label = formattedTicketTypes.find(item => item.value === value)?.label.toLowerCase();
                          setNewTicket({ ...newTicket, type: value, price : label === "free" ? "0" : "" })
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-full border rounded px-2 py-1 h-9 "
                        placeholder="Price"
                        disabled={handleFreeTicketType(formattedTicketTypes, newTicket.type)}
                        value={newTicket.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setNewTicket({
                              ...newTicket,
                              price: value,
                            });
                          }
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-full border rounded px-2 py-1 h-9 "
                        placeholder="Qty"
                        value={newTicket.maxQty}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setNewTicket({
                              ...newTicket,
                              maxQty: value,
                            });
                          }
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-full border rounded px-2 py-1 h-9 "
                        placeholder="Description"
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="border px-4 py-2 text-center md:space-x-2">
                      <button
                        onClick={ticketAddValidation}
                        className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => {
                          const emptyRow = {
                            type: "",
                            price: "",
                            maxQty: "",
                            description: "",
                            _id: ""
                          }
                          setNewTicket(emptyRow)
                          setAddRowVisible(false)
                          setTicketErrorMsg("")
                        }}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="border px-2 py-1 text-center">
                        <button 
                          className='underline text-md text-blue-500 hover:text-blue-700 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed'
                          disabled={newTicket.isDisabled}
                        > 
                            Add Layout 
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!addRowVisible && tickets.length < ticketTypeOptions.length && (
              <div
                onClick={() => setAddRowVisible(true)}
                className="px-2 cursor-pointer py-1"
              >
                <p className="font-semibold underline text-blue-500">
                  {tickets.length >= 1 ? "Add More Ticket" : "Add Ticket"}
                </p>
              </div>
            )}
          </div>

          {formValuesError.ticket_type && (
            <p className="text-red-500 text-sm mt-1">
              At least one ticket is required
            </p>
          )}

          {ticketErrorMsg !== "" && (
            <p className="text-red-500 text-sm mt-1">
              {ticketErrorMsg}
            </p>
          )}
        </div>

        {/* file handleing code */}
        <ImageUploadGrid
          images={isEditMode ? existingImages : images}
          onRemoveImage={isEditMode ? handleRemoveExistingImage : handleRemoveImage}
          onFileInputChange={isEditMode ? handleExistingFileChange : handleFileChange}
          fileError={fileError}
          formValuesError={formValuesError}
          isEditMode={isEditMode}
        />

        <div className="text-end my-6">
          <CustomButton
            onClick={openViewModal}
            variant={layoutArray.length === 0 ? "disabled" : 'secondary'}
            disabled={layoutArray.length === 0}
            className="sm:w-max w-full py-3 px-6 rounded-[12px] hover:opacity-90 transition disabled:cursor-not-allowed cursor-pointer mr-5"
          >
             View Layout
          </CustomButton>

          <CustomButton
            onClick={handleSubmit}
            variant='primary'
            className="sm:w-max w-full py-3 px-6 rounded-[12px] hover:opacity-90 transition disabled:cursor-not-allowed cursor-pointer"
          >
            {isCloneEvent ? "Clone" : isEditMode ? "Update" : "Create"} Event
          </CustomButton>
        </div>
      </div>

      {/* Add/Edit Seating Modal */}
      <SeatingModal
        isOpen={openLayoutModal}
        onClose={editableId !=="" ?  closeEditModal : closeModal}
        fullScreen
        title={editableId !== "" ? 'Edit Seat Layout' : 'Select Seat Layout'}
      >
        <AddEditSeatLayout isEditable={editableId !== ""} savedLayout={editableId !== "" ? editableLayoutArray : []} ticketItems={selectedLayoutItems} onSave={saveLayout} />
      </SeatingModal>

      {/* View Seating Modal */}
      <SeatingModal
        isOpen={viewLayoutModal}
        onClose={closeViewModal}
        fullScreen
        title='View Layout'
      >
        <ViewSeatLayout seatLayoutDataFromProps={layoutArray} />
      </SeatingModal>
    </div>
  );
}

export default EventForm