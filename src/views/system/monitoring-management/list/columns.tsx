import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    { label: 'ip端口', prop: 'ip' },
    { label: '版本号', prop: 'version' },
    { label: '描述', prop: 'description' },
    { label: 'CAE软件', slot: 'workerSofts' },
    { label: '已存在计算模型数量', slot: 'refTemplateTotal' },
    {
      label: '启用/停用',
      prop: 'enabled',
      width: 130,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size === 'small' ? 'small' : 'default'}
          type={row.enabled ? 'success' : 'info'}
        >
          {row.enabled ? '启用' : '停用'}
        </el-tag>
      )
    },
    {
      label: '状态',
      prop: 'status',
      width: 130,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size === 'small' ? 'small' : 'default'}
          type={row.online ? 'success' : 'info'}
        >
          {row.online ? '在线' : '离线'}
        </el-tag>
      )
    },
    { label: '操作', fixed: 'right', width: 230, slot: 'operation' }
  ]);

  return {
    columns
  };
}
