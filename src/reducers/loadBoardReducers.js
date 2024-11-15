import { loadBoardConstants } from './../constants';

export const loadBoardReducers = (state = {
    loadBoardOpenedPanels: [],
    adminLoadBoardPanels: [],
    companyLoadBoardPanels: [],
    availableOrders: [],
    bookedOrders: [],
    inTransitOrders: [],
    deliveredNotInvoiced: [],
    isLoadingWidget: false
}, action) => {
    switch (action.type) {
        case loadBoardConstants.SET_LOAD_BOARD_OPENED_PANELS:
            state = {
                ...state,
                loadBoardOpenedPanels: action.payload
            }
            break;
        case loadBoardConstants.SET_ADMIN_LOAD_BOARD_PANELS:
            state = {
                ...state,
                adminLoadBoardPanels: (action.payload || []).map(item => {
                    if (!item?.right){
                        item.right = 0
                    }
                    return item;
                })
            }
            break;
        case loadBoardConstants.SET_COMPANY_LOAD_BOARD_PANELS:
            state = {
                ...state,
                companyLoadBoardPanels: (action.payload || []).map(item => {
                    if (!item?.right){
                        item.right = 0
                    }
                    return item;
                })
            }
            break;
        case loadBoardConstants.SET_AVAILABLE_ORDERS:
            state = {
                ...state,
                availableOrders: action.payload
            }
            break;
        case loadBoardConstants.SET_BOOKED_ORDERS:
            state = {
                ...state,
                bookedOrders: action.payload
            }
            break;
        case loadBoardConstants.SET_IN_TRANSIT_ORDERS:
            state = {
                ...state,
                inTransitOrders: action.payload
            }
            break;
        case loadBoardConstants.SET_DELIVERED_NOT_INVOICED:
            state = {
                ...state,
                deliveredNotInvoiced: action.payload
            }
            break;
        case loadBoardConstants.SET_IS_LOADING_WIDGET:
            state = {
                ...state,
                isLoadingWidget: action.payload
            }
            break;
        default:
            break;
    }
    return state;
}