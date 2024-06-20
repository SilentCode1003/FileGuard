import Axios from 'axios'
import { CONFIG } from '../config/env'

export const apiClient = Axios.create({
  baseURL: CONFIG.SERVER_URL,
  withCredentials: true, // Send cookies
})
