import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

/* ---------------- FETCH COMPANY PROFILE ---------------- */

export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchCompanyProfile",
  async (uid) => {
    if (!uid) return null;

    const snap = await getDoc(doc(db, "companies", uid));
    if (!snap.exists()) return null;

    const data = snap.data();

    // ✅ CONVERT FIRESTORE TIMESTAMPS → SERIALIZABLE
    return {
      ...data,
      createdAt: data.createdAt
        ? data.createdAt.toDate().toISOString()
        : null,
      updatedAt: data.updatedAt
        ? data.updatedAt.toDate().toISOString()
        : null,
    };
  }
);

/* ---------------- SAVE / UPDATE COMPANY PROFILE ---------------- */

export const saveCompanyProfile = createAsyncThunk(
  "company/saveCompanyProfile",
  async ({ uid, data }) => {
    if (!uid) throw new Error("User not authenticated");

    const ref = doc(db, "companies", uid);

    await setDoc(
      ref,
      {
        ...data,
        ownerId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // ✅ RETURN REDUX-SAFE DATA
    return {
      ...data,
      ownerId: uid,
      updatedAt: new Date().toISOString(),
    };
  }
);

/* ---------------- SLICE ---------------- */

const companySlice = createSlice({
  name: "company",
  initialState: {
    profile: null,
    loading: false,
  },
  reducers: {
    clearCompany: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompanyProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
