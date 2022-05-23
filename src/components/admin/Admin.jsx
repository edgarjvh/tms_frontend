import React, { useState, useRef } from 'react';
import './Admin.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faPencilAlt, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Draggable from 'react-draggable';
import axios from 'axios';
import moment from 'moment';

import {
    setMainScreen,
    setScale,
    setUser
} from '../../actions/systemActions';

import {
    setPages,
    setSelectedPageIndex,
    setMainAdminScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setReportsScreenFocused,
    setSetupCompanyScreenFocused,
} from '../../actions/adminActions';

import {
    setSelectedPageIndex as setSelectedCompanyPageIndex,
    setMainCompanyScreenFocused
} from '../../actions/companyActions';

import {
    setAdminCustomers,
    setAdminSelectedCustomer,
    setAdminSelectedContact,
    setAdminSelectedNote,
    setAdminSelectedDirection,
    setAdminContactSearch,
    setAdminAutomaticEmailsTo,
    setAdminAutomaticEmailsCc,
    setAdminAutomaticEmailsBcc,
    setAdminShowingContactList,
    setAdminCustomerSearch,
    setAdminCustomerContacts,
    setAdminContactSearchCustomer,
    setAdminIsEditingContact,
    setAdminSelectedDocument,
    setAdminDocumentTags as setAdminSelectedDocumentTags,
    setAdminSelectedDocumentNote,
    setAdminCustomerOpenedPanels,

    setBillToCompanies,
    setSelectedBillToCompanyInfo,
    setBillToCompanySearch,
    setSelectedBillToCompanyContact,

    setShipperCompanies,
    setSelectedShipperCompanyInfo,
    setShipperCompanySearch,
    setSelectedShipperCompanyContact,

    setConsigneeCompanies,
    setSelectedConsigneeCompanyInfo,
    setConsigneeCompanySearch,
    setSelectedConsigneeCompanyContact,

    setLbSelectedBillToCompanyInfo,
    setLbSelectedBillToCompanyContact,
    setLbBillToCompanySearch,
    setLbSelectedShipperCompanyInfo,
    setLbSelectedShipperCompanyContact,
    setLbShipperCompanySearch,
    setLbSelectedConsigneeCompanyInfo,
    setLbSelectedConsigneeCompanyContact,
    setLbConsigneeCompanySearch,
    setInvoiceSelectedBillToCompanyInfo,
    setInvoiceSelectedBillToCompanyContact,
    setInvoiceSelectedBillToCompanyDocument,
    setInvoiceBillToCompanyDocumentTags as setInvoiceSelectedBillToCompanyDocumentTags,
    setInvoiceSelectedBillToCompanyDocumentNote,

    setCustomerBillToCompanies,
    setCustomerSelectedBillToCompanyInfo,
    setCustomerBillToCompanySearch,
    setCustomerSelectedBillToCompanyContact,

    setCustomerShipperCompanies,
    setCustomerSelectedShipperCompanyInfo,
    setCustomerShipperCompanySearch,
    setCustomerSelectedShipperCompanyContact,

    setCustomerConsigneeCompanies,
    setCustomerSelectedConsigneeCompanyInfo,
    setCustomerConsigneeCompanySearch,
    setCustomerSelectedConsigneeCompanyContact,
} from '../../actions/customersActions';

import {
    setAdminCarriers,
    setAdminSelectedCarrier,
    setAdminSelectedCarrierContact,
    setAdminSelectedCarrierNote,
    setAdminContactSearch as setAdminCarrierContactSearch,
    setAdminShowingCarrierContactList,
    setAdminCarrierSearch,
    setAdminCarrierContacts,
    setAdminContactSearchCarrier,
    setAdminIsEditingContact as setAdminIsEditingCarrierContact,
    setAdminSelectedCarrierDocument,
    setAdminDrivers,
    setAdminSelectedDriver,
    setAdminEquipments,
    setAdminInsuranceTypes,
    setAdminSelectedEquipment,
    setAdminSelectedInsuranceType,
    setAdminFactoringCompanySearch,
    setAdminFactoringCompanies,
    setAdminCarrierInsurances,
    setAdminSelectedInsurance,
    setAdminSelectedFactoringCompany,
    setAdminSelectedFactoringCompanyContact,
    setAdminCarrierOpenedPanels,
    setAdminEquipmentInformation,

    setSelectedDispatchCarrierInfoCarrier,
    setSelectedDispatchCarrierInfoContact,
    setSelectedDispatchCarrierInfoDriver,
    setSelectedDispatchCarrierInfoInsurance,
    setDispatchCarrierInfoCarrierSearch,
    setDispatchCarrierInfoCarriers,

    setSelectedLbCarrierInfoCarrier,
    setSelectedLbCarrierInfoContact,
    setSelectedLbCarrierInfoDriver,

    setSelectedInvoiceCarrierInfoCarrier,
    setSelectedInvoiceCarrierInfoContact,
    setSelectedInvoiceCarrierInfoDriver,
    setSelectedInvoiceCarrierInfoInsurance,
    setSelectedInvoiceCarrierInfoDocument,
    setInvoiceCarrierInfoDocumentTags as setSelectedInvoiceCarrierInfoDocumentTags,
    setSelectedInvoiceCarrierInfoDocumentNote,

    setDispatchCarrierInfoCarriersChanging,
    setDispatchCarrierInfoCarrierSearchChanging,

    setSelectedCustomerCarrierInfoCarrier,
    setSelectedCustomerCarrierInfoContact,
    setSelectedCustomerCarrierInfoDriver,
    setSelectedCustomerCarrierInfoInsurance,
    setSelectedCustomerCarrierInfoDocument,
    setCustomerCarrierInfoDocumentTags as setSelectedCustomerCarrierInfoDocumentTags,
    setSelectedCustomerCarrierInfoDocumentNote,

} from '../../actions/carriersActions';

import { Dispatch, Customers, Carriers } from './../company';
import { AdminHome, CompanySetup } from './';

function Admin(props) {
    const [chatOptionItems, setChatOptionItems] = useState([
        {
            id: 0,
            name: 'Open in a new tab'
        },
        {
            id: 1,
            name: 'Open in a panel'
        }
    ]);
    const [showChatOptions, setShowChatOptions] = useState(false);
    const refShowChatOptionsDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowChatOptions(false) } });
    const refChatOptionPopupItems = useRef([]);

    const [adminHomePanels, setAdminHomePanels] = useState([]);
    const [dispatchPanels, setDispatchPanels] = useState([]);
    const [customerPanels, setCustomerPanels] = useState([]);
    const [carrierPanels, setCarrierPanels] = useState([]);
    const [companySetupPanels, setCompanySetupPanels] = useState([]);

    const baseWidth = 95;
    const panelGap = 70;

    const containerCls = classnames({
        'main-admin-container': true,
        'is-showing': props.mainScreen === 'admin'
    })

    const userClick = () => {
        props.setMainScreen('company');
    }

    const homehBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin home') === -1) {
            await props.setPages([...curPages, 'admin home']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin home'));
        }

        props.setMainAdminScreenFocused(true);
    }

    const dispatchBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin dispatch') === -1) {
            await props.setPages([...curPages, 'admin dispatch']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin dispatch'));
        }

        props.setDispatchScreenFocused(true);
    }

    const customersBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin customer') === -1) {
            await props.setPages([...curPages, 'admin customer']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin customer'));
        }

        props.setCustomerScreenFocused(true);
    }

    const carriersBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin carrier') === -1) {
            await props.setPages([...curPages, 'admin carrier']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin carrier'));
        }

        props.setCarrierScreenFocused(true);
    }

    const companySetupBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('company setup') === -1) {
            await props.setPages([...curPages, 'company setup']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('company setup'));
        }

        props.setSetupCompanyScreenFocused(true);
    }

    const switchAppBtnClick = () => {
        props.setScale(props.scale === 1 ? 0.7 : 1);
    }

    const adminHomePanelTransition = useTransition(adminHomePanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (adminHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100%)`,
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0%)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100%)`,
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (adminHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const dispatchPanelTransition = useTransition(dispatchPanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (dispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100%)`,
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0%)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100%)`,
            }
        },
        update: panel => {
            if (panel === undefined) {
                // setCompanySetupPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (dispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const customerPanelTransition = useTransition(customerPanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (customerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100%)`,
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0%)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100%)`,
            }
        },
        update: panel => {
            if (panel === undefined) {
                // setCompanySetupPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (customerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const carrierPanelTransition = useTransition(carrierPanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (carrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100%)`,
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0%)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100%)`,
            }
        },
        update: panel => {
            if (panel === undefined) {
                // setCompanySetupPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (carrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const companySetupPanelTransition = useTransition(companySetupPanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (companySetupPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100%)`,
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0%)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100%)`,
            }
        },
        update: panel => {
            if (panel === undefined) {
                // setCompanySetupPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (companySetupPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const eventControl = (event, info, panelName, origin) => {
        if (event.type === 'mouseup') {
            if (info.x > 150) {
                closePanel(panelName, origin);
            }
        }
    }

    const openPanel = (panel, origin) => {
        if (origin === 'admin-home') {
            if (adminHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                setAdminHomePanels(adminHomePanels => [...adminHomePanels, panel]);
            }
        }

        if (origin === 'dispatch') {
            if (dispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                setDispatchPanels(dispatchPanels => [...dispatchPanels, panel]);
            }
        }

        if (origin === 'customer') {
            if (customerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                setCustomerPanels(customerPanels => [...customerPanels, panel]);
            }
        }

        if (origin === 'carrier') {
            if (carrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                setCarrierPanels(carrierPanels => [...carrierPanels, panel]);
            }
        }

        if (origin === 'company') {
            if (companySetupPanels.find(p => p.panelName === panel.panelName) === undefined) {
                setCompanySetupPanels(companySetupPanels => [...companySetupPanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'admin-home') {
            setAdminHomePanels(adminHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'dispatch') {
            setDispatchPanels(dispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'customer') {
            setCustomerPanels(customerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'carrier') {
            setCarrierPanels(carrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company') {
            setCompanySetupPanels(companySetupPanels.filter(panel => panel.panelName !== panelName));
        }
    }

    return (
        <div className={containerCls}>
            <div className="main-content">
                {
                    (props.user?.id || 0) > 0 &&
                    <div className="menu-bar">
                        <div className="section">
                            <div className="mochi-button" onClick={userClick} style={{
                                marginRight: 20
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Company</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="user-info" style={{
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                lineHeight: '1rem'
                            }}>
                                <div className="user-name" style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>{(props.user.type === 'employee' ? 'EM' : 'AG') + props.user.id.toString().padStart(4, '0')}</span>
                                    <span style={{ marginRight: 5, marginLeft: 5 }}>-</span>
                                    <span>{props.user?.first_name || ''} {props.user?.last_name || ''}</span>
                                </div>
                            </div>

                            <div className="mochi-button" onClick={() => {
                                if (window.confirm('Are you sure to log out?')) {
                                    axios.post(props.serverUrl + '/logout', null, {
                                        withCredentials: true
                                    }).then(() => {
                                        props.setUser({});
                                        props.setSelectedCompanyPageIndex(0);
                                        props.setMainCompanyScreenFocused(true);
                                        props.setMainScreen('company');
                                    }).catch(error => {
                                        props.setUser({});
                                        props.setSelectedCompanyPageIndex(0);
                                        props.setMainCompanyScreenFocused(true);
                                        props.setMainScreen('company');
                                    });
                                }
                            }} style={{
                                marginLeft: 10,
                                color: 'darkred'
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base" style={{
                                    color: 'red'
                                }}>Logout</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="section chat-video-buttons">
                            <div className="mochi-button" onClick={() => {
                                window.open('', '_blank').focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Chat</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button" onClick={() => {
                                window.open('', '_blank').focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Video</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="mochi-input-decorator">
                                <input type="search" placeholder="just type" id="txt-main-search" />
                            </div>
                        </div>
                        <div className="section">
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.mainAdminScreenFocused
                            })} onClick={homehBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Home</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.dispatchScreenFocused
                            })} onClick={dispatchBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Dispatch</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.customerScreenFocused
                            })} onClick={customersBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Customers</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.carrierScreenFocused
                            })} onClick={carriersBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Carriers</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                // 'screen-focused': props.loadBoardScreenFocused
                            })} onClick={() => { }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Reports</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.setupCompanyScreenFocused
                            })} onClick={companySetupBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Company Setup</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.scale !== 1
                            })} onClick={switchAppBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Card View</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>
                }

                <div className="screen-content">
                    <div className="pages-container" style={{
                        position: 'absolute',
                        display: 'flex',
                        width: `${props.pages.length * 100}%`,
                        overflowX: 'auto',
                        transform: `translateX(${((100 / props.pages.length) * -1) * (props.selectedPageIndex + 1)}%)`
                    }}>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'

                        }}>
                            {
                                adminHomePanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-home';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseDown={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseUp={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchEnd={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={index}
                                        >
                                            <animated.div className={`panel panel-${panel?.panelName || ''}`} key={index} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}
                                            >
                                                <div className="close-btn" title="Close" onClick={e => { e.stopPropagation(); closePanel(panel?.panelName, origin) }}><span className="fas fa-times"></span></div>

                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div><div className="side-title"><div>{panel?.component?.props?.title}</div></div>
                                                            {panel?.component}
                                                        </div>
                                                        :
                                                        panel?.component
                                                }
                                            </animated.div>
                                        </Draggable>
                                    )
                                })
                            }

                            <AdminHome />
                        </div>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'

                        }}>
                            {
                                dispatchPanelTransition((style, panel, item, index) => {
                                    const origin = 'dispatch';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseDown={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseUp={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchEnd={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={index}
                                        >
                                            <animated.div className={`panel panel-${panel?.panelName || ''}`} key={index} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}
                                            >
                                                <div className="close-btn" title="Close" onClick={e => { e.stopPropagation(); closePanel(panel?.panelName, origin) }}><span className="fas fa-times"></span></div>

                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div><div className="side-title"><div>{panel?.component?.props?.title}</div></div>
                                                            {panel?.component}
                                                        </div>
                                                        :
                                                        panel?.component
                                                }
                                            </animated.div>
                                        </Draggable>
                                    )
                                })
                            }

                            <Dispatch
                                pageName={'Dispatch Page'}
                                panelName={'dispatch'}
                                tabTimes={111000}
                                screenFocused={props.dispatchScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='dispatch'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px'
                        }}>
                            {
                                customerPanelTransition((style, panel, item, index) => {
                                    const origin = 'customer';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseDown={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseUp={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchEnd={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={index}
                                        >
                                            <animated.div className={`panel panel-${panel?.panelName || ''}`} key={index} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}>
                                                <div className="close-btn" title="Close" onClick={e => { e.stopPropagation(); closePanel(panel?.panelName, origin) }}><span className="fas fa-times"></span></div>

                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div><div className="side-title"><div>{panel?.component?.props?.title}</div></div>
                                                            {panel?.component}
                                                        </div>
                                                        :
                                                        panel?.component
                                                }
                                            </animated.div>
                                        </Draggable>
                                    )
                                })
                            }

                            <Customers
                                pageName={'Customer'}
                                title={'Customer'}
                                panelName={'customer'}
                                tabTimes={112000}
                                screenFocused={props.customerScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='customer'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px'
                        }}>
                            {
                                carrierPanelTransition((style, panel, item, index) => {
                                    const origin = 'carrier';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseDown={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseUp={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchEnd={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={index}
                                        >
                                            <animated.div className={`panel panel-${panel?.panelName || ''}`} key={index} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}>
                                                <div className="close-btn" title="Close" onClick={e => { e.stopPropagation(); closePanel(panel?.panelName, origin) }}><span className="fas fa-times"></span></div>

                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div><div className="side-title"><div>{panel?.component?.props?.title}</div></div>
                                                            {panel?.component}
                                                        </div>
                                                        :
                                                        panel?.component
                                                }
                                            </animated.div>
                                        </Draggable>
                                    )
                                })
                            }

                            <Carriers
                                pageName={'Carrier'}
                                title={'Carrier'}
                                panelName={'carrier'}
                                tabTimes={113000}
                                screenFocused={props.carrierScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='carrier'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px'
                        }}>

                        </div>

                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px'
                        }}>
                            {
                                companySetupPanelTransition((style, panel, item, index) => {
                                    const origin = 'company';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseDown={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onMouseUp={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchStart={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            onTouchEnd={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={index}
                                        >
                                            <animated.div className={`panel panel-${panel?.panelName || ''}`} key={index} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}>
                                                <div className="close-btn" title="Close" onClick={e => { e.stopPropagation(); closePanel(panel?.panelName, origin) }}><span className="fas fa-times"></span></div>

                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div><div className="side-title"><div>{panel?.component?.props?.title}</div></div>
                                                            {panel?.component}
                                                        </div>
                                                        :
                                                        panel?.component
                                                }
                                            </animated.div>
                                        </Draggable>
                                    )
                                })
                            }

                            <CompanySetup
                                pageName={'Company Setup'}
                                title={'Company Setup'}
                                panelName={'company-setup'}
                                tabTimes={114000}
                                screenFocused={props.setupCompanyScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='company'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
        scale: state.systemReducers.scale,
        mainScreen: state.systemReducers.mainScreen,
        pages: state.adminReducers.pages,
        selectedPageIndex: state.adminReducers.selectedPageIndex,
        mainAdminScreenFocused: state.adminReducers.mainAdminScreenFocused,
        dispatchScreenFocused: state.adminReducers.dispatchScreenFocused,
        customerScreenFocused: state.adminReducers.customerScreenFocused,
        carrierScreenFocused: state.adminReducers.carrierScreenFocused,
        reportsScreenFocused: state.adminReducers.reportsScreenFocused,
        setupCompanyScreenFocused: state.adminReducers.setupCompanyScreenFocused,

        //CUSTOMER
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        customers: state.customerReducers.adminCustomers,
        selectedCustomer: state.customerReducers.adminSelectedCustomer,
        customerSearch: state.customerReducers.adminCustomerSearch,
        contacts: state.customerReducers.adminContacts,
        selectedContact: state.customerReducers.adminSelectedContact,
        contactSearch: state.customerReducers.adminContactSearch,
        showingContactList: state.customerReducers.adminShowingContactList,
        automaticEmailsTo: state.customerReducers.adminAutomaticEmailsTo,
        automaticEmailsCc: state.customerReducers.adminAutomaticEmailsCc,
        automaticEmailsBcc: state.customerReducers.adminAutomaticEmailsBcc,
        selectedNote: state.customerReducers.adminSelectedNote,
        selectedDirection: state.customerReducers.adminSelectedDirection,
        selectedDocument: state.customerReducers.adminSelectedDocument,
        selectedDocumentTags: state.customerReducers.adminDocumentTags,
        selectedDocumentNote: state.customerReducers.adminSelectedDocumentNote,
        isEditingContact: state.customerReducers.adminIsEditingContact,
        contactSearchCustomer: state.customerReducers.adminContactSearchCustomer,

        //CARRIER
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        carriers: state.carrierReducers.adminCarriers,
        carrierContacts: state.carrierReducers.adminContacts,
        selectedCarrier: state.carrierReducers.adminSelectedCarrier,
        selectedCarrierContact: state.carrierReducers.adminSelectedContact,
        selectedCarrierNote: state.carrierReducers.adminSelectedNote,
        selectedCarrierDirection: state.carrierReducers.adminSelectedDirection,
        carrierContactSearch: state.carrierReducers.adminContactSearch,
        showingCarrierContactList: state.carrierReducers.adminShowingContactList,
        carrierSearch: state.carrierReducers.adminCarrierSearch,
        selectedCarrierDocument: state.carrierReducers.adminSelectedDocument,
        drivers: state.carrierReducers.adminDrivers,
        selectedDriver: state.carrierReducers.adminSelectedDriver,
        equipments: state.carrierReducers.adminEquipments,
        insuranceTypes: state.carrierReducers.adminInsuranceTypes,
        selectedEquipment: state.carrierReducers.adminSelectedEquipment,
        selectedInsuranceType: state.carrierReducers.adminSelectedInsuranceType,
        factoringCompanySearch: state.carrierReducers.adminFactoringCompanySearch,
        factoringCompanies: state.carrierReducers.adminFactoringCompanies,
        carrierInsurances: state.carrierReducers.adminCarrierInsurances,
        selectedInsurance: state.carrierReducers.adminSelectedInsurance,
        selectedFactoringCompany: state.carrierReducers.adminSelectedFactoringCompany,
        selectedFactoringCompanyContact: state.carrierReducers.adminSelectedFactoringCompanyContact,
        equipmentInformation: state.carrierReducers.adminEquipmentInformation,
    }
}

export default connect(mapStateToProps, {
    setMainScreen,
    setUser,
    setPages,
    setSelectedPageIndex,
    setScale,
    setMainAdminScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setReportsScreenFocused,
    setSetupCompanyScreenFocused,
    setSelectedCompanyPageIndex,
    setMainCompanyScreenFocused,

    // CUSTOMER
    setAdminCustomers,
    setAdminSelectedCustomer,
    setAdminSelectedContact,
    setAdminSelectedNote,
    setAdminSelectedDirection,
    setAdminContactSearch,
    setAdminAutomaticEmailsTo,
    setAdminAutomaticEmailsCc,
    setAdminAutomaticEmailsBcc,
    setAdminShowingContactList,
    setAdminCustomerSearch,
    setAdminCustomerContacts,
    setAdminContactSearchCustomer,
    setAdminIsEditingContact,
    setAdminSelectedDocument,
    setAdminSelectedDocumentTags,
    setAdminSelectedDocumentNote,
    setAdminCustomerOpenedPanels,

    setCustomerBillToCompanies,
    setCustomerSelectedBillToCompanyInfo,
    setCustomerBillToCompanySearch,
    setCustomerSelectedBillToCompanyContact,

    setCustomerShipperCompanies,
    setCustomerSelectedShipperCompanyInfo,
    setCustomerShipperCompanySearch,
    setCustomerSelectedShipperCompanyContact,

    setCustomerConsigneeCompanies,
    setCustomerSelectedConsigneeCompanyInfo,
    setCustomerConsigneeCompanySearch,
    setCustomerSelectedConsigneeCompanyContact,

    //CARRIER
    setAdminCarriers,
    setAdminSelectedCarrier,
    setAdminSelectedCarrierContact,
    setAdminSelectedCarrierNote,
    setAdminCarrierContactSearch,
    setAdminShowingCarrierContactList,
    setAdminCarrierSearch,
    setAdminCarrierContacts,
    setAdminContactSearchCarrier,
    setAdminIsEditingCarrierContact,
    setAdminSelectedCarrierDocument,
    setAdminDrivers,
    setAdminSelectedDriver,
    setAdminEquipments,
    setAdminInsuranceTypes,
    setAdminSelectedEquipment,
    setAdminSelectedInsuranceType,
    setAdminFactoringCompanySearch,
    setAdminFactoringCompanies,
    setAdminCarrierInsurances,
    setAdminSelectedInsurance,
    setAdminSelectedFactoringCompany,
    setAdminSelectedFactoringCompanyContact,
    setAdminCarrierOpenedPanels,
    setAdminEquipmentInformation,

    setDispatchCarrierInfoCarriersChanging,
    setDispatchCarrierInfoCarrierSearchChanging,

    setSelectedCustomerCarrierInfoCarrier,
    setSelectedCustomerCarrierInfoContact,
    setSelectedCustomerCarrierInfoDriver,
    setSelectedCustomerCarrierInfoInsurance,
    setSelectedCustomerCarrierInfoDocument,
    setSelectedCustomerCarrierInfoDocumentTags,
    setSelectedCustomerCarrierInfoDocumentNote,
})(Admin)