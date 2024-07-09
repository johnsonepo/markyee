import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const data = action.payload;
            state[data.username] = data;
        },
        logoutUser: (state, action) => {
            const username = action.payload.username;
            delete state[username];
        },
        updateUser: (state, action) => {
            const updatedUser = action.payload;
            state[updatedUser.username] = updatedUser;
        },
        removeUser: (state, action) => {
            const usernameToRemove = action.payload.username;
            return Object.fromEntries(
                Object.entries(state).filter(([key]) => key !== usernameToRemove)
            );
        },
    },
});

export const { loginUser, logoutUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
