import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux';
import './Invoice.css';
import classnames from 'classnames';
import MaskedInput from 'react-text-mask';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';
import Highlighter from "react-highlight-words";
import moment from 'moment';
import NumberFormat from 'react-number-format';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import {
    setSelectedOrder,
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

import {
    Customers,
    Carriers
} from './../../company';

import {
    Documents,
    Modal,
    Calendar,
    Invoice as InvoicePreview
} from './../panels';

import ToPrintInvoice from './../panels/invoice/ToPrint';
import { useReactToPrint } from 'react-to-print';


var delayTimer = null;

const Invoice = (props) => {
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedBillToCustomer, setSelectedBillToCustomer] = useState({});
    const [selectedBillToCustomerContact, setSelectedBillToCustomerContact] = useState({});
    const [selectedCarrier, setSelectedCarrier] = useState({});
    const [selectedCarrierContact, setSelectedCarrierContact] = useState({});
    const [selectedCarrierDriver, setSelectedCarrierDriver] = useState({});
    const [selectedCarrierInsurance, setSelectedCarrierInsurance] = useState({});
    const [selectedOrderDocument, setSelectedOrderDocument] = useState({});
    const [selectedBillingDocument, setSelectedBillingDocument] = useState({});
    const [selectedInternalNote, setSelectedInternalNote] = useState({});
    const [selectedBillingNote, setSelectedBillingNote] = useState({});
    const [orderNumber, setOrderNumber] = useState('');
    const [tripNumber, setTripNumber] = useState('');
    const [selectedRoute, setSelectedRoute] = useState({});


    const refPrintInvoice = useRef();

    const [selectedBillToRating, setSelectedBillToRating] = useState({});
    const refBillToRateTypes = useRef();
    const refBillToDescription = useRef();
    const refBillToPieces = useRef();
    const refBillToWeight = useRef();
    const refBillToFeetRequired = useRef();
    const refBillToSubtypeFuelSurcharge = useRef();
    const refBillToSubtypeFuelSurchargePercentage = useRef();
    const refBillToSubtypeFuelSurchargeRate = useRef();
    const refBillToSubtypeLinehaulRate = useRef();
    const refBillToSubtypeLayover = useRef();
    const refBillToSubtypeLayoverRate = useRef();
    const refBillToSubtypeLayoverDays = useRef();
    const refBillToSubtypeDetention = useRef();
    const refBillToSubtypeDetentionRate = useRef();
    const refBillToSubtypeDetentionHours = useRef();
    const refBillToSubtypeDriverAssist = useRef();
    const refBillToSubtypeDriverAssistRate = useRef();
    const refBillToSubtypeDriverAssistHours = useRef();
    const refBillToTotalCharges = useRef();

    const [billToRateTypeItems, setBillToRateTypeItems] = useState([]);
    const refBillToRateTypeDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToRateTypeItems([])
        }
    });
    const refBillToRateTypePopupItems = useRef([]);

    const [billToPiecesItems, setBillToPiecesItems] = useState([
        {
            id: 1,
            name: 'Pieces',
            value: 'pc',
            selected: false
        },
        {
            id: 2,
            name: 'Skids',
            value: 'sk',
            selected: false
        }
    ]);
    const [showBillToPiecesItems, setShowBillToPiecesItems] = useState(false);
    const refBillToPiecesDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setShowBillToPiecesItems(false)
        }
    });
    const refBillToPiecesPopupItems = useRef([]);

    const [billToSubtypeFuelSurchargeItems, setBillToSubtypeFuelSurchargeItems] = useState([]);
    const [showBillToSubtypeFuelSurchargeItems, setShowBillToSubtypeFuelSurchargeItems] = useState(false);
    const refBillToSubtypeFuelSurchargeDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToSubtypeFuelSurchargeItems([])
        }
    });
    const refBillToSubtypeFuelSurchargePopupItems = useRef([]);

    const [billToSubtypeLinehaulItems, setBillToSubtypeLinehaulItems] = useState([]);
    const [showBillToSubtypeLinehaulItems, setShowBillToSubtypeLinehaulItems] = useState(false);
    const refBillToSubtypeLinehaulDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToSubtypeLinehaulItems([])
        }
    });
    const refBillToSubtypeLinehaulPopupItems = useRef([]);

    const [billToSubtypeLayoverItems, setBillToSubtypeLayoverItems] = useState([]);
    const [showBillToSubtypeLayoverItems, setShowBillToSubtypeLayoverItems] = useState(false);
    const refBillToSubtypeLayoverDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToSubtypeLayoverItems([])
        }
    });
    const refBillToSubtypeLayoverPopupItems = useRef([]);

    const [billToSubtypeDetentionItems, setBillToSubtypeDetentionItems] = useState([]);
    const [showBillToSubtypeDetentionItems, setShowBillToSubtypeDetentionItems] = useState(false);
    const refBillToSubtypeDetentionDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToSubtypeDetentionItems([])
        }
    });
    const refBillToSubtypeDetentionPopupItems = useRef([]);

    const [billToSubtypeDriverAssistItems, setBillToSubtypeDriverAssistItems] = useState([]);
    const [showBillToSubtypeDriverAssistItems, setShowBillToSubtypeDriverAssistItems] = useState(false);
    const refBillToSubtypeDriverAssistDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setBillToSubtypeDriverAssistItems([])
        }
    });
    const refBillToSubtypeDriverAssistPopupItems = useRef([]);


    const [selectedCarrierRating, setSelectedCarrierRating] = useState({});
    const refCarrierRateTypes = useRef();
    const refCarrierDescription = useRef();
    const refCarrierPieces = useRef();
    const refCarrierWeight = useRef();
    const refCarrierFeetRequired = useRef();
    const refCarrierSubtypeFuelSurcharge = useRef();
    const refCarrierSubtypeFuelSurchargePercentage = useRef();
    const refCarrierSubtypeFuelSurchargeRate = useRef();
    const refCarrierSubtypeLinehaul = useRef();
    const refCarrierSubtypeLinehaulRate = useRef();
    const refCarrierSubtypeLayover = useRef();
    const refCarrierSubtypeLayoverRate = useRef();
    const refCarrierSubtypeLayoverDays = useRef();
    const refCarrierSubtypeDetention = useRef();
    const refCarrierSubtypeDetentionRate = useRef();
    const refCarrierSubtypeDetentionHours = useRef();
    const refCarrierSubtypeDriverAssist = useRef();
    const refCarrierSubtypeDriverAssistRate = useRef();
    const refCarrierSubtypeDriverAssistHours = useRef();
    const refCarrierTotalCharges = useRef();

    const [carrierRateTypeItems, setCarrierRateTypeItems] = useState([]);
    const refCarrierRateTypeDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierRateTypeItems([])
        }
    });
    const refCarrierRateTypePopupItems = useRef([]);

    const [carrierPiecesItems, setCarrierPiecesItems] = useState([
        {
            id: 1,
            name: 'Pieces',
            value: 'pc',
            selected: false
        },
        {
            id: 2,
            name: 'Skids',
            value: 'sk',
            selected: false
        }
    ]);
    const [showCarrierPiecesItems, setShowCarrierPiecesItems] = useState(false);
    const refCarrierPiecesDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setShowCarrierPiecesItems(false)
        }
    });
    const refCarrierPiecesPopupItems = useRef([]);

    const [carrierSubtypeFuelSurchargeItems, setCarrierSubtypeFuelSurchargeItems] = useState([]);
    const [showCarrierSubtypeFuelSurchargeItems, setShowCarrierSubtypeFuelSurchargeItems] = useState(false);
    const refCarrierSubtypeFuelSurchargeDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierSubtypeFuelSurchargeItems([])
        }
    });
    const refCarrierSubtypeFuelSurchargePopupItems = useRef([]);

    const [carrierSubtypeLinehaulItems, setCarrierSubtypeLinehaulItems] = useState([]);
    const [showCarrierSubtypeLinehaulItems, setShowCarrierSubtypeLinehaulItems] = useState(false);
    const refCarrierSubtypeLinehaulDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierSubtypeLinehaulItems([])
        }
    });
    const refCarrierSubtypeLinehaulPopupItems = useRef([]);

    const [carrierSubtypeLayoverItems, setCarrierSubtypeLayoverItems] = useState([]);
    const [showCarrierSubtypeLayoverItems, setShowCarrierSubtypeLayoverItems] = useState(false);
    const refCarrierSubtypeLayoverDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierSubtypeLayoverItems([])
        }
    });
    const refCarrierSubtypeLayoverPopupItems = useRef([]);

    const [carrierSubtypeDetentionItems, setCarrierSubtypeDetentionItems] = useState([]);
    const [showCarrierSubtypeDetentionItems, setShowCarrierSubtypeDetentionItems] = useState(false);
    const refCarrierSubtypeDetentionDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierSubtypeDetentionItems([])
        }
    });
    const refCarrierSubtypeDetentionPopupItems = useRef([]);

    const [carrierSubtypeDriverAssistItems, setCarrierSubtypeDriverAssistItems] = useState([]);
    const [showCarrierSubtypeDriverAssistItems, setShowCarrierSubtypeDriverAssistItems] = useState(false);
    const refCarrierSubtypeDriverAssistDropDown = useDetectClickOutside({
        onTriggered: async () => {
            setCarrierSubtypeDriverAssistItems([])
        }
    });
    const refCarrierSubtypeDriverAssistPopupItems = useRef([]);

    const refDateReceived = useRef();
    const [preSelectedDateReceived, setPreSelectedDateReceived] = useState(moment());
    const [isDateReceivedCalendarShown, setIsDateReceivedCalendarShown] = useState(false);
    const refDateReceivedCalendarDropDown = useDetectClickOutside({
        onTriggered: (e) => {
            let sameTarget = false;

            (e.path || []).map(el => {
                try {
                    if (el.matches('.date-received-calendar')) {
                        sameTarget = true;
                    }
                } catch (e) {

                }
            })

            if (!sameTarget) {
                setIsDateReceivedCalendarShown(false)
            }
        }
    });

    const refInvoiceReceivedDate = useRef();
    const [preSelectedInvoiceReceivedDate, setPreSelectedInvoiceReceivedDate] = useState(moment());
    const [isInvoiceReceivedDateCalendarShown, setIsInvoiceReceivedDateCalendarShown] = useState(false);
    const refInvoiceReceivedDateCalendarDropDown = useDetectClickOutside({
        onTriggered: (e) => {
            let sameTarget = false;

            (e.path || []).map(el => {
                try {
                    if (el.matches('.invoice-received-date-calendar')) {
                        sameTarget = true;
                    }
                } catch (e) {

                }
            })

            if (!sameTarget) {
                setIsInvoiceReceivedDateCalendarShown(false)
            }
        }
    });

    const refDatePaid = useRef();
    const [preSelectedDatePaid, setPreSelectedDatePaid] = useState(moment());
    const [isDatePaidCalendarShown, setIsDatePaidCalendarShown] = useState(false);
    const refDatePaidCalendarDropDown = useDetectClickOutside({
        onTriggered: (e) => {
            let sameTarget = false;

            (e.path || []).map(el => {
                try {
                    if (el.matches('.date-paid-calendar')) {
                        sameTarget = true;
                    }
                } catch (e) {

                }
            })

            if (!sameTarget) {
                setIsDatePaidCalendarShown(false)
            }
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const validateOrderForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingOrder) {
                setIsSavingOrder(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingOrder) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingOrder(false);
                return;
            }

            let selected_order = { ...selectedOrder } || { order_number: 0 };

            // check if there's a bill-to-company loaded
            if ((selectedBillToCustomer?.id || 0) === 0) {
                setIsSavingOrder(false);
                // setMileageLoaderVisible(false);
                setIsLoading(false);
                return;
            }

            selected_order.bill_to_customer_id = (selectedBillToCustomer?.id || 0) === 0 ? null : selectedBillToCustomer.id;
            selected_order.carrier_id = (selectedCarrier?.id || 0) === 0 ? null : selectedCarrier.id;
            selected_order.carrier_driver_id = (selectedCarrierDriver?.id || 0) === 0 ? null : selectedCarrierDriver.id;

            if ((selected_order.ae_number || '') === '') {
                selected_order.ae_number = getRandomInt(1, 100);
            }

            if ((selected_order?.id || 0) === 0 && (selected_order.pickups || []).length === 1 && selected_order.pickups[0].id === 0 && (selected_order.pickups[0].customer_id || 0) > 0) {
                selected_order.pickups = (selected_order.pickups || []).map((pu, i) => {
                    pu.pu_date1 = getFormattedDates(pu.pu_date1 || '');
                    pu.pu_date2 = getFormattedDates(pu.pu_date2 || '');
                    pu.pu_time1 = getFormattedHours(pu.pu_time1 || '');
                    pu.pu_time2 = getFormattedHours(pu.pu_time2 || '');
                    return pu;
                });
            } else {
                selected_order.pickups = []; // se envia vacio para no tocarlo
            }

            if ((selected_order?.id || 0) === 0 && (selected_order.deliveries || []).length === 1 && selected_order.deliveries[0].id === 0 && (selected_order.deliveries[0].customer_id || 0) > 0) {
                selected_order.deliveries = (selected_order.deliveries || []).map((delivery, i) => {
                    delivery.delivery_date1 = getFormattedDates(delivery.delivery_date1 || '');
                    delivery.delivery_date2 = getFormattedDates(delivery.delivery_date2 || '');
                    delivery.delivery_time1 = getFormattedHours(delivery.delivery_time1 || '');
                    delivery.delivery_time2 = getFormattedHours(delivery.delivery_time2 || '');
                    return delivery;
                });
            } else {
                selected_order.deliveries = []; // se envia vacio para no tocarlo
            }

            axios.post(props.serverUrl + '/saveOrder', selected_order).then(res => {
                if (res.data.result === 'OK') {
                    // setSelectedOrder({ ...res.data.order });

                    props.setSelectedOrder({
                        ...res.data.order,
                        component_id: props.componentId
                    });
                } else {

                }

                setIsSavingOrder(false);
                setIsLoading(false);
            }).catch(e => {
                console.log('error saving order', e);
                setIsSavingOrder(false);
                setIsLoading(false);
            });
        }
    }, [isSavingOrder]);

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const dateReceivedTransition = useTransition(isDateReceivedCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isDateReceivedCalendarShown,
        config: { duration: 100 }
    });

    const invoiceReceivedDateTransition = useTransition(isInvoiceReceivedDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% - 300px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% - 305px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% - 300px)' },
        reverse: isInvoiceReceivedDateCalendarShown,
        config: { duration: 100 }
    });

    const datePaidTransition = useTransition(isDatePaidCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% - 300px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% - 305px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% - 300px)' },
        reverse: isDatePaidCalendarShown,
        config: { duration: 100 }
    });

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    const billToRateTypeTransition = useTransition(billToRateTypeItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: billToRateTypeItems.length > 0
    });

    const billToPiecesTransition = useTransition(showBillToPiecesItems, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showBillToPiecesItems
    });

    const billToSubtypeFuelSurchargeTransition = useTransition(billToSubtypeFuelSurchargeItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: billToSubtypeFuelSurchargeItems.length > 0
    });

    const billToSubtypeLayoverTransition = useTransition(billToSubtypeLayoverItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: billToSubtypeLayoverItems.length > 0
    });

    const billToSubtypeDetentionTransition = useTransition(billToSubtypeDetentionItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: billToSubtypeDetentionItems.length > 0
    });

    const billToSubtypeDriverAssistTransition = useTransition(billToSubtypeDriverAssistItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: billToSubtypeDriverAssistItems.length > 0
    });

    const carrierRateTypeTransition = useTransition(carrierRateTypeItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: carrierRateTypeItems.length > 0
    });

    const carrierPiecesTransition = useTransition(showCarrierPiecesItems, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showCarrierPiecesItems
    });

    const carrierSubtypeFuelSurchargeTransition = useTransition(carrierSubtypeFuelSurchargeItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: carrierSubtypeFuelSurchargeItems.length > 0
    });

    const carrierSubtypeLayoverTransition = useTransition(carrierSubtypeLayoverItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: carrierSubtypeLayoverItems.length > 0
    });

    const carrierSubtypeDetentionTransition = useTransition(carrierSubtypeDetentionItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: carrierSubtypeDetentionItems.length > 0
    });

    const carrierSubtypeDriverAssistTransition = useTransition(carrierSubtypeDriverAssistItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: carrierSubtypeDriverAssistItems.length > 0
    });

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

    useEffect(() => {
        if ((props.selectedCustomer?.component_id || '') !== props.componentId) {
            if (((selectedBillToCustomer?.id || 0) > 0 && (props.selectedCustomer?.id || 0) > 0) && selectedBillToCustomer.id === props.selectedCustomer.id) {
                setSelectedBillToCustomer(selectedBillToCustomer => {
                    return {
                        ...selectedBillToCustomer,
                        ...props.selectedCustomer
                    }
                })
            }
        }
    }, [props.selectedCustomer])

    useEffect(() => {
        if ((props.selectedCustomerContact?.component_id || '') !== props.componentId) {
            if (((selectedBillToCustomerContact?.id || 0) > 0 && (props.selectedCustomerContact?.id || 0) > 0) && selectedBillToCustomerContact.id === props.selectedCustomerContact.id) {
                setSelectedBillToCustomerContact(selectedBillToCustomerContact => {
                    return {
                        ...selectedBillToCustomerContact,
                        ...props.selectedCustomerContact
                    }
                })
            }
        }
    }, [props.selectedCustomerContact])

    useEffect(() => {
        if ((props.selectedCarrier?.change_carrier || false)) {
            setSelectedCarrier({
                ...props.selectedCarrier
            })
        } else {
            if ((props.selectedCarrier?.component_id || '') !== props.componentId) {
                if (((selectedCarrier?.id || 0) > 0 && (props.selectedCarrier?.id || 0) > 0) && selectedCarrier.id === props.selectedCarrier.id) {
                    setSelectedCarrier(selectedCarrier => {
                        return {
                            ...selectedCarrier,
                            ...props.selectedCarrier
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrier])

    useEffect(() => {
        if ((props.selectedCarrierContact?.change_carrier || false)) {
            setSelectedCarrierContact({
                ...props.selectedCarrierContact
            })
        } else {
            if ((props.selectedCarrierContact?.component_id || '') !== props.componentId) {
                if (((selectedCarrierContact?.id || 0) > 0 && (props.selectedCarrierContact?.id || 0) > 0) && selectedCarrierContact.id === props.selectedCarrierContact.id) {
                    setSelectedCarrierContact(selectedCarrierContact => {
                        return {
                            ...selectedCarrierContact,
                            ...props.selectedCarrierContact
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrierContact])

    useEffect(() => {
        if ((props.selectedCarrierDriver?.change_carrier || false)) {
            setSelectedCarrierDriver({
                ...props.selectedCarrierDriver
            })
        } else {
            if ((props.selectedCarrierDriver?.component_id || '') !== props.componentId) {
                if (((selectedCarrierDriver?.id || 0) > 0 && (props.selectedCarrierDriver?.id || 0) > 0) && selectedCarrierDriver.id === props.selectedCarrierDriver.id) {
                    setSelectedCarrierDriver(selectedCarrierDriver => {
                        return {
                            ...selectedCarrierDriver,
                            ...props.selectedCarrierDriver
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrierDriver])

    const refOrderNumber = useRef();

    const currencyMask = createNumberMask({
        prefix: '$ ',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2, // how many digits allowed after the decimal
        integerLimit: 15, // limit length of integer numbers
        allowNegative: true,
        allowLeadingZeroes: false,
    })

    const numberMask = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 15,
        allowNegative: true,
        allowLeadingZeroes: false,
    })

    useEffect(() => {
        if ((props.order_id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getOrderById', { id: props.order_id }).then(res => {
                if (res.data.result === 'OK') {
                    let order = JSON.parse(JSON.stringify(res.data.order));
                    setSelectedOrder({});
                    setSelectedOrder(order);

                    setSelectedBillToCustomer({ ...order.bill_to_company });
                    setSelectedBillToCustomerContact({ ...(order.bill_to_company?.contacts || []).find(c => c.is_primary === 1) });

                    let firstPickupId = (order.routing || []).find(r => r.type === 'pickup')?.pickup_id || 0;
                    setSelectedRoute((order.pickups || []).find(p => p.id === firstPickupId) || {});

                    setSelectedCarrier({ ...order.carrier });
                    setSelectedCarrierContact({ ...(order.carrier?.contacts || []).find(c => c.is_primary === 1) });
                    setSelectedCarrierDriver({
                        ...order.driver,
                        name: (order.driver?.first_name || '') + ((order.driver?.last_name || '').trim() === '' ? '' : ' ' + (order.driver?.last_name || ''))
                    });

                    setIsLoading(false);

                    refOrderNumber.current.focus({
                        preventScroll: true
                    });
                }
            }).catch(e => {
                console.log('error getting order by id', e);
                setIsLoading(false);
            })
        } else {
            refOrderNumber.current.focus({
                preventScroll: true
            });
        }

        updateSystemDateTime();
    }, [])

    useEffect(() => {
        if (props.screenFocused) {
            refOrderNumber.current.focus({
                preventScroll: true
            });
        }
    }, [props.screenFocused])

    const [currentSystemDateTime, setCurrentSystemDateTime] = useState(moment());

    const updateSystemDateTime = () => {
        window.setTimeout(() => {
            setCurrentSystemDateTime(moment());
            updateSystemDateTime();
        }, 1000)
    }

    const [billToRateType, setBillToRateType] = useState({});
    const [carrierChargesRateType, setCarrierChargesRateType] = useState({});
    const [term, setTerm] = useState({});

    // const refBillToRateTypes = useRef();
    // const [billToRateTypeItems, setBillToRateTypeItems] = useState([]);
    // const refBillToRateTypeDropDown = useDetectClickOutside({ onTriggered: async () => { await setBillToRateTypeItems([]) } });
    // const refBillToRateTypePopupItems = useRef([]);

    const refCarrierChargesRateTypes = useRef();
    const [carrierChargesRateTypeItems, setCarrierChargesRateTypeItems] = useState([]);
    const refCarrierChargesRateTypeDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setCarrierChargesRateTypeItems([])
        }
    });
    const refCarrierChargesRateTypePopupItems = useRef([]);

    const refTerms = useRef();
    const [termsItems, setTermsItems] = useState([]);
    const refTermsDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setTermsItems([])
        }
    });
    const refTermsPopupItems = useRef([]);


    const [isSavingBillToCompanyInfo, setIsSavingBillToCompanyInfo] = useState(false);
    const [isSavingBillToCompanyContact, setIsSavingBillToCompanyContact] = useState(false);
    const [isSavingCarrierInfo, setIsSavingCarrierInfo] = useState(false);
    const [isSavingCarrierContact, setIsSavingCarrierContact] = useState(false);
    const [isSavingCarrierDriver, setIsSavingCarrierDriver] = useState(false);

    const refEquipment = useRef();
    const refDriverName = useRef();

    const [equipmentItems, setEquipmentItems] = useState([]);
    const refEquipmentDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setEquipmentItems([])
        }
    });
    const refEquipmentPopupItems = useRef([]);

    const [driverItems, setDriverItems] = useState([]);
    const refDriverDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setDriverItems([])
        }
    });
    const refDriverPopupItems = useRef([]);

    const equipmentTransition = useTransition(equipmentItems.length > 0, {
        from: { opacity: 0, top: -155 },
        enter: { opacity: 1, top: -160 },
        leave: { opacity: 0, top: -155 },
        config: { duration: 100 },
        reverse: equipmentItems.length > 0
    });

    const driverTransition = useTransition(driverItems.length > 0, {
        from: { opacity: 0, top: -155 },
        enter: { opacity: 1, top: -160 },
        leave: { opacity: 0, top: -155 },
        config: { duration: 100 },
        reverse: driverItems.length > 0
    });

    const termsTransition = useTransition(termsItems.length > 0, {
        from: { opacity: 0, top: -155 },
        enter: { opacity: 1, top: -160 },
        leave: { opacity: 0, top: -155 },
        config: { duration: 100 },
        reverse: termsItems.length > 0
    });

    const getOrderByOrderNumber = (e, action = null) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if ((selectedOrder.order_number || '') !== '') {
                setIsLoading(true);
                axios.post(props.serverUrl + '/getOrderByOrderNumber', { order_number: selectedOrder.order_number, action: action }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.order) {
                            setSelectedOrder({ ...res.data.order });
                            setOrderNumber(res.data.order.order_number);
                            setTripNumber(res.data.order.trip_number);
                            setSelectedBillToCustomer(res.data.order.bill_to_company || {});
                            setSelectedBillToCustomerContact(res.data.order.bill_to_company?.contacts || [].find(c => c.is_primary === 1) || {});

                            let firstPickupId = (res.data.order.routing || []).find(r => r.type === 'pickup')?.pickup_id || 0;
                            setSelectedRoute((res.data.order.pickups || []).find(p => p.id === firstPickupId) || {});

                            setSelectedCarrier(res.data.order.carrier || {});
                            setSelectedCarrierContact(res.data.order.carrier?.contacts || [].find(c => c.is_primary === 1) || {});
                            setSelectedCarrierDriver(res.data.order.driver || {});
                        } else {
                            setSelectedOrder(selectedOrder => {
                                return {
                                    ...selectedOrder,
                                    order_number: orderNumber
                                }
                            })
                        }
                    }
                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting order by order number', e);
                    setIsLoading(false);
                });
            } else {
                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        order_number: orderNumber
                    }
                })
            }
        }
    }

    const getOrderByTripNumber = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if ((selectedOrder.trip_number || '') !== '') {
                setIsLoading(true);
                axios.post(props.serverUrl + '/getOrderByTripNumber', { trip_number: selectedOrder.trip_number }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.order) {
                            setSelectedOrder({ ...res.data.order });
                            setOrderNumber(res.data.order.order_number);
                            setTripNumber(res.data.order.trip_number);
                            setSelectedBillToCustomer(res.data.order.bill_to_company || {});
                            setSelectedBillToCustomerContact(res.data.order.bill_to_company?.contacts || [].find(c => c.is_primary === 1) || {});

                            let firstPickupId = (res.data.order.routing || []).find(r => r.type === 'pickup')?.pickup_id || 0;
                            setSelectedRoute((res.data.order.pickups || []).find(p => p.id === firstPickupId) || {});

                            setSelectedCarrier(res.data.order.carrier || {});
                            setSelectedCarrierContact(res.data.order.carrier?.contacts || [].find(c => c.is_primary === 1) || {});
                            setSelectedCarrierDriver(res.data.order.driver || {});
                        } else {
                            setSelectedOrder(selectedOrder => {
                                return {
                                    ...selectedOrder,
                                    trip_number: tripNumber
                                }
                            })
                        }
                    }
                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting order by trip number', e);
                    setIsLoading(false);
                });
            } else {
                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        trip_number: tripNumber
                    }
                })
            }
        }
    }

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
        content: () => refPrintInvoice.current,
    });

    useEffect(() => {
        if (isSavingBillToCompanyInfo) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingBillToCompanyInfo(false);
                return;
            }

            if ((selectedBillToCustomer.id || 0) === 0) {
                return;
            }

            let selectedBillToCompanyInfo = selectedBillToCustomer;

            if (selectedBillToCompanyInfo.id === undefined || selectedBillToCompanyInfo.id === -1) {
                selectedBillToCompanyInfo.id = 0;
                setSelectedBillToCustomer({ ...selectedBillToCustomer, id: 0 });
            }

            if (
                (selectedBillToCompanyInfo.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedBillToCompanyInfo.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedBillToCompanyInfo.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedBillToCompanyInfo.address1 || '').trim() !== "" &&
                (selectedBillToCompanyInfo.zip || '').trim() !== ""
            ) {
                let parseCity = selectedBillToCompanyInfo.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let mailingParseCity = (selectedBillToCompanyInfo.mailing_city || '').trim().replace(/\s/g, "").substring(0, 3);

                if (mailingParseCity.toLowerCase() === "ft.") {
                    mailingParseCity = "FO";
                }
                if (mailingParseCity.toLowerCase() === "mt.") {
                    mailingParseCity = "MO";
                }
                if (mailingParseCity.toLowerCase() === "st.") {
                    mailingParseCity = "SA";
                }

                let newCode = (selectedBillToCompanyInfo.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (selectedBillToCompanyInfo.state || '').trim().replace(/\s/g, "").substring(0, 2);
                let mailingNewCode = (selectedBillToCompanyInfo.mailing_name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + mailingParseCity.substring(0, 2) + (selectedBillToCompanyInfo.mailing_state || '').trim().replace(/\s/g, "").substring(0, 2);

                selectedBillToCompanyInfo.code = newCode.toUpperCase();
                selectedBillToCompanyInfo.mailing_code = mailingNewCode.toUpperCase();

                axios.post(props.serverUrl + '/saveCustomer', selectedBillToCompanyInfo).then(res => {
                    if (res.data.result === 'OK') {
                        if (selectedBillToCustomer.id === undefined || (selectedBillToCustomer.id || 0) === 0) {
                            setSelectedBillToCustomer({ ...selectedBillToCustomer, id: res.data.customer.id });
                        }

                        (res.data.customer.contacts || []).map((contact, index) => {

                            if (contact.is_primary === 1) {
                                setSelectedBillToCustomerContact(contact);
                            }

                            return true;
                        });
                    }

                    setIsSavingBillToCompanyInfo(false);
                }).catch(e => {
                    console.log('error saving bill to company', e);
                    setIsSavingBillToCompanyInfo(false);
                });
            }
        }
    }, [isSavingBillToCompanyInfo])

    const validateBillToCompanyInfoForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingBillToCompanyInfo) {
                setIsSavingBillToCompanyInfo(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingBillToCompanyContact) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingBillToCompanyContact(false);
                return;
            }

            if (selectedBillToCustomer.id === undefined) {
                return;
            }

            let contact = selectedBillToCustomerContact;

            if (contact.customer_id === undefined || contact.customer_id === 0) {
                contact.customer_id = selectedBillToCustomer.id;
            }

            if ((contact.first_name || '').trim() === '' || (contact.last_name || '').trim() === '' || (contact.phone_work || '').trim() === '') {
                return;
            }

            if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
                contact.address1 = selectedBillToCustomer.address1;
                contact.address2 = selectedBillToCustomer.address2;
                contact.city = selectedBillToCustomer.city;
                contact.state = selectedBillToCustomer.state;
                contact.zip_code = selectedBillToCustomer.zip;
            }

            axios.post(props.serverUrl + '/saveContact', contact).then(async res => {
                if (res.data.result === 'OK') {
                    await setSelectedBillToCustomer({ ...selectedBillToCustomer, contacts: res.data.contacts });
                    await setSelectedBillToCustomerContact(res.data.contact);
                }

                setIsSavingBillToCompanyContact(false);
            }).catch(e => {
                console.log('error saving bill to company contact', e);
                setIsSavingBillToCompanyContact(false);
            });
        }
    }, [isSavingBillToCompanyContact])

    const validateBillToCompanyContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingBillToCompanyContact) {
                setIsSavingBillToCompanyContact(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingCarrierInfo) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingCarrierInfo(false);
                return;
            }

            if ((selectedCarrier.id || 0) === 0) {
                return;
            }

            let selectedInvoiceCarrierInfoCarrier = selectedCarrier;

            if (selectedInvoiceCarrierInfoCarrier.id === undefined || selectedInvoiceCarrierInfoCarrier.id === -1) {
                selectedInvoiceCarrierInfoCarrier.id = 0;
            }

            if (
                (selectedInvoiceCarrierInfoCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedInvoiceCarrierInfoCarrier.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedInvoiceCarrierInfoCarrier.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedInvoiceCarrierInfoCarrier.address1 || '').trim() !== "" &&
                (selectedInvoiceCarrierInfoCarrier.zip || '').trim() !== ""
            ) {
                let parseCity = selectedInvoiceCarrierInfoCarrier.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (selectedInvoiceCarrierInfoCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (selectedInvoiceCarrierInfoCarrier.state || '').trim().replace(/\s/g, "").substring(0, 2);

                selectedInvoiceCarrierInfoCarrier.code = newCode.toUpperCase();

                axios.post(props.serverUrl + '/saveCarrier', selectedInvoiceCarrierInfoCarrier).then(async res => {
                    if (res.data.result === 'OK') {
                        if (selectedCarrier.id === undefined && (selectedCarrier.id || 0) === 0) {
                            await setSelectedCarrier({ ...selectedCarrier, id: res.data.carrier.id });
                        }

                        (res.data.carrier.contacts || []).map(async (contact, index) => {

                            if (contact.is_primary === 1) {
                                await setSelectedCarrierContact(contact);
                            }

                            return true;
                        });
                    }

                    await setIsSavingCarrierInfo(false);
                }).catch(async e => {
                    console.log('error on saving invoice carrier info', e);
                    await setIsSavingCarrierInfo(false);
                });
            }
        }
    }, [isSavingCarrierInfo])

    const validateCarrierInfoForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingCarrierInfo) {
                setIsSavingCarrierInfo(true);
            }
        }
    }

    const insuranceStatusClasses = () => {
        let classes = 'input-box-container insurance-status';
        let curDate = moment().startOf('day');
        let curDate2 = moment();
        let futureMonth = curDate2.add(1, 'M');
        let statusClass = '';

        (selectedCarrier.insurances || []).map((insurance, index) => {
            let expDate = moment(insurance.expiration_date, 'MM/DD/YYYY');

            if (expDate < curDate) {
                statusClass = 'expired';
            } else if (expDate >= curDate && expDate <= futureMonth) {
                if (statusClass !== 'expired') {
                    statusClass = 'warning';
                }
            } else {
                if (statusClass !== 'expired' && statusClass !== 'warning') {
                    statusClass = 'active';
                }
            }
        })

        return classes + ' ' + statusClass;
    }

    useEffect(() => {
        if (isSavingCarrierContact) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingCarrierContact(false);
                return;
            }

            if ((selectedCarrier.id || 0) === 0) {
                return;
            }

            if ((selectedCarrierContact.id || 0) === 0) {
                return;
            }

            let contact = selectedCarrierContact;

            if (contact.carrier_id === undefined || contact.carrier_id === 0) {
                contact.carrier_id = selectedCarrier.id;
            }

            if ((contact.first_name || '').trim() === '' || (contact.last_name || '').trim() === '' || (contact.phone_work || '').trim() === '') {
                return;
            }

            if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
                contact.address1 = selectedCarrier.address1;
                contact.address2 = selectedCarrier.address2;
                contact.city = selectedCarrier.city;
                contact.state = selectedCarrier.state;
                contact.zip_code = selectedCarrier.zip;
            }

            axios.post(props.serverUrl + '/saveCarrierContact', contact).then(async res => {
                if (res.data.result === 'OK') {
                    await setSelectedCarrier({ ...selectedCarrier, contacts: res.data.contacts });
                    await setSelectedCarrierContact(res.data.contact);
                }

                setIsSavingCarrierContact(false);
            }).catch(e => {
                console.log('error on saving invoice carrier contact', e);
                setIsSavingCarrierContact(false);
            });
        }
    }, [isSavingCarrierContact])

    const validateCarrierContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingCarrierContact) {
                setIsSavingCarrierContact(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingCarrierDriver) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
                setIsSavingCarrierDriver(false);
                return;
            }

            let driver = {
                ...selectedCarrierDriver,
                id: (selectedCarrierDriver?.id || 0),
                carrier_id: selectedCarrier.id
            };

            if ((selectedCarrier?.id || 0) > 0) {
                if ((driver.first_name || '').trim() !== '') {
                    axios.post(props.serverUrl + '/saveCarrierDriver', driver).then(async res => {
                        if (res.data.result === 'OK') {
                            await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                            await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                        }

                        await setIsSavingCarrierDriver(false);
                    }).catch(async e => {
                        console.log('error saving carrier driver', e);
                        await setIsSavingCarrierDriver(false);
                    });
                }
            }
        }
    }, [isSavingCarrierDriver])

    const validateCarrierDriverForSaving = async (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingCarrierDriver) {
                setIsSavingCarrierDriver(true);
            }
        }
    }

    const capitalize = (str) => {
        const lower = str.toLowerCase();
        return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    const getFormattedDates = (date) => {
        let formattedDate = date;

        try {
            if (moment(date.trim(), 'MM/DD/YY').format('MM/DD/YY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/YY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/').format('MM/DD/') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD').format('MM/DD') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/').format('MM/') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM').format('MM') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/Y').format('M/D/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D/Y').format('MM/D/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/Y').format('MM/DD/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/DD/Y').format('M/DD/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/DD/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/YY').format('M/D/YY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/YY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/YYYY').format('M/D/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D/YYYY').format('MM/D/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/DD/YYYY').format('M/DD/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/DD/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/').format('M/D/') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D').format('M/D') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D').format('MM/D') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M').format('M') === date.trim()) {
                formattedDate = moment(date.trim(), 'M').format('MM/DD/YYYY');
            }
        } catch (e) {

        }

        return formattedDate;
    }

    const getFormattedHours = (hour) => {
        let formattedHour = hour;

        try {

            if (moment(hour.trim(), 'HH:mm').format('HH:mm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'HH:mm').format('HHmm');
            }

            if (moment(hour.trim(), 'H:mm').format('H:mm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H:mm').format('HHmm');
            }

            if (moment(hour.trim(), 'Hmm').format('Hmm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'Hmm').format('HHmm');
            }

            if (moment(hour.trim(), 'hh:mm a').format('hh:mm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh:mm a').format('HHmm');
            }

            if (moment(hour.trim(), 'h:mm a').format('h:mm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:mm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hh:mma').format('hh:mma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh:mma').format('HHmm');
            }

            if (moment(hour.trim(), 'h:mma').format('h:mma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:mma').format('HHmm');
            }

            if (moment(hour.trim(), 'hhmm a').format('hhmm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hhmm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hmm a').format('hmm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hmm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hhmma').format('hhmma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hhmma').format('HHmm');
            }

            if (moment(hour.trim(), 'hmma').format('hmma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hmma').format('HHmm');
            }

            if (moment(hour.trim(), 'H').format('H') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H').format('HHmm');
            }

            if (moment(hour.trim(), 'HH').format('HH') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'HH').format('HHmm');
            }

            if (moment(hour.trim(), 'h a').format('h a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h a').format('HHmm');
            }

            if (moment(hour.trim(), 'hh a').format('hh a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh a').format('HHmm');
            }

            if (moment(hour.trim(), 'ha').format('ha') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'ha').format('HHmm');
            }

            if (moment(hour.trim(), 'hha').format('hha') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hha').format('HHmm');
            }

            if (moment(hour.trim(), 'h:ma').format('h:ma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:ma').format('HHmm');
            }

            if (moment(hour.trim(), 'H:m').format('H:m') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H:m').format('HHmm');
            }
        } catch (e) {

        }

        return formattedHour;
    }

    const validateCustomerRatingForSaving = (e) => {
        if ((props.user?.user_code?.is_admin || 0) === 0 &&
            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
            return;
        }

        let key = e.keyCode || e.which;

        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
            if (key === 9) {
                e.preventDefault();

                // if ((selectedBillToRating.rate_type?.id || 0) === 0) {
                //     window.alert('You must select a Rate Type!');
                //     refBillToRateTypes.current.focus();
                //     return;
                // }

                if ((selectedBillToRating.description || '').trim() === '') {
                    window.alert('You must enter a description!');
                    refBillToDescription.current.focus();
                    return;
                }

                if ((selectedBillToRating.rate_type?.id || 0) > 0) {
                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'detention') {
                        if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedBillToRating.rate_type.name.toLowerCase()} type!`);
                            refBillToSubtypeDetention.current.focus();
                            return;
                        }

                        if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === 'hours') {
                            if ((selectedBillToRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per hour!`);
                                refBillToSubtypeDetentionRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedBillToRating.hours || 0) === 0) {
                                window.alert(`You must enter the hours!`);
                                refBillToSubtypeDetentionHours.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedBillToRating.pieces = '';
                    }

                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'driver assist') {
                        if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedBillToRating.rate_type.name.toLowerCase()} type!`);
                            refBillToSubtypeDriverAssist.current.focus();
                            return;
                        }

                        if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === 'hours') {
                            if ((selectedBillToRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per hour!`);
                                refBillToSubtypeDriverAssistRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedBillToRating.hours || 0) === 0) {
                                window.alert(`You must enter the hours!`);
                                refBillToSubtypeDriverAssistHours.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedBillToRating.pieces = '';
                    }

                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat') {
                        // if ((selectedBillToRating.pieces || '') === '') {
                        //     window.alert(`You must enter the pieces/skids!`);
                        //     refBillToPieces.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedBillToRating.weight || 0) === 0) {
                        //     window.alert(`You must enter the weight!`);
                        //     refBillToWeight.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) {
                        //     if ((selectedBillToRating.feet_required || 0) === 0) {
                        //         window.alert(`You must enter the feet required!`);
                        //         refBillToFeetRequired.current.inputElement.focus();
                        //         return;
                        //     }
                        // }
                    }

                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge') {
                        if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must enter the fuel surcharge type!`);
                            refBillToSubtypeFuelSurcharge.current.focus();
                            return;
                        }

                        if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'percentage') {
                            if ((selectedBillToRating.percentage || 0) === 0) {
                                window.alert(`You must enter the linehaul percentage!`);
                                refBillToSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                return;
                            }
                        }

                        if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'miles') {
                            if ((selectedBillToRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per mile!`);
                                refBillToSubtypeFuelSurchargeRate.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedBillToRating.pieces = '';
                    }

                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'layover') {
                        if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedBillToRating.rate_type.name.toLowerCase()} type!`);
                            refBillToSubtypeLayover.current.focus();
                            return;
                        }

                        if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === 'days') {
                            if ((selectedBillToRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per day!`);
                                refBillToSubtypeLayoverRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedBillToRating.days || 0) === 0) {
                                window.alert(`You must enter the days!`);
                                refBillToSubtypeLayoverDays.current.focus();
                                return;
                            }
                        }

                        selectedBillToRating.pieces = '';
                    }

                    if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                        // if ((selectedBillToRating.pieces || '') === '') {
                        //     window.alert(`You must select the pieces/skids!`);
                        //     refBillToPieces.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedBillToRating.weight || 0) === 0) {
                        //     window.alert(`You must enter the weight!`);
                        //     refBillToWeight.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) {
                        //     if ((selectedBillToRating.feet_required || 0) === 0) {
                        //         window.alert(`You must enter the feet required!`);
                        //         refBillToFeetRequired.current.inputElement.focus();
                        //         return;
                        //     }
                        // }

                        // if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                        //     window.alert(`You must select the ${selectedBillToRating.rate_type.name.toLowerCase()} type!`);
                        //     refBillToSubtypeLinehaul.current.focus();
                        //     return;
                        // }

                        // if ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === 'miles') {
                        //     if ((selectedBillToRating.rate || 0) === 0) {
                        //         window.alert(`You must enter the rate per mile!`);
                        //         refBillToSubtypeLinehaulRate.current.inputElement.focus();
                        //         return;
                        //     }
                        // }
                    }

                    if ((selectedBillToRating.total_charges || 0) === 0) {
                        if ((selectedBillToRating?.rate_type?.name || '').toLowerCase() !== 'comment') {
                            window.alert('You must enter the total charges!');
                            refBillToTotalCharges.current.inputElement.focus();
                            return;
                        }
                    }
                }

                selectedBillToRating.order_id = (selectedOrder?.id || 0);

                selectedBillToRating.pieces = Number((selectedBillToRating.pieces || 0).toString().replace(',', ''));
                selectedBillToRating.percentage = Number((selectedBillToRating.percentage || 0).toString().replace(',', ''));
                selectedBillToRating.hours = Number((selectedBillToRating.hours || 0).toString().replace(',', ''));
                selectedBillToRating.days = Number((selectedBillToRating.days || 0).toString().replace(',', ''));
                selectedBillToRating.weight = Number((selectedBillToRating.weight || 0).toString().replace(',', ''));
                selectedBillToRating.feet_required = Number((selectedBillToRating.feet_required || 0).toString().replace(',', ''));
                selectedBillToRating.rate = Number((selectedBillToRating.rate || 0).toString().replace(',', ''));
                selectedBillToRating.total_charges = Number((selectedBillToRating.total_charges || 0).toString().replace(',', ''));

                axios.post(props.serverUrl + '/saveOrderCustomerRating', selectedBillToRating).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedOrder({
                            ...selectedOrder,
                            order_customer_ratings: JSON.parse(JSON.stringify(res.data.order_customer_ratings))
                        });

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            order_customer_ratings: JSON.parse(JSON.stringify(res.data.order_customer_ratings)),
                            component_id: props.componentId
                        })

                        setSelectedBillToRating({});
                        refBillToRateTypes.current.focus();
                    } else {
                        window.alert('An error occurred while saving');
                        refBillToTotalCharges.current.inputElement.focus();
                    }
                }).catch(e => {
                    console.log('error on saving customer rating', e);
                    window.alert('An error occurred while saving');
                    refBillToTotalCharges.current.inputElement.focus();
                });
            }
        }
    }

    const validateCarrierRatingForSaving = (e) => {
        if ((props.user?.user_code?.is_admin || 0) === 0 &&
            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0) {
            return;
        }

        let key = e.keyCode || e.which;

        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
            if (key === 9) {
                e.preventDefault();

                // if ((selectedCarrierRating.rate_type?.id || 0) === 0) {
                //     window.alert('You must select a Rate Type!');
                //     refCarrierRateTypes.current.focus();
                //     return;
                // }

                if ((selectedCarrierRating.description || '').trim() === '') {
                    window.alert('You must enter a description!');
                    refCarrierDescription.current.focus();
                    return;
                }

                if ((selectedCarrierRating.rate_type?.id || 0) > 0) {
                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'detention') {
                        if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedCarrierRating.rate_type.name.toLowerCase()} type!`);
                            refCarrierSubtypeDetention.current.focus();
                            return;
                        }

                        if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === 'hours') {
                            if ((selectedCarrierRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per hour!`);
                                refCarrierSubtypeDetentionRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedCarrierRating.hours || 0) === 0) {
                                window.alert(`You must enter the hours!`);
                                refCarrierSubtypeDetentionHours.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedCarrierRating.pieces = '';
                    }

                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'driver assist') {
                        if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedCarrierRating.rate_type.name.toLowerCase()} type!`);
                            refCarrierSubtypeDriverAssist.current.focus();
                            return;
                        }

                        if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === 'hours') {
                            if ((selectedCarrierRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per hour!`);
                                refCarrierSubtypeDriverAssistRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedCarrierRating.hours || 0) === 0) {
                                window.alert(`You must enter the hours!`);
                                refCarrierSubtypeDriverAssistHours.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedCarrierRating.pieces = '';
                    }

                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'flat') {
                        // if ((selectedCarrierRating.pieces || '') === '') {
                        //     window.alert(`You must enter the pieces/skids!`);
                        //     refCarrierPieces.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedCarrierRating.weight || 0) === 0) {
                        //     window.alert(`You must enter the weight!`);
                        //     refCarrierWeight.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) {
                        //     if ((selectedCarrierRating.feet_required || 0) === 0) {
                        //         window.alert(`You must enter the feet required!`);
                        //         refCarrierFeetRequired.current.inputElement.focus();
                        //         return;
                        //     }
                        // }
                    }

                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge') {
                        if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must enter the fuel surcharge type!`);
                            refCarrierSubtypeFuelSurcharge.current.focus();
                            return;
                        }

                        if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'percentage') {
                            if ((selectedCarrierRating.percentage || 0) === 0) {
                                window.alert(`You must enter the linehaul percentage!`);
                                refCarrierSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                return;
                            }
                        }

                        if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'miles') {
                            if ((selectedCarrierRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per mile!`);
                                refCarrierSubtypeFuelSurchargeRate.current.inputElement.focus();
                                return;
                            }
                        }

                        selectedCarrierRating.pieces = '';
                    }

                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'layover') {
                        if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                            window.alert(`You must select the ${selectedCarrierRating.rate_type.name.toLowerCase()} type!`);
                            refCarrierSubtypeLayover.current.focus();
                            return;
                        }

                        if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === 'days') {
                            if ((selectedCarrierRating.rate || 0) === 0) {
                                window.alert(`You must enter the rate per day!`);
                                refCarrierSubtypeLayoverRate.current.inputElement.focus();
                                return;
                            }

                            if ((selectedCarrierRating.days || 0) === 0) {
                                window.alert(`You must enter the days!`);
                                refCarrierSubtypeLayoverDays.current.focus();
                                return;
                            }
                        }

                        selectedCarrierRating.pieces = '';
                    }

                    if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                        // if ((selectedCarrierRating.pieces || '') === '') {
                        //     window.alert(`You must select the pieces/skids!`);
                        //     refCarrierPieces.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedCarrierRating.weight || 0) === 0) {
                        //     window.alert(`You must enter the weight!`);
                        //     refCarrierWeight.current.inputElement.focus();
                        //     return;
                        // }

                        // if ((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) {
                        //     if ((selectedCarrierRating.feet_required || 0) === 0) {
                        //         window.alert(`You must enter the feet required!`);
                        //         refCarrierFeetRequired.current.inputElement.focus();
                        //         return;
                        //     }
                        // }

                        // if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                        //     window.alert(`You must select the ${selectedCarrierRating.rate_type.name.toLowerCase()} type!`);
                        //     refCarrierSubtypeLinehaul.current.focus();
                        //     return;
                        // }

                        // if ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === 'miles') {
                        //     if ((selectedCarrierRating.rate || 0) === 0) {
                        //         window.alert(`You must enter the rate per mile!`);
                        //         refCarrierSubtypeLinehaulRate.current.inputElement.focus();
                        //         return;
                        //     }
                        // }
                    }

                    if ((selectedCarrierRating.total_charges || 0) === 0) {
                        if ((selectedCarrierRating?.rate_type?.name || '').toLowerCase() !== 'comment') {
                            window.alert('You must enter the total charges!');
                            refCarrierTotalCharges.current.inputElement.focus();
                            return;
                        }
                    }
                }

                selectedCarrierRating.order_id = (selectedOrder?.id || 0);

                selectedCarrierRating.pieces = Number((selectedCarrierRating.pieces || 0).toString().replace(',', ''));
                selectedCarrierRating.percentage = Number((selectedCarrierRating.percentage || 0).toString().replace(',', ''));
                selectedCarrierRating.hours = Number((selectedCarrierRating.hours || 0).toString().replace(',', ''));
                selectedCarrierRating.days = Number((selectedCarrierRating.days || 0).toString().replace(',', ''));
                selectedCarrierRating.weight = Number((selectedCarrierRating.weight || 0).toString().replace(',', ''));
                selectedCarrierRating.feet_required = Number((selectedCarrierRating.feet_required || 0).toString().replace(',', ''));
                selectedCarrierRating.rate = Number((selectedCarrierRating.rate || 0).toString().replace(',', ''));
                selectedCarrierRating.total_charges = Number((selectedCarrierRating.total_charges || 0).toString().replace(',', ''));

                axios.post(props.serverUrl + '/saveOrderCarrierRating', selectedCarrierRating).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedOrder({
                            ...selectedOrder,
                            order_carrier_ratings: JSON.parse(JSON.stringify(res.data.order_carrier_ratings))
                        });

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            order_carrier_ratings: JSON.parse(JSON.stringify(res.data.order_carrier_ratings)),
                            component_id: props.componentId
                        })

                        setSelectedCarrierRating({});
                        refCarrierRateTypes.current.focus();
                    } else {
                        window.alert('An error occurred while saving');
                        refCarrierTotalCharges.current.inputElement.focus();
                    }
                }).catch(e => {
                    console.log('error on saving carrier rating', e);
                    window.alert('An error occurred while saving');
                    refCarrierTotalCharges.current.inputElement.focus();
                });
            }
        }
    }

    const getPickupsOnRouting = () => {
        let pickups = [];

        try {
            (selectedOrder?.routing || []).map((r, i) => {
                if (r.type === 'pickup') {
                    pickups.push(selectedOrder.pickups.find(p => p.id === r.pickup_id))
                }
                return false;
            })
        } catch (e) {

        }

        return pickups;
    }

    const getDeliveriesOnRouting = () => {
        let deliveries = [];

        try {
            (selectedOrder?.routing || []).map((r, i) => {
                if (r.type === 'delivery') {
                    deliveries.push(selectedOrder.deliveries.find(d => d.id === r.delivery_id))
                }
                return false;
            })
        } catch (e) {

        }

        return deliveries;
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
        <div className="invoice-main-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? 'transparent' : 'rgb(250, 250, 250)',
            background: props.isOnPanel ? 'transparent' : '-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : '-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : 'radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative',
        }}
            tabIndex={-1}
            onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {
                    if (e.target.type === undefined) {
                        e.preventDefault();
                        refOrderNumber.current.focus();
                    }
                }
            }}
        >

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            {
                (selectedOrder?.id || 0) > 0 &&
                <div style={{ display: 'none' }}>
                    <ToPrintInvoice
                        ref={refPrintInvoice}
                        serverUrl={props.serverUrl}
                        selectedCompany={props.selectedCompany}
                        selectedOrder={selectedOrder}
                    />
                </div>

            }

            {/* ======================================================= PRIMERA COLUMNA =================================================== */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr 1fr',
                gridGap: '1.5rem',
                paddingBottom: '0.5rem'
            }}>
                <div className="form-bordered-box" style={{
                    borderBottom: 0,
                    borderRight: 0,
                    boxShadow: 'none'
                }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Bill To</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} onClick={() => {
                                setSelectedBillToRating({});
                                refBillToRateTypes.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0),
                                'active': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                            })} style={{
                                pointerEvents: (selectedOrder?.order_invoiced || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    ? 'none' : 'all'
                            }} onClick={() => {
                                let invoice_customer_reviewed = (selectedOrder?.invoice_customer_reviewed || 0) === 0 ? 1 : 0;

                                setSelectedOrder(selectedOrder => {
                                    return {
                                        ...selectedOrder,
                                        invoice_customer_reviewed: invoice_customer_reviewed
                                    }
                                });

                                let selected_order = {
                                    ...selectedOrder,
                                    invoice_customer_reviewed: invoice_customer_reviewed
                                };

                                axios.post(props.serverUrl + '/saveOrder', selected_order).then(res => {
                                    props.setSelectedOrder({
                                        ...res.data.order,
                                        component_id: props.componentId
                                    });

                                    setSelectedBillToRating({});

                                    if ((res.data.order.invoice_customer_reviewed || 0) === 1 &&
                                        (res.data.order.events || []).find(e => (e.event_type_id || 0) === 12) === undefined) {
                                        let event_parameters = {
                                            order_id: res.data.order.id,
                                            time: moment().format('HHmm'),
                                            event_time: moment().format('HHmm'),
                                            date: moment().format('MM/DD/YYYY'),
                                            event_date: moment().format('MM/DD/YYYY'),
                                            user_code_id: props.user.user_code.id || null,
                                            event_location: '',
                                            event_notes: 'Reviewed Customer Invoice',
                                            event_type_id: 12,
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
                                                setIsSavingOrder(false);
                                            } else if (res.data.result === 'ORDER ID NOT VALID') {
                                                window.alert('The order number is not valid!');
                                            }
                                        }).catch(e => {
                                            console.log('error saving order event', e);
                                        })
                                    }
                                }).catch(e => {
                                    console.log('error saving invoice reviewed', e);
                                })
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Reviewed</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} onClick={() => {
                                if ((selectedOrder?.id || 0) === 0) {
                                    window.alert('You must select an order first!');
                                    return;
                                }

                                let panel = {
                                    panelName: `${props.panelName}-documents`,
                                    component: <Documents
                                        title='Documents'
                                        tabTimes={45000 + props.tabTimes}
                                        panelName={`${props.panelName}-documents`}
                                        origin={props.origin}
                                        suborigin={'order-billing'}


                                        componentId={moment().format('x')}

                                        selectedOwner={{ ...selectedOrder }}
                                        selectedOwnerDocument={{
                                            id: 0,
                                            user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                            date_entered: moment().format('MM/DD/YYYY')
                                        }}
                                        savingDocumentUrl='/saveOrderBillingDocument'
                                        deletingDocumentUrl='/deleteOrderBillingDocument'
                                        savingDocumentNoteUrl='/saveOrderBillingDocumentNote'
                                        deletingDocumentNoteUrl='/deleteOrderBillingDocumentNote'
                                        serverDocumentsFolder='/order-billing-documents/'
                                        permissionName='invoice'
                                    />
                                }

                                openPanel(panel, props.origin);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0),
                                'active': (selectedOrder?.order_invoiced || 0) === 1
                            })} style={{
                                // pointerEvents: ((selectedOrder?.invoice_customer_reviewed || 0) === 0 || (selectedOrder?.order_invoiced || 0) === 1) ? 'none' : 'all'
                            }} onClick={() => {
                                let panel = {
                                    panelName: `${props.panelName}-invoice-preview`,
                                    component: <InvoicePreview
                                        title={'Invoice Preview'}
                                        tabTimes={67000 + props.tabTimes}
                                        panelName={`${props.panelName}-invoice-preview`}
                                        origin={props.origin}


                                        componentId={moment().format('x')}
                                        selectedCompany={props.selectedCompany}
                                        selectedOrder={{ ...selectedOrder }}
                                    />
                                }

                                openPanel(panel, props.origin);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div
                                    className="mochi-button-base">{(selectedOrder?.order_invoiced || 0) === 1 ? 'Invoiced' : 'Invoice'}</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>
                    <div className="form-right" style={{
                        position: 'absolute',
                        height: '100%',
                        width: 2,
                        right: -1,
                        top: 0,
                        borderRight: '1px solid rgba(0,0,0,0.5)',
                        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.3)'
                    }}>
                    </div>
                    <div className="form-footer">
                        <div className="bottom-border bottom-border-left"></div>
                        <div className="bottom-border bottom-border-middle"></div>
                        <div className="form-buttons">
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((selectedOrder?.id || 0) === 0 || (selectedBillToRating.id || 0) === 0) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} style={{ marginRight: 10 }} onClick={() => {
                                if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                    if (window.confirm('Are you sure you want to delete this item?')) {
                                        axios.post(props.serverUrl + '/deleteOrderCustomerRating', {
                                            id: selectedBillToRating.id,
                                            order_id: selectedOrder.id
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        order_customer_ratings: JSON.parse(JSON.stringify(res.data.order_customer_ratings)),
                                                    }
                                                });

                                                props.setSelectedOrder({
                                                    id: selectedOrder.id,
                                                    order_customer_ratings: JSON.parse(JSON.stringify(res.data.order_customer_ratings)),
                                                    component_id: props.componentId
                                                })

                                                setSelectedBillToRating({});

                                                refBillToRateTypes.current.focus();
                                            }
                                        }).catch(e => {
                                            console.log('error deleting rating item', e);
                                        })
                                    }
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Delete</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="input-box-container" style={{
                                width: '10rem',
                                minWidth: '10rem',
                                maxWidth: '10rem'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total
                                    Charges $
                                </div>
                                <MaskedInput
                                    className={classnames({
                                        'negative-number': (Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))) < 0
                                    })}
                                    readOnly={true}
                                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                        </div>
                        <div className="bottom-border bottom-border-right"></div>
                    </div>

                    <div className="form-row" style={{ position: 'relative' }}>

                        <div className="select-box-container" style={{ // RATE TYPE
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate Type</div> */}
                                <input type="text" style={{
                                    textAlign: 'left',
                                }}
                                    readOnly={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                        (((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0))
                                    }
                                    placeholder='Rate Type'
                                    ref={refBillToRateTypes}
                                    onKeyDown={(e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if ((selectedOrder?.invoice_customer_reviewed || 0) === 0 &&
                                                ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (billToRateTypeItems.length > 0) {
                                                            let selectedIndex = billToRateTypeItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                setBillToRateTypeItems(billToRateTypeItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setBillToRateTypeItems(billToRateTypeItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (billToRateTypeItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1);
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refBillToRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                                if (res.data.result === 'OK') {
                                                                    setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                        item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedBillToRating.rate_type?.id;
                                                                        return item;
                                                                    }))

                                                                    refBillToRateTypePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(e => {
                                                                console.log('error getting rate types', e);
                                                            })
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (billToRateTypeItems.length > 0) {
                                                            let selectedIndex = billToRateTypeItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                setBillToRateTypeItems(billToRateTypeItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setBillToRateTypeItems(billToRateTypeItems.map((item, index) => {
                                                                    if (selectedIndex === (billToRateTypeItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1);
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refBillToRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                                if (res.data.result === 'OK') {
                                                                    setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                        item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedBillToRating.rate_type?.id;
                                                                        return item;
                                                                    }))

                                                                    refBillToRateTypePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(e => {
                                                                console.log('error getting rate types', e);
                                                            })
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setBillToRateTypeItems([]);
                                                        break;

                                                    case 13: // enter
                                                        if (billToRateTypeItems.length > 0 && billToRateTypeItems.findIndex(item => item.selected) > -1) {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_type: billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)],
                                                                description: (billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'flat' ||
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul')
                                                                    ? ''
                                                                    : billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name,
                                                                rate_subtype: {},
                                                                pieces: '',
                                                                weight: '',
                                                                feet_required: '',
                                                                rate: '',
                                                                days: '',
                                                                hours: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToRateTypeItems([]);
                                                                refBillToDescription.current.focus();
                                                            }, 0);
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (billToRateTypeItems.length > 0) {
                                                            e.preventDefault();
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_type: billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)],
                                                                description: (billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'flat' ||
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul')
                                                                    ? ''
                                                                    : billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name,
                                                                rate_subtype: {},
                                                                pieces: '',
                                                                weight: '',
                                                                feet_required: '',
                                                                rate: '',
                                                                days: '',
                                                                hours: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToRateTypeItems([]);
                                                                refBillToDescription.current.focus();
                                                            }, 0);
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            if ((selectedBillToRating.rate_type?.id || 0) === 0) {
                                                setSelectedBillToRating({})
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_type: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setBillToRateTypeItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateTypes', {
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                            item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedBillToRating.rate_type?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate types', e);
                                                })
                                            }, 200);

                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_type: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setBillToRateTypeItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                name: e.target.value.trim()
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                        item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedBillToRating.rate_type?.id;
                                                        return item;
                                                    }))
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            })
                                        }
                                    }}
                                    value={selectedBillToRating.rate_type?.name || ''}
                                />
                                {
                                    (selectedOrder?.is_cancelled || 0) === 0 &&
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (billToRateTypeItems.length > 0) {
                                                setBillToRateTypeItems([]);
                                            } else {
                                                if ((selectedBillToRating.rate_type?.id || 0) === 0 && (selectedBillToRating.rate_type?.name || '') !== '') {
                                                    axios.post(props.serverUrl + '/getRateTypes', {
                                                        name: selectedBillToRating.rate_type?.name
                                                    }).then(res => {
                                                        if (res.data.result === 'OK') {
                                                            setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                                    ? index === 0
                                                                    : item.id === selectedBillToRating.rate_type?.id;
                                                                return item;
                                                            }))

                                                            refBillToRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        }
                                                    }).catch(e => {
                                                        console.log('error getting rate types', e);
                                                    })
                                                } else {
                                                    axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                        if (res.data.result === 'OK') {
                                                            setBillToRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                item.selected = (selectedBillToRating.rate_type?.id || 0) === 0
                                                                    ? index === 0
                                                                    : item.id === selectedBillToRating.rate_type?.id;
                                                                return item;
                                                            }))

                                                            refBillToRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        }
                                                    }).catch(e => {
                                                        console.log('error getting rate types', e);
                                                    })
                                                }
                                            }

                                            refBillToRateTypes.current.focus();
                                        }
                                    }} />
                                }
                            </div>
                            {
                                billToRateTypeTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-load-type"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToRateTypeDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToRateTypeItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.rate_type?.id || 0) === 0 && (selectedBillToRating.rate_type?.name || '') !== ''
                                                                ? selectedBillToRating.rate_type?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={async () => {

                                                                        setSelectedBillToRating({
                                                                            ...selectedBillToRating,
                                                                            rate_type: item,
                                                                            description: (item.name.toLowerCase() === 'flat' ||
                                                                                item.name.toLowerCase() === 'linehaul')
                                                                                ? ''
                                                                                : item.name,
                                                                            rate_subtype: {},
                                                                            pieces: '',
                                                                            weight: '',
                                                                            feet_required: '',
                                                                            rate: '',
                                                                            days: '',
                                                                            hours: '',
                                                                            total_charges: ''
                                                                        })

                                                                        window.setTimeout(() => {
                                                                            setBillToRateTypeItems([]);
                                                                            refBillToDescription.current.focus();
                                                                        }, 0);
                                                                    }}
                                                                    ref={ref => refBillToRateTypePopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DESCRIPTION
                            flexGrow: 1,
                            // minWidth: '12rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Description</div> */}
                            <input type="text" style={{ textAlign: 'left' }}
                                readOnly={(selectedOrder?.is_cancelled || 0) === 1 || (((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0))}

                                placeholder='Description'
                                ref={refBillToDescription}
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            if ((selectedBillToRating?.rate_type?.id || 0) === 0 || (selectedBillToRating?.rate_type?.name || '').toLowerCase() === 'comment') {
                                                validateCustomerRatingForSaving(e);
                                            }
                                        }
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        description: e.target.value
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        description: e.target.value
                                    })
                                }}
                                value={selectedBillToRating.description || ''}
                            />
                        </div>

                        <div className="select-box-container" style={{ // PIECES/SKIDS
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') ? 'flex' : 'none',
                            width: '6rem',
                            maxWidth: '6rem',
                            minWidth: '6rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Pieces/Skids</div> */}
                                <MaskedInput
                                    readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                    placeholder='Pieces/Skids'
                                    ref={refBillToPieces}
                                    style={{ textAlign: 'left' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={selectedBillToRating.pieces || ''}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            if (key === 80) {
                                                e.preventDefault();
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    pieces_unit: 'pc'
                                                })
                                            } else if (key === 83) {
                                                e.preventDefault();
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    pieces_unit: 'sk'
                                                })
                                            } else if (key === 38) {
                                                e.preventDefault();
                                                if (showBillToPiecesItems) {
                                                    let selectedIndex = billToPiecesItems.findIndex(item => item.selected);

                                                    if (selectedIndex === -1) {
                                                        setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                            item.selected = index === 0;
                                                            return item;
                                                        }))
                                                    } else {
                                                        setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                            if (selectedIndex === 0) {
                                                                item.selected = index === (billToPiecesItems.length - 1);
                                                            } else {
                                                                item.selected = index === (selectedIndex - 1);
                                                            }
                                                            return item;
                                                        }))
                                                    }
                                                } else {
                                                    setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                        item.selected = (selectedBillToRating.pieces_unit || '') === item.value
                                                        return item;
                                                    }))

                                                    setShowBillToPiecesItems(true)
                                                }

                                                refBillToPiecesPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            } else if (key === 40) {
                                                e.preventDefault();
                                                if (showBillToPiecesItems) {
                                                    let selectedIndex = billToPiecesItems.findIndex(item => item.selected);

                                                    if (selectedIndex === -1) {
                                                        setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                            item.selected = index === 0;
                                                            return item;
                                                        }))
                                                    } else {
                                                        setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                            if (selectedIndex === (billToPiecesItems.length - 1)) {
                                                                item.selected = index === 0;
                                                            } else {
                                                                item.selected = index === (selectedIndex + 1);
                                                            }
                                                            return item;
                                                        }))
                                                    }
                                                } else {
                                                    setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                        item.selected = (selectedBillToRating.pieces_unit || '') === item.value
                                                        return item;
                                                    }))

                                                    setShowBillToPiecesItems(true)
                                                }

                                                refBillToPiecesPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            } else if (key === 27) {
                                                setShowBillToPiecesItems(false);
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    pieces_unit: ''
                                                })
                                            } else if (key === 13) {
                                                if (showBillToPiecesItems && billToPiecesItems.findIndex(item => item.selected) > -1) {
                                                    setSelectedBillToRating({
                                                        ...selectedBillToRating,
                                                        pieces_unit: billToPiecesItems[billToPiecesItems.findIndex(item => item.selected)].value
                                                    })

                                                    window.setTimeout(() => {
                                                        setShowBillToPiecesItems(false);
                                                        refBillToPieces.current.inputElement.focus();
                                                    }, 0);
                                                }
                                            } else if (key === 9) {
                                                if (showBillToPiecesItems) {
                                                    e.preventDefault();
                                                    setSelectedBillToRating({
                                                        ...selectedBillToRating,
                                                        pieces_unit: billToPiecesItems[billToPiecesItems.findIndex(item => item.selected)].value
                                                    })

                                                    window.setTimeout(() => {
                                                        setShowBillToPiecesItems(false);
                                                        refBillToPieces.current.inputElement.focus();
                                                    }, 0);
                                                }
                                            }
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === '.') {
                                            if (e.target.value.includes('.')) {
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value.includes('.')) {
                                            setSelectedBillToRating({
                                                ...selectedBillToRating,
                                                pieces: new Intl.NumberFormat('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(e.target.value.toString().replace(',', '')))
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            pieces: e.target.value
                                        })
                                    }}
                                />
                                {
                                    (selectedBillToRating.pieces || '') !== '' &&
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '18px',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.75rem',
                                        fontFamily: 'Mochi Med Oblique',
                                        fontWeight: 'bold'
                                    }}>{selectedBillToRating.pieces_unit || ''}</div>
                                }
                                {
                                    (selectedBillToRating.pieces || '') !== '' &&
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) ||
                                            ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (showBillToPiecesItems) {
                                                setShowBillToPiecesItems(false);
                                            } else {
                                                setBillToPiecesItems(billToPiecesItems.map((item, index) => {
                                                    item.selected = (selectedBillToRating.pieces_unit || '') === item.value;
                                                    return item;
                                                }))

                                                window.setTimeout(() => {
                                                    setShowBillToPiecesItems(true);

                                                    refBillToPiecesPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }, 0);
                                            }

                                            refBillToPieces.current.inputElement.focus();
                                        }
                                    }} />
                                }
                            </div>
                            {
                                billToPiecesTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-pieces"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToPiecesDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToPiecesItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.pieces || '') === '' && (selectedBillToRating.pieces || '') !== ''
                                                                ? selectedBillToRating.pieces : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        setSelectedBillToRating({
                                                                            ...selectedBillToRating,
                                                                            pieces_unit: item.value
                                                                        })

                                                                        window.setTimeout(() => {
                                                                            setShowBillToPiecesItems(false);
                                                                            refBillToPieces.current.inputElement.focus();
                                                                        }, 0);
                                                                    }}
                                                                    ref={ref => refBillToPiecesPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // WEIGHT
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') ? 'flex' : 'none',
                            width: '5rem',
                            maxWidth: '5rem',
                            minWidth: '5rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Weight</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Weight'
                                ref={refBillToWeight}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.weight || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            weight: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        weight: e.target.value
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FEET REQUIRED
                            display: (
                                (
                                    (selectedOrder?.load_type_id || 0) === 2 ||
                                    (selectedOrder?.load_type_id || 0) === 3
                                )
                                &&
                                (
                                    (selectedBillToRating.rate_type?.name || '') === '' ||
                                    (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                    (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul'
                                )
                            ) ? 'flex' : 'none',
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Feet Required</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Feet Required'
                                ref={refBillToFeetRequired}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.feet_required || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            feet_required: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        feet_required: e.target.value
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // FUEL SURCHARGE TYPES
                            display: (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                    placeholder='Type'
                                    ref={refBillToSubtypeFuelSurcharge}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (billToSubtypeFuelSurchargeItems.length > 0) {
                                                        let selectedIndex = billToSubtypeFuelSurchargeItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeFuelSurchargeItems(billToSubtypeFuelSurchargeItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeFuelSurchargeItems(billToSubtypeFuelSurchargeItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (billToSubtypeFuelSurchargeItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (billToSubtypeFuelSurchargeItems.length > 0) {
                                                        let selectedIndex = billToSubtypeFuelSurchargeItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeFuelSurchargeItems(billToSubtypeFuelSurchargeItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeFuelSurchargeItems(billToSubtypeFuelSurchargeItems.map((item, index) => {
                                                                if (selectedIndex === (billToSubtypeFuelSurchargeItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setBillToSubtypeFuelSurchargeItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (billToSubtypeFuelSurchargeItems.length > 0 && billToSubtypeFuelSurchargeItems.findIndex(item => item.selected) > -1) {
                                                        if ((billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'percentage') {
                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                            } else {
                                                                setSelectedBillToRating({
                                                                    ...selectedBillToRating,
                                                                    rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                    percentage: '',
                                                                    rate: '',
                                                                    total_charges: ''
                                                                })

                                                                window.setTimeout(() => {
                                                                    setBillToSubtypeFuelSurchargeItems([]);
                                                                    refBillToSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                }, 0);
                                                            }
                                                        } else if ((billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'miles') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                refBillToSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (billToSubtypeFuelSurchargeItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'percentage') {
                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                            } else {
                                                                setSelectedBillToRating({
                                                                    ...selectedBillToRating,
                                                                    rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                    percentage: '',
                                                                    rate: '',
                                                                    total_charges: ''
                                                                })

                                                                window.setTimeout(() => {
                                                                    setBillToSubtypeFuelSurchargeItems([]);
                                                                    refBillToSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                }, 0);
                                                            }
                                                        } else if ((billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'miles') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                refBillToSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeFuelSurchargeItems[billToSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge') {
                                            if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeFuelSurchargeItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setBillToSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedBillToRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedBillToRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                        if (billToSubtypeFuelSurchargeItems.length > 0) {
                                            setBillToSubtypeFuelSurchargeItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedBillToRating.rate_type?.id || ''),
                                                name: (selectedBillToRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setBillToSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedBillToRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refBillToSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refBillToSubtypeFuelSurcharge.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                billToSubtypeFuelSurchargeTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToSubtypeFuelSurchargeDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToSubtypeFuelSurchargeItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.rate_subtype?.id || 0) === 0 && (selectedBillToRating.rate_subtype?.name || '') !== ''
                                                                ? selectedBillToRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'percentage') {
                                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                                            } else {
                                                                                setSelectedBillToRating({
                                                                                    ...selectedBillToRating,
                                                                                    rate_subtype: item,
                                                                                    percentage: '',
                                                                                    rate: '',
                                                                                    total_charges: ''
                                                                                })

                                                                                window.setTimeout(() => {
                                                                                    setBillToSubtypeFuelSurchargeItems([]);
                                                                                    refBillToSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                                }, 0);
                                                                            }
                                                                        } else if ((item.name || '').toLowerCase() === 'miles') {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                percentage: '',
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                                refBillToSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                percentage: '',
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeFuelSurchargeItems([]);
                                                                                refBillToTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refBillToSubtypeFuelSurchargePopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE PERCENTAGE
                            display: ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined &&
                                (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Percentage %</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Percentage %'
                                ref={refBillToSubtypeFuelSurchargePercentage}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.percentage || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            percentage: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const linehaul = parseFloat(((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2));

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        percentage: e.target.value,
                                        total_charges: (linehaul * (Number(e.target.value) / 100)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE LINEHAUL
                            display: ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined &&
                                (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '9rem',
                            minWidth: '9rem',
                            maxWidth: '9rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Linehaul $</div> */}
                            <MaskedInput
                                readOnly={true}

                                placeholder='Linehaul $'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={Number((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2)}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE RATE
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}

                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Rate $'
                                ref={refBillToSubtypeFuelSurchargeRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? parseFloat((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: Number(Number(e.target.value) * miles).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE MILES
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div> */}
                            <MaskedInput
                                readOnly={true}

                                placeholder='Miles'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={(selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : 0}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LINEHAUL RATE
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Rate $'
                                ref={refBillToSubtypeLinehaulRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? Number((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.replace(',', '')) * miles)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LINEHAUL MILES
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div> */}
                            <MaskedInput
                                readOnly={true}

                                placeholder='Miles'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={(selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : 0}
                            />
                        </div>

                        <div className="select-box-container" style={{ // LAYOVER TYPES
                            display: (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'layover' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                    placeholder='Type'
                                    ref={refBillToSubtypeLayover}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (billToSubtypeLayoverItems.length > 0) {
                                                        let selectedIndex = billToSubtypeLayoverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeLayoverItems(billToSubtypeLayoverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeLayoverItems(billToSubtypeLayoverItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (billToSubtypeLayoverItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeLayoverPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeLayoverPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (billToSubtypeLayoverItems.length > 0) {
                                                        let selectedIndex = billToSubtypeLayoverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeLayoverItems(billToSubtypeLayoverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeLayoverItems(billToSubtypeLayoverItems.map((item, index) => {
                                                                if (selectedIndex === (billToSubtypeLayoverItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeLayoverPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeLayoverPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setBillToSubtypeLayoverItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (billToSubtypeLayoverItems.length > 0 && billToSubtypeLayoverItems.findIndex(item => item.selected) > -1) {
                                                        if ((billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'days') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeLayoverItems([]);
                                                                refBillToSubtypeLayoverRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeLayoverItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (billToSubtypeLayoverItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'days') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeLayoverItems([]);
                                                                refBillToSubtypeLayoverRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeLayoverItems[billToSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeLayoverItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeLayoverItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setBillToSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedBillToRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeLayoverItems([]);
                                        }
                                    }}
                                    value={selectedBillToRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                        if (billToSubtypeLayoverItems.length > 0) {
                                            setBillToSubtypeLayoverItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedBillToRating.rate_type?.id || ''),
                                                name: (selectedBillToRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setBillToSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedBillToRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refBillToSubtypeLayoverPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refBillToSubtypeLayover.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                billToSubtypeLayoverTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToSubtypeLayoverDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToSubtypeLayoverItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.rate_subtype?.id || 0) === 0 && (selectedBillToRating.rate_subtype?.name || '') !== ''
                                                                ? selectedBillToRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'days') {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeLayoverItems([]);
                                                                                refBillToSubtypeLayoverRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeLayoverItems([]);
                                                                                refBillToTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refBillToSubtypeLayoverPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // LAYOVER RATE
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'layover' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'days') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refBillToSubtypeLayoverRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const days = (selectedBillToRating.days || 0);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * days)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LAYOVER DAYS
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'layover' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'days') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Days</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Days'
                                ref={refBillToSubtypeLayoverDays}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.days || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            days: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedBillToRating.rate);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        days: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // DETENTION TYPES
                            display: (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'detention' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                    placeholder='Type'
                                    ref={refBillToSubtypeDetention}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (billToSubtypeDetentionItems.length > 0) {
                                                        let selectedIndex = billToSubtypeDetentionItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeDetentionItems(billToSubtypeDetentionItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeDetentionItems(billToSubtypeDetentionItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (billToSubtypeDetentionItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeDetentionPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeDetentionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (billToSubtypeDetentionItems.length > 0) {
                                                        let selectedIndex = billToSubtypeDetentionItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeDetentionItems(billToSubtypeDetentionItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeDetentionItems(billToSubtypeDetentionItems.map((item, index) => {
                                                                if (selectedIndex === (billToSubtypeDetentionItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeDetentionPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeDetentionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setBillToSubtypeDetentionItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (billToSubtypeDetentionItems.length > 0 && billToSubtypeDetentionItems.findIndex(item => item.selected) > -1) {
                                                        if ((billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDetentionItems([]);
                                                                refBillToSubtypeDetentionRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDetentionItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (billToSubtypeDetentionItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDetentionItems([]);
                                                                refBillToSubtypeDetentionRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDetentionItems[billToSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDetentionItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeDetentionItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setBillToSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedBillToRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeDetentionItems([]);
                                        }
                                    }}
                                    value={selectedBillToRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) ||
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                        if (billToSubtypeDetentionItems.length > 0) {
                                            setBillToSubtypeDetentionItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedBillToRating.rate_type?.id || ''),
                                                name: (selectedBillToRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setBillToSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedBillToRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refBillToSubtypeDetentionPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refBillToSubtypeDetention.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                billToSubtypeDetentionTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToSubtypeDetentionDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToSubtypeDetentionItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.rate_subtype?.id || 0) === 0 && (selectedBillToRating.rate_subtype?.name || '') !== ''
                                                                ? selectedBillToRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'hours') {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeDetentionItems([]);
                                                                                refBillToSubtypeDetentionRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeDetentionItems([]);
                                                                                refBillToTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refBillToSubtypeDetentionPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DETENTION RATE
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'detention' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refBillToSubtypeDetentionRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const hours = (selectedBillToRating.days || 0);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * hours)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // DETENTION HOURS
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'detention' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Hours'
                                ref={refBillToSubtypeDetentionHours}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.hours || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            hours: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedBillToRating.rate);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        hours: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // DRIVER ASSIST TYPES
                            display: (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'driver assist' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Type'
                                    ref={refBillToSubtypeDriverAssist}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (billToSubtypeDriverAssistItems.length > 0) {
                                                        let selectedIndex = billToSubtypeDriverAssistItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeDriverAssistItems(billToSubtypeDriverAssistItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeDriverAssistItems(billToSubtypeDriverAssistItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (billToSubtypeDriverAssistItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (billToSubtypeDriverAssistItems.length > 0) {
                                                        let selectedIndex = billToSubtypeDriverAssistItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setBillToSubtypeDriverAssistItems(billToSubtypeDriverAssistItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setBillToSubtypeDriverAssistItems(billToSubtypeDriverAssistItems.map((item, index) => {
                                                                if (selectedIndex === (billToSubtypeDriverAssistItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refBillToSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                            name: (selectedBillToRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setBillToSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedBillToRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refBillToSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setBillToSubtypeDriverAssistItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (billToSubtypeDriverAssistItems.length > 0 && billToSubtypeDriverAssistItems.findIndex(item => item.selected) > -1) {
                                                        if ((billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDriverAssistItems([]);
                                                                refBillToSubtypeDriverAssistRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDriverAssistItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (billToSubtypeDriverAssistItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDriverAssistItems([]);
                                                                refBillToSubtypeDriverAssistRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedBillToRating({
                                                                ...selectedBillToRating,
                                                                rate_subtype: billToSubtypeDriverAssistItems[billToSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setBillToSubtypeDriverAssistItems([]);
                                                                refBillToTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedBillToRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeDriverAssistItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedBillToRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setBillToSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedBillToRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setBillToSubtypeDriverAssistItems([]);
                                        }
                                    }}
                                    value={selectedBillToRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (((selectedOrder?.invoice_customer_reviewed || 0) === 0) &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                        if (billToSubtypeDriverAssistItems.length > 0) {
                                            setBillToSubtypeDriverAssistItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedBillToRating.rate_type?.id || ''),
                                                name: (selectedBillToRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setBillToSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedBillToRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedBillToRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refBillToSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refBillToSubtypeDriverAssist.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                billToSubtypeDriverAssistTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refBillToSubtypeDriverAssistDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        billToSubtypeDriverAssistItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedBillToRating.rate_subtype?.id || 0) === 0 && (selectedBillToRating.rate_subtype?.name || '') !== ''
                                                                ? selectedBillToRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'hours') {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeDriverAssistItems([]);
                                                                                refBillToSubtypeDriverAssistRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedBillToRating({
                                                                                ...selectedBillToRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setBillToSubtypeDriverAssistItems([]);
                                                                                refBillToTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refBillToSubtypeDriverAssistPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DRIVER ASSIST RATE
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'driver assist' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Rate $'
                                ref={refBillToSubtypeDriverAssistRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const hours = (selectedBillToRating.days || 0);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * hours)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // DRIVER ASSIST HOURS
                            display: ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'driver assist' &&
                                (selectedBillToRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div> */}
                            <MaskedInput
                                readOnly={((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}

                                placeholder='Hours'
                                ref={refBillToSubtypeDriverAssistHours}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.hours || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            hours: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedBillToRating.rate);

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        hours: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // CUSTOMER TOTAL CHARGES
                            width: '8rem',
                            minWidth: '8rem',
                            maxWidth: '8rem',
                            display: ((selectedBillToRating?.rate_type?.name || '') === '' || (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'comment') ? 'none' : 'flex'
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Charges $</div> */}
                            <MaskedInput
                                readOnly={
                                    (((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)) ||
                                    ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'detention'
                                        ? ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedBillToRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                        : (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'driver assist'
                                            ? ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedBillToRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                            : (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge'
                                                ? ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedBillToRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                                : (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'layover'
                                                    ? ((selectedBillToRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedBillToRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                                    : false)
                                }

                                placeholder='Total Charges $'
                                ref={refBillToTotalCharges}
                                style={{
                                    textAlign: 'left'
                                }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.total_charges || ''}
                                onKeyDown={(e) => {
                                    if (((selectedOrder?.invoice_customer_reviewed || 0) === 1) ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)) {
                                        return;
                                    }
                                    validateCustomerRatingForSaving(e);
                                }}

                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.toString() !== '') {
                                        setSelectedBillToRating({
                                            ...selectedBillToRating,
                                            total_charges: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        total_charges: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        total_charges: e.target.value
                                    })
                                }}
                            />
                        </div>

                    </div>

                    <div className="form-v-sep"></div>
                    <div className="form-row" style={{ flexGrow: 1, padding: '5px 5px 15px 5px' }}>
                        <div className="form-portal"
                            style={{ flexGrow: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
                            {
                                (selectedOrder?.order_customer_ratings || []).length > 0 &&
                                <div className="rating-header">
                                    <div className="tcol rate-type">Rate Type</div>
                                    <div className="tcol description">Description</div>
                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                        <div className="tcol pieces">Pieces/Skids</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                        <div className="tcol weight">Weight</div>
                                    }

                                    {
                                        (((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) &&
                                            ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined)) &&
                                        <div className="tcol feet-required">Feet Required</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge') !== undefined ||
                                            // (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist') !== undefined) &&
                                        <div className="tcol subtype">Type</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                        <div className="tcol percentage">Percentage</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined) &&
                                        <div className="tcol miles">Miles</div>
                                    }

                                    {
                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined &&
                                        <div className="tcol days">Days</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                        <div className="tcol hours">Hours</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                        <div className="tcol rate">Rate</div>
                                    }

                                    {
                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                        <div className="tcol linehaul">Linehaul</div>
                                    }

                                    <div className="tcol total-charges">Total Charges</div>

                                </div>
                            }

                            <div className="rating-wrapper">
                                {
                                    (selectedOrder?.order_customer_ratings || []).map((rating, index) => {
                                        return (
                                            <div className={classnames({
                                                'rating-item': true,
                                                'selected': rating.id === (selectedBillToRating.id || 0)
                                            })} key={index} onClick={() => {
                                                if ((selectedOrder?.is_cancelled || 0) === 0 && (((selectedOrder?.invoice_customer_reviewed || 0) === 0) &&
                                                    ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1))) {

                                                    const { rate, linehaul, total_charges } = rating;

                                                    setSelectedBillToRating({
                                                        ...rating,
                                                        rate: new Intl.NumberFormat('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(Number(rate)),
                                                        total_charges: total_charges > 0 ? new Intl.NumberFormat('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(Number(total_charges)) : ''
                                                    });
                                                }
                                            }}>
                                                <div className="tcol rate-type">{
                                                    (rating.rate_type?.name || '').toLowerCase() === 'comment' ? '' : (rating.rate_type?.name || '')
                                                }</div>
                                                <div className="tcol description">{rating.description}</div>
                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <div className="tcol pieces">
                                                        <NumberFormat
                                                            value={rating.pieces > 0 ? rating.pieces : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            suffix={(rating.pieces_unit || '') === 'pc' ? ' Pieces' : (rating.pieces_unit || '') === 'sk' ? ' Skids' : ''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <div className="tcol weight">
                                                        <NumberFormat
                                                            value={rating.weight > 0 ? rating.weight : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    (((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) &&
                                                        ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                            (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined)) &&
                                                    <div className="tcol feet-required">
                                                        <NumberFormat
                                                            value={rating.feet_required > 0 ? rating.feet_required : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.feet_required) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge') !== undefined ||
                                                        // (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist') !== undefined) &&
                                                    <div
                                                        className="tcol subtype">{rating.rate_subtype?.name || ''}</div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                                    <div className="tcol percentage">
                                                        <NumberFormat
                                                            value={rating.percentage > 0 ? rating.percentage : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.percentage) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            suffix={'%'}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined) &&
                                                    <div
                                                        className="tcol miles">{(rating.subtype || '').toLowerCase() === 'miles' ? (selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : '' : ''}</div>
                                                }

                                                {
                                                    (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined &&
                                                    <div className="tcol days">
                                                        <NumberFormat
                                                            value={rating.days > 0 ? rating.days : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.days) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                                    <div className="tcol hours">
                                                        <NumberFormat
                                                            value={rating.hours > 0 ? rating.hours : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.hours) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                                        (selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                                    <div className="tcol rate">{rating.rate > 0 ?
                                                        <NumberFormat
                                                            value={rating.rate}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={'$ '}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                        : ''}</div>
                                                }

                                                {
                                                    ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                                    <div className="tcol linehaul">{
                                                        ((rating.rate_type || '').toLowerCase() === 'fuel surcharge' && (rating.subtype || '').toLowerCase() === 'percentage')
                                                            ?
                                                            <NumberFormat
                                                                value={(selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || ''}
                                                                thousandsGroupStyle="thousand"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                prefix={'$ '}
                                                                type="text"
                                                                displayType={'text'}
                                                            />
                                                            : ''
                                                    }</div>
                                                }

                                                <div className="tcol total-charges">
                                                    <NumberFormat
                                                        value={rating.total_charges > 0 ? rating.total_charges : ''}
                                                        thousandsGroupStyle="thousand"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        prefix={'$ '}
                                                        type="text"
                                                        displayType={'text'}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>

                <div className="form-bordered-box" style={{ borderRight: 0, borderBottom: 0, boxShadow: 'none' }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Carrier Charges</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} onClick={() => {
                                setSelectedCarrierRating({});
                                refCarrierRateTypes.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'active': (selectedOrder?.invoice_carrier_previewed || 0) === 1,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} style={{
                                pointerEvents: (selectedOrder?.invoice_carrier_approved || 0) === 1 ? 'none' : 'all'
                            }} onClick={() => {
                                let invoice_carrier_previewed = (selectedOrder?.invoice_carrier_previewed || 0) === 0 ? 1 : 0;

                                setSelectedOrder(selectedOrder => {
                                    return {
                                        ...selectedOrder,
                                        invoice_carrier_previewed: invoice_carrier_previewed
                                    }
                                });

                                let selected_order = {
                                    ...selectedOrder,
                                    invoice_carrier_previewed: invoice_carrier_previewed
                                };

                                axios.post(props.serverUrl + '/saveOrder', selected_order).then(res => {
                                    props.setSelectedOrder({
                                        ...res.data.order,
                                        component_id: props.componentId
                                    });

                                    setSelectedCarrierRating({});

                                    if ((res.data.order.invoice_carrier_previewed || 0) === 1 &&
                                        (res.data.order.events || []).find(e => (e.event_type_id || 0) === 14) === undefined) {
                                        let event_parameters = {
                                            order_id: res.data.order.id,
                                            time: moment().format('HHmm'),
                                            event_time: moment().format('HHmm'),
                                            date: moment().format('MM/DD/YYYY'),
                                            event_date: moment().format('MM/DD/YYYY'),
                                            user_code_id: props.user.user_code.id || null,
                                            event_location: '',
                                            event_notes: 'Previewed Carrier Invoice',
                                            event_type_id: 14,
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
                                                setIsSavingOrder(false);
                                            } else if (res.data.result === 'ORDER ID NOT VALID') {
                                                window.alert('The order number is not valid!');
                                            }
                                        }).catch(e => {
                                            console.log('error saving order event', e);
                                        })
                                    }
                                }).catch(e => {
                                    console.log('error saving carrier previewed', e);
                                })
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Previewed</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'active': (selectedOrder?.documents || []).find(d => (d.title || '').toLowerCase() === 'carrier invoice') !== undefined,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Invoice Rec'd</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'active': (selectedOrder?.documents || []).find(d => (d.title || '').toLowerCase() === 'signed bill of lading') !== undefined,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">BOL Rec'd</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'active': (selectedOrder?.documents || []).find(d => (d.title || '').toLowerCase() === 'signed rate confirmation') !== undefined,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Rate Conf Rec'd</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                            })} onClick={() => {
                                if ((selectedOrder?.id || 0) === 0) {
                                    window.alert('You must select an order first!');
                                    return;
                                }

                                let panel = {
                                    panelName: `${props.panelName}-documents`,
                                    component: <Documents
                                        title='Documents'
                                        tabTimes={45000 + props.tabTimes}
                                        panelName={`${props.panelName}-documents`}
                                        origin={props.origin}
                                        suborigin={'order'}


                                        componentId={moment().format('x')}

                                        selectedOwner={{ ...selectedOrder }}
                                        selectedOwnerDocument={{
                                            id: 0,
                                            user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                            date_entered: moment().format('MM/DD/YYYY')
                                        }}
                                        savingDocumentUrl='/saveOrderDocument'
                                        deletingDocumentUrl='/deleteOrderDocument'
                                        savingDocumentNoteUrl='/saveOrderDocumentNote'
                                        deletingDocumentNoteUrl='/deleteOrderDocumentNote'
                                        serverDocumentsFolder='/order-documents/'
                                        permissionName='invoice'
                                    />
                                }

                                openPanel(panel, props.origin);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || ((selectedOrder?.invoice_carrier_previewed || 0) === 0 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)),
                                'active': (selectedOrder?.invoice_carrier_approved || 0) === 1
                            })} style={{
                                pointerEvents: ((selectedOrder?.invoice_carrier_previewed || 0) === 0 || (selectedOrder?.invoice_carrier_approved || 0) === 1) ? 'none' : 'all'
                            }} onClick={() => {
                                if (window.confirm('Are you sure you want to proceed?')) {
                                    props.setSelectedOrder({
                                        ...selectedOrder,
                                        invoice_carrier_approved: 1,
                                        component_id: props.componentId
                                    })

                                    setSelectedOrder(selectedOrder => {
                                        return {
                                            ...selectedOrder,
                                            invoice_carrier_approved: 1
                                        }
                                    })

                                    axios.post(props.serverUrl + '/saveOrder', {
                                        ...selectedOrder,
                                        invoice_carrier_approved: 1
                                    }).then(res => {
                                        props.setSelectedOrder({
                                            ...res.data.order,
                                            component_id: props.componentId
                                        });

                                        if ((res.data.order.invoice_carrier_approved || 0) === 1 &&
                                            (res.data.order.events || []).find(e => (e.event_type_id || 0) === 15) === undefined) {
                                            let event_parameters = {
                                                order_id: res.data.order.id,
                                                time: moment().format('HHmm'),
                                                event_time: moment().format('HHmm'),
                                                date: moment().format('MM/DD/YYYY'),
                                                event_date: moment().format('MM/DD/YYYY'),
                                                user_code_id: props.user.user_code.id || null,
                                                event_location: '',
                                                event_notes: 'Approved Carrier Invoice',
                                                event_type_id: 15,
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
                                                    setIsSavingOrder(false);
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
                                <div
                                    className="mochi-button-base">{(selectedOrder?.invoice_carrier_approved || 0) === 1 ? 'Approved' : 'Approve'}</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-right" style={{
                        position: 'absolute',
                        height: '100%',
                        width: 2,
                        right: -1,
                        top: 0,
                        borderRight: '1px solid rgba(0,0,0,0.5)',
                        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.3)'
                    }}>
                    </div>
                    <div className="form-footer">
                        <div className="bottom-border bottom-border-left"></div>
                        <div className="form-buttons">
                            <div className="input-box-container" style={{ width: '8rem', marginRight: 5 }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>GP $
                                </div>
                                <MaskedInput
                                    className={classnames({
                                        'negative-number': (Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))) < 0
                                    })}
                                    readOnly={true}
                                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                            <div className="input-box-container" style={{ width: '8rem', marginRight: 5 }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>NP $
                                </div>
                                <MaskedInput
                                    className={classnames({
                                        'negative-number': (Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))) < 0
                                    })}
                                    readOnly={true}
                                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                            <div className="input-box-container" style={{ width: '8rem' }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Profit
                                    %
                                </div>
                                <NumberFormat
                                    className={classnames({
                                        'negative-number': ((
                                            Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                            ||
                                            Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                        )
                                            ?
                                            (
                                                (
                                                    Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                )
                                                * 100
                                            )
                                            /
                                            (
                                                Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                    return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                                    ? Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                    : Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                            )
                                            : 0) < 0
                                    })}
                                    style={{ textAlign: 'right', fontWeight: 'bold', width: '100%', fontSize: '0.75rem' }}
                                    value={
                                        (
                                            Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                            ||
                                            Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                        )
                                            ?
                                            (
                                                (
                                                    Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                )
                                                * 100
                                            )
                                            /
                                            (
                                                Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                    return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                                    ? Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                    : Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                            )
                                            : 0
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={''}
                                    suffix={''}
                                    type="text"
                                    displayType={'text'}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                        <div className="bottom-border bottom-border-middle"></div>
                        <div className="form-buttons">
                            <div className={classnames({
                                'mochi-button': true,
                                'disabled': (selectedOrder?.is_cancelled || 0) === 1 || (((selectedOrder?.id || 0) === 0 || (selectedCarrierRating.id || 0) === 0) ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0))
                            })} style={{ marginRight: 10 }} onClick={() => {
                                if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                    if (window.confirm('Are you sure you want to delete this item?')) {
                                        axios.post(props.serverUrl + '/deleteOrderCarrierRating', {
                                            id: selectedCarrierRating.id,
                                            order_id: selectedOrder.id
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        order_carrier_ratings: JSON.parse(JSON.stringify(res.data.order_carrier_ratings)),
                                                    }
                                                });

                                                props.setSelectedOrder({
                                                    id: selectedOrder.id,
                                                    order_carrier_ratings: JSON.parse(JSON.stringify(res.data.order_carrier_ratings)),
                                                    component_id: props.componentId
                                                })

                                                setSelectedCarrierRating({});

                                                refCarrierRateTypes.current.focus();
                                            }
                                        }).catch(e => {
                                            console.log('error deleting rating item', e);
                                        })
                                    }
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Delete</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="input-box-container" style={{
                                width: '11rem',
                                minWidth: '11rem',
                                maxWidth: '11rem'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total
                                    Payments $
                                </div>
                                <MaskedInput
                                    className={classnames({
                                        'negative-number': (Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))) < 0
                                    })}
                                    readOnly={true}
                                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                        </div>
                        <div className="bottom-border bottom-border-right"></div>
                    </div>

                    <div className="form-row" style={{ position: 'relative' }}>

                        <div className="select-box-container" style={{ // RATE TYPE
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}

                                    readOnly={(selectedOrder?.is_cancelled || 0) === 1 || ((selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0))}
                                    placeholder='Rate Type'
                                    ref={refCarrierRateTypes}
                                    onKeyDown={(e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if ((selectedOrder?.invoice_carrier_previewed || 0) === 0 &&
                                                ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (carrierRateTypeItems.length > 0) {
                                                            let selectedIndex = carrierRateTypeItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                setCarrierRateTypeItems(carrierRateTypeItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setCarrierRateTypeItems(carrierRateTypeItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (carrierRateTypeItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1);
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                                if (res.data.result === 'OK') {
                                                                    setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                        item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCarrierRating.rate_type?.id;
                                                                        return item;
                                                                    }))

                                                                    refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(e => {
                                                                console.log('error getting rate types', e);
                                                            })
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (carrierRateTypeItems.length > 0) {
                                                            let selectedIndex = carrierRateTypeItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                setCarrierRateTypeItems(carrierRateTypeItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setCarrierRateTypeItems(carrierRateTypeItems.map((item, index) => {
                                                                    if (selectedIndex === (carrierRateTypeItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1);
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                                if (res.data.result === 'OK') {
                                                                    setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                        item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCarrierRating.rate_type?.id;
                                                                        return item;
                                                                    }))

                                                                    refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(e => {
                                                                console.log('error getting rate types', e);
                                                            })
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setCarrierRateTypeItems([]);
                                                        break;

                                                    case 13: // enter
                                                        if (carrierRateTypeItems.length > 0 && carrierRateTypeItems.findIndex(item => item.selected) > -1) {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_type: carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)],
                                                                description: (carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'flat' ||
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul')
                                                                    ? ''
                                                                    : carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name,
                                                                rate_subtype: {},
                                                                pieces: '',
                                                                weight: '',
                                                                feet_required: '',
                                                                rate: '',
                                                                days: '',
                                                                hours: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierRateTypeItems([]);
                                                                refCarrierDescription.current.focus();
                                                            }, 0);
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (carrierRateTypeItems.length > 0) {
                                                            e.preventDefault();
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_type: carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)],
                                                                description: (carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'flat' ||
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul')
                                                                    ? ''
                                                                    : carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name,
                                                                rate_subtype: {},
                                                                pieces: '',
                                                                weight: '',
                                                                feet_required: '',
                                                                rate: '',
                                                                days: '',
                                                                hours: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierRateTypeItems([]);
                                                                refCarrierDescription.current.focus();
                                                            }, 0);
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            if ((selectedCarrierRating.rate_type?.id || 0) === 0) {
                                                setSelectedCarrierRating({})
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_type: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setCarrierRateTypeItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateTypes', {
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                            item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierRating.rate_type?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate types', e);
                                                })
                                            }, 200);

                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_type: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setCarrierRateTypeItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                name: e.target.value.trim()
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedCarrierRating.rate_type?.id;
                                                        return item;
                                                    }))
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            })
                                        }
                                    }}
                                    value={selectedCarrierRating.rate_type?.name || ''}
                                />
                                {
                                    (selectedOrder?.is_cancelled || 0) === 0 &&
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0 &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (carrierRateTypeItems.length > 0) {
                                                setCarrierRateTypeItems([]);
                                            } else {
                                                if ((selectedCarrierRating.rate_type?.id || 0) === 0 && (selectedCarrierRating.rate_type?.name || '') !== '') {
                                                    axios.post(props.serverUrl + '/getRateTypes', {
                                                        name: selectedCarrierRating.rate_type?.name
                                                    }).then(res => {
                                                        if (res.data.result === 'OK') {
                                                            setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                                    ? index === 0
                                                                    : item.id === selectedCarrierRating.rate_type?.id;
                                                                return item;
                                                            }))

                                                            refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        }
                                                    }).catch(e => {
                                                        console.log('error getting rate types', e);
                                                    })
                                                } else {
                                                    axios.post(props.serverUrl + '/getRateTypes').then(res => {
                                                        if (res.data.result === 'OK') {
                                                            setCarrierRateTypeItems(res.data.rate_types.map((item, index) => {
                                                                item.selected = (selectedCarrierRating.rate_type?.id || 0) === 0
                                                                    ? index === 0
                                                                    : item.id === selectedCarrierRating.rate_type?.id;
                                                                return item;
                                                            }))

                                                            refCarrierRateTypePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        }
                                                    }).catch(e => {
                                                        console.log('error getting rate types', e);
                                                    })
                                                }
                                            }

                                            refCarrierRateTypes.current.focus();
                                        }
                                    }} />
                                }
                            </div>
                            {
                                carrierRateTypeTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-load-type"
                                        style={{
                                            ...style,
                                            left: '0',
                                            top: -155,
                                            display: 'block'
                                        }}
                                        ref={refCarrierRateTypeDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical above right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierRateTypeItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.rate_type?.id || 0) === 0 && (selectedCarrierRating.rate_type?.name || '') !== ''
                                                                ? selectedCarrierRating.rate_type?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={async () => {

                                                                        setSelectedCarrierRating({
                                                                            ...selectedCarrierRating,
                                                                            rate_type: item,
                                                                            description: (item.name.toLowerCase() === 'flat' ||
                                                                                item.name.toLowerCase() === 'linehaul')
                                                                                ? ''
                                                                                : item.name,
                                                                            rate_subtype: {},
                                                                            pieces: '',
                                                                            weight: '',
                                                                            feet_required: '',
                                                                            rate: '',
                                                                            days: '',
                                                                            hours: '',
                                                                            total_charges: ''
                                                                        })

                                                                        window.setTimeout(() => {
                                                                            setCarrierRateTypeItems([]);
                                                                            refCarrierDescription.current.focus();
                                                                        }, 0);
                                                                    }}
                                                                    ref={ref => refCarrierRateTypePopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DESCRIPTION
                            flexGrow: 1,
                            // minWidth: '12rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Description</div> */}
                            <input type="text" style={{ textAlign: 'left' }}
                                readOnly={(selectedOrder?.is_cancelled || 0) === 1 || ((selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0))}
                                placeholder='Description'
                                ref={refCarrierDescription}
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            if ((selectedCarrierRating?.rate_type?.id || 0) === 0 || (selectedCarrierRating?.rate_type?.name || '').toLowerCase() === 'comment') {
                                                validateCarrierRatingForSaving(e);
                                            }
                                        }
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        description: e.target.value
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        description: e.target.value
                                    })
                                }}
                                value={selectedCarrierRating.description || ''}
                            />
                        </div>

                        <div className="select-box-container" style={{ // PIECES/SKIDS
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') ? 'flex' : 'none',
                            width: '6rem',
                            maxWidth: '6rem',
                            minWidth: '6rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Pieces/Skids</div> */}
                                <MaskedInput
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Pieces/Skids'
                                    ref={refCarrierPieces}
                                    style={{ textAlign: 'left' }}
                                    mask={numberMask}
                                    type="text"
                                    guide={false}
                                    value={selectedCarrierRating.pieces || ''}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            if (key === 80) {
                                                e.preventDefault();
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    pieces_unit: 'pc'
                                                })
                                            } else if (key === 83) {
                                                e.preventDefault();
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    pieces_unit: 'sk'
                                                })
                                            } else if (key === 38) {
                                                e.preventDefault();
                                                if (showCarrierPiecesItems) {
                                                    let selectedIndex = carrierPiecesItems.findIndex(item => item.selected);

                                                    if (selectedIndex === -1) {
                                                        setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                            item.selected = index === 0;
                                                            return item;
                                                        }))
                                                    } else {
                                                        setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                            if (selectedIndex === 0) {
                                                                item.selected = index === (carrierPiecesItems.length - 1);
                                                            } else {
                                                                item.selected = index === (selectedIndex - 1);
                                                            }
                                                            return item;
                                                        }))
                                                    }
                                                } else {
                                                    setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.pieces_unit || '') === item.value
                                                        return item;
                                                    }))

                                                    setShowCarrierPiecesItems(true)
                                                }

                                                refCarrierPiecesPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            } else if (key === 40) {
                                                e.preventDefault();
                                                if (showCarrierPiecesItems) {
                                                    let selectedIndex = carrierPiecesItems.findIndex(item => item.selected);

                                                    if (selectedIndex === -1) {
                                                        setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                            item.selected = index === 0;
                                                            return item;
                                                        }))
                                                    } else {
                                                        setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                            if (selectedIndex === (carrierPiecesItems.length - 1)) {
                                                                item.selected = index === 0;
                                                            } else {
                                                                item.selected = index === (selectedIndex + 1);
                                                            }
                                                            return item;
                                                        }))
                                                    }
                                                } else {
                                                    setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.pieces_unit || '') === item.value
                                                        return item;
                                                    }))

                                                    setShowCarrierPiecesItems(true)
                                                }

                                                refCarrierPiecesPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            } else if (key === 27) {
                                                setShowCarrierPiecesItems(false);
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    pieces_unit: ''
                                                })
                                            } else if (key === 13) {
                                                if (showCarrierPiecesItems && carrierPiecesItems.findIndex(item => item.selected) > -1) {
                                                    setSelectedCarrierRating({
                                                        ...selectedCarrierRating,
                                                        pieces_unit: carrierPiecesItems[carrierPiecesItems.findIndex(item => item.selected)].value
                                                    })

                                                    window.setTimeout(() => {
                                                        setShowCarrierPiecesItems(false);
                                                        refCarrierPieces.current.inputElement.focus();
                                                    }, 0);
                                                }
                                            } else if (key === 9) {
                                                if (showCarrierPiecesItems) {
                                                    e.preventDefault();
                                                    setSelectedCarrierRating({
                                                        ...selectedCarrierRating,
                                                        pieces_unit: carrierPiecesItems[carrierPiecesItems.findIndex(item => item.selected)].value
                                                    })

                                                    window.setTimeout(() => {
                                                        setShowCarrierPiecesItems(false);
                                                        refCarrierPieces.current.inputElement.focus();
                                                    }, 0);
                                                }
                                            }
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === '.') {
                                            if (e.target.value.includes('.')) {
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value.includes('.')) {
                                            setSelectedCarrierRating({
                                                ...selectedCarrierRating,
                                                pieces: new Intl.NumberFormat('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(e.target.value.toString().replace(',', '')))
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            pieces: e.target.value
                                        })
                                    }}
                                />
                                {
                                    (selectedCarrierRating.pieces || '') !== '' &&
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '18px',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.75rem',
                                        fontFamily: 'Mochi Med Oblique',
                                        fontWeight: 'bold'
                                    }}>{selectedCarrierRating.pieces_unit || ''}</div>
                                }
                                {
                                    (selectedCarrierRating.pieces || '') !== '' &&
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0 ||
                                            ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (showCarrierPiecesItems) {
                                                setShowCarrierPiecesItems(false);
                                            } else {
                                                setCarrierPiecesItems(carrierPiecesItems.map((item, index) => {
                                                    item.selected = (selectedCarrierRating.pieces_unit || '') === item.value;
                                                    return item;
                                                }))

                                                window.setTimeout(() => {
                                                    setShowCarrierPiecesItems(true);

                                                    refCarrierPiecesPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }, 0);
                                            }

                                            refCarrierPieces.current.inputElement.focus();
                                        }
                                    }} />
                                }
                            </div>
                            {
                                carrierPiecesTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-pieces"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refCarrierPiecesDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierPiecesItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.pieces || '') === '' && (selectedCarrierRating.pieces || '') !== ''
                                                                ? selectedCarrierRating.pieces : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        setSelectedCarrierRating({
                                                                            ...selectedCarrierRating,
                                                                            pieces_unit: item.value
                                                                        })

                                                                        window.setTimeout(() => {
                                                                            setShowCarrierPiecesItems(false);
                                                                            refCarrierPieces.current.inputElement.focus();
                                                                        }, 0);
                                                                    }}
                                                                    ref={ref => refCarrierPiecesPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // WEIGHT
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') ? 'flex' : 'none',
                            width: '5rem',
                            maxWidth: '5rem',
                            minWidth: '5rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Weight</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Weight'
                                ref={refCarrierWeight}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.weight || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            weight: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        weight: e.target.value
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FEET REQUIRED
                            display: (
                                (
                                    (selectedOrder?.load_type_id || 0) === 2 ||
                                    (selectedOrder?.load_type_id || 0) === 3
                                )
                                &&
                                (
                                    (selectedCarrierRating.rate_type?.name || '') === '' ||
                                    (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                    (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul'
                                )
                            ) ? 'flex' : 'none',
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Feet Required</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Feet Required'
                                ref={refCarrierFeetRequired}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.feet_required || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            feet_required: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        feet_required: e.target.value
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // FUEL SURCHARGE TYPES
                            display: (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Type'
                                    ref={refCarrierSubtypeFuelSurcharge}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (carrierSubtypeFuelSurchargeItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeFuelSurchargeItems(carrierSubtypeFuelSurchargeItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeFuelSurchargeItems(carrierSubtypeFuelSurchargeItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierSubtypeFuelSurchargeItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (carrierSubtypeFuelSurchargeItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeFuelSurchargeItems(carrierSubtypeFuelSurchargeItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeFuelSurchargeItems(carrierSubtypeFuelSurchargeItems.map((item, index) => {
                                                                if (selectedIndex === (carrierSubtypeFuelSurchargeItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setCarrierSubtypeFuelSurchargeItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (carrierSubtypeFuelSurchargeItems.length > 0 && carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected) > -1) {
                                                        if ((carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'percentage') {
                                                            if ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                            } else {
                                                                setSelectedCarrierRating({
                                                                    ...selectedCarrierRating,
                                                                    rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                    percentage: '',
                                                                    rate: '',
                                                                    total_charges: ''
                                                                })

                                                                window.setTimeout(() => {
                                                                    setCarrierSubtypeFuelSurchargeItems([]);
                                                                    refCarrierSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                }, 0);
                                                            }
                                                        } else if ((carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'miles') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                refCarrierSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (carrierSubtypeFuelSurchargeItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'percentage') {
                                                            if ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                            } else {
                                                                setSelectedCarrierRating({
                                                                    ...selectedCarrierRating,
                                                                    rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                    percentage: '',
                                                                    rate: '',
                                                                    total_charges: ''
                                                                })

                                                                window.setTimeout(() => {
                                                                    setCarrierSubtypeFuelSurchargeItems([]);
                                                                    refCarrierSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                }, 0);
                                                            }
                                                        } else if ((carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'miles') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                refCarrierSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeFuelSurchargeItems[carrierSubtypeFuelSurchargeItems.findIndex(item => item.selected)],
                                                                percentage: '',
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge') {
                                            if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeFuelSurchargeItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setCarrierSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedCarrierRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0 &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                        if (carrierSubtypeFuelSurchargeItems.length > 0) {
                                            setCarrierSubtypeFuelSurchargeItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedCarrierRating.rate_type?.id || ''),
                                                name: (selectedCarrierRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setCarrierSubtypeFuelSurchargeItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedCarrierRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refCarrierSubtypeFuelSurchargePopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refCarrierSubtypeFuelSurcharge.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                carrierSubtypeFuelSurchargeTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refCarrierSubtypeFuelSurchargeDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierSubtypeFuelSurchargeItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.rate_subtype?.id || 0) === 0 && (selectedCarrierRating.rate_subtype?.name || '') !== ''
                                                                ? selectedCarrierRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'percentage') {
                                                                            if ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
                                                                                window.alert('You must enter in a Linehaul Charge before you can enter in the Fuel Surcharge');
                                                                            } else {
                                                                                setSelectedCarrierRating({
                                                                                    ...selectedCarrierRating,
                                                                                    rate_subtype: item,
                                                                                    percentage: '',
                                                                                    rate: '',
                                                                                    total_charges: ''
                                                                                })

                                                                                window.setTimeout(() => {
                                                                                    setCarrierSubtypeFuelSurchargeItems([]);
                                                                                    refCarrierSubtypeFuelSurchargePercentage.current.inputElement.focus();
                                                                                }, 0);
                                                                            }
                                                                        } else if ((item.name || '').toLowerCase() === 'miles') {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                percentage: '',
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                                refCarrierSubtypeFuelSurchargeRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                percentage: '',
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeFuelSurchargeItems([]);
                                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refCarrierSubtypeFuelSurchargePopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE PERCENTAGE
                            display: ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined &&
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Percentage %</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Percentage %'
                                ref={refCarrierSubtypeFuelSurchargePercentage}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.percentage || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            percentage: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const linehaul = parseFloat(((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2));

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        percentage: e.target.value,
                                        total_charges: (linehaul * (Number(e.target.value) / 100)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE LINEHAUL
                            display: ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined &&
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '9rem',
                            minWidth: '9rem',
                            maxWidth: '9rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Linehaul $</div> */}
                            <MaskedInput
                                readOnly={true}
                                placeholder='Linehaul $'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={Number((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2)}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE RATE
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}

                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refCarrierSubtypeFuelSurchargeRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? parseFloat((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: Number(Number(e.target.value) * miles).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE MILES
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div> */}
                            <MaskedInput
                                readOnly={true}
                                placeholder='Miles'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={(selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : 0}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LINEHAUL RATE
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refCarrierSubtypeLinehaulRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? Number((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.replace(',', '')) * miles)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LINEHAUL MILES
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'miles') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div> */}
                            <MaskedInput
                                readOnly={true}
                                placeholder='Miles'
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={(selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : 0}
                            />
                        </div>

                        <div className="select-box-container" style={{ // LAYOVER TYPES
                            display: (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'layover' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Type'
                                    ref={refCarrierSubtypeLayover}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (carrierSubtypeLayoverItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeLayoverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeLayoverItems(carrierSubtypeLayoverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeLayoverItems(carrierSubtypeLayoverItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierSubtypeLayoverItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeLayoverPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeLayoverPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (carrierSubtypeLayoverItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeLayoverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeLayoverItems(carrierSubtypeLayoverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeLayoverItems(carrierSubtypeLayoverItems.map((item, index) => {
                                                                if (selectedIndex === (carrierSubtypeLayoverItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeLayoverPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeLayoverPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setCarrierSubtypeLayoverItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (carrierSubtypeLayoverItems.length > 0 && carrierSubtypeLayoverItems.findIndex(item => item.selected) > -1) {
                                                        if ((carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'days') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeLayoverItems([]);
                                                                refCarrierSubtypeLayoverRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeLayoverItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (carrierSubtypeLayoverItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'days') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeLayoverItems([]);
                                                                refCarrierSubtypeLayoverRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeLayoverItems[carrierSubtypeLayoverItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeLayoverItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeLayoverItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setCarrierSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeLayoverItems([]);
                                        }
                                    }}
                                    value={selectedCarrierRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0 &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {

                                        if (carrierSubtypeLayoverItems.length > 0) {
                                            setCarrierSubtypeLayoverItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedCarrierRating.rate_type?.id || ''),
                                                name: (selectedCarrierRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setCarrierSubtypeLayoverItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedCarrierRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refCarrierSubtypeLayoverPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refCarrierSubtypeLayover.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                carrierSubtypeLayoverTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refCarrierSubtypeLayoverDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierSubtypeLayoverItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.rate_subtype?.id || 0) === 0 && (selectedCarrierRating.rate_subtype?.name || '') !== ''
                                                                ? selectedCarrierRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'days') {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeLayoverItems([]);
                                                                                refCarrierSubtypeLayoverRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeLayoverItems([]);
                                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refCarrierSubtypeLayoverPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // LAYOVER RATE
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'layover' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'days') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refCarrierSubtypeLayoverRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const days = (selectedCarrierRating.days || 0);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * days)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // LAYOVER DAYS
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'layover' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'days') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Days</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Days'
                                ref={refCarrierSubtypeLayoverDays}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.days || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            days: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedCarrierRating.rate);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        days: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // DETENTION TYPES
                            display: (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'detention' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Type'
                                    ref={refCarrierSubtypeDetention}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (carrierSubtypeDetentionItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeDetentionItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeDetentionItems(carrierSubtypeDetentionItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeDetentionItems(carrierSubtypeDetentionItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierSubtypeDetentionItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeDetentionPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeDetentionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (carrierSubtypeDetentionItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeDetentionItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeDetentionItems(carrierSubtypeDetentionItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeDetentionItems(carrierSubtypeDetentionItems.map((item, index) => {
                                                                if (selectedIndex === (carrierSubtypeDetentionItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeDetentionPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeDetentionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setCarrierSubtypeDetentionItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (carrierSubtypeDetentionItems.length > 0 && carrierSubtypeDetentionItems.findIndex(item => item.selected) > -1) {
                                                        if ((carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDetentionItems([]);
                                                                refCarrierSubtypeDetentionRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDetentionItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (carrierSubtypeDetentionItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDetentionItems([]);
                                                                refCarrierSubtypeDetentionRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDetentionItems[carrierSubtypeDetentionItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDetentionItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeDetentionItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setCarrierSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeDetentionItems([]);
                                        }
                                    }}
                                    value={selectedCarrierRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                        if (carrierSubtypeDetentionItems.length > 0) {
                                            setCarrierSubtypeDetentionItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedCarrierRating.rate_type?.id || ''),
                                                name: (selectedCarrierRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setCarrierSubtypeDetentionItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedCarrierRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refCarrierSubtypeDetentionPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refCarrierSubtypeDetention.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                carrierSubtypeDetentionTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refCarrierSubtypeDetentionDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierSubtypeDetentionItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.rate_subtype?.id || 0) === 0 && (selectedCarrierRating.rate_subtype?.name || '') !== ''
                                                                ? selectedCarrierRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'hours') {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeDetentionItems([]);
                                                                                refCarrierSubtypeDetentionRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeDetentionItems([]);
                                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refCarrierSubtypeDetentionPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DETENTION RATE
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'detention' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refCarrierSubtypeDetentionRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const hours = (selectedCarrierRating.days || 0);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * hours)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // DETENTION HOURS
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'detention' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Hours'
                                ref={refCarrierSubtypeDetentionHours}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.hours || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            hours: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedCarrierRating.rate);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        hours: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="select-box-container" style={{ // DRIVER ASSIST TYPES
                            display: (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'driver assist' ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div> */}
                                <input type="text" style={{ textAlign: 'left' }}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                    placeholder='Type'
                                    ref={refCarrierSubtypeDriverAssist}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (carrierSubtypeDriverAssistItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeDriverAssistItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeDriverAssistItems(carrierSubtypeDriverAssistItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeDriverAssistItems(carrierSubtypeDriverAssistItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierSubtypeDriverAssistItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (carrierSubtypeDriverAssistItems.length > 0) {
                                                        let selectedIndex = carrierSubtypeDriverAssistItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            setCarrierSubtypeDriverAssistItems(carrierSubtypeDriverAssistItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            setCarrierSubtypeDriverAssistItems(carrierSubtypeDriverAssistItems.map((item, index) => {
                                                                if (selectedIndex === (carrierSubtypeDriverAssistItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1);
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    } else {
                                                        axios.post(props.serverUrl + '/getRateSubtypes', {
                                                            rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                            name: (selectedCarrierRating.rate_subtype?.name || '')
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                setCarrierSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                                    item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierRating.rate_subtype?.id;
                                                                    return item;
                                                                }))

                                                                refCarrierSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error getting rate types', e);
                                                        });
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setCarrierSubtypeDriverAssistItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (carrierSubtypeDriverAssistItems.length > 0 && carrierSubtypeDriverAssistItems.findIndex(item => item.selected) > -1) {
                                                        if ((carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                refCarrierSubtypeDriverAssistRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (carrierSubtypeDriverAssistItems.length > 0) {
                                                        e.preventDefault();
                                                        if ((carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)].name || '').toLowerCase() === 'hours') {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                refCarrierSubtypeDriverAssistRate.current.inputElement.focus();
                                                            }, 0);
                                                        } else {
                                                            setSelectedCarrierRating({
                                                                ...selectedCarrierRating,
                                                                rate_subtype: carrierSubtypeDriverAssistItems[carrierSubtypeDriverAssistItems.findIndex(item => item.selected)],
                                                                rate: '',
                                                                total_charges: ''
                                                            })

                                                            window.setTimeout(() => {
                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            if ((selectedCarrierRating.rate_subtype?.id || 0) === 0) {
                                                setSelectedCarrierRating({
                                                    ...selectedCarrierRating,
                                                    rate_subtype: {},
                                                    percentage: '',
                                                    rate: '',
                                                    total_charges: ''
                                                })
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        clearTimeout(delayTimer);

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeDriverAssistItems([]);
                                            delayTimer = null;
                                        } else {
                                            delayTimer = window.setTimeout(() => {
                                                axios.post(props.serverUrl + '/getRateSubtypes', {
                                                    rate_type_id: (selectedCarrierRating.rate_type?.id || 0),
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (e.target.value.trim() === '') {
                                                        return;
                                                    }
                                                    if (res.data.result === 'OK') {
                                                        setCarrierSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                            item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierRating.rate_subtype?.id;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting rate subtypes', e);
                                                })
                                            }, 200);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            rate_subtype: {
                                                id: 0,
                                                name: e.target.value
                                            }
                                        })

                                        if (e.target.value.trim() === '') {
                                            setCarrierSubtypeDriverAssistItems([]);
                                        }
                                    }}
                                    value={selectedCarrierRating.rate_subtype?.name || ''}
                                />
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                        if (carrierSubtypeDriverAssistItems.length > 0) {
                                            setCarrierSubtypeDriverAssistItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getRateTypes', {
                                                rate_type_id: (selectedCarrierRating.rate_type?.id || ''),
                                                name: (selectedCarrierRating.rate_subtype?.name || '')
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setCarrierSubtypeDriverAssistItems(res.data.rate_subtypes.map((item, index) => {
                                                        item.selected = (selectedCarrierRating.rate_subtype?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedCarrierRating.rate_subtype?.id;
                                                        return item;
                                                    }))

                                                    refCarrierSubtypeDriverAssistPopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains('selected')) {
                                                            r.scrollIntoView({
                                                                behavior: 'auto',
                                                                block: 'center',
                                                                inline: 'nearest'
                                                            })
                                                        }
                                                        return true;
                                                    });
                                                }
                                            }).catch(e => {
                                                console.log('error getting rate types', e);
                                            });
                                        }

                                        refCarrierSubtypeDriverAssist.current.focus();
                                    }
                                }} />
                            </div>
                            {
                                carrierSubtypeDriverAssistTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-subtype"
                                        style={{
                                            ...style,
                                            left: '0',
                                            display: 'block'
                                        }}
                                        ref={refCarrierSubtypeDriverAssistDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below right"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        carrierSubtypeDriverAssistItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedCarrierRating.rate_subtype?.id || 0) === 0 && (selectedCarrierRating.rate_subtype?.name || '') !== ''
                                                                ? selectedCarrierRating.rate_subtype?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        if ((item.name || '').toLowerCase() === 'hours') {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                                refCarrierSubtypeDriverAssistRate.current.inputElement.focus();
                                                                            }, 0);
                                                                        } else {
                                                                            setSelectedCarrierRating({
                                                                                ...selectedCarrierRating,
                                                                                rate_subtype: item,
                                                                                rate: '',
                                                                                total_charges: ''
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setCarrierSubtypeDriverAssistItems([]);
                                                                                refCarrierTotalCharges.current.inputElement.focus();
                                                                            }, 0);
                                                                        }
                                                                    }}
                                                                    ref={ref => refCarrierSubtypeDriverAssistPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        <div className="input-box-container" style={{ // DRIVER ASSIST RATE
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'driver assist' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Rate $'
                                ref={refCarrierSubtypeDriverAssistRate}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.rate || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const hours = (selectedCarrierRating.days || 0);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: Number((Number(e.target.value) * hours)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // DRIVER ASSIST HOURS
                            display: ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'driver assist' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'hours') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div> */}
                            <MaskedInput
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)}
                                placeholder='Hours'
                                ref={refCarrierSubtypeDriverAssistHours}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.hours || ''}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.includes('.')) {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            hours: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const rate = Number(selectedCarrierRating.rate);

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        hours: e.target.value,
                                        total_charges: Number((Number(e.target.value) * rate)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // CARRIER TOTAL CHARGES
                            width: '8rem',
                            minWidth: '8rem',
                            maxWidth: '8rem',
                            display: ((selectedCarrierRating?.rate_type?.name || '') === '' || (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'comment') ? 'none' : 'flex'
                        }}>
                            {/* <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Charges $</div> */}
                            <MaskedInput
                                readOnly={
                                    ((selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)) ||
                                    ((selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'detention'
                                        ? ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                        : (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'driver assist'
                                            ? ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                            : (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge'
                                                ? ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                                : (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'layover'
                                                    ? ((selectedCarrierRating.rate_subtype?.name || '').toLowerCase().trim() === '' || (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() !== 'flat')
                                                    : false)
                                }
                                placeholder='Total Charges $'
                                ref={refCarrierTotalCharges}
                                style={{ textAlign: 'left' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.total_charges || ''}
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)) {
                                        return;
                                    }
                                    validateCarrierRatingForSaving(e);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === '.') {
                                        if (e.target.value.includes('.')) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.toString() !== '') {
                                        setSelectedCarrierRating({
                                            ...selectedCarrierRating,
                                            total_charges: new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        total_charges: new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(e.target.value.toString().replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        total_charges: e.target.value
                                    })
                                }}
                            />
                        </div>

                    </div>

                    <div className="form-v-sep"></div>
                    <div className="form-row" style={{ flexGrow: 1, padding: '5px 5px 15px 5px' }}>
                        <div className="form-portal"
                            style={{ flexGrow: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
                            {
                                (selectedOrder?.order_carrier_ratings || []).length > 0 &&
                                <div className="rating-header">
                                    <div className="tcol rate-type">Rate Type</div>
                                    <div className="tcol description">Description</div>
                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                        <div className="tcol pieces">Pieces/Skids</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                        <div className="tcol weight">Weight</div>
                                    }

                                    {
                                        (((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) &&
                                            ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined)) &&
                                        <div className="tcol feet-required">Feet Required</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge') !== undefined ||
                                            // (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist') !== undefined) &&
                                        <div className="tcol subtype">Type</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                        <div className="tcol percentage">Percentage</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined) &&
                                        <div className="tcol miles">Miles</div>
                                    }

                                    {
                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined &&
                                        <div className="tcol days">Days</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                        <div className="tcol hours">Hours</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                        <div className="tcol rate">Rate</div>
                                    }

                                    {
                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                        <div className="tcol linehaul">Linehaul</div>
                                    }

                                    <div className="tcol total-charges">Total Charges</div>

                                </div>
                            }

                            <div className="rating-wrapper">
                                {
                                    (selectedOrder?.order_carrier_ratings || []).map((rating, index) => {
                                        return (
                                            <div className={classnames({
                                                'rating-item': true,
                                                'selected': rating.id === (selectedCarrierRating.id || 0)
                                            })} key={index} onClick={() => {
                                                if ((selectedOrder?.is_cancelled || 0) === 0 && (selectedOrder?.invoice_carrier_previewed || 0) === 0 &&
                                                    ((props.user?.user_code?.is_admin || 0) === 1 &&
                                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {

                                                    const { rate, linehaul, total_charges } = rating;

                                                    setSelectedCarrierRating({
                                                        ...rating,
                                                        rate: new Intl.NumberFormat('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(Number(rate)),
                                                        total_charges: total_charges > 0 ? new Intl.NumberFormat('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(Number(total_charges)) : ''
                                                    });
                                                }
                                            }}>
                                                <div className="tcol rate-type">{
                                                    (rating.rate_type?.name || '').toLowerCase() === 'comment' ? '' : (rating.rate_type?.name || '')
                                                }</div>
                                                <div className="tcol description">{rating.description}</div>
                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <div className="tcol pieces">
                                                        <NumberFormat
                                                            value={rating.pieces > 0 ? rating.pieces : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            suffix={(rating.pieces_unit || '') === 'pc' ? ' Pieces' : (rating.pieces_unit || '') === 'sk' ? ' Skids' : ''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <div className="tcol weight">
                                                        <NumberFormat
                                                            value={rating.weight > 0 ? rating.weight : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    (((selectedOrder?.load_type_id || 0) === 2 || (selectedOrder?.load_type_id || 0) === 3) &&
                                                        ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                            (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined)) &&
                                                    <div className="tcol feet-required">
                                                        <NumberFormat
                                                            value={rating.feet_required > 0 ? rating.feet_required : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.feet_required) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge') !== undefined ||
                                                        // (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist') !== undefined) &&
                                                    <div
                                                        className="tcol subtype">{rating.rate_subtype?.name || ''}</div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                                    <div className="tcol percentage">
                                                        <NumberFormat
                                                            value={rating.percentage > 0 ? rating.percentage : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.percentage) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            suffix={'%'}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined) &&
                                                    <div
                                                        className="tcol miles">{(rating.subtype || '').toLowerCase() === 'miles' ? (selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : '' : ''}</div>
                                                }

                                                {
                                                    (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined &&
                                                    <div className="tcol days">
                                                        <NumberFormat
                                                            value={rating.days > 0 ? rating.days : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.days) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                                    <div className="tcol hours">
                                                        <NumberFormat
                                                            value={rating.hours > 0 ? rating.hours : ''}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={Number.isInteger(rating.hours) ? 0 : 2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul' && (r.subtype || '').toLowerCase() === 'miles') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'layover' && (r.subtype || '').toLowerCase() === 'days') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'detention' && (r.subtype || '').toLowerCase() === 'hours') !== undefined ||
                                                        (selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'driver assist' && (r.subtype || '').toLowerCase() === 'hours') !== undefined) &&
                                                    <div className="tcol rate">{rating.rate > 0 ?
                                                        <NumberFormat
                                                            value={rating.rate}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={'$ '}
                                                            type="text"
                                                            displayType={'text'}
                                                        />
                                                        : ''}</div>
                                                }

                                                {
                                                    ((selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'fuel surcharge' && (r.subtype || '').toLowerCase() === 'percentage') !== undefined) &&
                                                    <div className="tcol linehaul">{
                                                        ((rating.rate_type || '').toLowerCase() === 'fuel surcharge' && (rating.subtype || '').toLowerCase() === 'percentage')
                                                            ?
                                                            <NumberFormat
                                                                value={(selectedOrder?.order_carrier_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || ''}
                                                                thousandsGroupStyle="thousand"
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                prefix={'$ '}
                                                                type="text"
                                                                displayType={'text'}
                                                            />
                                                            : ''
                                                    }</div>
                                                }

                                                <div className="tcol total-charges">
                                                    <NumberFormat
                                                        value={rating.total_charges > 0 ? rating.total_charges : ''}
                                                        thousandsGroupStyle="thousand"
                                                        thousandSeparator={true}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        prefix={'$ '}
                                                        type="text"
                                                        displayType={'text'}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* ======================================================= SEGUNDA COLUMNA =================================================== */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'auto 1fr',
                gridGap: '0.5rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridGap: '2px',
                    marginTop: -10,
                    justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 3
                    }}>
                        <span className="fas fa-chevron-left" style={{
                            fontSize: '1rem',
                            marginRight: 12,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            pointerEvents: (selectedOrder?.id || 0) === 0 || (selectedOrder?.order_number || '').toString().length < 5 ? 'none' : 'all',
                            color: (selectedOrder?.id || 0) > 0 && (selectedOrder?.order_number || '').toString().length >= 5 ? '#4096ee' : 'rgba(0,0,0,0.3)'
                        }} onClick={() => {
                            getOrderByOrderNumber({ keyCode: 9 }, 'previous');
                        }}></span>

                        <div className="mochi-button" style={{ justifyContent: 'center' }} onClick={() => {
                            setSelectedOrder({});
                            setOrderNumber('');
                            setTripNumber('');
                            setSelectedBillToCustomer({});
                            setSelectedBillToCustomerContact({});
                            setSelectedCarrier({});
                            setSelectedCarrierContact({});
                            setSelectedCarrierDriver({});
                            setSelectedRoute({});

                            refOrderNumber.current.focus({
                                preventScroll: true
                            });
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left"
                                style={{ fontSize: '0.9rem' }}>(
                            </div>
                            <div className="mochi-button-base" style={{ fontSize: '0.9rem' }}>Clear</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right"
                                style={{ fontSize: '0.9rem' }}>)
                            </div>
                        </div>

                        <span className="fas fa-chevron-right" style={{
                            fontSize: '1rem',
                            marginLeft: 12,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            pointerEvents: (selectedOrder?.id || 0) === 0 || (selectedOrder?.order_number || '').toString().length < 5 ? 'none' : 'all',
                            color: (selectedOrder?.id || 0) > 0 && (selectedOrder?.order_number || '').toString().length >= 5 ? '#4096ee' : 'rgba(0,0,0,0.3)'
                        }} onClick={() => {
                            getOrderByOrderNumber({ keyCode: 9 }, 'next');
                        }}></span>
                    </div>

                    <div className="input-box-container" style={{ width: '10rem', marginTop: -4 }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Order
                            Number:
                        </div>
                        <input style={{ textAlign: 'right', fontWeight: 'bold' }} tabIndex={1 + props.tabTimes}
                            type="text"
                            ref={refOrderNumber}
                            onKeyDown={getOrderByOrderNumber}
                            onChange={(e) => {
                                setSelectedOrder(selectedOrder => {
                                    return {
                                        ...selectedOrder,
                                        order_number: e.target.value
                                    }
                                })
                            }}
                            value={selectedOrder?.order_number || ''}
                        />
                    </div>

                    <div className="input-box-container" style={{ width: '10rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Trip Number:
                        </div>
                        <input style={{ textAlign: 'right', fontWeight: 'bold' }} tabIndex={2 + props.tabTimes}
                            type="text"
                            onKeyDown={getOrderByTripNumber}
                            onChange={(e) => {
                                setSelectedOrder(selectedOrder => {
                                    return {
                                        ...selectedOrder,
                                        trip_number: e.target.value
                                    }
                                })
                            }}
                            value={
                                (selectedOrder.trip_number || '') === ''
                                    ? ''
                                    : (
                                        selectedOrder.trip_number === 0
                                            ? ''
                                            : (
                                                (selectedCarrier.id || 0) === 0
                                                    ? ''
                                                    : selectedOrder.trip_number
                                            )
                                    )
                            }
                        />
                    </div>

                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'minmax(0, 0.8fr) 1fr',
                    gridGap: '1.5rem',
                    paddingBottom: '0.45rem'
                }}>
                    <div className='form-bordered-box'>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Bill To Docs</div>
                            <div className='top-border top-border-middle'></div>
                            <div className="form-buttons">
                                <div className={
                                    (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                } onClick={() => {
                                    if ((selectedOrder?.id || 0) === 0) {
                                        window.alert('You must select an order first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-documents`,
                                        component: <Documents
                                            title='Documents'
                                            tabTimes={45000 + props.tabTimes}
                                            panelName={`${props.panelName}-documents`}
                                            origin={props.origin}
                                            suborigin={'order-billing'}


                                            componentId={moment().format('x')}

                                            selectedOwner={{ ...selectedOrder }}
                                            selectedOwnerDocument={{
                                                id: 0,
                                                user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                date_entered: moment().format('MM/DD/YYYY')
                                            }}
                                            savingDocumentUrl='/saveOrderBillingDocument'
                                            deletingDocumentUrl='/deleteOrderBillingDocument'
                                            savingDocumentNoteUrl='/saveOrderBillingDocumentNote'
                                            deletingDocumentNoteUrl='/deleteOrderBillingDocumentNote'
                                            serverDocumentsFolder='/order-billing-documents/'
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Doc</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="form-wrapper">
                            {
                                (selectedOrder?.billing_documents || []).map((document, index) => {
                                    let docIconClasses = classnames({
                                        'fas': true,
                                        'fa-file-image': ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-word': ['doc', 'docx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-excel': ['xls', 'xlsx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-powerpoint': ['ppt', 'pptx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-code': ['htm', 'html'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-video': ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-archive': ['7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-pdf': document.doc_extension.toLowerCase() === 'pdf',
                                        'fa-file-alt': ['txt', 'log'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file': !['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd', '7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip', 'pdf', 'txt'].includes(document.doc_extension.toLowerCase())
                                    });

                                    let itemClasses = classnames({
                                        'documents-list-item': true,
                                        'selected': (selectedBillingDocument?.id || 0) === document.id
                                    });

                                    return (
                                        <div className={itemClasses} key={index} onDoubleClick={async () => {
                                            await setSelectedBillingDocument(document);

                                            let panel = {
                                                panelName: `${props.panelName}-documents`,
                                                component: <Documents
                                                    title='Documents'
                                                    tabTimes={45000 + props.tabTimes}
                                                    panelName={`${props.panelName}-documents`}
                                                    origin={props.origin}
                                                    suborigin={'order-billing'}


                                                    componentId={moment().format('x')}

                                                    selectedOwner={{ ...selectedOrder }}
                                                    selectedOwnerDocument={document}
                                                    savingDocumentUrl='/saveOrderBillingDocument'
                                                    deletingDocumentUrl='/deleteOrderBillingDocument'
                                                    savingDocumentNoteUrl='/saveOrderBillingDocumentNote'
                                                    deletingDocumentNoteUrl='/deleteOrderBillingDocumentNote'
                                                    serverDocumentsFolder='/order-billing-documents/'
                                                    permissionName='invoice'
                                                />
                                            }

                                            openPanel(panel, props.origin);
                                        }}
                                            title={`User ID: ${document.user_id}  Date Entered: ${document.date_entered}  Subject: ${document.subject}`}
                                        >
                                            <div className="item-info">
                                                <span className={docIconClasses}></span>
                                                {/* <span>{document.user_id}</span>
                                                    <span>{document.date_entered}</span> */}
                                                <span>{document.title}</span>
                                                {/* <span>{document.subject}</span> */}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='form-bordered-box'>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Order Docs</div>
                            <div className='top-border top-border-middle'></div>
                            <div className="form-buttons">
                                <div className={
                                    (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                } onClick={() => {
                                    if ((selectedOrder?.id || 0) === 0) {
                                        window.alert('You must select an order first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-documents`,
                                        component: <Documents
                                            title='Documents'
                                            tabTimes={45000 + props.tabTimes}
                                            panelName={`${props.panelName}-documents`}
                                            origin={props.origin}
                                            suborigin={'order'}


                                            componentId={moment().format('x')}

                                            selectedOwner={{ ...selectedOrder }}
                                            selectedOwnerDocument={{
                                                id: 0,
                                                user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                date_entered: moment().format('MM/DD/YYYY')
                                            }}
                                            savingDocumentUrl='/saveOrderDocument'
                                            deletingDocumentUrl='/deleteOrderDocument'
                                            savingDocumentNoteUrl='/saveOrderDocumentNote'
                                            deletingDocumentNoteUrl='/deleteOrderDocumentNote'
                                            serverDocumentsFolder='/order-documents/'
                                            permissionName='invoice'
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Doc</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="form-wrapper">
                            {
                                (selectedOrder?.documents || []).map((document, index) => {
                                    let docIconClasses = classnames({
                                        'fas': true,
                                        'fa-file-image': ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-word': ['doc', 'docx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-excel': ['xls', 'xlsx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-powerpoint': ['ppt', 'pptx'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-code': ['htm', 'html'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-video': ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-archive': ['7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file-pdf': document.doc_extension.toLowerCase() === 'pdf',
                                        'fa-file-alt': ['txt', 'log'].includes(document.doc_extension.toLowerCase()),
                                        'fa-file': !['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd', '7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip', 'pdf', 'txt'].includes(document.doc_extension.toLowerCase())
                                    });

                                    let itemClasses = classnames({
                                        'documents-list-item': true,
                                        'selected': (selectedOrderDocument?.id || 0) === document.id
                                    });

                                    return (
                                        <div className={itemClasses} key={index} onDoubleClick={async () => {
                                            await setSelectedOrderDocument(document);

                                            let panel = {
                                                panelName: `${props.panelName}-documents`,
                                                component: <Documents
                                                    title='Documents'
                                                    tabTimes={45000 + props.tabTimes}
                                                    panelName={`${props.panelName}-documents`}
                                                    origin={props.origin}
                                                    suborigin={'order'}


                                                    componentId={moment().format('x')}

                                                    selectedOwner={{ ...selectedOrder }}
                                                    selectedOwnerDocument={document}
                                                    savingDocumentUrl='/saveOrderDocument'
                                                    deletingDocumentUrl='/deleteOrderDocument'
                                                    savingDocumentNoteUrl='/saveOrderDocumentNote'
                                                    deletingDocumentNoteUrl='/deleteOrderDocumentNote'
                                                    serverDocumentsFolder='/order-documents/'
                                                    permissionName='invoice'
                                                />
                                            }

                                            openPanel(panel, props.origin);
                                        }}
                                            title={`User ID: ${document.user_id}  Date Entered: ${document.date_entered}  Subject: ${document.subject}`}
                                        >
                                            <div className="item-info">
                                                <span className={docIconClasses}></span>
                                                {/* <span>{document.user_id}</span>
                                                    <span>{document.date_entered}</span> */}
                                                <span>{document.title}</span>
                                                {/* <span>{document.subject}</span> */}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================================================= TERCERA COLUMNA =================================================== */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gridGap: '0.5rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto auto 1fr auto',
                    gridGap: '0.5rem',
                    paddingBottom: '0.45rem'
                }}>
                    <div className='form-bordered-box' style={{ minWidth: '100%', maxWidth: '100%', marginRight: 10 }}>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Bill To</div>
                            <div className='top-border top-border-middle'></div>
                            <div className='form-buttons'>
                                <div className={
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                } onClick={() => {
                                    if ((selectedBillToCustomer.id || 0) === 0) {
                                        window.alert('You must select a customer first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-customer`,
                                        component: <Customers
                                            pageName={'Customer'}
                                            title={'Bill-To Company'}
                                            panelName={`${props.panelName}-customer`}
                                            tabTimes={28000 + props.tabTimes}
                                            componentId={moment().format('x')}
                                            isOnPanel={true}
                                            isAdmin={props.isAdmin}
                                            origin={props.origin}



                                            customer_id={selectedBillToCustomer.id}
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                    <div className='mochi-button-base'>Company info</div>
                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                </div>
                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={6 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, code: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, code: e.target.value })
                                    }}
                                    value={selectedBillToCustomer.code || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={7 + props.tabTimes} type="text" placeholder="Name"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, name: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, name: e.target.value })
                                    }}
                                    value={selectedBillToCustomer.name || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={8 + props.tabTimes} type="text" placeholder="Address 1"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({
                                            ...selectedBillToCustomer,
                                            address1: e.target.value
                                        })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({
                                            ...selectedBillToCustomer,
                                            address1: e.target.value
                                        })
                                    }}
                                    value={selectedBillToCustomer.address1 || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={9 + props.tabTimes} type="text" placeholder="Address 2"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({
                                            ...selectedBillToCustomer,
                                            address2: e.target.value
                                        })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({
                                            ...selectedBillToCustomer,
                                            address2: e.target.value
                                        })
                                    }}
                                    value={selectedBillToCustomer.address2 || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={10 + props.tabTimes} type="text" placeholder="City"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, city: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, city: e.target.value })
                                    }}
                                    value={selectedBillToCustomer.city || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={11 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, state: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, state: e.target.value })
                                    }}
                                    value={selectedBillToCustomer.state || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={12 + props.tabTimes} type="text" placeholder="Postal Code"
                                    readOnly={true}
                                    // onKeyDown={validateBillToCompanyInfoForSaving}
                                    onInput={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, zip: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedBillToCustomer({ ...selectedBillToCustomer, zip: e.target.value })
                                    }}
                                    value={selectedBillToCustomer.zip || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={13 + props.tabTimes} type="text" placeholder="Contact Name"
                                    readOnly={true}
                                    onChange={(e) => {
                                        // let splitted = e.target.value.split(' ');
                                        // let first_name = splitted[0];

                                        // if (splitted.length > 1) {
                                        //     first_name += ' ';
                                        // }


                                        // let last_name = '';

                                        // splitted.map((item, index) => {
                                        //     if (index > 0) {
                                        //         last_name += item;
                                        //     }
                                        //     return true;
                                        // })

                                        // setSelectedBillToCustomerContact({ ...selectedBillToCustomerContact, first_name: first_name, last_name: last_name });

                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                contact_name: e.target.value
                                            })
                                        }
                                    }}

                                    onInput={(e) => {
                                        // let splitted = e.target.value.split(' ');
                                        // let first_name = splitted[0];

                                        // if (splitted.length > 1) {
                                        //     first_name += ' ';
                                        // }

                                        // let last_name = '';

                                        // splitted.map((item, index) => {
                                        //     if (index > 0) {
                                        //         last_name += item;
                                        //     }
                                        //     return true;
                                        // })

                                        // setSelectedBillToCustomerContact({ ...selectedBillToCustomerContact, first_name: first_name, last_name: last_name });

                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                contact_name: e.target.value
                                            })
                                        }
                                    }}

                                    value={
                                        (selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedBillToCustomer?.contact_name || '')
                                            : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).last_name
                                    } />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                <MaskedInput tabIndex={14 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    readOnly={true}
                                    onInput={(e) => {
                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                contact_phone: e.target.value
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                contact_phone: e.target.value
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedBillToCustomer?.contact_phone || '')
                                            : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_work
                                                : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }
                                />

                                {
                                    ((selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-customer-contact-primary-phone': true,
                                            'pushed': false
                                        })}>
                                        {selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).primary_phone}
                                    </div>
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={15 + props.tabTimes} type="text" placeholder="Ext"
                                    readOnly={true}
                                    // onKeyDown={validateBillToCompanyContactForSaving}
                                    onInput={(e) => {
                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                ext: e.target.value
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                            setSelectedBillToCustomer({
                                                ...selectedBillToCustomer,
                                                ext: e.target.value
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedBillToCustomer?.ext || '')
                                            : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_ext
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className='form-bordered-box' style={{ border: 0, boxShadow: 'none', padding: '0', overflow: 'hidden', marginBottom: 5 }}>
                        <div className="form-row" style={{ marginBottom: 5, overflow: 'auto' }}>
                            <div className="swiper-invoice-prev-btn">
                                <span className="fas fa-chevron-left"></span>
                            </div>

                            <Swiper
                                slidesPerView={5}
                                navigation={{
                                    prevEl: ".swiper-invoice-prev-btn",
                                    nextEl: ".swiper-invoice-next-btn",
                                }}
                            >
                                {
                                    [
                                        ...getPickupsOnRouting(),
                                        ...(selectedOrder?.pickups || []).filter(p => (selectedOrder?.routing || []).find(r => r.pickup_id === p.id) === undefined),
                                        ...getDeliveriesOnRouting(),
                                        ...(selectedOrder?.deliveries || []).filter(d => (selectedOrder?.routing || []).find(r => r.delivery_id === d.id) === undefined)
                                    ].length > 0 ?
                                        [
                                            ...getPickupsOnRouting(),
                                            ...(selectedOrder?.pickups || []).filter(p => (selectedOrder?.routing || []).find(r => r.pickup_id === p.id) === undefined),
                                            ...getDeliveriesOnRouting(),
                                            ...(selectedOrder?.deliveries || []).filter(d => (selectedOrder?.routing || []).find(r => r.delivery_id === d.id) === undefined)
                                        ].map((route, index) => {
                                            let classes = classnames({
                                                'order-pickup': true,
                                                'selected': selectedRoute?.id === route.id
                                            })

                                            return (
                                                <SwiperSlide
                                                    className={classes} key={index} onClick={() => {
                                                        setSelectedRoute(route);
                                                    }}
                                                >
                                                    <div className="slide-wrapper">
                                                        {route.type === 'pickup' ? 'PU' : 'Delivery'} {
                                                            route.type === 'pickup'
                                                                ? ([
                                                                    ...getPickupsOnRouting(),
                                                                    ...(selectedOrder?.pickups || []).filter(p => (selectedOrder?.routing || []).find(r => r.pickup_id === p.id) === undefined)
                                                                ].map(x => x.id).indexOf(route.id)) + 1
                                                                : ([
                                                                    ...getDeliveriesOnRouting(),
                                                                    ...(selectedOrder?.deliveries || []).filter(d => (selectedOrder?.routing || []).find(r => r.delivery_id === d.id) === undefined)
                                                                ].map(x => x.id).indexOf(route.id)) + 1
                                                        }
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                        : '' // <SwiperSlide className='order-pickup' style={{ pointerEvents: 'none' }}>PU 0</SwiperSlide>
                                }

                            </Swiper>

                            <div className="swiper-invoice-next-btn">
                                <span className="fas fa-chevron-right"></span>
                            </div>

                        </div>
                        <div className="form-row" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridGap: 5
                        }}>
                            <div className='selected-pickup-number'>
                                <span>BOL Numbers:</span>
                                {
                                    (selectedRoute?.bol_numbers || '').split('|').map((item, index) => {
                                        if (item.trim() !== '') {
                                            return (<span>{item}</span>)
                                        } else {
                                            return ''
                                        }
                                    })
                                }
                            </div>
                            <div className='selected-pickup-number'>
                                <span>Ref Numbers:</span>
                                {
                                    (selectedRoute?.ref_numbers || '').split('|').map((item, index) => {
                                        if (item.trim() !== '') {
                                            return (<span>{item}</span>)
                                        } else {
                                            return ''
                                        }
                                    })
                                }
                            </div>
                            <div className='selected-pickup-number'>
                                <span>PO Numbers:</span>
                                {
                                    (selectedRoute?.po_numbers || '').split('|').map((item, index) => {
                                        if (item.trim() !== '') {
                                            return (<span>{item}</span>)
                                        } else {
                                            return ''
                                        }
                                    })
                                }
                            </div>
                            <div className='selected-pickup-number'>
                                <span>Seal Number:</span> <span>{selectedRoute?.seal_number || ''}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: '0.5rem'
                    }}>
                        <div className='form-bordered-box'>
                            <div className='form-header'>
                                <div className='top-border top-border-left'></div>
                                <div className='form-title'>Internal Notes</div>
                                <div className='top-border top-border-middle'></div>
                                <div className='form-buttons'>
                                    <div className={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if ((selectedOrder?.id || 0) === 0) {
                                            window.alert('You must select an order first!');
                                            return;
                                        }
                                        setSelectedInternalNote({ id: 0 });
                                    }}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Add note</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                </div>
                                <div className='top-border top-border-right'></div>
                            </div>

                            <div className="internal-notes-container">
                                <div className="internal-notes-wrapper">
                                    {
                                        (selectedOrder?.internal_notes || []).map((note, index) => {
                                            return (
                                                <div className="internal-notes-item" key={index}
                                                    onClick={() => setSelectedInternalNote(note)}>
                                                    {note.text}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='form-bordered-box'>
                            <div className='form-header'>
                                <div className='top-border top-border-left'></div>
                                <div className='form-title'>Billing Notes</div>
                                <div className='top-border top-border-middle'></div>
                                <div className='form-buttons'>
                                    <div className={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                            (selectedOrder?.invoice_customer_reviewed || 0) === 1 ||
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if ((selectedOrder?.id || 0) === 0) {
                                            window.alert('You must select an order first!');
                                            return;
                                        }
                                        setSelectedBillingNote({ id: 0 });
                                    }}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Add note</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                </div>
                                <div className='top-border top-border-right'></div>
                            </div>

                            <div className="internal-notes-container">
                                <div className="internal-notes-wrapper">
                                    {
                                        (selectedOrder?.billing_notes || []).map((note, index) => {
                                            return (
                                                <div className="internal-notes-item" key={index}
                                                    onClick={() => setSelectedBillingNote(note)}>
                                                    {note.text}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='form-bordered-box' style={{ minWidth: '100%', maxWidth: '100%', marginRight: 10 }}>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Carrier</div>
                            <div className='top-border top-border-middle'></div>
                            <div className='form-buttons'>
                                <div className={
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                } onClick={() => {
                                    if ((selectedCarrier.id || 0) === 0) {
                                        window.alert('You must select a carrier first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-carrier`,
                                        component: <Carriers
                                            pageName={'Carrier'}
                                            title={'Carrier'}
                                            panelName={'carrier'}
                                            tabTimes={35000 + props.tabTimes}
                                            screenFocused={props.carrierScreenFocused}
                                            componentId={moment().format('x')}
                                            isOnPanel={true}
                                            isAdmin={props.isAdmin}
                                            origin={props.origin}



                                            carrier_id={selectedCarrier.id}
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                    <div className='mochi-button-base'>Carrier info</div>
                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                </div>
                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={50 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    readOnly={true}
                                    onInput={e => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    value={(selectedCarrier.code_number || 0) === 0 ? (selectedCarrier.code || '') : selectedCarrier.code + selectedCarrier.code_number}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={51 + props.tabTimes} type="text" placeholder="Name"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedCarrier({ ...selectedCarrier, name: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrier({ ...selectedCarrier, name: e.target.value })
                                    }}
                                    value={selectedCarrier?.name || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className={insuranceStatusClasses()} style={{ width: '7rem' }}>
                                <input type="text" placeholder="Insurance" readOnly={true} tabIndex={-1} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={52 + props.tabTimes} type="text"
                                    placeholder="Carrier Load - Starting City State - Destination City State"
                                    readOnly={true}
                                    value={
                                        ((selectedOrder?.routing || []).length >= 2 && (selectedOrder?.carrier?.id || 0) > 0)
                                            ? selectedOrder.routing[0].type === 'pickup'
                                                ? ((selectedOrder.pickups.find(p => p.id === selectedOrder.routing[0].pickup_id).customer?.city || '') + ', ' + (selectedOrder.pickups.find(p => p.id === selectedOrder.routing[0].pickup_id).customer?.state || '') +
                                                    ' - ' + (selectedOrder.routing[selectedOrder.routing.length - 1].type === 'pickup'
                                                        ? (selectedOrder.pickups.find(p => p.id === selectedOrder.routing[selectedOrder.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (selectedOrder.pickups.find(p => p.id === selectedOrder.routing[selectedOrder.routing.length - 1].pickup_id).customer?.state || '') :
                                                        (selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[selectedOrder.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[selectedOrder.routing.length - 1].delivery_id).customer?.state || '')))

                                                : ((selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[0].delivery_id).customer?.city || '') + ', ' + (selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[0].delivery_id).customer?.state || '') +
                                                    ' - ' + (selectedOrder.routing[selectedOrder.routing.length - 1].type === 'pickup'
                                                        ? (selectedOrder.pickups.find(p => p.id === selectedOrder.routing[selectedOrder.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (selectedOrder.pickups.find(p => p.id === selectedOrder.routing[selectedOrder.routing.length - 1].pickup_id).customer?.state || '') :
                                                        (selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[selectedOrder.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (selectedOrder.deliveries.find(d => d.id === selectedOrder.routing[selectedOrder.routing.length - 1].delivery_id).customer?.state || '')))
                                            : ''
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{
                                maxWidth: '7.5rem',
                                minWidth: '7.5rem'
                            }}>
                                <input tabIndex={53 + props.tabTimes} type="text" placeholder="Contact Name"
                                    readOnly={true}
                                    onChange={(e) => {
                                        if ((selectedCarrierContact?.contacts || []).length === 0) {
                                            setSelectedCarrierContact({
                                                ...selectedCarrierContact,
                                                contact_name: e.target.value
                                            })
                                        }
                                    }}
                                    onInput={(e) => {
                                        if ((selectedCarrierContact?.contacts || []).length === 0) {
                                            setSelectedCarrierContact({
                                                ...selectedCarrierContact,
                                                contact_name: e.target.value
                                            })
                                        }
                                    }}

                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.contact_name || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedCarrier?.contacts.find(c => c.is_primary === 1).last_name
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{
                                position: 'relative',
                                maxWidth: '7.5rem',
                                minWidth: '7.5rem'
                            }}>
                                <MaskedInput tabIndex={54 + props.tabTimes}
                                    title={capitalize(((selectedCarrier?.contacts || []).find(c => c.is_primary === 1)?.primary_phone || ''))}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    readOnly={true}
                                    // onInput={(e) => { setSelectedCarrierContact({ ...selectedCarrierContact, phone_work: e.target.value }) }}
                                    // onChange={(e) => { setSelectedCarrierContact({ ...selectedCarrierContact, phone_work: e.target.value }) }}
                                    // value={selectedCarrierContact.phone_work || ''}

                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                contact_phone: e.target.value
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                contact_phone: e.target.value
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.contact_phone || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_work
                                                : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }
                                />

                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={55 + props.tabTimes} type="text" placeholder="Ext"
                                    readOnly={true}
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, ext: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, ext: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.ext || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_ext
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="select-box-container" style={{ width: '9rem', position: 'relative' }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        tabIndex={56 + props.tabTimes}
                                        placeholder="Equipment"
                                        ref={refEquipment}
                                        readOnly={true}
                                        // onKeyDown={(e) => {
                                        //     let key = e.keyCode || e.which;
                                        //
                                        //     switch (key) {
                                        //         case 37:
                                        //         case 38: // arrow left | arrow up
                                        //             e.preventDefault();
                                        //             if (equipmentItems.length > 0) {
                                        //                 let selectedIndex = equipmentItems.findIndex(item => item.selected);
                                        //
                                        //                 if (selectedIndex === -1) {
                                        //                     setEquipmentItems(equipmentItems.map((item, index) => {
                                        //                         item.selected = index === 0;
                                        //                         return item;
                                        //                     }))
                                        //                 } else {
                                        //                     setEquipmentItems(equipmentItems.map((item, index) => {
                                        //                         if (selectedIndex === 0) {
                                        //                             item.selected = index === (equipmentItems.length - 1);
                                        //                         } else {
                                        //                             item.selected = index === (selectedIndex - 1)
                                        //                         }
                                        //                         return item;
                                        //                     }))
                                        //                 }
                                        //
                                        //                 refEquipmentPopupItems.current.map((r, i) => {
                                        //                     if (r && r.classList.contains('selected')) {
                                        //                         r.scrollIntoView({
                                        //                             behavior: 'auto',
                                        //                             block: 'center',
                                        //                             inline: 'nearest'
                                        //                         })
                                        //                     }
                                        //                     return true;
                                        //                 });
                                        //             } else {
                                        //                 axios.post(props.serverUrl + '/getEquipments').then(res => {
                                        //                     if (res.data.result === 'OK') {
                                        //                         setEquipmentItems(res.data.equipments.map((item, index) => {
                                        //                             item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                        //                                 ? index === 0
                                        //                                 : item.id === selectedCarrierDriver.equipment.id
                                        //                             return item;
                                        //                         }))
                                        //
                                        //                         refEquipmentPopupItems.current.map((r, i) => {
                                        //                             if (r && r.classList.contains('selected')) {
                                        //                                 r.scrollIntoView({
                                        //                                     behavior: 'auto',
                                        //                                     block: 'center',
                                        //                                     inline: 'nearest'
                                        //                                 })
                                        //                             }
                                        //                             return true;
                                        //                         });
                                        //                     }
                                        //                 }).catch(e => {
                                        //                     console.log('error getting equipments', e);
                                        //                 })
                                        //             }
                                        //             break;
                                        //
                                        //         case 39:
                                        //         case 40: // arrow right | arrow down
                                        //             e.preventDefault();
                                        //             if (equipmentItems.length > 0) {
                                        //                 let selectedIndex = equipmentItems.findIndex(item => item.selected);
                                        //
                                        //                 if (selectedIndex === -1) {
                                        //                     setEquipmentItems(equipmentItems.map((item, index) => {
                                        //                         item.selected = index === 0;
                                        //                         return item;
                                        //                     }))
                                        //                 } else {
                                        //                     setEquipmentItems(equipmentItems.map((item, index) => {
                                        //                         if (selectedIndex === (equipmentItems.length - 1)) {
                                        //                             item.selected = index === 0;
                                        //                         } else {
                                        //                             item.selected = index === (selectedIndex + 1)
                                        //                         }
                                        //                         return item;
                                        //                     }))
                                        //                 }
                                        //
                                        //                 refEquipmentPopupItems.current.map((r, i) => {
                                        //                     if (r && r.classList.contains('selected')) {
                                        //                         r.scrollIntoView({
                                        //                             behavior: 'auto',
                                        //                             block: 'center',
                                        //                             inline: 'nearest'
                                        //                         })
                                        //                     }
                                        //                     return true;
                                        //                 });
                                        //             } else {
                                        //                 axios.post(props.serverUrl + '/getEquipments').then(res => {
                                        //                     if (res.data.result === 'OK') {
                                        //                         setEquipmentItems(res.data.equipments.map((item, index) => {
                                        //                             item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                        //                                 ? index === 0
                                        //                                 : item.id === selectedCarrierDriver.equipment.id
                                        //                             return item;
                                        //                         }))
                                        //
                                        //                         refEquipmentPopupItems.current.map((r, i) => {
                                        //                             if (r && r.classList.contains('selected')) {
                                        //                                 r.scrollIntoView({
                                        //                                     behavior: 'auto',
                                        //                                     block: 'center',
                                        //                                     inline: 'nearest'
                                        //                                 })
                                        //                             }
                                        //                             return true;
                                        //                         });
                                        //                     }
                                        //                 }).catch(e => {
                                        //                     console.log('error getting equipments', e);
                                        //                 })
                                        //             }
                                        //             break;
                                        //
                                        //         case 27: // escape
                                        //             setEquipmentItems([]);
                                        //             break;
                                        //
                                        //         case 13: // enter
                                        //             if (equipmentItems.length > 0 && equipmentItems.findIndex(item => item.selected) > -1) {
                                        //                 if (equipmentItems.length > 0 && equipmentItems.findIndex(item => item.selected) > -1) {
                                        //                     setSelectedOrder(selectedOrder => {
                                        //                         return {
                                        //                             ...selectedOrder,
                                        //                             equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                        //                             equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id
                                        //                         }
                                        //                     });
                                        //
                                        //                     // validateOrderForSaving({ keyCode: 9 });
                                        //                     setEquipmentItems([]);
                                        //                     refDriverName.current.focus();
                                        //                 }
                                        //             }
                                        //             break;
                                        //
                                        //         case 9: // tab
                                        //             if (equipmentItems.length > 0) {
                                        //                 e.preventDefault();
                                        //                 setSelectedOrder(selectedOrder => {
                                        //                     return {
                                        //                         ...selectedOrder,
                                        //                         equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                        //                         equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id
                                        //                     }
                                        //                 });
                                        //
                                        //                 // validateOrderForSaving({ keyCode: 9 });
                                        //                 setEquipmentItems([]);
                                        //                 refDriverName.current.focus();
                                        //             }
                                        //             break;
                                        //
                                        //         default:
                                        //             break;
                                        //     }
                                        // }}
                                        onBlur={() => {
                                            if ((selectedOrder?.equipment?.id || 0) === 0) {
                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        equipment_id: null,
                                                        equipment: {}
                                                    }
                                                });
                                            }
                                        }}
                                        onInput={(e) => {
                                            let equipment = selectedOrder?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    equipment: equipment,
                                                    equipment_id: equipment.id
                                                }
                                            });

                                            if (e.target.value.trim() === '') {
                                                setEquipmentItems([]);
                                            } else {
                                                axios.post(props.serverUrl + '/getEquipments', {
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setEquipmentItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedOrder?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedOrder.equipment.id
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(e => {
                                                    console.log('error getting equipments', e);
                                                })
                                            }
                                        }}
                                        onChange={(e) => {
                                            let equipment = selectedOrder?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    equipment: equipment,
                                                    equipment_id: equipment.id
                                                }
                                            });
                                        }}
                                        value={selectedOrder?.equipment?.name || ''}
                                    />
                                    {/*<FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {*/}
                                    {/*    if (equipmentItems.length > 0) {*/}
                                    {/*        setEquipmentItems([]);*/}
                                    {/*    } else {*/}
                                    {/*        if ((selectedOrder?.equipment?.id || 0) === 0 && (selectedOrder?.equipment?.name || '') !== '') {*/}
                                    {/*            axios.post(props.serverUrl + '/getEquipments', {*/}
                                    {/*                name: selectedOrder?.equipment.name*/}
                                    {/*            }).then(res => {*/}
                                    {/*                if (res.data.result === 'OK') {*/}
                                    {/*                    setEquipmentItems(res.data.equipments.map((item, index) => {*/}
                                    {/*                        item.selected = (selectedOrder?.equipment?.id || 0) === 0*/}
                                    {/*                            ? index === 0*/}
                                    {/*                            : item.id === selectedOrder.equipment.id*/}
                                    {/*                        return item;*/}
                                    {/*                    }))*/}

                                    {/*                    refEquipmentPopupItems.current.map((r, i) => {*/}
                                    {/*                        if (r && r.classList.contains('selected')) {*/}
                                    {/*                            r.scrollIntoView({*/}
                                    {/*                                behavior: 'auto',*/}
                                    {/*                                block: 'center',*/}
                                    {/*                                inline: 'nearest'*/}
                                    {/*                            })*/}
                                    {/*                        }*/}
                                    {/*                        return true;*/}
                                    {/*                    });*/}
                                    {/*                }*/}
                                    {/*            }).catch(e => {*/}
                                    {/*                console.log('error getting equipments', e);*/}
                                    {/*            })*/}
                                    {/*        } else {*/}
                                    {/*            axios.post(props.serverUrl + '/getEquipments').then(res => {*/}
                                    {/*                if (res.data.result === 'OK') {*/}
                                    {/*                    setEquipmentItems(res.data.equipments.map((item, index) => {*/}
                                    {/*                        item.selected = (selectedOrder?.equipment?.id || 0) === 0*/}
                                    {/*                            ? index === 0*/}
                                    {/*                            : item.id === selectedOrder.equipment.id*/}
                                    {/*                        return item;*/}
                                    {/*                    }))*/}

                                    {/*                    refEquipmentPopupItems.current.map((r, i) => {*/}
                                    {/*                        if (r && r.classList.contains('selected')) {*/}
                                    {/*                            r.scrollIntoView({*/}
                                    {/*                                behavior: 'auto',*/}
                                    {/*                                block: 'center',*/}
                                    {/*                                inline: 'nearest'*/}
                                    {/*                            })*/}
                                    {/*                        }*/}
                                    {/*                        return true;*/}
                                    {/*                    });*/}
                                    {/*                }*/}
                                    {/*            }).catch(async e => {*/}
                                    {/*                console.log('error getting equipments', e);*/}
                                    {/*            })*/}
                                    {/*        }*/}
                                    {/*    }*/}

                                    {/*    refEquipment.current.focus();*/}
                                    {/*}}/>*/}
                                </div>
                                {
                                    equipmentTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-equipment"
                                            style={{
                                                ...style,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refEquipmentDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            equipmentItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedOrder?.equipment?.id || 0) === 0 && (selectedOrder?.equipment?.name || '') !== ''
                                                                    ? selectedOrder?.equipment?.name : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={() => {
                                                                            setSelectedOrder(selectedOrder => {
                                                                                return {
                                                                                    ...selectedOrder,
                                                                                    equipment: item,
                                                                                    equipment_id: item.id
                                                                                }
                                                                            });

                                                                            // validateOrderForSaving({ keyCode: 9 });
                                                                            setEquipmentItems([]);
                                                                            refDriverName.current.focus();
                                                                        }}
                                                                        ref={ref => refEquipmentPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            searchValue === undefined
                                                                                ? item.name
                                                                                : <Highlighter
                                                                                    highlightClassName="mochi-item-highlight-text"
                                                                                    searchWords={[searchValue]}
                                                                                    autoEscape={true}
                                                                                    textToHighlight={item.name}
                                                                                />
                                                                        }
                                                                        {
                                                                            item.selected &&
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
                                                                                icon={faCaretRight} />
                                                                        }
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{
                                maxWidth: '7.5rem',
                                minWidth: '7.5rem'
                            }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        tabIndex={57 + props.tabTimes}
                                        placeholder="Driver Name"
                                        ref={refDriverName}
                                        readOnly={true}
                                        // onKeyDown={async (e) => {
                                        //     let key = e.keyCode || e.which;
                                        //
                                        //     switch (key) {
                                        //         case 37:
                                        //         case 38: // arrow left | arrow up
                                        //             e.preventDefault();
                                        //             if (driverItems.length > 0) {
                                        //                 let selectedIndex = driverItems.findIndex(item => item.selected);
                                        //
                                        //                 if (selectedIndex === -1) {
                                        //                     await setDriverItems(driverItems.map((item, index) => {
                                        //                         item.selected = index === 0;
                                        //                         return item;
                                        //                     }))
                                        //                 } else {
                                        //                     await setDriverItems(driverItems.map((item, index) => {
                                        //                         if (selectedIndex === 0) {
                                        //                             item.selected = index === (driverItems.length - 1);
                                        //                         } else {
                                        //                             item.selected = index === (selectedIndex - 1)
                                        //                         }
                                        //                         return item;
                                        //                     }))
                                        //                 }
                                        //
                                        //                 refDriverPopupItems.current.map((r, i) => {
                                        //                     if (r && r.classList.contains('selected')) {
                                        //                         r.scrollIntoView({
                                        //                             behavior: 'auto',
                                        //                             block: 'center',
                                        //                             inline: 'nearest'
                                        //                         })
                                        //                     }
                                        //                     return true;
                                        //                 });
                                        //             } else {
                                        //                 if ((selectedCarrier?.id || 0) > 0) {
                                        //                     axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                        //                         carrier_id: selectedCarrier.id
                                        //                     }).then(async res => {
                                        //                         if (res.data.result === 'OK') {
                                        //                             if (res.data.count > 1) {
                                        //                                 await setDriverItems(res.data.drivers.map((item, index) => {
                                        //                                     item.selected = (selectedCarrierDriver?.id || 0) === 0
                                        //                                         ? index === 0
                                        //                                         : item.id === selectedCarrierDriver.id
                                        //                                     return item;
                                        //                                 }))
                                        //
                                        //                                 refDriverPopupItems.current.map((r, i) => {
                                        //                                     if (r && r.classList.contains('selected')) {
                                        //                                         r.scrollIntoView({
                                        //                                             behavior: 'auto',
                                        //                                             block: 'center',
                                        //                                             inline: 'nearest'
                                        //                                         })
                                        //                                     }
                                        //                                     return true;
                                        //                                 });
                                        //                             }
                                        //                         }
                                        //                     }).catch(async e => {
                                        //                         console.log('error getting carrier drivers', e);
                                        //                     })
                                        //                 }
                                        //             }
                                        //             break;
                                        //
                                        //         case 39:
                                        //         case 40: // arrow right | arrow down
                                        //             e.preventDefault();
                                        //             if (driverItems.length > 0) {
                                        //                 let selectedIndex = driverItems.findIndex(item => item.selected);
                                        //
                                        //                 if (selectedIndex === -1) {
                                        //                     await setDriverItems(driverItems.map((item, index) => {
                                        //                         item.selected = index === 0;
                                        //                         return item;
                                        //                     }))
                                        //                 } else {
                                        //                     await setDriverItems(driverItems.map((item, index) => {
                                        //                         if (selectedIndex === (driverItems.length - 1)) {
                                        //                             item.selected = index === 0;
                                        //                         } else {
                                        //                             item.selected = index === (selectedIndex + 1)
                                        //                         }
                                        //                         return item;
                                        //                     }))
                                        //                 }
                                        //
                                        //                 refDriverPopupItems.current.map((r, i) => {
                                        //                     if (r && r.classList.contains('selected')) {
                                        //                         r.scrollIntoView({
                                        //                             behavior: 'auto',
                                        //                             block: 'center',
                                        //                             inline: 'nearest'
                                        //                         })
                                        //                     }
                                        //                     return true;
                                        //                 });
                                        //             } else {
                                        //                 if ((selectedCarrier?.id || 0) > 0) {
                                        //                     axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                        //                         carrier_id: selectedCarrier.id
                                        //                     }).then(async res => {
                                        //                         if (res.data.result === 'OK') {
                                        //                             if (res.data.count > 1) {
                                        //                                 await setDriverItems(res.data.drivers.map((item, index) => {
                                        //                                     item.selected = (selectedCarrierDriver?.id || 0) === 0
                                        //                                         ? index === 0
                                        //                                         : item.id === selectedCarrierDriver.id
                                        //                                     return item;
                                        //                                 }))
                                        //
                                        //                                 refDriverPopupItems.current.map((r, i) => {
                                        //                                     if (r && r.classList.contains('selected')) {
                                        //                                         r.scrollIntoView({
                                        //                                             behavior: 'auto',
                                        //                                             block: 'center',
                                        //                                             inline: 'nearest'
                                        //                                         })
                                        //                                     }
                                        //                                     return true;
                                        //                                 });
                                        //                             }
                                        //                         }
                                        //                     }).catch(async e => {
                                        //                         console.log('error getting carrier drivers', e);
                                        //                     })
                                        //                 }
                                        //             }
                                        //             break;
                                        //
                                        //         case 27: // escape
                                        //             setDriverItems([]);
                                        //             break;
                                        //
                                        //         case 13: // enter
                                        //             if (driverItems.length > 0 && driverItems.findIndex(item => item.selected) > -1) {
                                        //                 await setSelectedCarrierDriver(driverItems[driverItems.findIndex(item => item.selected)]);
                                        //
                                        //                 await setSelectedOrder({
                                        //                     ...selectedOrder,
                                        //                     carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id
                                        //                 })
                                        //
                                        //                 // validateOrderForSaving({ keyCode: 9 });
                                        //                 setDriverItems([]);
                                        //                 refDriverName.current.focus();
                                        //             }
                                        //             break;
                                        //
                                        //         case 9: // tab
                                        //             if (driverItems.length > 0) {
                                        //                 e.preventDefault();
                                        //                 await setSelectedCarrierDriver(driverItems[driverItems.findIndex(item => item.selected)]);
                                        //
                                        //                 await setSelectedOrder({
                                        //                     ...selectedOrder,
                                        //                     carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id
                                        //                 })
                                        //
                                        //                 // validateOrderForSaving({ keyCode: 9 });
                                        //                 setDriverItems([]);
                                        //                 refDriverName.current.focus();
                                        //             }
                                        //             break;
                                        //
                                        //         default:
                                        //             break;
                                        //     }
                                        // }}
                                        onBlur={async (e) => {
                                            if ((selectedCarrierDriver?.id || 0) === 0) {
                                                await setSelectedCarrierDriver({});
                                                await setSelectedOrder({
                                                    ...selectedOrder,
                                                    carrier_driver_id: 0
                                                })

                                                // validateOrderForSaving({ keyCode: 9 });
                                            }
                                        }}
                                        onInput={async (e) => {
                                            let driver = selectedCarrierDriver || {};
                                            driver.id = 0;

                                            if (e.target.value === '') {
                                                driver = {};
                                                await setSelectedCarrierDriver({ ...driver });
                                                setDriverItems([]);
                                            } else {
                                                let splitted = e.target.value.split(' ');
                                                let first_name = splitted[0];

                                                if (splitted.length > 1) {
                                                    first_name += ' ';
                                                }

                                                let last_name = '';

                                                splitted.map((item, index) => {
                                                    if (index > 0) {
                                                        last_name += item;
                                                    }
                                                    return true;
                                                })

                                                setSelectedCarrierDriver({
                                                    ...driver,
                                                    first_name: first_name,
                                                    last_name: last_name
                                                });
                                            }
                                        }}
                                        onChange={async (e) => {
                                            let driver = selectedCarrierDriver || {};
                                            driver.id = 0;

                                            if (e.target.value === '') {
                                                driver = {};
                                                setSelectedCarrierDriver({ ...driver });
                                                setDriverItems([]);
                                            } else {
                                                let splitted = e.target.value.split(' ');
                                                let first_name = splitted[0];

                                                if (splitted.length > 1) {
                                                    first_name += ' ';
                                                }

                                                let last_name = '';

                                                splitted.map((item, index) => {
                                                    if (index > 0) {
                                                        last_name += item;
                                                    }
                                                    return true;
                                                })

                                                setSelectedCarrierDriver({
                                                    ...driver,
                                                    first_name: first_name,
                                                    last_name: last_name
                                                });
                                            }
                                        }}
                                        value={(selectedCarrierDriver?.first_name || '') + ((selectedCarrierDriver?.last_name || '').trim() === '' ? '' : ' ' + selectedCarrierDriver?.last_name)}
                                    />
                                    {
                                        // (selectedCarrier?.drivers || []).length > 1 &&

                                        // <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        //     if (driverItems.length > 0) {
                                        //         setDriverItems([]);
                                        //     } else {
                                        //         window.setTimeout(async () => {
                                        //             if ((selectedCarrier?.id || 0) > 0) {
                                        //                 axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                        //                     carrier_id: selectedCarrier.id
                                        //                 }).then(async res => {
                                        //                     if (res.data.result === 'OK') {
                                        //                         if (res.data.count > 1) {
                                        //                             await setDriverItems(res.data.drivers.map((item, index) => {
                                        //                                 item.selected = (selectedCarrierDriver?.id || 0) === 0
                                        //                                     ? index === 0
                                        //                                     : item.id === selectedCarrierDriver.id
                                        //                                 return item;
                                        //                             }))
                                        //
                                        //                             refDriverPopupItems.current.map((r, i) => {
                                        //                                 if (r && r.classList.contains('selected')) {
                                        //                                     r.scrollIntoView({
                                        //                                         behavior: 'auto',
                                        //                                         block: 'center',
                                        //                                         inline: 'nearest'
                                        //                                     })
                                        //                                 }
                                        //                                 return true;
                                        //                             });
                                        //                         }
                                        //                     }
                                        //                 }).catch(async e => {
                                        //                     console.log('error getting carrier drivers', e);
                                        //                 })
                                        //             }
                                        //
                                        //             refDriverName.current.focus();
                                        //         }, 0)
                                        //     }
                                        // }}/>
                                    }
                                </div>
                                {
                                    driverTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-driver-name"
                                            style={{
                                                ...style,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refDriverDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            driverItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedCarrierDriver?.first_name || '') + ((selectedCarrierDriver?.last_name || '').trim() === '' ? '' : ' ' + selectedCarrierDriver?.last_name);

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={async () => {
                                                                            await setSelectedCarrierDriver(item);

                                                                            await setSelectedOrder({
                                                                                ...selectedOrder,
                                                                                carrier_driver_id: item.id
                                                                            })

                                                                            // validateOrderForSaving({ keyCode: 9 });
                                                                            setDriverItems([]);
                                                                            refDriverName.current.focus();
                                                                        }}
                                                                        ref={ref => refDriverPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            searchValue === undefined
                                                                                ? (item?.first_name || '') + ((item?.last_name || '') === '' ? '' : ' ' + item.last_name)
                                                                                : <Highlighter
                                                                                    highlightClassName="mochi-item-highlight-text"
                                                                                    searchWords={[(selectedCarrierDriver?.first_name || ''), (selectedCarrierDriver?.last_name || '')]}
                                                                                    autoEscape={true}
                                                                                    textToHighlight={(item?.first_name || '') + ((item?.last_name || '') === '' ? '' : ' ' + item.last_name)}
                                                                                />
                                                                        }
                                                                        {
                                                                            item.selected &&
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
                                                                                icon={faCaretRight} />
                                                                        }
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>

                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{
                                maxWidth: '7.5rem',
                                minWidth: '7.5rem'
                            }}>
                                <MaskedInput tabIndex={58 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Driver Phone"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedCarrierDriver({
                                            ...selectedCarrierDriver,
                                            phone: e.target.value
                                        })
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierDriver({
                                            ...selectedCarrierDriver,
                                            phone: e.target.value
                                        })
                                    }}
                                    value={selectedCarrierDriver.phone || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container">
                                <input tabIndex={59 + props.tabTimes} type="text" placeholder="Unit Number"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedCarrierDriver({ ...selectedCarrierDriver, truck: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierDriver({ ...selectedCarrierDriver, truck: e.target.value })
                                    }}
                                    value={selectedCarrierDriver.truck || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container">
                                <input tabIndex={60 + props.tabTimes} type="text" placeholder="Trailer Number"
                                    readOnly={true}
                                    onInput={(e) => {
                                        setSelectedCarrierDriver({ ...selectedCarrierDriver, trailer: e.target.value })
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrierDriver({ ...selectedCarrierDriver, trailer: e.target.value })
                                    }}
                                    value={selectedCarrierDriver.trailer || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flexGrow: 1,
                            alignItems: 'flex-end',
                            marginTop: 21
                        }}>
                            <div className={
                                ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    ? 'mochi-button disabled' : 'mochi-button'
                            } style={{ fontSize: '1rem' }}>
                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                <div className='mochi-button-base'>E-mail Rate Confirmation To Carrier</div>
                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingBottom: '0.45rem'
                }}>
                    <div className='fixed' style={{
                        minWidth: '10rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gridGap: '0.5rem',
                        marginTop: -2
                    }}>
                        <div className={
                            (selectedOrder?.is_cancelled || 0) === 1 ||
                                (selectedOrder?.order_invoiced || 0) === 0 ||
                                ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                ? 'mochi-button disabled' : 'mochi-button'
                        } style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => {
                                if ((selectedOrder?.id || 0) === 0) {
                                    window.alert('You must load an order first!');
                                    refOrderNumber.current.focus();
                                    return;
                                }

                                if ((selectedOrder?.order_invoiced || 0) === 0) {
                                    window.alert('You must approve the customer invoice first!');
                                    refOrderNumber.current.focus();
                                    return;
                                }

                                handlePrint();
                            }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base" style={{ fontSize: '1.2rem' }}>Print Invoice</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                        <div className={
                            (selectedOrder?.is_cancelled || 0) === 1 ||
                                ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                ? 'mochi-button disabled' : 'mochi-button'
                        }
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base" style={{ fontSize: '1.2rem' }}>E-Mail Invoice</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                        <div className={
                            (selectedOrder?.is_cancelled || 0) === 1 ||
                                ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                ? 'mochi-button disabled' : 'mochi-button'
                        }
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base" style={{ fontSize: '1.2rem' }}>Batch Billing</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                        <div>
                            <div className="input-box-container grow" style={{ marginBottom: 2 }}>
                                <input type="text" placeholder="Check Number"
                                    tabIndex={73 + props.tabTimes}
                                    readOnly={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    }
                                    onKeyDown={(e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                if (key === 9) {
                                                    // validateOrderForSaving(e);

                                                    if ((selectedOrder?.id || 0) > 0) {
                                                        axios.post(props.serverUrl + '/saveInvoiceCustomerCheckNumber', {
                                                            id: selectedOrder.id,
                                                            customer_check_number: e.target.value.trim()
                                                        }).then(res => {

                                                        }).catch(e => {
                                                            console.log(e);
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                customer_check_number: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={(e) => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                customer_check_number: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedOrder?.customer_check_number || ''}
                                />
                            </div>

                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={74 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        guide={false}
                                        type="text" placeholder="Date Received"
                                        readOnly={
                                            (selectedOrder?.is_cancelled || 0) === 1 ||
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                        }
                                        onKeyDown={async (e) => {
                                            if ((selectedOrder?.is_cancelled || 0) === 0) {
                                                let key = e.keyCode || e.which;

                                                if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                    if (key >= 37 && key <= 40) {
                                                        let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.customer_date_received || ''), 'MM/DD/YYYY');
                                                        await setPreSelectedDateReceived(event_date);

                                                        if (isDateReceivedCalendarShown) {
                                                            e.preventDefault();

                                                            if (key === 37) { // left - minus 1
                                                                setPreSelectedDateReceived(preSelectedDateReceived.clone().subtract(1, 'day'));
                                                            }

                                                            if (key === 38) { // up - minus 7
                                                                setPreSelectedDateReceived(preSelectedDateReceived.clone().subtract(7, 'day'));
                                                            }

                                                            if (key === 39) { // right - plus 1
                                                                setPreSelectedDateReceived(preSelectedDateReceived.clone().add(1, 'day'));
                                                            }

                                                            if (key === 40) { // down - plus 7
                                                                setPreSelectedDateReceived(preSelectedDateReceived.clone().add(7, 'day'));
                                                            }
                                                        } else {
                                                            await setIsDateReceivedCalendarShown(true);
                                                        }
                                                    }

                                                    if (key === 13) {
                                                        let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.customer_date_received || ''), 'MM/DD/YYYY');
                                                        await setPreSelectedDateReceived(event_date);

                                                        if (isDateReceivedCalendarShown) {
                                                            event_date = preSelectedDateReceived.clone().format('MM/DD/YYYY');

                                                            await setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    customer_date_received: event_date
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceCustomerDateReceived', {
                                                                    id: selectedOrder.id,
                                                                    customer_date_received: event_date
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setIsDateReceivedCalendarShown(false);
                                                                });
                                                            }
                                                        }
                                                    }

                                                    if (key === 9) {
                                                        let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.customer_date_received || ''), 'MM/DD/YYYY');
                                                        await setPreSelectedDateReceived(event_date);

                                                        if (isDateReceivedCalendarShown) {
                                                            event_date = preSelectedDateReceived.clone().format('MM/DD/YYYY');

                                                            await setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    customer_date_received: event_date
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceCustomerDateReceived', {
                                                                    id: selectedOrder.id,
                                                                    customer_date_received: event_date
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setIsDateReceivedCalendarShown(false);
                                                                });
                                                            }
                                                        } else {
                                                            if (e.target.value.trim() === '') {
                                                                await setSelectedOrder(selectedOrder => {
                                                                    return {
                                                                        ...selectedOrder,
                                                                        customer_date_received: null
                                                                    }
                                                                })

                                                                if ((selectedOrder?.id || 0) > 0) {
                                                                    axios.post(props.serverUrl + '/saveInvoiceCustomerDateReceived', {
                                                                        id: selectedOrder.id,
                                                                        customer_date_received: null
                                                                    }).then(res => {

                                                                    }).catch(e => {
                                                                        console.log(e);
                                                                    });
                                                                }
                                                            } else {
                                                                if ((selectedOrder?.id || 0) > 0) {
                                                                    axios.post(props.serverUrl + '/saveInvoiceCustomerDateReceived', {
                                                                        id: selectedOrder.id,
                                                                        customer_date_received: event_date.clone().format('MM/DD/YYYY')
                                                                    }).then(res => {

                                                                    }).catch(e => {
                                                                        console.log(e);
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                        onBlur={e => {
                                            if ((selectedOrder?.is_cancelled || 0) === 0) {
                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        customer_date_received: getFormattedDates(selectedOrder?.customer_date_received)
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    customer_date_received: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    customer_date_received: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedOrder?.customer_date_received || ''}
                                        ref={refDateReceived}
                                    />

                                    {
                                        (selectedOrder?.is_cancelled || 0) === 0 &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1) &&
                                        <FontAwesomeIcon className="dropdown-button calendar date-received-calendar"
                                            icon={faCalendarAlt} onClick={(e) => {
                                                if (isDateReceivedCalendarShown) {
                                                    setIsDateReceivedCalendarShown(false);
                                                } else {
                                                    e.stopPropagation();

                                                    setIsInvoiceReceivedDateCalendarShown(false);
                                                    setTermsItems([]);
                                                    setIsDatePaidCalendarShown(false);

                                                    new Promise((resolve, reject) => {
                                                        if (moment((selectedOrder?.customer_date_received || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.customer_date_received || '').trim()) {
                                                            setPreSelectedDateReceived(moment(selectedOrder?.customer_date_received, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedDateReceived(moment());
                                                        }

                                                        resolve('OK');
                                                    }).then(res => {
                                                        setIsDateReceivedCalendarShown(true);
                                                        refDateReceived.current.inputElement.focus();
                                                    }).catch(e => {
                                                        console.log(e)
                                                    });

                                                }
                                            }} />
                                    }


                                </div>
                                {
                                    dateReceivedTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-date-received"
                                            style={{
                                                ...style,
                                                left: '-150px',
                                                display: 'block'
                                            }}
                                            ref={refDateReceivedCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below left"
                                                style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((selectedOrder?.customer_date_received || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.customer_date_received || '').trim()
                                                                ? moment(selectedOrder?.customer_date_received, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                new Promise(async (resolve, reject) => {
                                                                    await setSelectedOrder(selectedOrder => {
                                                                        return {
                                                                            ...selectedOrder,
                                                                            customer_date_received: day.format('MM/DD/YYYY')
                                                                        }
                                                                    })

                                                                    resolve(day.format('MM/DD/YYYY'))
                                                                }).then(response => {
                                                                    // validateOrderForSaving({ keyCode: 9 });

                                                                    if ((selectedOrder?.id || 0) > 0) {
                                                                        axios.post(props.serverUrl + '/saveInvoiceCustomerDateReceived', {
                                                                            id: selectedOrder.id,
                                                                            customer_date_received: response
                                                                        }).then(res => {

                                                                        }).catch(e => {
                                                                            console.log(e);
                                                                        }).finally(() => {
                                                                            setIsDateReceivedCalendarShown(false);
                                                                        });
                                                                    }
                                                                })
                                                            }}
                                                            closeCalendar={() => {
                                                                setIsDateReceivedCalendarShown(false);
                                                            }}
                                                            preDay={preSelectedDateReceived}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedDateReceived(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='fixed' style={{
                        minWidth: '10rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gridGap: 2
                    }}>
                        <div className="select-box-container" style={{ flexGrow: 1 }}>
                            <div className="select-box-wrapper">
                                <MaskedInput tabIndex={75 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                    guide={false}
                                    type="text" placeholder="Invoice Rec'd Date"
                                    readOnly={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    }
                                    onKeyDown={async (e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                if (key >= 37 && key <= 40) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_received_date || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedInvoiceReceivedDate(event_date);

                                                    if (isInvoiceReceivedDateCalendarShown) {
                                                        e.preventDefault();

                                                        if (key === 37) { // left - minus 1
                                                            setPreSelectedInvoiceReceivedDate(preSelectedInvoiceReceivedDate.clone().subtract(1, 'day'));
                                                        }

                                                        if (key === 38) { // up - minus 7
                                                            setPreSelectedInvoiceReceivedDate(preSelectedInvoiceReceivedDate.clone().subtract(7, 'day'));
                                                        }

                                                        if (key === 39) { // right - plus 1
                                                            setPreSelectedInvoiceReceivedDate(preSelectedInvoiceReceivedDate.clone().add(1, 'day'));
                                                        }

                                                        if (key === 40) { // down - plus 7
                                                            setPreSelectedInvoiceReceivedDate(preSelectedInvoiceReceivedDate.clone().add(7, 'day'));
                                                        }
                                                    } else {
                                                        await setIsInvoiceReceivedDateCalendarShown(true);
                                                    }
                                                }

                                                if (key === 13) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_received_date || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedInvoiceReceivedDate(event_date);

                                                    if (isInvoiceReceivedDateCalendarShown) {
                                                        event_date = preSelectedInvoiceReceivedDate.clone().format('MM/DD/YYYY');

                                                        await setSelectedOrder(selectedOrder => {
                                                            return {
                                                                ...selectedOrder,
                                                                invoice_received_date: event_date
                                                            }
                                                        })

                                                        if ((selectedOrder?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/saveInvoiceCarrierReceivedDate', {
                                                                id: selectedOrder.id,
                                                                invoice_received_date: event_date
                                                            }).then(res => {

                                                            }).catch(e => {
                                                                console.log(e);
                                                            }).finally(() => {
                                                                setIsInvoiceReceivedDateCalendarShown(false);
                                                            });
                                                        }
                                                    }
                                                }

                                                if (key === 9) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_received_date || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedInvoiceReceivedDate(event_date);

                                                    if (isInvoiceReceivedDateCalendarShown) {
                                                        event_date = preSelectedInvoiceReceivedDate.clone().format('MM/DD/YYYY');

                                                        await setSelectedOrder(selectedOrder => {
                                                            return {
                                                                ...selectedOrder,
                                                                invoice_received_date: event_date
                                                            }
                                                        })

                                                        if ((selectedOrder?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/saveInvoiceCarrierReceivedDate', {
                                                                id: selectedOrder.id,
                                                                invoice_received_date: event_date
                                                            }).then(res => {

                                                            }).catch(e => {
                                                                console.log(e);
                                                            }).finally(() => {
                                                                setIsInvoiceReceivedDateCalendarShown(false);
                                                            });
                                                        }
                                                    } else {
                                                        if (e.target.value.trim() === '') {
                                                            await setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    invoice_received_date: null
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceCarrierReceivedDate', {
                                                                    id: selectedOrder.id,
                                                                    invoice_received_date: null
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                });
                                                            }
                                                        } else {
                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceCarrierReceivedDate', {
                                                                    id: selectedOrder.id,
                                                                    invoice_received_date: event_date.clone().format('MM/DD/YYYY')
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={e => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    invoice_received_date: getFormattedDates(selectedOrder?.invoice_received_date)
                                                }
                                            })
                                        }
                                    }}
                                    onInput={e => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                invoice_received_date: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                invoice_received_date: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedOrder?.invoice_received_date || ''}
                                    ref={refInvoiceReceivedDate}
                                />

                                {
                                    (selectedOrder?.is_cancelled || 0) === 0 &&
                                    ((props.user?.user_code?.is_admin || 0) === 1 ||
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1) &&
                                    <FontAwesomeIcon className="dropdown-button calendar invoice-received-date-calendar"
                                        icon={faCalendarAlt} onClick={(e) => {
                                            if (isInvoiceReceivedDateCalendarShown) {
                                                setIsInvoiceReceivedDateCalendarShown(false);
                                            } else {
                                                e.stopPropagation();

                                                setIsDateReceivedCalendarShown(false);
                                                setTermsItems([]);
                                                setIsDatePaidCalendarShown(false);

                                                new Promise((resolve, reject) => {
                                                    if (moment((selectedOrder?.invoice_received_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.invoice_received_date || '').trim()) {
                                                        setPreSelectedInvoiceReceivedDate(moment(selectedOrder?.invoice_received_date, 'MM/DD/YYYY'));
                                                    } else {
                                                        setPreSelectedInvoiceReceivedDate(moment());
                                                    }

                                                    resolve('OK');
                                                }).then(res => {
                                                    setIsInvoiceReceivedDateCalendarShown(true);
                                                    refInvoiceReceivedDate.current.inputElement.focus();
                                                }).catch(e => {

                                                });
                                            }
                                        }} />
                                }

                            </div>
                            {
                                invoiceReceivedDateTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-invoice-received-date"
                                        style={{
                                            ...style,
                                            left: '-150px',
                                            display: 'block'
                                        }}
                                        ref={refInvoiceReceivedDateCalendarDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical above left"
                                            style={{ height: 275 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    <Calendar
                                                        value={moment((selectedOrder?.invoice_received_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.invoice_received_date || '').trim()
                                                            ? moment(selectedOrder?.invoice_received_date, 'MM/DD/YYYY')
                                                            : moment()}
                                                        onChange={(day) => {
                                                            new Promise(async (resolve, reject) => {
                                                                await setSelectedOrder(selectedOrder => {
                                                                    return {
                                                                        ...selectedOrder,
                                                                        invoice_received_date: day.format('MM/DD/YYYY')
                                                                    }
                                                                })

                                                                resolve(day.format('MM/DD/YYYY'))
                                                            }).then(response => {
                                                                if ((selectedOrder?.id || 0) > 0) {
                                                                    axios.post(props.serverUrl + '/saveInvoiceCarrierReceivedDate', {
                                                                        id: selectedOrder.id,
                                                                        invoice_received_date: response
                                                                    }).then(res => {

                                                                    }).catch(e => {
                                                                        console.log(e);
                                                                    }).finally(() => {
                                                                        setIsInvoiceReceivedDateCalendarShown(false);
                                                                    });
                                                                }
                                                            })
                                                        }}
                                                        closeCalendar={() => {
                                                            setIsInvoiceReceivedDateCalendarShown(false);
                                                        }}
                                                        preDay={preSelectedInvoiceReceivedDate}
                                                        onChangePreDay={(preDay) => {
                                                            setPreSelectedInvoiceReceivedDate(preDay);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>
                        <div className="input-box-container">
                            <input type="text" placeholder="Invoice Number"
                                tabIndex={76 + props.tabTimes}
                                readOnly={
                                    (selectedOrder?.is_cancelled || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                }
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        let key = e.keyCode || e.which;

                                        if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (key === 9) {
                                                if ((selectedOrder?.id || 0) > 0) {
                                                    axios.post(props.serverUrl + '/saveInvoiceNumber', {
                                                        id: selectedOrder.id,
                                                        invoice_number: e.target.value.trim()
                                                    }).then(res => {

                                                    }).catch(e => {
                                                        console.log(e);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedOrder(selectedOrder => {
                                        return {
                                            ...selectedOrder,
                                            invoice_number: e.target.value
                                        }
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedOrder(selectedOrder => {
                                        return {
                                            ...selectedOrder,
                                            invoice_number: e.target.value
                                        }
                                    })
                                }}
                                value={selectedOrder?.invoice_number || ''}
                            />
                        </div>
                        <div className="select-box-container" style={{ position: 'relative' }}>
                            <div className="select-box-wrapper">
                                <input type="text" placeholder="Terms"
                                    tabIndex={77 + props.tabTimes}
                                    readOnly={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    }
                                    ref={refTerms}
                                    onKeyDown={async (e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (termsItems.length > 0) {
                                                            let selectedIndex = termsItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setTermsItems(termsItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setTermsItems(termsItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (termsItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refTermsPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                                if (res.data.result === 'OK') {
                                                                    await setTermsItems(res.data.terms.map((item, index) => {
                                                                        item.selected = (selectedOrder?.term?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedOrder?.term?.id
                                                                        return item;
                                                                    }))

                                                                    refTermsPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async e => {
                                                                console.log('error getting terms', e);
                                                            })
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (termsItems.length > 0) {
                                                            let selectedIndex = termsItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setTermsItems(termsItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setTermsItems(termsItems.map((item, index) => {
                                                                    if (selectedIndex === (termsItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refTermsPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                                if (res.data.result === 'OK') {
                                                                    await setTermsItems(res.data.terms.map((item, index) => {
                                                                        item.selected = (selectedOrder?.term?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedOrder?.term?.id
                                                                        return item;
                                                                    }))

                                                                    refTermsPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async e => {
                                                                console.log('error getting terms', e);
                                                            })
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setTermsItems([]);
                                                        break;

                                                    case 13: // enter
                                                        if (termsItems.length > 0 && termsItems.findIndex(item => item.selected) > -1) {
                                                            setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    term: termsItems[termsItems.findIndex(item => item.selected)],
                                                                    term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceTerm', {
                                                                    id: selectedOrder.id,
                                                                    term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setTermsItems([]);
                                                                    refTerms.current.focus();
                                                                });
                                                            }


                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (termsItems.length > 0) {
                                                            e.preventDefault();
                                                            setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    term: termsItems[termsItems.findIndex(item => item.selected)],
                                                                    term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceTerm', {
                                                                    id: selectedOrder.id,
                                                                    term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setTermsItems([]);
                                                                    refTerms.current.focus();
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={async () => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            if ((selectedOrder?.term?.id || 0) === 0) {
                                                await setTerm({});
                                            }
                                        }
                                    }}
                                    onInput={async (e) => {
                                        let term = selectedOrder?.term || {};
                                        term.id = 0;
                                        term.name = e.target.value;
                                        await setSelectedOrder(prev => {
                                            return {
                                                ...prev,
                                                term: term
                                            }
                                        });

                                        if (e.target.value.trim() === '') {
                                            setTermsItems([]);
                                        } else {
                                            axios.post(props.serverUrl + '/getTerms', {
                                                name: e.target.value.trim()
                                            }).then(async res => {
                                                if (res.data.result === 'OK') {
                                                    await setTermsItems(res.data.terms.map((item, index) => {
                                                        item.selected = (selectedOrder?.term?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === selectedOrder?.term?.id
                                                        return item;
                                                    }))
                                                }
                                            }).catch(async e => {
                                                console.log('error getting terms', e);
                                            })
                                        }
                                    }}
                                    onChange={async (e) => {
                                        let term = selectedOrder?.term || {};
                                        term.id = 0;
                                        term.name = e.target.value;
                                        await setSelectedOrder(prev => {
                                            return {
                                                ...prev,
                                                term: term
                                            }
                                        });
                                    }}
                                    value={selectedOrder?.term?.name || ''}
                                />
                                {
                                    (selectedOrder?.is_cancelled || 0) === 0 &&
                                    ((props.user?.user_code?.is_admin || 0) === 1 ||
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1) &&
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={(e) => {
                                        if (termsItems.length > 0) {
                                            setTermsItems([]);
                                        } else {
                                            if ((selectedOrder?.term?.id || 0) === 0 && (selectedOrder?.term?.name || '') !== '') {
                                                axios.post(props.serverUrl + '/getTerms', {
                                                    name: selectedOrder?.term?.name
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setTermsItems(res.data.terms.map((item, index) => {
                                                            item.selected = (selectedOrder?.term?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedOrder?.term?.id
                                                            return item;
                                                        }))

                                                        refTermsPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting terms', e);
                                                })
                                            } else {
                                                axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setTermsItems(res.data.terms.map((item, index) => {
                                                            item.selected = (selectedOrder?.term?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedOrder?.term?.id
                                                            return item;
                                                        }))

                                                        refTermsPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting terms', e);
                                                })
                                            }
                                        }

                                        refTerms.current.focus();
                                    }} />
                                }
                            </div>
                            {
                                termsTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-load-type"
                                        style={{
                                            ...style,
                                            left: '-100%',
                                            display: 'block'
                                        }}
                                        ref={refTermsDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical above left"
                                            style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        termsItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            const searchValue = (selectedOrder?.term?.id || 0) === 0 && (selectedOrder?.term?.name || '') !== ''
                                                                ? selectedOrder?.term?.name : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        setSelectedOrder(selectedOrder => {
                                                                            return {
                                                                                ...selectedOrder,
                                                                                term: item,
                                                                                term_id: item.id
                                                                            }
                                                                        })

                                                                        if ((selectedOrder?.id || 0) > 0) {
                                                                            axios.post(props.serverUrl + '/saveInvoiceTerm', {
                                                                                id: selectedOrder.id,
                                                                                term_id: item.id
                                                                            }).then(res => {

                                                                            }).catch(e => {
                                                                                console.log(e);
                                                                            }).finally(() => {
                                                                                setTermsItems([]);
                                                                                refTerms.current.focus();
                                                                            });
                                                                        }
                                                                    }}
                                                                    ref={ref => refTermsPopupItems.current.push(ref)}
                                                                >
                                                                    {
                                                                        searchValue === undefined
                                                                            ? item.name
                                                                            : <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                    }
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected"
                                                                            icon={faCaretRight} />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>
                        <div className="input-box-container">
                            <input type="text" placeholder="Pay By Date"
                                readOnly={true}
                                tabIndex={-1}
                                value={
                                    moment((selectedOrder?.invoice_received_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.invoice_received_date || '').trim()
                                        ? (selectedOrder?.term?.id || 0) > 0
                                            ? moment(selectedOrder.invoice_received_date, 'MM/DD/YYYY').add(selectedOrder.term.value, 'days').format('MM/DD/YYYY')
                                            : ''
                                        : ''
                                }
                            />
                        </div>
                        <div className="select-box-container" style={{ flexGrow: 1 }}>
                            <div className="select-box-wrapper">
                                <MaskedInput tabIndex={78 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                    guide={false}
                                    type="text" placeholder="Date Paid"
                                    readOnly={
                                        (selectedOrder?.is_cancelled || 0) === 1 ||
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                    }
                                    onKeyDown={async (e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                                if (key >= 37 && key <= 40) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_date_paid || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedDatePaid(event_date);

                                                    if (isDatePaidCalendarShown) {
                                                        e.preventDefault();

                                                        if (key === 37) { // left - minus 1
                                                            setPreSelectedDatePaid(preSelectedDatePaid.clone().subtract(1, 'day'));
                                                        }

                                                        if (key === 38) { // up - minus 7
                                                            setPreSelectedDatePaid(preSelectedDatePaid.clone().subtract(7, 'day'));
                                                        }

                                                        if (key === 39) { // right - plus 1
                                                            setPreSelectedDatePaid(preSelectedDatePaid.clone().add(1, 'day'));
                                                        }

                                                        if (key === 40) { // down - plus 7
                                                            setPreSelectedDatePaid(preSelectedDatePaid.clone().add(7, 'day'));
                                                        }
                                                    } else {
                                                        await setIsDatePaidCalendarShown(true);
                                                    }
                                                }

                                                if (key === 13) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_date_paid || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedDatePaid(event_date);

                                                    if (isDatePaidCalendarShown) {
                                                        event_date = preSelectedDatePaid.clone().format('MM/DD/YYYY');

                                                        await setSelectedOrder(selectedOrder => {
                                                            return {
                                                                ...selectedOrder,
                                                                invoice_date_paid: event_date
                                                            }
                                                        })

                                                        if ((selectedOrder?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/saveInvoiceDatePaid', {
                                                                id: selectedOrder.id,
                                                                invoice_date_paid: event_date
                                                            }).then(res => {

                                                            }).catch(e => {
                                                                console.log(e);
                                                            }).finally(() => {
                                                                setIsDatePaidCalendarShown(false);
                                                            });
                                                        }
                                                    }
                                                }

                                                if (key === 9) {
                                                    let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedOrder?.invoice_date_paid || ''), 'MM/DD/YYYY');
                                                    await setPreSelectedDatePaid(event_date);

                                                    if (isDatePaidCalendarShown) {
                                                        event_date = preSelectedDatePaid.clone().format('MM/DD/YYYY');

                                                        await setSelectedOrder(selectedOrder => {
                                                            return {
                                                                ...selectedOrder,
                                                                invoice_date_paid: event_date
                                                            }
                                                        })

                                                        if ((selectedOrder?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/saveInvoiceDatePaid', {
                                                                id: selectedOrder.id,
                                                                invoice_date_paid: event_date
                                                            }).then(res => {

                                                            }).catch(e => {
                                                                console.log(e);
                                                            }).finally(() => {
                                                                setIsDatePaidCalendarShown(false);
                                                            });
                                                        }
                                                    } else {
                                                        if (e.target.value.trim() === '') {
                                                            await setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    invoice_date_paid: null
                                                                }
                                                            })

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceDatePaid', {
                                                                    id: selectedOrder.id,
                                                                    invoice_date_paid: null
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                });
                                                            }
                                                        } else {
                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceDatePaid', {
                                                                    id: selectedOrder.id,
                                                                    invoice_date_paid: event_date.clone().format('MM/DD/YYYY')
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setIsDatePaidCalendarShown(false);
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={e => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            setSelectedOrder(selectedOrder => {
                                                return {
                                                    ...selectedOrder,
                                                    invoice_date_paid: getFormattedDates(selectedOrder?.invoice_date_paid)
                                                }
                                            })
                                        }
                                    }}
                                    onInput={e => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                invoice_date_paid: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedOrder(selectedOrder => {
                                            return {
                                                ...selectedOrder,
                                                invoice_date_paid: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedOrder?.invoice_date_paid || ''}
                                    ref={refDatePaid}
                                />
                                {
                                    (selectedOrder?.is_cancelled || 0) === 0 &&
                                    ((props.user?.user_code?.is_admin || 0) === 1 ||
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1) &&
                                    <FontAwesomeIcon className="dropdown-button calendar date-paid-calendar"
                                        icon={faCalendarAlt} onClick={(e) => {
                                            if (isDatePaidCalendarShown) {
                                                setIsDatePaidCalendarShown(false);
                                            } else {
                                                e.stopPropagation();

                                                setIsDateReceivedCalendarShown(false);
                                                setIsInvoiceReceivedDateCalendarShown(false);
                                                setTermsItems([]);

                                                new Promise((resolve, reject) => {
                                                    if (moment((selectedOrder?.invoice_date_paid || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.invoice_date_paid || '').trim()) {
                                                        setPreSelectedDatePaid(moment(selectedOrder?.invoice_date_paid, 'MM/DD/YYYY'));
                                                    } else {
                                                        setPreSelectedDatePaid(moment());
                                                    }

                                                    resolve('OK');
                                                }).then(res => {
                                                    setIsDatePaidCalendarShown(true);
                                                    refDatePaid.current.inputElement.focus();
                                                }).catch(e => {

                                                });
                                            }
                                        }} />
                                }
                            </div>
                            {
                                datePaidTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-date-paid"
                                        style={{
                                            ...style,
                                            left: '-150px',
                                            display: 'block'
                                        }}
                                        ref={refDatePaidCalendarDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical above left"
                                            style={{ height: 275 }}>
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    <Calendar
                                                        value={moment((selectedOrder?.invoice_date_paid || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedOrder?.invoice_date_paid || '').trim()
                                                            ? moment(selectedOrder?.invoice_date_paid, 'MM/DD/YYYY')
                                                            : moment()}
                                                        onChange={(day) => {
                                                            setSelectedOrder(selectedOrder => {
                                                                return {
                                                                    ...selectedOrder,
                                                                    invoice_date_paid: day.format('MM/DD/YYYY')
                                                                }
                                                            });

                                                            if ((selectedOrder?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/saveInvoiceDatePaid', {
                                                                    id: selectedOrder.id,
                                                                    invoice_date_paid: day.format('MM/DD/YYYY')
                                                                }).then(res => {

                                                                }).catch(e => {
                                                                    console.log(e);
                                                                }).finally(() => {
                                                                    setIsDatePaidCalendarShown(false);
                                                                });
                                                            }
                                                        }}
                                                        closeCalendar={() => {
                                                            setIsDatePaidCalendarShown(false);
                                                        }}
                                                        preDay={preSelectedDatePaid}
                                                        onChangePreDay={(preDay) => {
                                                            setPreSelectedDatePaid(preDay);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>
                        <div className="input-box-container">
                            <input type="text" placeholder="Check Number"
                                tabIndex={79 + props.tabTimes}
                                readOnly={
                                    (selectedOrder?.is_cancelled || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 0)
                                }
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        let key = e.keyCode || e.which;

                                        if (((props.user?.user_code?.is_admin || 0) === 1 ||
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)) {
                                            if (key === 9) {
                                                e.preventDefault();

                                                if ((selectedOrder?.id || 0) > 0) {
                                                    axios.post(props.serverUrl + '/saveInvoiceCarrierCheckNumber', {
                                                        id: selectedOrder.id,
                                                        carrier_check_number: e.target.value.trim()
                                                    }).then(res => {

                                                    }).catch(e => {
                                                        console.log(e);
                                                    }).finally(() => {
                                                        refOrderNumber.current.focus();
                                                    });
                                                }else{
                                                    refOrderNumber.current.focus(); 
                                                }
                                            }
                                        }
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedOrder(selectedOrder => {
                                        return {
                                            ...selectedOrder,
                                            carrier_check_number: e.target.value
                                        }
                                    })
                                }}
                                onChange={(e) => {
                                    setSelectedOrder(selectedOrder => {
                                        return {
                                            ...selectedOrder,
                                            carrier_check_number: e.target.value
                                        }
                                    })
                                }}
                                value={selectedOrder?.carrier_check_number || ''}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {
                selectedInternalNote?.id !== undefined &&
                <Modal
                    selectedData={selectedInternalNote}
                    setSelectedData={setSelectedInternalNote}
                    selectedParent={selectedOrder}
                    setSelectedParent={(data) => {
                        setSelectedOrder(selectedOrder => {
                            return { ...selectedOrder, internal_notes: data.notes }
                        });

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            internal_notes: data.notes,
                            component_id: props.componentId
                        })
                    }}
                    savingDataUrl='/saveInternalNotes'
                    deletingDataUrl=''
                    type='note'
                    isEditable={
                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)
                    }
                    isDeletable={
                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)
                    }
                    isAdding={selectedInternalNote.id === 0}
                    title=""
                />
            }

            {
                selectedBillingNote?.id !== undefined &&
                <Modal
                    selectedData={selectedBillingNote}
                    setSelectedData={setSelectedBillingNote}
                    selectedParent={selectedOrder}
                    setSelectedParent={(data) => {
                        setSelectedOrder(selectedOrder => {
                            return { ...selectedOrder, billing_notes: data.notes }
                        });

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            billing_notes: data.notes,
                            component_id: props.componentId
                        })
                    }}
                    savingDataUrl='/saveOrderBillingNotes'
                    deletingDataUrl=''
                    type='note'
                    isEditable={
                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)
                    }
                    isDeletable={
                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.save || 0) === 1 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'invoice')?.pivot?.edit || 0) === 1)
                    }
                    isAdding={selectedBillingNote.id === 0}
                    title="Will appear on Invoice"
                />
            }
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
        selectedCustomer: state.customerReducers.selectedCustomer,
        selectedCustomerContact: state.customerReducers.selectedContact,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedCarrierDriver: state.carrierReducers.selectedDriver,
        selectedCarrieInsurance: state.carrierReducers.selectedInsurance,
    }
}

export default connect(mapStateToProps, {
    setSelectedOrder,
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
})(Invoice)