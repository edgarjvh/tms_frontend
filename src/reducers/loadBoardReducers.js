import { loadBoardConstants } from './../constants';

export const loadBoardReducers = (state = {
    loadBoardOpenedPanels: [],

    adminLoadBoardPanels: [],
    companyLoadBoardPanels: []
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
                adminLoadBoardPanels: action.payload
            }
        break;
        case loadBoardConstants.SET_COMPANY_LOAD_BOARD_PANELS:
            state = {
                ...state,
                companyLoadBoardPanels: action.payload
            }
        break;
    }
    return state;
}