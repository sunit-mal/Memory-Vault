import axios from "axios";

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
    console.log("error", error);
    throw error;
  }
};
