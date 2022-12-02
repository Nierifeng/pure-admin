<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { type PaginationProps } from '@pureadmin/table';
import { ElMessage, FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useColumns } from './columns';
import addParseDialog from '../components/add-model-dialog.vue';
import { deleteModel, getModelList } from '@/api/system/model';
import { QueryParam } from '@/utils/models';
import { Model } from '../../modules';
import { ListCAESoftType } from '@/api/system/workder';

defineOptions({
  name: 'model'
});

const form = reactive({
  name: '',
  pageIndex: 1,
  pageSize: 10,
  caeSoftType: ''
});
const dataList = ref([]);
const loading = ref(true);
const addParseDialogVis = ref(false);
const { columns } = useColumns();
const cAESoftTypes = ref([]);

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

async function handleDelete(id: string) {
  const request = await deleteModel(id);
  console.log(request);
  ElMessage({
    message: '删除成功。',
    type: 'success'
  });
  await onSearch();
}

function handleCurrentChange(val: number) {
  form.pageIndex = val;
  onSearch();
}

function handleSizeChange(val: number) {
  form.pageSize = val;
  onSearch();
}

function addData() {
  addParseDialogVis.value = true;
}

async function onSearch() {
  loading.value = true;
  const { data } = await getModels(form);
  dataList.value = data.data.map(s => ({
    ...s,
    caeSoftTypeLable:
      cAESoftTypes.value?.find(i => i.value === s.caeSoftType)?.key ?? ''
  }));
  pagination.total = data.record;
  loading.value = false;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

const getModels = async (param: QueryParam) => {
  const request = await getModelList(param);
  return request as {
    data: {
      data: Array<Model>;
      record: number;
    };
  };
};

async function getCAESoftType() {
  const { data } = await ListCAESoftType();
  cAESoftTypes.value = data;
}

onMounted(async () => {
  await getCAESoftType();
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
      <el-form-item label="类型:" prop="caeSoftType">
        <el-select
          v-model="form.caeSoftType"
          placeholder="请选择类型"
          clearable
          filterable
        >
          <el-option
            v-for="item in cAESoftTypes"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
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
      title="计算模型管理列表"
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
              @confirm="handleDelete(row.id)"
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
      @update-list="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
