import { reportsConstants } from './../constants';

export const reportReducers = (state = {
    adminReportPanels: [],
    companyReportPanels: []
}, action) => {
    switch (action.type){
        case reportsConstants.SET_ADMIN_REPORT_PANELS:
            state = {
                ...state,
                adminReportPanels: action.payload
            }
            break;
            
        case reportsConstants.SET_COMPANY_REPORT_PANELS:
            state = {
                ...state,
                companyReportPanels: action.payload
            }
            break;
        default:
            break;
    }
    return state;
}