import { adminConstants } from '../constants';

export const adminReducers = (state = {
    pages: [
        'admin dispatch',
        'admin customer',
        'admin carrier',
        'reports',
        'company setup'
    ],
    selectedPageIndex: -1,
    mainAdminScreenFocused: true,
    dispatchScreenFocused: false,
    customerScreenFocused: false,
    carrierScreenFocused: false,
    reportsScreenFocused: false,
    setupCompanyScreenFocused: false,
    adminOpenedPanels: []
}, action) => {
    switch (action.type) {
        case adminConstants.SET_ADMIN_OPENED_PANELS:
            state = {
                ...state,
                adminOpenedPanels: action.payload
            }
            break;

        case adminConstants.SET_PAGES:
            state = {
                ...state,
                pages: action.payload
            }
            break;
        case adminConstants.SET_SELECTED_PAGE_INDEX:
            state = {
                ...state,
                selectedPageIndex: action.payload
            }
            break;

        case adminConstants.SET_MAIN_ADMIN_SCREEN_FOCUSED:
            state = {
                ...state,
                mainAdminScreenFocused: action.payload,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_DISPATCH_SCREEN_FOCUSED:
            state = {
                ...state,
                dispatchScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_CUSTOMER_SCREEN_FOCUSED:
            state = {
                ...state,
                customerScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_CARRIER_SCREEN_FOCUSED:
            state = {
                ...state,
                carrierScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_REPORTS_SCREEN_FOCUSED:
            state = {
                ...state,
                reportsScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_SETUP_COMPANY_SCREEN_FOCUSED:
            state = {
                ...state,
                setupCompanyScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
            }
            break;
        default:
            break;
    }
    return state;
}