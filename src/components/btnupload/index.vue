<template>
  <div class="upload-file">
    <!-- <el-upload
      multiple
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :disabled="isDisable"
      :headers="headers"
      :limit="limit"
      class="upload-file-uploader"
      ref="upload"
      :data="objData"
    > -->
      <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :disabled="isDisable"
      :headers="headers"
      class="upload-file-uploader"
      ref="upload"
      :data="objData"
    >
      <!-- 上传按钮 -->
      <el-button
        size="mini"
        type="primary"
        :disabled="disablebtn"
        class="choosefile"
        >添加附件</el-button
      >
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 1,
    },
    disablebtn: {
      type: Boolean,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
    uploadUrl: {
      type: String,
    },
    // 携带参数
    objData:{
      type: Object,
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],

      headers: {
        Authorization: "Bearer",
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(",");
          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            if (typeof item === "string") {
              item = { name: item, url: item };
            }
            item.uid = item.uid || new Date().getTime() + temp++;
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$modal.msgError(
            `文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`
          );
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传文件，请稍候...");
      this.number++;
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      console.log(err);
      this.$modal.msgError("上传失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传成功回调
    handleUploadSuccess(res, file, filelist) {
      if (res.code == 200) {
        this.$emit("input", file);
        this.$modal.closeLoading();
      } else {
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
      }
    },
    handleChange(file, filelist){
       
    }
  },
};
</script>

<style scoped lang="less">
/deep/.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  display: flex;
}

/deep/.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}

.el-upload__tip {
  float: right;
  margin-top: 0;
}
</style>
