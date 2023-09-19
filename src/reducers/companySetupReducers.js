import { companySetupConstants } from './../constants';

export const companySetupReducers = (state = {
    companySetupOpenedPanels: [],
    selectedCompany: {},
    selectedEmployee: {},
    selectedAgent: {},
    selectedDriver: {},
    selectedAgentDriver: {},
    selectedDriverContact: {},
    selectedOperator: {},
    selectedOperatorContact: {},
    adminCompanySetupPanels: [],
    companyCompanySetupPanels: [],
}, action) => {
    switch (action.type) {
        case companySetupConstants.SET_COMPANY_SETUP_OPENED_PANELS:
            console.log(action.payload);
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

        case companySetupConstants.SET_SELECTED_AGENT_DRIVER:
            state = {
                ...state,
                selectedAgentDriver: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_DRIVER_CONTACT:
            state = {
                ...state,
                selectedDriverContact: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_COMPANY_OPERATOR:
            state = {
                ...state,
                selectedOperator: action.payload
            }
        break;

        case companySetupConstants.SET_SELECTED_OPERATOR_CONTACT:
            state = {
                ...state,
                selectedOperatorContact: action.payload
            }
        break;

        case companySetupConstants.SET_ADMIN_COMPANY_SETUP_PANELS:
            state = {
                ...state,
                adminCompanySetupPanels: action.payload
            }
        break;

        case companySetupConstants.SET_COMPANY_COMPANY_SETUP_PANELS:
            state = {
                ...state,
                companyCompanySetupPanels: action.payload
            }
        break;
    }
    return state;
}