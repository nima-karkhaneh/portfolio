const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const TODOS_URL = `${BASE_URL}${import.meta.env.VITE_API_PATH_TODOS}`;
export const SUBMIT_URL = `${BASE_URL}${import.meta.env.VITE_API_PATH_SUBMIT}`;
export const VERIFY_URL = `${BASE_URL}${import.meta.env.VITE_API_PATH_VERIFY}`;
export const SIGNOUT_URL = `${BASE_URL}${import.meta.env.VITE_API_PATH_SIGNOUT}`;
