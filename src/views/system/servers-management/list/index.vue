<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { type PaginationProps } from '@pureadmin/table';
import { type FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useColumns } from './columns';

defineOptions({
  name: 'servers'
});

const form = reactive({
  name: '',
  code: '',
  status: ''
});

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function handleDelete(row) {
  console.log(row);
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function handleSelectionChange(val) {
  console.log('handleSelectionChange', val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getRoleList();
  dataList.value = data.list;
  pagination.total = data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

const getRoleList = async () => {
  return {
    success: true,
    data: {
      list: [
        {
          ip: '1',
          catalogue: 'a',
          status: 1
        },
        {
          ip: '2',
          catalogue: 'b',
          status: 1
        },
        {
          ip: '3',
          catalogue: 'c',
          status: 0
        },
        {
          ip: '1',
          catalogue: 'a',
          status: 1
        },
        {
          ip: '2',
          catalogue: 'b',
          status: 1
        },
        {
          ip: '3',
          catalogue: 'c',
          status: 0
        }
      ],
      total: 6
    }
  };
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色标识：" prop="code">
        <el-input v-model="form.code" placeholder="请输入角色标识" clearable />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable>
          <el-option label="已开启" value="1" />
          <el-option label="已关闭" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <TableProBar
      title="存储服务器列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template v-slot="{ size, checkList }">
        <PureTable
          border
          align="center"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-popconfirm
              v-if="row.status !== 1"
              title="是否确认删除?"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </TableProBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
