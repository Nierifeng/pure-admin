import { http } from '@/utils/http';
import { KeyValue, QueryParam } from '@/utils/models';

interface GetRequestBase {
  success: boolean;
  code: number;
  data: KeyValue;
  message: string;
}

interface GetRequestArrayBase {
  success: boolean;
  code: number;
  data: Array<KeyValue>;
  message: string;
}

function GetSoftVersions() {
  return http.get<QueryParam, GetRequestBase>('/api/Worker/GetSoftVersions');
}

function ListCAESoftType() {
  return http.get<QueryParam, GetRequestArrayBase>(
    '/api/Worker/ListCAESoftType'
  );
}

export { GetSoftVersions, ListCAESoftType };
