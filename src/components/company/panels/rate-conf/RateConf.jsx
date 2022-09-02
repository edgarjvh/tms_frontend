import React, { useRef, useState } from 'react';
import { connect } from "react-redux";
import CarrierConfirmation from './CarrierConfirmation.jsx';
import CustomerConfirmation from './CustomerConfirmation.jsx';
import { useReactToPrint } from 'react-to-print';
import {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
} from './../../../../actions';
import { useTransition, animated } from 'react-spring';
import classNames from 'classnames';

const RateConf = (props) => {
    const [showingCarrierConfirmation, setShowingCarrierConfirmation] = useState(true);
    const carrierComponentRef = useRef();
    const customerComponentRef = useRef();

    const carrierConfirmationTransition = useTransition(showingCarrierConfirmation, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: showingCarrierConfirmation,
        config: { duration: 100 }
    });

    const customerConfirmationTransition = useTransition(!showingCarrierConfirmation, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: !showingCarrierConfirmation,
        config: { duration: 100 }
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
        content: () => showingCarrierConfirmation ? carrierComponentRef.current : customerComponentRef.current,
    });

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div className="header-buttons" style={{ marginTop: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                <div className="mochi-button" onClick={() => {
                    handlePrint();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Print</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                {
                    showingCarrierConfirmation
                        ? <div className="mochi-button" onClick={() => {
                            setShowingCarrierConfirmation(false);
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Customer Confirmation</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                        :
                        <div className="mochi-button" onClick={() => {
                            setShowingCarrierConfirmation(true);
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Carrier Confirmation</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                }

                <div className="mochi-button">
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">E-Mail Rate Conf</div>
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

                    {
                        carrierConfirmationTransition((style, item) => item && (
                            <animated.div style={{ ...style }}>
                                <CarrierConfirmation
                                    ref={carrierComponentRef}
                                    selected_order={props.selectedOrder}
                                    selectedCarrierInfo={props.selectedOrder.carrier}
                                    selectedCarrierInfoContact={(props.selectedOrder.carrier?.contacts || []).find(c => c.is_primary === 1) || {}}
                                    selectedCustomerInfo={props.selectedOrder.bill_to_company}
                                    selectedCustomerInfoContact={(props.selectedOrder.bill_to_company?.contacts || []).find(c => c.is_primary === 1) || {}}
                                    selectedCompany={props.selectedCompany}
                                />
                            </animated.div>
                        ))
                    }
                    {
                        customerConfirmationTransition((style, item) => item && (
                            <animated.div style={{ ...style }}>
                                <CustomerConfirmation
                                    ref={customerComponentRef}
                                    selected_order={props.selectedOrder}
                                    selectedCarrierInfo={props.selectedOrder.carrier}
                                    selectedCarrierInfoContact={(props.selectedOrder.carrier?.contacts || []).find(c => c.is_primary === 1) || {}}
                                    selectedCustomerInfo={props.selectedOrder.bill_to_company}
                                    selectedCustomerInfoContact={(props.selectedOrder.bill_to_company?.contacts || []).find(c => c.is_primary === 1) || {}}
                                    selectedCompany={props.selectedCompany}
                                />
                            </animated.div>
                        ))
                    }

                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        selectedCompany: state.companySetupReducers.selectedCompany,
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
    }
}

export default connect(mapStateToProps, {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
})(RateConf)