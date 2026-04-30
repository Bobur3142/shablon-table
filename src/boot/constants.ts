export const url_http = {
  BASE_URL:
    process.env.NODE_ENV === "production" ? "api/" : "http://localhost:8082/api",
  BASE_API:
    process.env.NODE_ENV === "production" ? "api/" : "http://localhost:8082/api",

  BASE_RESOURCE_URL:
    process.env.NODE_ENV === "production" ? "http://94.158.54.197:8030/api" : "http://192.168.44.43:8080/api",


  BASE_TIMEOUT: 10 * 60 * 1000,
  UPLOAD_TIMEOUT: 2 * 60 * 1000,
  EXCEL_TIMEOUT: 10 * 60 * 1000,
};

export const base_lang = {
  code: "uz",
  name: "O'zbek"
}

export const urls = {
  LOGIN: url_http.BASE_URL + "/garbage-flow/auth/login",
  USER_ROLES: url_http.BASE_API + "/garbage-flow/user-roles",
};
