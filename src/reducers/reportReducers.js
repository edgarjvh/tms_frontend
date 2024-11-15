import { reportsConstants } from './../constants';

export const reportReducers = (state = {
    adminReportPanels: [],
    companyReportPanels: []
}, action) => {
    switch (action.type){
        case reportsConstants.SET_ADMIN_REPORT_PANELS:
            state = {
                ...state,
                adminReportPanels: (action.payload || []).map(item => {
                    if (!item?.right){
                        item.right = 0
                    }
                    return item;
                })
            }
            break;
            
        case reportsConstants.SET_COMPANY_REPORT_PANELS:
            state = {
                ...state,
                companyReportPanels: (action.payload || []).map(item => {
                    if (!item?.right){
                        item.right = 0
                    }
                    return item;
                })
            }
            break;
        default:
            break;
    }
    return state;
}