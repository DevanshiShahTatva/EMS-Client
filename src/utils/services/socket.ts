import { io, Socket } from "socket.io-client";
import { getAuthToken } from "@/utils/helper";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  socketInstance ??= io(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", {
    withCredentials: true,
    auth: {
      token: getAuthToken()
    },
  });
  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};