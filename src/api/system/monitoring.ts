import { http } from '@/utils/http';
import { QueryParam } from '@/utils/models';

function getMonitoringList(params: QueryParam) {
  return http.post('/api/Worker/GetPageList', { data: params });
}

export { getMonitoringList };
