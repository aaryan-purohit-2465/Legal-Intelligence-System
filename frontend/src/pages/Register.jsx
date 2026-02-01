import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
        />

        <button className="w-full bg-green-600 p-2 rounded hover:bg-green-700">
          Create Account
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
