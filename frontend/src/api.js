const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options)
    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : null
    if (!response.ok) {
      const error = new Error(data?.detail || 'The recommendation service is currently unavailable.')
      error.status = response.status
      throw error
    }
    if (!data) throw new Error('The recommendation service returned an invalid response.')
    return data
  } catch (error) {
    console.error('Recommendation API request failed:', error)
    throw error
  }
}

export const api = {
  health: () => request('/api/health'),
  cuisines: () => request('/api/cuisines'),
  cuisineRecommendations: (cuisine) =>
    request(`/api/recommendations/cuisine/${encodeURIComponent(cuisine)}`),
  musicTitles: (query) => request(`/api/music/titles?q=${encodeURIComponent(query)}`),
  musicRecommendations: (title) =>
    request(`/api/recommendations/music?title=${encodeURIComponent(title)}`),
  search: (payload) => request('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
  searchCapabilities: () => request('/api/search/capabilities'),
  searchEvaluation: () => request('/api/search/evaluation'),
}
