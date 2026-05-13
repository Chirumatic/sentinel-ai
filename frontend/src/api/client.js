import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
})

export const getIncidents = () => api.get('/api/incidents')
export const getIncident = (id) => api.get(`/api/incidents/${id}`)
export const analyzeIncident = (incident_id) => api.post('/api/ai/analyze', { incident_id })
export const chatWithAI = (message, incident_context = null) =>
  api.post('/api/ai/chat', { message, incident_context })
export const getErrors = () => api.get('/api/logs/errors')

export default api
