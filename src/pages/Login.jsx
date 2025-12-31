import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Login() {
  const navigate = useNavigate();

  // 🔥 Redux auth state (source of truth)
  const { authUser, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* ---------------- Redirect after auth ready ---------------- */

  useEffect(() => {
    if (authUser && !authLoading) {
      navigate("/dashboard");
    }
  }, [authUser, authLoading, navigate]);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Login only (NO navigation here)
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Custofy
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email ID"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading || authLoading}
            className={`w-full py-2 rounded-lg text-white transition
            ${
              loading || authLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading || authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* LINKS */}
        <div className="text-sm text-center mt-4 space-y-2">
          <Link
            to="/forgotpassword"
            className="text-indigo-600 font-medium block"
          >
            Forgot password?
          </Link>

          <p>
            Don’t have an account?{" "}
            <Link to="/registration" className="text-indigo-600 font-medium">
              Register
            </Link>
          </p>

          <Link to="/" className="text-gray-500 block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Reusable Input ------------------ */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
