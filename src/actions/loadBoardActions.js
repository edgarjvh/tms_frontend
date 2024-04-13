import {loadBoardConstants} from './../constants';

export const setLoadBoardOpenedPanels = panels => {
    return {
        type: loadBoardConstants.SET_LOAD_BOARD_OPENED_PANELS,
        payload: panels
    }
}

export const setAdminLoadBoardPanels = panels => {
    return {
        type: loadBoardConstants.SET_ADMIN_LOAD_BOARD_PANELS,
        payload: panels
    }
}

export const setCompanyLoadBoardPanels = panels => {
    return {
        type: loadBoardConstants.SET_COMPANY_LOAD_BOARD_PANELS,
        payload: panels
    }
}

export const setAvailableOrders = orders => {
    return {
        type: loadBoardConstants.SET_AVAILABLE_ORDERS,
        payload: orders
    }
}

export const setBookedOrders = orders => {
    return {
        type: loadBoardConstants.SET_BOOKED_ORDERS,
        payload: orders
    }
}

export const setInTransitOrders = orders => {
    return {
        type: loadBoardConstants.SET_IN_TRANSIT_ORDERS,
        payload: orders
    }
}

export const setDeliveredNotInvoiced = orders => {
    return {
        type: loadBoardConstants.SET_DELIVERED_NOT_INVOICED,
        payload: orders
    }
}

export const setIsLoadingWidget = bool => {
    return {
        type: loadBoardConstants.SET_IS_LOADING_WIDGET,
        payload: bool
    }
}