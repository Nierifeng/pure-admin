<script setup lang="ts">
import { FormRules } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
const emit = defineEmits(['update:visible']);

let projectId = '';

const formData = reactive({
  id: '',
  name: '',
  modelId: '',
  type: '',
  version: '',
  cmd: ''
});

const cmdInput = ref<{ input: HTMLInputElement } | null>(null);

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur', type: 'string' }
  ]
});

const modelSelects = ref([]);

const modelLists = [
  {
    id: '8848648',
    name: '模型1'
  },
  {
    id: '8848649',
    name: '模型2'
  },
  {
    id: '8848650',
    name: '模型3'
  }
];

const taskTemplateTypeOptions = [
  {
    label: '类型1',
    value: '1'
  },
  {
    label: '类型2',
    value: '2'
  },
  {
    label: '类型3',
    value: '3'
  }
];

const versionOptions = [
  {
    label: '1.1',
    value: '1'
  },
  {
    label: '1.2',
    value: '2'
  },
  {
    label: '1.3',
    value: '3'
  }
];

const dialogTableVisible = ref(false);

function closeDialog() {
  dialogTableVisible.value = false;
}

function getModelOptions() {
  modelSelects.value = modelLists.map(s => ({
    label: s.name,
    value: s.id
  }));
}

function cmdReplace() {
  console.log(window.getSelection().toString());
  console.log(cmdInput.value);
  console.log(cmdInput.value.input.selectionStart);
  console.log(cmdInput.value.input.selectionEnd);
}

function ccl(ele) {
  console.log(ele);
}

watch(
  () => dialogTableVisible.value,
  val => {
    emit('update:visible', val);
  }
);

watch(
  () => props.visible,
  val => {
    dialogTableVisible.value = val;
  }
);

watch(
  () => props.project,
  val => {
    console.log(val);
    projectId = val.id;
  }
);

onMounted(() => {
  dialogTableVisible.value = props.visible;
  getModelOptions();
});
</script>

<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="添加任务模板"
    :width="680"
    :before-close="closeDialog"
  >
    <el-form
      :model="formData"
      ref="form"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="计算模型">
        <el-select v-model="formData.modelId">
          <el-option
            v-for="model in modelSelects"
            :label="model.label"
            :value="model.value"
            :key="model.value"
          />
        </el-select>
        <div v-show="formData.modelId">这里写计算模型描述</div>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.type" placeholder="请先选择计算模型">
          <el-option
            v-for="model in taskTemplateTypeOptions"
            :label="model.label"
            :value="model.value"
            :key="model.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="解析版本">
        <el-select v-model="formData.version" placeholder="请先选择类型">
          <el-option
            v-for="model in versionOptions"
            :label="model.label"
            :value="model.value"
            :key="model.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数">
        <div class="w-98/100">cmd调用语句</div>
        <div class="flex w-98/100">
          <el-input
            v-model="formData.cmd"
            ref="cmdInput"
            @keyup.enter="cmdReplace()"
            @ref="ccl"
            placeholder="请输入cmd调用语句"
            class="w-6/7 inline-blovck"
          />
          <el-button class="w-1/7" @click="cmdReplace()">替换</el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
