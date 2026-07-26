// store/slices/authSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.token = "";
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastOrderEmail")
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;