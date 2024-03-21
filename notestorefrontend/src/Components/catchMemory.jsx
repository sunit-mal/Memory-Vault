export const setCatchMemory = (item) => {
  window.localStorage.setItem("language", item);
};

export const getCatchMemory = () => {
  return window.localStorage.getItem("language");
};
