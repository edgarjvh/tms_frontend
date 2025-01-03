/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CustomerSearch.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { connect } from 'react-redux';
import {
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

} from './../../../../actions';

const CustomerSearch = (props) => {
    const refCustomerSearchContainer = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const rowDoubleClick = (e, c) => {
        props.callback(c.id);
        // closePanel(props.panelName, props.origin);
    }

    useEffect(() => {
        setIsLoading(true);
        let url = '/customerSearch';

        switch (props.suborigin) {
            case 'carrier':
                url = '/carrierSearch';
                break;

            case 'factoring-company':
                url = '/factoringCompanySearch';
                break;

            case 'division':
                url = '/divisionSearch';
                break;
            default:
                url = '/customerSearch';
                break;
        }

        axios.post(props.serverUrl + url, { search: props.customerSearch }).then(async res => {
            if (res.data.result === 'OK') {
                let { customers, carriers, factoring_companies, divisions, agents, owner_operators, drivers } = res.data;
                setCustomers(customers || carriers || factoring_companies || divisions || agents || owner_operators || drivers || []);
            }

            setIsLoading(false);
        }).catch(e => {
            console.log('error searching for customers', e);
            setIsLoading(false);
        });

        refCustomerSearchContainer.current.focus({
            preventScroll: true
        })
    }, []);

    const openPanel = (panel, origin) => {
        if (origin === 'admin-home') {
            if (props.adminHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminHomePanels([...props.adminHomePanels, panel]);
            }
        }

        if (origin === 'admin-carrier') {
            if (props.adminCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCarrierPanels([...props.adminCarrierPanels, panel]);
            }
        }

        if (origin === 'admin-company-setup') {
            if (props.adminCompanySetupPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCompanySetupPanels([...props.adminCompanySetupPanels, panel]);
            }
        }

        if (origin === 'admin-customer') {
            if (props.adminCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCustomerPanels([...props.adminCustomerPanels, panel]);
            }
        }

        if (origin === 'admin-dispatch') {
            if (props.adminDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminDispatchPanels([...props.adminDispatchPanels, panel]);
            }
        }

        if (origin === 'admin-invoice') {
            if (props.adminInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminInvoicePanels([...props.adminInvoicePanels, panel]);
            }
        }

        if (origin === 'admin-report') {
            if (props.adminReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminReportPanels([...props.adminReportPanels, panel]);
            }
        }

        if (origin === 'company-home') {
            if (props.companyHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyHomePanels([...props.companyHomePanels, panel]);
            }
        }

        if (origin === 'company-carrier') {
            if (props.companyCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCarrierPanels([...props.companyCarrierPanels, panel]);
            }
        }

        if (origin === 'company-customer') {
            if (props.companyCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCustomerPanels([...props.companyCustomerPanels, panel]);
            }
        }

        if (origin === 'company-dispatch') {
            if (props.companyDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyDispatchPanels([...props.companyDispatchPanels, panel]);
            }
        }

        if (origin === 'company-invoice') {
            if (props.companyInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyInvoicePanels([...props.companyInvoicePanels, panel]);
            }
        }

        if (origin === 'company-load-board') {
            if (props.companyLoadBoardPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyLoadBoardPanels([...props.companyLoadBoardPanels, panel]);
            }
        }

        if (origin === 'company-report') {
            if (props.companyReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyReportPanels([...props.companyReportPanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'admin-home') {
            props.setAdminHomePanels(props.adminHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-carrier') {
            props.setAdminCarrierPanels(props.adminCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-company-setup') {
            props.setAdminCompanySetupPanels(props.adminCompanySetupPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-customer') {
            props.setAdminCustomerPanels(props.adminCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-dispatch') {
            props.setAdminDispatchPanels(props.adminDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-invoice') {
            props.setAdminInvoicePanels(props.adminInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-report') {
            props.setAdminReportPanels(props.adminReportPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-home') {
            props.setCompanyHomePanels(props.companyHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-carrier') {
            props.setCompanyCarrierPanels(props.companyCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-customer') {
            props.setCompanyCustomerPanels(props.companyCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-dispatch') {
            props.setCompanyDispatchPanels(props.companyDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-invoice') {
            props.setCompanyInvoicePanels(props.companyInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-load-board') {
            props.setCompanyLoadBoardPanels(props.companyLoadBoardPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-report') {
            props.setCompanyReportPanels(props.companyReportPanels.filter(panel => panel.panelName !== panelName));
        }
    }

    return (
        <div className="panel-content" tabIndex={0} ref={refCustomerSearchContainer} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                props.closingCallback();
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="input-box-container" style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                {
                    (props.customerSearch || []).map((item, index) => {
                        if (item.field !== 'User Code' && item.field !== 'Origin') {
                            if (item.data.trim() !== '') {
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.7rem',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        padding: '2px 10px',
                                        borderRadius: '10px',
                                        marginRight: '10px',
                                        cursor: 'default'
                                    }} title={item}>
                                        <span style={{ fontWeight: 'bold', marginRight: 5 }}>{item.field}: </span>
                                        <span style={{ whiteSpace: 'nowrap' }}>{item.data}</span>
                                    </div>
                                )
                            }
                        }

                        return false;
                    })
                }
            </div>

            <div className="tbl">
                <div className="thead">
                    <div className="trow">
                        <div className="tcol code">Code</div>
                        <div className="tcol name">Company Name</div>
                        <div className="tcol address1">Address 1</div>
                        <div className="tcol address2">Address 2</div>
                        <div className="tcol city">City</div>
                        <div className="tcol state">State</div>
                        <div className="tcol zip">Postal Code</div>
                        <div className="tcol contact-name">Contact Name</div>
                        <div className="tcol contact-phone">Contact Phone</div>
                        <div className="tcol contact-phone-ext">Ext</div>
                    </div>
                </div>
                <div className="tbody">
                    <div className="tbody-wrapper">
                        {
                            customers.length > 0
                                ? customers.map((c, i) => {
                                    return (
                                        <div key={i} className="trow" onDoubleClick={(e) => { rowDoubleClick(e, c) }}>
                                            <div className="tcol code" style={{
                                                textTransform: 'uppercase',
                                                userSelect: 'none'
                                            }}>{c.code + (c.code_number === 0 ? '' : c.code_number)}</div>
                                            <div className="tcol name" style={{
                                                textTransform: 'capitalize',
                                                userSelect: 'none'
                                            }}>{c.name}</div>
                                            <div className="tcol address1" style={{
                                                textTransform: 'capitalize',
                                                userSelect: 'none'
                                            }}>{c.address1}</div>
                                            <div className="tcol address2" style={{
                                                textTransform: 'capitalize',
                                                userSelect: 'none'
                                            }}>{c.address2}</div>
                                            <div className="tcol city" style={{
                                                textTransform: 'capitalize',
                                                userSelect: 'none'
                                            }}>{c.city}</div>
                                            <div className="tcol state" style={{
                                                textTransform: 'uppercase',
                                                userSelect: 'none'
                                            }}>{c.state}</div>
                                            <div className="tcol zip" style={{
                                                textTransform: 'uppercase',
                                                userSelect: 'none'
                                            }}>{c.zip}</div>
                                            <div className="tcol contact-name" style={{
                                                textTransform: 'capitalize',
                                                userSelect: 'none'
                                            }}>{
                                                    (c.contacts || []).find(x => (x?.is_primary || 0) === 1)
                                                        ? (c.contacts.find(x => x.is_primary === 1)?.first_name || '') + ' ' + (c.contacts.find(x => x.is_primary === 1)?.last_name || '')
                                                        : (c.contacts || []).find(x => (x?.pivot?.is_primary || 0) === 1)
                                                            ? (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.first_name || '') + ' ' + (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.last_name || '')
                                                            : c?.contact_name || ''
                                                }</div>
                                            <div className="tcol contact-phone">{
                                                (c.contacts || []).find(x => (x?.is_primary || 0) === 1)
                                                    ? (c.contacts.find(x => (x?.is_primary || 0) === 1)?.primary_phone || 'work') === 'work'
                                                        ? c.contacts.find(x => (x?.is_primary || 0) === 1)?.phone_work || ''
                                                        : (c.contacts.find(x => (x?.is_primary || 0) === 1)?.primary_phone || 'work') === 'fax'
                                                            ? c.contacts.find(x => (x?.is_primary || 0) === 1)?.phone_work_fax || ''
                                                            : (c.contacts.find(x => (x?.is_primary || 0) === 1)?.primary_phone || 'work') === 'mobile'
                                                                ? c.contacts.find(x => (x?.is_primary || 0) === 1)?.phone_mobile || ''
                                                                : (c.contacts.find(x => (x?.is_primary || 0) === 1)?.primary_phone || 'work') === 'direct'
                                                                    ? c.contacts.find(x => (x?.is_primary || 0) === 1)?.phone_direct || ''
                                                                    : (c.contacts.find(x => (x?.is_primary || 0) === 1)?.primary_phone || 'work') === 'other'
                                                                        ? c.contacts.find(x => (x?.is_primary || 0) === 1)?.phone_other || ''
                                                                        : ''
                                                    : (c.contacts || []).find(x => (x?.pivot?.is_primary || 0) === 1)
                                                        ? (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.primary_phone || 'work') === 'work'
                                                            ? c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.phone_work || ''
                                                            : (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.primary_phone || 'work') === 'fax'
                                                                ? c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.phone_work_fax || ''
                                                                : (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.primary_phone || 'work') === 'mobile'
                                                                    ? c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.phone_mobile || ''
                                                                    : (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.primary_phone || 'work') === 'direct'
                                                                        ? c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.phone_direct || ''
                                                                        : (c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.primary_phone || 'work') === 'other'
                                                                            ? c.contacts.find(x => (x?.pivot?.is_primary || 0) === 1)?.phone_other || ''
                                                                            : ''
                                                        : c?.contact_phone || ''
                                            }</div>

                                        </div>
                                    )
                                })
                                : <div className="trow"><div className="tcol empty">Nothing to show!</div></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,

        adminHomePanels: state.adminReducers.adminHomePanels,
        companyHomePanels: state.companyReducers.companyHomePanels,
        adminCompanySetupPanels: state.companySetupReducers.adminCompanySetupPanels,
        companyCompanySetupPanels: state.companySetupReducers.companyCompanySetupPanels,
        adminCarrierPanels: state.carrierReducers.adminCarrierPanels,
        companyCarrierPanels: state.carrierReducers.companyCarrierPanels,
        adminCustomerPanels: state.customerReducers.adminCustomerPanels,
        companyCustomerPanels: state.customerReducers.companyCustomerPanels,
        adminDispatchPanels: state.dispatchReducers.adminDispatchPanels,
        companyDispatchPanels: state.dispatchReducers.companyDispatchPanels,
        adminInvoicePanels: state.invoiceReducers.adminInvoicePanels,
        companyInvoicePanels: state.invoiceReducers.companyInvoicePanels,
        adminLoadBoardPanels: state.loadBoardReducers.adminLoadBoardPanels,
        companyLoadBoardPanels: state.loadBoardReducers.companyLoadBoardPanels,
        adminReportPanels: state.reportReducers.adminReportPanels,
        companyReportPanels: state.reportReducers.companyReportPanels,

    }
}

export default connect(mapStateToProps, {
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

})(CustomerSearch)