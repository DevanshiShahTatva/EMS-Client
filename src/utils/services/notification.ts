// services/notificationService.ts
import axios from "axios";
import { apiCall } from "./request";

const API_URL = "/notification";

export type NotificationResp = {
  _id: string;
  title: string;
  body: string;
  isRead: boolean;
  data: any;
  createdAt: any;
};

export const getNotifications = async (): Promise<NotificationResp[]> => {
  const response = await apiCall({
    endPoint: `${API_URL}/get-all-notification`,
    method: "GET",
  });
  return response.data;
};

export const markAsRead = async (id: string) => {
  await apiCall({
    endPoint: `${API_URL}/mark-as-read/${id}`,
    method: "DELETE",
  });
};

export const markAllAsRead = async () => {
  await apiCall({
    endPoint: `${API_URL}/mark-as-all-read`,
    method: "DELETE",
  });
};

export const registerFCMToken = async (token: string) => {
  await apiCall({
    endPoint: `${API_URL}/register/fcm-token`,
    method: "POST",
    body: {
      fcmToken: token,
    },
  });
};

export const unRegisterFCMToken = async (token: string) => {
  await apiCall({
    endPoint: `${API_URL}/unregister/fcm-token`,
    method: "POST",
    body: {
      fcmToken: token,
    },
  });
};
