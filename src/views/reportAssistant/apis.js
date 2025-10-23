import http from './http.js'
import { URL } from '../../../config.js'

export const B01 = (params) => {
    return http.get(URL + '/ticket-report/b01', { params })
}
export const B02 = (params) => {
    return http.get(URL + '/ticket-report/b02', { params })
}
export const B03 = (params) => {
    return http.get(URL + '/ticket-report/b03', { params })
}
export const B04 = (params) => {
    return http.get(URL + '/ticket-report/b04', { params })
}
export const B05 = (params) => {
    return http.get(URL + '/ticket-report/b05', { params })
}
export const B06 = (params) => {
    return http.get(URL + '/ticket-report/b06', { params })
}
export const B07 = (params) => {
    return http.get(URL + '/ticket-report/b07', { params })
}
export const B08 = (params) => {
    return http.get(URL + '/ticket-report/b08', { params })
}
export const B09 = (params) => {
    return http.get(URL + '/ticket-report/b09', { params })
}
export const B10 = (params) => {
    return http.get(URL + '/ticket-report/b10', { params })
}
export const B11 = (params) => {
    return http.get(URL + '/ticket-report/b11', { params })
}
export const B12 = (params) => {
    return http.get(URL + '/ticket-report/b12', { params })
}
export const B13 = (params) => {
    return http.get(URL + '/ticket-report/b13', { params })
}
export const B14 = (params) => {
    return http.get(URL + '/ticket-report/b14', { params })
}
export const B15 = (params) => {
    return http.get(URL + '/ticket-report/b15', { params })
}
export const B16 = (params) => {
    return http.get(URL + '/ticket-report/b16', { params })
}
export const B17 = (params) => {
    return http.get(URL + '/ticket-report/b17', { params })
}
export const B18 = (params) => {
    return http.get(URL + '/ticket-report/b18', { params })
}
export const B19 = (params) => {
    return http.get(URL + '/ticket-report/b19', { params })
}
export const B20 = (params) => {
    return http.get(URL + '/ticket-report/b20', { params })
}
export const B21 = (params) => {
    return http.get(URL + '/ticket-report/b21', { params })
}
export const B22 = (params) => {
    return http.get(URL + '/ticket-report/b22', { params })
}
export const B23 = (params) => {
    return http.get(URL + '/ticket-report/b23', { params })
}
export const B24 = (params) => {
    return http.get(URL + '/ticket-report/b24', { params })
}
export const B25 = (params) => {
    return http.get(URL + '/ticket-report/b25', { params })
}
export const B26 = (params) => {
    return http.get(URL + '/ticket-report/b26', { params })
}
export const B27 = (params) => {
    return http.get(URL + '/ticket-report/b27', { params })
}
export const getAvailableDomainList = (params) => http.get(URL + '/ticket-report/available-domain', { params })
export const getSanctionDetail = (params) => http.get(URL + `/items/cl_ticket/${params.id}`, { params })

export const getReportLogic = (params) => http.get(URL + '/items/cl_ticket_report_logic', { params })
export const getBankGroupList = (params) => http.get(URL + '/items/cl_financial_institution_type', { params })
export const getBankSingleList = (params) => http.get(URL + '/items/cl_financial_institution', { params })
export const getArea = (params) => http.get(URL + '/items/cl_area', { params })