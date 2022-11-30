import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    { label: '名称', prop: 'name' },
    { label: '描述', prop: 'desc' },
    { label: '推送地址', prop: 'pushAddress' },
    { label: '时间', prop: 'time' },
    { label: '任务模板列表', slot: 'taskTemplates' },
    { label: '操作', fixed: 'right', width: 230, slot: 'operation' }
  ]);

  return {
    columns
  };
}
