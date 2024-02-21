import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import ToPrint from './ToPrint.jsx';
import { useReactToPrint } from 'react-to-print';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import axios from 'axios';
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

import { EmailRecipientInput } from '../../panels/index';
import {Invoice} from './../../index';

const Order = (props) => {
    const refOrderContainer = useRef();
    const [selectedOrder, setSelectedOrder] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const componentRef = useRef();

    const [showEmailRecipientInput, setShowEmailRecipientInput] = useState(false);
    const [dataEmail, setDataEmail] = useState({});

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
        content: () => componentRef.current,
    });

    const styleFlexRow = {
        display: 'flex',
        flexDirection: 'row'
    }
    const styleFlexCol = {
        display: 'flex',
        flexDirection: 'column'
    }
    const styleFieldName = {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '0.7rem'
    }
    const styleFieldData = {
        color: 'red',
        fontSize: '0.7rem'
    }
    const styleFieldDataBold = {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '0.7rem'
    }

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    const emailRecipientInputTransition = useTransition(showEmailRecipientInput, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: showEmailRecipientInput,
        config: { duration: 100 }
    });

    useEffect(() => {
        if ((props.selectedOrderId || 0) > 0) {
            axios.post(props.serverUrl + '/getOrderById', { id: props.selectedOrderId }).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedOrder(res.data.order);

                    console.log(res.data.order)
                }
            }).finally(() => {
                setIsLoading(false);
            })
        }

        refOrderContainer.current.focus({
            preventScroll: true
        })
    }, [])

    const openInvoicedOrder = () => {
        let panel = {
            panelName: `${props.panelName}-invoice`,
            component: <Invoice
                pageName={'Invoice'}
                title={'Invoice'}
                panelName={`${props.panelName}-invoice`}
                tabTimes={500046 + props.tabTimes}
                screenFocused={props.invoiceScreenFocused}
                componentId={moment().format('x')}
                isOnPanel={true}
                origin={props.origin}                
                order_id={(selectedOrder?.id || 0)}
            />
        }

        openPanel(panel, props.origin);
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

    return (
        <div className="panel-content" tabIndex={0} ref={refOrderContainer}>
            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }
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

                <div className="mochi-button" onClick={() => {
                    let user_first_name = (selectedOrder?.user_code?.type || '') === 'agent'
                        ? (((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.first_name || '')).trim()
                        : (selectedOrder?.user_code?.type || '') === 'employee'
                            ? ((selectedOrder.user_code?.employee?.first_name || '')).trim()
                            : '';

                    let user_last_name = (selectedOrder?.user_code?.type || '') === 'agent'
                        ? (((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.last_name || '')).trim()
                        : (selectedOrder?.user_code?.type || '') === 'employee'
                            ? ((selectedOrder.user_code?.employee?.last_name || '')).trim()
                            : '';

                    let user_email_address = (selectedOrder?.user_code?.type || '') === 'agent'
                        ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_email || '') === 'work'
                            ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.email_work || '')
                            : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_email || '') === 'personal'
                                ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.email_personal || '')
                                : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_email || '') === 'other'
                                    ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.email_other || '')
                                    : ''
                        : (selectedOrder?.user_code?.type || '') === 'employee'
                            ? (selectedOrder.user_code?.employee?.primary_email || '') === 'work'
                                ? (selectedOrder.user_code?.employee?.email_work || '')
                                : (selectedOrder.user_code?.employee?.primary_email || '') === 'personal'
                                    ? (selectedOrder.user_code?.employee?.email_personal || '')
                                    : (selectedOrder.user_code?.employee?.primary_email || '') === 'other'
                                        ? (selectedOrder.user_code?.employee?.email_other || '')
                                        : ''
                            : ''

                    let user_phone = (selectedOrder?.user_code?.type || '') === 'agent'
                        ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_phone || '') === 'work'
                            ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.phone_work || '')
                            : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_phone || '') === 'fax'
                                ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.phone_work_fax || '')
                                : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_phone || '') === 'mobile'
                                    ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.phone_mobile || '')
                                    : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_phone || '') === 'direct'
                                        ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.phone_direct || '')
                                        : ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.primary_phone || '') === 'other'
                                            ? ((selectedOrder.user_code?.agent?.contacts || []).find(x => x.id === (selectedOrder.user_code?.agent_contact_id || 0))?.phone_other || '')
                                            : ''
                        : (selectedOrder?.user_code?.type || '') === 'employee'
                            ? (selectedOrder.user_code?.employee?.primary_phone || '') === 'work'
                                ? (selectedOrder.user_code?.employee?.phone_work || '')
                                : (selectedOrder.user_code?.employee?.primary_phone || '') === 'fax'
                                    ? (selectedOrder.user_code?.employee?.phone_work_fax || '')
                                    : (selectedOrder.user_code?.employee?.primary_phone || '') === 'mobile'
                                        ? (selectedOrder.user_code?.employee?.phone_mobile || '')
                                        : (selectedOrder.user_code?.employee?.primary_phone || '') === 'direct'
                                            ? (selectedOrder.user_code?.employee?.phone_direct || '')
                                            : (selectedOrder.user_code?.employee?.primary_phone || '') === 'other'
                                                ? (selectedOrder.user_code?.employee?.phone_other || '')
                                                : ''
                            : ''

                    let dataEmail = {
                        order_number: selectedOrder.order_number,
                        user_first_name,
                        user_last_name,
                        user_email_address,
                        user_phone,
                        type: 'customer',                    
                        recipient_to: [],
                        recipient_cc: [],
                        recipient_bcc: []
                    }

                    let primaryContact = (selectedOrder?.bill_to_company?.contacts || []).find(x => x.is_primary === 1);

                    if (primaryContact) {
                        dataEmail.recipient_to = [{
                            email: (primaryContact?.primary_email || 'work') === 'work'
                                ? primaryContact?.email_work || ''
                                : (primaryContact?.primary_email || 'work') === 'personal'
                                    ? primaryContact?.email_personal || ''
                                    : (primaryContact?.primary_email || 'work') === 'other'
                                        ? primaryContact?.email_other || ''
                                        : '',
                            name: ((primaryContact?.first_name || '') + ' ' + (primaryContact?.last_name || '')).trim(),
                            primary: true
                        }]
                    }

                    setDataEmail(dataEmail);

                    window.setTimeout(() => {
                        setShowEmailRecipientInput(true);
                    }, 100);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">E-Mail Order</div>
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
                        ref={componentRef}
                        panelName={`${props.panelName}-print-order`}
                        tabTimes={50006 + props.tabTimes}
                        screenFocused={props.invoiceScreenFocused}
                        isOnPanel={true}
                        origin={props.origin}
                        openInvoicedOrder={openInvoicedOrder}

                        selectedOrder={selectedOrder}
                        selectedCompany={props.selectedCompany}
                        invoiceScreenFocused={true}
                    />
                </div>
            </div>

            {
                emailRecipientInputTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <EmailRecipientInput
                            title={'E-Mail Customer Order'}
                            dataEmail={dataEmail}
                            successMessage={`Customer Order has been sent!`}
                            sendingUrl="/sendOrderEmail"
                            close={() => {
                                setShowEmailRecipientInput(false);
                            }}
                        />
                    </animated.div>
                ))
            }
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

        selectedCompany: state.companySetupReducers.selectedCompany
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

})(Order)