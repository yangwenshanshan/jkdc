<template>
    <div
        class="knowledgeContent"
        ref="knowledgeContentRef"
        :class="{ nodata: !tableData.length }"
    >
        <template v-if="tableData.length">
            <div
                v-for="(item, index) in tableData"
                :key="index"
                class="content_item"
            >
                <div class="title">
                    <el-checkbox
                        class="titleCheckbox"
                        v-if="isChecked"
                        v-model="item.isChecked"
                    />
                    <div
                        v-html="item.regulationsName"
                        class="regulationsName"
                    ></div>
                </div>
                <div class="extra_info">
                    <div class="time">
                        <span class="info" v-if="item.issuedNumber">
                            <span v-html="item.issuedNumber" /> |
                        </span>
                        <span class="info" v-if="item.releaseDate"
                            >{{ item.releaseDate + "发布" }}&nbsp;</span
                        >
                        <span v-if="item.implementationDate"
                            >|
                            {{ item.implementationDate + "实施" }}</span
                        >
                    </div>
                    <div class="control">
                        <i
                            class="icon-jr-icon-pulldown"
                            :class="{
                                activeTagIcon:item.isShowContent,
                            }"
                            @click="handleItemClick(index, '展开')"
                        />
                        <i
                            class="icon-jr-icon-up"
                            :class="{
                                activeTagIcon: !item.isShowContent,
                            }"
                            @click="handleItemClick(index, '收起')"
                        />
                    </div>
                </div>
                <div class="knowledgeContent_content">
                    <div
                        v-for="(el, i) in item.statutorySentenceDigest"
                        :key="el"
                    >
                        <div class="abstract">
                            <div>
                                摘要：
                                <span v-html="el" />
                            </div>
                            <span v-if="item.regulationNumber[i]"
                                >【
                                {{ item.regulationNumber[i] }} 】</span
                            >
                        </div>

                        <!-- <div
                            v-if="item.isShowContent"
                            class="content"
                            ref="contentRef"
                            v-html="item.statutorySentence[i]"
                        >
                        </div> -->

                        <div
                            v-if="item.isShowContent"
                            class="content2"
                        >
                            <vue-markdown :key="item.regulationsName + index">{{item.statutorySentence[i]}}</vue-markdown>
                        </div>
                    </div>
                </div>
                <div class="extra_style">
                    <div class="left"></div>
                    <div class="right"></div>
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
import VueMarkdown from 'vue-markdown'

export default {
    name: "KnowledgeContent",
    components: { VueMarkdown },
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
        selectName: {
            type: String
        },
        showImg: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            checked: false,
            imgUrl, // 无数据图片地址
            isShow: false // 父组件传的tableData的长度(页面展示问题)
        };
    },
    computed: {
        isCheckedAll() {
            return this.tableData.every(item => {
                return item.isChecked;
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
                console.log('newVap',newVal);
                if (newVal.length) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
                this.getHeight();
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        handleItemClick(index, val) {
            this.$emit("updateIsShowContent", val === "展开", index);
        },
        getHeight() {
            this.$nextTick(() => {
                if (this.isShow) {
                    this.$refs.knowledgeContentRef.style.height = "auto";
                } else {
                    const rectObj = this.$refs.knowledgeContentRef.getBoundingClientRect();

                    this.$refs.knowledgeContentRef.style.height = `${window.innerHeight -
                        rectObj.top}px`;
                }
            });
        },
        reset() {
            this.$nextTick(() => {
                this.$refs.knowledgeContentRef.style.height = "auto";
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.knowledgeContent {
    .content_item {
        overflow: hidden;
        margin-bottom: 2px;
        padding: 20px 30px 20px 50px;
        border-radius: 4px;

        .titleCheckbox {
            left: -32px;
            top: 0;
        }


        .extra_info, .tag {
            font-size: 14px;
        }

        .regulationsName {
            font-weight: 700;
        }
        .extra_info {
            position: relative;
            padding: 16px 0 12px 58px;
            margin-bottom: 10px;

            display: flex;
            justify-content: space-between;
            .control {
                margin-right: 20px;
                i {
                    padding: 0 2px;
                    color: #a6a6a6;
                    cursor: pointer;
                }
                i:hover {
                    color: #09958d;
                }
                .activeTagIcon,
                .activeContentIcon {
                    color: #09958d;
                }
            }

            &:after {
                content: "";
                position: absolute;
                left: -200px;
                bottom: 0;
                right: -200px;
                border-bottom: 1px solid #09958d;
            }
        }
        .knowledgeContent_content {
            margin-left: 58px;

            .abstract {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #09958d;
                padding: 3px 0 4px 0;
                line-height: 24px;
            }
            .content {
                line-height: 22px;
                color: #333333;
                margin: 8px 0 12px 0;
            }

            .content2 {
                ::v-deep  {
                    p {
                        line-height: 24px;
                    }
                }

            }

            .isShowContent {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
                -webkit-line-clamp: 3; /* 控制最多显示几行 */
                -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
            }
        }
        .extra_style {
            .left {
                position: absolute;
                left: 0;
                top: 0;
                width: 10px;
                height: 82px;
                background: #09958d;
            }
            .right {
                position: absolute;
                right: 0;
                top: 0;
                width: 0;
                height: 0;
                border-top: 36px solid #09958d;
                border-left: 36px solid transparent;
            }
        }
    }
}
.noneQuery {
    margin-top: 16px;
}
</style>
