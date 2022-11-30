<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { useColumns } from './columns';
import ModelDialog from '../components/model-dialog.vue';
import SoftwareDislog from '../components/software-dialog.vue';
import { type PaginationProps } from '@pureadmin/table';
import { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { useRouter } from 'vue-router';
import { getMonitoringList } from '@/api/system/monitoring';

defineOptions({
  name: 'monitoring'
});

const router = useRouter();
const form = reactive({
  ip: ''
});

const softwareDialogVisible = ref(false);
const modelDialogVisible = ref(false);
let dataList = ref<Array<any>>([]);
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
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function clearModule(row) {
  console.log('clearModule', row);
}

function softwareList(row) {
  softwareDialogVisible.value = true;
  console.log(row, 'row');
}

function quantityModelList(row) {
  modelDialogVisible.value = true;
  console.log(row);
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
  // const request = await getMonitoringList({
  //   pageSize: 10,
  //   pageIndex: 1
  // });
  // console.log(request);

  return {
    success: true,
    data: {
      list: [
        {
          ip: '1',
          version: '1.1',
          desc: '描述',
          software: ['软件名'],
          catalogue: 'a',
          quantityModel: '',
          isOpen: true,
          status: 1
        },
        {
          ip: '2',
          version: '2.1',
          desc: '描述2',
          software: ['软件名2', '软件名3'],
          catalogue: 'a',
          quantityModel: '',
          isOpen: false,
          status: 2
        },
        {
          ip: '3',
          version: '3.1',
          desc: '描述3',
          software: ['软件名3', '软件名4', '软件名5'],
          catalogue: 'a',
          quantityModel: '',
          isOpen: true,
          status: 1
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
      <el-form-item label="Ip端口:" prop="ip">
        <el-input v-model="form.ip" placeholder="请输入ip地址" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <TableProBar
      title="监控管理列表"
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
          <template #software="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="softwareList(row)"
            >
              {{ row.software.toString() }}
            </el-button>
          </template>
          <template #quantityModel="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="quantityModelList(row)"
            >
              {{ row.quantityModel }}
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
    <SoftwareDislog v-model:visible="softwareDialogVisible" />
    <ModelDialog v-model:visible="modelDialogVisible" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
