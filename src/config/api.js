const API_BASE = process.env.REACT_APP_API_BASE ?
    `${process.env.REACT_APP_API_BASE}/api` :
    'http://localhost:5000/api';

export default API_BASE;