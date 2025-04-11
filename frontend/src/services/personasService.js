import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3000/api/personas";

export const getPersonas = async () => {
    const resp = await axios.get(`${API}/personas`);
    return resp.data;
};
