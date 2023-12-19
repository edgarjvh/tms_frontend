import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import axios from 'axios';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import './RatingScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';
import Highlighter from "react-highlight-words";
import NumberFormat from 'react-number-format';
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

    setSelectedOrder
} from './../../../../actions';

import { RatingModal } from './../../panels';

var delayTimer = null;

const RatingScreen = (props) => {
    const [selectedOrder, setSelectedOrder] = useState({});
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
    const refBillToRateTypeDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToRateTypeItems([]) } });
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
    const refBillToPiecesDropDown = useDetectClickOutside({ onTriggered: async () => { setShowBillToPiecesItems(false) } });
    const refBillToPiecesPopupItems = useRef([]);

    const [billToSubtypeFuelSurchargeItems, setBillToSubtypeFuelSurchargeItems] = useState([]);
    const [showBillToSubtypeFuelSurchargeItems, setShowBillToSubtypeFuelSurchargeItems] = useState(false);
    const refBillToSubtypeFuelSurchargeDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToSubtypeFuelSurchargeItems([]) } });
    const refBillToSubtypeFuelSurchargePopupItems = useRef([]);

    const [billToSubtypeLinehaulItems, setBillToSubtypeLinehaulItems] = useState([]);
    const [showBillToSubtypeLinehaulItems, setShowBillToSubtypeLinehaulItems] = useState(false);
    const refBillToSubtypeLinehaulDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToSubtypeLinehaulItems([]) } });
    const refBillToSubtypeLinehaulPopupItems = useRef([]);

    const [billToSubtypeLayoverItems, setBillToSubtypeLayoverItems] = useState([]);
    const [showBillToSubtypeLayoverItems, setShowBillToSubtypeLayoverItems] = useState(false);
    const refBillToSubtypeLayoverDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToSubtypeLayoverItems([]) } });
    const refBillToSubtypeLayoverPopupItems = useRef([]);

    const [billToSubtypeDetentionItems, setBillToSubtypeDetentionItems] = useState([]);
    const [showBillToSubtypeDetentionItems, setShowBillToSubtypeDetentionItems] = useState(false);
    const refBillToSubtypeDetentionDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToSubtypeDetentionItems([]) } });
    const refBillToSubtypeDetentionPopupItems = useRef([]);

    const [billToSubtypeDriverAssistItems, setBillToSubtypeDriverAssistItems] = useState([]);
    const [showBillToSubtypeDriverAssistItems, setShowBillToSubtypeDriverAssistItems] = useState(false);
    const refBillToSubtypeDriverAssistDropDown = useDetectClickOutside({ onTriggered: async () => { setBillToSubtypeDriverAssistItems([]) } });
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
    const refCarrierRateTypeDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierRateTypeItems([]) } });
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
    const refCarrierPiecesDropDown = useDetectClickOutside({ onTriggered: async () => { setShowCarrierPiecesItems(false) } });
    const refCarrierPiecesPopupItems = useRef([]);

    const [carrierSubtypeFuelSurchargeItems, setCarrierSubtypeFuelSurchargeItems] = useState([]);
    const [showCarrierSubtypeFuelSurchargeItems, setShowCarrierSubtypeFuelSurchargeItems] = useState(false);
    const refCarrierSubtypeFuelSurchargeDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierSubtypeFuelSurchargeItems([]) } });
    const refCarrierSubtypeFuelSurchargePopupItems = useRef([]);

    const [carrierSubtypeLinehaulItems, setCarrierSubtypeLinehaulItems] = useState([]);
    const [showCarrierSubtypeLinehaulItems, setShowCarrierSubtypeLinehaulItems] = useState(false);
    const refCarrierSubtypeLinehaulDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierSubtypeLinehaulItems([]) } });
    const refCarrierSubtypeLinehaulPopupItems = useRef([]);

    const [carrierSubtypeLayoverItems, setCarrierSubtypeLayoverItems] = useState([]);
    const [showCarrierSubtypeLayoverItems, setShowCarrierSubtypeLayoverItems] = useState(false);
    const refCarrierSubtypeLayoverDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierSubtypeLayoverItems([]) } });
    const refCarrierSubtypeLayoverPopupItems = useRef([]);

    const [carrierSubtypeDetentionItems, setCarrierSubtypeDetentionItems] = useState([]);
    const [showCarrierSubtypeDetentionItems, setShowCarrierSubtypeDetentionItems] = useState(false);
    const refCarrierSubtypeDetentionDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierSubtypeDetentionItems([]) } });
    const refCarrierSubtypeDetentionPopupItems = useRef([]);

    const [carrierSubtypeDriverAssistItems, setCarrierSubtypeDriverAssistItems] = useState([]);
    const [showCarrierSubtypeDriverAssistItems, setShowCarrierSubtypeDriverAssistItems] = useState(false);
    const refCarrierSubtypeDriverAssistDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierSubtypeDriverAssistItems([]) } });
    const refCarrierSubtypeDriverAssistPopupItems = useRef([]);

    const [showApprovalRequired, setShowApprovalRequired] = useState(false);

    const approvalRequiredTransition = useTransition(showApprovalRequired, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: showApprovalRequired,
        config: { duration: 100 }
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

    const refCarrierChargesRateTypes = useRef();
    const [carrierChargesRateTypeItems, setCarrierChargesRateTypeItems] = useState([]);
    const refCarrierChargesRateTypeDropDown = useDetectClickOutside({ onTriggered: async () => { setCarrierChargesRateTypeItems([]) } });
    const refCarrierChargesRateTypePopupItems = useRef([]);

    useEffect(() => {
        if ((props.selectedOrder?.id || 0) > 0) {
            setSelectedOrder({ ...props.selectedOrder });
        }

        refBillToRateTypes.current.focus({
            preventScroll: true
        });
    }, []);

    useEffect(() => {
        if ((props.selected_order?.component_id || '') !== props.componentId) {
            if (((selectedOrder?.id || 0) > 0 && (props.selected_order?.id || 0) > 0) && selectedOrder.id === props.selectedOrder.id) {
                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        ...props.selected_order
                    }
                })
            }
        }
    }, [props.selected_order])

    const validateCustomerRatingForSaving = (e) => {
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
                selectedBillToRating.template_id = (selectedOrder?.id || 0);

                selectedBillToRating.pieces = Number((selectedBillToRating.pieces || 0).toString().replace(',', ''));
                selectedBillToRating.percentage = Number((selectedBillToRating.percentage || 0).toString().replace(',', ''));
                selectedBillToRating.hours = Number((selectedBillToRating.hours || 0).toString().replace(',', ''));
                selectedBillToRating.days = Number((selectedBillToRating.days || 0).toString().replace(',', ''));
                selectedBillToRating.weight = Number((selectedBillToRating.weight || 0).toString().replace(',', ''));
                selectedBillToRating.feet_required = Number((selectedBillToRating.feet_required || 0).toString().replace(',', ''));
                selectedBillToRating.rate = Number((selectedBillToRating.rate || 0).toString().replace(',', ''));
                selectedBillToRating.total_charges = Number((selectedBillToRating.total_charges || 0).toString().replace(',', ''));

                let url = (props.owner || 'order') === 'template'
                    ? '/saveTemplateCustomerRating'
                    : '/saveOrderCustomerRating';

                axios.post(props.serverUrl + url, selectedBillToRating).then(res => {
                    if (res.data.result === 'OK') {
                        if ((props.owner || 'order') === 'order') {
                            let orderCustomerRatings = JSON.parse(JSON.stringify(res.data.order_customer_ratings));
                            let totalCustomerRating = (orderCustomerRatings || []).reduce((accumulator, item) => {
                                return accumulator + item.total_charges;
                            }, 0);

                            setSelectedOrder({
                                ...selectedOrder,
                                order_customer_ratings: orderCustomerRatings,
                                total_customer_rating: totalCustomerRating
                            });
                            props.setSelectedOrder({
                                id: selectedOrder.id,
                                order_customer_ratings: orderCustomerRatings,
                                total_customer_rating: totalCustomerRating,
                                component_id: props.componentId
                            })
                        } else {
                            let templateCustomerRatings = JSON.parse(JSON.stringify(res.data.template_customer_ratings));
                            let totalCustomerRating = (templateCustomerRatings || []).reduce((accumulator, item) => {
                                return accumulator + item.total_charges;
                            }, 0);
                            setSelectedOrder({
                                ...selectedOrder,
                                order_customer_ratings: templateCustomerRatings,
                                total_customer_rating: totalCustomerRating
                            });

                            props.callback({
                                type: 'customer',
                                order_customer_ratings: templateCustomerRatings,
                                total_customer_rating: totalCustomerRating
                            });
                        }

                        setSelectedBillToRating({});
                        refBillToRateTypes.current.focus();
                    } else if (res.data.result === 'OVERDRAWN') {
                        setShowApprovalRequired(true);
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
                selectedCarrierRating.template_id = (selectedOrder?.id || 0);

                selectedCarrierRating.pieces = Number((selectedCarrierRating.pieces || 0).toString().replace(',', ''));
                selectedCarrierRating.percentage = Number((selectedCarrierRating.percentage || 0).toString().replace(',', ''));
                selectedCarrierRating.hours = Number((selectedCarrierRating.hours || 0).toString().replace(',', ''));
                selectedCarrierRating.days = Number((selectedCarrierRating.days || 0).toString().replace(',', ''));
                selectedCarrierRating.weight = Number((selectedCarrierRating.weight || 0).toString().replace(',', ''));
                selectedCarrierRating.feet_required = Number((selectedCarrierRating.feet_required || 0).toString().replace(',', ''));
                selectedCarrierRating.rate = Number((selectedCarrierRating.rate || 0).toString().replace(',', ''));
                selectedCarrierRating.total_charges = Number((selectedCarrierRating.total_charges || 0).toString().replace(',', ''));

                let url = (props.owner || 'order') === 'template'
                    ? '/saveTemplateCarrierRating'
                    : '/saveOrderCarrierRating';

                axios.post(props.serverUrl + url, selectedCarrierRating).then(res => {
                    if (res.data.result === 'OK') {
                        if ((props.owner || 'order') === 'order') {
                            let orderCarrierRatings = JSON.parse(JSON.stringify(res.data.order_carrier_ratings));
                            let totalCarrierRating = (orderCarrierRatings || []).reduce((accumulator, item) => {
                                return accumulator + item.total_charges;
                            }, 0);

                            setSelectedOrder({
                                ...selectedOrder,
                                order_carrier_ratings: orderCarrierRatings,
                                total_carrier_rating: totalCarrierRating
                            });

                            props.setSelectedOrder({
                                id: selectedOrder.id,
                                order_carrier_ratings: orderCarrierRatings,
                                total_carrier_rating: totalCarrierRating,
                                component_id: props.componentId
                            });
                        } else {
                            let templateCarrierRatings = JSON.parse(JSON.stringify(res.data.template_carrier_ratings));
                            let totalCarrierRating = (templateCarrierRatings || []).reduce((accumulator, item) => {
                                return accumulator + item.total_charges;
                            }, 0);

                            setSelectedOrder({
                                ...selectedOrder,
                                order_carrier_ratings: templateCarrierRatings,
                                total_carrier_rating: totalCarrierRating
                            });

                            props.callback({
                                type: 'carrier',
                                order_carrier_ratings: templateCarrierRatings,
                                total_carrier_rating: totalCarrierRating
                            })
                        }

                        setSelectedCarrierRating({});
                        refCarrierRateTypes.current.focus();
                    } else {
                        window.alert('An error occurred while saving');
                        refCarrierTotalCharges.current.inputElement.focus();
                    }
                }).catch(e => {
                    console.log('error on saving customer rating', e);
                    window.alert('An error occurred while saving');
                    refCarrierTotalCharges.current.inputElement.focus();
                });
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

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div style={{
                flexGrow: 1,
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr 1fr'
            }}>

                <div className='form-bordered-box' style={{ borderBottom: 0, borderRight: 0, marginBottom: 15, marginTop: 10, boxShadow: 'none' }}>
                    <div className='form-header'>
                        <div className='top-border top-border-left'></div>
                        <div className='form-title'>Customer Charges</div>
                        <div className='top-border top-border-middle'></div>
                        <div className="form-buttons">
                            <div className="mochi-button" style={{
                                pointerEvents: (selectedOrder?.is_cancelled || 0) === 0 ? 'all' : 'none'
                            }} onClick={() => {
                                setSelectedBillToRating({});
                                refBillToRateTypes.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base" style={{
                                    color: (selectedOrder?.is_cancelled || 0) === 0 ? 'black' : 'rgba(0,0,0,0.4)'
                                }}>Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className='top-border top-border-right'></div>
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
                                'disabled': (selectedOrder?.id || 0) === 0 || (selectedBillToRating.id || 0) === 0
                            })} style={{ marginRight: 10 }} onClick={() => {
                                if (window.confirm('Are you sure you want to delete this item?')) {
                                    let url = (props.owner || 'order') === 'template'
                                        ? '/deleteTemplateCustomerRating'
                                        : '/deleteOrderCustomerRating';

                                    axios.post(props.serverUrl + url, {
                                        id: selectedBillToRating.id,
                                        order_id: selectedOrder.id,
                                        template_id: selectedOrder.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {
                                            if ((props.owner || 'order') === 'order') {
                                                let orderCustomerRatings = JSON.parse(JSON.stringify(res.data.order_customer_ratings));
                                                let totalCustomerRating = (orderCustomerRatings || []).reduce((accumulator, item) => {
                                                    return accumulator + item.total_charges;
                                                }, 0);

                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        order_customer_ratings: orderCustomerRatings,
                                                        total_customer_rating: totalCustomerRating
                                                    }
                                                });

                                                props.setSelectedOrder({
                                                    id: selectedOrder.id,
                                                    order_customer_ratings: orderCustomerRatings,
                                                    total_customer_rating: totalCustomerRating,
                                                    component_id: props.componentId
                                                })
                                            } else {
                                                let templateCustomerRatings = JSON.parse(JSON.stringify(res.data.template_customer_ratings));
                                                let totalCustomerRating = (templateCustomerRatings || []).reduce((accumulator, item) => {
                                                    return accumulator + item.total_charges;
                                                }, 0);

                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        order_customer_ratings: templateCustomerRatings,
                                                        total_customer_rating: totalCustomerRating
                                                    }
                                                });

                                                props.callback({
                                                    type: 'customer',
                                                    order_customer_ratings: templateCustomerRatings,
                                                    total_customer_rating: totalCustomerRating
                                                })
                                            }

                                            setSelectedBillToRating({});

                                            refBillToRateTypes.current.focus();
                                        }
                                    }).catch(e => {
                                        console.log('error deleting rating item', e);
                                    })
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Delete</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="input-box-container" style={{
                                width: '15rem',
                                minWidth: '15rem',
                                maxWidth: '15rem'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Customer Charges $</div>
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
                                        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
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
                            width: '11rem',
                            maxWidth: '11rem',
                            minWidth: '11rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1 || (selectedOrder?.is_cancelled || 0) === 1}
                                    ref={refBillToRateTypes}
                                    onKeyDown={(e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;
                                            if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                                switch (key) {
                                                    case 37: case 38: // arrow left | arrow up
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

                                                    case 39: case 40: // arrow right | arrow down
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
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul' ||
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'comment')
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
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul' ||
                                                                    billToRateTypeItems[billToRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'comment')
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
                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                                item.name.toLowerCase() === 'linehaul' ||
                                                                                item.name.toLowerCase() === 'comment')
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            minWidth: '12rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Description</div>
                            <input type="text" style={{ textAlign: 'right', fontWeight: 'bold' }}
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1 || (selectedOrder?.is_cancelled || 0) === 1}
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
                                onBlur={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                            (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            setSelectedCarrierRating({ ...selectedBillToRating });
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
                            width: '8rem',
                            maxWidth: '8rem',
                            minWidth: '8rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Pieces/Skids</div>
                                <MaskedInput
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                    ref={refBillToPieces}
                                    style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: (selectedBillToRating.pieces || '') !== '' ? 25 : 0 }}
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
                                        new Promise((resolve, reject) => {
                                            if (e.target.value.includes('.')) {
                                                setSelectedBillToRating({
                                                    ...selectedBillToRating,
                                                    pieces: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                                })
                                            }

                                            if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                                (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                                resolve('OK');
                                            } else {
                                                reject('no flat or linehaul');
                                            }
                                        }).then(response => {
                                            setSelectedCarrierRating({ ...selectedBillToRating });
                                        }).catch(e => {

                                        });
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
                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Weight</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToWeight}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                    new Promise((resolve, reject) => {
                                        if (e.target.value.includes('.')) {
                                            setSelectedBillToRating({
                                                ...selectedBillToRating,
                                                weight: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                            });
                                        }

                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                            (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            resolve('OK');
                                        } else {
                                            reject('no flat or linehaul');
                                        }
                                    }).then(response => {
                                        setSelectedCarrierRating({ ...selectedBillToRating });
                                    }).catch(e => {

                                    });
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Feet Required</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToFeetRequired}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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

                                    new Promise((resolve, reject) => {
                                        if (e.target.value.includes('.')) {
                                            setSelectedBillToRating({
                                                ...selectedBillToRating,
                                                feet_required: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                            })
                                        }

                                        if ((selectedBillToRating.rate_type?.name || '').toLowerCase() === 'flat' ||
                                            (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'linehaul') {
                                            resolve('OK');
                                        } else {
                                            reject('no flat or linehaul');
                                        }
                                    }).then(response => {
                                        setSelectedCarrierRating({ ...selectedBillToRating });
                                    }).catch(e => {

                                    });
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                    ref={refBillToSubtypeFuelSurcharge}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                    if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Percentage %</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeFuelSurchargePercentage}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            percentage: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Linehaul $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>

                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeFuelSurchargeRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeLinehaulRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? Number((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        rate: e.target.value,
                                        total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.replace(',', '')) * miles)
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                    ref={refBillToSubtypeLayover}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                    if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeLayoverRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Days</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeLayoverDays}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            days: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                    ref={refBillToSubtypeDetention}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                    if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeDetentionRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeDetentionHours}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            hours: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                    ref={refBillToSubtypeDriverAssist}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                    if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeDriverAssistRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_customer_reviewed || 0) === 1}
                                ref={refBillToSubtypeDriverAssistHours}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            hours: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            width: '12rem',
                            minWidth: '12rem',
                            maxWidth: '12rem',
                            display: ((selectedBillToRating?.rate_type?.name || '') === '' || (selectedBillToRating.rate_type?.name || '').toLowerCase() === 'comment') ? 'none' : 'flex'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_customer_reviewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Charges $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_customer_reviewed || 0) === 1
                                })}
                                readOnly={
                                    (selectedOrder?.invoice_customer_reviewed || 0) === 1 ||
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
                                ref={refBillToTotalCharges}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedBillToRating.total_charges || ''}
                                onKeyDown={(e) => {
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
                                            total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedBillToRating({
                                        ...selectedBillToRating,
                                        total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                        <div className="form-portal" style={{ flexGrow: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
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
                                                if ((selectedOrder?.is_cancelled || 0) === 0) {
                                                    if ((selectedOrder?.invoice_customer_reviewed || 0) === 0) {
                                                        const { rate, linehaul, total_charges } = rating;

                                                        setSelectedBillToRating({
                                                            ...rating,
                                                            rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(rate)),
                                                            total_charges: total_charges > 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(total_charges)) : ''
                                                        });
                                                    }
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
                                                    <div className="tcol subtype">{rating.rate_subtype?.name || ''}</div>
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
                                                    <div className="tcol miles">{(rating.subtype || '').toLowerCase() === 'miles' ? (selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : '' : ''}</div>
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

                <div className='form-bordered-box' style={{ borderBottom: 0, borderRight: 0, marginBottom: 20, marginTop: 10, boxShadow: 'none' }}>
                    <div className='form-header'>
                        <div className='top-border top-border-left'></div>
                        <div className='form-title'>Carrier Payments</div>
                        <div className='top-border top-border-middle'></div>
                        <div className="form-buttons">
                            <div className="mochi-button" style={{
                                pointerEvents: (selectedOrder?.is_cancelled || 0) === 0 ? 'all' : 'none'
                            }} onClick={() => {
                                setSelectedCarrierRating({});
                                refCarrierRateTypes.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base" style={{
                                    color: (selectedOrder?.is_cancelled || 0) === 0 ? 'black' : 'rgba(0,0,0,0.4)'
                                }}>Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className='top-border top-border-right'></div>
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
                            <div className="input-box-container" style={{ width: '12rem', marginRight: 5 }}>
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Gross Profit $</div>
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
                                        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                            <div className="input-box-container" style={{ width: '12rem', marginRight: 5 }}>
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Net Profit $</div>
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
                                        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                />
                            </div>
                            <div className="input-box-container" style={{ width: '12rem' }}>
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Percentage Profit %</div>
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
                                'disabled': (selectedOrder?.id || 0) === 0 || (selectedCarrierRating.id || 0) === 0
                            })} style={{ marginRight: 10 }} onClick={() => {
                                if (window.confirm('Are you sure you want to delete this item?')) {
                                    let url = (props.owner || 'order') === 'template'
                                        ? '/deleteTemplateCarrierRating'
                                        : '/deleteOrderCarrierRating';

                                    axios.post(props.serverUrl + url, {
                                        id: selectedCarrierRating.id,
                                        order_id: selectedOrder.id,
                                        template_id: selectedOrder.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {
                                            if ((props.owner || 'order') === 'order') {
                                                let orderCarrierRatings = JSON.parse(JSON.stringify(res.data.order_carrier_ratings));
                                                let totalCarrierRating = (orderCarrierRatings || []).reduce((accumulator, item) => {
                                                    return accumulator + item.total_charges;
                                                }, 0);

                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    order_carrier_ratings: orderCarrierRatings,
                                                    total_carrier_rating: totalCarrierRating
                                                });

                                                props.setSelectedOrder({
                                                    id: selectedOrder.id,
                                                    order_carrier_ratings: orderCarrierRatings,
                                                    total_carrier_rating: totalCarrierRating,
                                                    component_id: props.componentId
                                                })
                                            } else {
                                                let templateCarrierRatings = JSON.parse(JSON.stringify(res.data.template_carrier_ratings));
                                                let totalCarrierRating = (templateCarrierRatings || []).reduce((accumulator, item) => {
                                                    return accumulator + item.total_charges;
                                                }, 0);

                                                setSelectedOrder(selectedOrder => {
                                                    return {
                                                        ...selectedOrder,
                                                        order_carrier_ratings: templateCarrierRatings,
                                                        total_carrier_rating: totalCarrierRating
                                                    }
                                                });

                                                props.callback({
                                                    type: 'carrier',
                                                    order_carrier_ratings: templateCarrierRatings,
                                                    total_carrier_rating: totalCarrierRating
                                                })
                                            }


                                            setSelectedCarrierRating({});

                                            refCarrierRateTypes.current.focus();
                                        }
                                    }).catch(e => {
                                        console.log('error deleting rating item', e);
                                    })
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Delete</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="input-box-container" style={{
                                width: '15rem',
                                minWidth: '15rem',
                                maxWidth: '15rem'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Carrier Payments $</div>
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
                                        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
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
                            width: '11rem',
                            maxWidth: '11rem',
                            minWidth: '11rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 || (selectedOrder?.is_cancelled || 0) === 1}
                                    ref={refCarrierRateTypes}
                                    onKeyDown={(e) => {
                                        if ((selectedOrder?.is_cancelled || 0) === 0) {
                                            let key = e.keyCode || e.which;

                                            if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                                switch (key) {
                                                    case 37: case 38: // arrow left | arrow up
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

                                                    case 39: case 40: // arrow right | arrow down
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
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul' ||
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'comment')
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
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'linehaul' ||
                                                                    carrierRateTypeItems[carrierRateTypeItems.findIndex(item => item.selected)].name.toLowerCase() === 'comment')
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
                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical above right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                                item.name.toLowerCase() === 'linehaul' ||
                                                                                item.name.toLowerCase() === 'comment')
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            minWidth: '12rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Description</div>
                            <input type="text" style={{ textAlign: 'right', fontWeight: 'bold' }}
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1 || (selectedOrder?.is_cancelled || 0) === 1}
                                ref={refCarrierDescription}
                                onKeyDown={(e) => {
                                    if ((selectedOrder?.is_cancelled || 0) === 0) {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            if (key === 9) {
                                                if ((selectedCarrierRating?.rate_type?.id || 0) === 0 || (selectedCarrierRating?.rate_type?.name || '').toLowerCase() === 'comment') {
                                                    validateCarrierRatingForSaving(e);
                                                }
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
                            width: '8rem',
                            maxWidth: '8rem',
                            minWidth: '8rem',
                            marginRight: 2
                        }}>
                            <div className="select-box-wrapper">
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Pieces/Skids</div>
                                <MaskedInput
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                    ref={refCarrierPieces}
                                    style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: (selectedCarrierRating.pieces || '') !== '' ? 25 : 0 }}
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
                                                pieces: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            width: '7rem',
                            maxWidth: '7rem',
                            minWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Weight</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierWeight}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            weight: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Feet Required</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierFeetRequired}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            feet_required: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                    ref={refCarrierSubtypeFuelSurcharge}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
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
                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
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
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                            if ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') === undefined) {
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '7rem',
                            minWidth: '7rem',
                            maxWidth: '7rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Percentage %</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeFuelSurchargePercentage}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            percentage: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    const linehaul = parseFloat(((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2));

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        percentage: e.target.value,
                                        total_charges: (linehaul * (Number(e.target.value) / 100)).toFixed(2)
                                    })
                                }}
                            />
                        </div>

                        <div className="input-box-container" style={{ // FUEL SURCHARGE LINEHAUL
                            display: ((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined &&
                                (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'fuel surcharge' &&
                                (selectedCarrierRating.rate_subtype?.name || '').toLowerCase() === 'percentage') ? 'flex' : 'none',
                            width: '9rem',
                            minWidth: '9rem',
                            maxWidth: '9rem',
                            marginRight: 2
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Linehaul $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={Number((selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul')?.total_charges || 0).toFixed(2)}
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>

                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeFuelSurchargeRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeLinehaulRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.replace(',', '')))
                                    })
                                }}
                                onChange={(e) => {
                                    const miles = (selectedOrder?.miles || 0) > 0 ? Number((selectedOrder.miles / 1609.34).toFixed(0)) : 0;

                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        rate: e.target.value,
                                        total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.replace(',', '')) * miles)
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={true}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                    ref={refCarrierSubtypeLayover}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeLayoverRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Days</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeLayoverDays}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            days: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                    ref={refCarrierSubtypeDetention}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeDetentionRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeDetentionHours}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            hours: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                                <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Type</div>
                                <input type="text" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 15 }}
                                    className={classnames({
                                        'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                    })}
                                    readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                    ref={refCarrierSubtypeDriverAssist}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                        <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                            <div className="mochi-contextual-popup-content" >
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
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Rate $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeDriverAssistRate}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                        rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Hours</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={(selectedOrder?.invoice_carrier_previewed || 0) === 1}
                                ref={refCarrierSubtypeDriverAssistHours}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
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
                                            hours: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                            width: '12rem',
                            minWidth: '12rem',
                            maxWidth: '12rem',
                            display: ((selectedCarrierRating?.rate_type?.name || '') === '' || (selectedCarrierRating.rate_type?.name || '').toLowerCase() === 'comment') ? 'none' : 'flex'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: (selectedOrder?.invoice_carrier_previewed || 0) === 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Total Charges $</div>
                            <MaskedInput
                                className={classnames({
                                    'disabled': (selectedOrder?.invoice_carrier_previewed || 0) === 1
                                })}
                                readOnly={
                                    (selectedOrder?.invoice_carrier_previewed || 0) === 1 ||
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
                                ref={refCarrierTotalCharges}
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
                                mask={numberMask}
                                type="text"
                                guide={false}
                                value={selectedCarrierRating.total_charges || ''}
                                onKeyDown={(e) => {
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
                                            total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                        })
                                    }
                                }}
                                onInput={(e) => {
                                    setSelectedCarrierRating({
                                        ...selectedCarrierRating,
                                        total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
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
                        <div className="form-portal" style={{ flexGrow: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5 }}>
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
                                                if ((selectedOrder?.is_cancelled || 0) === 0) {
                                                    if ((selectedOrder?.invoice_carrier_previewed || 0) === 0) {
                                                        const { rate, linehaul, total_charges } = rating;

                                                        setSelectedCarrierRating({
                                                            ...rating,
                                                            rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(rate)),
                                                            total_charges: total_charges > 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(total_charges)) : ''
                                                        });
                                                    }
                                                }
                                            }}>
                                                <div className="tcol rate-type">{(rating.rate_type?.name || '').toLowerCase() === 'comment' ? '' : (rating.rate_type?.name || '')}</div>
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
                                                    <div className="tcol subtype">{rating.rate_subtype?.name || ''}</div>
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
                                                    <div className="tcol miles">{(rating.subtype || '').toLowerCase() === 'miles' ? (selectedOrder?.miles || 0) > 0 ? (selectedOrder.miles / 1609.34).toFixed(0) : '' : ''}</div>
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

            {
                approvalRequiredTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <RatingModal
                            title="Approval Required"
                            text={'Order will be over Customer\'s Credit Limit.</br>Please call to get approval'}
                            close={() => {
                                setShowApprovalRequired(false)
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

        selected_order: state.dispatchReducers.selected_order
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

    setSelectedOrder
})(RatingScreen)