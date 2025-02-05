import { useState } from "react";
import Login from "./Login"
import Signup from "./Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-6 py-2 rounded-lg text-lg font-semibold transition duration-200 ${
            isLogin
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-6 py-2 rounded-lg text-lg font-semibold transition duration-200 ${
            !isLogin
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Signup
        </button>
      </div>

      {/* Show Login or Signup form based on state */}
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default AuthPage;
