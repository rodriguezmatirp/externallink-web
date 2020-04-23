const url = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000';

export const addSitemap = `${url}/master`;
export const getSitemaps = `${url}/master`;
export const scrapData = `${url}/algo1`;
export const getScrapedData = `${url}/get/algo1`;
