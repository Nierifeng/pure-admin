<script setup lang="ts">
import { ref, watch } from 'vue';
import { Software } from '../../modules/software';

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
const tableData: Array<Software> = [
  {
    name: 'Acc',
    type: '类型',
    versions: '1.0'
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
</script>

<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="软件列表"
    :width="680"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-table :data="tableData">
      <el-table-column property="name" label="软件名称" width="150" />
      <el-table-column property="type" label="类型" width="200" />
      <el-table-column property="versions" label="版本" />
    </el-table>
    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
