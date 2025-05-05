import { userConstants } from "../constants";

export const userReducers = (state = {
    userContacts: [],
}, action) => {
    switch (action.type) {
        case userConstants.SET_USER_CONTACTS:
            state = {
                ...state,
                userContacts: action.payload
            }
            break;

        default:
            break;
    }
    return state;
}