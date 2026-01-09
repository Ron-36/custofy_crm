import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import { fetchCompanyProfile } from "./companySlice";

/* ---------------- THUNK ---------------- */

export const listenToAuthChanges = createAsyncThunk(
  "auth/listen",
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const snap = await getDoc(doc(db, "users", user.uid));

          let profile = null;

          if (snap.exists()) {
            const data = snap.data();

            // CONVERT FIRESTORE TIMESTAMP → STRING
            profile = {
              ...data,
              createdAt: data.createdAt
                ? data.createdAt.toDate().toISOString()
                : null,
              updatedAt: data.updatedAt
                ? data.updatedAt.toDate().toISOString()
                : null,
            };
          }

          // ✅ Store ONLY serializable data in Redux
          dispatch(
            setUser({
              authUser: {
                uid: user.uid,
                email: user.email,
              },
              profile,
            })
          );

          // Load company profile
          dispatch(fetchCompanyProfile(user.uid));
        } else {
          dispatch(logout());
        }

        resolve();
      });
    });
  }
);

/* ---------------- LOGOUT THUNK ---------------- */

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    await signOut(auth);
    dispatch(logout());
  }
);

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null, // { uid, email }
    profile: null, // admin profile (serializable)
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.authUser = action.payload.authUser;
      state.profile = action.payload.profile;
      state.loading = false;
    },
    logout: (state) => {
      state.authUser = null;
      state.profile = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listenToAuthChanges.pending, (state) => {
      state.loading = true;
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
