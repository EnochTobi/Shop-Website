const CONFIG = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-production-api.com"
      : "http://localhost:3000",
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  IMAGE_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-cdn.com/images"
      : "http://localhost:3000/images",
};
