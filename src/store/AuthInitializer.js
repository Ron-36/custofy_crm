import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { listenToAuthChanges } from "./authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  return children;
}
