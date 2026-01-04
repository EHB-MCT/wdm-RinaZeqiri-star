export const ADMIN_API_URL = "http://localhost:3000";

async function fetchApi(endpoint, options = {}) {
  const url = `${ADMIN_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export async function getUsers() {
  const data = await fetchApi('/admin/users');
  if (!data.ok) {
    throw new Error('Failed to fetch users');
  }
  return data.users;
}

export async function getStats() {
  const data = await fetchApi('/admin/stats');
  if (!data.ok) {
    throw new Error('Failed to fetch stats');
  }
  return data.stats;
}

export async function getEvents(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.type) params.append('type', filters.type);
  if (filters.page) params.append('page', filters.page);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString();
  const endpoint = `/admin/events${queryString ? `?${queryString}` : ''}`;
  
  const data = await fetchApi(endpoint);
  if (!data.ok) {
    throw new Error('Failed to fetch events');
  }
  return data.events || [];
}

export async function getEntries(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString();
  const endpoint = `/admin/entries${queryString ? `?${queryString}` : ''}`;
  
  const data = await fetchApi(endpoint);
  if (!data.ok) {
    throw new Error('Failed to fetch entries');
  }
  return data.entries || [];
}