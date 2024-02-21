import { companyConstants } from '../constants';

const pagesList = process.env.NODE_ENV === 'development'
    ? [
        'home',        
        'carrier',
        'customer',
        'dispatch',
        'invoice',
        'load board',
        'reports'
    ] :
    process.env.NODE_ENV === 'production' && process.env.REACT_APP_PRO_SERVER_URL !== 'https://tms.et3.dev/api'
        ? [
            'home',
            'customers-t',
            'carrier',
            'customer',
            'dispatch',
            'invoice',
            'load board',
            'reports'
        ] : [
            'home',
            'carrier',
            'customer',
            'dispatch',
            'invoice',
            'load board',
            'reports'
        ]

export const companyReducers = (state = {
    pages: pagesList,
    selectedPageIndex: 0,
    mainCompanyScreenFocused: true,
    customerTScreenFocused: false,
    loginScreenFocused: false,
    dispatchScreenFocused: false,
    customerScreenFocused: false,
    carrierScreenFocused: false,
    loadBoardScreenFocused: false,
    invoiceScreenFocused: false,
    companyOpenedPanels: [],
    companyHomePanels: [],
    customersTPanels: [],
}, action) => {
    switch (action.type) {
        case companyConstants.SET_PAGES:
            state = {
                ...state,
                pages: action.payload
            }
            break;
        case companyConstants.SET_SELECTED_PAGE_INDEX:
            state = {
                ...state,
                selectedPageIndex: action.payload
            }
            break;

        case companyConstants.SET_COMPANY_OPENED_PANELS:
            state = {
                ...state,
                companyOpenedPanels: action.payload
            }
            break;

        case companyConstants.SET_MAIN_COMPANY_SCREEN_FOCUSED:
            state = {
                ...state,
                mainCompanyScreenFocused: action.payload,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_LOGIN_SCREEN_FOCUSED:
            state = {
                ...state,
                loginScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
            }
            break;
        case companyConstants.SET_DISPATCH_SCREEN_FOCUSED:
            state = {
                ...state,
                dispatchScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_CUSTOMER_SCREEN_FOCUSED:
            state = {
                ...state,
                customerScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_CARRIER_SCREEN_FOCUSED:
            state = {
                ...state,
                carrierScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_LOAD_BOARD_SCREEN_FOCUSED:
            state = {
                ...state,
                loadBoardScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                invoiceScreenFocused: action.payload ? false : state.invoiceScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_INVOICE_SCREEN_FOCUSED:
            state = {
                ...state,
                invoiceScreenFocused: action.payload,
                mainCompanyScreenFocused: action.payload ? false : state.mainCompanyScreenFocused,
                dispatchScreenFocused: action.payload ? false : state.dispatchScreenFocused,
                customerScreenFocused: action.payload ? false : state.customerScreenFocused,
                carrierScreenFocused: action.payload ? false : state.carrierScreenFocused,
                loadBoardScreenFocused: action.payload ? false : state.loadBoardScreenFocused,
                loginScreenFocused: action.payload ? false : state.loginScreenFocused,
            }
            break;
        case companyConstants.SET_COMPANY_HOME_PANELS:
            state = {
                ...state,
                companyHomePanels: action.payload
            }
            break;

        case companyConstants.SET_CUSTOMERS_T_PANELS:
            state = {
                ...state,
                customersTPanels: action.payload
            }
            break;
        default:
            break;
    }
    return state;
}