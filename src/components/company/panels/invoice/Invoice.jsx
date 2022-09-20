import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import ToPrint from './ToPrint.jsx';
import axios from 'axios';
import './Invoice.css';
import moment from 'moment';

import { useReactToPrint } from 'react-to-print';
import {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setSelectedOrder
} from './../../../../actions';
import { useTransition, animated } from 'react-spring';
import classNames from 'classnames';

const Invoice = (props) => {
    const toPrintRef = useRef();
    const [selectedOrder, setSelectedOrder] = useState({});

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

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

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

                            if ((res.data.order.order_invoiced || 0) === 1 &&
                                (res.data.order.events || []).find(e => (e.event_type_id || 0) === 13) === undefined) {
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
                                    } else if (res.data.result === 'ORDER ID NOT VALID') {
                                        window.alert('The order number is not valid!');
                                    }
                                }).catch(e => {
                                    console.log('error saving order event', e);
                                })
                            }
                        }).catch(e => {
                            console.log('error saving order invoiced', e);
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
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selected_order: state.dispatchReducers.selected_order,
    }
}

export default connect(mapStateToProps, {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setSelectedOrder
})(Invoice)