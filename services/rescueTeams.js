import { api } from './api';

/**
 * Danh sách thành viên đội cứu hộ.
 * Backend: GET /rescue-teams/:teamId/members hoặc tương đương.
 */
export async function getTeamMembers(teamId) {
  if (!teamId) return [];
  try {
    const res = await api.get(`/rescue-teams/${teamId}/members`);
    const raw = res.data ?? res;
    const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}
