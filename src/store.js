import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
    systemReducers,
    companyReducers, 
    adminReducers, 
    customerReducers, 
    carrierReducers, 
    invoiceReducers, 
    dispatchReducers, 
    loadBoardReducers,
    companySetupReducers,
    reportReducers,
    userReducers
} from './reducers';
import thunk from 'redux-thunk';

export const store = createStore(
    combineReducers({
        systemReducers,
        companyReducers,
        adminReducers,
        customerReducers,
        carrierReducers,
        invoiceReducers,
        dispatchReducers,
        loadBoardReducers,
        companySetupReducers,
        reportReducers,
        userReducers
    })
    // applyMiddleware(thunk)
);