import { companySetupConstants } from './../constants';

export const companySetupReducers = (state = {
    companySetupOpenedPanels: [],
    selectedCompany: {},
    selectedEmployee: {},
    selectedAgent: {},
    selectedDriver: {},
    selectedOperator: {}
}, action) => {
    switch (action.type) {
        case companySetupConstants.SET_COMPANY_SETUP_OPENED_PANELS:
            state = {
                ...state,
                companySetupOpenedPanels: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_COMPANY:
            state = {
                ...state,
                selectedCompany: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_EMPLOYEE:
            state = {
                ...state,
                selectedEmployee: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_AGENT:
            state = {
                ...state,
                selectedAgent: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_COMPANY_DRIVER:
            state = {
                ...state,
                selectedDriver: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_OWNER_OPERATOR:
            state = {
                ...state,
                selectedOperator: action.payload
            }
        break;
    }
    return state;
}