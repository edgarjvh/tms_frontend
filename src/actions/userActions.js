import { userConstants } from "../constants";

export const setUserContacts = (contacts) => {
    return {
        type: userConstants.SET_USER_CONTACTS,
        payload: contacts,
    };
}