<script setup lang="ts">
import { ref, watch } from 'vue';

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
const tableData = ref([]);

function closeDialog() {
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

watch(
  () => props.data,
  val => {
    const data = [];
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        data.push({ name: key, versions: val[key] });
      }
    }
    tableData.value = data;
  }
);
</script>

<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="软件列表"
    :width="380"
    draggable
    destroy-on-close
    :before-close="closeDialog"
  >
    <el-table :data="tableData">
      <el-table-column property="name" label="软件名称" width="150" />
      <el-table-column property="versions" label="版本" />
    </el-table>
    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
