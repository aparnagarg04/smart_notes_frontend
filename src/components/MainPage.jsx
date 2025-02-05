import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import LeftBar from "./LeftBar";
import RightPane from "./RightPane";

const MainPage = () => {
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if no token is found
    }

    const userName = localStorage.getItem("email"); // Get the email from localStorage
    setUserName(userName);
    if (userName) {
      setUserInitial(userName[0].toUpperCase()); // Set user's initial based on email/username
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left Bar */}
      <LeftBar userInitial={userInitial} userName={userName} />

      {/* Right Pane */}
      <RightPane />
    </div>
  );
};

export default MainPage;
