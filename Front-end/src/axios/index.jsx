import axios from "axios";

// Base configuration
const commonConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8000',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  withXSRFToken: true
};

// Create first instance for root endpoints (like /sanctum/csrf-cookie)
const rootAxios = axios.create({
  ...commonConfig,
  baseURL: 'http://127.0.0.1:8000'
});

// Create second instance for API endpoints (like /api/register)
const apiAxios = axios.create({
  ...commonConfig,
  baseURL: 'http://127.0.0.1:8000/api'
});

export { rootAxios, apiAxios };
