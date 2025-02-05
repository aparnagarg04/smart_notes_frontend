// api.js
import axios from "axios";

const API_BASE_URL = "https://7t2w9w-5000.csb.app/api";

// Fetch all notes
export const fetchNotes = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add a new note
export const addNote = async (noteData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE_URL}/notes/add`, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Let Axios handle this automatically
    },
  });
};

// Delete a note
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_BASE_URL}/notes/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};