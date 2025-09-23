<template>
    <div class="useSlotHeader">
        <header-slot class="header">
            <!-- <div slot="left" class="slot_left">
                <img
                    v-if="moduleName === '法规'"
                    src="../../../assets/images/name-law.png"
                />
                <img v-else src="../../../assets/images/name-knowledge.png" />
            </div> -->
            <div slot="center" class="header_input" >
                <el-autocomplete
                    v-if="selectValue === '知识标签'"
                    class="matching"
                    v-model="cInputVaule"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    @input="handleInput"
                    @keyup.enter.native="searchField"
                >
                    <div slot="prepend" class="prepend_style">
                        <el-select
                            v-model="cSelectValue"
                            placeholder="请选择"
                            @change="handleChange"
                        >
                            <el-option
                                v-for="(item, index) in dropDown"
                                :key="item.value + index"
                                :label="item.value"
                                :value="item.value"
                            />
                        </el-select>
                        <i class="line" />
                    </div>
                    <div slot="suffix" class="control">
                        <i
                            class="icon-jr-icon-wrong"
                            v-if="cInputVaule"
                            @click="clearLabelContent"
                        />
                        <a class="input_search_button" style="cursor: pointer;" @click="searchField">
                            <img src="../../../assets/images/regulation/search.png" />
                        </a>
                        <!-- <a v-if="moduleName === '法规'" style="cursor: pointer;position: absolute;right: -4px;top: 1px;" @click="searchField"><LawSVG /></a>
                        <a v-else style="cursor: pointer;position: absolute;right: -4px;top: 1px;" @click="searchField"><KnowledgeSVG /></a> -->
                    </div>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
                <el-input
                    class="simpleInput"
                    v-else
                    placeholder="请输入内容"
                    v-model="cInputVaule"
                    @input="handleInput"
                    @keyup.enter.native="searchField"
                >
                    <div slot="prepend" class="prepend_style">
                        <el-select
                            v-model="cSelectValue"
                            placeholder="请选择"
                            @change="handleChange"
                        >
                            <el-option
                                v-for="(item, index) in dropDown"
                                :key="item.value + index"
                                :label="item.value"
                                :value="item.value"
                            />
                        </el-select>
                        <i class="line" />
                    </div>
                    <div slot="suffix" class="control">
                        <i
                            class="icon-jr-icon-wrong"
                            v-if="cInputVaule"
                            @click="clearLabelContent"
                        />
                        <a class="input_search_button" style="cursor: pointer;" @click="searchField">
                            <img src="../../../assets/images/regulation/search.png" />
                        </a>
                        <!-- <a v-if="moduleName === '法规'" style="cursor: pointer;position: absolute;right: -4px;top: 1px;" @click="searchField"><LawSVG /></a>
                        <a v-else style="cursor: pointer;position: absolute;right: -4px;top: 1px;" @click="searchField"><KnowledgeSVG /></a> -->
                    </div>
                </el-input>
                <!-- <div class="reminder">
                    <i
                        class="icon-jr-icon-finger"
                    />可切换搜索字段，进行更精确查找
                </div> -->
            </div>
            <!-- <div slot="right" class="slot_right" @click="handleSearch">
                <el-tooltip
                    v-if="moduleName === '法规'"
                    content="知识点库是从现行有效的法规库中抽取并整理的合规知识合集"
                    placement="bottom"
                    effect="light"
                    class="prompt"
                >
                    <img
                        src="../../../assets/images/knowledge_search.png"
                        alt
                    />
                </el-tooltip>
                <img v-else src="../../../assets/images/law_search.png" alt />
            </div> -->
        </header-slot>
    </div>
</template>

<script>
import HeaderSlot from "./HeaderSlot.vue";
import LawSVG from '../../../assets/images/law-svg-right.svg';
import KnowledgeSVG from '../../../assets/images/knowledge-svg.svg';

export default {
    name: "UseSlotHeader",

    props: {
        dropDown: {
            type: Array
        },
        inputVaule: {
            type: String
        },
        selectValue: {
            type: String
        },
        moduleName: {
            type: String
        }
    },

    components: {
        HeaderSlot,
        LawSVG,
        KnowledgeSVG,
    },

    data() {
        return {
            cInputVaule: "",
            cSelectValue: "",
            tagObj: {}
        };
    },
    watch: {
        inputVaule: {
            handler(newVal) {
                if (newVal) {
                    this.cInputVaule = newVal;
                }
            },
            immediate: true
        },
        selectValue: {
            handler(newVal) {
                this.cSelectValue = newVal;
                // if (newVal === '知识标签') {
                //   this.getTag()
                // }
            },
            immediate: true
        }
    },

    methods: {
        handleInput() {
            this.$emit("handleInput", this.cInputVaule);
        },
        searchField() {
            if (this.cInputVaule) {
                this.$emit("searchField");
            } else {
                this.$message.error("请输入您想搜索的关键词");
            }
        },
        handleChange(val) {
            this.cInputVaule = "";
            this.$emit("handleChange", val);
        },
        handleSearch() {
            this.$emit("handleSearch");
        },
        async querySearch(queryString, cb) {
            let url = '/items/cl_tag?fields=id,name&limit=100';
            if (queryString != '') {
                url += '&filter[_and][0][_or][0][name][_contains]='+queryString;
                url += '&filter[_and][0][_or][1][alias][_contains]='+queryString;
                url += '&filter[_and][1][_or][0][regulation_count_compacted][_gt]=0';
                url += '&filter[_and][1][_or][1][regulation_terms_count_compacted][_gt]=0';
            }
            const [{ data: res=[] }] = await Promise.all([
                this.request(url, {}, "GET"),
            ]);
            let results = res.map(ele => ({
                value: ele.name,
                id: ele.id, 
            }));
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 清空标签内容
        clearLabelContent() {
            this.cInputVaule = "";
            this.$emit("clearLabelContent");
        },

        handleSelect(item) {
            this.cInputVaule = item.value;

            this.handleInput();

            this.searchField();

            // this.$emit("searchField");
        }
        // 下拉匹配数据
        // async getTag() {
        //   const res = await this.request(
        //     'regulationsLabel/getidNameList',
        //     {},
        //     'GET'
        //   )
        //   this.tagObj = res.sentence
        // },
    }
};
</script>

<style lang="scss" scoped>
.useSlotHeader {
    .input_search_button {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 24px;
            height: 24px;
        }
    }

    .header {
        .slot_left {
            width: 400px;
            color: #fff;
            margin-bottom: 4px;
            img {
                margin-left: 60px;
            }
            .name {
                border-left: 1px solid #fff;
                margin: 11px 0 16px;
                padding-left: 12px;
            }
        }
        
        .header_input {
            position: relative;
            ::v-deep {
                .el-input .el-input-group__prepend {
                    background: transparent;
                    border: none;
                    padding: 0;

                    .prepend_style {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100px;
                        height: 46px;
                        
                        .el-select {
                            margin: 0;
                            width: 100px !important;
                        
                            .el-input {
                                width: 100px !important;
                                overflow: hidden;

                                &::after {
                                    content: '';
                                    position: absolute;
                                    top: 10px;
                                    right: 0;
                                    bottom: 10px;
                                    border-left: 1px solid #C0C4CC;
                                }
                        
                                .el-input__inner {
                                    padding-left: 20px;
                                    border: none;
                                    width: 100px !important;
                                    max-width: 100px !important;
                                }
                        
                                // 添加以下样式
                                .el-input__suffix {
                                    right: 5px;
                                }
                        
                                // 控制下拉框宽度
                                & + .el-select__popper {
                                    min-width: 100px !important;
                                    width: 100px !important;
                                }
                            }
                        }
                    }

                    .el-input__suffix {
                        background: transparent;
                    }
                }
            }

            .reminder {
                position: absolute;
                bottom: -24px;
                left: 20px;
                font-size: 14px;
                background-image: -webkit-linear-gradient(#d6fff5, #88ffea);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .know {
                padding: 0 30px;
            }

            ::v-deep {
               .el-autocomplete {
                    width: 100%;
                }
            }

            ::v-deep .el-input {
                position: relative;
                width: 100%;
                height: 46px;
                .el-input__inner {
                    padding-left: 110px;
                    height: 46px;
                    border-radius: 6px;
                    border: 1px solid #09958D;
                }
                .el-input__suffix {
                    right: 1px;
                    background: #09958D;
                    border-radius: 0 6px 6px 0;
                }
            }
            .control {
                margin: 1px 0 0 3px;
                .icon-jr-icon-wrong {
                    margin-right: 4px;
                    cursor: pointer;
                }
                div, a {
                    margin: 1px 0;
                    width: 76px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #fff;
                    font-weight: 700;
                }
                i {
                    font-weight: normal;
                    position: absolute;
                    left: -20px;
                    top: 15px;
                }
            }
        }
        .header_botton {
            background: #fff;
            padding: 12px 0 28px 30px;
            .search_hint {
                font-size: 12px;
                color: #333333;
            }
            .search_info {
                display: flex;
                align-items: center;
                margin-top: 10px;
                .search_title {
                    width: 148px;
                    height: 32px;
                    line-height: 32px;
                    background: #f0f1f3;
                    color: #039f9f;
                    font-size: 14px;
                    padding-left: 8px;
                    margin-right: 12px;
                    font-weight: 700;
                    i {
                        font-weight: normal;
                    }
                }
                .search_content {
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    margin-right: 12px;
                    img {
                        width: 18px;
                        height: 18px;
                        margin-right: 4px;
                    }
                    .isCheckedLabel {
                        color: #09958d;
                    }
                }
            }
        }

        .slot_center {
            position: relative;
            padding: 0 20px;
            ::v-deep .matching {
                width: 100%;
                .el-input-group__prepend {
                    background: #fff;
                    border: 1px solid #fff;
                    border-radius: 12px 0 0 12px;

                    .el-select {
                        border-radius: 4px 0 0 4px;
                        width: 120px;
                        background: #fff;
                        .el-input__inner {
                            height: 30px;
                            min-width: 120px;
                        }
                        .el-input {
                            padding-left: 2px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                        }
                    }
                }

                .el-input-group--prepend .el-input__inner {
                    height: 40px;
                    border: 1px solid #fff;
                    border-radius: 0 12px 12px 0;
                }
            }
            ::v-deep .simpleInput {
                height: 40px;
                .el-input-group__prepend {
                    background: #fff;
                    border: 1px solid #fff;
                    border-radius: 12px 0 0 12px;
                }
                .el-select {
                    border-radius: 4px 0 0 4px;
                    width: 120px;
                    background: #fff;
                    .el-input__inner {
                        min-width: 120px;
                        height: 30px;
                    }
                    .el-input {
                        height: 30px;
                        display: flex;
                        align-items: center;
                        padding-left: 2px;
                    }
                }

                .el-input__inner {
                    border: 1px solid #fff;
                    height: 40px;
                    border-radius: 0 12px 12px 0;
                }
            }
            .reminder {
                position: absolute;
                left: 64px;
                margin-top: 6px;
                font-size: 14px;
                background-image: -webkit-linear-gradient(#d6fff5, #88ffea);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .icon-jr-icon-wrong {
                cursor: pointer;
                position: absolute;
                right: 84px;
                top: 13px;
            }
            .prepend_style {
                position: relative;
                .line {
                    position: absolute;
                    height: 18px;
                    width: 1px;
                    right: -24px;
                    top: 1px;
                    display: inline-block;
                    background: #dcdfe6;
                    z-index: 9;
                }
            }
            .control {
                position: relative;
                img {
                    position: absolute;
                    right: -4px;
                    top: 1px;
                }
            }

            // .search-btn {
            //     cursor: pointer;
            //     background: url("../../../assets/images/low-bg.png") no-repeat;
            //     height: 40px;
            //     width: 84px;
            //     margin: 1px -4px 1px 0;
            //     line-height: 38px;
            //     font-weight: 700;
            //     display: flex;
            //     justify-content: center;
            //     color: #fff;
            //     i {
            //         line-height: 40px;
            //         font-weight: normal;
            //     }
            // }
            // .low-knowledge {
            //     background: url("../../../assets/images/knowledge.png")
            //         no-repeat;
            // }
        }
        .slot_right {
            width: 400px;
            img {
                margin: 4px 0 0 55px;
            }
            cursor: pointer;
            i {
                color: #09958d;
                font-size: 18px;
            }
            .switch_btn {
                font-size: 14px;
                color: #fff;
            }
            .prompt {
                img {
                    margin: 0 0 0 55px;
                }
            }
        }
    }
    ::v-deep .el-input__suffix-inner {
        .el-input__icon {
            line-height: 31px !important;
        }
    }
}
</style>
