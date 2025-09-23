<template>
    <div class="container">
        <div class="left">
            <div class="title">选择分析指标</div>
            <div class="item">
                <div class="name">指标含义：</div>
                <div class="desc">{{ current.description }}</div>
            </div>
            <div class="item">
                <div class="name">范围</div>
                <div class="desc">{{ current.scope }}</div>
            </div>
            <div class="item">
                <div class="name">量度</div>
                <div class="desc">{{ current.metrics }}</div>
            </div>
            <div class="item">
                <div class="name">用途</div>
                <div class="desc">{{ current.purpose }}</div>
            </div>
        </div>
        <div class="main">
            <el-tabs v-model="tabName" class="tabs">
                <el-tab-pane label="范围" name="area">
                    <radio-link
                        v-model="scope"
                        :data="scopes"
                        class="links"
                    ></radio-link>
                </el-tab-pane>
                <el-tab-pane label="量度" name="measure">
                    <radio-link
                        v-model="measurement"
                        :data="measurements"
                        class="links"
                    ></radio-link>
                </el-tab-pane>
            </el-tabs>
            <div class="charts">
                <div
                    class="chart"
                    @click="detail(i)"
                    v-for="(i, n) in list"
                    @mouseenter="hover(i)"
                >
                    <div class="content">
                        <img class="img" :src="imageType[i.icon]" alt />
                        <div class="text">{{ i.name }}</div>
                    </div>
                    <div class="No">{{ (i._manual_index) }}</div>
                </div>
            </div>
        </div>
        <!-- <div class="declaration">声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。</div> -->
    </div>
</template>

<script>
import radioLink from "./../components/radio-link";
import { checkAuth, checkLogin } from "../assets/js/utils";
import { sortBy } from 'lodash';
let indicators = [];
const routeMap = {};
export default {
    name: "Chart",
    watch: {
        scope(val) {
            if (val === "全部") {
                this.list = indicators;
            } else {
                this.list = indicators.filter(i => {
                    if (i.scope.indexOf(val) > -1) {
                        return true;
                    }
                });
            }
        },
        measurement(val) {
            if (val === "全部") {
                this.list = indicators;
            } else {
                this.list = indicators.filter(i => {
                    if (i.measurement.indexOf(val) > -1) {
                        return true;
                    }
                });
            }
        }
    },
    data: function() {
        return {
            tabName: "area",
            scopes: [
                // 范围列表
                { label: "全部", value: "全部" },
                { label: "总体", value: "总体" },
                { label: "群体", value: "群体" },
                { label: "属地", value: "属地" },
                { label: "个体", value: "个体" }
            ],
            scope: "全部", // 范围
            measurements: [
                { label: "全部", value: "全部" },
                { label: "罚单数", value: "罚单数" },
                { label: "罚没金额", value: "罚没金额" },
                { label: "受罚对象数", value: "受罚对象数" },
                // { label: "案由出现次数", value: "案由出现次数" }
            ], // 量度列表
            measurement: "全部", // 量度
            list: [],
            current: {},

            imageType: {
                // 图片类型隐射
                图标1号: require("./../assets/images/icon-chart.png"),
                图标2号: require("./../assets/images/icon-map.png"),
                图标3号: require("./../assets/images/icon-money.png"),
                图标4号: require("./../assets/images/icon-price.png"),
                图标5号: require("./../assets/images/icon-user.png"),
                图标6号: require("./../assets/images/icon-list.png")
            }
        };
    },
    mounted() {
        this.$emit("changeTab", "/charts");
        this.getList();
    },
    methods: {
        getList() {
            this.request(`items/cl_ticket_analysis`, {},"GET").then(res => {
                this.list = sortBy(res.data, function(item) {
                    let manual_id = item.manual_id;
                    return manual_id.substring(manual_id.length - 2, manual_id.length) 
                });
                indicators = this.list.map((i, n) => {
                    let manual_id = i.manual_id;
                    i._index = n;
                    let manual_index = manual_id.substring(manual_id.length - 2, manual_id.length) 
                    manual_index = manual_index.replace(/^0+(?=\d)/, '')
                    i._manual_index = manual_index;
                    return i;
                });
                localStorage.setItem("indicators", JSON.stringify(this.list));
            });
        },
        detail(indicator) {
            if (!checkLogin()) {
                this.$emit("showLogin");
                return;
            }
            if (!checkAuth("indicatorsQuery", this)) {
                return;
            }
            const chartRouterMap = {
                F2: "f2",
                F4: "f2",
                F6: "f2",
                E2: "e2",
                E4: "e2",
                E6: "e2",
                K3: "k2",
                L2: "l2",
                O2: "o2",
                O3: "o3",
                H3: "h2",
                H4: "h2",
                H5: "h2",
                J2: "j2",
                J4: "j2",
                J5: "j2",
                N3: "n3",
                N4: "n2",
                R2: "r2",
                S2: "s2",
                S3: "s2"
            };

            let type = indicator.chart_classification.substring(0, 2);

            if (chartRouterMap[type]) {
                this.$router.push(
                    "/charts/chart/" +
                        chartRouterMap[type] +
                        "_chart/" +
                        indicator.manual_id
                );
            } else {
                type = type.substring(0, 1);
                this.$router.push(
                    "/charts/chart/" +
                        type.toLocaleLowerCase() +
                        "_chart/" +
                        indicator.manual_id
                );
            }
        },
        hover(item) {
            this.current = item;
        }
    },
    components: { radioLink }
};
</script>

<style scoped lang="scss">
.container {
    display: flex;
    height: calc(100vh - 69px);
    border-top: 1px solid #21313f;
    .left {
        width: 330px;
        height: 100%;
        background: #293746;
        padding: 0 14px;
        color: #fff;
    }
    .main {
        height: 100%;
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
        overflow: auto;
    }
    .declaration {
        position: absolute;
        width: 100%;
        bottom: 0;
    }
}
.tabs {
    background: #fff;
    padding: 0 20px;
}
.title {
    padding: 16px 20px;
    margin-bottom: 20px;
    font-size: 18px;
    border-bottom: 1px solid #334657;
}
.item {
    margin-bottom: 64px;
    padding: 0 20px;
    .name {
        font-size: 18px;
        margin-bottom: 7px;
    }
    .desc {
        font-size: 14px;
        line-height: 28px;
        color: inherit;
    }
}
.links {
    margin: 15px 0;
}

.charts {
    width: calc(100% + 20px);
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;

    .chart {
        width: 288px;
        height: 266px;
        position: relative;
        background: #ccc;
        margin: 10px;
        flex-wrap: wrap;
        overflow: hidden;
        cursor: pointer;
        transition: 0.25s;
        box-sizing: border-box;

        &:hover {
            background: #fff;
            &:after {
                background: #fff;
            }
        }

        &:before {
            content: "";
            width: 80%;
            height: 80%;
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 1px solid #eee;
        }
        &:after {
            content: "";
            width: 90%;
            height: 90%;
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: #ccc;
            transform: rotate(45deg);
            transition: 0.25s;
        }

        .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            align-content: space-between;
            padding: 50px 70px 80px;
            box-sizing: border-box;
            z-index: 2;
        }
        .img {
            height: 44px;
            width: auto;
        }
        .text {
            font-size: 18px;
            font-weight: bold;
            line-height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .No {
            position: absolute;
            right: 0;
            bottom: 0;
            background: #637080;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #fff;
            border-radius: 40px 0 0 0;
            padding: 8px 0 0 8px;
            box-sizing: border-box;
        }
    }
}
</style>
<style>
.main .el-tabs__header {
    padding: 0;
}
</style>
