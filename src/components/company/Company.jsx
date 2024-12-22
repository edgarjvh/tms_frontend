import React, { useState, useEffect, useRef } from 'react';
import './Company.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
// import { Transition, Spring, animated, config } from 'react-spring';
import { useTransition, animated, config } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faPencilAlt, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Draggable from 'react-draggable';
import axios from 'axios';

import {
    setMainScreen,
    setScale,
    setUser,
    setTestingSwitch
} from '../../actions/systemActions';

import {
    setPages,
    setCompanyOpenedPanels,
    setSelectedPageIndex,
    setMainCompanyScreenFocused,
    setCustomerTScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setLoadBoardScreenFocused,
    setInvoiceScreenFocused,
    setReportsScreenFocused,
    setCompanyHomePanels,
    setCustomersTPanels,
} from '../../actions/companyActions';

import {
    setAdminOpenedPanels,
} from '../../actions/adminActions';

import {
    setDispatchOpenedPanels,
    setSelectedOrder,
    setLbSelectedOrder,
    setOrderNumber,
    setTripNumber,
    setDivision,
    setLoadType,
    setTemplate,

    setIsShowingShipperSecondPage,
    setShipperBolNumber,
    setShipperPoNumber,
    setShipperRefNumber,

    setIsShowingConsigneeSecondPage,

    setShowingChangeCarrier,

    setDispatchEvent,
    setDispatchEventLocation,
    setDispatchEventNotes,
    setDispatchEventDate,
    setDispatchEventTime,

    setSelectedNoteForCarrier,
    setSelectedInternalNote,

    setSelectedOrderDocument,

    setNewCarrier,
    setIsSavingOrder,

    setMileageLoaderVisible,

    setCustomerSelectedOrder,
    setCustomerOrderNumber,
    setCustomerTripNumber,
    setCustomerDivision,
    setCustomerLoadType,
    setCustomerTemplate,
    setCompanyDispatchPanels
} from '../../actions/dispatchActions';

import {
    setCustomers,
    setSelectedCustomer,
    setSelectedContact,
    setSelectedNote,
    setSelectedDirection,
    setContactSearch,
    setAutomaticEmailsTo,
    setAutomaticEmailsCc,
    setAutomaticEmailsBcc,
    setShowingContactList,
    setCustomerSearch,
    setCustomerContacts,
    setContactSearchCustomer,
    setIsEditingContact,
    setSelectedDocument,
    setDocumentTags as setSelectedDocumentTags,
    setSelectedDocumentNote,
    setCustomerOpenedPanels,
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
    setCompanyCustomerPanels
} from '../../actions/customersActions';

import {
    setCarriers,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedCarrierNote,
    setContactSearch as setCarrierContactSearch,
    setShowingCarrierContactList,
    setCarrierSearch,
    setCarrierContacts,
    setContactSearchCarrier,
    setIsEditingContact as setIsEditingCarrierContact,
    setSelectedCarrierDocument,
    setDrivers,
    setSelectedDriver,
    setEquipments,
    setInsuranceTypes,
    setSelectedEquipment,
    setSelectedInsuranceType,
    setFactoringCompanySearch,
    setFactoringCompanies,
    setCarrierInsurances,
    setSelectedInsurance,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact,
    setCarrierOpenedPanels,
    setAdminCarrierOpenedPanels,
    setEquipmentInformation,

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
    setCompanyCarrierPanels
} from '../../actions/carriersActions';

import {
    setLoadBoardOpenedPanels,
    setCompanyLoadBoardPanels
} from '../../actions/loadBoardActions';

import {
    setInvoiceOpenedPanels,
    setInvoiceSelectedOrder,
    setInvoiceOrderNumber,
    setInvoiceTripNumber,
    setInvoiceInternalNotes,
    setInvoiceSelectedInternalNote,
    setLbInvoiceSelectedOrder,
    setLbInvoiceOrderNumber,
    setLbInvoiceTripNumber,

    setSelectedOrderInvoiceCustomerDocument,
    setSelectedOrderInvoiceCustomerDocumentNote,
    setSelectedOrderInvoiceCustomerDocumentTags,
    setSelectedOrderInvoiceCarrierDocument,
    setSelectedOrderInvoiceCarrierDocumentNote,
    setSelectedOrderInvoiceCarrierDocumentTags,
    setSelectedOrderInvoiceInternalNote,
    setSelectedOrderInvoiceBillingNote,
    setCompanyInvoicePanels
} from '../../actions/invoiceActions';

import {
    setCompanyReportPanels
} from '../../actions/reportsActions';

import { CompanyHome, Dispatch, Customers, Carriers, LoadBoard, Invoice, Reports, CustomersT } from './../company';
import moment from 'moment';

function Company(props) {
    const baseWidth = 95;
    const panelGap = 70;

    const [homePanels, setHomePanels] = useState([]);
    const [dispatchPanels, setDispatchPanels] = useState([]);
    const [customerPanels, setCustomerPanels] = useState([]);
    const [carrierPanels, setCarrierPanels] = useState([]);
    const [loadBoardPanels, setLoadBoardPanels] = useState([]);
    const [invoicePanels, setInvoicePanels] = useState([]);
    const [reportsPanels, setReportsPanels] = useState([]);

    const refCompanyCustomerCode = useRef(null);
    const refCompanyCarrierCode = useRef(null);
    const refCompanyDispatchOrderNumber = useRef(null);
    const refCompanyInvoiceOrderNumber = useRef(null);

    const refCompanyHomePanels = useRef([]);
    const refCompanyCustomerPanels = useRef([]);
    const refCompanyCarrierPanels = useRef([]);
    const refCompanyDispatchPanels = useRef([]);
    const refCompanyLoadBoardPanels = useRef([]);
    const refCompanyInvoicePanels = useRef([]);
    const refCompanyReportsPanels = useRef([]);

    const [tCount, setTCount] = useState(0);

    const containerCls = classnames({
        'main-company-container': true,
        'is-showing': props.mainScreen === 'company'
    });

    const userClick = () => {
        props.setMainScreen('admin');
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            setTCount(1);
        } else if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_PRO_SERVER_URL !== 'https://tms.et3.dev/api') {
            setTCount(1);
        }
    }, []);

    const homeBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('home') === -1) {
            await props.setPages([...curPages, 'home']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('home'));
        }

        props.setMainCompanyScreenFocused(true);
    }

    const testBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('customers-t') === -1) {
            await props.setPages([...curPages, 'customers-t']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('customers-t'));
        }

        props.setCustomerTScreenFocused(true);
    }

    const dispatchBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('dispatch') === -1) {
            await props.setPages([...curPages, 'dispatch']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('dispatch'));
        }

        props.setDispatchScreenFocused(true);
    }

    const customersBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('customer') === -1) {
            await props.setPages([...curPages, 'customer']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('customer'));
        }

        props.setCustomerScreenFocused(true);
    }

    const carriersBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('carrier') === -1) {
            await props.setPages([...curPages, 'carrier']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('carrier'));
        }

        props.setCarrierScreenFocused(true);
    }

    const loadBoardBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('load board') === -1) {
            await props.setPages([...curPages, 'load board']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('load board'));
        }

        props.setLoadBoardScreenFocused(true);
    }

    const invoiceBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('invoice') === -1) {
            await props.setPages([...curPages, 'invoice']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('invoice'));
        }

        props.setInvoiceScreenFocused(true);
    }

    const reportsBtnClick = async () => {
        let curPages = props.pages;

        if (curPages.indexOf('reports') === -1) {
            await props.setPages([...curPages, 'reports']);
            await props.setSelectedPageIndex(curPages.length);

        } else {
            await props.setSelectedPageIndex(props.pages.indexOf('reports'));
        }

        props.setReportsScreenFocused(true);
    }

    const homePanelTransition = useTransition(props.companyHomePanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setHomePanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyHomePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const dispatchPanelTransition = useTransition(props.companyDispatchPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyDispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setDispatchPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyDispatchPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const customerPanelTransition = useTransition(props.companyCustomerPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyCustomerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setCustomerPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyCustomerPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const carrierPanelTransition = useTransition(props.companyCarrierPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyCarrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setCarrierPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyCarrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const loadBoardPanelTransition = useTransition(props.companyLoadBoardPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyLoadBoardPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setLoadBoardPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyLoadBoardPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const invoicePanelTransition = useTransition(props.companyInvoicePanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyInvoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setInvoicePanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyInvoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const reportsPanelTransition = useTransition(props.companyReportPanels, {
        keys: panel => panel.panelName,
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyReportPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setInvoicePanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (props.companyReportPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0% + ${panel?.right ?? 0}px)`,
                config: { duration: 0 }
            }
        },
    })

    const eventControl = (event, info, panelName, origin) => {
        if (event.type === 'mouseup') {
            switch (origin) {
                case 'company-home':
                    props.setCompanyHomePanels(props.companyHomePanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-carrier':
                    props.setCompanyCarrierPanels(props.companyCarrierPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-customer':
                    props.setCompanyCustomerPanels(props.companyCustomerPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-dispatch':
                    props.setCompanyDispatchPanels(props.companyDispatchPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-invoice':
                    props.setCompanyInvoicePanels(props.companyInvoicePanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-load-board':
                    props.setCompanyLoadBoardPanels(props.companyLoadBoardPanels.map(item => {
                        if (item.panelName === panelName) {
                            item.right = (item.right) + (info.x * -1);
                        }
                        return item;
                    }))
                    break;
                case 'company-repost':
                    props.setCompanyReportPanels(props.companyReportPanels.map(item => {
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
        if (origin === 'company-home') {
            let currentCompanyHomePanels = [...props.companyHomePanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyHomePanels(props.companyHomePanels.filter(panel => panel.panelName !== panelName));

            let companyHomePanelsLength = currentCompanyHomePanels.length;

            if (companyHomePanelsLength > 0) {
                let lastPanelName = currentCompanyHomePanels[companyHomePanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyHomePanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                // Focus the main input when is available
            }
        }

        if (origin === 'company-carrier') {
            let currentCompanyCarrierPanels = [...props.companyCarrierPanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyCarrierPanels(currentCompanyCarrierPanels);

            let companyCarrierPanelsLength = currentCompanyCarrierPanels.length;

            if (companyCarrierPanelsLength > 0) {
                let lastPanelName = currentCompanyCarrierPanels[companyCarrierPanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyCarrierPanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                if (refCompanyCarrierCode?.current) {
                    refCompanyCarrierCode.current.focus();
                }
            }
        }

        if (origin === 'company-customer') {
            let currentCompanyCustomerPanels = [...props.companyCustomerPanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyCustomerPanels(currentCompanyCustomerPanels);

            let companyCustomerPanelsLength = currentCompanyCustomerPanels.length;

            if (companyCustomerPanelsLength > 0) {
                let lastPanelName = currentCompanyCustomerPanels[companyCustomerPanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyCustomerPanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                if (refCompanyCustomerCode?.current) {
                    refCompanyCustomerCode.current.focus();
                }
            }
        }

        if (origin === 'company-dispatch') {
            let currentCompanyDispatchPanels = [...props.companyDispatchPanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyDispatchPanels(currentCompanyDispatchPanels);

            let companyDispatchPanelsLength = currentCompanyDispatchPanels.length;

            if (companyDispatchPanelsLength > 0) {
                let lastPanelName = currentCompanyDispatchPanels[companyDispatchPanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyDispatchPanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                if (refCompanyDispatchOrderNumber?.current) {
                    refCompanyDispatchOrderNumber.current.focus();
                }
            }
        }

        if (origin === 'company-invoice') {
            let currentCompanyInvoicePanels = [...props.companyInvoicePanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyInvoicePanels(currentCompanyInvoicePanels);

            let companyInvoicePanelsLength = currentCompanyInvoicePanels.length;

            if (companyInvoicePanelsLength > 0) {
                let lastPanelName = currentCompanyInvoicePanels[companyInvoicePanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyInvoicePanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                if (refCompanyInvoiceOrderNumber?.current) {
                    refCompanyInvoiceOrderNumber.current.focus();
                }
            }
        }

        if (origin === 'company-load-board') {
            let currentCompanyLoadBoardPanels = [...props.companyLoadBoardPanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyLoadBoardPanels(props.companyLoadBoardPanels.filter(panel => panel.panelName !== panelName));

            let companyLoadBoardPanelsLength = currentCompanyLoadBoardPanels.length;

            if (companyLoadBoardPanelsLength > 0) {
                let lastPanelName = currentCompanyLoadBoardPanels[companyLoadBoardPanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyLoadBoardPanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                // Focus the main input when is available
            }
        }

        if (origin === 'company-report') {
            let currentCompanyReportPanels = [...props.companyReportPanels.filter(panel => panel.panelName !== panelName)];
            props.setCompanyReportPanels(props.companyReportPanels.filter(panel => panel.panelName !== panelName));

            let companyReportPanelsLength = currentCompanyReportPanels.length;

            if (companyReportPanelsLength > 0) {
                let lastPanelName = currentCompanyReportPanels[companyReportPanelsLength - 1]?.panelName || '';
                let refEl = (refCompanyReportsPanels.current || []).find(x => x?.id === `${origin}-panel-${lastPanelName}`);

                if (refEl) {
                    refEl.focus();
                }
            } else {
                // Focus the main input when is available
            }
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

    return (
        <div className={containerCls}>
            <div className="main-content">
                {
                    (props.user?.id || 0) > 0 &&
                    <div className="menu-bar">
                        <div className="section">
                            {
                                (props.user?.user_code?.is_admin || 0) === 1 &&
                                <div className="mochi-button" onClick={userClick} style={{
                                    marginRight: 20
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Admin</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            }

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
                                        props.setSelectedPageIndex(0);
                                        props.setMainCompanyScreenFocused(true);
                                        props.setMainScreen('company');
                                    }).catch(error => {
                                        props.setUser({});
                                        props.setSelectedPageIndex(0);
                                        props.setMainCompanyScreenFocused(true);
                                        props.setMainScreen('company');
                                    });
                                }
                            }} style={{
                                marginLeft: 10,
                                color: 'darkred'
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base"
                                    style={{
                                        color: 'red'
                                    }}
                                >Logout
                                </div>
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
                        </div>
                        <div className="section">
                            <div className="mochi-input-decorator">
                                <input type="search" placeholder="just type" id="txt-main-search" />
                            </div>
                        </div>
                        {/* <div className='section' style={{ marginLeft: 5 }}>
                            <div className="mochi-button" onClick={testBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Test</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div> */}
                        <div className="section">
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.mainCompanyScreenFocused,
                                'testing': false
                            })} onClick={homeBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Home</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.carrierScreenFocused,
                                'testing': false
                            })} onClick={carriersBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Carriers</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.customerScreenFocused,
                                'testing': false
                            })} onClick={customersBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Customers</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.dispatchScreenFocused,
                                'testing': false
                            })} onClick={dispatchBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Dispatch</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.invoiceScreenFocused,
                                'testing': false
                            })} onClick={invoiceBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Invoice</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.loadBoardScreenFocused,
                                'testing': false
                            })} onClick={loadBoardBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Load Board</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'screen-focused': props.reportsScreenFocused,
                                'testing': false
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
                        overflowX: 'hidden',
                        transform: `translateX(${((100 / props.pages.length) * -1) * (props.selectedPageIndex + 1)}%)`
                    }}>
                        {/**
                         * COMPANY HOME
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
                                homePanelTransition((style, panel, item, index) => {
                                    const origin = 'company-home';

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
                                                ref={(el) => (refCompanyHomePanels.current[index] = el)}
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

                            <CompanyHome
                                pageName={'Company Home Page'}
                                panelName={'company-home'}
                                tabTimes={500}
                                screenFocused={props.mainCompanyScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                origin='company-home'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>

                        {/**
                         * COMPANY CARRIERS
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
                                    const origin = 'company-carrier';

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
                                                ref={(el) => (refCompanyCarrierPanels.current[index] = el)}
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

                            <Carriers
                                pageName={'Carrier'}
                                title={'Carrier'}
                                panelName={'carrier'}
                                tabTimes={3000}
                                screenFocused={props.carrierScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                origin='company-carrier'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refCarrierCode={refCompanyCarrierCode}
                            />
                        </div>

                        {/**
                         * COMPANY CUSTOMERS
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
                                    const origin = 'company-customer';

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
                                                ref={(el) => (refCompanyCustomerPanels.current[index] = el)}
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

                            <Customers
                                pageName={'Customer'}
                                title={'Customer'}
                                panelName={'customer'}
                                tabTimes={2000}
                                screenFocused={props.customerScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={false}
                                origin='company-customer'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refCustomerCode={refCompanyCustomerCode}
                            />
                        </div>

                        {/**
                         * COMPANY DISPATCH
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
                                    const origin = 'company-dispatch';

                                    return (
                                        <Draggable
                                            axis="x"
                                            handle={'.drag-handler'}
                                            onStop={(e, i) => eventControl(e, i, panel.panelName, origin)}
                                            position={{ x: 0, y: 0 }}
                                            key={panel.panelName}
                                        >
                                            <animated.div className={panelClasses}
                                                id={`${origin}-panel-${panel?.panelName || ''}`}
                                                key={panel.panelName} style={{
                                                    ...style,
                                                    maxWidth: panel.fixedWidthPercentage ? `${panel.fixedWidthPercentage}%` : `100%`,
                                                }}
                                                tabIndex={-1}
                                                ref={(el) => (refCompanyDispatchPanels.current[index] = el)}
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
                                panelName={'dispatch'}
                                tabTimes={1000}
                                screenFocused={props.dispatchScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={false}
                                origin='company-dispatch'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refOrderNumber={refCompanyDispatchOrderNumber}
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
                                    const origin = 'company-invoice';

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
                                                ref={(el) => (refCompanyInvoicePanels.current[index] = el)}
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
                                origin='company-invoice'
                                openPanel={openPanel}
                                closePanel={closePanel}
                                refOrderNumber={refCompanyInvoiceOrderNumber}
                            />
                        </div>

                        {/**
                         * COMPANY LOAD BOARD
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
                                loadBoardPanelTransition((style, panel, item, index) => {
                                    const origin = 'company-load-board';

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
                                                ref={(el) => (refCompanyLoadBoardPanels.current[index] = el)}
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

                            <LoadBoard
                                pageName={'Load Board'}
                                title={'Load Board'}
                                panelName={'load-board'}
                                tabTimes={4000}
                                screenFocused={props.loadBoardScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={false}
                                origin='company-load-board'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>

                        {/**
                         * COMPANY REPORTS
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
                                    const origin = 'company-report';

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
                                                ref={(el) => (refCompanyReportsPanels.current[index] = el)}
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
                                                            <div className="side-title"> <div>{panel?.component?.props?.title}</div></div>
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
                                panelName={'reports'}
                                tabTimes={5000}
                                screenFocused={props.reportsScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                isAdmin={false}
                                origin='company-report'
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
        testingSwitch: state.systemReducers.testingSwitch,
        pages: state.companyReducers.pages,
        selectedPageIndex: state.companyReducers.selectedPageIndex,
        mainCompanyScreenFocused: state.companyReducers.mainCompanyScreenFocused,
        customerTScreenFocused: state.companyReducers.customerTScreenFocused,
        dispatchScreenFocused: state.companyReducers.dispatchScreenFocused,
        customerScreenFocused: state.companyReducers.customerScreenFocused,
        carrierScreenFocused: state.companyReducers.carrierScreenFocused,
        loadBoardScreenFocused: state.companyReducers.loadBoardScreenFocused,
        invoiceScreenFocused: state.companyReducers.invoiceScreenFocused,
        reportsScreenFocused: state.companyReducers.reportsScreenFocused,

        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,

        //DISPATCH
        selected_order: state.dispatchReducers.selected_order,
        order_number: state.dispatchReducers.order_number,
        trip_number: state.dispatchReducers.trip_number,
        division: state.dispatchReducers.division,
        load_type: state.dispatchReducers.load_type,
        template: state.dispatchReducers.template,

        selectedBillToCompanyInfo: state.customerReducers.selectedBillToCompanyInfo,
        selectedBillToCompanyContact: state.customerReducers.selectedBillToCompanyContact,
        billToCompanySearch: state.customerReducers.billToCompanySearch,

        selectedShipperCompanyInfo: state.customerReducers.selectedShipperCompanyInfo,
        selectedShipperCompanyContact: state.customerReducers.selectedShipperCompanyContact,
        shipperCompanySearch: state.customerReducers.shipperCompanySearch,
        shipperBolNumber: state.dispatchReducers.shipperBolNumber,
        shipperPoNumber: state.dispatchReducers.shipperPoNumber,
        shipperRefNumber: state.dispatchReducers.shipperRefNumber,

        selectedConsigneeCompanyInfo: state.customerReducers.selectedConsigneeCompanyInfo,
        selectedConsigneeCompanyContact: state.customerReducers.selectedConsigneeCompanyContact,
        consigneeCompanySearch: state.customerReducers.consigneeCompanySearch,

        dispatchEvent: state.dispatchReducers.dispatchEvent,
        dispatchEventLocation: state.dispatchReducers.dispatchEventLocation,
        dispatchEventNotes: state.dispatchReducers.dispatchEventNotes,
        dispatchEventDate: state.dispatchReducers.dispatchEventDate,
        dispatchEventTime: state.dispatchReducers.dispatchEventTime,
        dispatchEvents: state.dispatchReducers.dispatchEvents,

        selectedNoteForCarrier: state.dispatchReducers.selectedNoteForCarrier,
        selectedInternalNote: state.dispatchReducers.selectedInternalNote,
        isShowingShipperSecondPage: state.dispatchReducers.isShowingShipperSecondPage,
        isShowingConsigneeSecondPage: state.dispatchReducers.isShowingConsigneeSecondPage,

        selectedDispatchCarrierInfoCarrier: state.carrierReducers.selectedDispatchCarrierInfoCarrier,
        selectedDispatchCarrierInfoContact: state.carrierReducers.selectedDispatchCarrierInfoContact,
        selectedDispatchCarrierInfoDriver: state.carrierReducers.selectedDispatchCarrierInfoDriver,
        selectedDispatchCarrierInfoInsurance: state.carrierReducers.selectedDispatchCarrierInfoInsurance,

        mileageLoaderVisible: state.dispatchReducers.mileageLoaderVisible,
        showingChangeCarrier: state.dispatchReducers.showingChangeCarrier,

        newCarrier: state.dispatchReducers.newCarrier,
        isSavingOrder: state.dispatchReducers.isSavingOrder,

        //CUSTOMER
        customerScreenFocused: state.companyReducers.customerScreenFocused,
        customers: state.customerReducers.customers,
        selectedCustomer: state.customerReducers.selectedCustomer,
        customerSearch: state.customerReducers.customerSearch,
        contacts: state.customerReducers.contacts,
        selectedContact: state.customerReducers.selectedContact,
        contactSearch: state.customerReducers.contactSearch,
        showingContactList: state.customerReducers.showingContactList,
        automaticEmailsTo: state.customerReducers.automaticEmailsTo,
        automaticEmailsCc: state.customerReducers.automaticEmailsCc,
        automaticEmailsBcc: state.customerReducers.automaticEmailsBcc,
        selectedNote: state.customerReducers.selectedNote,
        selectedDirection: state.customerReducers.selectedDirection,
        selectedDocument: state.customerReducers.selectedDocument,
        selectedDocumentTags: state.customerReducers.documentTags,
        selectedDocumentNote: state.customerReducers.selectedDocumentNote,
        isEditingContact: state.customerReducers.isEditingContact,
        contactSearchCustomer: state.customerReducers.contactSearchCustomer,

        //CARRIER
        carrierScreenFocused: state.companyReducers.carrierScreenFocused,
        carriers: state.carrierReducers.carriers,
        carrierContacts: state.carrierReducers.contacts,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedCarrierNote: state.carrierReducers.selectedNote,
        selectedCarrierDirection: state.carrierReducers.selectedDirection,
        carrierContactSearch: state.carrierReducers.contactSearch,
        showingCarrierContactList: state.carrierReducers.showingContactList,
        carrierSearch: state.carrierReducers.carrierSearch,
        selectedCarrierDocument: state.carrierReducers.selectedDocument,
        drivers: state.carrierReducers.drivers,
        selectedDriver: state.carrierReducers.selectedDriver,
        equipments: state.carrierReducers.equipments,
        insuranceTypes: state.carrierReducers.insuranceTypes,
        selectedEquipment: state.carrierReducers.selectedEquipment,
        selectedInsuranceType: state.carrierReducers.selectedInsuranceType,
        factoringCompanySearch: state.carrierReducers.factoringCompanySearch,
        factoringCompanies: state.carrierReducers.factoringCompanies,
        carrierInsurances: state.carrierReducers.carrierInsurances,
        selectedInsurance: state.carrierReducers.selectedInsurance,
        selectedFactoringCompany: state.carrierReducers.selectedFactoringCompany,
        selectedFactoringCompanyContact: state.carrierReducers.selectedFactoringCompanyContact,
        equipmentInformation: state.carrierReducers.equipmentInformation,

        //LOAD BOARD
        lb_selected_order: state.dispatchReducers.lb_selected_order,
        selectedLbBillToCompanyInfo: state.customerReducers.selectedLbBillToCompanyInfo,
        selectedLbBillToCompanyContact: state.customerReducers.selectedLbBillToCompanyContact,
        lbBillToCompanySearch: state.customerReducers.lbBillToCompanySearch,
        selectedLbShipperCompanyInfo: state.customerReducers.selectedLbShipperCompanyInfo,
        selectedLbShipperCompanyContact: state.customerReducers.selectedLbShipperCompanyContact,
        lbShipperCompanySearch: state.customerReducers.lbShipperCompanySearch,
        selectedLbConsigneeCompanyInfo: state.customerReducers.selectedLbConsigneeCompanyInfo,
        selectedLbConsigneeCompanyContact: state.customerReducers.selectedLbConsigneeCompanyContact,
        lbConsigneeCompanySearch: state.customerReducers.lbConsigneeCompanySearch,
        selectedLbCarrierInfoCarrier: state.carrierReducers.selectedLbCarrierInfoCarrier,
        selectedLbCarrierInfoContact: state.carrierReducers.selectedLbCarrierInfoContact,
        selectedLbCarrierInfoDriver: state.carrierReducers.selectedLbCarrierInfoDriver,

        //INVOICE
        invoiceInternalNotes: state.invoiceReducers.internalNotes,
        selectedInvoiceInternalNote: state.invoiceReducers.selectedInternalNote,
        invoice_selected_order: state.invoiceReducers.selected_order,
        invoice_order_number: state.invoiceReducers.order_number,
        invoice_trip_number: state.invoiceReducers.trip_number,

        selectedOrderInvoiceCustomerDocument: state.invoiceReducers.selectedOrderInvoiceCustomerDocument,
        selectedOrderInvoiceCustomerDocumentNote: state.invoiceReducers.selectedOrderInvoiceCustomerDocumentNote,
        selectedOrderInvoiceCustomerDocumentTags: state.invoiceReducers.selectedOrderInvoiceCustomerDocumentTags,
        selectedOrderInvoiceCarrierDocument: state.invoiceReducers.selectedOrderInvoiceCarrierDocument,
        selectedOrderInvoiceCarrierDocumentNote: state.invoiceReducers.selectedOrderInvoiceCarrierDocumentNote,
        selectedOrderInvoiceCarrierDocumentTags: state.invoiceReducers.selectedOrderInvoiceCarrierDocumentTags,
        selectedOrderInvoiceInternalNote: state.invoiceReducers.selectedOrderInvoiceInternalNote,
        selectedOrderInvoiceBillingNote: state.invoiceReducers.selectedOrderInvoiceBillingNote,

        selectedInvoiceBillToCompanyInfo: state.customerReducers.selectedInvoiceBillToCompanyInfo,
        selectedInvoiceBillToCompanyContact: state.customerReducers.selectedInvoiceBillToCompanyContact,
        selectedInvoiceBillToCompanyDocument: state.customerReducers.selectedInvoiceBillToCompanyDocument,
        selectedInvoiceBillToCompanyDocumentTags: state.customerReducers.invoiceBillToCompanyDocumentTags,
        selectedInvoiceBillToCompanyDocumentNote: state.customerReducers.selectedInvoiceBillToCompanyDocumentNote,
        selectedInvoiceCarrierInfoCarrier: state.carrierReducers.selectedInvoiceCarrierInfoCarrier,
        selectedInvoiceCarrierInfoContact: state.carrierReducers.selectedInvoiceCarrierInfoContact,
        selectedInvoiceCarrierInfoDriver: state.carrierReducers.selectedInvoiceCarrierInfoDriver,
        selectedInvoiceCarrierInfoInsurance: state.carrierReducers.selectedInvoiceCarrierInfoInsurance,
        selectedInvoiceCarrierInfoDocument: state.carrierReducers.selectedInvoiceCarrierInfoDocument,
        selectedInvoiceCarrierInfoDocumentTags: state.carrierReducers.invoiceCarrierInfoDocumentTags,
        selectedInvoiceCarrierInfoDocumentNote: state.carrierReducers.selectedInvoiceCarrierInfoDocumentNote,

        companyHomePanels: state.companyReducers.companyHomePanels,
        customersTPanels: state.companyReducers.customersTPanels,
        companyCarrierPanels: state.carrierReducers.companyCarrierPanels,
        companyCustomerPanels: state.customerReducers.companyCustomerPanels,
        companyDispatchPanels: state.dispatchReducers.companyDispatchPanels,
        companyInvoicePanels: state.invoiceReducers.companyInvoicePanels,
        companyLoadBoardPanels: state.loadBoardReducers.companyLoadBoardPanels,
        companyReportPanels: state.reportReducers.companyReportPanels
    }
}

export default connect(mapStateToProps, {
    setMainScreen,
    setUser,
    setPages,
    setSelectedPageIndex,
    setScale,
    setMainCompanyScreenFocused,
    setCustomerTScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setLoadBoardScreenFocused,
    setInvoiceScreenFocused,
    setReportsScreenFocused,
    setCompanyOpenedPanels,
    setAdminOpenedPanels,

    setTestingSwitch,

    //DISPATCH
    setDispatchOpenedPanels,
    setSelectedOrder,
    setOrderNumber,
    setTripNumber,
    setDivision,
    setLoadType,
    setTemplate,

    setBillToCompanies,
    setSelectedBillToCompanyInfo,
    setBillToCompanySearch,
    setSelectedBillToCompanyContact,

    setShipperCompanies,
    setSelectedShipperCompanyInfo,
    setShipperCompanySearch,
    setSelectedShipperCompanyContact,
    setIsShowingShipperSecondPage,
    setShipperBolNumber,
    setShipperPoNumber,
    setShipperRefNumber,

    setConsigneeCompanies,
    setSelectedConsigneeCompanyInfo,
    setConsigneeCompanySearch,
    setSelectedConsigneeCompanyContact,
    setIsShowingConsigneeSecondPage,

    setSelectedDispatchCarrierInfoCarrier,
    setSelectedDispatchCarrierInfoContact,
    setSelectedDispatchCarrierInfoDriver,
    setSelectedDispatchCarrierInfoInsurance,
    setDispatchCarrierInfoCarrierSearch,
    setDispatchCarrierInfoCarriers,
    setShowingChangeCarrier,

    setDispatchEvent,
    setDispatchEventLocation,
    setDispatchEventNotes,
    setDispatchEventDate,
    setDispatchEventTime,

    setSelectedNoteForCarrier,
    setSelectedInternalNote,
    setSelectedOrderDocument,

    setSelectedOrderInvoiceCustomerDocument,
    setSelectedOrderInvoiceCustomerDocumentNote,
    setSelectedOrderInvoiceCustomerDocumentTags,
    setSelectedOrderInvoiceCarrierDocument,
    setSelectedOrderInvoiceCarrierDocumentNote,
    setSelectedOrderInvoiceCarrierDocumentTags,
    setSelectedOrderInvoiceInternalNote,
    setSelectedOrderInvoiceBillingNote,

    setNewCarrier,
    setIsSavingOrder,

    setMileageLoaderVisible,

    setCustomerSelectedOrder,
    setCustomerOrderNumber,
    setCustomerTripNumber,
    setCustomerDivision,
    setCustomerLoadType,
    setCustomerTemplate,

    // CUSTOMER
    setCustomerOpenedPanels,
    setAdminCustomerOpenedPanels,
    setCustomers,
    setSelectedCustomer,
    setCustomerSearch,
    setCustomerContacts,
    setSelectedContact,
    setContactSearch,
    setIsEditingContact,
    setShowingContactList,
    setContactSearchCustomer,
    setAutomaticEmailsTo,
    setAutomaticEmailsCc,
    setAutomaticEmailsBcc,
    setSelectedNote,
    setSelectedDirection,
    setSelectedDocument,
    setSelectedDocumentTags,
    setSelectedDocumentNote,

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
    setCarriers,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedCarrierNote,
    setCarrierContactSearch,
    setShowingCarrierContactList,
    setCarrierSearch,
    setCarrierContacts,
    setContactSearchCarrier,
    setIsEditingCarrierContact,
    setSelectedCarrierDocument,
    setDrivers,
    setSelectedDriver,
    setEquipments,
    setInsuranceTypes,
    setSelectedEquipment,
    setSelectedInsuranceType,
    setFactoringCompanySearch,
    setFactoringCompanies,
    setCarrierInsurances,
    setSelectedInsurance,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact,
    setCarrierOpenedPanels,
    setAdminCarrierOpenedPanels,
    setEquipmentInformation,

    setDispatchCarrierInfoCarriersChanging,
    setDispatchCarrierInfoCarrierSearchChanging,

    setSelectedCustomerCarrierInfoCarrier,
    setSelectedCustomerCarrierInfoContact,
    setSelectedCustomerCarrierInfoDriver,
    setSelectedCustomerCarrierInfoInsurance,
    setSelectedCustomerCarrierInfoDocument,
    setSelectedCustomerCarrierInfoDocumentTags,
    setSelectedCustomerCarrierInfoDocumentNote,

    //LOAD BOARD
    setLoadBoardOpenedPanels,
    setLbSelectedOrder,
    setLbSelectedBillToCompanyInfo,
    setLbSelectedBillToCompanyContact,
    setLbBillToCompanySearch,
    setLbSelectedShipperCompanyInfo,
    setLbSelectedShipperCompanyContact,
    setLbShipperCompanySearch,
    setLbSelectedConsigneeCompanyInfo,
    setLbSelectedConsigneeCompanyContact,
    setLbConsigneeCompanySearch,
    setSelectedLbCarrierInfoCarrier,
    setSelectedLbCarrierInfoContact,
    setSelectedLbCarrierInfoDriver,

    //INVOICE
    setInvoiceOpenedPanels,
    setInvoiceSelectedOrder,
    setLbInvoiceSelectedOrder,
    setLbInvoiceOrderNumber,
    setLbInvoiceTripNumber,
    setInvoiceOrderNumber,
    setInvoiceTripNumber,
    setInvoiceInternalNotes,
    setInvoiceSelectedInternalNote,
    setInvoiceSelectedBillToCompanyInfo,
    setInvoiceSelectedBillToCompanyContact,
    setInvoiceSelectedBillToCompanyDocument,
    setInvoiceSelectedBillToCompanyDocumentTags,
    setInvoiceSelectedBillToCompanyDocumentNote,
    setSelectedInvoiceCarrierInfoCarrier,
    setSelectedInvoiceCarrierInfoContact,
    setSelectedInvoiceCarrierInfoDriver,
    setSelectedInvoiceCarrierInfoInsurance,
    setSelectedInvoiceCarrierInfoDocument,
    setSelectedInvoiceCarrierInfoDocumentTags,
    setSelectedInvoiceCarrierInfoDocumentNote,


    setCompanyHomePanels,
    setCustomersTPanels,
    setCompanyCarrierPanels,
    setCompanyCustomerPanels,
    setCompanyDispatchPanels,
    setCompanyInvoicePanels,
    setCompanyLoadBoardPanels,
    setCompanyReportPanels
})(Company)