import { http } from '@/utils/http';
import { QueryParam } from '@/utils/models';

function getGroupList(params: QueryParam) {
  return http.post('/api/CAETskTemplate/getGroupPageList', { data: params });
}

export { getGroupList };
