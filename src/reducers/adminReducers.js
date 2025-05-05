import { adminConstants } from '../constants';

export const adminReducers = (state = {
    pages: [
        'admin home',
        'admin carrier',
        'company setup',
        'admin customer',
        'admin dispatch',
        'admin invoice',
        'admin reports'
    ],
    selectedPageIndex: 0,
    mainAdminScreenFocused: true,
    dispatchScreenFocused: false,
    customerScreenFocused: false,
    carrierScreenFocused: false,
    reportsScreenFocused: false,
    setupCompanyScreenFocused: false,
    invoiceScreenFocused: false,
    adminOpenedPanels: [],
    adminHomePanels: [],
    adminSuperOrigin: ''
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
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
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
            }
            break;
        case adminConstants.SET_INVOICE_SCREEN_FOCUSED:
            state = {
                ...state,
                invoiceScreenFocused: action.payload,
                mainAdminScreenFocused: action.payload ? false : state.mainAdminScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                reportsScreenFocused: action.payload ? false : state.reportsScreenFocused,
                setupCompanyScreenFocused: action.payload ? false : state.setupCompanyScreenFocused,
            }
            break;
        case adminConstants.SET_ADMIN_HOME_PANELS:
            state = {
                ...state,
                adminHomePanels: (action.payload || []).map(item => {
                    if (!item?.right) {
                        item.right = 0
                    }
                    return item;
                })
            }
            break;

        case adminConstants.SET_ADMIN_SUPER_ORIGIN:
            state = {
                ...state,
                adminSuperOrigin: action.payload
            }
            break;

        default:
            break;
    }
    return state;
}