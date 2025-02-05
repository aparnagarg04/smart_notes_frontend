import { useState } from "react";
import { FaExpand, FaStar, FaTimes, FaCopy, FaUpload } from "react-icons/fa";

const NoteExpandedView = ({ note, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("Transcript"); // Default tab changed to Transcript
  const [transcript, setTranscript] = useState(note.text);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied!");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center border border-black backdrop-blur bg-opacity-50`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg relative overflow-auto border border-black ${
          isFullscreen ? "w-full h-full" : "w-3/4 h-4/5"
        }`}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleFullscreen} className="text-gray-600">
            <FaExpand size={20} />
          </button>
          <div className="flex space-x-4">
            <button onClick={toggleFavorite}>
              <FaStar size={20} className={isFavorite ? "fill-current" : ""} />
            </button>
            {/* Share Button */}
            <button className=" border border-black-500 px-4 py-2 rounded-md hover:bg-blue-100">
              Share
            </button>
            <button onClick={onClose}>
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Note Title & Date */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{note.title || "Untitled Note"}</h2>
          <p className="text-sm text-gray-500">
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Audio Player (if audio note) */}
        {note.audio && (
          <div className="mb-4 flex items-center space-x-4">
            <audio controls className="w-full">
              <source
                src={`${import.meta.env.API_BASE_URL}/${note.audio}`}
                type="audio/webm"
              />
              Your browser does not support the audio element.
            </audio>
            <a
              href={note.audio}
              download="recording.webm"
              className="text-blue-500"
            >
              Download
            </a>
          </div>
        )}

        {/* Text Content (if text note)
        {note.text && <div className="mb-4 text-gray-700">{note.text}</div>} */}

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-300 mb-4">
          {["Notes", "Transcript", "Create", "Speaker Transcript"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tabs Content */}
        <div className="mb-4">
          {activeTab === "Transcript" && (
            <div className="relative p-4 border rounded-lg">
              <p className="text-gray-700">
                {showFullTranscript
                  ? transcript
                  : transcript.slice(0, 100) + "..."}
              </p>
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-blue-500 mt-2"
              >
                {showFullTranscript ? "Read Less" : "Read More"}
              </button>
              <button
                onClick={copyTranscript}
                className="absolute top-2 right-2 text-gray-500"
              >
                <FaCopy />
              </button>
            </div>
          )}

          {activeTab === "Create" && (
            <div className="text-gray-700">Coming Soon...</div>
          )}

          {activeTab === "Speaker Transcript" && (
            <div className="text-gray-700">Speaker Transcript Data...</div>
          )}
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col items-left mt-6">
          <label className="cursor-pointer flex flex-col items-center border border-dashed border-gray-400 p-4 rounded-lg">
            <FaUpload size={30} className="text-gray-400 mb-2" />
            <span className="text-gray-500">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="mt-4 w-40 h-40 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteExpandedView;
