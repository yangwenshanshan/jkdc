import Vue from "vue";
import VueRouter from "vue-router";

import Administrator from "../views/Administrator";
import TicketData from "../views/admin/TicketData";
import UserInformation from "../views/admin/UserInformation";
import Reason from "../views/admin/Reason";
import PenaltyBranch from "../views/admin/PenaltyBranch";
import ViolationEnterprise from "../views/admin/ViolationEnterprise";
import ListedBank from "../views/admin/ListedBank";
import ComplianceDictionary from "../views/admin/ComplianceDictionary";
import Check from "../views/admin/Check";
import Account from "../views/admin/Account";
import ReportFile from "../views/admin/ReportFile";
import JudgeDocumentFile from "../views/admin/JudgeDocumentFile.vue";
import OrganizationFile from "../views/admin/OrganizationFile";
import LawsFile from "../views/admin/LawsFile";
import Notice from "../views/admin/Notice";
import Info from "../views/admin/Info";
import Problem from "../views/admin/Problem";
import DocumentList from "../views/admin/DocumentList";
import DictionaryList from "../views/admin/DictionaryList.vue";
import FinancialInstitutions from "../views/admin/FinancialInstitutions.vue";
import BankCasesList from "../views/admin/BankCasesList";
import RoleMotivation from "../views/admin/RoleMotivation";
import ProcessTabel from "../views/admin/ProcessTabel.vue";
import Content from "../views/admin/Content.vue";
import FinancialRegulations from "../views/admin/FinancialRegulations.vue";

import LawData from "../views/admin/LawData.vue";
import LowRelation from "../views/admin/LowRelation.vue";
import LowKnowledge from "../views/admin/LowKnowledge.vue";
import LowTag from "../views/admin/LowTag.vue";
import DictionaryTag from "../views/admin/DictionaryTag.vue";
import DictionaryTagChart from "../views/admin/DictionaryTagChart.vue";
import Index from "../views/Index";
import Login from "../views/Login";
import Register from "../views/Register";
import Query from "../views/Query";
import FinancialCases from "../views/FinancialCases";
import UserFinancialRegulation from "../views/userFinancialRegulation/index.vue";
import PDFViewer from "../views/PDFViewer/index.vue";
import SearchLaw from "../views/userFinancialRegulation/SearchLaw.vue";
import SearchKnowledge from "../views/userFinancialRegulation/SearchKnowledge.vue";
import ViewDetail from "../views/userFinancialRegulation/ViewDetail.vue";
import JudgeDocumentById from "../views/components/JudgeDocumentById.vue";
import JudgeCaseById from "../views/components/JudgeCaseById.vue";
import Charts from "../views/Charts";
import Chart from "../views/Chart";
import AChart from "../views/charts/AChart";
import BChart from "../views/charts/BChart";
import CChart from "../views/charts/CChart";
import DChart from "../views/charts/DChart";
import EChart from "../views/charts/EChart";
import E2Chart from "../views/charts/E2Chart";
import FChart from "../views/charts/FChart";
import F2Chart from "../views/charts/F2Chart";
import GChart from "../views/charts/GChart";
import HChart from "../views/charts/HChart";
import H2Chart from "../views/charts/H2Chart";
import IChart from "../views/charts/IChart";
import JChart from "../views/charts/JChart";
import J2Chart from "../views/charts/J2Chart";
import KChart from "../views/charts/KChart";
import K2Chart from "../views/charts/K2Chart";
import LChart from "../views/charts/LChart";
import L2Chart from "../views/charts/L2Chart";
import MChart from "../views/charts/MChart";
import NChart from "../views/charts/NChart";
import N2Chart from "../views/charts/N2Chart";
import N3Chart from "../views/charts/N3Chart";
import OChart from "../views/charts/OChart";
import O2Chart from "../views/charts/O2Chart";
import O3Chart from "../views/charts/O3Chart";
import PChart from "../views/charts/PChart";
import RChart from "../views/charts/RChart";
import R2Chart from "../views/charts/R2Chart";
import SChart from "../views/charts/SChart";
import S2Chart from "../views/charts/S2Chart";
import Report from "../views/Report";
import Tools from "../views/Tools";
import Tool from "../views/Tool";
import DepartmentSetting from "../views/tools/DepartmentSetting";
import LawList from "../views/tools/LawList";
import LipService from "../views/tools/Lip-service";
import Dictionary from "../views/tools/Dictionary";
import CheckPoint from "../views/tools/CheckPoint";
import NoPermission from "../views/NoPermission.vue";
import ChartHandbook from "../views/ChartHandbook/index.vue";
import ChartHandbookChart from "../views/ChartHandbook/chartHandbookChart.vue";
import ChartHandbookText from "../views/ChartHandbook/chartHandbookText.vue";
import Chat from "../views/Chat";
import PenaltyReport from "../views/penaltyReport/index.vue";
import PenaltyReportDetail from "../views/penaltyReport/detail/index.vue";
Vue.use(VueRouter);

const routes = [
    {
        path: "/assets/:id",
        name: "PDF",
        component: PDFViewer
    },
    {
        path: "/",
        name: "Home",
        component: Index,
        redirect: "login",
        children: [
            {
                path: "/ticket",
                name: "Query",
                component: Query
            },
            {
                path: "/chat",
                name: "Chat",
                component: Chat
            },
            {
                path: "/penaltyReport",
                name: "PenaltyReport",
                component: PenaltyReport
            },
            {
                path: "/penaltyReport/detail",
                name: "PenaltyReportDetail",
                component: PenaltyReportDetail
            },
            {
                path: "/regulation",
                name: "UserFinancialRegulation",
                component: UserFinancialRegulation
            },
            {
                path: "/regulation/search",
                name: "SearchLaw",
                component: SearchLaw
            },
            {
                path: "/regulation_terms/search",
                name: "SearchKnowledge",
                component: SearchKnowledge
            },
            {
                path: "/regulation/:id",
                name: "ViewDetail",
                component: ViewDetail
            },
            {
                path: "/case_judgement_document",
                name: "FinancialCases",
                component: FinancialCases
            },
            {
                path: "/case_judgement_document/:id",
                name: "JudgeDocumentById",
                component: JudgeDocumentById
            },
            {
                path: "/financialCases/judgeCaseById",
                name: "JudgeCaseById",
                component: JudgeCaseById
            },
            {
                path: "/charts",
                name: "Charts",
                component: Charts
            },
            {
                path: "/charts/chart",
                name: "Chart",
                component: Chart,
                children: [
                    { path: "a_chart/:id", name: "AChart", component: AChart },
                    { path: "b_chart/:id", name: "BChart", component: BChart },
                    { path: "c_chart/:id", name: "CChart", component: CChart },
                    { path: "d_chart/:id", name: "DChart", component: DChart },
                    { path: "e_chart/:id", name: "EChart", component: EChart },
                    {
                        path: "e2_chart/:id",
                        name: "E2Chart",
                        component: E2Chart
                    },
                    { path: "f_chart/:id", name: "FChart", component: FChart },
                    {
                        path: "f2_chart/:id",
                        name: "F2Chart",
                        component: F2Chart
                    },
                    { path: "g_chart/:id", name: "GChart", component: GChart },
                    { path: "h_chart/:id", name: "HChart", component: HChart },
                    {
                        path: "h2_chart/:id",
                        name: "H2Chart",
                        component: H2Chart
                    },
                    { path: "i_chart/:id", name: "IChart", component: IChart },
                    { path: "j_chart/:id", name: "JChart", component: JChart },
                    {
                        path: "j2_chart/:id",
                        name: "J2Chart",
                        component: J2Chart
                    },
                    { path: "k_chart/:id", name: "KChart", component: KChart },
                    {
                        path: "k2_chart/:id",
                        name: "K2Chart",
                        component: K2Chart
                    },
                    { path: "l_chart/:id", name: "LChart", component: LChart },
                    {
                        path: "l2_chart/:id",
                        name: "L2Chart",
                        component: L2Chart
                    },
                    { path: "m_chart/:id", name: "MChart", component: MChart },
                    { path: "n_chart/:id", name: "NChart", component: NChart },
                    {
                        path: "n2_chart/:id",
                        name: "N2Chart",
                        component: N2Chart
                    },
                    {
                        path: "n3_chart/:id",
                        name: "N3Chart",
                        component: N3Chart
                    },
                    { path: "o_chart/:id", name: "OChart", component: OChart },
                    {
                        path: "o2_chart/:id",
                        name: "O2Chart",
                        component: O2Chart
                    },
                    {
                        path: "o3_chart/:id",
                        name: "O3Chart",
                        component: O3Chart
                    },
                    { path: "p_chart/:id", name: "PChart", component: PChart },
                    { path: "r_chart/:id", name: "RChart", component: RChart },
                    {
                        path: "r2_chart/:id",
                        name: "R2Chart",
                        component: R2Chart
                    },
                    { path: "s_chart/:id", name: "SChart", component: SChart },
                    {
                        path: "s2_chart/:id",
                        name: "S2Chart",
                        component: S2Chart
                    }
                ]
            },
            {
                path: "/report",
                name: "Report",
                component: Report
            },
            {
                path: "/chartHandbook",
                name: "ChartHandbook",
                component: ChartHandbook
            },
            {
                path: "/ChartHandbookChart",
                name: "ChartHandbookChart",
                component: ChartHandbookChart
            },
            {
                path: "/ChartHandbookText",
                name: "ChartHandbookText",
                component: ChartHandbookText
            },
            {
                path: "/tools",
                name: "Tools",
                component: Tools
            },
            {
                path: "/tool",
                name: "Tool",
                component: Tool,
                children: [
                    {
                        path: "lip-service",
                        name: "LipService",
                        component: LipService
                    },
                    {
                        path: "department_setting",
                        name: "DepartmentSetting",
                        component: DepartmentSetting
                    },
                    {
                        path: "law_list",
                        name: "LawList",
                        component: LawList
                    },
                    {
                        path: "dictionary",
                        name: "Dictionary",
                        component: Dictionary
                    },
                    {
                        path: "check_point",
                        name: "CheckPoint",
                        component: CheckPoint
                    }
                ]
            }
        ]
    },
    {
        path: "/administrator",
        name: "Administrator",
        redirect: "/administrator/ticketData",
        component: Administrator,
        children: [
            {
                path: "ticketData",
                name: "TicketData",
                component: TicketData
            },
            {
                path: "userInformation",
                name: "UserInformation",
                component: UserInformation
            },
            {
                path: "reason",
                name: "Reason",
                component: Reason
            },
            {
                path: "penaltyBranch",
                name: "PenaltyBranch",
                component: PenaltyBranch
            },
            {
                path: "violationEnterprise",
                name: "ViolationEnterprise",
                component: ViolationEnterprise
            },
            {
                path: "listedBank",
                name: "ListedBank",
                component: ListedBank
            },
            {
                path: "complianceDictionary",
                name: "ComplianceDictionary",
                component: ComplianceDictionary
            },
            {
                path: "check",
                name: "Check",
                component: Check
            },
            {
                path: "account",
                name: "Account",
                component: Account
            },
            {
                path: "reportFile",
                name: "ReportFile",
                component: ReportFile
            },
            {
                path: "judgeDocumentFile",
                name: "JudgeDocumentFile",
                component: JudgeDocumentFile
            },
            {
                path: "organizationFile",
                name: "OrganizationFile",
                component: OrganizationFile
            },
            {
                path: "lawsFile",
                name: "LawsFile",
                component: LawsFile
            },
            {
                path: "notice",
                name: "Notice",
                component: Notice
            },
            {
                path: "problem",
                name: "Problem",
                component: Problem
            },
            {
                path: "documentList",
                name: "DocumentList",
                component: DocumentList
            },
            {
                path: "processTabel",
                name: "ProcessTabel",
                component: ProcessTabel
            },
            {
                path: "content",
                name: "Content",
                component: Content
            },
            {
                path: "dictionaryList",
                name: "DictionaryList",
                component: DictionaryList
            },
            {
                path: "financialInstitutions",
                name: "FinancialInstitutions",
                component: FinancialInstitutions
            },
            {
                path: "bankCasesList",
                name: "BankCasesList",
                component: BankCasesList
            },
            {
                path: "roleMotivation",
                name: "RoleMotivation",
                component: RoleMotivation
            },
            {
                path: "financialRegulations",
                name: "FinancialRegulations",
                component: FinancialRegulations
            },
            {
                path: "lawData",
                name: "LawData",
                component: LawData
            },
            {
                path: "lowRelation",
                name: "LowRelation",
                component: LowRelation
            },
            {
                path: "lowKnowledge",
                name: "LowKnowledge",
                component: LowKnowledge
            },
            {
                path: "lowTag",
                name: "LowTag",
                component: LowTag
            },
            {
                path: "dictionaryTag",
                name: "DictionaryTag",
                component: DictionaryTag
            },
            {
                path: "dictionaryTagChart",
                name: "dictionaryTagChart",
                component: DictionaryTagChart
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/info",
        name: "Info",
        component: Info
    },
    {
        path: "/noPermission",
        name: "NoPermission",
        component: NoPermission
    }
    /*{
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
    }*/
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    let user = localStorage.getItem("user");
    user && (user = JSON.parse(user));

    // if (user) {
    //     if (!user.lawsAvailable) {
    //         if (
    //             to.path === "/userFinancialRegulation/searchLaw" ||
    //             to.path === "/userFinancialRegulation/searchKnowledge" ||
    //             to.path === "/userFinancialRegulation/viewDetail"
    //         ) {
    //             next({ path: "/noPermission" });
    //         }
    //     }
    //     if (!user.indicatorsQuery) {
    //         if (to.path.includes("/charts/chart")) {
    //             next({ path: "/noPermission" });
    //         }
    //     }

    //     if (!user.financialCaseAvailable) {
    //         if (
    //             to.path === "/financialCases/judgeDocumentById" ||
    //             to.path === "/financialCases/judgeCaseById"
    //         ) {
    //             next({ path: "/noPermission" });
    //         }
    //     }
    // }

    next();
});

export default router;
