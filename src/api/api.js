// api.js
import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";

// Fetch all notes
export const fetchNotes = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${import.meta.env.API_BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add a new note
export const addNote = async (noteData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${import.meta.env.API_BASE_URL}/notes/add`, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Let Axios handle this automatically
    },
  });
};

// Delete a note
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${import.meta.env.API_BASE_URL}/notes/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
