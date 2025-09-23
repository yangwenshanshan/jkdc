<template>
    <div
        class="lawContent"
        ref="lawContentRef"
        :class="{ nodata: !items.length }"
    >
        <template v-if="items.length">
            <div
                v-for="item in items"
                :key="item.regulationsId"
                class="content_item"
            >
                <div class="title">
                    <el-checkbox
                        class="titleCheckbox"
                        v-if="isChecked"
                        v-model="item.isChecked"
                        @change="inputChange(item)"
                    />
                    <div
                        class="regulationsName"
                        @click="handleDetailInfo(item.regulationsId)"
                        v-html="item.regulationsName"
                    ></div>
                    <i
                        class="icon-jr-icon-Vector download"
                        @click="downLawFile(item.fileId, item.fileName, item.accessory)"
                    />
                </div>
                <div class="extra_info">
                    <span class="info" v-if="item.issuedNumber">
                        <span v-html="item.issuedNumber" /> |
                    </span>
                    <span class="info" v-if="item.releaseDate"
                        >{{ item.releaseDate + "发布" }}&nbsp;</span
                    >
                    <span v-if="item.implementationDate"
                        >| {{ item.implementationDate + "实施" }}</span
                    >
                </div>
                <div class="tag" v-if="item.labelContent&&item.labelContent.length">
                    <div class="left">
                        <img src="../../../assets/images/label.png" alt />
                        <div class="tag_title">知识标签:</div>
                    </div>
                    <div class="contents">
                        <div
                            v-for="el in item.labelContent"
                            :key="el.id"
                            class="contents_item"
                            @click="handleKnowledgeTag(el)"
                        >
                            {{ el.name }}
                        </div>
                    </div>
                </div>
                <div
                    v-if="isShowContent && item.textContent"
                    class="lawContent_content"
                >
                    <div class="item" v-html="item.textContent"></div>
                </div>

                <div class="detail_more_center">
                <!-- 法规简历 -->
                <el-popover
                    :key="item.regulationsId"
                    placement="left"
                    width="334"
                    trigger="manual"
                    v-model="item.visible">
                    <div style="text-align: center;color: #478E8A;font-size: 16px;margin-bottom: 15px;font-weight: bold;">选择法规简历</div>
                    <ul style="list-style-position: inside;" v-for="(fileResumeId,i) in item.fileResumeIds" :key="fileResumeId">
                        <li style="margin-bottom: 15px;color: #478E8A;font-size: 16px;padding-left: 10px;text-decoration-color:#478E8A;text-decoration: underline;cursor: pointer;" @click="goResume(fileResumeId, item.fileResumeNames[i])">{{item.fileResumeNames[i]}}</li>
                    </ul>
                    <div slot="reference" class="lawresumeimgbox" v-if="item.fileResumeIds && item.fileResumeIds.length" @click="goRawResume(item, item.fileResumeIds,item.fileResumeNames)">
                        <!-- <div class="lawresumeimgbc"></div> -->
                        <img class="lawresumeimg" src="../../../assets/images/regulation/detail_more_x_01.png" />
                        <div class="lawresumetxt">简历</div>
                    </div>
                </el-popover>
                    <a class="interactive" target="_blank" :href="'#/assets/' + item.files_insight?.[0]?.file?.id" v-if="item.files_insight?.[0]?.file?.id">
                        <img src="../../../assets/images/regulation/detail_more_x_02.png"/>
                        解读
                    </a>
                </div>
                <div v-if="item.financialRegulations.length">
                    <div
                        @click="handleRelevanceLaw(item2)"
                        class="info financialRegulations"
                        v-for="(item2,
                        index) in item.financialRegulations"
                        :key="index"
                    >
                        <span class="financialRegulations-title">{{ regulations[item2.relation] }}：</span>
                        {{ item2.name }}
                    </div>
                </div>
                <div
                    class="content-header"
                >
                    <JrCompanyIcon v-if="item.timeliness === '失效'" />
                    <JrListIcon v-else />
                    <div class="content-header-svgtxt">{{ item.timeliness }}</div>
                </div>
            </div>
        </template>
        <div class="imgUrl" v-if="showImg && !tableData.length">
            <el-image :src="imgUrl" fit="fill" />
            <div>
                <div>抱歉，没有搜索到相关结果</div>
                <div>请先清除已有检索条件，重新发起搜索</div>
            </div>
        </div>
    </div>
</template>

<script>
import imgUrl from "../../../assets/images/no-data.png";
import { regulations, regulationSort } from "../../../utils/constants";
import { checkAuth } from "../../../assets/js/utils";
import { URLSaas } from "../../../../config";
import { saveAs } from 'file-saver';
import JSZip from 'jszip'
import JrListIcon from '../../../assets/images/jr-icon-list.svg';
import JrCompanyIcon from '../../../assets/images/jr-icon-company.svg';

export default {
    name: "LawContent",

    components: {
        JrListIcon,
        JrCompanyIcon,
    },

    props: {
        tableData: {
            type: Array,
            require: true
        },
        isChecked: {
            type: Boolean,
            default: false
        },
        isShowContent: {
            type: Boolean,
            default: false
        },
        showImg: {
            type: Boolean,
            default: false
        },
        userInfo: {
            type: Object,
            default: {},
        }
    },

    data() {
        return {
            URLSaas,
            regulations,
            checked: false,
            imgUrl, // 无数据图片地址
            isShow: false, // 父组件传的tableData的长度(页面展示问题)

            visible: false,
        };
    },

    computed: {
        isCheckedAll() {
            return this.tableData.every(item => {
                return item.isChecked;
            });
        },
        items() {
            return this.tableData.map((v) => {
                return {
                    ...v,
                    financialRegulations: (v.new_regulations || []).map((ele) => {
                        const regulation = ele.regulation;
                        return {
                            name: regulation&&regulation.name,
                            id: regulation&&regulation.id,
                            relation: ele.relation,
                        }
                    }).sort((a, b) => {
                        return regulationSort.indexOf(a.relation) - regulationSort.indexOf(b.relation);
                    }), //关联法规
                };
            });
        }
    },

    watch: {
        isCheckedAll: {
            handler(newVal) {
                this.$emit("updateChecked", newVal);
            },
            deep: true
        },
        tableData: {
            handler(newVal) {
                if (newVal.length) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
                this.getHeight();
            },
            deep: true
        },
    },

    methods: {
        inputChange(item) {
            const v = this.tableData.find(v => v.fileId === item.fileId);
            this.$set(v, "isChecked", !v.isChecked);
        },
        checkAccessible() {
            const { is_regulation_accessible } = this.userInfo;
            return is_regulation_accessible;
        },
        checkDownloadAuth() {
            const { is_regulation_downloadable } = this.userInfo;
            return is_regulation_downloadable;
        },
        async checkDownloadNumAuth(len) {
            const { data } = await this.requestSaas(
                'direcutsUsers/getDownloadNumAuth',
                {
                    download_key: 'today_download_regulation_count',
                    download_limit_key: 'daily_download_regulation_limit',
                    download_length: len,
                    userId: this.userInfo.id
                },
                'GET'
            );

            return data;
        },
        // 关联法规
        handleRelevanceLaw(val) {
            if (val && val.id) {
                const routeUrl = this.$router.resolve({
                    path: "/regulation/"+val.id,
                });
                window.open(routeUrl.href, "_blank");
            }
        },
        async updateUserInfo(count) {
            const { data } = await this.requestSaas(
                'direcutsUsers/updateUserInfo',
                {
                    download_key: 'today_download_regulation_count',
                    download_count: count,
                    userId: this.userInfo.id,
                    method: 'patch',
                },
                'GET'
            );

            return data;
        },
        goRawResume: function(item, fileId, fileName) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            
            if (fileId.length == 1) {
                this.goResume(fileId[0], fileName[0]);
            } else {
                item.visible = !item.visible;
            }
        },
        goResume: function(id, name) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            const routeUrl = this.$router.resolve({
                path: "/assets/"+id,
                query: {
                    fileName: name,
                    download_key: 'today_download_regulation_count',
                    download_limit_key: 'daily_download_regulation_limit',
                    download_enable_key: 'is_regulation_downloadable'
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        async downLawFile(id, fileName,accessory) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            if (!this.checkDownloadAuth()) {
                this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            const auth = await this.checkDownloadNumAuth();
            if (!auth || !auth.auth) {
                this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            if (accessory && accessory.length) {
                let params = [{
                    fileId: id,
                    fileName: fileName,
                }];
                let accessorys = [];
                accessory.forEach(acc => {
                    accessorys.push({
                        fileId: acc.accessoryFile,
                        fileName: acc.accessoryFileName,
                    })
                })

                if (params.length) {
                    const auth = await this.checkDownloadNumAuth(params.length);
                    if (!auth || !auth.auth) {
                        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                        return;
                    }
                    try {
                        const zip = new JSZip();
                        const cache = {};
                        const promises = [];
                        const that = this;
                        await this.updateUserInfo(params.length);
                        params = params.concat(accessorys);
                        params.forEach((ele) => { // 遍历需要打包的文件
                            const promise = new Promise((resolve, reject) => {
                                let url = '/assets/'+ele.fileId+'/'+ele.fileName+'?download';
                                return that.request(url, {}, 'GET', 'blob').then(data => {
                                    resolve(data);
                                }).catch(error => {
                                    reject(error.toString());
                                })
                            }).then(data => { // 下载文件
                                const arr_name = ele.fileName;
                                zip.file(arr_name, data); // 逐个添加文件
                                cache[file_name] = data;
                            }).catch(() => {

                            })
                            promises.push(promise);
                        })
                        Promise.all(promises).then(() => {
                            zip.generateAsync({type: "blob"}).then(content => {
                                // 生成二进制流
                                saveAs(content, `金融法规.zip`); // 利用file-saver保存文件  自定义文件名
                            });
                        }).catch(() => {});
                        
                    } catch (error) {
                        this.$message.error(error.msg)
                    }
                }
            } else {
                let url = '/assets/'+id+'?download';
                await this.updateUserInfo();
                this.request(url, {}, 'GET', 'blob').then(data => {
                    saveAs(data, fileName);
                }).catch(error => {
                    console.log('【debug】catch')
                })
            }

            // if (checkAuth("lawsDown", this, "down")) {
                
            // }
        },
        handleDetailInfo(regulationsId) {
            this.$emit("handleDetailInfo", regulationsId);
        },
        getHeight() {
            this.$nextTick(() => {
                if (this.isShow) {
                    this.$refs.lawContentRef.style.height = "auto";
                } else {
                    const rectObj = this.$refs.lawContentRef.getBoundingClientRect();
                    this.$refs.lawContentRef.style.height = `${window.innerHeight -
                        rectObj.top}px`;
                }
            });
        },
        // handle知识标签
        handleKnowledgeTag(val) {
            this.$emit("handleKnowledgeTag", val.name);
        }
    }
};
</script>

<style lang="scss" scoped>
.el-popper .el-popover__title {
    text-align: center;
    color: #478E8A;
    font-size: 16px;
}
.lawContent {
    margin-top: 0px;
    margin-bottom: 20px;
    min-height: 400px;

    .content_item {
        margin-bottom: 2px;
        padding: 20px 30px 20px 50px;
        border-radius: 4px;

        .titleCheckbox {
            left: -32px;
        }

        .extra_info, .tag {
            font-size: 14px;
        }
    }

    .detail_more_center {
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;

        .interactive {
            margin-left: 40px;
            color: #333333;
            img {
                display: block;
                width: 30px;
                height: 30px;
                margin-bottom: 5px;
            }
        }
    }

    .lawresumeimgbox {
        .lawresumeimgbc {
            background: url('../../../assets/images/resume2.png') no-repeat;
            background-size: contain;
            width: 87px;
            height: 86px;
        }

        .lawresumeimg {
            display: block;
            width: 32px;
            height: 32px;
            margin-bottom: 5px;
        }

        .lawresumetxt {
            font-size: 16px;
            color: #333333;
        }
    }

    .regulationsName:hover {
        color: #09958d;
    }
    .tag {
        margin-left: 58px;
        font-size: 14px;
        color: #09958d;
        display: flex;
        align-items: flex-start;
        .left {
            display: flex;
            align-items: center;
        }
        .tag_title {
            font-size: 14px;
            color: #09958d;
            min-width: 70px;
            font-weight: 700;
        }
        img {
            margin-right: 4px;
        }
        .contents {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-right: 100px;

            .contents_item {
                margin-right: 15px;
                // padding: 2px 0;
                height: 21px;
                line-height: 22px;
                cursor: pointer;
            }
        }
    }
    .lawContent_content {
        background: #f2f2f2;
        padding: 12px;
        font-size: 14px;
        color: #333333;
        margin: 10px 100px 0 58px;
        line-height: 18px;

        .item {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
            -webkit-line-clamp: 3; /* 控制最多显示几行 */
            -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
        }
    }
    .content-header {
        position: absolute;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        color: #fff;
        width: 60px;
        height: 30px;
        left: -8px;
        top: 10px;
    }
    .content-header-svgtxt {
        position: absolute;
        top: 0;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
    }
    // .effective {
    //     background: url("../../../assets/images/jr-icon-list.svg") no-repeat;
    // }
    // .invalid {
    //     background: url("../../../assets/images/jr-icon-company.svg") no-repeat;
    // }
}
.noneQuery {
    margin-top: 16px;
}
.isActive {
    height: auto;
}

.financialRegulations {
    font-size: 14px;
    padding: 16px 0 0 58px;
    color: #3b88c1;
    cursor: pointer;

    &-title {
        color: #09958d;
        min-width: 80px;
    }
}
</style>
