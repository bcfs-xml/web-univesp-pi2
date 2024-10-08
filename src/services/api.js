import axios from "axios";


export const api = axios.create({
  baseURL: 'https://api-univesp-pi2.vercel.app/'
})