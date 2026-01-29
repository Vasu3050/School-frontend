import API from "./Axios.js";

// Upload new photos/videos to gallery
export const uploadToGallery = async (formData) => {
  try {
    const res = await API.post("/gallery/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Upload event media
export const uploadEventMedia = async (formData) => {
  try {
    const res = await API.post("/gallery/upload-event", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Get gallery
export const getGallery = async () => {
  try {
    const res = await API.get("/gallery/");
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Delete single photo/video
export const deletePhotoById = async (id) => {
  try {
    const res = await API.delete(`/gallery/delete/${id}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Delete multiple photos/videos
export const deleteMultiplePhotos = async (ids) => {
  try {
    const res = await API.delete("/gallery/delete", { data: { ids } });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Edit photo/video
export const editPhotoById = async ({ id, formData }) => {
  try {
    const res = await API.patch(`/gallery/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Get gallery for management (with pagination and filtering)
export const getGalleryForManagement = async ({ page = 1, limit = 12, type = 'all' } = {}) => {
  try {
    const res = await API.get(`/gallery/manage?page=${page}&limit=${limit}&type=${type}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Get single photo details
export const getPhotoById = async (id) => {
  try {
    const res = await API.get(`/gallery/${id}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};