<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const dialogTableVisible = ref(false);
const tableData = [
  {
    name: 'Acc',
    versions: '1.0',
    time: new Date(),
    desc: '描述说明'
  }
];

function closeDialog() {
  console.log('closeDialog');
  dialogTableVisible.value = false;
}

const emit = defineEmits(['update:visible']);
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

// watch(
//   () => props.data,
//   val => {
//     formData.value = val;
//   }
// );
onMounted(() => {
  dialogTableVisible.value = props.visible;
});
</script>

<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="任务模板列表"
    :width="680"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-table :data="tableData">
      <el-table-column property="name" label="任务名称" width="150" />
      <el-table-column property="modelName" label="计算模型" />
      <el-table-column property="type" label="类型" width="200" />
      <el-table-column
        property="parentTaskTemplate"
        label="父任务模板"
        width="200"
      />
      <el-table-column
        property="subTaskTemplate"
        label="子任务模板"
        width="200"
      />
      <el-table-column property="operation" label="操作" width="200" />
    </el-table>
    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
