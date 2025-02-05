import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import MainPage from "./components/MainPage"; // Your main page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} /> {/* AuthPage renders both Login and Signup */}
        <Route path="/main" element={<MainPage />} /> {/* Protected Main Page */}
      </Routes>
    </Router>
  );
}

export default App;
