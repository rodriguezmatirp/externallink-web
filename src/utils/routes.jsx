const url =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000";

export const addSitemap = `${url}/master`;
export const getSitemaps = `${url}/master`;
export const scrapData = `${url}/algo1`;
export const getScrapedData = `${url}/get/algo1`;
export const getGlobalData = `${url}/get/Date`;
export const getFilterData = `${url}/get/follow`;
export const checkArticle = `${url}/check`;

export const getRegistered = `${url}/users/register`;
export const getLogined = `${url}/users/login`;
