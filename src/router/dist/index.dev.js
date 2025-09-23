"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Administrator = _interopRequireDefault(require("../views/Administrator"));

var _TicketData = _interopRequireDefault(require("../views/admin/TicketData"));

var _UserInformation = _interopRequireDefault(require("../views/admin/UserInformation"));

var _Reason = _interopRequireDefault(require("../views/admin/Reason"));

var _PenaltyBranch = _interopRequireDefault(require("../views/admin/PenaltyBranch"));

var _ViolationEnterprise = _interopRequireDefault(require("../views/admin/ViolationEnterprise"));

var _ListedBank = _interopRequireDefault(require("../views/admin/ListedBank"));

var _ComplianceDictionary = _interopRequireDefault(require("../views/admin/ComplianceDictionary"));

var _Check = _interopRequireDefault(require("../views/admin/Check"));

var _Account = _interopRequireDefault(require("../views/admin/Account"));

var _ReportFile = _interopRequireDefault(require("../views/admin/ReportFile"));

var _JudgeDocumentFile = _interopRequireDefault(require("../views/admin/JudgeDocumentFile.vue"));

var _OrganizationFile = _interopRequireDefault(require("../views/admin/OrganizationFile"));

var _LawsFile = _interopRequireDefault(require("../views/admin/LawsFile"));

var _Notice = _interopRequireDefault(require("../views/admin/Notice"));

var _Info = _interopRequireDefault(require("../views/admin/Info"));

var _Problem = _interopRequireDefault(require("../views/admin/Problem"));

var _DocumentList = _interopRequireDefault(require("../views/admin/DocumentList"));

var _DictionaryList = _interopRequireDefault(require("../views/admin/DictionaryList.vue"));

var _FinancialInstitutions = _interopRequireDefault(require("../views/admin/FinancialInstitutions.vue"));

var _BankCasesList = _interopRequireDefault(require("../views/admin/BankCasesList"));

var _RoleMotivation = _interopRequireDefault(require("../views/admin/RoleMotivation"));

var _ProcessTabel = _interopRequireDefault(require("../views/admin/ProcessTabel.vue"));

var _Content = _interopRequireDefault(require("../views/admin/Content.vue"));

var _FinancialRegulations = _interopRequireDefault(require("../views/admin/FinancialRegulations.vue"));

var _LawData = _interopRequireDefault(require("../views/admin/LawData.vue"));

var _LowRelation = _interopRequireDefault(require("../views/admin/LowRelation.vue"));

var _LowKnowledge = _interopRequireDefault(require("../views/admin/LowKnowledge.vue"));

var _LowTag = _interopRequireDefault(require("../views/admin/LowTag.vue"));

var _DictionaryTag = _interopRequireDefault(require("../views/admin/DictionaryTag.vue"));

var _Index = _interopRequireDefault(require("../views/Index"));

var _Login = _interopRequireDefault(require("../views/Login"));

var _Register = _interopRequireDefault(require("../views/Register"));

var _Query = _interopRequireDefault(require("../views/Query"));

var _FinancialCases = _interopRequireDefault(require("../views/FinancialCases"));

var _index = _interopRequireDefault(require("../views/userFinancialRegulation/index.vue"));

var _JudgeDocumentById = _interopRequireDefault(require("../views/components/JudgeDocumentById.vue"));

var _JudgeCaseById = _interopRequireDefault(require("../views/components/JudgeCaseById.vue"));

var _Charts = _interopRequireDefault(require("../views/Charts"));

var _Chart = _interopRequireDefault(require("../views/Chart"));

var _AChart = _interopRequireDefault(require("../views/charts/AChart"));

var _BChart = _interopRequireDefault(require("../views/charts/BChart"));

var _CChart = _interopRequireDefault(require("../views/charts/CChart"));

var _DChart = _interopRequireDefault(require("../views/charts/DChart"));

var _EChart = _interopRequireDefault(require("../views/charts/EChart"));

var _E2Chart = _interopRequireDefault(require("../views/charts/E2Chart"));

var _FChart = _interopRequireDefault(require("../views/charts/FChart"));

var _F2Chart = _interopRequireDefault(require("../views/charts/F2Chart"));

var _GChart = _interopRequireDefault(require("../views/charts/GChart"));

var _HChart = _interopRequireDefault(require("../views/charts/HChart"));

var _H2Chart = _interopRequireDefault(require("../views/charts/H2Chart"));

var _IChart = _interopRequireDefault(require("../views/charts/IChart"));

var _JChart = _interopRequireDefault(require("../views/charts/JChart"));

var _J2Chart = _interopRequireDefault(require("../views/charts/J2Chart"));

var _KChart = _interopRequireDefault(require("../views/charts/KChart"));

var _K2Chart = _interopRequireDefault(require("../views/charts/K2Chart"));

var _LChart = _interopRequireDefault(require("../views/charts/LChart"));

var _L2Chart = _interopRequireDefault(require("../views/charts/L2Chart"));

var _MChart = _interopRequireDefault(require("../views/charts/MChart"));

var _NChart = _interopRequireDefault(require("../views/charts/NChart"));

var _N2Chart = _interopRequireDefault(require("../views/charts/N2Chart"));

var _N3Chart = _interopRequireDefault(require("../views/charts/N3Chart"));

var _OChart = _interopRequireDefault(require("../views/charts/OChart"));

var _O2Chart = _interopRequireDefault(require("../views/charts/O2Chart"));

var _O3Chart = _interopRequireDefault(require("../views/charts/O3Chart"));

var _PChart = _interopRequireDefault(require("../views/charts/PChart"));

var _RChart = _interopRequireDefault(require("../views/charts/RChart"));

var _R2Chart = _interopRequireDefault(require("../views/charts/R2Chart"));

var _SChart = _interopRequireDefault(require("../views/charts/SChart"));

var _S2Chart = _interopRequireDefault(require("../views/charts/S2Chart"));

var _Report = _interopRequireDefault(require("../views/Report"));

var _Tools = _interopRequireDefault(require("../views/Tools"));

var _Tool = _interopRequireDefault(require("../views/Tool"));

var _DepartmentSetting = _interopRequireDefault(require("../views/tools/DepartmentSetting"));

var _LawList = _interopRequireDefault(require("../views/tools/LawList"));

var _LipService = _interopRequireDefault(require("../views/tools/Lip-service"));

var _Dictionary = _interopRequireDefault(require("../views/tools/Dictionary"));

var _CheckPoint = _interopRequireDefault(require("../views/tools/CheckPoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  name: 'Home',
  component: _Index["default"],
  redirect: 'login',
  children: [{
    path: '/query',
    name: 'Query',
    component: _Query["default"]
  }, {
    path: '/userFinancialRegulation',
    name: 'UserFinancialRegulation',
    component: _index["default"]
  }, {
    path: '/financialCases',
    name: 'FinancialCases',
    component: _FinancialCases["default"]
  }, {
    path: '/financialCases/judgeDocumentById',
    name: 'JudgeDocumentById',
    component: _JudgeDocumentById["default"]
  }, {
    path: '/financialCases/judgeCaseById',
    name: 'JudgeCaseById',
    component: _JudgeCaseById["default"]
  }, {
    path: '/charts',
    name: 'Charts',
    component: _Charts["default"]
  }, {
    path: '/charts/chart',
    name: 'Chart',
    component: _Chart["default"],
    children: [{
      path: 'a_chart/:id',
      name: 'AChart',
      component: _AChart["default"]
    }, {
      path: 'b_chart/:id',
      name: 'BChart',
      component: _BChart["default"]
    }, {
      path: 'c_chart/:id',
      name: 'CChart',
      component: _CChart["default"]
    }, {
      path: 'd_chart/:id',
      name: 'DChart',
      component: _DChart["default"]
    }, {
      path: 'e_chart/:id',
      name: 'EChart',
      component: _EChart["default"]
    }, {
      path: 'e2_chart/:id',
      name: 'E2Chart',
      component: _E2Chart["default"]
    }, {
      path: 'f_chart/:id',
      name: 'FChart',
      component: _FChart["default"]
    }, {
      path: 'f2_chart/:id',
      name: 'F2Chart',
      component: _F2Chart["default"]
    }, {
      path: 'g_chart/:id',
      name: 'GChart',
      component: _GChart["default"]
    }, {
      path: 'h_chart/:id',
      name: 'HChart',
      component: _HChart["default"]
    }, {
      path: 'h2_chart/:id',
      name: 'H2Chart',
      component: _H2Chart["default"]
    }, {
      path: 'i_chart/:id',
      name: 'IChart',
      component: _IChart["default"]
    }, {
      path: 'j_chart/:id',
      name: 'JChart',
      component: _JChart["default"]
    }, {
      path: 'j2_chart/:id',
      name: 'J2Chart',
      component: _J2Chart["default"]
    }, {
      path: 'k_chart/:id',
      name: 'KChart',
      component: _KChart["default"]
    }, {
      path: 'k2_chart/:id',
      name: 'K2Chart',
      component: _K2Chart["default"]
    }, {
      path: 'l_chart/:id',
      name: 'LChart',
      component: _LChart["default"]
    }, {
      path: 'l2_chart/:id',
      name: 'L2Chart',
      component: _L2Chart["default"]
    }, {
      path: 'm_chart/:id',
      name: 'MChart',
      component: _MChart["default"]
    }, {
      path: 'n_chart/:id',
      name: 'NChart',
      component: _NChart["default"]
    }, {
      path: 'n2_chart/:id',
      name: 'N2Chart',
      component: _N2Chart["default"]
    }, {
      path: 'n3_chart/:id',
      name: 'N3Chart',
      component: _N3Chart["default"]
    }, {
      path: 'o_chart/:id',
      name: 'OChart',
      component: _OChart["default"]
    }, {
      path: 'o2_chart/:id',
      name: 'O2Chart',
      component: _O2Chart["default"]
    }, {
      path: 'o3_chart/:id',
      name: 'O3Chart',
      component: _O3Chart["default"]
    }, {
      path: 'p_chart/:id',
      name: 'PChart',
      component: _PChart["default"]
    }, {
      path: 'r_chart/:id',
      name: 'RChart',
      component: _RChart["default"]
    }, {
      path: 'r2_chart/:id',
      name: 'R2Chart',
      component: _R2Chart["default"]
    }, {
      path: 's_chart/:id',
      name: 'SChart',
      component: _SChart["default"]
    }, {
      path: 's2_chart/:id',
      name: 'S2Chart',
      component: _S2Chart["default"]
    }]
  }, {
    path: '/report',
    name: 'Report',
    component: _Report["default"]
  }, {
    path: '/tools',
    name: 'Tools',
    component: _Tools["default"]
  }, {
    path: '/tool',
    name: 'Tool',
    component: _Tool["default"],
    children: [{
      path: 'lip-service',
      name: 'LipService',
      component: _LipService["default"]
    }, {
      path: 'department_setting',
      name: 'DepartmentSetting',
      component: _DepartmentSetting["default"]
    }, {
      path: 'law_list',
      name: 'LawList',
      component: _LawList["default"]
    }, {
      path: 'dictionary',
      name: 'Dictionary',
      component: _Dictionary["default"]
    }, {
      path: 'check_point',
      name: 'CheckPoint',
      component: _CheckPoint["default"]
    }]
  }]
}, {
  path: '/administrator',
  name: 'Administrator',
  redirect: '/administrator/ticketData',
  component: _Administrator["default"],
  children: [{
    path: 'ticketData',
    name: 'TicketData',
    component: _TicketData["default"]
  }, {
    path: 'userInformation',
    name: 'UserInformation',
    component: _UserInformation["default"]
  }, {
    path: 'reason',
    name: 'Reason',
    component: _Reason["default"]
  }, {
    path: 'penaltyBranch',
    name: 'PenaltyBranch',
    component: _PenaltyBranch["default"]
  }, {
    path: 'violationEnterprise',
    name: 'ViolationEnterprise',
    component: _ViolationEnterprise["default"]
  }, {
    path: 'listedBank',
    name: 'ListedBank',
    component: _ListedBank["default"]
  }, {
    path: 'complianceDictionary',
    name: 'ComplianceDictionary',
    component: _ComplianceDictionary["default"]
  }, {
    path: 'check',
    name: 'Check',
    component: _Check["default"]
  }, {
    path: 'account',
    name: 'Account',
    component: _Account["default"]
  }, {
    path: 'reportFile',
    name: 'ReportFile',
    component: _ReportFile["default"]
  }, {
    path: 'judgeDocumentFile',
    name: 'JudgeDocumentFile',
    component: _JudgeDocumentFile["default"]
  }, {
    path: 'organizationFile',
    name: 'OrganizationFile',
    component: _OrganizationFile["default"]
  }, {
    path: 'lawsFile',
    name: 'LawsFile',
    component: _LawsFile["default"]
  }, {
    path: 'notice',
    name: 'Notice',
    component: _Notice["default"]
  }, {
    path: 'problem',
    name: 'Problem',
    component: _Problem["default"]
  }, {
    path: 'documentList',
    name: 'DocumentList',
    component: _DocumentList["default"]
  }, {
    path: 'processTabel',
    name: 'ProcessTabel',
    component: _ProcessTabel["default"]
  }, {
    path: 'content',
    name: 'Content',
    component: _Content["default"]
  }, {
    path: 'dictionaryList',
    name: 'DictionaryList',
    component: _DictionaryList["default"]
  }, {
    path: 'financialInstitutions',
    name: 'FinancialInstitutions',
    component: _FinancialInstitutions["default"]
  }, {
    path: 'bankCasesList',
    name: 'BankCasesList',
    component: _BankCasesList["default"]
  }, {
    path: 'roleMotivation',
    name: 'RoleMotivation',
    component: _RoleMotivation["default"]
  }, {
    path: 'financialRegulations',
    name: 'FinancialRegulations',
    component: _FinancialRegulations["default"]
  }, {
    path: 'lawData',
    name: 'LawData',
    component: _LawData["default"]
  }, {
    path: 'lowRelation',
    name: 'LowRelation',
    component: _LowRelation["default"]
  }, {
    path: 'lowKnowledge',
    name: 'LowKnowledge',
    component: _LowKnowledge["default"]
  }, {
    path: 'lowTag',
    name: 'LowTag',
    component: _LowTag["default"]
  }, {
    path: 'dictionaryTag',
    name: 'DictionaryTag',
    component: _DictionaryTag["default"]
  }]
}, {
  path: '/login',
  name: 'Login',
  component: _Login["default"]
}, {
  path: '/register',
  name: 'Register',
  component: _Register["default"]
}, {
  path: '/info',
  name: 'Info',
  component: _Info["default"]
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
var router = new _vueRouter["default"]({
  routes: routes
});
var _default = router;
exports["default"] = _default;