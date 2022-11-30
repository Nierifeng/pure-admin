import { ref } from 'vue';

export function useColumns() {
  const columns = ref([
    {
      label: '名称',
      prop: 'name',
      width: 180
    },
    {
      label: 'ip 端口',
      prop: 'ip',
      width: 180
    },
    {
      label: '版本号',
      prop: 'version',
      width: 180
    },
    {
      label: '开启/停用',
      prop: 'isOpen',
      cellRenderer: ({ value }) => (
        <el-tag type={value === 1 ? 'success' : 'info'}>
          {value === 1 ? '开启' : '停用'}
        </el-tag>
      )
    },
    {
      label: '状态',
      prop: 'status',
      cellRenderer: ({ value }) => {
        return (
          <el-tag type={value === 1 ? 'success' : 'info'}>
            {value === 1 ? '在线' : '离线'}
          </el-tag>
        );
      }
    },
    {
      label: '描述',
      prop: 'desc'
    }
  ]);

  return {
    columns
  };
}
