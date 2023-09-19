import { reportsConstants } from "../constants";

export const setAdminReportPanels = panels => {
    return {
        type: reportsConstants.SET_ADMIN_REPORT_PANELS,
        payload: panels
    }
}

export const setCompanyReportPanels = panels => {
    return {
        type: reportsConstants.SET_COMPANY_REPORT_PANELS,
        payload: panels
    }
}