import {systemConstants} from './../constants';

export const setMainScreen = screen => {
    return {
        type: systemConstants.SET_MAIN_SCREEN,
        payload: screen
    }
}

export const setUser = user => {    
    return {
        type: systemConstants.SET_USER,
        payload: user
    }
}

export const setLoginMessage = message => {    
    return {
        type: systemConstants.SET_LOGIN_MESSAGE,
        payload: message
    }
}

export const setScale = scale => {
    return {
        type: systemConstants.SET_SCALE,
        payload: scale
    }
}

export const setTestingSwitch = bool => {
    return {
        type: systemConstants.SET_TESTING_SWITCH,
        payload: bool
    }
}