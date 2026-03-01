import { api } from './api';

export async function createRescueRequest(payload, token = null) {
  const body = {
    category: payload.category || 'rescue',
    province_city: payload.province_city || '',
    phone_number: payload.phone_number || payload.phone || '',
    description: payload.description || '',
    num_people: payload.num_people || 1,
    priority: payload.priority || 'medium',
    location_type: payload.location_type || 'manual',
    media_urls: payload.media_urls || [],
  };
  if (body.location_type === 'gps') {
    body.latitude = payload.latitude ?? payload.location?.lat;
    body.longitude = payload.longitude ?? payload.location?.lng;
  } else {
    body.address = payload.address || '';
  }
  const res = await api.post('/rescue-requests', body);
  return res.data;
}

export async function getRescueRequests(params = {}) {
  const q = new URLSearchParams();
  if (params.user_id) q.set('user_id', params.user_id);
  if (params.page) q.set('page', params.page);
  if (params.limit) q.set('limit', params.limit);
  if (params.status) q.set('status', params.status);
  const query = q.toString();
  const res = await api.get(`/rescue-requests${query ? `?${query}` : ''}`);
  return { data: res.data || [], pagination: res.pagination };
}

export async function getRescueRequestById(id) {
  const res = await api.get(`/rescue-requests/${id}`);
  return res.data;
}
