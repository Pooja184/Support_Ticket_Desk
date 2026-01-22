import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    try {
      const res = await api.post("/auth/signup", formData);

      if (res.data.success) {
        toast.success("Account created successfully");
        setFormData({ name: "", email: "", password: "" });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error,"hewfjbwh");
      toast.error( error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium
                       hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>
         <p className="text-sm text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/user-login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
         <p className="text-sm text-center text-gray-700 mt-6">
          Redirect to welcome page{" "}
          <span
            onClick={() => navigate("/")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Welcome
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
