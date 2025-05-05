import {companyConstants} from './../constants';
import axios from 'axios';

export const setPages = pages => {
    return {
        type: companyConstants.SET_PAGES,
        payload: pages
    }
}

export const setSelectedPageIndex = index => {
    return {
        type: companyConstants.SET_SELECTED_PAGE_INDEX,
        payload: index
    }
}

export const setLoginScreenFocused = bool => {
    return {
        type: companyConstants.SET_LOGIN_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setMainCompanyScreenFocused = bool => {
    return {
        type: companyConstants.SET_MAIN_COMPANY_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCustomerTScreenFocused = bool => {
    return {
        type: companyConstants.SET_CUSTOMER_T_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setDispatchScreenFocused = bool => {
    return {
        type: companyConstants.SET_DISPATCH_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCustomerScreenFocused = bool => {
    return {
        type: companyConstants.SET_CUSTOMER_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCarrierScreenFocused = bool => {
    return {
        type: companyConstants.SET_CARRIER_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setLoadBoardScreenFocused = bool => {
    return {
        type: companyConstants.SET_LOAD_BOARD_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setInvoiceScreenFocused = bool => {
    return {
        type: companyConstants.SET_INVOICE_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCompanyOpenedPanels = panels => {
    return {
        type: companyConstants.SET_COMPANY_OPENED_PANELS,
        payload: panels
    }
}

export const setReportsScreenFocused = bool => {
    return {
        type: companyConstants.SET_REPORTS_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCompanyHomePanels = panels => {
    return {
        type: companyConstants.SET_COMPANY_HOME_PANELS,
        payload: panels
    }
}

export const setCustomersTPanels = bool => {
    return {
        type: companyConstants.SET_CUSTOMERS_T_PANELS,
        payload: bool
    }
}

export const setCompanySuperOrigin = companySuperOrigin => {
    return {
        type: companyConstants.SET_COMPANY_SUPER_ORIGIN,
        payload: companySuperOrigin
    }
}