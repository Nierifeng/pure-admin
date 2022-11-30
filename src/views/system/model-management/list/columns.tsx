import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    { label: '名称', prop: 'name' },
    { label: '类型', prop: 'type' },
    { label: '版本号', prop: 'version' },
    { label: '功能说明', prop: 'desc' },
    { label: '上传时间', prop: 'time' },
    { label: '存储服务器', prop: 'serverName' },
    { label: '操作', fixed: 'right', width: 120, slot: 'operation' }
  ]);

  return {
    columns
  };
}
