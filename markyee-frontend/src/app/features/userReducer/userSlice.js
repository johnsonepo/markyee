import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const newUsername = action.payload.username;
      if (state.username !== newUsername) {
        state.username = newUsername;
      }
    },
    logoutUser: (state) => {
      state.username = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
