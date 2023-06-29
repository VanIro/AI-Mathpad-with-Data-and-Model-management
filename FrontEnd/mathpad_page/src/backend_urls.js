const BASE_URL = "http://localhost:8000/"

const BACKEND_URL_login = `${BASE_URL}users/login/`
const BACKEND_URL_logout =`${BASE_URL}users/logout/`
const BACKEND_URL_UInfo =`${BASE_URL}users/user_info/`
const BACKEND_URL_register = `${BASE_URL}users/register/`
const BACKEND_URL_viewAllData = `${BASE_URL}users/getAllImages/`;
const BACKEND_URL_updateImageLabel = `${BASE_URL}users/updateImageLabel/`;
const URL_TOKEN_REFRESH = `${BASE_URL}token/refresh/`
const URL_TOKEN_VERIFY = `${BASE_URL}token/verify/`


module.exports = {
    BASE_URL, BACKEND_URL_login, BACKEND_URL_logout, BACKEND_URL_UInfo, BACKEND_URL_register, BACKEND_URL_viewAllData, BACKEND_URL_updateImageLabel, URL_TOKEN_REFRESH, URL_TOKEN_VERIFY
}