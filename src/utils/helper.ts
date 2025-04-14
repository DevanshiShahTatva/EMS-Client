export const getAuthToken = () => {
    const token = localStorage.getItem("token")
    return token ? token : ""
}

type ApiParams = {
    endPoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string | FormData;
    headers?: HeadersInit;
  };
  
  export const apiCall = async ({ endPoint, method = 'GET', body, headers = {} }: ApiParams) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          ...headers,
        },
      };
  
      if (body && method !== 'GET') {
        options.body = body;
      }
  
     return await fetch(endPoint, options);
  
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
  