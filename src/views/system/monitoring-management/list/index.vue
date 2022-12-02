<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { useColumns } from './columns';
import ModelDialog from '../components/model-dialog.vue';
import SoftwareDislog from '../components/software-dialog.vue';
import { type PaginationProps } from '@pureadmin/table';
// import { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { useRouter } from 'vue-router';
import { getMonitoringList } from '@/api/system/monitoring';
import { QueryParam } from '@/utils/models';

defineOptions({
  name: 'monitoring'
});

const router = useRouter();
const form = reactive({
  id: '',
  pageIndex: 1,
  pageSize: 10
});

const workerSoftDialogVisible = ref(false);
let workerSoft = {};
const modelDialogVisible = ref(false);
const dataList = ref<Array<any>>([]);
const loading = ref(true);
const { columns } = useColumns();

// const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function handleDelete(row) {
  console.log(row);
}

function showDetail(row) {
  const id = '123';
  useMultiTagsStoreHook().handleTags('push', {
    path: `/system/monitoring-management/detail/:id`,
    name: 'MonitoringDetail',
    params: { id },
    meta: {
      title: '监控详情'
    }
  });
  router.push({ name: 'MonitoringDetail', params: { id } });
  console.log(row);
}

function handleCurrentChange(val: number) {
  form.pageIndex = val;
  onSearch();
}

function handleSizeChange(val: number) {
  form.pageSize = val;
  onSearch();
}

function clearModule(row) {
  console.log('clearModule', row);
}

function workerSoftList(row) {
  workerSoftDialogVisible.value = true;
  workerSoft = row.workerSofts;
}

function quantityModelList(row) {
  modelDialogVisible.value = true;
  console.log(row);
}

async function onSearch() {
  loading.value = true;
  const { data } = await getMonitorings(form);
  dataList.value = data.data;
  pagination.total = data.record;
  loading.value = false;
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   formEl.resetFields();
//   onSearch();
// };

const getMonitorings = async (param: QueryParam) => {
  const request = await getMonitoringList(param);
  return request as {
    data: {
      data: Array<any>;
      record: number;
    };
  };
};

const getWorkerSoftNames = workerSofts => {
  const names = [];
  for (const key in workerSofts) {
    names.push(key);
  }
  return names.toString();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <!-- <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="Ip端口:" prop="ip">
        <el-input v-model="form.ip" placeholder="请输入ip地址" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form> -->

    <TableProBar
      title="监控端管理列表"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #workerSofts="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="workerSoftList(row)"
            >
              {{ getWorkerSoftNames(row.workerSofts) }}
            </el-button>
          </template>
          <template #refTemplateTotal="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="quantityModelList(row)"
            >
              {{ row.refTemplateTotal }}
            </el-button>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="showDetail(row)"
            >
              详情
            </el-button>
            <el-popconfirm
              :title="`是否确认${row.isOpen ? '停用' : '开启'}`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                >
                  {{ row.isOpen ? '停用' : '开启' }}
                </el-button>
              </template>
            </el-popconfirm>
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
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="clearModule(row)"
            >
              清除计算模型
            </el-button>
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <SoftwareDislog
      v-model:visible="workerSoftDialogVisible"
      :data="workerSoft"
    />
    <ModelDialog v-model:visible="modelDialogVisible" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
