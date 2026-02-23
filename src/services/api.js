import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

export default axios.create({
  baseURL,
  // ... any other defaults
});