import React, { useState, useEffect, useRef } from 'react';
import './Company.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
// import { Transition, Spring, animated, config } from 'react-spring';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faPencilAlt, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Draggable from 'react-draggable';
import axios from 'axios';

import {
    setMainScreen,
    setScale,
    setUser
} from '../../actions/systemActions';

import {
    setPages,
    setCompanyOpenedPanels,
    setSelectedPageIndex,
    setMainCompanyScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setLoadBoardScreenFocused,
    setInvoiceScreenFocused,
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

} from '../../actions/carriersActions';

import {
    setLoadBoardOpenedPanels,
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
} from '../../actions/invoiceActions';

import { CompanyHome, Dispatch, Customers, Carriers, LoadBoard, Invoice } from './../company';
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

    const containerCls = classnames({
        'main-company-container': true,
        'is-showing': props.mainScreen === 'company'
    });

    const userClick = () => {
        props.setMainScreen('admin');
    }

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

    const switchAppBtnClick = () => {
        props.setScale(props.scale === 1 ? 0.7 : 1);
    }

    const homePanelTransition = useTransition(homePanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (homePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setHomePanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (homePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setDispatchPanels([]);
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
                // setCustomerPanels([]);
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
                // setCarrierPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (carrierPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const loadBoardPanelTransition = useTransition(loadBoardPanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (loadBoardPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setLoadBoardPanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (loadBoardPanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
                right: `calc(0%)`,
            }
        },
    })

    const invoicePanelTransition = useTransition(invoicePanels, {
        from: panel => {
            return {
                width: `calc(${baseWidth}% - ${panelGap * (invoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
                // setInvoicePanels([]);
            }
            return {
                width: `calc(${baseWidth}% - ${panelGap * (invoicePanels.findIndex(p => p?.panelName === (panel?.panelName || '')))}px)`,
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
        if (origin === 'company-home') {
            if (homePanels.find(p => p.panelName === panel.panelName) === undefined) {
                setHomePanels(homePanels => [...homePanels, panel]);
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

        if (origin === 'load-board') {
            if (loadBoardPanels.find(p => p.panelName === panel.panelName) === undefined) {
                setLoadBoardPanels(loadBoardPanels => [...loadBoardPanels, panel]);
            }
        }

        if (origin === 'invoice') {
            if (invoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                setInvoicePanels(invoicePanels => [...invoicePanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'company-home') {
            setHomePanels(homePanels.filter(panel => panel.panelName !== panelName));
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

        if (origin === 'load-board') {
            setLoadBoardPanels(loadBoardPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'invoice') {
            setInvoicePanels(invoicePanels.filter(panel => panel.panelName !== panelName));
        }
    }

    return (
        <div className={containerCls}>
            <div className="main-content">
                {
                    (props.user?.id || 0) > 0 &&
                    <div className="menu-bar">
                        <div className="section">
                            {
                                (props.user?.type || '') === 'employee' &&
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
                                'screen-focused': props.mainCompanyScreenFocused
                            })} onClick={homeBtnClick}>
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
                                'screen-focused': props.loadBoardScreenFocused
                            })} onClick={loadBoardBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Load Board</div>
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
                        overflowX: 'hidden',
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
                                homePanelTransition((style, panel, item, index) => {
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
                                            // onClick={() => {
                                            //     // let oldIndex = props.dispatchOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.dispatchOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setDispatchOpenedPanels(_panels);
                                            // }}
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
                                            // onClick={() => {
                                            //     // let oldIndex = props.dispatchOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.dispatchOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setDispatchOpenedPanels(_panels);
                                            // }}
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
                                tabTimes={1000}
                                screenFocused={props.dispatchScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
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
                                            }}
                                            // onClick={() => {
                                            //     // let oldIndex = props.customerOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.customerOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setCustomerOpenedPanels(_panels);
                                            // }}
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

                            <Customers
                                pageName={'Customer'}
                                title={'Customer'}
                                panelName={'customer'}
                                tabTimes={2000}
                                screenFocused={props.customerScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
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
                                            }}
                                            // onClick={() => {
                                            //     // let oldIndex = props.customerOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.customerOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setCustomerOpenedPanels(_panels);
                                            // }}
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

                            <Carriers
                                pageName={'Carrier'}
                                title={'Carrier'}
                                panelName={'carrier'}
                                tabTimes={3000}
                                screenFocused={props.carrierScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
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
                            {
                                loadBoardPanelTransition((style, panel, item, index) => {
                                    const origin = 'load-board';

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
                                            // onClick={() => {
                                            //     // let oldIndex = props.customerOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.customerOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setCustomerOpenedPanels(_panels);
                                            // }}
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

                            <LoadBoard
                                pageName={'Load Board'}
                                title={'Load Board'}
                                panelName={'load-board'}
                                tabTimes={4000}
                                screenFocused={props.loadBoardScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                origin='load-board'
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
                                invoicePanelTransition((style, panel, item, index) => {
                                    const origin = 'invoice';

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
                                            // onClick={() => {
                                            //     // let oldIndex = props.customerOpenedPanels.findIndex(p => p.panelName === panel?.panelName);
                                            //     // let _panels = [...props.customerOpenedPanels];
                                            //     // _panels.splice(_panels.length - 1, 0, _panels.splice(oldIndex, 1)[0]);

                                            //     // props.setCustomerOpenedPanels(_panels);
                                            // }}
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

                            <Invoice
                                pageName={'Invoice'}
                                title={'Invoice'}
                                panelName={'invoice'}
                                tabTimes={5000}
                                screenFocused={props.invoiceScreenFocused}
                                componentId={moment().format('x')}
                                isOnPanel={false}
                                origin='invoice'
                                openPanel={openPanel}
                                closePanel={closePanel}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = state => {
    return {
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
        scale: state.systemReducers.scale,
        mainScreen: state.systemReducers.mainScreen,
        pages: state.companyReducers.pages,
        selectedPageIndex: state.companyReducers.selectedPageIndex,
        mainCompanyScreenFocused: state.companyReducers.mainCompanyScreenFocused,
        dispatchScreenFocused: state.companyReducers.dispatchScreenFocused,
        customerScreenFocused: state.companyReducers.customerScreenFocused,
        carrierScreenFocused: state.companyReducers.carrierScreenFocused,
        loadBoardScreenFocused: state.companyReducers.loadBoardScreenFocused,
        invoiceScreenFocused: state.companyReducers.invoiceScreenFocused,

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
    }
}

export default connect(mapStateToProps, {
    setMainScreen,
    setUser,
    setPages,
    setSelectedPageIndex,
    setScale,
    setMainCompanyScreenFocused,
    setDispatchScreenFocused,
    setCustomerScreenFocused,
    setCarrierScreenFocused,
    setLoadBoardScreenFocused,
    setInvoiceScreenFocused,
    setCompanyOpenedPanels,
    setAdminOpenedPanels,

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
})(Company)