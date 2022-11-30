import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    {
      label: 'ip端口',
      prop: 'ip'
    },
    {
      label: '根目录',
      prop: 'catalogue'
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
          {row.status === 1 ? '开启' : '关闭'}
        </el-tag>
      )
    },
    {
      label: '操作',
      fixed: 'right',
      width: 180,
      slot: 'operation'
    }
  ]);

  return {
    columns
  };
}
