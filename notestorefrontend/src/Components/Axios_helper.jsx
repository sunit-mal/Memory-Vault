
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:8080/api/notestore";

export const request = async (method, url, type, data, responseType) => {
  let headers = {};
  if (data instanceof FormData) {
    // Let axios handle Content-Type for FormData (multipart/form-data with boundary)
  } else if (type !== null) {
    headers = {
      "Content-Type": type,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await axios({
      method: method,
      url: url,
      headers: headers,
      data: data,
      responseType: responseType === "application/json" ? "json" : responseType,
    });
    return response;
  } catch (error) {
    console.error("API Error:", error);

    if (!error.response) {
      // Network error (backend down)
      toast.error("Backend Server is not responding. Please check your connection.", {
        id: "network-error", // Prevent multiple duplicate toasts
        duration: 4000,
        style: {
          background: '#ff4b4b',
          color: '#fff',
          borderRadius: '12px',
        }
      });
    } else {
      // Backend returned an error response (4xx, 5xx)
      const message = error.response.data?.message || "An error occurred with the request.";
      toast.error(message, {
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '12px',
        }
      });
    }

    // Return a failed state that won't crash the .then() chain
    return { status: error.response?.status || 500, data: null };
  }
};
