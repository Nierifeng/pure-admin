<template>
  <div class="main">
    <PureDescriptions
      title="标题"
      align="left"
      :column="4"
      border
      :data="data"
      :columns="columns"
      :loading="loading"
      class="bg-bg_color w-[99/100] pl-8 pt-4 pb-4"
    />
    <el-tabs
      v-model="activeName"
      class="bg-bg_color mt-4 pl-4 pb-4"
      @tab-click="handleClick"
    >
      <el-tab-pane label="CAE软件" name="software">
        <el-table :data="CAETableData">
          <el-table-column property="name" label="软件名称" />
          <el-table-column property="type" label="类型" />
          <el-table-column property="versions" label="版本" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已存在计算模型" name="model">
        <el-table :data="modelTableData">
          <el-table-column property="name" label="模型名称" />
          <el-table-column property="versions" label="版本号" />
          <el-table-column property="desc" label="功能说明" />
          <el-table-column property="time" label="上传时间" /> </el-table
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@pureadmin/descriptions';
import { TabsPaneContext } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Model, Software } from '../../modules/index';
import { useColumns } from './columns';
const { columns } = useColumns();

const route = useRoute();

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  "
  style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

const loading = ref<Loading>({
  load: true,
  svgViewBox: '-10, -10, 50, 50',
  svg
});
const data = ref<any>();
const activeName = ref('software');

const modelTableData: Array<Model> = [
  {
    name: 'Acc',
    versions: '1.0',
    time: new Date(),
    desc: '描述说明'
  }
];
const CAETableData: Array<Software> = [
  {
    name: 'Acc',
    type: '类型',
    versions: '1.0'
  }
];

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

setTimeout(() => {
  data.value = [
    {
      name: '采集服务器',
      isOpen: 1,
      ip: '192.168.69',
      desc: '这是描述捏',
      version: '1.5.2',
      skill: 'eat、work、sleep'
    }
  ];
  loading.value.load = false;
}, 400);

onMounted(() => {
  console.log(route.query);
  console.log(route.params);
});
</script>

<style scoped></style>
