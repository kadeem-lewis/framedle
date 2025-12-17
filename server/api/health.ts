export default defineEventHandler(() => {
  return {
    status: 200,
    message: "API is running",
    timestamp: new Date().toISOString(),
  };
});
