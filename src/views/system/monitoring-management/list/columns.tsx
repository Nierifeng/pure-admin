import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    { label: 'ip端口', prop: 'ip' },
    { label: '版本号', prop: 'version' },
    { label: '描述', prop: 'desc' },
    { label: 'CAE软件', slot: 'software' },
    { label: '已存在计算模型数量', slot: 'quantityModel' },
    {
      label: '开启/停用',
      prop: 'isOpen',
      width: 130,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size === 'small' ? 'small' : 'default'}
          type={row.status === 1 ? 'success' : 'info'}
        >
          {row.status === 1 ? '开启' : '停用'}
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
          type={row.status === 1 ? 'success' : 'info'}
        >
          {row.status === 1 ? '在线' : '离线'}
        </el-tag>
      )
    },
    { label: '操作', fixed: 'right', width: 230, slot: 'operation' }
  ]);

  return {
    columns
  };
}
