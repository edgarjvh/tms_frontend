/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import './Reports.css';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Highlighter from "react-highlight-words";
import { useReactToPrint } from 'react-to-print';

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
    setCompanyReportPanels
} from './../../../actions';
import ReportCustomer from '../panels/report-customer/ReportCustomer';
import ReportCarrier from '../panels/report-carrier/ReportCarrier';
import ReportAgent from '../panels/report-agent/ReportAgent';
import ReportCustomerOpenInvoices from '../panels/report-customer-open-invoices/ReportCustomerOpenInvoices';
import ReportCarrierOpenInvoices from '../panels/report-carrier-open-invoices/ReportCarrierOpenInvoices';
import ReportAgentRevenue from '../panels/report-agent-revenue/ReportAgentRevenue';

const Reports = (props) => {
    const refReportsMainContainer = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

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
        <div className="reports-main-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? "transparent" : "rgb(250, 250, 250)",
            background: props.isOnPanel ? "transparent" : "-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            background: props.isOnPanel ? "transparent" : "-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            background: props.isOnPanel ? "transparent" : "radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative'
        }} ref={refReportsMainContainer}>
            {
                (props.isOnPanel) &&
                <div className="close-btn" title="Close" onClick={e => {
                    props.closingCallback();
                }}><span className="fas fa-times"></span></div>
            }
            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="button-container">
                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-customers`,
                        component: (
                            <ReportCustomer
                                panelName={`${props.panelName}-customers`}
                                title="Customer Report"
                                tabTimes={39050 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-customers`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Customers</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-carriers`,
                        component: (
                            <ReportCarrier
                                panelName={`${props.panelName}-carriers`}
                                title="Carrier Report"
                                tabTimes={39060 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-carriers`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Carriers</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-agents`,
                        component: (
                            <ReportAgent
                                panelName={`${props.panelName}-agents`}
                                title="Agent Report"
                                tabTimes={39070 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-agents`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Agents</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-customer-open-invoices`,
                        component: (
                            <ReportCustomerOpenInvoices
                                panelName={`${props.panelName}-customer-open-invoices`}
                                title="Customer Open Invoices Report"
                                tabTimes={3934050 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-customer-open-invoices`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Customer Open Invoices</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-carrier-open-invoices`,
                        component: (
                            <ReportCarrierOpenInvoices
                                panelName={`${props.panelName}-carrier-open-invoices`}
                                title="Carrier Open Invoices Report"
                                tabTimes={39340360 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-carrier-open-invoices`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Carrier Open Invoices</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-agent-revenue`,
                        component: (
                            <ReportAgentRevenue
                                panelName={`${props.panelName}-agent-revenue`}
                                title="Agent Revenues Report"
                                tabTimes={49340360 + props.tabTimes}
                                origin={props.origin}
                                closingCallback={() => {
                                    closePanel(`${props.panelName}-agent-revenue`, props.origin);
                                }}
                            />
                        ),
                    };

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Agent Revenues</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
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
    setCompanyReportPanels
})(Reports)