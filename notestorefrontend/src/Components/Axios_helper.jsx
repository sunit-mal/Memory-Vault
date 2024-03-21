import axios from "axios";

axios.defaults.baseURL = "http://localhost:2918/api/notestore";

export const request = async (method, url, type, data, responseType) => {
  let headers = {};
  if (type !== null) {
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
      responseType: responseType,
    });
    return response;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
