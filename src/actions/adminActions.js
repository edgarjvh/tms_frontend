import {adminConstants} from './../constants';
import axios from 'axios';

export const setPages = pages => {
    return {
        type: adminConstants.SET_PAGES,
        payload: pages
    }
}

export const setAdminOpenedPanels = panels => {
    return {
        type: adminConstants.SET_ADMIN_OPENED_PANELS,
        payload: panels
    }
}

export const setSelectedPageIndex = index => {
    return {
        type: adminConstants.SET_SELECTED_PAGE_INDEX,
        payload: index
    }
}

export const setMainAdminScreenFocused = bool => {
    return {
        type: adminConstants.SET_MAIN_ADMIN_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setDispatchScreenFocused = bool => {
    return {
        type: adminConstants.SET_DISPATCH_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCustomerScreenFocused = bool => {
    return {
        type: adminConstants.SET_CUSTOMER_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setCarrierScreenFocused = bool => {
    return {
        type: adminConstants.SET_CARRIER_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setInvoiceScreenFocused = bool => {
    return {
        type: adminConstants.SET_INVOICE_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setReportsScreenFocused = bool => {
    return {
        type: adminConstants.SET_REPORTS_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setSetupCompanyScreenFocused = bool => {
    return {
        type: adminConstants.SET_SETUP_COMPANY_SCREEN_FOCUSED,
        payload: bool
    }
}

export const setAdminHomePanels = bool => {
    return {
        type: adminConstants.SET_ADMIN_HOME_PANELS,
        payload: bool
    }
}