<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { type PaginationProps } from '@pureadmin/table';
import { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useColumns } from './columns';
import addParseDialog from '../components/add-parse-dialog.vue';

defineOptions({
  name: 'monitoring'
});

const form = reactive({
  name: ''
});
let dataList = ref([]);
let loading = ref(true);
let addParseDialogVis = ref(false);
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

function addData() {
  addParseDialogVis.value = true;
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
          name: '1',
          version: '1.1',
          desc: '描述',
          time: new Date(),
          serverName: 'a'
        },
        {
          name: '2',
          version: '2.1',
          desc: '描述2',
          time: new Date(),
          serverName: 'b'
        },
        {
          name: '3',
          version: '3',
          desc: '描述3',
          time: new Date(),
          serverName: '3'
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
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <TableProBar
      title="解析管理列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="addData()"> 添加 </el-button>
      </template>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-popconfirm
              title="是否确认删除?"
              v-if="row.status !== 1"
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
    <addParseDialog
      v-if="addParseDialogVis"
      v-model:visible="addParseDialogVis"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
