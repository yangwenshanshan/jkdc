import http from "../../http"

export default {
  getReportLogic: (params) => http.get('/data/items/cl_ticket_report_logic', { params }),
  getBankGroupList: (params) => http.get('/data/items/cl_financial_institution_type', { params }),
  getBankSingleList: (params) => http.get('/data/items/cl_financial_institution', { params }),
}