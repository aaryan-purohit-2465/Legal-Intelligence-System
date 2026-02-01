import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="bg-gray-900/80 backdrop-blur-xl p-10 rounded-2xl w-96 shadow-xl border border-gray-700">
        
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          AI Legal System
        </h2>

        <input
          type="text"
          placeholder="Email or Username"
          className="w-full p-3 mb-4 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Login
        </button>

        <p className="mt-5 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
