import axios from "axios";

const API_URL = process.env.API_URL;
export const API = axios.create({ baseURL: API_URL });


const refreshAuthInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});


export const loginCall = async (userCredentials, dispatch) => {
  dispatch({type: "LOGIN_START"});
  try {
    const res = await API.post("auth/login", userCredentials);
    console.log(res);
    if (res.status === 200) {
      console.log(res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setAuthToken(res.data.accessToken);
    }
    dispatch({type: "LOGIN_SUCCESS", payload: res.data.user});
  } catch(err) {
    dispatch({type: "LOGIN_FAILURE", payload: err});
  }
};

export const autologinCall = async (dispatch, userData) => {
  const accessToken = localStorage.getItem('accessToken');
  console.log("autologinCall");
  setAuthToken(accessToken);
  try {
    const res = await API.get(`/users?username=${userData.username}`);
    console.log(res);
    localStorage.setItem('user', JSON.stringify(res.data));
    dispatch({type: "LOGIN_SUCCESS", payload: res.data});
  } catch(err) {
    console.log(err);
  }
};

export const logoutCall = async (dispatch) => {
  console.log("logoutCall");
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    await API.delete("auth/logout", {token: refreshToken});
  } catch(err) {

  }
  localStorage.clear();
  dispatch({type: "LOGIN_FAILURE", payload: false}); // TODO LOGOUT_SUCCESS
};

function setAuthToken(token) {
  console.log("setAuthToken");
  API.defaults.headers.common['Authorization'] = '';
  delete API.defaults.headers.common['Authorization'];
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

let isRefreshing = false;
let storedRefreshingCall = undefined;

function doRefreshToken(dispatch) {
  if (isRefreshing) {
    console.log("already refreshing");
    return storedRefreshingCall;
  }
  isRefreshing = true;
  console.log("start refreshing");
  const refreshToken = localStorage.getItem('refreshToken');

  const refreshingCall = refreshAuthInstance.post("auth/token", {token: refreshToken}).then((res) => {
    console.log("refreshing done");
    console.log(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    isRefreshing = false;
    storedRefreshingCall = undefined;
    return Promise.resolve(true);
  }).catch((err) => {
    isRefreshing = false;
    storedRefreshingCall = undefined;
    localStorage.clear();
    console.log("Fail: logout now");
    dispatch({type: "LOGIN_FAILURE", payload: false});
    return Promise.reject(false);
  });

  storedRefreshingCall = refreshingCall;
  return refreshingCall;
};

export function setResponseInterceptor(dispatch) {
  console.log("setResponseInterceptor");
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response ? error.response.status : null;
      console.log("intercepted Error " + String(status) + String(error.response.data));
      if (status === 403 && error.response.data === 'token invalid') {
        return doRefreshToken(dispatch).then(_ => {
          console.log("Updating accessToken");
          error.config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
          API.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
          error.config.baseURL = undefined;
          return API.request(error.config);
        });
      }
      return Promise.reject(error);
    }
  );
}
