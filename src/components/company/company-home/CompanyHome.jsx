import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './CompanyHome.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import {
    setUser,
    setSelectedPageIndex,
    setMainCompanyScreenFocused
} from './../../../actions';

import {
    Login
} from './../panels';

const CompanyHome = (props) => {
    

    return (
        <div>
            {
                (props.user?.id || 0) === 0 &&
                <Login />
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.systemReducers.user,
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        mainCompanyScreenFocused: state.companyReducers.mainCompanyScreenFocused,
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selectedCompany: state.companySetupReducers.selectedCompany,
    }
}

export default connect(mapStateToProps, {
    setUser,
    setSelectedPageIndex,
    setMainCompanyScreenFocused
})(CompanyHome)
