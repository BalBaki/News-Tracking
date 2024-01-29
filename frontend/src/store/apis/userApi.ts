import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    type LoginForm,
    type RegisterForm,
    type RegisterResponse,
    type LoginResponse,
    type LogoutResponse,
    type SaveSettingsResponse,
    type VerifyResponse,
    type ChangeFavoritesResponse,
    type News,
} from '../../types';

interface SearchSettings {
    apiNames: string[];
    fromDate: string | Date;
    toDate: string | Date;
    extraFilters: {
        [key: string]: any;
    };
}

interface ChangeFavorite {
    type: 'add' | 'remove';
    news: News;
}

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        credentials: 'include',
    }),
    tagTypes: ['Favorite'],
    endpoints(builder) {
        return {
            register: builder.mutation<RegisterResponse, RegisterForm>({
                query: (payload) => {
                    const { confirmPassword, ...rest } = payload;

                    return {
                        method: 'POST',
                        url: '/register',
                        body: {
                            payload: encodeURIComponent(JSON.stringify(rest)),
                        },
                    };
                },
            }),
            login: builder.mutation<LoginResponse, LoginForm>({
                query: (payload) => {
                    return {
                        method: 'POST',
                        url: '/login',
                        body: {
                            payload: encodeURIComponent(JSON.stringify(payload)),
                        },
                    };
                },
            }),
            logout: builder.mutation<LogoutResponse, void>({
                query: () => {
                    return {
                        method: 'POST',
                        url: '/logout',
                    };
                },
            }),
            verify: builder.query<VerifyResponse, void>({
                providesTags: [{ type: 'Favorite' }],
                query: () => {
                    return {
                        method: 'POST',
                        url: '/verify',
                    };
                },
            }),
            saveSettings: builder.mutation<SaveSettingsResponse, SearchSettings>({
                query: (payload) => {
                    return {
                        method: 'POST',
                        url: '/savesettings',
                        body: {
                            payload: encodeURIComponent(JSON.stringify(payload)),
                        },
                    };
                },
            }),
            changeFavorite: builder.mutation<ChangeFavoritesResponse, ChangeFavorite>({
                invalidatesTags: (result) => (result?.success ? [{ type: 'Favorite' }] : []),
                query: (payload) => {
                    return {
                        method: 'POST',
                        url: '/favorite',
                        body: {
                            payload: encodeURIComponent(JSON.stringify(payload)),
                        },
                    };
                },
            }),
        };
    },
});

export { userApi };
export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useLazyVerifyQuery,
    useSaveSettingsMutation,
    useChangeFavoriteMutation,
} = userApi;
