import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name : null,
    phone : null,
    email : null,
    roles : [],
    status : null,
    accessToken : null,
    refreshToken : null,
};

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        setUser : (state, action) => {
            state.name = action.payload.name;
            state.phone = action.payload.phone;
            state.email = action.payload.email;
            state.roles = action.payload.roles;
            state.status = action.payload.status;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout : (state) => {
            state.name = null;
            state.phone = null;
            state.email = null;
            state.roles = [];
            state.status = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        refreshToken : (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
    }

});

export const { setUser, logout, refreshToken } = userSlice.actions;
export default userSlice.reducer;
