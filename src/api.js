import axios from 'axios';
import API_BASE_URL from "../src/components/Config";
const API = axios.create({ baseURL: `${API_BASE_URL}/api` });

export const createRound = () => API.post('/game/create');
export const fetchRounds = () => API.get('/game/rounds');
export const declareResult = (data) => API.post('/game/declare', data);
export const autoDeclare = (periodId) => API.post('/game/auto-declare', { periodId });
export const fetchBets = (periodId) => API.get(`/bet/by-period/${periodId}`);
