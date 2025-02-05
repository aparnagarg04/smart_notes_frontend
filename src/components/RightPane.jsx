import { useState, useEffect } from "react";
import { useRef } from "react";
import NoteExpandedView from "./NoteExpandedView"; // Import the NoteExpandedView component
import { addNote, fetchNotes, deleteNote } from "../api/api";
import {
  FaMicrophone,
  FaPen,
  FaImage,
  FaCopy,
  FaTrash,
  FaEdit,
  FaSearch,
  FaSort,
  FaTimes,
} from "react-icons/fa";

const RightPane = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [recognition, setRecognition] = useState(null);
  const [isCreatingNoteManually, setIsCreatingNoteManually] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const [newNote, setNewNote] = useState({
    text: "",
    title: "",
    image: null,
    audio: null,
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }
        const response = await fetchNotes(); // No need to pass token here
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewNote((prevNote) => ({
          ...prevNote,
          text: prevNote.text ? prevNote.text + " " + transcript : transcript, // Append properly
        }));
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
      };

      setRecognition(speechRecognition);
    } else {
      console.error("Web Speech API not supported in this browser");
    }
  }, []);

  const startRecording = () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      console.error(
        "MediaRecorder or mediaDevices not supported in this browser"
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder; // Store recorder in ref
        audioChunksRef.current = []; // Reset audio chunks

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioFile = new File([audioBlob], "recording.webm", {
            type: "audio/webm",
          });
          setNewNote((prevNote) => ({
            ...prevNote,
            // audio: audioUrl,
            audio: audioFile,
          }));

          setAudioBlob(audioBlob);
          // Stop all tracks in the stream
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        if (recognition) {
          recognition.start();
        } else {
          console.error("Speech recognition is not initialized.");
        }
      })
      .catch((error) => {
        console.error("Microphone access error:", error);
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop speech recognition
      if (recognition) {
        recognition.stop();
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const startEditing = (id, text) => {
    setEditingNoteId(id);
    setEditedText(text);
  };

  const saveEditedNote = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text: editedText } : note
      )
    );
    setEditingNoteId(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const handleAddNote = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newNote.title);
      formData.append("text", newNote.text);
      if (newNote.image) formData.append("image", newNote.image);
      if (newNote.audio) formData.append("audio", newNote.audio);

      const response = await addNote(formData); // Token is handled in api.js

      setNotes([...notes, response.data]);
      setNewNote({ title: "", text: "", image: null, audio: null });
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteNote(id, token);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewNote({
        ...newNote,
        image: file,
      });
    }
  };

  const handleTextChange = (event) => {
    setNewNote({
      ...newNote,
      text: event.target.value,
    });
  };

  const handleTitleChange = (event) => {
    setNewNote({
      ...newNote,
      title: event.target.value,
    });
  };

  const filteredNotes = notes
    .filter((note) =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="flex-1 bg-white p-6 flex flex-col justify-between h-screen ">
      {/* Search Bar & Sort Button */}
      <div className="flex flex-col md:flex-row items-center mb-4 w-full">
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full mb-2 md:mb-0">
          <FaSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 outline-none w-full"
          />
        </div>
        <button
          onClick={toggleSortOrder}
          className="w-full md:w-auto md:ml-4 px-4 py-2 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <FaSort className="mr-2" />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Notes List */}
      <div className="flex flex-wrap gap-4 overflow-y-auto">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-gray-100 p-6 rounded-xl w-full md:w-1/4 h-60 shadow-md flex flex-col justify-between relative"
            onClick={() => setSelectedNote(note)}
          >
            {/* Date on Top Left */}
            <div className="absolute top-4 left-4 text-xs text-gray-500">
              {new Date(note.createdAt).toLocaleString()}
            </div>

            {/* Note Content */}
            {editingNoteId === note._id ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={() => saveEditedNote(note._id)}
                onKeyDown={(e) => e.key === "Enter" && saveEditedNote(note._id)}
                className="w-full p-1 border rounded"
                autoFocus
              />
            ) : (
              <div>
                <div className="text-lg font-bold mb-1 mt-5">{note.title}</div>
                <div className="text-sm text-gray-700">{note.text}</div>
              </div>
            )}

            {/* Display Image if added */}
            {note.image && (
              <img
                src={note.image}
                alt="Note"
                className="w-full h-16 mt-2 object-cover rounded"
              />
            )}
            {note.audio && (
              <audio controls className="w-full mt-2">
                <source
                  src={`https://7t2w9w-5000.csb.app/${note.audio}`}
                  type="audio/webm"
                />
                Your browser does not support the audio element.
              </audio>
            )}

            {/* Actions at Bottom Right */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(note.text);
                }}
                className="text-gray-600"
              >
                <FaCopy />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(note._id, note.text);
                }}
                className="text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note._id);
                }}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Temporary Note Creation Card */}
      {(isCreatingNoteManually || newNote.text) && (
        <div className="w-full md:w-3/4 mx-auto p-6 bg-gray-100 rounded-xl shadow-lg flex flex-col relative">
          {/* Close Button */}
          <button
            onClick={() => setIsCreatingNoteManually(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>

          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={handleTitleChange}
            className="mb-4 p-2 border rounded"
          />
          <textarea
            value={newNote.text}
            onChange={handleTextChange}
            placeholder="Your note text..."
            className="mb-4 p-2 border rounded"
            rows="4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />

          {newNote.image && (
            <img
              src={newNote.image}
              alt="Note"
              className="w-full h-20 object-cover mb-4"
            />
          )}

          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            Create Note
          </button>
        </div>
      )}

      {/* Recording Bar */}
      <div className="flex flex-row md:flex-row items-center justify-between bg-gray-200 p-4 rounded-full w-full md:w-3/4 mx-auto">
        <div className="flex space-x-4 mb-2 md:mb-0">
          <button
            onClick={() => {
              setIsCreatingNoteManually(true);
              setNewNote({ text: "", title: "", image: null });
            }}
          >
            <FaPen size={20} className="text-gray-600" />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload">
            <FaImage size={20} className="text-gray-600 cursor-pointer" />
          </label>
        </div>

        <button
          className={`w-full md:w-auto px-4 py-2 rounded-full flex items-center justify-center ${
            isRecording ? "bg-gray-500" : "bg-red-500"
          } text-white`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          <FaMicrophone size={16} className="mr-2" />
          <span className="hidden md:inline">
            {isRecording ? "Stop Recording" : "Start Recording"}
          </span>
        </button>
      </div>
      {selectedNote && (
        <NoteExpandedView
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
};

export default RightPane;
