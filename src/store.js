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
    reportReducers
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
        reportReducers
    })
    // applyMiddleware(thunk)
);