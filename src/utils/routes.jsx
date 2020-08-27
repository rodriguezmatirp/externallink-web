const url =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000";

export const addSitemap = `${url}/master`;
export const getSitemaps = `${url}/master`;
export const scrapData = `${url}/crawl`;
// export const getScrapedData = `${url}/get/algo1`;
// export const getGlobalData = `${url}/get/Date`;
// export const getFilterData = `${url}/get/follow`;
// export const checkArticle = `${url}/check`;
// export const getCSVData = `${url}/downloadAll`;
export const getDownloadCSV = `${url}/uploads/tmp`;
// export const getDownload = `${url}/downloadByDate`;
export const changeStatus = `${url}/status`;
export const restrictFilter = `${url}/restrict`;
export const deleteWebsite = `${url}/deleteWebsite`;
export const deleteRestricted = `${url}/deleteRestricted`;
export const webInfo = `${url}/info`;
export const crawlAll = `${url}/crawlAll`;
export const getData = `${url}/getData`;
export const updateData = `${url}/update`;
export const getExternalLinks = `${url}/getExtLink`;
export const changeStatusExtLink = `${url}/verify`;
export const downloadExternalLinks = `${url}/download`;
export const monitorCrawlList = `${url}/crawlList`

export const getRegistered = `${url}/users/register`;
export const getLogined = `${url}/users/login`;
export const deleteUserData = `${url}/deleteProfile`;
export const getUsersData = `${url}/getUsers`;