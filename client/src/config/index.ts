const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  socketUrl: import.meta.env.VITE_SOCKET_URL || "http://localhost:8080",
};

export default config;
