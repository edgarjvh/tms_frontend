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