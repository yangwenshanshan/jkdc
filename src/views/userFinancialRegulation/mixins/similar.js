import ControlModal from "../cpns/ControlModal.vue";
import SearchCondition from "../cpns/SearchCondition.vue";
import ControlPagination from "../cpns/ControlPagination.vue";
import SearchLabel from "../cpns/SearchLabel.vue";
import UseSlotHeader from "../cpns/UseSlotHeader.vue";
import ControlFooter from "../cpns/ControlFooter.vue";
import findIndex from 'lodash/findIndex'

export const similar = {
    data() {
        return {
            inputVaule: "",
            selectValue: "知识标签",
            total: 0,
            count: 0
        };
    },

    components: {
        ControlModal,
        ControlPagination,
        SearchCondition,
        SearchLabel,
        UseSlotHeader,
        ControlFooter
    },

    computed: {
        handleText() {
            return this.$route.query.handleText;
        },
        moduleName() {
            return this.$route.query.moduleName;
        },
        firstEntryName() {
            return this.$route.query.firstEntryName;
        },
        noneQuery() {
            return Number(this.$route.query.noneQuery);
        },
        size() {
            return Number(this.$route.query.size);
        }
    },

    methods: {
        changeInputValue(val) {
            this.inputVaule = val;
        },
        changeSelectValue(val) {
            this.selectValue = val;
        },
        // 展开与收起
        handleScale(val) {
            if (
                this.$refs.searchLabelRef &&
                this.$refs.searchLabelRef.$refs.labelsRef &&
                this.$refs.searchLabelRef.$refs.labelsRef.length
            ) {
                this.$refs.searchLabelRef.$refs.labelsRef.forEach(
                    (item, index) => {
                        if (index > 3) {
                            item.style.display = val ? "none" : "block";
                        }
                    }
                );
            }
        },
        updateChecked(val) {
            this.isShow.checkedAll = val;
        },
        updateCheckedTerms(val) {
            this.termsIsShow.checkedAll = val;
        },
        // 分页size改变
        handleSizeChange(val) {
            this.queryInfo.size = val;
            // debugger;
            if (this.$refs.controlModalRef) {
                this.$refs.controlModalRef.propsCheckedAll = false;
            }
            this.search();
        },
        // 分页page改变
        handleCurrentChange(val) {
            this.queryInfo.page = val;
            if (this.$refs.controlModalRef) {
                this.$refs.controlModalRef.propsCheckedAll = false;
            }
            this.search();
        },
        handleInput(val) {
            this.inputVaule = val;
        },
        // 法规重要性
        importanceFilter(val) {
            this.queryInfo.impotences = val;
            this.search();
        },

        // 正序
        caretTop() {
            this.queryInfo.orderIsAsc = 1;
            this.search();
        },
        // 倒叙
        caretBottom() {
            this.queryInfo.orderIsAsc = 0;
            this.search();
        },
        // 正序
        caretTopTerms() {
            this.queryInfo.termsOrderIsAsc = 1;
            this.searchTerms();
        },
        // 倒叙
        caretBottomTerms() {
            this.queryInfo.termsOrderIsAsc = 0;
            this.searchTerms();
        },
        // tag关闭
        handleCloseTag(item, idx) {
            console.log(this.queryInfo)
            let index = findIndex(this.tagCondition, { name: item.name });
            let currentIndex = "";
            if (!index) {
                if (this.tagCondition.length === 1) {
                    this.queryInfo.labelContent = "";
                    this.inputVaule = "";
                    if (this.$refs.useSlotHeaderRef) {
                        this.$refs.useSlotHeaderRef.clearLabelContent();
                    }

                    this.queryInfo.paramLabels.splice(0, 1);
                    this.isShow.label = false;
                } else {
                    this.queryInfo.labelContent = this.inputVaule = this.tagCondition[1];
                    this.queryInfo.paramLabels = [];
                    this.searchLabel(this.queryInfo.labelContent);
                }
            } else {
                if (
                    item.name === this.queryInfo.labelContent &&
                    this.tagCondition.length === 1
                ) {
                    this.inputVaule = this.queryInfo.labelContent = "";
                    this.isShow.label = false;
                } else {
                    for (const key in this.labelObj) {
                        if (this.labelObj[key].length) {
                            this.labelObj[key].forEach(el => {
                                if (el.name === item.name) {
                                    currentIndex = el.id;
                                    this.$set(el, "isChecked", false);
                                }
                            });
                        }
                    }
                    const resultIndex = findIndex(this.queryInfo.paramLabels, { id: currentIndex })

                    if (resultIndex > -1) {
                        this.queryInfo.paramLabels.splice(resultIndex, 1);
                    }
                }
            }
            this.tagCondition.splice(index, 1);

            this.search();
            this.searchTerms();
        },
        clearLabelContent() {
            this.queryInfo.paramLabels = [];
        }
    }
};
