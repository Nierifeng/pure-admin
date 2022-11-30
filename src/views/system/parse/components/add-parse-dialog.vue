<script setup lang="ts">
import { FormRules, UploadFile, UploadRawFile } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';
import { Client } from 'minio';
// import { createMinioClient } from 'tz-minio-upload_beta';
import SparkMD5 from 'spark-md5';
import { Chunk, Parse } from '../../modules';
import { createMinioClient, stream } from 'minio-upload-1';

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
const emit = defineEmits(['update:visible']);

const dialogTableVisible = ref(false);

const percent = ref(0);
const zipActionName = ref('暂停');
const zipName = ref('');
const supportingPaperName = ref('');
const zipFileLoading = ref(false);
const zipUploading = ref(false);
const SPFileLoading = ref(false);
const supportingPaper = ref(false);

const minioBrcketName = 'test1';
const accessKey = 'AKIAIOSFODNN7EXAMPLE';
const secretKey = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const chunkSize = 1024 * 1024 * 10; // 5M一个切片

let chunkList = [];
let uploadChuckList = [];
let fileNames: Array<string> = [];
let chunkListLength = 0;
let chunkUploadSucceedCount = 0;
let upload = false;
let minio: Client | undefined;

const formData = reactive<Parse>({
  name: '',
  fileName: '',
  serverId: ''
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur', type: 'string' }
  ]
});

watch(
  () => dialogTableVisible.value,
  val => {
    emit('update:visible', val);
  }
);

onMounted(() => {
  dialogTableVisible.value = props.visible;
  initMinio();
});

function closeDialog() {
  dialogTableVisible.value = false;
}

function initMinio() {
  minio = createMinioClient({
    endPoint: '192.168.12.134',
    port: 5003,
    useSSL: false,
    accessKey,
    secretKey
  });
  minio.bucketExists(minioBrcketName, function (err, exists) {
    if (err) {
      return console.log(err);
    }
    if (!exists) {
      minio.makeBucket(minioBrcketName, 'us-east-1');
    }
  });
}

async function supportingPaperChange(file: UploadFile) {
  SPFileLoading.value = supportingPaper.value = true;
  const fileObj = file.raw;
  supportingPaperName.value = fileObj.name;
  let buffer = await fileToBuffer(fileObj);
  const bufferStream = new stream.PassThrough();
  // 将buffer写入
  bufferStream.end(Buffer.from(buffer));
  minio.putObject(
    minioBrcketName,
    fileObj.name,
    bufferStream,
    fileObj.size,
    err => {
      SPFileLoading.value = supportingPaper.value = false;
      if (err) {
        console.error(err);
      }
    }
  );
}

async function zipChange(file: UploadFile) {
  if (!file) return;
  zipFileLoading.value = true;
  zipUploading.value = true;
  const fileObj = file.raw;
  zipName.value = fileObj.name;
  let buffer = await fileToBuffer(fileObj);
  const hash = bufferToMD5(buffer);
  const stream = minio.listObjects(minioBrcketName, hash, true); // 根据hash值去拿对应的文件夹下的文件

  stream.on('data', items => {
    fileNames.push(items.name.split('/')[1]);
  });
  stream.on('end', () => {
    zipFileLoading.value = false;
    chunkListLength = Math.ceil(fileObj.size / chunkSize); // 计算总共多个切片
    if (fileNames.length === chunkListLength) {
      // 代表文件完全存在不需要上传
      return;
    }
    upload = true;
    chunkList = fileToChunks(fileObj, hash);
    uploadChuckList = chunkList.filter(
      i => !fileNames.find(s => s === i.fileName)
    );
    chunkUploadSucceedCount = chunkList.length - uploadChuckList.length;
    uploadChuck();
  });
  stream.on('error', err => {
    console.error(err);
  });
}

function fileToBuffer(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = e => {
      resolve(e.target.result as ArrayBuffer);
    };
    fr.readAsArrayBuffer(file);
    fr.onerror = () => {
      reject(new Error('转换文件格式发生错误'));
    };
  });
}

function bufferToMD5(buffer: ArrayBuffer): string {
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(buffer);
  const hash = spark.end();
  return hash;
}

function fileToChunks(raw: UploadRawFile, hash: string) {
  const chunkList: Array<Chunk> = []; // 保存所有切片的数组
  let curChunk = 0; // 切片时的初始位置
  for (let i = 0; i < chunkListLength; i++) {
    const item: Chunk = {
      chunk: raw.slice(curChunk, curChunk + chunkSize),
      fileName: `${hash}.${i}` // 文件名规则按照 hash.1 命名
    };
    curChunk += chunkSize;
    chunkList.push(item);
  }
  return chunkList;
}

async function uploadChuck() {
  const requestList = [];
  for (const [index, chunk] of uploadChuckList.entries()) {
    const chunkArrayBuffer = await chunk.chunk.arrayBuffer();
    const bufferStream = new stream.PassThrough();
    // 将buffer写入
    bufferStream.end(Buffer.from(chunkArrayBuffer));
    requestList.push(() => {
      return minio
        .putObject(
          minioBrcketName,
          `${chunk.fileName.split('.')[0]}/${chunk.fileName}`,
          bufferStream
        )
        .then(() => {
          // 代表上传成功
          chunkUploadSucceedCount++;
          console.log(chunkUploadSucceedCount);
          percent.value = (chunkUploadSucceedCount / chunkListLength) * 100;
          uploadChuckList.splice(index, 1);
        })
        .catch(() => {
          // 代表上传失败
          upload = false;
        });
    });
  }
  let i = 0;
  const send = async () => {
    if (!upload) {
      return;
    }
    if (i >= requestList.length) {
      // 代表上传完成
      zipUploading.value = false;
      return;
    }
    await requestList[i]();
    i++;
    send();
  };
  send();
}

function suspendClick() {
  upload = !upload;
  zipActionName.value = upload ? '暂停' : '继续';
  if (upload) {
    uploadChuck();
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="添加解析管理"
    :width="300"
    draggable
    :before-close="closeDialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form
      :model="formData"
      ref="form"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="名称" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="formData.serverName" readonly />
      </el-form-item>
      <el-form-item label="程序文件">
        <span
          class="file-loading"
          v-show="zipFileLoading"
          v-loading="zipFileLoading"
        />
        <span class="file-name" v-show="zipName && !zipFileLoading">{{
          zipName
        }}</span>
        <span class="file-upload-percent" v-show="percent"
          >{{ percent.toFixed(2) }}%</span
        >
        <el-button v-show="zipUploading" @click="suspendClick()">{{
          zipActionName
        }}</el-button>
        <el-upload
          v-show="!zipUploading"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="zipChange"
        >
          <template #trigger>
            <el-button> 点击上传 </el-button>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="说明文件">
        <span
          class="file-loading"
          v-show="SPFileLoading"
          v-loading="SPFileLoading"
        />
        <span class="file-name" v-if="supportingPaperName && !SPFileLoading">
          {{ supportingPaperName }}
        </span>
        <span v-if="supportingPaper">上传中...</span>
        <el-upload
          v-show="!supportingPaper"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="supportingPaperChange"
        >
          <template #trigger>
            <el-button> 点击上传 </el-button>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="closeDialog()">关闭</el-button>
        <el-button @click="closeDialog()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.file-loading {
  padding-right: 3rem;
}
.file-name {
  padding-right: 0.5rem;
}
.file-upload-percent {
  padding-right: 0.5rem;
}
</style>
