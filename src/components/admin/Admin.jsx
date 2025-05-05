/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import './Admin.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import moment from 'moment';
import { useDetectClickOutside } from "react-detect-click-outside";
import Draggable from 'react-draggable';
import axios from 'axios';

import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook';

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
    setInvoiceScreenFocused,
    setSetupCompanyScreenFocused,
    setAdminHomePanels
} from '../../actions/adminActions';

import {
    setCompanySetupOpenedPanels,
    setAdminCompanySetupPanels,
} from './../../actions/companySetupActions';

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

    setAdminCustomerPanels
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
    setAdminCarrierPanels
} from '../../actions/carriersActions';

import {
    setAdminInvoicePanels
} from '../../actions/invoiceActions';

import {
    setAdminReportPanels
} from '../../actions/reportsActions';

import {
    setAdminDispatchPanels
} from '../../actions/dispatchActions';

import { setAdminSuperOrigin } from '../../actions/adminActions';

import { Dispatch, Customers, Carriers, Reports, Invoice } from './../company';
import { AdminHome, CompanySetup } from './';
import PersonalContacts from '../company/panels/personal-contacts/PersonalContacts';

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
    const [reportsPanels, setReportsPanels] = useState([]);
    const [companySetupPanels, setCompanySetupPanels] = useState([]);
    const [invoicePanels, setInvoicePanels] = useState([]);

    const refAdminCustomerCode = useRef(null);
    const refAdminCarrierCode = useRef(null);
    const refAdminDispatchOrderNumber = useRef(null);
    const refAdminInvoiceOrderNumber = useRef(null);

    const refAdminHomePanels = useRef([]);
    const refAdminCustomerPanels = useRef([]);
    const refAdminCarrierPanels = useRef([]);
    const refAdminDispatchPanels = useRef([]);
    const refAdminCompanySetupPanels = useRef([]);
    const refAdminInvoicePanels = useRef([]);
    const refAdminReportsPanels = useRef([]);

    const baseWidth = 95;
    const panelGap = 70;

    const containerCls = classnames({
        'main-admin-container': true,
        'is-showing': props.mainScreen === 'admin'
    })

    const { enableScope, disableScope } = useHotkeysContext();

    const userClick = () => {
        props.setMainScreen('company');
        enableScope('company');
        disableScope('admin');
    }

    useHotkeys('alt+u', () => {
        userClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+h', () => {
        homeBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+c', () => {
        customersBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+a', () => {
        carriersBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+d', () => {
        dispatchBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+s', () => {
        companySetupBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+i', () => {
        invoiceBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+r', () => {
        reportsBtnClick();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    useHotkeys('alt+o', () => {
        openPersonalContactsPanel();
    }, {
        enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
        scopes: ['admin']
    })

    const homeBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin home') === -1) {
            await props.setPages([...curPages, 'admin home']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin home'));
        }

        props.setMainAdminScreenFocused(true);
        props.setAdminSuperOrigin('admin-home');
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
        props.setAdminSuperOrigin('admin-dispatch');
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
        props.setAdminSuperOrigin('admin-customer');
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
        props.setAdminSuperOrigin('admin-carrier');
    }

    const invoiceBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin invoice') === -1) {
            await props.setPages([...curPages, 'admin invoice']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin invoice'));
        }

        props.setInvoiceScreenFocused(true);
        props.setAdminSuperOrigin('admin-invoice');
    }

    const reportsBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('admin reports') === -1) {
            await props.setPages([...curPages, 'admin reports']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('admin reports'));
        }

        props.setReportsScreenFocused(true);
        props.setAdminSuperOrigin('admin-report');
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
        props.setAdminSuperOrigin('admin-company-setup');
    }

    const adminHomePanelTransition = useTransition(props.adminHomePanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const dispatchPanelTransition = useTransition(props.adminDispatchPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminDispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminDispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const customerPanelTransition = useTransition(props.adminCustomerPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminCustomerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminCustomerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const carrierPanelTransition = useTransition(props.adminCarrierPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminCarrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminCarrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const reportsPanelTransition = useTransition(props.adminReportPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminReportPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminReportPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const invoicePanelTransition = useTransition(props.adminInvoicePanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminInvoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminInvoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const companySetupPanelTransition = useTransition(props.adminCompanySetupPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * ((props.adminCompanySetupPanels || []).findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        enter: panel => {
            return {
                display: panel === undefined ? 'none' : 'block',
                right: `calc(0% + ${panel?.right ?? 0}px)`,
            }
        },
        leave: panel => {
            return {
                right: `calc(-100% + 0px)`,
                config: { duration: 300 }
            }
        },
        update: panel => {
            if (panel === undefined) {

            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.adminCompanySetupPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const eventControl = (event, info, panelName, origin) => {
        if (event.type === 'mouseup') {
            switch (origin) {
                case 'admin-home':
                    props.setAdminHomePanels(props.adminHomePanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-carrier':
                    props.setAdminCarrierPanels(props.adminCarrierPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-company-setup':
                    props.setAdminCompanySetupPanels(props.adminCompanySetupPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-customer':
                    props.setAdminCustomerPanels(props.adminCustomerPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-dispatch':
                    props.setAdminDispatchPanels(props.adminDispatchPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-invoice':
                    props.setAdminInvoicePanels(props.adminInvoicePanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'admin-repost':
                    props.setAdminReportPanels(props.adminReportPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                default:
                    break;
            }
        }
    }

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

    const panelClasses = classnames({
        'panel': true,
        'pro': true
    })

    const screenClasses = classnames({
        'screen-content': true,
        'pro': true
    })

    const openPersonalContactsPanel = () => {
        let panel = {
            panelName: `${props.panelName}-personal-contacts`,
            component: <PersonalContacts
                title='Personal Contacts'
                tabTimes={moment().unix() + props.tabTimes}
                panelName={`${props.panelName}-personal-contacts`}
                origin={props.adminSuperOrigin}
                owner='user'
                closingCallback={() => {
                    closePanel(`${props.panelName}-personal-contacts`, props.adminSuperOrigin);
                }}
                componentId={moment().format('x')}
            />
        }

        openPanel(panel, props.adminSuperOrigin);
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
                                    <span>{props.user.user_code.code}</span>
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
                                window.open('https://mm.et3.dev', '_blank').focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Chat</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button" onClick={() => {
                                window.open('https://meet.et3.dev/', '_blank').focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Video</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button" onClick={() => {
                                openPersonalContactsPanel();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Contacts</div>
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
                            })} onClick={homeBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Home</div>
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
                                'screen-focused': props.setupCompanyScreenFocused
                            })} onClick={companySetupBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Company Setup</div>
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
                                'screen-focused': props.dispatchScreenFocused
                            })} onClick={dispatchBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Dispatch</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.invoiceScreenFocused
                            })} onClick={invoiceBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Invoice</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.reportsScreenFocused
                            })} onClick={reportsBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Reports</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>
                }

                <div className={screenClasses}>
                    <div className="pages-container" style={{
                        position: 'absolute',
                        display: 'flex',
                        width: `${props.pages.length * 100}%`,
                        overflowX: 'auto',
                        transform: `translateX(${((100 / props.pages.length) * -1) * (props.selectedPageIndex + 1)}%)`
                    }}>
                        {/**
                         * ADMIN HOME
                         */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                adminHomePanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-home';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminHomePanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}
                                            >
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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

                        {/**
                         * ADMIN CARRIERS
                         */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                carrierPanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-carrier';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminCarrierPanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}>
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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
                                panelName={'admin-carrier'}
                                tabTimes={113000}
                                screenFocused={props.carrierScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='admin-carrier'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refCarrierCode={refAdminCarrierCode}
                            />
                        </div>

                        {/**
                         * ADMIN COMPANY SETUP
                         * */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                companySetupPanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-company-setup';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminCompanySetupPanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}>
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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
                                origin='admin-company-setup'
                                openPanel={openPanel}
                                closePanel={(panelName, origin) => {
                                    closePanel(panelName, origin);
                                }}
                            />
                        </div>

                        {/**
                         * ADMIN CUSTOMERS
                         * */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                customerPanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-customer';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminCustomerPanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}>
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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
                                panelName={'admin-customer'}
                                tabTimes={112000}
                                screenFocused={props.customerScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='admin-customer'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refCustomerCode={refAdminCustomerCode}
                            />
                        </div>

                        {/**
                         * ADMIN DISPATCH
                         */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                dispatchPanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-dispatch';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminDispatchPanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}
                                            >
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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
                                panelName={'admin-dispatch'}
                                tabTimes={111000}
                                screenFocused={props.dispatchScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='admin-dispatch'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refOrderNumber={refAdminDispatchOrderNumber}
                            />
                        </div>

                        {/**
                         * COMPANY INVOICE
                         */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                invoicePanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-invoice';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminInvoicePanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}
                                            >
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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

                            <Invoice
                                pageName={'Invoice'}
                                title={'Invoice'}
                                panelName={'invoice'}
                                tabTimes={5000}
                                screenFocused={props.invoiceScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={true}
                                origin='admin-invoice'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refOrderNumber={refAdminInvoiceOrderNumber}
                            />
                        </div>

                        {/**
                         * ADMIN REPORTS
                         * */}
                        <div style={{
                            width: `${100 / props.pages.length}%`,
                            height: '100%',
                            transform: `scale(${props.scale})`,
                            transition: 'all ease 0.7s',
                            boxShadow: props.scale === 1 ? '0 0 3px 5px transparent' : '0 0 10px 5px rgba(0,0,0,0.5)',
                            borderRadius: props.scale === 1 ? 0 : '20px',
                            overflow: 'hidden'
                        }}
                            tabIndex={-1}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    if (e.target.type === undefined) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        >
                            {
                                reportsPanelTransition((style, panel, item, index) => {
                                    const origin = 'admin-report';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses} key={panel.panelName} style={{
                                                ...style,
                                                maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`
                                            }}
                                                tabIndex={-1}
                                                ref={(el) => (refAdminReportsPanels.current[index] = el)}
                                                onKeyDown={(e) => {
                                                    let key = e.keyCode || e.which;

                                                    if (key === 27) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        closePanel(panel?.panelName, origin);
                                                    }
                                                }}
                                            >
                                                {
                                                    panel?.component?.props?.isOnPanel
                                                        ?
                                                        <div className="panel-content">
                                                            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                                                            <div className="title">{panel?.component?.props?.title}</div>
                                                            <div className="side-title"><div>{panel?.component?.props?.title}</div></div>
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

                            <Reports
                                pageName={'Reports'}
                                title={'Reports'}
                                panelName={'admin-reports'}
                                tabTimes={5000}
                                screenFocused={props.reportsScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={false}
                                origin='admin-report'
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

        companySetupOpenedPanels: state.companySetupReducers.companySetupOpenedPanels,

        mainAdminScreenFocused: state.adminReducers.mainAdminScreenFocused,
        dispatchScreenFocused: state.adminReducers.dispatchScreenFocused,
        customerScreenFocused: state.adminReducers.customerScreenFocused,
        carrierScreenFocused: state.adminReducers.carrierScreenFocused,
        reportsScreenFocused: state.adminReducers.reportsScreenFocused,
        invoiceScreenFocused: state.adminReducers.invoiceScreenFocused,
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

        adminHomePanels: state.adminReducers.adminHomePanels,
        adminCarrierPanels: state.carrierReducers.adminCarrierPanels,
        adminCompanySetupPanels: state.companySetupReducers.adminCompanySetupPanels,
        adminCustomerPanels: state.customerReducers.adminCustomerPanels,
        adminDispatchPanels: state.dispatchReducers.adminDispatchPanels,
        adminInvoicePanels: state.invoiceReducers.adminInvoicePanels,
        adminReportPanels: state.reportReducers.adminReportPanels,

        adminSuperOrigin: state.adminReducers.adminSuperOrigin,
    }
}

export default connect(mapStateToProps, {
    setMainScreen,
    setUser,
    setPages,
    setSelectedPageIndex,
    setScale,

    setCompanySetupOpenedPanels,

    setMainAdminScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setReportsScreenFocused,
    setSetupCompanyScreenFocused,
    setSelectedCompanyPageIndex,
    setMainCompanyScreenFocused,
    setInvoiceScreenFocused,

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

    setAdminHomePanels,
    setAdminCarrierPanels,
    setAdminCompanySetupPanels,
    setAdminCustomerPanels,
    setAdminDispatchPanels,
    setAdminInvoicePanels,
    setAdminReportPanels,

    setAdminSuperOrigin
})(Admin)