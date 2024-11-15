import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import ToPrint from './ToPrint.jsx';
import axios from 'axios';
import './Invoice.css';
import moment from 'moment';

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
    setCompanyReportPanels,

    setSelectedOrder,

    setAvailableOrders,
    setBookedOrders,
    setInTransitOrders,
    setDeliveredNotInvoiced,
    setIsLoadingWidget
} from './../../../../actions';
import { useTransition, animated } from 'react-spring';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import classNames from 'classnames';

const Invoice = (props) => {
    const refInvoiceContainer = useRef();
    const toPrintRef = useRef();
    const [selectedOrder, setSelectedOrder] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: "block" },
        enter: { opacity: 1, display: "block" },
        leave: { opacity: 0, display: "none" },
        reverse: isLoading,
    });

    const handlePrint = useReactToPrint({
        pageStyle: () => {
            return `
                @media print {
                    @page {
                        size: 8.5in 11in !important; 
                        margin: 0;                        
                    }
                    .page-block {
                        page-break-after: auto !important;
                        page-break-beforer: auto !important; 
                        page-break-inside: avoid !important;
                    } 
                    .no-print{
                        display:none !important;
                    } 
                    .container-sheet{
                        box-shadow: initial !important;
                        margin: 0 !important
                    }
                }
            `
        },
        content: () => toPrintRef.current,
    });

    useEffect(() => {
        setSelectedOrder({ ...props.selectedOrder });

        refInvoiceContainer.current.focus({
            preventScroll: true
        })
    }, []);

    useEffect(() => {
        if ((props.selected_order?.component_id || '') !== props.componentId) {
            if (((selectedOrder?.id || 0) > 0 && (props.selected_order?.id || 0) > 0) && selectedOrder.id === props.selected_order.id) {
                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        ...props.selected_order
                    }
                })
            }
        }
    }, [props.selected_order])

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

    const getLoadBoardOrders = () => {
        props.setIsLoadingWidget(true)
        axios.post(props.serverUrl + '/getLoadBoardOrders', {
            user_code: props.user.user_code.type === 'agent' ? props.user.user_code.code : ''
        }).then(async res => {
            if (res.data.result === 'OK') {
                props.setAvailableOrders(res.data.available_orders);
                props.setBookedOrders(res.data.booked_orders);
                props.setInTransitOrders(res.data.in_transit_orders);
                props.setDeliveredNotInvoiced(res.data.not_invoiced_orders);
            }
        }).catch(e => {
            console.log('error loading orders', e)
        }).finally(() => {
            props.setIsLoadingWidget(false)
        })
    }

    return (
        <div className="panel-content" tabIndex={0} ref={refInvoiceContainer}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {loadingTransition(
                (style, item) =>
                    item && (
                        <animated.div className="loading-container" style={style}>
                            <div className="loading-container-wrapper">
                                <Loader
                                    type="Circles"
                                    color="#009bdd"
                                    height={40}
                                    width={40}
                                    visible={item}
                                />
                            </div>
                        </animated.div>
                    )
            )}

            <div className="header-buttons" style={{ marginTop: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                <div className={classNames({
                    'mochi-button': true,
                    // 'disabled': (selectedOrder?.order_invoiced || 0) === 0
                })} onClick={() => {
                    handlePrint();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Print</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={classNames({
                    'mochi-button': true,
                    'active': (selectedOrder?.order_invoiced || 0) === 1
                })} style={{
                    pointerEvents: (selectedOrder?.order_invoiced || 0) === 1 ? 'none' : 'all'
                }} onClick={() => {
                    if (window.confirm('Are you sure you want to proceed?')) {
                        setIsLoading(true)

                        props.setSelectedOrder({
                            ...selectedOrder,
                            order_invoiced: 1,
                            component_id: props.componentId
                        })

                        setSelectedOrder(selectedOrder => {
                            return {
                                ...selectedOrder,
                                order_invoiced: 1
                            }
                        })

                        axios.post(props.serverUrl + '/saveOrder', {
                            ...selectedOrder,
                            order_invoiced: 1
                        }).then(res => {

                            if ((res.data.order.order_invoiced || 0) === 1 && !(res.data.order.events || []).find(e => (e.event_type_id || 0) === 13)) {
                                let event_parameters = {
                                    order_id: res.data.order.id,
                                    time: moment().format('HHmm'),
                                    event_time: moment().format('HHmm'),
                                    date: moment().format('MM/DD/YYYY'),
                                    event_date: moment().format('MM/DD/YYYY'),
                                    user_code_id: props.user.user_code.id || null,
                                    event_location: '',
                                    event_notes: 'Invoiced Order',
                                    event_type_id: 13,
                                }

                                axios.post(props.serverUrl + '/saveOrderEvent', event_parameters).then(async res => {
                                    if (res.data.result === 'OK') {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                events: res.data.order_events
                                            }
                                        });

                                        props.setSelectedOrder({
                                            id: selectedOrder.id,
                                            events: res.data.order_events,
                                            component_id: props.componentId
                                        });

                                        getLoadBoardOrders();
                                    } else if (res.data.result === 'ORDER ID NOT VALID') {
                                        window.alert('The order number is not valid!');
                                    }
                                }).catch(e => {
                                    console.log('error saving order event', e);
                                })
                            }
                        }).catch(e => {
                            console.log('error saving order invoiced', e);
                        }).finally(() => {
                            setIsLoading(false)
                        });
                    }
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">{(selectedOrder?.order_invoiced || 0) === 1 ? 'Approved' : 'Approve'}</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
            </div>

            <div className="content-viewer" style={{ flexGrow: 1, position: 'relative' }}>
                <div className="content-viewer-wrapper" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'auto'
                }}>
                    <ToPrint
                        ref={toPrintRef}
                        serverUrl={props.serverUrl}
                        selectedCompany={props.selectedCompany}
                        selectedOrder={props.selectedOrder}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        selectedCompany: state.companySetupReducers.selectedCompany,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
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

        selected_order: state.dispatchReducers.selected_order,
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

    setSelectedOrder,

    setAvailableOrders,
    setBookedOrders,
    setInTransitOrders,
    setDeliveredNotInvoiced,
    setIsLoadingWidget
})(Invoice)