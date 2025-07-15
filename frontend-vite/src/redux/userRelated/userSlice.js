import { createSlice } from '@reduxjs/toolkit';

// Initialize with null to prevent auto-login
const initialState = {
    status: 'idle',
    userDetails: [],
    tempDetails: [],
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    currentRole: localStorage.getItem('currentRole') || null,
    error: null,
    response: null,
    darkMode: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading';
        },
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        stuffAdded: (state, action) => {
            state.status = 'added';
            state.response = null;
            state.error = null;
            state.tempDetails = action.payload;
        },
        authSuccess: (state, action) => {
            state.status = 'success';
            state.currentUser = action.payload.user;
            state.currentRole = action.payload.role;
            state.error = null;
            state.response = null;
            // Optionally, persist to localStorage if you want to keep user logged in after refresh
            if (typeof window !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
                localStorage.setItem('currentRole', action.payload.role);
            }
        },
        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
        },
        authError: (state, action) => {
            state.status = 'error';
            state.error = action.payload;
        },
        authLogout: (state) => {
            state.status = 'idle';
            state.userDetails = [];
            state.tempDetails = [];
            state.loading = false;
            state.currentUser = null;
            state.currentRole = null;
            state.error = null;
            state.response = null;
            state.darkMode = true;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentRole');
                sessionStorage.clear();
            }
        },

        doneSuccess: (state, action) => {
            state.userDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getDeleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getRequest: (state) => {
            state.loading = true;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        }
    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    toggleDarkMode
} = userSlice.actions;

export const userReducer = userSlice.reducer;
