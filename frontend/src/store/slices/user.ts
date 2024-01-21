import { createSlice } from '@reduxjs/toolkit';
import { type User } from '../../types';
import { userApi } from '../apis/userApi';

const initialState: User = {
    id: '',
    name: '',
    surname: '',
    email: '',
    filterSettings: {
        term: '',
        apiNames: [],
        fromDate: '',
        toDate: '',
        page: 1,
        sortOrder: '',
        extraFilters: {},
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addMatcher(userApi.endpoints.register.matchFulfilled, (state, action) => {
            const { register, user } = action.payload;

            if (register) return user;
        });
        builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
            const { login, user } = action.payload;

            if (login) return user;
        });
        builder.addMatcher(userApi.endpoints.verify.matchFulfilled, (state, action) => {
            const { verify, user } = action.payload;

            if (verify) return user;
        });
        builder.addMatcher(userApi.endpoints.logout.matchFulfilled, (state, action) => {
            return initialState;
        });
    },
});

export { userSlice };