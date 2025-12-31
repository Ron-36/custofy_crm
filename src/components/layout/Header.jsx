import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/authSlice";

export default function Header() {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white">
      <span className="text-l text-gray-700">
        Welcome {profile?.name}
      </span>

      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
