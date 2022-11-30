<script setup lang="ts">
import { TableProBar } from '@/components/ReTable';
import { useColumns } from './columns';
import { type PaginationProps } from '@pureadmin/table';
import { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import addTemplateDialog from '../components/add-template-dialog/index.vue';

defineOptions({
  name: 'monitoring'
});

const form = reactive({
  ip: ''
});

const templateDialogVisible = ref(false);
const addTemplateVisible = ref(false);

let dataList = ref<Array<any>>([]);
let loading = ref(true);
const { columns } = useColumns();

let selectProject = null;

const formRef = ref<FormInstance>();
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function deleteProject(id) {
  console.log('deleteProject', id);
}

function showTemplateDialog(row) {
  templateDialogVisible.value = true;
  selectProject = row;
  console.log(row, 'row');
}

function addTemplate(row) {
  addTemplateVisible.value = true;
  console.log(row);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getProjectList();
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

const getProjectList = async () => {
  return {
    success: true,
    data: {
      list: [
        {
          ip: '1',
          version: '1.1',
          desc: '描述',
          templates: ['任务模板1', '任务模板2'],
          time: Date.now().toLocaleString()
        },
        {
          ip: '2',
          version: '2.1',
          desc: '描述2',
          templates: ['任务模板1', '任务模板2'],
          time: Date.now().toLocaleString()
        },
        {
          ip: '3',
          version: '3.1',
          desc: '描述3',
          templates: ['任务模板1', '任务模板2'],
          time: Date.now().toLocaleString()
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
      title="项目列表"
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
          <template #taskTemplates="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              @click="showTemplateDialog(row)"
            >
              {{ row.templates.toString() }}
            </el-button>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="addTemplate(row.id)"
            >
              新增任务模板
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="deleteProject(row.id)"
            >
              删除
            </el-button>
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <addTemplateDialog
      v-if="addTemplateVisible"
      v-model:visible="addTemplateVisible"
      :project="selectProject"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
