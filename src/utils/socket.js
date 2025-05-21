import { io } from 'socket.io-client';
import API_BASE_URL from "../components/Config";
const socket = io(`${API_BASE_URL}`); // Update this to your server URL

export default socket;
