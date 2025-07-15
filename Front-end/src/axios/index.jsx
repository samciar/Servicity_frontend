import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:8000'
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
// axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;