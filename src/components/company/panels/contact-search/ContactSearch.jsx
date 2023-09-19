import React, { useState, useEffect, useRef } from 'react';
import './ContactSearch.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Contacts } from './../../panels';
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

let timer = 0;
let delay = 300;
let prevent = false;

const ContactSearch = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState([]);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const handleClick = (e, c) => {
        timer = setTimeout(function () {
            if (!prevent) {
                let ownerType = '';

                switch (props.suborigin) {
                    case 'carrier':
                        ownerType = 'Carrier';
                        break;
                    case 'factoring-company':
                        ownerType = 'FactoringCompany';
                        break;
                    case 'division':
                        ownerType = 'Division';
                        break;
                    case 'employee':
                        ownerType = 'Employee';
                        break;
                    case 'agent':
                        ownerType = 'Agent';
                        break;
                    case 'owner-operator':
                        ownerType = 'OwnerOperator';
                        break;
                    default:
                        ownerType = '';
                        break;
                }

                let panel = {
                    panelName: `${props.panelName}-contacts`,
                    component: <Contacts
                        title='Contacts'
                        tabTimes={22000 + props.tabTimes}
                        panelName={`${props.panelName}-contacts`}
                        savingContactUrl={`/save${ownerType}Contact`}
                        deletingContactUrl={`/delete${ownerType}Contact`}
                        uploadAvatarUrl={`/upload${ownerType}Avatar`}
                        removeAvatarUrl={`/remove${ownerType}Avatar`}
                        permissionName={props.suborigin.replace('-', ' ') + ' contacts'}
                        suborigin={props.suborigin}
                        origin={props.origin}
                        owner={props.owner}

                        contactSearchCustomer={{
                            ...(props.suborigin === 'customer'
                                ? c.customer
                                : props.suborigin === 'carrier'
                                    ? c.carrier
                                    : props.suborigin === 'factoring-company'
                                        ? c.factoring_company
                                        : props.suborigin === 'employee'
                                            ? c.employee
                                            : props.suborigin === 'agent'
                                                ? c.agent
                                                : props.suborigin === 'division'
                                                    ? c.division
                                                    : props.suborigin === 'owner-operator'
                                                        ? c.owner_operator
                                                        : c.customer),
                            selectedContact: (props.suborigin === 'customer'
                                ? ((c.customer.contacts || []).find(contact => contact.id === c.id) || {})
                                : props.suborigin === 'carrier'
                                    ? ((c.carrier.contacts || []).find(contact => contact.id === c.id) || {})
                                    : props.suborigin === 'factoring-company'
                                        ? ((c.factoring_company.contacts || []).find(contact => contact.id === c.id) || {})
                                        : props.suborigin === 'employee'
                                            ? ((c.employee.contacts || []).find(contact => contact.id === c.id) || {})
                                            : props.suborigin === 'agent'
                                                ? ((c.agent.contacts || []).find(contact => contact.id === c.id) || {})
                                                : props.suborigin === 'division'
                                                    ? ((c.division.contacts || []).find(contact => contact.id === c.id) || {})
                                                    : props.suborigin === 'owner-operator'
                                                        ? ((c.owner_operator.contacts || []).find(contact => contact.id === c.id) || {})
                                                        : ((c.customer.contacts || []).find(contact => contact.id === c.id) || {}))
                        }}
                    />
                }

                openPanel(panel, props.origin);
            }
            prevent = false;
        }, delay);
    }

    const handleDoubleClick = (e, c) => {
        clearTimeout(timer);
        prevent = true;

        props.callback(c);
        // closePanel(props.panelName, props.origin);
    }

    useEffect(() => {
        let url = '/customerContactsSearch';

        switch (props.suborigin) {
            case 'carrier':
                url = '/carrierContactsSearch';
                break;

            case 'factoring-company':
                url = '/factoringCompanyContactsSearch';
                break;

            case 'employee':
                url = '/employeeContactsSearch';
                break;

            case 'agent':
                url = '/agentContactsSearch';
                break;

            case 'division':
                url = '/divisionContactsSearch';
                break;

            case 'owner-operator':
                url = '/ownerOperatorContactsSearch';
                break;

            default:
                url = '/customerContactsSearch';
                break;
        }

        setIsLoading(true);
        axios.post(props.serverUrl + url, props.contactSearch).then(async res => {
            if (res.data.result === 'OK') {
                setContacts(res.data.contacts);
            }
            setIsLoading(false);
        }).catch(e => {
            console.log('error searching contacts', e);
            setIsLoading(false);
        });
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
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="input-box-container" style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                {
                    (props.contactSearch.filters || []).map((item, index) => {

                        if (index > 0) {
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
                        <div className="tcol first-name">First Name</div>
                        <div className="tcol last-name">Last Name</div>
                        <div className="tcol address1">Address 1</div>
                        <div className="tcol address2">Address 2</div>
                        <div className="tcol city">City</div>
                        <div className="tcol state">State</div>
                        <div className="tcol phone-work">Phone Work</div>
                        <div className="tcol email-work">E-mail Work</div>
                    </div>
                </div>
                <div className="tbody">
                    <div className="tbody-wrapper">
                        {
                            contacts.length > 0
                                ? contacts.map((c, i) => {
                                    return (
                                        <div className="trow" onClick={(e) => {
                                            handleClick(e, c)
                                        }} onDoubleClick={(e) => {
                                            handleDoubleClick(e, c)
                                        }} key={i}>
                                            <div className="tcol first-name" style={{
                                                textTransform: 'capitalize'
                                            }}>{c.first_name}</div>
                                            <div className="tcol last-name" style={{
                                                textTransform: 'capitalize'
                                            }}>{c.last_name}</div>
                                            <div className="tcol address1" style={{
                                                textTransform: 'capitalize'
                                            }}>{c.address1}</div>
                                            <div className="tcol address2" style={{
                                                textTransform: 'capitalize'
                                            }}>{c.address2}</div>
                                            <div className="tcol city" style={{
                                                textTransform: 'capitalize'
                                            }}>{c.city}</div>
                                            <div className="tcol state" style={{
                                                textTransform: 'uppercase'
                                            }}>{c.state}</div>
                                            <div className="tcol phone-work">{c.phone_work}</div>
                                            <div className="tcol email-work" style={{
                                                textTransform: 'lowercase'
                                            }}>{c.email_work}</div>
                                        </div>
                                    )
                                })
                                : <div className="trow">
                                    <div className="tcol empty">Nothing to show!</div>
                                </div>
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

})(ContactSearch)