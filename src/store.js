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
    companySetupReducers
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
        companySetupReducers
    })
    // applyMiddleware(thunk)
);