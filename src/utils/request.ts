import axios from "axios"
import { PI_BASE_URL } from "./contants"


const piRequest = axios.create({
  baseURL: PI_BASE_URL,
  timeout: 50000,
  headers: {
    Authorization: `key ${process.env.PI_API_KEY}`
  }
})


export default piRequest