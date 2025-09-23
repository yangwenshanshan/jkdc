<template>
    <div class="editor">
        <div ref="toolbar" class="toolbar"></div>
        <div ref="editor" class="text"></div>
    </div>
</template>

<script>
import E from "wangeditor";
// import { uploadAdmin } from '@/api/common'
let editor = null;
export default {
    name: "Editorbar",
    data() {
        return {
            info: null
        };
    },
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: {
            type: String,
            require: true
        },
        isClear: {
            type: Boolean
        }
    },
    watch: {
        isClear(val) {
            // 触发清除文本域内容
            if (val) {
                editor.txt.clear();
                this.info = null;
            }
        },

        value(val) {
            // 使用 v-model 时,设置初始值
            editor.txt.html(val);
        }
    },
    mounted() {
        this.seteditor();
    },
    methods: {
        seteditor() {
            editor = new E(this.$refs.toolbar, this.$refs.editor);

            //   editor.config.uploadImgHeaders = {
            //     token: sessionStorage.getItem('token'),
            //   } // 自定义 header
            editor.config.uploadFileName = "image"; // 后端接受上传文件的参数名
            editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
            editor.config.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
            editor.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
            // 4.自定义控制上传过程--上传到阿里云
            editor.config.customUploadImg = async (files, insert) => {
                const fileData = new FormData();
                fileData.append("files", files[0]);
                // const { data: res } = await uploadAdmin(fileData)
                const res = await this.request(
                    "sentence/tencentcos",
                    fileData,
                    "POST"
                );
                if (res.code === 200) {
                    insert(res.url);
                }
            };
            // 配置菜单
            editor.config.menus = [
                "bold", // 粗体
                "underline", // 下划线
                "link", // 插入链接
                "quote", // 引用
                "emoticon", // 表情
                "image", // 插入图片
                "table", // 表格
                "code" // 插入代码
            ];

            editor.config.uploadImgHooks = {
                fail: (xhr, editor, result) => {
                    // 插入图片失败回调
                },
                success: (xhr, editor, result) => {
                    // 图片上传成功回调
                    //
                    // let imgUrl = result.data;
                    // insertImg(imgUrl)
                },
                timeout: (xhr, editor) => {
                    // 网络超时的回调
                },
                error: (xhr, editor) => {
                    // 图片上传错误的回调
                },
                customInsert: (insertImg, result, editor) => {
                    // 图片上传成功,插入图片的回调
                    var url = result.data;
                    insertImg(url); //将内容插入到富文本中
                }
            };

            editor.config.onchange = html => {
                this.info = html; // 绑定当前逐渐地值
                this.$emit("change", this.info); // 将内容同步到父组件中
                console.log(this.info);
            };

            // 创建富文本编辑器
            editor.create();
            editor.txt.html(this.value);
        }
        // 清除文本域内容
        // clear() {
        //   editor.txt.clear()
        //   this.info = null
        // },
    }
};
</script>

<style lang="scss" scope>
.editor {
    width: 100%;
}
.toolbar {
    border: 1px solid #ccc;
}
// .text {
//   border: 1px solid #ccc;
//   height: 300px;
// }
.w-e-text {
    border: 1px solid #ccc;
}
.w-e-toolbar {
    position: static;
}
.w-e-text-container {
    position: static;
}
</style>
