import { http } from '@/utils/http';
import { QueryParam } from '@/utils/models';
import { Model } from '@/views/system/modules';

function addModel(model: Model) {
  return http.post('/api/CAETaskResource/add', { data: model });
}

function getModelList(params: QueryParam) {
  return http.post('/api/CAETaskResource/GetPageList', { data: params });
}

function deleteModel(id) {
  return http.get('/api/CAETaskResource/delete', { params: { id } });
}

export { addModel, getModelList, deleteModel };
