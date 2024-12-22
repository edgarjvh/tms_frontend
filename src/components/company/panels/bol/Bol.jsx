/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import ToPrint from './ToPrint.jsx';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';
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

import {
    SelectBox
} from './../../../controls';

const Bol = (props) => {
    const refBolContainer = useRef();
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedShipFrom, setSelectedShipFrom] = useState({});
    const [selectedShipTo, setSelectedShipTo] = useState({});
    const [ratingItems, setRatingItems] = useState([]);

    const [showEmailRecipientInput, setShowEmailRecipientInput] = useState(false);
    const [dataEmail, setDataEmail] = useState({});

    const [freightChargeTermsPrepaid, setFreightChargeTermsPrepaid] = useState(false);
    const [freightChargeTermsCollect, setFreightChargeTermsCollect] = useState(false);
    const [freightChargeTerms3rdParty, setFreightChargeTerms3rdParty] = useState(false);
    const [freightChargeTermsMaster, setFreightChargeTermsMaster] = useState(false);

    const [feeTermsCollect, setFeeTermsCollect] = useState(false);
    const [feeTermsPrepaid, setFeeTermsPrepaid] = useState(false);
    const [feeTermsCheck, setFeeTermsCheck] = useState(false);

    const [trailerLoadedByShipper, setTrailerLoadedByShipper] = useState(false);
    const [trailerLoadedByDriver, setTrailerLoadedByDriver] = useState(false);

    const [freightCountedByShipper, setFreightCountedByShipper] = useState(false);
    const [freightCountedByDriverPallets, setFreightCountedByDriverPallets] = useState(false);
    const [freightCountedByDriverPieces, setFreightCountedByDriverPieces] = useState(false);

    const [shipFromItems, setShipFromItems] = useState([]);
    const refShipFrom = useRef();
    const refShipFromPopupItems = useRef([]);
    const refShipFromDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShipFromItems([])
        }
    });

    const [shipToItems, setShipToItems] = useState([]);
    const refShipTo = useRef();
    const refShipToPopupItems = useRef([]);
    const refShipToDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShipToItems([])
        }
    });

    const toPrintRef = useRef();

    const emailRecipientInputTransition = useTransition(showEmailRecipientInput, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: showEmailRecipientInput,
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
        content: () => toPrintRef.current,
    });

    const getPickupsOnRouting = () => {
        let pickups = [];

        try {
            (props.selectedOrder?.routing || []).map((r, i) => {
                if (r.type === "pickup") {
                    pickups.push((props.selectedOrder?.pickups || []).find((p) => p.id === r.pickup_id));
                }
                return false;
            });
        } catch (e) {

        }

        return pickups;
    };

    const getDeliveriesOnRouting = () => {
        let deliveries = [];

        (props.selectedOrder?.routing || []).map((r, i) => {
            if (r.type === "delivery") {
                deliveries.push(
                    (props.selectedOrder?.deliveries || []).find((d) => d.id === r.delivery_id)
                );
            }
            return false;
        });

        return deliveries;
    };


    useEffect(() => {
        let order = { ...props.selectedOrder, ship_from: {}, ship_to: {} };

        let pickups = getPickupsOnRouting();
        let deliveries = getDeliveriesOnRouting();

        pickups.map((item, index) => {
            if (index === 0) {
                let customer = item?.customer || {};

                order.ship_from = {
                    ...customer,
                    pickup_id: item.id,
                    pu_date1: item.pu_date1,
                    pu_date2: item.pu_date2,
                    pu_time1: item.pu_time1,
                    pu_time2: item.pu_time2,
                    bol_numbers: item.bol_numbers,
                    po_numbers: item.po_numbers,
                    ref_numbers: item.ref_numbers,
                    seal_number: item.seal_number,
                    special_instructions: item.special_instructions,
                    original_name: customer?.name,
                    name: `${customer?.code || ''}${(customer?.code_number || 0) === 0 ? '' : customer?.code_number} - ${customer?.name || ''}`,
                    selected: true
                };
            }

            return false;
        });

        deliveries.map((item, index) => {
            if (index === (deliveries.length - 1)) {
                let customer = item?.customer || {};

                order.ship_to = {
                    ...customer,
                    delivery_id: item.id,
                    delivery_date1: item.delivery_date1,
                    delivery_date2: item.delivery_date2,
                    delivery_time1: item.delivery_time1,
                    delivery_time2: item.delivery_time2,
                    bol_numbers: item.bol_numbers,
                    po_numbers: item.po_numbers,
                    ref_numbers: item.ref_numbers,
                    seal_number: item.seal_number,
                    special_instructions: item.special_instructions,
                    original_name: customer?.name,
                    name: `${customer?.code || ''}${(customer?.code_number || 0) === 0 ? '' : customer?.code_number} - ${customer?.name || ''}`,
                    selected: true
                };
            }

            return false;
        });

        setSelectedOrder(order);

        let _items = new Array(6).fill({});

        let ratingFilter = (props.selectedOrder?.order_customer_ratings || []).filter((rating) => (rating.rate_type?.name || '').toLowerCase() === 'flat' ||
            (rating.rate_type?.name || '').toLowerCase() === 'linehaul' ||
            (rating.rate_type?.id || 0) === 0);

        ratingFilter.map((rating, index) => {
            _items[index] = {
                ...rating,
                pieces_name: rating.pieces_unit === 'sk' ? 'Skids' : 'Pieces'
            };

            return false;
        });

        setRatingItems([..._items]);

        if ((props.selectedCompany?.mailing_address?.id || 0) > 0) {
            setFreightChargeTerms3rdParty(true);
        }

        refShipFrom.current.focus({
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

    return (
        <div className="panel-content" tabIndex={props.tabTimesFrom + props.tabTimes + 0} ref={refBolContainer} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                props.closingCallback();
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
            <div className="header-buttons" style={{ marginTop: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                <div className="mochi-button" onClick={() => {
                    handlePrint();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Print</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <SelectBox
                    placeholder="Shipper:"
                    placeholderFixed={true}
                    popupId="ship-from"
                    tabIndex={props.tabTimesFrom + props.tabTimes + 1}
                    boxStyle={{
                        width: '20rem',
                    }}
                    inputStyle={{
                        textTransform: 'capitalize'
                    }}
                    popupStyle={{
                        left: '-20%'
                    }}
                    refs={{
                        refInput: refShipFrom,
                        refPopupItems: refShipFromPopupItems,
                        refDropdown: refShipFromDropDown,
                    }}
                    readOnly={false}
                    isDropdownEnabled={true}
                    popupPosition="vertical below"
                    onEnter={async e => {
                        if (shipFromItems.length > 0 && shipFromItems.findIndex(item => item.selected) > -1) {
                            let item = shipFromItems[shipFromItems.findIndex(item => item.selected)];

                            await setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    ship_from: item
                                }
                            })

                            // validateDriverLicenseToSave({ keyCode: 9 });
                            setShipFromItems([]);
                            refShipFrom.current.focus();
                        }
                    }}
                    onTab={async e => {
                        let item = shipFromItems[shipFromItems.findIndex(item => item.selected)];

                        await setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_from: item
                            }
                        })

                        // validateDriverLicenseToSave({ keyCode: 9 });
                        setShipFromItems([]);
                        refShipFrom.current.focus();
                    }}
                    onBlur={e => {
                        if ((selectedOrder?.ship_from?.id || 0) === 0) {
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    ship_from: {}
                                }
                            })
                        }
                    }}
                    onInput={e => {
                        let _ship_from = selectedOrder?.ship_from || {};
                        _ship_from.id = 0;
                        _ship_from.name = e.target.value;

                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_from: _ship_from
                            }
                        })

                        if (e.target.value.trim() === "") {
                            setShipFromItems([]);
                        } else {
                            setShipFromItems([
                                ...getPickupsOnRouting().filter(x =>
                                    (x.customer?.code || '').toLowerCase().startsWith(e.target.value.trim().toLowerCase()) ||
                                    (x.customer?.name || '').toLowerCase().startsWith(e.target.value.trim().toLowerCase()) ||
                                    ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer?.code_number) + ' - ' + (x.customer?.name || '')).toLowerCase().startsWith(e.target.value.trim().toLowerCase())).map((item, index) => {
                                        let customer = {
                                            ...item.customer,
                                            original_name: item?.customer?.name || '',
                                            pickup_id: item.id,
                                            pu_date1: item.pu_date1,
                                            pu_date2: item.pu_date2,
                                            pu_time1: item.pu_time1,
                                            pu_time2: item.pu_time2,
                                            bol_numbers: item.bol_numbers,
                                            po_numbers: item.po_numbers,
                                            ref_numbers: item.ref_numbers,
                                            seal_number: item.seal_number,
                                            special_instructions: item.special_instructions,
                                            name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                            selected: (selectedOrder?.ship_from?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_from?.id
                                        }
                                        return customer;
                                    })
                            ])
                        }
                    }}
                    onChange={e => {
                        let _ship_from = selectedOrder?.ship_from || {};
                        _ship_from.id = 0;
                        _ship_from.name = e.target.value;

                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_from: _ship_from
                            }
                        })
                    }}
                    value={selectedOrder?.ship_from?.name || ""}
                    items={shipFromItems}
                    getItems={() => {
                        setShipFromItems([
                            ...getPickupsOnRouting().map((item, index) => {
                                let customer = {
                                    ...item.customer,
                                    original_name: item?.customer?.name || '',
                                    pickup_id: item.id,
                                    pu_date1: item.pu_date1,
                                    pu_date2: item.pu_date2,
                                    pu_time1: item.pu_time1,
                                    pu_time2: item.pu_time2,
                                    bol_numbers: item.bol_numbers,
                                    po_numbers: item.po_numbers,
                                    ref_numbers: item.ref_numbers,
                                    seal_number: item.seal_number,
                                    special_instructions: item.special_instructions,
                                    name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                    selected: (selectedOrder?.ship_from?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_from?.id
                                }
                                return customer;
                            })
                        ])

                        refShipFromPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                });
                            }
                            return true;
                        });
                    }}
                    setItems={setShipFromItems}
                    onDropdownClick={e => {
                        setShipToItems([]);
                        e.stopPropagation();

                        setShipFromItems([
                            ...getPickupsOnRouting().map((item, index) => {
                                let customer = {
                                    ...item.customer,
                                    original_name: item?.customer?.name || '',
                                    pickup_id: item.id,
                                    pu_date1: item.pu_date1,
                                    pu_date2: item.pu_date2,
                                    pu_time1: item.pu_time1,
                                    pu_time2: item.pu_time2,
                                    bol_numbers: item.bol_numbers,
                                    po_numbers: item.po_numbers,
                                    ref_numbers: item.ref_numbers,
                                    seal_number: item.seal_number,
                                    special_instructions: item.special_instructions,
                                    name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                    selected: (selectedOrder?.ship_from?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_from?.id
                                }
                                return customer;
                            })
                        ])

                        refShipFromPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                });
                            }
                            return true;
                        });
                    }}
                    onPopupClick={item => {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_from: item
                            }
                        })

                        // validateDriverLicenseToSave({ keyCode: 9 });

                        setShipFromItems([]);
                        refShipFrom.current.focus();
                    }}
                    noStopPropagationOnEsc={true}
                />

                <SelectBox
                    placeholder="Consignee:"
                    placeholderFixed={true}
                    popupId="ship-to"
                    tabIndex={props.tabTimesFrom + props.tabTimes + 2}
                    boxStyle={{
                        width: '20rem',
                    }}
                    inputStyle={{
                        textTransform: 'capitalize'
                    }}
                    popupStyle={{
                        left: '-20%'
                    }}
                    refs={{
                        refInput: refShipTo,
                        refPopupItems: refShipToPopupItems,
                        refDropdown: refShipToDropDown,
                    }}
                    readOnly={false}
                    isDropdownEnabled={true}
                    popupPosition="vertical below"
                    onEnter={async e => {
                        if (shipToItems.length > 0 && shipToItems.findIndex(item => item.selected) > -1) {
                            let item = shipToItems[shipToItems.findIndex(item => item.selected)];

                            await setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    ship_to: item
                                }
                            })

                            // validateDriverLicenseToSave({ keyCode: 9 });
                            setShipToItems([]);
                            refShipTo.current.focus();
                        }
                    }}
                    onTab={async e => {
                        let item = shipToItems[shipToItems.findIndex(item => item.selected)];

                        await setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_to: item
                            }
                        })

                        // validateDriverLicenseToSave({ keyCode: 9 });
                        setShipToItems([]);
                        refShipTo.current.focus();
                    }}
                    onBlur={e => {
                        if ((selectedOrder?.ship_to?.id || 0) === 0) {
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    ship_to: {}
                                }
                            })
                        }
                    }}
                    onInput={e => {
                        let _ship_to = selectedOrder?.ship_to || {};
                        _ship_to.id = 0;
                        _ship_to.name = e.target.value;

                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_to: _ship_to
                            }
                        })

                        if (e.target.value.trim() === "") {
                            setShipToItems([]);
                        } else {
                            setShipToItems([
                                ...getDeliveriesOnRouting().filter(x =>
                                    (x.customer?.code || '').toLowerCase().startsWith(e.target.value.trim().toLowerCase()) ||
                                    (x.customer?.name || '').toLowerCase().startsWith(e.target.value.trim().toLowerCase()) ||
                                    ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer?.code_number) + ' - ' + (x.customer?.name || '')).toLowerCase().startsWith(e.target.value.trim().toLowerCase())).map((item, index) => {
                                        let customer = {
                                            ...item.customer,
                                            original_name: item?.customer?.name || '',
                                            delivery_id: item.id,
                                            delivery_date1: item.delivery_date1,
                                            delivery_date2: item.delivery_date2,
                                            delivery_time1: item.delivery_time1,
                                            delivery_time2: item.delivery_time2,
                                            bol_numbers: item.bol_numbers,
                                            po_numbers: item.po_numbers,
                                            ref_numbers: item.ref_numbers,
                                            seal_number: item.seal_number,
                                            special_instructions: item.special_instructions,
                                            name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                            selected: (selectedOrder?.ship_to?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_to?.id
                                        }
                                        return customer;
                                    })
                            ])
                        }
                    }}
                    onChange={e => {
                        let _ship_to = selectedOrder?.ship_to || {};
                        _ship_to.id = 0;
                        _ship_to.name = e.target.value;

                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_to: _ship_to
                            }
                        })
                    }}
                    value={selectedOrder?.ship_to?.name || ""}
                    items={shipToItems}
                    getItems={() => {
                        setShipToItems([
                            ...getDeliveriesOnRouting().map((item, index) => {
                                let customer = {
                                    ...item.customer,
                                    original_name: item?.customer?.name || '',
                                    delivery_id: item.id,
                                    delivery_date1: item.delivery_date1,
                                    delivery_date2: item.delivery_date2,
                                    delivery_time1: item.delivery_time1,
                                    delivery_time2: item.delivery_time2,
                                    bol_numbers: item.bol_numbers,
                                    po_numbers: item.po_numbers,
                                    ref_numbers: item.ref_numbers,
                                    seal_number: item.seal_number,
                                    special_instructions: item.special_instructions,
                                    name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                    selected: (selectedOrder?.ship_to?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_to?.id
                                }
                                return customer;
                            })
                        ])

                        refShipToPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                });
                            }
                            return true;
                        });
                    }}
                    setItems={setShipToItems}
                    onDropdownClick={e => {
                        setShipFromItems([]);
                        e.stopPropagation();

                        setShipToItems([
                            ...getDeliveriesOnRouting().map((item, index) => {
                                let customer = {
                                    ...item.customer,
                                    original_name: item?.customer?.name || '',
                                    delivery_id: item.id,
                                    delivery_date1: item.delivery_date1,
                                    delivery_date2: item.delivery_date2,
                                    delivery_time1: item.delivery_time1,
                                    delivery_time2: item.delivery_time2,
                                    bol_numbers: item.bol_numbers,
                                    po_numbers: item.po_numbers,
                                    ref_numbers: item.ref_numbers,
                                    seal_number: item.seal_number,
                                    special_instructions: item.special_instructions,
                                    name: (item?.customer?.code || '') + ((item?.customer?.code_number || 0) === 0 ? '' : item?.customer?.code_number) + ' - ' + (item?.customer?.name || ''),
                                    selected: (selectedOrder?.ship_to?.id || 0) === 0 ? index === 0 : item?.customer?.id === selectedOrder?.ship_to?.id
                                }
                                return customer;
                            })
                        ])

                        refShipToPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                });
                            }
                            return true;
                        });
                    }}
                    onPopupClick={item => {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                ship_to: item
                            }
                        })

                        // validateDriverLicenseToSave({ keyCode: 9 });

                        setShipToItems([]);
                        refShipTo.current.focus();
                    }}
                />

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
                        order_number: selectedOrder?.order_number,
                        pickup_id: selectedOrder?.ship_from?.pickup_id,
                        delivery_id: selectedOrder?.ship_to?.delivery_id,
                        freight_charge_terms_prepaid: freightChargeTermsPrepaid,
                        freight_charge_terms_collect: freightChargeTermsCollect,
                        freight_charge_terms_3rd_party: freightChargeTerms3rdParty,
                        freight_charge_terms_master: freightChargeTermsMaster,
                        fee_terms_collect: feeTermsCollect,
                        fee_terms_prepaid: feeTermsPrepaid,
                        fee_terms_check: feeTermsCheck,
                        trailer_loaded_by_shipper: trailerLoadedByShipper,
                        trailer_loaded_by_driver: trailerLoadedByDriver,
                        freight_counted_by_shipper: freightCountedByShipper,
                        freight_counted_by_driver_pallets: freightCountedByDriverPallets,
                        freight_counted_by_driver_pieces: freightCountedByDriverPieces,
                        rating_items: ratingItems,
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
                    <div className="mochi-button-base">E-Mail Bol</div>
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
                        selectedOrder={{ ...selectedOrder }}
                        selectedCompany={props.selectedCompany}
                        ratingItems={ratingItems}
                        setRatingItems={setRatingItems}
                        freightChargeTermsPrepaid={freightChargeTermsPrepaid}
                        setFreightChargeTermsPrepaid={setFreightChargeTermsPrepaid}
                        freightChargeTermsCollect={freightChargeTermsCollect}
                        setFreightChargeTermsCollect={setFreightChargeTermsCollect}
                        freightChargeTerms3rdParty={freightChargeTerms3rdParty}
                        setFreightChargeTerms3rdParty={setFreightChargeTerms3rdParty}
                        freightChargeTermsMaster={freightChargeTermsMaster}
                        setFreightChargeTermsMaster={setFreightChargeTermsMaster}
                        feeTermsCollect={feeTermsCollect}
                        setFeeTermsCollect={setFeeTermsCollect}
                        feeTermsPrepaid={feeTermsPrepaid}
                        setFeeTermsPrepaid={setFeeTermsPrepaid}
                        feeTermsCheck={feeTermsCheck}
                        setFeeTermsCheck={setFeeTermsCheck}
                        trailerLoadedByShipper={trailerLoadedByShipper}
                        setTrailerLoadedByShipper={setTrailerLoadedByShipper}
                        trailerLoadedByDriver={trailerLoadedByDriver}
                        setTrailerLoadedByDriver={setTrailerLoadedByDriver}
                        freightCountedByShipper={freightCountedByShipper}
                        setFreightCountedByShipper={setFreightCountedByShipper}
                        freightCountedByDriverPallets={freightCountedByDriverPallets}
                        setFreightCountedByDriverPallets={setFreightCountedByDriverPallets}
                        freightCountedByDriverPieces={freightCountedByDriverPieces}
                        setFreightCountedByDriverPieces={setFreightCountedByDriverPieces}
                    />
                </div>
            </div>

            {
                emailRecipientInputTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <EmailRecipientInput
                            title={'E-Mail Customer BOL'}
                            dataEmail={dataEmail}
                            successMessage={`Customer BOL has been sent!`}
                            sendingUrl="/sendBolEmail"
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
        selectedCompany: state.companySetupReducers.selectedCompany,

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

})(Bol)