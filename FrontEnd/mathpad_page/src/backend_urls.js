// const BASE_URL = "http://localhost:8000/"


// let obtained_host_url = process.env.HOST_DOMAIN
// const BASE_URL = obtained_host_url? 'http://'+obtained_host_url+':7000' :"http://localhost:7000/"

const BASE_URL = "http://192.168.20.11:7000/"

const BACKEND_URL_login = `${BASE_URL}users/login/`
const BACKEND_URL_logout =`${BASE_URL}users/logout/`
const BACKEND_URL_UInfo =`${BASE_URL}users/user_info/`
const BACKEND_URL_register = `${BASE_URL}users/register/`
const BACKEND_URL_viewAllData = `${BASE_URL}users/getAllImages/`;
const BACKEND_URL_updateImageLabel = `${BASE_URL}users/updateImageLabel/`;
const BACKEND_URL_getImageLabel = `${BASE_URL}users/getImageLabel/`;
const URL_TOKEN_REFRESH = `${BASE_URL}token/refresh/`
const URL_TOKEN_VERIFY = `${BASE_URL}token/verify/`


module.exports = {
    BASE_URL, BACKEND_URL_login, BACKEND_URL_logout, BACKEND_URL_UInfo, BACKEND_URL_register, BACKEND_URL_viewAllData, BACKEND_URL_updateImageLabel, BACKEND_URL_getImageLabel, URL_TOKEN_REFRESH, URL_TOKEN_VERIFY
}