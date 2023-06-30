import { companySetupConstants } from './../constants';

export const setCompanySetupOpenedPanels = panels => {
    return {
        type: companySetupConstants.SET_COMPANY_SETUP_OPENED_PANELS,
        payload: panels
    }
}

export const setSelectedCompany = company => {
    return {
        type: companySetupConstants.SET_SELECTED_COMPANY,
        payload: company
    }
}

export const setSelectedEmployee = employee => {
    return {
        type: companySetupConstants.SET_SELECTED_EMPLOYEE,
        payload: employee
    }
}

export const setSelectedAgent = agent => {
    return {
        type: companySetupConstants.SET_SELECTED_AGENT,
        payload: agent
    }
}

export const setSelectedCompanyDriver = driver => {
    return {
        type: companySetupConstants.SET_SELECTED_COMPANY_DRIVER,
        payload: driver
    }
}

export const setSelectedDriverContact = contact => {
    return {
        type: companySetupConstants.SET_SELECTED_DRIVER_CONTACT,
        payload: contact
    }
}

export const setSelectedOwnerOperator = ownerOperator => {
    return {
        type: companySetupConstants.SET_SELECTED_OWNER_OPERATOR,
        payload: ownerOperator
    }
}