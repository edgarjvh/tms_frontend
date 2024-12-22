/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import './Template.css';
import { connect } from "react-redux";
import axios from "axios";
import { DateInput, SelectBox, SelectPhoneBox, TextInput } from "../../../controls";
import { useDetectClickOutside } from "react-detect-click-outside";
import { animated, useTransition } from "react-spring";
import { CustomerSearch, Modal as DispatchModal, Modal, RatingScreen, Routing } from './../../panels';
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "loaders.css";
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
} from '../../../../actions';
import classnames from "classnames";
import moment from "moment";
import Customers from "../../customers/Customers";
import Carriers from "../../carriers/Carriers";
import NumberFormat from "react-number-format";

const Template = (props) => {

    //#region MAIN DECLARATIONS
    const refTemplateContainer = useRef();
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [selectedShipper, setSelectedShipper] = useState({});
    const [selectedConsignee, setSelectedConsignee] = useState({});
    const [selectedNoteForCarrier, setSelectedNoteForCarrier] = useState({});
    const [selectedInternalNote, setSelectedInternalNote] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isShowingShipperSecondPage, setIsShowingShipperSecondPage] = useState(false);
    const [isShowingConsigneeSecondPage, setIsShowingConsigneeSecondPage] = useState(false);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [isSavingPickup, setIsSavingPickup] = useState(-1);
    const [isSavingDelivery, setIsSavingDelivery] = useState(-1);
    const [isSavingRouting, setIsSavingRouting] = useState(false);
    const [isGettingMiles, setIsGettingMiles] = useState(false);
    const [isSavingMiles, setIsSavingMiles] = useState(false);

    const H = window.H;
    const platform = H !== undefined ? new H.service.Platform({
        apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
        app_id: "X4qy0Sva14BQxJCbVqXL",
    }) : undefined;

    const routingService = platform !== undefined ? platform.getRoutingService(null, 8) : undefined;
    //#endregion

    const refName = useRef();
    const refBillToCode = useRef();
    const refCarrierCode = useRef();
    const refShipperCode = useRef();
    const refConsigneeCode = useRef();
    const refPickupTime1 = useRef();
    const refPickupTime2 = useRef();
    const refDeliveryTime1 = useRef();
    const refDeliveryTime2 = useRef();
    const refShipperBolNumbers = useRef();
    const refShipperPoNumbers = useRef();
    const refShipperRefNumbers = useRef();
    const refConsigneeBolNumbers = useRef();
    const refConsigneePoNumbers = useRef();
    const refConsigneeRefNumbers = useRef();


    //#region DROPDOWN VARIABLES
    const [divisionItems, setDivisionItems] = useState([]);
    const refDivisions = useRef();
    const refDivisionPopupItems = useRef([]);
    const refDivisionDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setDivisionItems([])
        }
    });

    const [loadTypeItems, setLoadTypeItems] = useState([]);
    const refLoadTypes = useRef();
    const refLoadTypePopupItems = useRef([]);
    const refLoadTypeDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setLoadTypeItems([])
        }
    });

    const [billToContactNameItems, setBillToContactNameItems] = useState([]);
    const refBillToContactNames = useRef();
    const refBillToContactNamePopupItems = useRef([]);
    const refBillToContactNameDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setBillToContactNameItems([])
        }
    });
    const [showBillToContactPhones, setShowBillToContactPhones] = useState(false)
    const [billToContactPhoneItems, setBillToContactPhoneItems] = useState([]);
    const refBillToContactPhones = useRef();
    const refBillToContactPhonePopupItems = useRef([]);
    const refBillToContactPhoneDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowBillToContactPhones(false)
        }
    });

    const [carrierContactNameItems, setCarrierContactNameItems] = useState([]);
    const refCarrierContactNames = useRef();
    const refCarrierContactNamePopupItems = useRef([]);
    const refCarrierContactNameDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setCarrierContactNameItems([])
        }
    });
    const [showCarrierContactPhones, setShowCarrierContactPhones] = useState(false)
    const [carrierContactPhoneItems, setCarrierContactPhoneItems] = useState([]);
    const refCarrierContactPhones = useRef();
    const refCarrierContactPhonePopupItems = useRef([]);
    const refCarrierContactPhoneDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowCarrierContactPhones(false)
        }
    });
    const [carrierEquipmentItems, setCarrierEquipmentItems] = useState([]);
    const refCarrierEquipments = useRef();
    const refCarrierEquipmentPopupItems = useRef([]);
    const refCarrierEquipmentDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setCarrierEquipmentItems([])
        }
    });
    const [carrierDriverNameItems, setCarrierDriverNameItems] = useState([]);
    const refCarrierDriverNames = useRef();
    const refCarrierDriverNamePopupItems = useRef([]);
    const refCarrierDriverNameDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setCarrierDriverNameItems([])
        }
    });

    const [shipperContactNameItems, setShipperContactNameItems] = useState([]);
    const refShipperContactNames = useRef();
    const refShipperContactNamePopupItems = useRef([]);
    const refShipperContactNameDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setShipperContactNameItems([])
        }
    });
    const [showShipperContactPhones, setShowShipperContactPhones] = useState(false)
    const [shipperContactPhoneItems, setShipperContactPhoneItems] = useState([]);
    const refShipperContactPhones = useRef();
    const refShipperContactPhonePopupItems = useRef([]);
    const refShipperContactPhoneDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowShipperContactPhones(false)
        }
    });

    const [isPickupDate1CalendarShown, setIsPickupDate1CalendarShown] = useState(false);
    const [preSelectedPickupDate1, setPreSelectedPickupDate1] = useState(moment());
    const refPickupDate1 = useRef();
    const refPickupDate1CalendarDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsPickupDate1CalendarShown(false)
        }
    });

    const [isPickupDate2CalendarShown, setIsPickupDate2CalendarShown] = useState(false);
    const [preSelectedPickupDate2, setPreSelectedPickupDate2] = useState(moment());
    const refPickupDate2 = useRef();
    const refPickupDate2CalendarDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsPickupDate2CalendarShown(false)
        }
    });

    const [consigneeContactNameItems, setConsigneeContactNameItems] = useState([]);
    const refConsigneeContactNames = useRef();
    const refConsigneeContactNamePopupItems = useRef([]);
    const refConsigneeContactNameDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setConsigneeContactNameItems([])
        }
    });
    const [showConsigneeContactPhones, setShowConsigneeContactPhones] = useState(false)
    const [consigneeContactPhoneItems, setConsigneeContactPhoneItems] = useState([]);
    const refConsigneeContactPhones = useRef();
    const refConsigneeContactPhonePopupItems = useRef([]);
    const refConsigneeContactPhoneDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowConsigneeContactPhones(false)
        }
    });

    const [isDeliveryDate1CalendarShown, setIsDeliveryDate1CalendarShown] = useState(false);
    const [preSelectedDeliveryDate1, setPreSelectedDeliveryDate1] = useState(moment());
    const refDeliveryDate1 = useRef();
    const refDeliveryDate1CalendarDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsDeliveryDate1CalendarShown(false)
        }
    });

    const [isDeliveryDate2CalendarShown, setIsDeliveryDate2CalendarShown] = useState(false);
    const [preSelectedDeliveryDate2, setPreSelectedDeliveryDate2] = useState(moment());
    const refDeliveryDate2 = useRef();
    const refDeliveryDate2CalendarDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsDeliveryDate2CalendarShown(false)
        }
    });
    //#endregion

    //#region TRANSITIONS
    const shipperFirstPageTransition = useTransition(!isShowingShipperSecondPage, {
        from: { opacity: 0, left: "0%", width: "0%" },
        enter: { opacity: 1, left: "0%", width: "100%" },
        leave: { opacity: 0, left: "0%", width: "0%" },
        config: { duration: 300 },
        reverse: !isShowingShipperSecondPage,
    });

    const shipperSecondPageTransition = useTransition(isShowingShipperSecondPage, {
        from: { opacity: 0, left: "100%", width: "0%" },
        enter: { opacity: 1, left: "0%", width: "100%" },
        leave: { opacity: 0, left: "100%", width: "0%" },
        config: { duration: 300 },
        reverse: isShowingShipperSecondPage,
    });

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: "block" },
        enter: { opacity: 1, display: "block" },
        leave: { opacity: 0, display: "none" },
        reverse: isLoading,
    });

    const consigneeFirstPageTransition = useTransition(!isShowingConsigneeSecondPage, {
        from: { opacity: 0, left: "0%", width: "0%" },
        enter: { opacity: 1, left: "0%", width: "100%" },
        leave: { opacity: 0, left: "0%", width: "0%" },
        config: { duration: 300 },
        reverse: !isShowingConsigneeSecondPage,
    });

    const consigneeSecondPageTransition = useTransition(isShowingConsigneeSecondPage, {
        from: { opacity: 0, left: "100%", width: "0%" },
        enter: { opacity: 1, left: "0%", width: "100%" },
        leave: { opacity: 0, left: "100%", width: "0%" },
        config: { duration: 300 },
        reverse: isShowingConsigneeSecondPage,
    });

    const noteForCarrierTransition = useTransition(selectedNoteForCarrier?.id !== undefined, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: selectedNoteForCarrier?.id !== undefined,
        config: { duration: 100 },
    });

    const internalNoteTransition = useTransition(selectedInternalNote?.id !== undefined, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: selectedInternalNote?.id !== undefined,
        config: { duration: 100 },
    });
    //#endregion

    //#region USEEFFECTS
    useEffect(() => {
        if ((selectedTemplate?.bill_to_contact_id || 0) > 0) {
            let contact = (selectedTemplate?.bill_to_company?.contacts || []).find(x => x.id === selectedTemplate?.bill_to_contact_id);
            let phones = [];

            if (contact) {
                if ((contact?.phone_work || '') !== '') {
                    phones.push({
                        id: 1,
                        type: 'work',
                        phone: contact.phone_work
                    })
                }

                if ((contact?.phone_work_fax || '') !== '') {
                    phones.push({
                        id: 2,
                        type: 'fax',
                        phone: contact.phone_work_fax
                    })
                }

                if ((contact?.phone_mobile || '') !== '') {
                    phones.push({
                        id: 3,
                        type: 'mobile',
                        phone: contact.phone_mobile
                    })
                }

                if ((contact?.phone_direct || '') !== '') {
                    phones.push({
                        id: 4,
                        type: 'direct',
                        phone: contact.phone_direct
                    })
                }

                if ((contact?.phone_other || '') !== '') {
                    phones.push({
                        id: 5,
                        type: 'other',
                        phone: contact.phone_other
                    })
                }

                setBillToContactPhoneItems(phones);
            } else {
                setBillToContactPhoneItems([]);
            }
        } else {
            setBillToContactPhoneItems([]);
        }
    }, [selectedTemplate?.bill_to_contact_id]);

    useEffect(() => {
        if ((selectedTemplate?.carrier_contact_id || 0) > 0) {
            let contact = (selectedTemplate?.carrier?.contacts || []).find(x => x.id === selectedTemplate?.carrier_contact_id);
            let phones = [];

            if (contact) {
                if ((contact?.phone_work || '') !== '') {
                    phones.push({
                        id: 1,
                        type: 'work',
                        phone: contact.phone_work
                    })
                }

                if ((contact?.phone_work_fax || '') !== '') {
                    phones.push({
                        id: 2,
                        type: 'fax',
                        phone: contact.phone_work_fax
                    })
                }

                if ((contact?.phone_mobile || '') !== '') {
                    phones.push({
                        id: 3,
                        type: 'mobile',
                        phone: contact.phone_mobile
                    })
                }

                if ((contact?.phone_direct || '') !== '') {
                    phones.push({
                        id: 4,
                        type: 'direct',
                        phone: contact.phone_direct
                    })
                }

                if ((contact?.phone_other || '') !== '') {
                    phones.push({
                        id: 5,
                        type: 'other',
                        phone: contact.phone_other
                    })
                }

                setCarrierContactPhoneItems(phones);
            } else {
                setCarrierContactPhoneItems([]);
            }
        } else {
            setCarrierContactPhoneItems([]);
        }
    }, [selectedTemplate?.carrier_contact_id]);

    useEffect(() => {
        if ((selectedShipper?.contact_id || 0) > 0) {
            let contact = (selectedShipper?.contacts || []).find(x => x.id === selectedShipper?.contact_id);
            let phones = [];

            if (contact) {
                if ((contact?.phone_work || '') !== '') {
                    phones.push({
                        id: 1,
                        type: 'work',
                        phone: contact.phone_work
                    })
                }

                if ((contact?.phone_work_fax || '') !== '') {
                    phones.push({
                        id: 2,
                        type: 'fax',
                        phone: contact.phone_work_fax
                    })
                }

                if ((contact?.phone_mobile || '') !== '') {
                    phones.push({
                        id: 3,
                        type: 'mobile',
                        phone: contact.phone_mobile
                    })
                }

                if ((contact?.phone_direct || '') !== '') {
                    phones.push({
                        id: 4,
                        type: 'direct',
                        phone: contact.phone_direct
                    })
                }

                if ((contact?.phone_other || '') !== '') {
                    phones.push({
                        id: 5,
                        type: 'other',
                        phone: contact.phone_other
                    })
                }

                setShipperContactPhoneItems(phones);
            } else {
                setShipperContactPhoneItems([]);
            }
        } else {
            setShipperContactPhoneItems([]);
        }
    }, [selectedShipper?.contact_id]);

    useEffect(() => {
        if ((selectedConsignee?.contact_id || 0) > 0) {
            let contact = (selectedConsignee?.contacts || []).find(x => x.id === selectedConsignee?.contact_id);
            let phones = [];

            if (contact) {
                if ((contact?.phone_work || '') !== '') {
                    phones.push({
                        id: 1,
                        type: 'work',
                        phone: contact.phone_work
                    })
                }

                if ((contact?.phone_work_fax || '') !== '') {
                    phones.push({
                        id: 2,
                        type: 'fax',
                        phone: contact.phone_work_fax
                    })
                }

                if ((contact?.phone_mobile || '') !== '') {
                    phones.push({
                        id: 3,
                        type: 'mobile',
                        phone: contact.phone_mobile
                    })
                }

                if ((contact?.phone_direct || '') !== '') {
                    phones.push({
                        id: 4,
                        type: 'direct',
                        phone: contact.phone_direct
                    })
                }

                if ((contact?.phone_other || '') !== '') {
                    phones.push({
                        id: 5,
                        type: 'other',
                        phone: contact.phone_other
                    })
                }

                setConsigneeContactPhoneItems(phones);
            } else {
                setConsigneeContactPhoneItems([]);
            }
        } else {
            setConsigneeContactPhoneItems([]);
        }
    }, [selectedConsignee?.contact_id]);

    useEffect(() => {
        if ((props.id || 0) > 0) {
            setIsLoading(true);
            axios.post(props.serverUrl + '/getTemplateById', { id: props.id }).then(res => {
                if (res.data.result === 'OK') {
                    let template = { ...res.data.template };


                    template = {
                        ...template,
                        //#region BILL TO COMPANY
                        bill_to_contact_name: (template?.bill_to_contact_id || 0) > 0
                            ? template?.bill_to_contact_name
                            : '',
                        bill_to_contact_phone: (template?.bill_to_contact_id || 0) > 0
                            ? (template?.bill_to_contact_primary_phone || '') === 'work'
                                ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_work || ''
                                : (template?.bill_to_contact_primary_phone || '') === 'fax'
                                    ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_work_fax || ''
                                    : (template?.bill_to_contact_primary_phone || '') === 'mobile'
                                        ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_mobile || ''
                                        : (template?.bill_to_contact_primary_phone || '') === 'direct'
                                            ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_direct || ''
                                            : (template?.bill_to_contact_primary_phone || '') === 'other'
                                                ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_other || ''
                                                : ''
                            : '',
                        bill_to_contact_phone_ext: (template?.bill_to_contact_primary_phone || '') === 'work'
                            ? (template?.bill_to_company?.contacts || []).find(x => x.id === template?.bill_to_contact_id)?.phone_ext || ''
                            : '',
                        //#endregion

                        //#region CARRIER
                        carrier_contact_name: (template?.carrier_id || 0) > 0
                            ? template?.carrier_contact_name
                            : '',
                        carrier_contact_phone: (template?.carrier_contact_id || 0) > 0
                            ? (template?.carrier_contact_primary_phone || '') === 'work'
                                ? (template?.carrier?.contacts || []).find(x => x.id === template?.carrier_contact_id)?.phone_work || ''
                                : (template?.carrier_contact_primary_phone || '') === 'fax'
                                    ? (template?.carrier?.contacts || []).find(x => x.id === template?.carrier_contact_id)?.phone_work_fax || ''
                                    : (template?.carrier_contact_primary_phone || '') === 'mobile'
                                        ? (template?.carrier?.contacts || []).find(x => x.id === template?.carrier_contact_id)?.phone_mobile || ''
                                        : (template?.carrier_contact_primary_phone || '') === 'direct'
                                            ? (template?.carrier?.contacts || []).find(x => x.id === template?.carrier_contact_id)?.phone_direct || ''
                                            : (template?.carrier_contact_primary_phone || '') === 'other'
                                                ? (template?.carrier?.contacts || []).find(x => x.id === template?.carrier_contact_id)?.phone_other || ''
                                                : ''
                            : '',
                        carrier_driver_name: (template?.carrier_driver_id || 0) > 0
                            ? ((template?.carrier?.drivers || []).find(x => x.id === template?.carrier_driver_id)?.first_name || '') + ' ' +
                            ((template?.carrier?.drivers || []).find(x => x.id === template?.carrier_driver_id)?.last_name || '')
                            : '',
                        carrier_driver_phone: (template?.carrier_driver_id || 0) > 0
                            ? ((template?.carrier?.drivers || []).find(x => x.id === template?.carrier_driver_id)?.contact_phone || '')
                            : '',
                        carrier_driver_unit_number: (template?.carrier_driver_id || 0) > 0
                            ? ((template?.carrier?.drivers || []).find(x => x.id === template?.carrier_driver_id)?.tractor?.number || '')
                            : '',
                        carrier_driver_trailer_number: (template?.carrier_driver_id || 0) > 0
                            ? ((template?.carrier?.drivers || []).find(x => x.id === template?.carrier_driver_id)?.trailer?.number || '')
                            : '',
                        //#endregion

                        //#region PICKUPS
                        pickups: (template?.pickups || []).map((item, index) => {
                            if (index === 0) {
                                item.selected = true;

                                setSelectedShipper({
                                    ...item.customer,
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
                                    contact_id: item.contact_id,
                                    contact_name: (item?.contact_id || 0) > 0 ? item?.contact_name || '' : '',
                                    contact_phone: (item?.contact_id || 0) > 0
                                        ? (item?.contact_primary_phone || '') === 'work'
                                            ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_work || ''
                                            : (item?.contact_primary_phone || '') === 'fax'
                                                ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_work_fax || ''
                                                : (item?.contact_primary_phone || '') === 'mobile'
                                                    ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_mobile || ''
                                                    : (item?.contact_primary_phone || '') === 'direct'
                                                        ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_direct || ''
                                                        : (item?.contact_primary_phone || '') === 'other'
                                                            ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_other || ''
                                                            : ''
                                        : '',
                                    contact_phone_ext: (item?.contact_id || 0) > 0 && (item?.contact_primary_phone || '') === 'work'
                                        ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_ext || ''
                                        : '',
                                    contact_primary_phone: item.contact_primary_phone,
                                    type: item.type,
                                });
                            } else {
                                item.selected = false;
                            }

                            return item;
                        }),
                        //#endregion

                        //#region DELIVERIES
                        deliveries: (template?.deliveries || []).map((item, index) => {
                            if (index === 0) {
                                item.selected = true;

                                setSelectedConsignee({
                                    ...item.customer,
                                    delivery_id: item.id,
                                    pu_date1: item.pu_date1,
                                    pu_date2: item.pu_date2,
                                    pu_time1: item.pu_time1,
                                    pu_time2: item.pu_time2,
                                    bol_numbers: item.bol_numbers,
                                    po_numbers: item.po_numbers,
                                    ref_numbers: item.ref_numbers,
                                    seal_number: item.seal_number,
                                    special_instructions: item.special_instructions,
                                    contact_id: item.contact_id,
                                    contact_name: (item?.contact_id || 0) > 0 ? item?.contact_name || '' : '',
                                    contact_phone: (item?.contact_id || 0) > 0
                                        ? (item?.contact_primary_phone || '') === 'work'
                                            ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_work || ''
                                            : (item?.contact_primary_phone || '') === 'fax'
                                                ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_work_fax || ''
                                                : (item?.contact_primary_phone || '') === 'mobile'
                                                    ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_mobile || ''
                                                    : (item?.contact_primary_phone || '') === 'direct'
                                                        ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_direct || ''
                                                        : (item?.contact_primary_phone || '') === 'other'
                                                            ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_other || ''
                                                            : ''
                                        : '',
                                    contact_phone_ext: (item?.contact_id || 0) > 0 && (item?.contact_primary_phone || '') === 'work'
                                        ? (item?.customer?.contacts || []).find(x => x.id === item?.contact_id)?.phone_ext || ''
                                        : '',
                                    contact_primary_phone: item.contact_primary_phone,
                                    type: item.type,
                                });
                            } else {
                                item.selected = false;
                            }

                            return item;
                        })
                        //#endregion
                    }

                    setSelectedTemplate({ ...template });
                } else {
                    console.log(res.data.result)
                }
            }).catch(e => {
                console.log('error getting template', e);
            }).finally(() => {
                setIsLoading(false);
            });
        }

        refName.current.focus({
            preventScroll: true,
        });
    }, [])
    //#endregion

    //#region GETTER FUNCTIONS
    const getBillToCustomerByCode = (_code = '', origin = '') => {
        if ((selectedTemplate?.id || 0) > 0 && ((selectedTemplate?.bill_to_company?.code || '') !== '' || _code.trim() !== '')) {
            axios.post(props.serverUrl + '/getCustomerByCode', {
                code: _code === '' ? selectedTemplate.bill_to_company.code.toLowerCase() : _code.toLowerCase(),
                user_code: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }).then(res => {
                let bill_to_contact_id = null;
                let bill_to_contact_name = '';
                let bill_to_contact_primary_phone = 'work';
                let bill_to_contact_phone = '';
                let bill_to_contact_phone_ext = '';

                if (res.data.result === "OK") {
                    if ((res.data.customer?.contacts || []).length > 0) {
                        let primary_contact = res.data.customer.contacts.find(x => (x.is_primary || 0) === 1);

                        if (primary_contact) {
                            bill_to_contact_id = primary_contact.id;
                            bill_to_contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                            bill_to_contact_primary_phone = primary_contact?.primary_phone || 'work';
                            bill_to_contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                ? primary_contact?.phone_work || ''
                                : (primary_contact?.primary_phone || 'work') === 'fax'
                                    ? primary_contact?.phone_work_fax || ''
                                    : (primary_contact?.primary_phone || 'work') === 'mobile'
                                        ? primary_contact?.phone_mobile || ''
                                        : (primary_contact?.primary_phone || 'work') === 'direct'
                                            ? primary_contact?.phone_direct || ''
                                            : (primary_contact?.primary_phone || 'work') === 'other'
                                                ? primary_contact?.phone_other || ''
                                                : ''
                            bill_to_contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                ? primary_contact?.phone_ext || ''
                                : '';
                        }
                    }
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            bill_to_company: { ...res.data.customer },
                            bill_to_customer_id: res.data.customer?.id,
                            bill_to_contact_id: bill_to_contact_id,
                            bill_to_contact_name: bill_to_contact_name,
                            bill_to_contact_primary_phone: bill_to_contact_primary_phone,
                            bill_to_contact_phone: bill_to_contact_phone,
                            bill_to_contact_phone_ext: bill_to_contact_phone_ext
                        }
                    })

                    setTimeout(() => { setIsSavingTemplate(true); }, 100);

                    if (origin === ''){
                        refShipperCode.current.focus();
                    }else{
                        if (origin === 'shipper'){
                            refPickupDate1.current.inputElement.focus();
                        }else if (origin === 'consignee'){
                            refDeliveryDate1.current.inputElement.focus();
                        }
                    }                    
                } else {
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            bill_to_company: {},
                            bill_to_customer_id: null,
                            bill_to_contact_id: null,
                            bill_to_contact_name: '',
                            bill_to_contact_primary_phone: '',
                            bill_to_contact_phone: '',
                            bill_to_contact_phone_ext: ''
                        }
                    })

                    setTimeout(() => { setIsSavingTemplate(true); }, 100);
                }
            }).catch(e => {
                console.log("error getting customers", e);
            })
        }
    }

    const getCarrierByCode = (e) => {
        if ((selectedTemplate?.carrier?.code || '') !== '') {
            axios.post(props.serverUrl + "/getOrderCarrierByCode", {
                code: (selectedTemplate?.carrier?.code || '').toLowerCase(),
                division_type: selectedTemplate?.division?.type
            }).then(res => {
                let carrier_contact_id = null;
                let carrier_contact_name = '';
                let carrier_contact_primary_phone = 'work';
                let carrier_contact_phone = '';
                let carrier_driver_id = null;
                let carrier_driver_name = '';
                let carrier_driver_phone = '';
                let carrier_driver_equipment_id = null;
                let carrier_driver_equipment = null;
                let carrier_driver_unit_number = '';
                let carrier_driver_trailer_number = '';

                if (res.data.result === "OK") {
                    if ((res.data.carrier?.contacts || []).length > 0) {
                        let primary_contact = res.data.carrier.contacts.find(x => (x.is_primary || 0) === 1);

                        if (primary_contact) {
                            carrier_contact_id = primary_contact.id;
                            carrier_contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                            carrier_contact_primary_phone = primary_contact?.primary_phone || '';
                            carrier_contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                ? primary_contact?.phone_work || ''
                                : (primary_contact?.primary_phone || 'work') === 'fax'
                                    ? primary_contact?.phone_work_fax || ''
                                    : (primary_contact?.primary_phone || 'work') === 'mobile'
                                        ? primary_contact?.phone_mobile || ''
                                        : (primary_contact?.primary_phone || 'work') === 'direct'
                                            ? primary_contact?.phone_direct || ''
                                            : (primary_contact?.primary_phone || 'work') === 'other'
                                                ? primary_contact?.phone_other || ''
                                                : ''
                        }
                    }

                    if ((res.data.carrier?.drivers || []).length === 1) {
                        let driver = res.data.carrier.drivers[0];

                        if (driver) {
                            carrier_driver_id = driver.id;
                            carrier_driver_name = (driver?.first_name || '') + ' ' + (driver?.last_name || '');
                            carrier_driver_phone = driver?.contact_phone || '';
                            carrier_driver_equipment_id = driver?.tractor?.type?.id || null;
                            carrier_driver_equipment = driver?.tractor?.type;
                            carrier_driver_unit_number = driver?.tractor?.number || '';
                            carrier_driver_trailer_number = driver?.trailer?.number || '';
                        }
                    }

                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            carrier: { ...res.data.carrier },
                            carrier_id: res.data.carrier?.id,
                            carrier_contact_id: carrier_contact_id,
                            carrier_contact_name: carrier_contact_name,
                            carrier_contact_primary_phone: carrier_contact_primary_phone,
                            carrier_contact_phone: carrier_contact_phone,
                            carrier_driver_id: carrier_driver_id,
                            carrier_driver_name: carrier_driver_name,
                            carrier_driver_phone: carrier_driver_phone,
                            equipment_id: carrier_driver_equipment_id,
                            equipment: carrier_driver_equipment,
                            carrier_driver_unit_number: carrier_driver_unit_number,
                            carrier_driver_trailer_number: carrier_driver_trailer_number
                        }
                    })

                    refCarrierContactNames.current.focus();
                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                } else {
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            carrier: {},
                            carrier_id: null,
                            carrier_contact_id: null,
                            carrier_contact_name: '',
                            carrier_contact_primary_phone: '',
                            carrier_contact_phone: '',
                            carrier_driver_id: null,
                            carrier_driver_name: '',
                            carrier_driver_phone: '',
                            equipment_id: null,
                            equipment: {},
                            carrier_driver_unit_number: '',
                            carrier_driver_trailer_number: ''
                        }
                    })

                    refCarrierCode.current.focus();
                }
            }).catch(e => {
                console.log('error getting carriers', e);
            })
        }
    }

    const getShipperCustomerByCode = (_code = '') => {
        if ((selectedTemplate?.id || 0) > 0 && ((selectedTemplate?.pickups || []).find(x => x.selected)?.customer?.code || '') !== '') {
            axios.post(props.serverUrl + '/getCustomerByCode', {
                code: _code === '' ? selectedTemplate.pickups.find(x => x.selected).customer.code.toLowerCase() : _code.toLowerCase(),
                user_code: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }).then(res => {
                let contact_id = null;
                let contact_name = '';
                let contact_primary_phone = 'work';
                let contact_phone = '';
                let contact_phone_ext = '';

                if (res.data.result === "OK") {
                    if ((selectedTemplate?.bill_to_customer_id || 0) === 0) {                                                
                        if ((res.data.customer?.bill_to_code || '').trim() !== '') {
                            
                            getBillToCustomerByCode((res.data.customer?.bill_to_code_number || 0) === 0
                            ? res.data.customer?.bill_to_code
                            : res.data.customer?.bill_to_code + res.data.customer?.bill_to_code_number, 'shipper');
                        }
                    }

                    if ((res.data.customer?.contacts || []).length > 0) {
                        let primary_contact = res.data.customer.contacts.find(x => (x.is_primary || 0) === 1);

                        if (primary_contact) {
                            contact_id = primary_contact.id;
                            contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                            contact_primary_phone = primary_contact?.primary_phone || 'work';
                            contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                ? primary_contact?.phone_work || ''
                                : (primary_contact?.primary_phone || 'work') === 'fax'
                                    ? primary_contact?.phone_work_fax || ''
                                    : (primary_contact?.primary_phone || 'work') === 'mobile'
                                        ? primary_contact?.phone_mobile || ''
                                        : (primary_contact?.primary_phone || 'work') === 'direct'
                                            ? primary_contact?.phone_direct || ''
                                            : (primary_contact?.primary_phone || 'work') === 'other'
                                                ? primary_contact?.phone_other || ''
                                                : ''
                            contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                ? primary_contact?.phone_ext || ''
                                : '';
                        }
                    }
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            pickups: (selectedTemplate?.pickups || []).map(item => {
                                if (item.selected) {
                                    item.customer = { ...(res.data?.customer || {}) };
                                    item.customer_id = res.data?.customer?.id;
                                    item.contact_id = contact_id;
                                    item.contact_name = contact_name;
                                    item.contact_phone = contact_phone;
                                    item.contact_primary_phone = contact_primary_phone;
                                    item.contact_phone_ext = contact_phone_ext;
                                }
                                return item;
                            })
                        }
                    })

                    setSelectedShipper(prev => {
                        return {
                            ...prev,
                            ...(res.data.customer || {}),
                            customer_id: res.data?.customer?.id,
                            contact_id: contact_id,
                            contact_name: contact_name,
                            contact_phone: contact_phone,
                            contact_primary_phone: contact_primary_phone,
                            contact_phone_ext: contact_phone_ext
                        }
                    })

                    setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0); }, 100);
                    refShipperContactNames.current.focus();
                } else {
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            pickups: (selectedTemplate?.pickups || []).map(item => {
                                if (item.selected) {
                                    item.customer = {};
                                    item.customer_id = null;
                                    item.contact_id = null;
                                    item.contact_name = '';
                                    item.contact_phone = '';
                                    item.contact_primary_phone = 'work';
                                    item.contact_phone_ext = '';
                                }
                                return item;
                            })
                        }
                    })

                    setSelectedShipper({});

                    setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0); }, 100);
                    refShipperCode.current.focus();
                }
            }).catch(e => {
                console.log("error getting customers", e);
            })
        }
    }

    const getConsigneeCustomerByCode = (_code = '') => {
        if ((selectedTemplate?.id || 0) > 0 && ((selectedTemplate?.deliveries || []).find(x => x.selected)?.customer?.code || '') !== '') {
            axios.post(props.serverUrl + '/getCustomerByCode', {
                code: _code === '' ? selectedTemplate.deliveries.find(x => x.selected).customer.code.toLowerCase() : _code.toLowerCase(),
                user_code: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }).then(res => {
                let contact_id = null;
                let contact_name = '';
                let contact_primary_phone = 'work';
                let contact_phone = '';
                let contact_phone_ext = '';

                if (res.data.result === "OK") {
                    if ((selectedTemplate?.bill_to_customer_id || 0) === 0) {                                                
                        if ((res.data.customer?.bill_to_code || '').trim() !== '') {
                            
                            getBillToCustomerByCode((res.data.customer?.bill_to_code_number || 0) === 0
                            ? res.data.customer?.bill_to_code
                            : res.data.customer?.bill_to_code + res.data.customer?.bill_to_code_number, 'consignee');
                        }
                    }

                    if ((res.data.customer?.contacts || []).length > 0) {
                        let primary_contact = res.data.customer.contacts.find(x => (x.is_primary || 0) === 1);

                        if (primary_contact) {
                            contact_id = primary_contact.id;
                            contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                            contact_primary_phone = primary_contact?.primary_phone || 'work';
                            contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                ? primary_contact?.phone_work || ''
                                : (primary_contact?.primary_phone || 'work') === 'fax'
                                    ? primary_contact?.phone_work_fax || ''
                                    : (primary_contact?.primary_phone || 'work') === 'mobile'
                                        ? primary_contact?.phone_mobile || ''
                                        : (primary_contact?.primary_phone || 'work') === 'direct'
                                            ? primary_contact?.phone_direct || ''
                                            : (primary_contact?.primary_phone || 'work') === 'other'
                                                ? primary_contact?.phone_other || ''
                                                : ''
                            contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                ? primary_contact?.phone_ext || ''
                                : '';
                        }
                    }
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                if (item.selected) {
                                    item.customer = { ...(res.data?.customer || {}) };
                                    item.customer_id = res.data?.customer?.id;
                                    item.contact_id = contact_id;
                                    item.contact_name = contact_name;
                                    item.contact_phone = contact_phone;
                                    item.contact_primary_phone = contact_primary_phone;
                                    item.contact_phone_ext = contact_phone_ext;
                                }
                                return item;
                            })
                        }
                    })

                    setSelectedConsignee(prev => {
                        return {
                            ...prev,
                            ...(res.data.customer || {}),
                            customer_id: res.data?.customer?.id,
                            contact_id: contact_id,
                            contact_name: contact_name,
                            contact_phone: contact_phone,
                            contact_primary_phone: contact_primary_phone,
                            contact_phone_ext: contact_phone_ext
                        }
                    })

                    setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0); }, 100);
                    refConsigneeContactNames.current.focus();
                } else {
                    setSelectedTemplate(prev => {
                        return {
                            ...prev,
                            deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                if (item.selected) {
                                    item.customer = {};
                                    item.customer_id = null;
                                    item.contact_id = null;
                                    item.contact_name = '';
                                    item.contact_phone = '';
                                    item.contact_primary_phone = 'work';
                                    item.contact_phone_ext = '';
                                }
                                return item;
                            })
                        }
                    })

                    setSelectedConsignee({});

                    setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0); }, 100);
                    refConsigneeCode.current.focus();
                }
            }).catch(e => {
                console.log("error getting customers", e);
            })
        }
    }

    const getPickupsFromRouting = () => {
        let pickups = [];

        try {
            (selectedTemplate?.routing || []).map((item, i) => {
                if (item.type === "pickup") {
                    pickups.push(selectedTemplate.pickups.find((x) => x.id === item.pickup_id));
                }
                return false;
            });
        } catch (e) {

        }

        return pickups;
    }

    const getDeliveriesFromRouting = () => {
        let deliveries = [];

        try {
            (selectedTemplate?.routing || []).map((item, i) => {
                if (item.type === "delivery") {
                    deliveries.push(selectedTemplate.deliveries.find((x) => x.id === item.delivery_id));
                }
                return false;
            });
        } catch (e) {

        }

        return deliveries;
    }

    const searchBillToCompany = () => {
        let companySearch = [
            {
                field: "Code",
                data: (selectedTemplate?.bill_to_company?.code || "").toLowerCase(),
            },
            {
                field: "Name",
                data: (selectedTemplate?.bill_to_company?.name || "").toLowerCase(),
            },
            {
                field: "City",
                data: (selectedTemplate?.bill_to_company?.city || "").toLowerCase(),
            },
            {
                field: "State",
                data: (selectedTemplate?.bill_to_company?.state || "").toLowerCase(),
            },
            {
                field: "Postal Code",
                data: selectedTemplate?.bill_to_company?.zip || "",
            },
            {
                field: "Contact Name",
                data: (selectedTemplate?.bill_to_contact_name || "").toLowerCase(),
            },
            {
                field: "Contact Phone",
                data: selectedTemplate?.bill_to_contact_phone || "",
            },
            {
                field: "E-Mail",
                data: '',
            },
            {
                field: 'User Code',
                data: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }
        ];

        let panel = {
            panelName: `${props.panelName}-customer-search`,
            component: (
                <CustomerSearch
                    title="Customer Search Results"
                    tabTimes={29000}
                    panelName={`${props.panelName}-customer-search`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    customerSearch={companySearch}
                    callback={(id) => {
                        new Promise((resolve, reject) => {
                            if ((id || 0) > 0) {
                                axios.post(props.serverUrl + '/getCustomerById', { id: id }).then(res => {
                                    if (res.data.result === 'OK') {
                                        let customer = res.data.customer;
                                        let bill_to_contact_id = null;
                                        let bill_to_contact_name = '';
                                        let bill_to_contact_primary_phone = 'work';
                                        let bill_to_contact_phone = '';
                                        let bill_to_contact_phone_ext = '';

                                        if (customer) {
                                            if ((customer?.contacts || []).length > 0) {
                                                let primary_contact = customer.contacts.find(x => (x.is_primary || 0) === 1);

                                                if (primary_contact) {



                                                    bill_to_contact_id = primary_contact.id;
                                                    bill_to_contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                                                    bill_to_contact_primary_phone = primary_contact?.primary_phone || 'work';
                                                    bill_to_contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                                        ? primary_contact?.phone_work || ''
                                                        : (primary_contact?.primary_phone || 'work') === 'fax'
                                                            ? primary_contact?.phone_work_fax || ''
                                                            : (primary_contact?.primary_phone || 'work') === 'mobile'
                                                                ? primary_contact?.phone_mobile || ''
                                                                : (primary_contact?.primary_phone || 'work') === 'direct'
                                                                    ? primary_contact?.phone_direct || ''
                                                                    : (primary_contact?.primary_phone || 'work') === 'other'
                                                                        ? primary_contact?.phone_other || ''
                                                                        : ''
                                                    bill_to_contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                                        ? primary_contact?.phone_ext || ''
                                                        : '';
                                                }
                                            }
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: { ...customer },
                                                    bill_to_customer_id: customer?.id,
                                                    bill_to_contact_id: bill_to_contact_id,
                                                    bill_to_contact_name: bill_to_contact_name,
                                                    bill_to_contact_primary_phone: bill_to_contact_primary_phone,
                                                    bill_to_contact_phone: bill_to_contact_phone,
                                                    bill_to_contact_phone_ext: bill_to_contact_phone_ext
                                                }
                                            })

                                            resolve("OK");
                                        } else {
                                            reject("no customer");
                                        }
                                    } else {
                                        reject("no customer");
                                    }
                                }).catch(e => {
                                    reject("no customer");
                                })
                            } else {
                                reject("no customer");
                            }
                        }).then((response) => {
                            if (response === "OK") {
                                closePanel(`${props.panelName}-customer-search`, props.origin);
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                refBillToContactNames.current.focus();
                            }
                        }).catch((e) => {
                            closePanel(`${props.panelName}-customer-search`, props.origin);
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {},
                                    bill_to_customer_id: null,
                                    bill_to_contact_id: null,
                                    bill_to_contact_name: '',
                                    bill_to_contact_primary_phone: '',
                                    bill_to_contact_phone: '',
                                    bill_to_contact_phone_ext: ''
                                }
                            })

                            refBillToCode.current.focus();
                        });
                    }}
                    closingCallback={() => {
                        closePanel(`${props.panelName}-customer-search`, props.origin);
                        refName.current.focus({ preventScroll: true });
                    }}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const searchCarrier = () => {
        let carrierSearch = [
            {
                field: "Name",
                data: (selectedTemplate?.carrier?.name || "").toLowerCase(),
            },
            {
                field: "City",
                data: (selectedTemplate?.carrier?.city || "").toLowerCase(),
            },
            {
                field: "State",
                data: (selectedTemplate?.carrier?.state || "").toLowerCase(),
            },
            {
                field: "Postal Code",
                data: selectedTemplate?.carrier?.zip || "",
            },
            {
                field: "Contact Name",
                data: (selectedTemplate?.carrier_contact_name || "").toLowerCase(),
            },
            {
                field: "Contact Phone",
                data: selectedTemplate?.carrier_contact_phone || "",
            },
            {
                field: "E-Mail",
                data: '',
            },
        ];

        let panel = {
            panelName: `${props.panelName}-carrier-search`,
            component: (
                <CustomerSearch
                    title="Carrier Search Results"
                    tabTimes={69000}
                    panelName={`${props.panelName}-carrier-search`}
                    origin={props.origin}
                    suborigin={"carrier"}
                    componentId={moment().format("x")}
                    customerSearch={carrierSearch}
                    callback={(id) => {
                        new Promise((resolve, reject) => {
                            axios.post(props.serverUrl + '/getCarrierById', { id: id }).then(res => {
                                if (res.data.result === 'OK') {
                                    let carrier = { ...res.data.carrier };

                                    if (carrier) {
                                        let carrier_contact_id = null;
                                        let carrier_contact_name = '';
                                        let carrier_contact_primary_phone = 'work';
                                        let carrier_contact_phone = '';
                                        let carrier_driver_id = null;
                                        let carrier_driver_name = '';
                                        let carrier_driver_phone = '';
                                        let carrier_driver_equipment_id = null;
                                        let carrier_driver_equipment = null;
                                        let carrier_driver_unit_number = '';
                                        let carrier_driver_trailer_number = '';

                                        if ((carrier?.contacts || []).length > 0) {
                                            let primary_contact = carrier.contacts.find(x => (x.is_primary || 0) === 1);

                                            if (primary_contact) {
                                                carrier_contact_id = primary_contact.id;
                                                carrier_contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                                                carrier_contact_primary_phone = primary_contact?.primary_phone || '';
                                                carrier_contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                                    ? primary_contact?.phone_work || ''
                                                    : (primary_contact?.primary_phone || 'work') === 'fax'
                                                        ? primary_contact?.phone_work_fax || ''
                                                        : (primary_contact?.primary_phone || 'work') === 'mobile'
                                                            ? primary_contact?.phone_mobile || ''
                                                            : (primary_contact?.primary_phone || 'work') === 'direct'
                                                                ? primary_contact?.phone_direct || ''
                                                                : (primary_contact?.primary_phone || 'work') === 'other'
                                                                    ? primary_contact?.phone_other || ''
                                                                    : ''
                                            }
                                        }

                                        if ((carrier?.drivers || []).length === 1) {
                                            let driver = carrier.drivers[0];

                                            if (driver) {
                                                carrier_driver_id = driver.id;
                                                carrier_driver_name = (driver?.first_name || '') + ' ' + (driver?.last_name || '');
                                                carrier_driver_phone = driver?.contact_phone || '';
                                                carrier_driver_equipment_id = driver?.tractor?.type?.id || null;
                                                carrier_driver_equipment = driver?.tractor?.type;
                                                carrier_driver_unit_number = driver?.tractor?.number || '';
                                                carrier_driver_trailer_number = driver?.trailer?.number || '';
                                            }
                                        }

                                        setSelectedTemplate(prev => {
                                            return {
                                                ...prev,
                                                carrier: { ...carrier },
                                                carrier_id: carrier?.id,
                                                carrier_contact_id: carrier_contact_id,
                                                carrier_contact_name: carrier_contact_name,
                                                carrier_contact_primary_phone: carrier_contact_primary_phone,
                                                carrier_contact_phone: carrier_contact_phone,
                                                carrier_driver_id: carrier_driver_id,
                                                carrier_driver_name: carrier_driver_name,
                                                carrier_driver_phone: carrier_driver_phone,
                                                equipment_id: carrier_driver_equipment_id,
                                                equipment: carrier_driver_equipment,
                                                carrier_driver_unit_number: carrier_driver_unit_number,
                                                carrier_driver_trailer_number: carrier_driver_trailer_number
                                            }
                                        })

                                        resolve('OK');
                                    } else {
                                        reject("no carrier");
                                    }
                                }
                            }).catch(e => {
                                console.log('error on getting carrier', e);
                            })
                        }).then((response) => {
                            if (response === "OK") {
                                closePanel(`${props.panelName}-carrier-search`, props.origin);
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                refCarrierContactNames.current.focus();
                            }
                        }).catch((e) => {
                            closePanel(`${props.panelName}-carrier-search`, props.origin);
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    carrier: {},
                                    carrier_id: null,
                                    carrier_contact_id: null,
                                    carrier_contact_name: '',
                                    carrier_contact_primary_phone: '',
                                    carrier_contact_phone: '',
                                    carrier_driver_id: null,
                                    carrier_driver_name: '',
                                    carrier_driver_phone: '',
                                    equipment_id: null,
                                    equipment: {},
                                    carrier_driver_unit_number: '',
                                    carrier_driver_trailer_number: ''
                                }
                            })

                            refCarrierCode.current.focus();
                        });
                    }}
                    closingCallback={() => {
                        closePanel(`${props.panelName}-carrier-search`, props.origin);
                        refName.current.focus({ preventScroll: true });
                    }}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const searchShipper = () => {
        let companySearch = [
            {
                field: "Code",
                data: (selectedShipper?.code || "").toLowerCase(),
            },
            {
                field: "Name",
                data: (selectedShipper?.name || "").toLowerCase(),
            },
            {
                field: "City",
                data: (selectedShipper?.city || "").toLowerCase(),
            },
            {
                field: "State",
                data: (selectedShipper?.state || "").toLowerCase(),
            },
            {
                field: "Postal Code",
                data: selectedShipper?.zip || "",
            },
            {
                field: "Contact Name",
                data: (selectedShipper?.contact_name || "").toLowerCase(),
            },
            {
                field: "Contact Phone",
                data: selectedShipper?.contact_phone || "",
            },
            {
                field: "E-Mail",
                data: '',
            },
            {
                field: 'User Code',
                data: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }
        ];

        let panel = {
            panelName: `${props.panelName}-customer-search`,
            component: (
                <CustomerSearch
                    title="Customer Search Results"
                    tabTimes={2900980}
                    panelName={`${props.panelName}-customer-search`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    customerSearch={companySearch}
                    callback={(id) => {
                        new Promise((resolve, reject) => {
                            if ((id || 0) > 0) {
                                axios.post(props.serverUrl + '/getCustomerById', { id: id }).then(res => {
                                    if (res.data.result === 'OK') {
                                        let customer = res.data.customer;
                                        let contact_id = null;
                                        let contact_name = '';
                                        let contact_primary_phone = 'work';
                                        let contact_phone = '';
                                        let contact_phone_ext = '';                                        

                                        if (customer) {

                                            if ((selectedTemplate?.bill_to_customer_id || 0) === 0) {                                                
                                                if ((customer?.bill_to_code || '').trim() !== '') {
                                                    
                                                    getBillToCustomerByCode((customer?.bill_to_code_number || 0) === 0
                                                    ? customer.bill_to_code
                                                    : customer?.bill_to_code + customer?.bill_to_code_number, 'shipper');
                                                }
                                            }

                                            if ((customer?.contacts || []).length > 0) {
                                                let primary_contact = customer.contacts.find(x => (x.is_primary || 0) === 1);

                                                if (primary_contact) {
                                                    contact_id = primary_contact.id;
                                                    contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                                                    contact_primary_phone = primary_contact?.primary_phone || 'work';
                                                    contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                                        ? primary_contact?.phone_work || ''
                                                        : (primary_contact?.primary_phone || 'work') === 'fax'
                                                            ? primary_contact?.phone_work_fax || ''
                                                            : (primary_contact?.primary_phone || 'work') === 'mobile'
                                                                ? primary_contact?.phone_mobile || ''
                                                                : (primary_contact?.primary_phone || 'work') === 'direct'
                                                                    ? primary_contact?.phone_direct || ''
                                                                    : (primary_contact?.primary_phone || 'work') === 'other'
                                                                        ? primary_contact?.phone_other || ''
                                                                        : ''
                                                    contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                                        ? primary_contact?.phone_ext || ''
                                                        : '';
                                                }
                                            }

                                            if (!(selectedTemplate?.pickups || []).find(x => x.selected)) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: [
                                                            ...(selectedTemplate?.pickups || []),
                                                            {
                                                                selected: true,
                                                                customer: { ...(customer || {}) },
                                                                customer_id: customer?.id,
                                                                contact_id: contact_id,
                                                                contact_name: contact_name,
                                                                contact_phone: contact_phone,
                                                                contact_primary_phone: contact_primary_phone,
                                                                contact_phone_ext: contact_phone_ext,
                                                            }
                                                        ]
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = { ...(customer || {}) };
                                                                item.customer_id = customer?.id;
                                                                item.contact_id = contact_id;
                                                                item.contact_name = contact_name;
                                                                item.contact_phone = contact_phone;
                                                                item.contact_primary_phone = contact_primary_phone;
                                                                item.contact_phone_ext = contact_phone_ext;
                                                            }
                                                            return item;
                                                        })
                                                    }
                                                })
                                            }

                                            setSelectedShipper(prev => {
                                                return {
                                                    ...prev,
                                                    ...(customer || {}),
                                                    customer_id: customer?.id,
                                                    contact_id: contact_id,
                                                    contact_name: contact_name,
                                                    contact_phone: contact_phone,
                                                    contact_primary_phone: contact_primary_phone,
                                                    contact_phone_ext: contact_phone_ext
                                                }
                                            })

                                            resolve("OK");
                                        } else {
                                            reject("no customer");
                                        }
                                    } else {
                                        reject("no customer");
                                    }
                                }).catch(e => {
                                    reject("no customer");
                                })
                            } else {
                                reject("no customer");
                            }
                        }).then((response) => {
                            if (response === "OK") {
                                closePanel(`${props.panelName}-customer-search`, props.origin);
                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0); }, 100);
                                refShipperContactNames.current.focus();
                            }
                        }).catch((e) => {
                            closePanel(`${props.panelName}-customer-search`, props.origin);
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                        if (item.selected) {
                                            item.customer = {};
                                            item.customer_id = null;
                                            item.contact_id = null;
                                            item.contact_name = '';
                                            item.contact_phone = '';
                                            item.contact_primary_phone = 'work';
                                            item.contact_phone_ext = '';
                                        }
                                        return item;
                                    })
                                }
                            })

                            setSelectedShipper({});

                            refShipperCode.current.focus();
                        });
                    }}
                    closingCallback={() => {
                        closePanel(`${props.panelName}-customer-search`, props.origin);
                        refName.current.focus({ preventScroll: true });
                    }}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const searchConsignee = () => {
        let companySearch = [
            {
                field: "Code",
                data: (selectedConsignee?.code || "").toLowerCase(),
            },
            {
                field: "Name",
                data: (selectedConsignee?.name || "").toLowerCase(),
            },
            {
                field: "City",
                data: (selectedConsignee?.city || "").toLowerCase(),
            },
            {
                field: "State",
                data: (selectedConsignee?.state || "").toLowerCase(),
            },
            {
                field: "Postal Code",
                data: selectedConsignee?.zip || "",
            },
            {
                field: "Contact Name",
                data: (selectedConsignee?.contact_name || "").toLowerCase(),
            },
            {
                field: "Contact Phone",
                data: selectedConsignee?.contact_phone || "",
            },
            {
                field: "E-Mail",
                data: '',
            },
            {
                field: 'User Code',
                data: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
            }
        ];

        let panel = {
            panelName: `${props.panelName}-customer-search`,
            component: (
                <CustomerSearch
                    title="Customer Search Results"
                    tabTimes={2900980}
                    panelName={`${props.panelName}-customer-search`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    customerSearch={companySearch}
                    callback={(id) => {
                        new Promise((resolve, reject) => {
                            if ((id || 0) > 0) {
                                axios.post(props.serverUrl + '/getCustomerById', { id: id }).then(res => {
                                    if (res.data.result === 'OK') {
                                        let customer = res.data.customer;
                                        let contact_id = null;
                                        let contact_name = '';
                                        let contact_primary_phone = 'work';
                                        let contact_phone = '';
                                        let contact_phone_ext = '';

                                        if (customer) {

                                            if ((selectedTemplate?.bill_to_customer_id || 0) === 0) {                                                
                                                if ((customer?.bill_to_code || '').trim() !== '') {
                                                    
                                                    getBillToCustomerByCode((customer?.bill_to_code_number || 0) === 0
                                                    ? customer.bill_to_code
                                                    : customer?.bill_to_code + customer?.bill_to_code_number, 'consignee');
                                                }
                                            }

                                            if ((customer?.contacts || []).length > 0) {
                                                let primary_contact = customer.contacts.find(x => (x.is_primary || 0) === 1);

                                                if (primary_contact) {
                                                    contact_id = primary_contact.id;
                                                    contact_name = (primary_contact?.first_name || '') + ' ' + (primary_contact?.last_name || '');
                                                    contact_primary_phone = primary_contact?.primary_phone || 'work';
                                                    contact_phone = (primary_contact?.primary_phone || 'work') === 'work'
                                                        ? primary_contact?.phone_work || ''
                                                        : (primary_contact?.primary_phone || 'work') === 'fax'
                                                            ? primary_contact?.phone_work_fax || ''
                                                            : (primary_contact?.primary_phone || 'work') === 'mobile'
                                                                ? primary_contact?.phone_mobile || ''
                                                                : (primary_contact?.primary_phone || 'work') === 'direct'
                                                                    ? primary_contact?.phone_direct || ''
                                                                    : (primary_contact?.primary_phone || 'work') === 'other'
                                                                        ? primary_contact?.phone_other || ''
                                                                        : ''
                                                    contact_phone_ext = (primary_contact?.primary_phone || '') === 'work'
                                                        ? primary_contact?.phone_ext || ''
                                                        : '';
                                                }
                                            }

                                            if (!(selectedTemplate?.deliveries || []).find(x => x.selected)) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: [
                                                            ...(selectedTemplate?.deliveries || []),
                                                            {
                                                                selected: true,
                                                                customer: { ...(customer || {}) },
                                                                customer_id: customer?.id,
                                                                contact_id: contact_id,
                                                                contact_name: contact_name,
                                                                contact_phone: contact_phone,
                                                                contact_primary_phone: contact_primary_phone,
                                                                contact_phone_ext: contact_phone_ext,
                                                            }
                                                        ]
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = { ...(customer || {}) };
                                                                item.customer_id = customer?.id;
                                                                item.contact_id = contact_id;
                                                                item.contact_name = contact_name;
                                                                item.contact_phone = contact_phone;
                                                                item.contact_primary_phone = contact_primary_phone;
                                                                item.contact_phone_ext = contact_phone_ext;
                                                            }
                                                            return item;
                                                        })
                                                    }
                                                })
                                            }

                                            setSelectedConsignee(prev => {
                                                return {
                                                    ...prev,
                                                    ...(customer || {}),
                                                    customer_id: customer?.id,
                                                    contact_id: contact_id,
                                                    contact_name: contact_name,
                                                    contact_phone: contact_phone,
                                                    contact_primary_phone: contact_primary_phone,
                                                    contact_phone_ext: contact_phone_ext
                                                }
                                            })

                                            resolve("OK");
                                        } else {
                                            reject("no customer");
                                        }
                                    } else {
                                        reject("no customer");
                                    }
                                }).catch(e => {
                                    reject("no customer");
                                })
                            } else {
                                reject("no customer");
                            }
                        }).then((response) => {
                            if (response === "OK") {
                                closePanel(`${props.panelName}-customer-search`, props.origin);
                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0); }, 100);
                                refConsigneeContactNames.current.focus();
                            }
                        }).catch((e) => {
                            closePanel(`${props.panelName}-customer-search`, props.origin);
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                        if (item.selected) {
                                            item.customer = {};
                                            item.customer_id = null;
                                            item.contact_id = null;
                                            item.contact_name = '';
                                            item.contact_phone = '';
                                            item.contact_primary_phone = 'work';
                                            item.contact_phone_ext = '';
                                        }
                                        return item;
                                    })
                                }
                            })

                            setSelectedConsignee({});

                            refConsigneeCode.current.focus();
                        });
                    }}
                    closingCallback={() => {
                        closePanel(`${props.panelName}-customer-search`, props.origin);
                        refName.current.focus({ preventScroll: true });
                    }}
                />
            ),
        };

        openPanel(panel, props.origin);
    }
    //#endregion

    //#region USEEFFECT SAVING FUNCTIONS
    useEffect(() => {
        if (isSavingTemplate) {
            if ((selectedTemplate?.id || 0) > 0 && (selectedTemplate?.name || '').trim() !== '') {
                axios.post(props.serverUrl + '/saveTemplate', {
                    ...selectedTemplate,
                    bill_to_company: null,
                    carrier: null,
                    driver: null,
                    equipment: null,
                    pickups: null,
                    deliveries: null,
                    routing: null
                }).then(res => {
                    if (res.data.result === 'OK') {

                    }
                }).catch(e => {
                    console.log('error saving the template', e);
                }).finally(() => {
                    setIsLoading(false);
                })
            }

            setIsSavingTemplate(false);
        }
    }, [isSavingTemplate]);

    useEffect(() => {
        if (isSavingPickup > -1) {
            if ((selectedTemplate?.id || 0) > 0 && (selectedShipper?.id || 0) > 0) {
                axios.post(props.serverUrl + '/saveTemplatePickup', { ...selectedShipper, template_id: selectedTemplate.id }).then(res => {
                    if (res.data.result === 'OK') {
                        new Promise((resolve, reject) => {
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                        if (item.selected) {
                                            item.id = res.data.pickup.id
                                        }
                                        return item;
                                    })
                                }
                            })

                            setSelectedShipper(prev => {
                                return {
                                    ...prev,
                                    pickup_id: res.data.pickup.id
                                }
                            })

                            resolve('OK');
                        }).then(response => {
                            let routing = [...(selectedTemplate?.routing || [])];
                            let saveRouting = false;

                            if ((selectedTemplate?.pickups || []).length === 1 && (selectedTemplate?.deliveries || []).length === 1) {
                                if ((selectedTemplate.pickups[0]?.id || 0) > 0 && (selectedTemplate?.deliveries[0]?.id || 0) > 0) {
                                    routing = [
                                        {
                                            template_id: selectedTemplate?.id,
                                            pickup_id: selectedTemplate.pickups[0].id,
                                            delivery_id: null,
                                            type: 'pickup'
                                        },
                                        {
                                            template_id: selectedTemplate?.id,
                                            pickup_id: null,
                                            delivery_id: selectedTemplate.deliveries[0].id,
                                            type: 'delivery'
                                        }
                                    ]

                                    saveRouting = true;
                                }
                            }

                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    routing: routing
                                }
                            })

                            setTimeout(() => { setIsSavingRouting(saveRouting); }, 100);
                        })
                    }
                }).catch(e => {
                    console.log('error saving template pickup', e);
                });
            }
            setIsSavingPickup(-1);
        }
    }, [isSavingPickup]);

    useEffect(() => {
        if (isSavingDelivery > -1) {
            if ((selectedTemplate?.id || 0) > 0 && (selectedConsignee?.id || 0) > 0) {
                axios.post(props.serverUrl + '/saveTemplateDelivery', { ...selectedConsignee, template_id: selectedTemplate.id }).then(res => {
                    if (res.data.result === 'OK') {
                        new Promise((resolve, reject) => {
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                        if (item.selected) {
                                            item.id = res.data.delivery.id
                                        }
                                        return item;
                                    })
                                }
                            })

                            setSelectedConsignee(prev => {
                                return {
                                    ...prev,
                                    delivery_id: res.data.delivery.id
                                }
                            })

                            resolve('OK');
                        }).then(response => {
                            let routing = [...(selectedTemplate?.routing || [])];
                            let saveRouting = false;

                            if ((selectedTemplate?.pickups || []).length === 1 && (selectedTemplate?.deliveries || []).length === 1) {
                                if ((selectedTemplate.pickups[0]?.id || 0) > 0 && (selectedTemplate?.deliveries[0]?.id || 0) > 0) {
                                    routing = [
                                        {
                                            template_id: selectedTemplate?.id,
                                            pickup_id: selectedTemplate.pickups[0].id,
                                            delivery_id: null,
                                            type: 'pickup'
                                        },
                                        {
                                            template_id: selectedTemplate?.id,
                                            pickup_id: null,
                                            delivery_id: selectedTemplate.deliveries[0].id,
                                            type: 'delivery'
                                        }
                                    ]

                                    saveRouting = true;
                                }
                            }

                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    routing: routing
                                }
                            })

                            setTimeout(() => { setIsSavingRouting(saveRouting); }, 100);
                        })
                    }
                }).catch(e => {
                    console.log('error saving template delivery', e);
                });
            }
            setIsSavingDelivery(-1);
        }
    }, [isSavingDelivery]);

    useEffect(() => {
        if (isSavingRouting) {

            if ((selectedTemplate?.id || 0) > 0) {
                axios.post(props.serverUrl + '/saveTemplateRouting', {
                    template_id: selectedTemplate.id,
                    routing: (selectedTemplate?.routing || [])
                }).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedTemplate(prev => {
                            return {
                                ...prev,
                                routing: [...(res.data.routing || [])]
                            }
                        })

                        setIsGettingMiles(true);
                    }
                }).catch(e => {
                    console.log('error saving template routing', e);
                })
            }

            setIsSavingRouting(false);
        }
    }, [isSavingRouting]);

    useEffect(() => {
        if (isGettingMiles) {
            let pickups = selectedTemplate?.pickups || [];
            let deliveries = selectedTemplate?.deliveries || [];
            let routing = selectedTemplate?.routing || [];
            let currentWaypoints = selectedTemplate?.waypoints || '';
            let origin = null;
            let destination = null;
            let waypoints = [];

            if (routing.length >= 2) {
                routing.map((route, index) => {
                    let zip_data = '';

                    if (route.type === 'pickup') {
                        zip_data = pickups.find(x => x.id === route.pickup_id)?.customer?.zip_data;
                    } else if (route.type === 'delivery') {
                        zip_data = deliveries.find(x => x.id === route.delivery_id)?.customer?.zip_data;
                    }

                    if (index === 0) {
                        origin = `${(zip_data?.latitude || '').toString()},${(zip_data?.longitude || '').toString()}`;
                    } else if (index === (routing.length - 1)) {
                        destination = `${(zip_data?.latitude || '').toString()},${(zip_data?.longitude || '').toString()}`;
                    } else {
                        waypoints.push(`${(zip_data?.latitude || '').toString()},${(zip_data?.longitude || '').toString()}`);
                    }

                    return true;
                })

                let strWaypoints = JSON.stringify(origin) + JSON.stringify(waypoints) + JSON.stringify(destination);

                if (currentWaypoints !== strWaypoints) {
                    let routingParams = {
                        'routingMode': 'fast',
                        'transportMode': 'car',
                        'origin': origin,
                        'via': new H.service.Url.MultiValueQueryParameter(waypoints),
                        'destination': destination,
                        'return': 'summary'
                    }

                    if (routingService) {
                        routingService.calculateRoute(routingParams, (result) => {
                            let miles = (result?.routes[0]?.sections || []).reduce((a, b) => {
                                return a + b.summary.length;
                            }, 0) || 0;

                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    miles: miles,
                                    waypoints: strWaypoints
                                }
                            })

                            setIsGettingMiles(false);
                            setTimeout(() => { setIsSavingMiles(true); }, 100);
                        }, (error) => {
                            console.log("error getting mileage", error);
                            setSelectedTemplate(prev => {
                                return {
                                    ...prev,
                                    miles: 0,
                                    waypoints: currentWaypoints
                                }
                            })

                            setIsGettingMiles(false);
                            setTimeout(() => { setIsSavingMiles(true); }, 100);
                        })
                    } else {
                        setSelectedTemplate(prev => {
                            return {
                                ...prev,
                                miles: 0,
                                waypoints: currentWaypoints
                            }
                        })

                        setIsGettingMiles(false);
                        setTimeout(() => { setIsSavingMiles(true); }, 100);
                    }
                } else {
                    setIsGettingMiles(false);
                }
            } else {
                setSelectedTemplate(prev => {
                    return {
                        ...prev,
                        miles: 0,
                        waypoints: currentWaypoints
                    }
                })

                setIsGettingMiles(false);
                setTimeout(() => { setIsSavingMiles(true); }, 100);
            }

        }
    }, [isGettingMiles]);

    useEffect(() => {
        if (isSavingMiles) {
            if ((selectedTemplate?.id || 0) > 0) {
                axios.post(props.serverUrl + '/saveTemplateMilesWaypoints', {
                    id: selectedTemplate.id,
                    miles: selectedTemplate?.miles,
                    waypoints: selectedTemplate?.waypoints
                }).catch(e => {
                    console.log('error saving template miles waypoints', e);
                }).finally(() => {
                    setIsSavingMiles(false);
                })
            } else {
                setIsSavingMiles(false);
            }
        }
    }, [isSavingMiles]);
    //#endregion

    //#region UTIL FUNCTIONS
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

    const getFormattedHours = (hour) => {
        let formattedHour = hour;

        try {
            if (moment(hour.trim(), "HH:mm").format("HH:mm") === hour.trim()) {
                formattedHour = moment(hour.trim(), "HH:mm").format("HHmm");
            }

            if (moment(hour.trim(), "H:mm").format("H:mm") === hour.trim()) {
                formattedHour = moment(hour.trim(), "H:mm").format("HHmm");
            }

            if (moment(hour.trim(), "Hmm").format("Hmm") === hour.trim()) {
                formattedHour = moment(hour.trim(), "Hmm").format("HHmm");
            }

            if (moment(hour.trim(), "hh:mm a").format("hh:mm a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hh:mm a").format("HHmm");
            }

            if (moment(hour.trim(), "h:mm a").format("h:mm a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "h:mm a").format("HHmm");
            }

            if (moment(hour.trim(), "hh:mma").format("hh:mma") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hh:mma").format("HHmm");
            }

            if (moment(hour.trim(), "h:mma").format("h:mma") === hour.trim()) {
                formattedHour = moment(hour.trim(), "h:mma").format("HHmm");
            }

            if (moment(hour.trim(), "hhmm a").format("hhmm a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hhmm a").format("HHmm");
            }

            if (moment(hour.trim(), "hmm a").format("hmm a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hmm a").format("HHmm");
            }

            if (moment(hour.trim(), "hhmma").format("hhmma") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hhmma").format("HHmm");
            }

            if (moment(hour.trim(), "hmma").format("hmma") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hmma").format("HHmm");
            }

            if (moment(hour.trim(), "H").format("H") === hour.trim()) {
                formattedHour = moment(hour.trim(), "H").format("HHmm");
            }

            if (moment(hour.trim(), "HH").format("HH") === hour.trim()) {
                formattedHour = moment(hour.trim(), "HH").format("HHmm");
            }

            if (moment(hour.trim(), "h a").format("h a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "h a").format("HHmm");
            }

            if (moment(hour.trim(), "hh a").format("hh a") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hh a").format("HHmm");
            }

            if (moment(hour.trim(), "ha").format("ha") === hour.trim()) {
                formattedHour = moment(hour.trim(), "ha").format("HHmm");
            }

            if (moment(hour.trim(), "hha").format("hha") === hour.trim()) {
                formattedHour = moment(hour.trim(), "hha").format("HHmm");
            }

            if (moment(hour.trim(), "h:ma").format("h:ma") === hour.trim()) {
                formattedHour = moment(hour.trim(), "h:ma").format("HHmm");
            }

            if (moment(hour.trim(), "H:m").format("H:m") === hour.trim()) {
                formattedHour = moment(hour.trim(), "H:m").format("HHmm");
            }
        } catch (e) {

        }

        return formattedHour;
    };
    //#endregion

    return (
        <div className='panel-content' tabIndex={0} ref={refTemplateContainer} onKeyDown={(e) => {
            if (e.key === 'Escape'){
                e.stopPropagation();
                if ((selectedTemplate?.id || 0) > 0){
                    setSelectedTemplate({});
                    refName.current.focus();
                }else{
                    props.closingCallback();
                }
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            <div className="template-main-container">
                <div className="template-row first">
                    <div className="template-column first">
                        <div className="input-box-container" style={{
                            display: 'flex',
                            alignItems: "center",
                            gap: 5,
                            flexGrow: 1,                            
                        }}>
                            <label htmlFor="" style={{ fontSize: '0.8rem', fontWeight: "bold" }}>Name:</label>
                            <input
                                type="text"
                                ref={refName}
                                tabIndex={1 + props.tabTimes}
                                readOnly={isEditing}
                                style={{ textTransform: "capitalize" }}
                                value={selectedTemplate?.name || ''}
                                onChange={(e) => {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            name: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>

                    <div className="template-column second">
                        <SelectBox
                            className={`template-division`}
                            disabled={(selectedTemplate?.id || 0) === 0}
                            placeholder="Division"
                            popupId="division"
                            tabIndex={2 + props.tabTimes}
                            boxStyle={{
                                flexGrow: 1,
                            }}
                            inputStyle={{
                                textTransform: 'capitalize'
                            }}
                            refs={{
                                refInput: refDivisions,
                                refPopupItems: refDivisionPopupItems,
                                refDropdown: refDivisionDropdown,
                            }}
                            noStopPropagationOnEsc={true}
                            readOnly={false}
                            isDropdownEnabled={(selectedTemplate?.id || 0) > 0}
                            popupPosition="vertical below"
                            onEnter={async e => {
                                if (divisionItems.length > 0 && divisionItems.findIndex(item => item.selected) > -1) {
                                    let item = divisionItems[divisionItems.findIndex(item => item.selected)];

                                    await setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            division: item,
                                            division_id: item.id
                                        }
                                    })
                                    setDivisionItems([]);
                                    refDivisions.current.focus();
                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }
                            }}
                            onTab={async e => {
                                if (divisionItems.length > 0 && divisionItems.findIndex(item => item.selected) > -1) {
                                    let item = divisionItems[divisionItems.findIndex(item => item.selected)];

                                    await setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            division: item,
                                            division_id: item.id
                                        }
                                    })

                                    setDivisionItems([]);
                                    refDivisions.current.focus();
                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }
                            }}
                            onBlur={e => {
                                if ((selectedTemplate?.division?.id || 0) === 0) {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            division: {},
                                            division_id: null
                                        }
                                    })
                                }
                            }}
                            onInput={e => {
                                let _division = selectedTemplate?.division || {};
                                _division.id = 0;
                                _division.name = e.target.value;

                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        division: _division
                                    }
                                })

                                if ((selectedTemplate?.id || 0) > 0){
                                    if (e.target.value.trim() === "") {
                                        setDivisionItems([]);
                                    } else {
                                        axios.post(props.serverUrl + "/getDivisionsDropdown", {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === "OK") {
                                                setDivisionItems(res.data.divisions.map((item, index) => {
                                                    item.selected = (selectedTemplate?.division?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedTemplate.division.id
                                                    return item;
                                                }));
                                            }
                                        }).catch(e => {
                                            console.log("error getting divisions", e);
                                        })
                                    }
                                }
                            }}
                            onChange={e => {
                                let _division = selectedTemplate?.division || {};
                                _division.id = 0;
                                _division.name = e.target.value;

                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        division: _division
                                    }
                                })
                            }}
                            value={selectedTemplate?.division?.name || ""}
                            items={divisionItems}
                            getItems={() => {
                                axios.post(props.serverUrl + "/getDivisionsDropdown").then(async res => {
                                    if (res.data.result === "OK") {
                                        await setDivisionItems(res.data.divisions.map((item, index) => {
                                            item.selected = (selectedTemplate?.division?.id || 0) === 0
                                                ? index === 0
                                                : item.id === selectedTemplate.division.id
                                            return item;
                                        }));

                                        refDivisionPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    }
                                }).catch(async e => {
                                    console.log("error getting divisions", e);
                                });
                            }}
                            setItems={setDivisionItems}
                            onDropdownClick={e => {
                                if ((selectedTemplate?.division?.id || 0) === 0 && (selectedTemplate?.division?.name || "") !== "") {
                                    axios.post(props.serverUrl + "/getDivisionsDropdown", {
                                        name: selectedTemplate?.division?.name
                                    }).then(async res => {
                                        if (res.data.result === "OK") {
                                            await setDivisionItems(res.data.divisions.map((item, index) => {
                                                item.selected = (selectedTemplate?.division?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTemplate.division.id
                                                return item;
                                            }));

                                            refDivisionPopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting divisions", e);
                                    });
                                } else {
                                    axios.post(props.serverUrl + "/getDivisionsDropdown").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setDivisionItems(res.data.divisions.map((item, index) => {
                                                item.selected = (selectedTemplate?.division?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTemplate.division.id
                                                return item;
                                            }));

                                            refDivisionPopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting divisions", e);
                                    });
                                }
                            }}
                            onPopupClick={item => {
                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        division: item,
                                        division_id: item.id
                                    }
                                })

                                setDivisionItems([]);
                                refDivisions.current.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }}
                        />

                        <SelectBox
                            className={`template-load-type`}
                            disabled={(selectedTemplate?.id || 0) === 0}
                            placeholder="Load Type"
                            popupId="load_type"
                            tabIndex={3 + props.tabTimes}
                            boxStyle={{
                                flexGrow: 1,
                            }}
                            inputStyle={{
                                textTransform: 'capitalize'
                            }}
                            refs={{
                                refInput: refLoadTypes,
                                refPopupItems: refLoadTypePopupItems,
                                refDropdown: refLoadTypeDropdown,
                            }}
                            noStopPropagationOnEsc={true}
                            readOnly={false}
                            isDropdownEnabled={(selectedTemplate?.id || 0) > 0}
                            popupPosition="vertical below"
                            onEnter={async e => {
                                if (loadTypeItems.length > 0 && loadTypeItems.findIndex(item => item.selected) > -1) {
                                    let item = loadTypeItems[loadTypeItems.findIndex(item => item.selected)];

                                    await setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            load_type: item,
                                            load_type_id: item.id
                                        }
                                    })

                                    setLoadTypeItems([]);
                                    refLoadTypes.current.focus();
                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }
                            }}
                            onTab={async e => {
                                if (loadTypeItems.length > 0 && loadTypeItems.findIndex(item => item.selected) > -1) {
                                    let item = loadTypeItems[loadTypeItems.findIndex(item => item.selected)];

                                    await setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            load_type: item,
                                            load_type_id: item.id
                                        }
                                    })

                                    setLoadTypeItems([]);
                                    refLoadTypes.current.focus();
                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }
                            }}
                            onBlur={e => {
                                if ((selectedTemplate?.load_type?.id || 0) === 0) {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            load_type: {},
                                            load_type_id: null
                                        }
                                    })
                                }
                            }}
                            onInput={e => {
                                let _loadType = selectedTemplate?.load_type || {};
                                _loadType.id = 0;
                                _loadType.name = e.target.value;

                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        load_type: _loadType
                                    }
                                })

                                if ((selectedTemplate?.id || 0) > 0){
                                    if (e.target.value.trim() === "") {
                                        setLoadTypeItems([]);
                                    } else {
                                        axios.post(props.serverUrl + "/getLoadTypesDropdown", {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === "OK") {
                                                setLoadTypeItems(res.data.loadTypes.map((item, index) => {
                                                    item.selected = (selectedTemplate?.load_type?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedTemplate.load_type.id
                                                    return item;
                                                }));
                                            }
                                        }).catch(e => {
                                            console.log("error getting load types", e);
                                        })
                                    }
                                }
                            }}
                            onChange={e => {
                                let _loadType = selectedTemplate?.load_type || {};
                                _loadType.id = 0;
                                _loadType.name = e.target.value;

                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        load_type: _loadType
                                    }
                                })
                            }}
                            value={selectedTemplate?.load_type?.name || ""}
                            items={loadTypeItems}
                            getItems={() => {
                                axios.post(props.serverUrl + "/getLoadTypesDropdown").then(async res => {
                                    if (res.data.result === "OK") {
                                        await setLoadTypeItems(res.data.loadTypes.map((item, index) => {
                                            item.selected = (selectedTemplate?.load_type?.id || 0) === 0
                                                ? index === 0
                                                : item.id === selectedTemplate.load_type.id
                                            return item;
                                        }));

                                        refLoadTypePopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    }
                                }).catch(async e => {
                                    console.log("error getting load types", e);
                                });
                            }}
                            setItems={setLoadTypeItems}
                            onDropdownClick={e => {
                                if ((selectedTemplate?.load_type?.id || 0) === 0 && (selectedTemplate?.load_type?.name || "") !== "") {
                                    axios.post(props.serverUrl + "/getLoadTypesDropdown", {
                                        name: selectedTemplate?.load_type?.name
                                    }).then(async res => {
                                        if (res.data.result === "OK") {
                                            await setLoadTypeItems(res.data.loadTypes.map((item, index) => {
                                                item.selected = (selectedTemplate?.load_type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTemplate.load_type.id
                                                return item;
                                            }));

                                            refLoadTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting load types", e);
                                    });
                                } else {
                                    axios.post(props.serverUrl + "/getLoadTypesDropdown").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setLoadTypeItems(res.data.loadTypes.map((item, index) => {
                                                item.selected = (selectedTemplate?.load_type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTemplate.load_type.id
                                                return item;
                                            }));

                                            refLoadTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting load types", e);
                                    });
                                }
                            }}
                            onPopupClick={item => {
                                setSelectedTemplate(prev => {
                                    return {
                                        ...prev,
                                        load_type: item,
                                        load_type_id: item.id
                                    }
                                })

                                setLoadTypeItems([]);
                                refLoadTypes.current.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }}
                        />
                    </div>

                    <div className="template-column third">
                        <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                            if (window.confirm('Are you sure you want to proceed?')) {
                                axios.post(props.serverUrl + '/deleteTemplate', { id: selectedTemplate.id }).then(res => {
                                    if (res.data.result === 'OK') {
                                        props.deleteCallback(selectedTemplate.id);

                                        setSelectedTemplate({});
                                        setSelectedShipper({});
                                        setSelectedConsignee({});
                                        setSelectedNoteForCarrier({});
                                        setSelectedInternalNote({});

                                        refName.current.focus();
                                    }
                                })
                            }
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base" style={{ color: "darkred" }}>Delete</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className={`mochi-button`} onClick={() => {
                            if ((selectedTemplate?.name || '').trim() === '') {
                                window.alert('The name of the template cannot be empty!');
                                return;
                            }

                            axios.post(props.serverUrl + '/saveTemplate', {
                                ...selectedTemplate,
                                bill_to_company: null,
                                carrier: null,
                                driver: null,
                                equipment: null,
                                pickups: null,
                                deliveries: null,
                                routing: null
                            }).then(res => {
                                if (res.data.result === 'OK') {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            id: res.data.template.id
                                        }
                                    })

                                    setTimeout(() => { refDivisions.current.focus(); }, 100);
                                }
                            }).catch(e => {
                                console.log('error saving the template', e);
                            })
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Save</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>
                </div>

                <div className="template-row second">
                    <div className="template-column first">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Bill To</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={`mochi-button${((selectedTemplate?.id || 0) === 0 || (selectedTemplate?.bill_to_customer_id || 0) > 0) ? ' disabled' : ''}`} onClick={() => {
                                        searchBillToCompany();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={`mochi-button${(selectedTemplate?.bill_to_customer_id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        let panel = {
                                            panelName: `${props.panelName}-customer`,
                                            component: (
                                                <Customers
                                                    pageName={"Customer"}
                                                    title={"Bill-To Company"}
                                                    panelName={`${props.panelName}-customer`}
                                                    tabTimes={2000 + props.tabTimes}
                                                    componentId={moment().format("x")}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    origin={props.origin}
                                                    customer_id={selectedTemplate?.bill_to_customer_id}
                                                    closingCallback={() => {
                                                        closePanel(`${props.panelName}-customer`, props.origin);
                                                        refName.current.focus({ preventScroll: true });
                                                    }}
                                                />
                                            ),
                                        };

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Company Info</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        let panel = {
                                            panelName: `${props.panelName}-rating`,
                                            component: (
                                                <RatingScreen
                                                    panelName={`${props.panelName}-rating`}
                                                    title="Rating Screen"
                                                    tabTimes={3400087 + props.tabTimes}
                                                    componentId={moment().format("x")}
                                                    origin={props.origin}
                                                    selectedOrder={selectedTemplate}
                                                    owner='template'
                                                    callback={(data) => {
                                                        if (data?.type === 'customer') {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    order_customer_ratings: data.order_customer_ratings,
                                                                    total_customer_rating: data.total_customer_rating
                                                                }
                                                            })
                                                        } else {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    order_carrier_ratings: data.order_carrier_ratings,
                                                                    total_carrier_rating: data.total_carrier_rating
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    closingCallback={() => {
                                                        closePanel(`${props.panelName}-rating`, props.origin);
                                                        refName.current.focus({ preventScroll: true });
                                                    }}
                                                />
                                            ),
                                        };

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Rate Load</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        setSelectedTemplate(prev => {
                                            return {
                                                ...prev,
                                                bill_to_customer_id: null,
                                                bill_to_company: null,
                                                bill_to_contact_id: null,
                                                bill_to_contact_name: '',
                                                bill_to_contact_phone: '',
                                                bill_to_contact_primary_phone: 'work'
                                            }
                                        })

                                        refBillToCode.current.focus();
                                        setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-wrapper">
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: refBillToCode
                                        }}
                                        className='input-code'
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Code'
                                        maxLength={8}
                                        tabIndex={4 + props.tabTimes}
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9) {
                                                getBillToCustomerByCode();
                                            }
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        code: e.target.value,
                                                        code_number: 0
                                                    }
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedTemplate?.bill_to_company?.code_number || 0) === 0
                                                ? (selectedTemplate?.bill_to_company?.code || '')
                                                : (selectedTemplate?.bill_to_company?.code || '') + selectedTemplate.bill_to_company.code_number
                                        }
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        placeholder='Name'
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        tabIndex={5 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1,
                                            
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize',
                                            
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        name: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.name || '')}
                                    />

                                </div>
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Address 1'
                                        tabIndex={6 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        address1: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.address1 || '')}
                                    />
                                </div>
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Address 2'
                                        tabIndex={7 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        address2: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.address2 || '')}
                                    />
                                </div>
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='City'
                                        tabIndex={8 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        city: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.city || '')}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-state'
                                        placeholder='State'
                                        tabIndex={9 + props.tabTimes}
                                        maxLength={2}
                                        inputStyle={{
                                            textDecoration: 'uppercase'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        state: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.state || '')}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-zip-code'
                                        placeholder='Postal Code'
                                        tabIndex={10 + props.tabTimes}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_company: {
                                                        ...(selectedTemplate?.bill_to_company || {}),
                                                        zip: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.bill_to_company?.zip || '')}
                                    />
                                </div>
                                <div className="form-row">
                                    <SelectBox
                                        className={'template-bill-to-contact-name'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Contact Name"
                                        popupId="template-bill-to-contact-name"
                                        tabIndex={11 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1,
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        refs={{
                                            refInput: refBillToContactNames,
                                            refPopupItems: refBillToContactNamePopupItems,
                                            refDropdown: refBillToContactNameDropdown,
                                        }}
                                        noStopPropagationOnEsc={true}
                                        readOnly={false}
                                        isDropdownEnabled={(selectedTemplate?.bill_to_company?.id || 0) > 0 && (selectedTemplate?.bill_to_company?.contacts || []).length > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={e => {
                                            if (billToContactNameItems.length > 0 && billToContactNameItems.findIndex(item => item.selected) > -1) {
                                                let item = billToContactNameItems[billToContactNameItems.findIndex(item => item.selected)];

                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_id: item.id,
                                                        bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                        bill_to_contact_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                            ? selectedTemplate?.bill_to_contact_phone
                                                            : (item?.primary_phone || '') === 'work'
                                                                ? item?.phone_work || ''
                                                                : (item?.primary_phone || '') === 'fax'
                                                                    ? item?.phone_work_fax || ''
                                                                    : (item?.primary_phone || '') === 'mobile'
                                                                        ? item?.phone_mobile || ''
                                                                        : (item?.primary_phone || '') === 'direct'
                                                                            ? item?.phone_direct || ''
                                                                            : (item?.primary_phone || '') === 'other'
                                                                                ? item?.phone_other || ''
                                                                                : '',
                                                        bill_to_contact_primary_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                            ? selectedTemplate?.bill_to_contact_primary_phone
                                                            : item?.primary_phone || ''
                                                    }
                                                })

                                                setBillToContactNameItems([]);
                                                refBillToContactNames.current.focus();
                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onTab={e => {
                                            if (billToContactNameItems.length > 0 && billToContactNameItems.findIndex(item => item.selected) > -1) {
                                                let item = billToContactNameItems[billToContactNameItems.findIndex(item => item.selected)];

                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_id: item.id,
                                                        bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                        bill_to_contact_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                            ? selectedTemplate?.bill_to_contact_phone
                                                            : (item?.primary_phone || '') === 'work'
                                                                ? item?.phone_work || ''
                                                                : (item?.primary_phone || '') === 'fax'
                                                                    ? item?.phone_work_fax || ''
                                                                    : (item?.primary_phone || '') === 'mobile'
                                                                        ? item?.phone_mobile || ''
                                                                        : (item?.primary_phone || '') === 'direct'
                                                                            ? item?.phone_direct || ''
                                                                            : (item?.primary_phone || '') === 'other'
                                                                                ? item?.phone_other || ''
                                                                                : '',
                                                        bill_to_contact_primary_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                            ? selectedTemplate?.bill_to_contact_primary_phone
                                                            : item?.primary_phone || ''
                                                    }
                                                })

                                                setBillToContactNameItems([]);
                                                refBillToContactNames.current.focus();
                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onBlur={e => {
                                            let contact = (selectedTemplate?.bill_to_company?.contacts || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (selectedTemplate?.bill_to_contact_name || '').trim().toLowerCase());

                                            if (contact) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_id: contact?.id
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_id: null,
                                                        bill_to_contact_name: '',
                                                        bill_to_contact_phone: '',
                                                        bill_to_contact_primary_phone: ''
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_contact_id: null,
                                                    bill_to_contact_name: e.target.value,
                                                    bill_to_contact_phone: '',
                                                    bill_to_contact_primary_phone: ''
                                                }
                                            })

                                            if (e.target.value.trim() === "") {
                                                setBillToContactNameItems([]);
                                            } else {
                                                setBillToContactNameItems((selectedTemplate?.bill_to_company?.contacts || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((selectedTemplate?.bill_to_contact_name || '').trim().toLowerCase())).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }
                                        }}
                                        onChange={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_contact_id: null,
                                                    bill_to_contact_name: e.target.value,
                                                    bill_to_contact_phone: '',
                                                    bill_to_contact_primary_phone: ''
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.bill_to_contact_name || ""}
                                        items={billToContactNameItems}
                                        getItems={() => {
                                            let selectedIndex = (selectedTemplate?.bill_to_company?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.bill_to_contact_name || '').trim().toLowerCase());

                                            if (selectedIndex > -1) {
                                                setBillToContactNameItems((selectedTemplate?.bill_to_company?.contacts || []).map((item, index) => {
                                                    item.selected = index === selectedIndex;
                                                    return item;
                                                }))
                                            } else {
                                                setBillToContactNameItems((selectedTemplate?.bill_to_company?.contacts || []).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }

                                            window.setTimeout(() => {
                                                refBillToContactNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 10)

                                        }}
                                        setItems={setBillToContactNameItems}
                                        onDropdownClick={e => {
                                            window.setTimeout(() => {
                                                let selectedIndex = (selectedTemplate?.bill_to_company?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.bill_to_contact_name || '').trim().toLowerCase());

                                                if (selectedIndex > -1) {
                                                    setBillToContactNameItems((selectedTemplate?.bill_to_company?.contacts || []).map((item, index) => {
                                                        item.selected = index === selectedIndex;
                                                        return item;
                                                    }))
                                                } else {
                                                    setBillToContactNameItems((selectedTemplate?.bill_to_company?.contacts || []).map((item, index) => {
                                                        item.selected = index === 0;
                                                        return item;
                                                    }))
                                                }

                                                refBillToContactNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 100)
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                    bill_to_contact_id: item?.id,
                                                    bill_to_contact_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                        ? selectedTemplate?.bill_to_contact_phone
                                                        : (item?.primary_phone || '') === 'work'
                                                            ? item?.phone_work || ''
                                                            : (item?.primary_phone || '') === 'fax'
                                                                ? item?.phone_work_fax || ''
                                                                : (item?.primary_phone || '') === 'mobile'
                                                                    ? item?.phone_mobile || ''
                                                                    : (item?.primary_phone || '') === 'direct'
                                                                        ? item?.phone_direct || ''
                                                                        : (item?.primary_phone || '') === 'other'
                                                                            ? item?.phone_other || ''
                                                                            : '',
                                                    bill_to_contact_primary_phone: item.id === selectedTemplate?.bill_to_contact_id
                                                        ? selectedTemplate?.bill_to_contact_primary_phone
                                                        : item?.primary_phone || ''
                                                }
                                            })

                                            setBillToContactNameItems([]);
                                            refBillToContactNames.current.focus();
                                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                        }}
                                        labelType='contact_first_last'
                                    />

                                    <SelectPhoneBox
                                        className={'input-phone'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Contact Phone"
                                        popupId="template-bill-to-contact-phone"
                                        tabIndex={12 + props.tabTimes}
                                        boxStyle={{
                                            width: '10.25rem',
                                        }}
                                        refs={{
                                            refInput: refBillToContactPhones,
                                            refPopupItems: refBillToContactPhonePopupItems,
                                            refDropdown: refBillToContactPhoneDropdown,
                                        }}
                                        isDropdownEnabled={(selectedTemplate?.bill_to_company?.id || 0) > 0 && (selectedTemplate?.bill_to_contact_id || 0) > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={e => {
                                            if (showBillToContactPhones && billToContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                let item = billToContactPhoneItems[billToContactPhoneItems.findIndex(item => item.selected)];

                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_primary_phone: item.type,
                                                        bill_to_contact_phone: item.phone
                                                    }
                                                })

                                                setShowBillToContactPhones(false);
                                                refBillToContactPhones.current.inputElement.focus();
                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onTab={async e => {
                                            if (showBillToContactPhones && billToContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                let item = billToContactPhoneItems[billToContactPhoneItems.findIndex(item => item.selected)];

                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_primary_phone: item.type,
                                                        bill_to_contact_phone: item.phone
                                                    }
                                                })

                                                setShowBillToContactPhones(false);
                                                refBillToContactPhones.current.inputElement.focus();
                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onBlur={e => {
                                            let phone = billToContactPhoneItems.find(x => x.phone === selectedTemplate?.bill_to_contact_phone);

                                            if (phone) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_primary_phone: phone.type
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        bill_to_contact_primary_phone: '',
                                                        bill_to_contact_phone: ''
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _bill_to_contact_phone: ''
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _bill_to_contact_phone: ''
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.bill_to_contact_phone || ""}
                                        items={billToContactPhoneItems}
                                        getItems={() => {
                                            let selectedIndex = (billToContactPhoneItems || []).findIndex(x => x.phone === selectedTemplate?.bill_to_contact_phone);

                                            if (selectedIndex > 0) {
                                                setBillToContactPhoneItems(billToContactPhoneItems.map((item, index) => {
                                                    item.selected = index === selectedIndex;
                                                    return item;
                                                }))
                                            } else {
                                                setBillToContactPhoneItems(billToContactPhoneItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }

                                            window.setTimeout(() => {
                                                setShowBillToContactPhones(true);

                                                refBillToContactPhonePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 50)
                                        }}
                                        setItems={setBillToContactPhoneItems}
                                        onDropdownClick={e => {
                                            if (showBillToContactPhones) {
                                                setShowBillToContactPhones(false);
                                            } else {
                                                setBillToContactPhoneItems((billToContactPhoneItems || []).map((item, index) => {
                                                    item.selected = item.phone === selectedTemplate?.bill_to_contact_phone;
                                                    return item;
                                                }))

                                                window.setTimeout(() => {
                                                    setShowBillToContactPhones(true);

                                                    refBillToContactPhonePopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains("selected")) {
                                                            r.scrollIntoView({
                                                                behavior: "auto",
                                                                block: "center",
                                                                inline: "nearest",
                                                            });
                                                        }
                                                        return true;
                                                    });
                                                }, 100)
                                            }
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    bill_to_contact_phone: item.phone,
                                                    bill_to_contact_primary_phone: item.type
                                                }
                                            })

                                            setShowBillToContactPhones(false);
                                            refBillToContactPhones.current.inputElement.focus();
                                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                        }}
                                        isShowing={showBillToContactPhones}
                                        setIsShowing={setShowBillToContactPhones}
                                        primaryPhone={selectedTemplate?.bill_to_contact_primary_phone || ''}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-state'
                                        placeholder='Ext'
                                        tabIndex={13 + props.tabTimes}
                                        onKeyDown={(e) => {

                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _bill_to_contact_phone_ext: ''
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedTemplate?.bill_to_contact_id || 0) > 0 && (selectedTemplate?.bill_to_contact_primary_phone || '') === 'work'
                                                ? (selectedTemplate?.bill_to_company?.contacts || []).find(x => x.id === selectedTemplate?.bill_to_contact_id)?.phone_ext || ''
                                                : ''
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="template-column second">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Carrier</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={`mochi-button${((selectedTemplate?.id || 0) === 0 || (selectedTemplate?.carrier_id || 0) > 0) ? ' disabled' : ''}`} onClick={() => {
                                        searchCarrier();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={`mochi-button${((selectedTemplate?.id || 0) === 0 || (selectedTemplate?.carrier_id || 0) === 0) ? ' disabled' : ''}`} onClick={() => {
                                        let panel = {
                                            panelName: `${props.panelName}-carrier`,
                                            component: (
                                                <Carriers
                                                    pageName={"Carrier"}
                                                    title={"Carrier"}
                                                    panelName={props.panelName + '-carrier'}
                                                    tabTimes={3000 + props.tabTimes}
                                                    screenFocused={props.carrierScreenFocused}
                                                    componentId={moment().format("x")}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    origin={props.origin}
                                                    carrier_id={selectedTemplate?.carrier_id}
                                                    closingCallback={() => {
                                                        closePanel(`${props.panelName}-carrier`, props.origin);
                                                        refName.current.focus({ preventScroll: true });
                                                    }}
                                                />
                                            ),
                                        };

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Carrier Info</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    
                                    <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        setSelectedTemplate(prev => {
                                            return {
                                                ...prev,
                                                carrier_id: null,
                                                carrier: null,
                                                carrier_contact_id: null,
                                                carrier_contact_name: '',
                                                carrier_contact_phone: '',
                                                carrier_contact_primary_phone: 'work',
                                                equipment: null,
                                                equipment_id: null,
                                                carrier_driver_id: null,
                                                carrier_driver_name: '',
                                                carrier_driver_phone: '',
                                                carrier_driver_unit_number: '',
                                                carrier_driver_trailer_number: ''
                                            }
                                        })

                                        refCarrierCode.current.focus();
                                        setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-wrapper">
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: refCarrierCode
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-code'
                                        placeholder='Code'
                                        maxLength={8}
                                        tabIndex={52 + props.tabTimes}
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9) {
                                                getCarrierByCode();
                                            }
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier: {
                                                        ...(selectedTemplate?.carrier || {}),
                                                        code: e.target.value,
                                                        code_number: 0
                                                    }
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedTemplate?.carrier?.code_number || 0) === 0
                                                ? (selectedTemplate?.carrier?.code || '')
                                                : (selectedTemplate?.carrier?.code || '') + selectedTemplate.carrier.code_number
                                        }
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Name'
                                        tabIndex={53 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier: {
                                                        ...(selectedTemplate?.carrier || {}),
                                                        name: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.carrier?.name || '')}
                                    />
                                </div>
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Carrier Load - Starting City State - Destination City State'
                                        tabIndex={54 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_load: e.target.value
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedTemplate?.routing || []).length > 1
                                                ? `${selectedTemplate.routing[0]?.type === 'pickup'
                                                    ? ((selectedTemplate?.pickups || []).find(x => x?.id === selectedTemplate.routing[0]?.pickup_id)?.customer?.city || '') + ', ' + (selectedTemplate?.pickups || []).find(x => x?.id === selectedTemplate.routing[0]?.pickup_id)?.customer?.state || ''
                                                    : ((selectedTemplate?.deliveries || []).find(x => x?.id === selectedTemplate.routing[0]?.delivery_id)?.customer?.city || '') + ', ' + (selectedTemplate?.deliveries || []).find(x => x?.id === selectedTemplate.routing[0]?.delivery_id)?.customer?.state || ''
                                                } - ${selectedTemplate?.routing[selectedTemplate.routing.length - 1]?.type === 'pickup'
                                                    ? ((selectedTemplate?.pickups || []).find(x => x?.id === selectedTemplate?.routing[selectedTemplate.routing.length - 1]?.pickup_id)?.customer?.city || '') + ', ' + (selectedTemplate?.pickups || []).find(x => x?.id === selectedTemplate?.routing[selectedTemplate.routing.length - 1]?.pickup_id)?.customer?.state || ''
                                                    : ((selectedTemplate?.deliveries || []).find(x => x?.id === selectedTemplate?.routing[selectedTemplate.routing.length - 1]?.delivery_id)?.customer?.city || '') + ', ' + (selectedTemplate?.deliveries || []).find(x => x?.id === selectedTemplate?.routing[selectedTemplate.routing.length - 1]?.delivery_id)?.customer?.state || ''
                                                }`
                                                : ''
                                        }
                                    />
                                </div>
                                <div className="form-row">
                                    <SelectBox
                                        className={'template-carrier-contact-name'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Contact Name"
                                        popupId="template-carrier-contact-name"
                                        tabIndex={55 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1,
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        refs={{
                                            refInput: refCarrierContactNames,
                                            refPopupItems: refCarrierContactNamePopupItems,
                                            refDropdown: refCarrierContactNameDropdown,
                                        }}
                                        noStopPropagationOnEsc={true}
                                        readOnly={false}
                                        isDropdownEnabled={(selectedTemplate?.carrier?.id || 0) > 0 && (selectedTemplate?.carrier?.contacts || []).length > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={async e => {
                                            if (carrierContactNameItems.length > 0 && carrierContactNameItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierContactNameItems[carrierContactNameItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_id: item.id,
                                                        carrier_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                        carrier_contact_phone: item.id === selectedTemplate?.carrier_contact_id
                                                            ? selectedTemplate?.carrier_contact_phone
                                                            : (item?.primary_phone || '') === 'work'
                                                                ? item?.phone_work || ''
                                                                : (item?.primary_phone || '') === 'fax'
                                                                    ? item?.phone_work_fax || ''
                                                                    : (item?.primary_phone || '') === 'mobile'
                                                                        ? item?.phone_mobile || ''
                                                                        : (item?.primary_phone || '') === 'direct'
                                                                            ? item?.phone_direct || ''
                                                                            : (item?.primary_phone || '') === 'other'
                                                                                ? item?.phone_other || ''
                                                                                : '',
                                                        carrier_contact_primary_phone: item.id === selectedTemplate?.carrier_contact_id
                                                            ? selectedTemplate?.carrier_contact_primary_phone
                                                            : item?.primary_phone || ''
                                                    }
                                                })

                                                setCarrierContactNameItems([]);
                                                refCarrierContactNames.current.focus();
                                            }
                                        }}
                                        onTab={async e => {
                                            let item = carrierContactNameItems[carrierContactNameItems.findIndex(item => item.selected)];

                                            await setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_contact_id: item.id,
                                                    carrier_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                    carrier_contact_phone: item.id === selectedTemplate?.carrier_contact_id
                                                        ? selectedTemplate?.carrier_contact_phone
                                                        : (item?.primary_phone || '') === 'work'
                                                            ? item?.phone_work || ''
                                                            : (item?.primary_phone || '') === 'fax'
                                                                ? item?.phone_work_fax || ''
                                                                : (item?.primary_phone || '') === 'mobile'
                                                                    ? item?.phone_mobile || ''
                                                                    : (item?.primary_phone || '') === 'direct'
                                                                        ? item?.phone_direct || ''
                                                                        : (item?.primary_phone || '') === 'other'
                                                                            ? item?.phone_other || ''
                                                                            : '',
                                                    carrier_contact_primary_phone: item.id === selectedTemplate?.carrier_contact_id
                                                        ? selectedTemplate?.carrier_contact_primary_phone
                                                        : item?.primary_phone || ''
                                                }
                                            })

                                            setCarrierContactNameItems([]);
                                            refCarrierContactNames.current.focus();
                                        }}
                                        onBlur={e => {
                                            let contact = (selectedTemplate?.carrier?.contacts || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (selectedTemplate?.carrier_contact_name || '').trim().toLowerCase());

                                            if (contact) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_id: contact?.id
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_id: null,
                                                        carrier_contact_name: '',
                                                        carrier_contact_phone: '',
                                                        carrier_contact_primary_phone: ''
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_contact_id: null,
                                                    carrier_contact_name: e.target.value,
                                                    carrier_contact_phone: '',
                                                    carrier_contact_primary_phone: ''
                                                }
                                            })

                                            if (e.target.value.trim() === "") {
                                                setCarrierContactNameItems([]);
                                            } else {
                                                setCarrierContactNameItems((selectedTemplate?.carrier?.contacts || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((selectedTemplate?.carrier_contact_name || '').trim().toLowerCase())).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }
                                        }}
                                        onChange={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_contact_id: null,
                                                    carrier_contact_name: e.target.value,
                                                    carrier_contact_phone: '',
                                                    carrier_contact_primary_phone: ''
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.carrier_contact_name || ""}
                                        items={carrierContactNameItems}
                                        getItems={() => {
                                            let selectedIndex = (selectedTemplate?.carrier?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.carrier_contact_name || '').trim().toLowerCase());

                                            if (selectedIndex > -1) {
                                                setCarrierContactNameItems((selectedTemplate?.carrier?.contacts || []).map((item, index) => {
                                                    item.selected = index === selectedIndex;
                                                    return item;
                                                }))
                                            } else {
                                                setCarrierContactNameItems((selectedTemplate?.carrier?.contacts || []).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }

                                            window.setTimeout(() => {
                                                refCarrierContactNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 10)

                                        }}
                                        setItems={setCarrierContactNameItems}
                                        onDropdownClick={e => {
                                            window.setTimeout(() => {
                                                let selectedIndex = (selectedTemplate?.carrier?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.carrier_contact_name || '').trim().toLowerCase());

                                                if (selectedIndex > -1) {
                                                    setCarrierContactNameItems((selectedTemplate?.carrier?.contacts || []).map((item, index) => {
                                                        item.selected = index === selectedIndex;
                                                        return item;
                                                    }))
                                                } else {
                                                    setCarrierContactNameItems((selectedTemplate?.carrier?.contacts || []).map((item, index) => {
                                                        item.selected = index === 0;
                                                        return item;
                                                    }))
                                                }

                                                refCarrierContactNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 100)
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                    carrier_contact_id: item?.id,
                                                    carrier_contact_phone: item.id === selectedTemplate?.carrier_contact_id
                                                        ? selectedTemplate?.carrier_contact_phone
                                                        : (item?.primary_phone || '') === 'work'
                                                            ? item?.phone_work || ''
                                                            : (item?.primary_phone || '') === 'fax'
                                                                ? item?.phone_work_fax || ''
                                                                : (item?.primary_phone || '') === 'mobile'
                                                                    ? item?.phone_mobile || ''
                                                                    : (item?.primary_phone || '') === 'direct'
                                                                        ? item?.phone_direct || ''
                                                                        : (item?.primary_phone || '') === 'other'
                                                                            ? item?.phone_other || ''
                                                                            : '',
                                                    carrier_contact_primary_phone: item.id === selectedTemplate?.carrier_contact_id
                                                        ? selectedTemplate?.carrier_contact_primary_phone
                                                        : item?.primary_phone || ''
                                                }
                                            })

                                            setCarrierContactNameItems([]);
                                            refCarrierContactNames.current.focus();
                                        }}
                                        labelType='contact_first_last'
                                    />

                                    <SelectPhoneBox
                                        className={'input-phone'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Contact Phone"
                                        popupId="template-carrier-contact-phone"
                                        tabIndex={56 + props.tabTimes}
                                        boxStyle={{
                                            width: '9rem',
                                        }}
                                        refs={{
                                            refInput: refCarrierContactPhones,
                                            refPopupItems: refCarrierContactPhonePopupItems,
                                            refDropdown: refCarrierContactPhoneDropdown,
                                        }}
                                        isDropdownEnabled={(selectedTemplate?.carrier?.id || 0) > 0 && (selectedTemplate?.carrier_contact_id || 0) > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={async e => {
                                            if (showCarrierContactPhones && carrierContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_primary_phone: item.type,
                                                        carrier_contact_phone: item.phone
                                                    }
                                                })

                                                setShowCarrierContactPhones(false);
                                                refCarrierContactPhones.current.inputElement.focus();
                                            }
                                        }}
                                        onTab={async e => {
                                            if (showCarrierContactPhones && carrierContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_primary_phone: item.type,
                                                        carrier_contact_phone: item.phone
                                                    }
                                                })

                                                setShowCarrierContactPhones(false);
                                                refCarrierContactPhones.current.inputElement.focus();
                                            }
                                        }}
                                        onBlur={e => {
                                            let phone = carrierContactPhoneItems.find(x => x.phone === selectedTemplate?.carrier_contact_phone);

                                            if (phone) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_primary_phone: phone.type
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_contact_primary_phone: '',
                                                        carrier_contact_phone: ''
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_contact_phone: ''
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_contact_phone: ''
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.carrier_contact_phone || ""}
                                        items={carrierContactPhoneItems}
                                        getItems={() => {
                                            let selectedIndex = (carrierContactPhoneItems || []).findIndex(x => x.phone === selectedTemplate?.carrier_contact_phone);

                                            if (selectedIndex > 0) {
                                                setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                    item.selected = index === selectedIndex;
                                                    return item;
                                                }))
                                            } else {
                                                setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }

                                            window.setTimeout(() => {
                                                setShowCarrierContactPhones(true);

                                                refCarrierContactPhonePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 50)
                                        }}
                                        setItems={setCarrierContactPhoneItems}
                                        onDropdownClick={e => {
                                            if (showCarrierContactPhones) {
                                                setShowCarrierContactPhones(false);
                                            } else {
                                                setCarrierContactPhoneItems((carrierContactPhoneItems || []).map((item, index) => {
                                                    item.selected = item.phone === selectedTemplate?.carrier_contact_phone;
                                                    return item;
                                                }))

                                                window.setTimeout(() => {
                                                    setShowCarrierContactPhones(true);

                                                    refCarrierContactPhonePopupItems.current.map((r, i) => {
                                                        if (r && r.classList.contains("selected")) {
                                                            r.scrollIntoView({
                                                                behavior: "auto",
                                                                block: "center",
                                                                inline: "nearest",
                                                            });
                                                        }
                                                        return true;
                                                    });
                                                }, 100)
                                            }
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_contact_phone: item.phone,
                                                    carrier_contact_primary_phone: item.type
                                                }
                                            })

                                            setShowCarrierContactPhones(false);
                                            refCarrierContactPhones.current.inputElement.focus();
                                        }}
                                        isShowing={showCarrierContactPhones}
                                        setIsShowing={setShowCarrierContactPhones}
                                        primaryPhone={selectedTemplate?.carrier_contact_primary_phone || ''}
                                        phoneTypeStyles={{
                                            fontSize: '0.55rem'
                                        }}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-state'
                                        placeholder='Ext'
                                        tabIndex={57 + props.tabTimes}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_contact_phone_ext: ''
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedTemplate?.carrier_contact_id || 0) > 0 && (selectedTemplate?.carrier_contact_primary_phone || '') === 'work'
                                                ? (selectedTemplate?.carrier?.contacts || []).find(x => x.id === selectedTemplate?.carrier_contact_id)?.phone_ext || ''
                                                : ''
                                        }
                                    />

                                    <SelectBox
                                        className={'template-carrier-equipment'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Equipment"
                                        popupId="template-carrier-equipment"
                                        tabIndex={58 + props.tabTimes}
                                        boxStyle={{
                                            width: '8.75rem'
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        refs={{
                                            refInput: refCarrierEquipments,
                                            refPopupItems: refCarrierEquipmentPopupItems,
                                            refDropdown: refCarrierEquipmentDropdown,
                                        }}
                                        noStopPropagationOnEsc={true}
                                        readOnly={false}
                                        isDropdownEnabled={(selectedTemplate?.carrier?.id || 0) > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={async e => {
                                            if (carrierEquipmentItems.length > 0 && carrierEquipmentItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierEquipmentItems[carrierEquipmentItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        equipment_id: item.id,
                                                        equipment: item
                                                    }
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                                setCarrierEquipmentItems([]);
                                                refCarrierEquipments.current.focus();
                                            }
                                        }}
                                        onTab={async e => {
                                            if (carrierEquipmentItems.length > 0 && carrierEquipmentItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierEquipmentItems[carrierEquipmentItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        equipment_id: item.id,
                                                        equipment: item
                                                    }
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                                setCarrierEquipmentItems([]);
                                                refCarrierEquipments.current.focus();
                                            }
                                        }}
                                        onBlur={e => {
                                            if ((selectedTemplate?.equipment?.id || 0) === 0) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        equipment_id: null,
                                                        equipment: {},
                                                    };
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onInput={e => {
                                            let equipment = selectedTemplate?.equipment || {};
                                            equipment.id = null;
                                            equipment.name = e.target.value

                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    equipment: equipment,
                                                    equipment_id: equipment.id,
                                                }
                                            })

                                            if ((selectedTemplate?.carrier?.id || 0) > 0) {
                                                if (e.target.value.trim() === "") {
                                                    setCarrierEquipmentItems([]);
                                                } else {
                                                    axios.post(props.serverUrl + "/getEquipments", {
                                                        name: e.target.value.trim()
                                                    }).then((res) => {
                                                        if (res.data.result === "OK") {
                                                            if ((selectedTemplate?.equipment?.name || '').trim() === '') {
                                                                setCarrierEquipmentItems([]);
                                                            } else {
                                                                setCarrierEquipmentItems(
                                                                    res.data.equipments.map((item, index) => {
                                                                        item.selected = (selectedTemplate?.equipment?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedTemplate.equipment.id;
                                                                        return item;
                                                                    })
                                                                );
                                                            }

                                                        }
                                                    }).catch((e) => {
                                                        console.log("error getting equipments", e);
                                                    });
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            let equipment = selectedTemplate?.equipment || {};
                                            equipment.id = null;
                                            equipment.name = e.target.value

                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    equipment: equipment,
                                                    equipment_id: equipment.id,
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.equipment?.name || ""}
                                        items={carrierEquipmentItems}
                                        getItems={() => {
                                            axios.post(props.serverUrl + "/getEquipments").then((res) => {
                                                if (res.data.result === "OK") {
                                                    setCarrierEquipmentItems(
                                                        res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedTemplate?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedTemplate.equipment.id;
                                                            return item;
                                                        })
                                                    );

                                                    window.setTimeout(() => {
                                                        refCarrierEquipmentPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains("selected")) {
                                                                r.scrollIntoView({
                                                                    behavior: "auto",
                                                                    block: "center",
                                                                    inline: "nearest",
                                                                });
                                                            }
                                                            return true;
                                                        });
                                                    }, 50)
                                                }
                                            }).catch((e) => {
                                                console.log("error getting equipments", e);
                                            });
                                        }}
                                        setItems={setCarrierEquipmentItems}
                                        onDropdownClick={e => {
                                            axios.post(props.serverUrl + "/getEquipments").then((res) => {
                                                if (res.data.result === "OK") {
                                                    setCarrierEquipmentItems(
                                                        res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedTemplate?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedTemplate.equipment.id;
                                                            return item;
                                                        })
                                                    );

                                                    window.setTimeout(() => {
                                                        refCarrierEquipmentPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains("selected")) {
                                                                r.scrollIntoView({
                                                                    behavior: "auto",
                                                                    block: "center",
                                                                    inline: "nearest",
                                                                });
                                                            }
                                                            return true;
                                                        });
                                                    }, 50)
                                                }
                                            }).catch((e) => {
                                                console.log("error getting equipments", e);
                                            });
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    equipment_id: item.id,
                                                    equipment: item
                                                }
                                            })

                                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            setCarrierEquipmentItems([]);
                                            refCarrierEquipments.current.focus();
                                        }}
                                    />
                                </div>
                                <div className="form-row">
                                    <SelectBox
                                        className={'template-carrier-driver-name'}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder="Driver Name"
                                        popupId="template-carrier-driver-name"
                                        tabIndex={59 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1,
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        refs={{
                                            refInput: refCarrierDriverNames,
                                            refPopupItems: refCarrierDriverNamePopupItems,
                                            refDropdown: refCarrierDriverNameDropdown,
                                        }}
                                        noStopPropagationOnEsc={true}
                                        readOnly={false}
                                        isDropdownEnabled={(selectedTemplate?.carrier?.id || 0) > 0 && (selectedTemplate?.carrier?.drivers || []).length > 0}
                                        popupPosition="vertical below right"
                                        popupStyle={{
                                            left: '0%'
                                        }}
                                        onEnter={async e => {
                                            if (carrierDriverNameItems.length > 0 && carrierDriverNameItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierDriverNameItems[carrierDriverNameItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_driver_id: item.id,
                                                        carrier_driver_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                        carrier_driver_phone: (item?.contact_phone),
                                                        carrier_driver_unit_number: (item?.tractor?.number || ''),
                                                        carrier_driver_trailer_number: (item?.trailer?.number || '')
                                                    }
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                                setCarrierDriverNameItems([]);
                                                refCarrierDriverNames.current.focus();
                                            }
                                        }}
                                        onTab={async e => {
                                            if (carrierDriverNameItems.length > 0 && carrierDriverNameItems.findIndex(item => item.selected) > -1) {
                                                let item = carrierDriverNameItems[carrierDriverNameItems.findIndex(item => item.selected)];

                                                await setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_driver_id: item.id,
                                                        carrier_driver_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                        carrier_driver_phone: (item?.contact_phone),
                                                        carrier_driver_unit_number: (item?.tractor?.number || ''),
                                                        carrier_driver_trailer_number: (item?.trailer?.number || '')
                                                    }
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                                setCarrierDriverNameItems([]);
                                                refCarrierDriverNames.current.focus();
                                            }
                                        }}
                                        onBlur={e => {
                                            let driver = (selectedTemplate?.carrier?.drivers || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (selectedTemplate?.carrier_driver_name || '').trim().toLowerCase());

                                            if (driver) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_driver_id: driver?.id
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        carrier_driver_id: null,
                                                        carrier_driver_name: '',
                                                        carrier_driver_phone: '',
                                                        carrier_driver_unit_number: '',
                                                        carrier_driver_trailer_number: ''
                                                    }
                                                })

                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            }
                                        }}
                                        onInput={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_driver_id: null,
                                                    carrier_driver_name: e.target.value,
                                                    carrier_driver_phone: '',
                                                    carrier_driver_unit_number: '',
                                                    carrier_driver_trailer_number: ''
                                                }
                                            })

                                            if (e.target.value.trim() === "") {
                                                setCarrierDriverNameItems([]);
                                            } else {
                                                setCarrierDriverNameItems((selectedTemplate?.carrier?.drivers || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((selectedTemplate?.carrier_driver_name || '').trim().toLowerCase())).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }
                                        }}
                                        onChange={e => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_driver_id: null,
                                                    carrier_driver_name: e.target.value,
                                                    carrier_driver_phone: '',
                                                    carrier_driver_unit_number: '',
                                                    carrier_driver_trailer_number: ''
                                                }
                                            })
                                        }}
                                        value={selectedTemplate?.carrier_driver_name || ""}
                                        items={carrierDriverNameItems}
                                        getItems={() => {
                                            let selectedIndex = (selectedTemplate?.carrier?.drivers || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.carrier_driver_name || '').trim().toLowerCase());

                                            if (selectedIndex > -1) {
                                                setCarrierDriverNameItems((selectedTemplate?.carrier?.drivers || []).map((item, index) => {
                                                    item.selected = index === selectedIndex;
                                                    return item;
                                                }))
                                            } else {
                                                setCarrierDriverNameItems((selectedTemplate?.carrier?.drivers || []).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            }

                                            window.setTimeout(() => {
                                                refCarrierDriverNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 10)

                                        }}
                                        setItems={setCarrierDriverNameItems}
                                        onDropdownClick={e => {
                                            window.setTimeout(() => {
                                                let selectedIndex = (selectedTemplate?.carrier?.drivers || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedTemplate?.carrier_driver_name || '').trim().toLowerCase());

                                                if (selectedIndex > -1) {
                                                    setCarrierDriverNameItems((selectedTemplate?.carrier?.drivers || []).map((item, index) => {
                                                        item.selected = index === selectedIndex;
                                                        return item;
                                                    }))
                                                } else {
                                                    setCarrierDriverNameItems((selectedTemplate?.carrier?.drivers || []).map((item, index) => {
                                                        item.selected = index === 0;
                                                        return item;
                                                    }))
                                                }

                                                refCarrierDriverNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }, 100)
                                        }}
                                        onPopupClick={item => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    carrier_driver_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                                    carrier_driver_id: item?.id,
                                                    carrier_driver_phone: (item?.contact_phone || ''),
                                                    carrier_driver_unit_number: (item?.tractor?.number || ''),
                                                    carrier_driver_trailer_number: (item?.trailer?.number || '')
                                                }
                                            })

                                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                            setCarrierDriverNameItems([]);
                                            refCarrierDriverNames.current.focus();
                                        }}
                                        labelType='driver_first_last'
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Driver Phone'
                                        tabIndex={60 + props.tabTimes}
                                        boxStyle={{
                                            width: '9rem'
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_driver_phone: e.target.value
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.carrier_driver_phone || '')}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Unit Number'
                                        tabIndex={61 + props.tabTimes}
                                        boxStyle={{
                                            maxWidth: '5.6rem'
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_driver_unit_number: e.target.value
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.carrier_driver_unit_number || '')}
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Trailer Number'
                                        tabIndex={62 + props.tabTimes}
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9){
                                                e.preventDefault();
                                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                                refName.current.focus();
                                            }
                                        }}
                                        boxStyle={{
                                            maxWidth: '5.6rem'
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    _carrier_driver_trailer_number: e.target.value
                                                }
                                            })
                                        }}
                                        value={(selectedTemplate?.carrier_driver_trailer_number || '')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="template-column third">
                        <div className="row-buttons">
                            <div className={`input-toggle-container${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`}>
                                <input type="checkbox" id="cbox-template-hazmat-btn" onChange={(e) => {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            haz_mat: e.target.checked ? 1 : 0,
                                        }
                                    });

                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }}
                                    checked={(selectedTemplate?.haz_mat || 0) === 1}
                                />
                                <label htmlFor="cbox-template-hazmat-btn">
                                    <div className="label-text">HazMat</div>
                                    <div className="input-toggle-btn"></div>
                                </label>
                            </div>

                            <div className={`input-toggle-container${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`}>
                                <input type="checkbox" id="cbox-template-expedited-btn" onChange={(e) => {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            expedited: e.target.checked ? 1 : 0,
                                        }
                                    });

                                    setTimeout(() => { setIsSavingTemplate(true) }, 100);
                                }}
                                    checked={(selectedTemplate?.expedited || 0) === 1}
                                />
                                <label htmlFor="cbox-template-expedited-btn">
                                    <div className="label-text">Expedited</div>
                                    <div className="input-toggle-btn"></div>
                                </label>
                            </div>
                        </div>

                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Notes for Carrier on Rate Conf</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div
                                        className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`}
                                        onClick={() => {
                                            setSelectedNoteForCarrier({ id: 0 });
                                        }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Note</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="notes-for-carrier-container">
                                <div className="notes-for-carrier-wrapper">
                                    {(selectedTemplate?.notes_for_carrier || []).map((note, index) => {
                                        return (
                                            <div
                                                className="notes-for-carrier-item"
                                                key={index}
                                                onClick={() => setSelectedNoteForCarrier(note)}
                                            >
                                                {note.text}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="template-row third">
                    <div className="template-column first">
                        <div className="routing-pickups-container">
                            <div className="swiper-pickup-prev-btn">
                                <span className="fas fa-chevron-left"></span>
                            </div>

                            <Swiper
                                slidesPerView={5}
                                navigation={{
                                    prevEl: '.swiper-pickup-prev-btn',
                                    nextEl: '.swiper-pickup-next-btn'
                                }}
                            >
                                {
                                    [
                                        ...getPickupsFromRouting(),
                                        ...(selectedTemplate?.pickups || []).filter(x => (selectedTemplate?.routing || []).find(y => y.pickup_id === x.id) === undefined)
                                    ].map((item, index) => {
                                        if (!item) {
                                            return ''
                                        } else {
                                            let classes = classnames({
                                                "template-pickup": true,
                                                'active': true,
                                                selected: item?.selected,
                                                unsaved: (item?.customer_id || 0) === 0,
                                            });

                                            return (
                                                <SwiperSlide
                                                    className={classes}
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedShipper({
                                                            ...item.customer,
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
                                                            contact_id: item.contact_id,
                                                            contact_name: item.contact_name,
                                                            contact_phone: item.contact_phone,
                                                            contact_phone_ext: item.contact_phone_ext,
                                                            contact_primary_phone: item.contact_primary_phone,
                                                            type: item.type,
                                                        });

                                                        setSelectedTemplate(prev => {
                                                            return {
                                                                ...prev,
                                                                pickups: (selectedTemplate?.pickups || []).map((a, b) => {
                                                                    a.selected = index === b;
                                                                    return a;
                                                                })
                                                            }
                                                        })

                                                        refShipperCode.current.focus();
                                                    }}
                                                >
                                                    <div className="routing-item-label">
                                                        <span>Pick-Up {index + 1}</span>
                                                        <span>
                                                            {
                                                                (item?.customer?.id || 0) > 0
                                                                    ? (item?.customer?.code_number || 0) === 0
                                                                        ? (item?.customer?.code || '')
                                                                        : (item?.customer?.code || '') + item.customer.code_number
                                                                    : ''
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className='routing-remove-btn' title='Remove this pick-up'
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            if ((item?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/removeTemplatePickup', { id: item.id }).then(res => {
                                                                    if (res.data.result === 'OK') {

                                                                    } else {
                                                                        console.log(res.data?.result);
                                                                    }
                                                                }).catch(e => {
                                                                    console.log('error removing template pickup', e);
                                                                })
                                                            }

                                                            let selected_template = { ...selectedTemplate };
                                                            selected_template.pickups = (selected_template?.pickups || []).filter(x => x.id !== item.id);
                                                            selected_template.routing = (selected_template?.routing || []).filter(x => x.pickup_id !== item.id);

                                                            let saveRouting = false;

                                                            if ((item?.id || 0) > 0) {
                                                                saveRouting = true;
                                                            }

                                                            if (item.selected) {
                                                                if ((selected_template?.pickups || []).length > 0) {
                                                                    selected_template.pickups = selected_template.pickups.map((_item, b) => {
                                                                        if (b === 0) {
                                                                            _item.selected = true;

                                                                            setSelectedShipper({
                                                                                ..._item.customer,
                                                                                pickup_id: _item.id,
                                                                                pu_date1: _item.pu_date1,
                                                                                pu_date2: _item.pu_date2,
                                                                                pu_time1: _item.pu_time1,
                                                                                pu_time2: _item.pu_time2,
                                                                                bol_numbers: _item.bol_numbers,
                                                                                po_numbers: _item.po_numbers,
                                                                                ref_numbers: _item.ref_numbers,
                                                                                seal_number: _item.seal_number,
                                                                                special_instructions: _item.special_instructions,
                                                                                contact_id: _item.contact_id,
                                                                                contact_name: _item.contact_name,
                                                                                contact_phone: _item.contact_phone,
                                                                                contact_phone_ext: _item.contact_phone_ext,
                                                                                contact_primary_phone: _item.contact_primary_phone,
                                                                                type: _item.type,
                                                                            });
                                                                        } else {
                                                                            _item.selected = false;
                                                                        }

                                                                        return _item;
                                                                    })
                                                                } else {
                                                                    setSelectedShipper({});
                                                                }
                                                            }

                                                            if ((selected_template?.pickups || []).length > 0 && (selected_template?.deliveries || []).length > 0) {
                                                                if ((selected_template?.pickups || []).length === 1 && (selected_template?.deliveries || []).length === 1) {

                                                                    selected_template.routing = [
                                                                        {
                                                                            template_id: selected_template?.id,
                                                                            pickup_id: selected_template.pickups[0]?.id,
                                                                            delivery_id: null,
                                                                            type: 'pickup'
                                                                        },
                                                                        {
                                                                            template_id: selected_template?.id,
                                                                            pickup_id: null,
                                                                            delivery_id: selected_template.deliveries[0]?.id,
                                                                            type: 'delivery'
                                                                        }
                                                                    ]

                                                                }
                                                            } else {
                                                                selected_template.miles = 0;
                                                            }

                                                            setSelectedTemplate({ ...selected_template });
                                                            setTimeout(() => { setIsSavingRouting(saveRouting); }, 100);
                                                        }}>
                                                        <span className='fas fa-times'></span>
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        }
                                    })
                                }

                                {
                                    ((selectedTemplate?.id || 0) > 0 && ((selectedTemplate?.pickups || []).length === 0 || (selectedTemplate?.pickups || []).find(x => x?.id === 0) === undefined)) &&
                                    <SwiperSlide
                                        className="template-pickup adding"
                                        title="Add new pickup"
                                        onClick={() => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    pickups: [
                                                        ...((selectedTemplate?.pickups || []).map(x => {
                                                            x.selected = false;
                                                            return x;
                                                        })),
                                                        {
                                                            id: 0,
                                                            selected: true
                                                        }
                                                    ]
                                                }
                                            });

                                            setSelectedShipper({ pickup_id: 0 });
                                            refShipperCode.current.focus();
                                        }}
                                    >
                                        <div>
                                            <span className="fas fa-plus"></span>
                                        </div>
                                    </SwiperSlide>
                                }


                            </Swiper>

                            <div className="swiper-pickup-next-btn">
                                <span className="fas fa-chevron-right"></span>
                            </div>
                        </div>

                        <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`}
                            onClick={() => {
                                let panel = {
                                    panelName: `${props.panelName}-template-routing`,
                                    component: (
                                        <Routing
                                            panelName={`${props.panelName}-template-routing`}
                                            title="Routing"
                                            tabTimes={39000589 + props.tabTimes}
                                            origin={props.origin}
                                            selectedOrder={selectedTemplate}
                                            isAdmin={false}
                                            owner='template'
                                            callback={(data) => {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        routing: data?.routing,
                                                        miles: data?.miles,
                                                        waypoints: data?.waypoints
                                                    }
                                                })
                                            }}
                                            closingCallback={() => {
                                                closePanel(`${props.panelName}-template-routing`, props.origin);
                                                refName.current.focus({ preventScroll: true });
                                            }}
                                        />
                                    ),
                                };

                                openPanel(panel, props.origin);
                            }}
                            title={(selectedTemplate?.id || 0) === 0 ? 'You must save the template first!' : ''}
                        >
                            <div className="mochi-button-decorator mochi-button-decorator-left"> (</div>
                            <div className="mochi-button-base">Routing</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right"> )</div>
                        </div>

                        <div className="routing-deliveries-container">
                            <div className="swiper-delivery-prev-btn">
                                <span className="fas fa-chevron-left"></span>
                            </div>

                            <Swiper
                                slidesPerView={5}
                                navigation={{
                                    prevEl: '.swiper-delivery-prev-btn',
                                    nextEl: '.swiper-delivery-next-btn'
                                }}
                            >
                                {
                                    [
                                        ...getDeliveriesFromRouting(),
                                        ...((selectedTemplate?.deliveries || []).filter(x => (selectedTemplate?.routing || []).find(y => y.delivery_id === x.id) === undefined))
                                    ].map((item, index) => {
                                        if (!item) {
                                            return ''
                                        } else {
                                            let classes = classnames({
                                                "template-delivery": true,
                                                'active': true,
                                                selected: item?.selected,
                                                unsaved: (item?.customer_id || 0) === 0,
                                            });

                                            return (
                                                <SwiperSlide
                                                    className={classes}
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedConsignee({
                                                            ...item.customer,
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
                                                            contact_id: item.contact_id,
                                                            contact_name: item.contact_name,
                                                            contact_phone: item.contact_phone,
                                                            contact_phone_ext: item.contact_phone_ext,
                                                            contact_primary_phone: item.contact_primary_phone,
                                                            type: item.type,
                                                        });

                                                        setSelectedTemplate(prev => {
                                                            return {
                                                                ...prev,
                                                                deliveries: (selectedTemplate?.deliveries || []).map((a, b) => {
                                                                    a.selected = index === b;
                                                                    return a;
                                                                })
                                                            }
                                                        })

                                                        refConsigneeCode.current.focus();
                                                    }}
                                                >
                                                    <div className="routing-item-label">
                                                        <span>Delivery {index + 1}</span>
                                                        <span>
                                                            {
                                                                (item?.customer?.id || 0) > 0
                                                                    ? (item?.customer?.code_number || 0) === 0
                                                                        ? (item?.customer?.code || '')
                                                                        : (item?.customer?.code || '') + item.customer.code_number
                                                                    : ''
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className='routing-remove-btn' title='Remove this delivery'
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            if ((item?.id || 0) > 0) {
                                                                axios.post(props.serverUrl + '/removeTemplateDelivery', { id: item.id }).then(res => {
                                                                    if (res.data.result === 'OK') {

                                                                    } else {
                                                                        console.log(res.data?.result);
                                                                    }
                                                                }).catch(e => {
                                                                    console.log('error removing template delivery', e);
                                                                })
                                                            }

                                                            let selected_template = { ...selectedTemplate };

                                                            selected_template.deliveries = (selected_template?.deliveries || []).filter(x => x.id !== item.id);
                                                            selected_template.routing = (selected_template?.routing || []).filter(x => x.delivery_id !== item.id);

                                                            let saveRouting = false;

                                                            if ((item?.id || 0) > 0) {
                                                                saveRouting = true;
                                                            }

                                                            if (item.selected) {
                                                                if ((selected_template?.deliveries || []).length > 0) {
                                                                    selected_template.deliveries = selected_template.deliveries.map((_item, b) => {
                                                                        if (b === 0) {
                                                                            _item.selected = true;

                                                                            setSelectedConsignee({
                                                                                ..._item.customer,
                                                                                delivery_id: _item.id,
                                                                                delivery_date1: _item.delivery_date1,
                                                                                delivery_date2: _item.delivery_date2,
                                                                                delivery_time1: _item.delivery_time1,
                                                                                delivery_time2: _item.delivery_time2,
                                                                                bol_numbers: _item.bol_numbers,
                                                                                po_numbers: _item.po_numbers,
                                                                                ref_numbers: _item.ref_numbers,
                                                                                seal_number: _item.seal_number,
                                                                                special_instructions: _item.special_instructions,
                                                                                contact_id: _item.contact_id,
                                                                                contact_name: _item.contact_name,
                                                                                contact_phone: _item.contact_phone,
                                                                                contact_phone_ext: _item.contact_phone_ext,
                                                                                contact_primary_phone: _item.contact_primary_phone,
                                                                                type: _item.type,
                                                                            });
                                                                        } else {
                                                                            _item.selected = false;
                                                                        }
                                                                        return _item;
                                                                    })
                                                                } else {
                                                                    setSelectedConsignee({});
                                                                }
                                                            }

                                                            if ((selected_template?.pickups || []).length > 0 && (selected_template?.deliveries || []).length > 0) {
                                                                if ((selected_template?.pickups || []).length === 1 && (selected_template?.deliveries || []).length === 1) {

                                                                    selected_template.routing = [
                                                                        {
                                                                            template_id: selected_template?.id,
                                                                            pickup_id: selected_template.pickups[0]?.id,
                                                                            delivery_id: null,
                                                                            type: 'pickup'
                                                                        },
                                                                        {
                                                                            template_id: selected_template?.id,
                                                                            pickup_id: null,
                                                                            delivery_id: selected_template.deliveries[0]?.id,
                                                                            type: 'delivery'
                                                                        }
                                                                    ]
                                                                } else {

                                                                }
                                                            } else {
                                                                selected_template.miles = 0;
                                                            }

                                                            setSelectedTemplate({ ...selected_template });
                                                            setTimeout(() => { setIsSavingRouting(saveRouting); }, 100);
                                                        }}>
                                                        <span className='fas fa-times'></span>
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        }
                                    })
                                }

                                {
                                    ((selectedTemplate?.id || 0) > 0 && ((selectedTemplate?.deliveries || []).length === 0 || (selectedTemplate?.deliveries || []).find(x => x?.id === 0) === undefined)) &&
                                    <SwiperSlide
                                        className="template-delivery adding"
                                        title="Add new delivery"
                                        onClick={() => {
                                            setSelectedTemplate(prev => {
                                                return {
                                                    ...prev,
                                                    deliveries: [
                                                        ...((selectedTemplate?.deliveries || []).map(x => {
                                                            x.selected = false;
                                                            return x;
                                                        })),
                                                        {
                                                            id: 0,
                                                            selected: true
                                                        }
                                                    ]
                                                }
                                            });

                                            setSelectedConsignee({ delivery_id: 0 });

                                            refConsigneeCode.current.focus();
                                        }}
                                    >
                                        <div>
                                            <span className="fas fa-plus"></span>
                                        </div>
                                    </SwiperSlide>
                                }


                            </Swiper>

                            <div className="swiper-delivery-next-btn">
                                <span className="fas fa-chevron-right"></span>
                            </div>
                        </div>
                    </div>
                    <div className="template-column other">
                        <div className="column-wrapper">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{
                                    fontSize: "0.7rem",
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                    marginBottom: 1,
                                }}>Miles</div>

                                <div style={{
                                    fontSize: "0.7rem",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexGrow: 1,
                                    pointerEvents: ((selectedTemplate?.miles || 0) / 1609.34) > 0 ? 'all' : 'none',
                                    cursor: 'pointer'
                                }}>
                                    {
                                        isGettingMiles
                                            ? (<div className="loading-container" style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "transparent"
                                            }}>
                                                <Loader
                                                    type="ThreeDots"
                                                    color="#333738"
                                                    height={20}
                                                    width={20}
                                                    visible={isGettingMiles}
                                                />
                                            </div>)
                                            : (((selectedTemplate?.miles || 0) / 1609.34).toFixed(0))
                                    }
                                </div>
                            </div>

                            <div style={{
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                color: "rgba(0,0,0,0.5)",
                            }}>|</div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{
                                    fontSize: "0.7rem",
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    marginBottom: 1,
                                }}>Customer Charges</div>

                                <div style={{
                                    fontSize: "0.7rem",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexGrow: 1
                                }}>
                                    <NumberFormat className={classnames({
                                        "negative-number": Number(((selectedTemplate?.order_customer_ratings || []).reduce((a, b) => {
                                            return {
                                                total_charges:
                                                    Number(a.total_charges) +
                                                    Number(b.total_charges),
                                            };
                                        }, { total_charges: "" })?.total_charges || "").toString().replace(",", "")) < 0
                                    })}
                                        style={{ fontSize: "0.7rem", textAlign: "center" }}
                                        value={new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, }).format(Number(((selectedTemplate?.order_customer_ratings || []).reduce((a, b) => {
                                            return {
                                                total_charges:
                                                    Number(a.total_charges) + Number(b.total_charges),
                                            };
                                        }, { total_charges: "" })?.total_charges || "").toString().replace(",", "")))}
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={"$ "}
                                        type="text"
                                        onValueChange={(values) => { }}
                                        displayType={"text"}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "rgba(0,0,0,0.5)",
                                }}
                            >
                                |
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        textDecoration: "underline",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        marginBottom: 1,
                                    }}
                                >
                                    Carrier Costs
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexGrow: 1,
                                    }}
                                >
                                    <NumberFormat
                                        className={classnames({
                                            "negative-number":
                                                Number(
                                                    (
                                                        (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(a.total_charges) +
                                                                        Number(b.total_charges),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) < 0,
                                        })}
                                        style={{ fontSize: "0.7rem", textAlign: "center" }}
                                        value={new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(
                                            Number(
                                                (
                                                    (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                        (a, b) => {
                                                            return {
                                                                total_charges:
                                                                    Number(a.total_charges) + Number(b.total_charges),
                                                            };
                                                        },
                                                        { total_charges: "" }
                                                    )?.total_charges || ""
                                                )
                                                    .toString()
                                                    .replace(",", "")
                                            )
                                        )}
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={"$ "}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={"text"}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "rgba(0,0,0,0.5)",
                                }}
                            >
                                |
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        textDecoration: "underline",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        marginBottom: 1,
                                    }}
                                >
                                    Profit
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexGrow: 1,
                                    }}
                                >
                                    <NumberFormat
                                        className={classnames({
                                            "negative-number":
                                                Number(
                                                    (
                                                        (selectedTemplate?.order_customer_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) -
                                                Number(
                                                    (
                                                        (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) <
                                                0,
                                        })}
                                        style={{ fontSize: "0.7rem", textAlign: "center" }}
                                        value={new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(
                                            Number(
                                                (
                                                    (selectedTemplate?.order_customer_ratings || []).reduce(
                                                        (a, b) => {
                                                            return {
                                                                total_charges:
                                                                    Number(
                                                                        (a.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ) +
                                                                    Number(
                                                                        (b.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ),
                                                            };
                                                        },
                                                        { total_charges: "" }
                                                    )?.total_charges || ""
                                                )
                                                    .toString()
                                                    .replace(",", "")
                                            ) -
                                            Number(
                                                (
                                                    (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                        (a, b) => {
                                                            return {
                                                                total_charges:
                                                                    Number(
                                                                        (a.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ) +
                                                                    Number(
                                                                        (b.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ),
                                                            };
                                                        },
                                                        { total_charges: "" }
                                                    )?.total_charges || ""
                                                )
                                                    .toString()
                                                    .replace(",", "")
                                            )
                                        )}
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={"$ "}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={"text"}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "rgba(0,0,0,0.5)",
                                }}
                            >
                                |
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        textDecoration: "underline",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        marginBottom: 1,
                                    }}
                                >
                                    Percentage
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexGrow: 1,
                                    }}
                                >
                                    <NumberFormat
                                        className={classnames({
                                            "negative-number":
                                                (Number(
                                                    (
                                                        (selectedTemplate?.order_customer_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) > 0 ||
                                                    Number(
                                                        (
                                                            (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    ) > 0
                                                    ? ((Number(
                                                        (
                                                            (
                                                                selectedTemplate?.order_customer_ratings || []
                                                            ).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    ) -
                                                        Number(
                                                            (
                                                                (
                                                                    selectedTemplate?.order_carrier_ratings || []
                                                                ).reduce(
                                                                    (a, b) => {
                                                                        return {
                                                                            total_charges:
                                                                                Number(
                                                                                    (a.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ) +
                                                                                Number(
                                                                                    (b.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ),
                                                                        };
                                                                    },
                                                                    { total_charges: "" }
                                                                )?.total_charges || ""
                                                            )
                                                                .toString()
                                                                .replace(",", "")
                                                        )) *
                                                        100) /
                                                    (Number(
                                                        (
                                                            (
                                                                selectedTemplate?.order_customer_ratings || []
                                                            ).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    ) > 0
                                                        ? Number(
                                                            (
                                                                (
                                                                    selectedTemplate?.order_customer_ratings || []
                                                                ).reduce(
                                                                    (a, b) => {
                                                                        return {
                                                                            total_charges:
                                                                                Number(
                                                                                    (a.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ) +
                                                                                Number(
                                                                                    (b.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ),
                                                                        };
                                                                    },
                                                                    { total_charges: "" }
                                                                )?.total_charges || ""
                                                            )
                                                                .toString()
                                                                .replace(",", "")
                                                        )
                                                        : Number(
                                                            (
                                                                (
                                                                    selectedTemplate?.order_carrier_ratings || []
                                                                ).reduce(
                                                                    (a, b) => {
                                                                        return {
                                                                            total_charges:
                                                                                Number(
                                                                                    (a.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ) +
                                                                                Number(
                                                                                    (b.total_charges || "")
                                                                                        .toString()
                                                                                        .replace(",", "")
                                                                                ),
                                                                        };
                                                                    },
                                                                    { total_charges: "" }
                                                                )?.total_charges || ""
                                                            )
                                                                .toString()
                                                                .replace(",", "")
                                                        ))
                                                    : 0) < 0,
                                        })}
                                        style={{ fontSize: "0.7rem", textAlign: "center" }}
                                        value={
                                            Number(
                                                (
                                                    (selectedTemplate?.order_customer_ratings || []).reduce(
                                                        (a, b) => {
                                                            return {
                                                                total_charges:
                                                                    Number(
                                                                        (a.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ) +
                                                                    Number(
                                                                        (b.total_charges || "")
                                                                            .toString()
                                                                            .replace(",", "")
                                                                    ),
                                                            };
                                                        },
                                                        { total_charges: "" }
                                                    )?.total_charges || ""
                                                )
                                                    .toString()
                                                    .replace(",", "")
                                            ) > 0 ||
                                                Number(
                                                    (
                                                        (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) > 0
                                                ? ((Number(
                                                    (
                                                        (selectedTemplate?.order_customer_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) -
                                                    Number(
                                                        (
                                                            (selectedTemplate?.order_carrier_ratings || []).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    )) *
                                                    100) /
                                                (Number(
                                                    (
                                                        (selectedTemplate?.order_customer_ratings || []).reduce(
                                                            (a, b) => {
                                                                return {
                                                                    total_charges:
                                                                        Number(
                                                                            (a.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ) +
                                                                        Number(
                                                                            (b.total_charges || "")
                                                                                .toString()
                                                                                .replace(",", "")
                                                                        ),
                                                                };
                                                            },
                                                            { total_charges: "" }
                                                        )?.total_charges || ""
                                                    )
                                                        .toString()
                                                        .replace(",", "")
                                                ) > 0
                                                    ? Number(
                                                        (
                                                            (
                                                                selectedTemplate?.order_customer_ratings || []
                                                            ).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    )
                                                    : Number(
                                                        (
                                                            (
                                                                selectedTemplate?.order_carrier_ratings || []
                                                            ).reduce(
                                                                (a, b) => {
                                                                    return {
                                                                        total_charges:
                                                                            Number(
                                                                                (a.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ) +
                                                                            Number(
                                                                                (b.total_charges || "")
                                                                                    .toString()
                                                                                    .replace(",", "")
                                                                            ),
                                                                    };
                                                                },
                                                                { total_charges: "" }
                                                            )?.total_charges || ""
                                                        )
                                                            .toString()
                                                            .replace(",", "")
                                                    ))
                                                : 0
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={""}
                                        suffix={"%"}
                                        type="text"
                                        displayType={"text"}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="template-row fourth">
                    <div className="template-column first">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Shipper</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={`mochi-button${((selectedTemplate?.id || 0) === 0 || (selectedShipper?.id || 0) > 0) ? ' disabled' : ''}`} onClick={() => {
                                        searchShipper();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={`mochi-button${(selectedShipper?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        let panel = {
                                            panelName: `${props.panelName}-customer`,
                                            component: (
                                                <Customers
                                                    pageName={"Customer"}
                                                    title={"Shipper Company"}
                                                    panelName={`${props.panelName}-customer`}
                                                    tabTimes={20009547 + props.tabTimes}
                                                    componentId={moment().format("x")}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    origin={props.origin}
                                                    customer_id={selectedShipper?.id}
                                                    closingCallback={() => {
                                                        closePanel(`${props.panelName}-customer`, props.origin);
                                                        refName.current.focus({ preventScroll: true });
                                                    }}
                                                />
                                            ),
                                        };

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Company Info</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    {
                                        isShowingShipperSecondPage &&                                        
                                        <div className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                            setIsShowingShipperSecondPage(!isShowingShipperSecondPage);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">1st Page</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        (!isShowingShipperSecondPage) &&
                                        <div className={`mochi-button${(selectedShipper?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                            setIsShowingShipperSecondPage(!isShowingShipperSecondPage);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">2nd Page</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-wrapper">
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: refShipperCode
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-code'
                                        placeholder='Code'
                                        maxLength={8}
                                        tabIndex={14 + props.tabTimes}
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9) {
                                                getShipperCustomerByCode();
                                            }
                                        }}
                                        onChange={(e) => {
                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                            if (current) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = {
                                                                    ...(item?.customer || {}),
                                                                    code: e.target.value,
                                                                    code_number: 0
                                                                }
                                                            }

                                                            return item;
                                                        })
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: [
                                                            ...(selectedTemplate?.pickups || []),
                                                            {
                                                                id: 0,
                                                                selected: true,
                                                                customer: {
                                                                    code: e.target.value,
                                                                    code_number: 0
                                                                }
                                                            }
                                                        ]
                                                    }
                                                })
                                            }

                                            setSelectedShipper(prev => {
                                                return {
                                                    ...prev,
                                                    code: e.target.value,
                                                    code_number: 0
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedShipper?.code_number || 0) === 0
                                                ? (selectedShipper?.code || '')
                                                : (selectedShipper?.code || '') + selectedShipper?.code_number
                                        }
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Name'
                                        tabIndex={15 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                            if (current) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = {
                                                                    ...(item?.customer || {}),
                                                                    name: e.target.value
                                                                }
                                                            }

                                                            return item;
                                                        })
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        pickups: [
                                                            ...(selectedTemplate?.pickups || []),
                                                            {
                                                                id: 0,
                                                                selected: true,
                                                                customer: {
                                                                    name: e.target.value
                                                                }
                                                            }
                                                        ]
                                                    }
                                                })
                                            }

                                            setSelectedShipper(prev => {
                                                return {
                                                    ...prev,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedShipper?.name || ''}
                                    />
                                </div>
                                <div className="form-row">
                                    {
                                        shipperFirstPageTransition((style, item) => item && (
                                            <animated.div className='form-page first-page shipper-first-page' style={{ ...style }}>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='Address 1'
                                                        tabIndex={16 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    address1: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: [
                                                                            ...(selectedTemplate?.pickups || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    address1: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    address1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.address1 || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='Address 2'
                                                        tabIndex={17 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    address2: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: [
                                                                            ...(selectedTemplate?.pickups || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    address2: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    address2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.address2 || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='City'
                                                        tabIndex={18 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    city: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: [
                                                                            ...(selectedTemplate?.pickups || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    city: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    city: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.city || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-state'
                                                        placeholder='State'
                                                        tabIndex={19 + props.tabTimes}
                                                        maxLength={2}
                                                        inputStyle={{
                                                            textDecoration: 'uppercase'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    state: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: [
                                                                            ...(selectedTemplate?.pickups || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    state: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    state: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.state || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-zip-code'
                                                        placeholder='Postal Code'
                                                        tabIndex={20 + props.tabTimes}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.pickups || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    zip: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: [
                                                                            ...(selectedTemplate?.pickups || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    zip: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    zip: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.zip || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <SelectBox
                                                        className={'template-shipper-contact-name'}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder="Contact Name"
                                                        popupId="template-shipper-contact-name"
                                                        tabIndex={21 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        refs={{
                                                            refInput: refShipperContactNames,
                                                            refPopupItems: refShipperContactNamePopupItems,
                                                            refDropdown: refShipperContactNameDropdown,
                                                        }}
                                                        noStopPropagationOnEsc={true}
                                                        readOnly={false}
                                                        isDropdownEnabled={(selectedShipper?.contacts || []).length > 0}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onEnter={async e => {
                                                            if (shipperContactNameItems.length > 0 && shipperContactNameItems.findIndex(item => item.selected) > -1) {
                                                                let item = shipperContactNameItems[shipperContactNameItems.findIndex(item => item.selected)];

                                                                let contact_id = item.id;
                                                                let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                                let contact_phone = item.id === selectedShipper?.contact_id
                                                                    ? selectedShipper?.contact_phone
                                                                    : (item?.primary_phone || '') === 'work'
                                                                        ? item?.phone_work || ''
                                                                        : (item?.primary_phone || '') === 'fax'
                                                                            ? item?.phone_work_fax || ''
                                                                            : (item?.primary_phone || '') === 'mobile'
                                                                                ? item?.phone_mobile || ''
                                                                                : (item?.primary_phone || '') === 'direct'
                                                                                    ? item?.phone_direct || ''
                                                                                    : (item?.primary_phone || '') === 'other'
                                                                                        ? item?.phone_other || ''
                                                                                        : '';
                                                                let contact_primary_phone = item.id === selectedShipper?.contact_id
                                                                    ? selectedShipper?.contact_primary_phone
                                                                    : item?.primary_phone || '';
                                                                let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                    ? (item?.phone_ext || '')
                                                                    : '';

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = contact_id;
                                                                                x.contact_name = contact_name;
                                                                                x.contact_phone = contact_phone;
                                                                                x.contact_primary_phone = contact_primary_phone;
                                                                                x.contact_phone_ext = contact_phone_ext;
                                                                            }

                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: contact_id,
                                                                        contact_name: contact_name,
                                                                        contact_phone: contact_phone,
                                                                        contact_primary_phone: contact_primary_phone,
                                                                        contact_phone_ext: contact_phone_ext
                                                                    }
                                                                })

                                                                setShipperContactNameItems([]);
                                                                refShipperContactNames.current.focus();
                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onTab={async e => {
                                                            if (shipperContactNameItems.length > 0 && shipperContactNameItems.findIndex(item => item.selected) > -1) {
                                                                let item = shipperContactNameItems[shipperContactNameItems.findIndex(item => item.selected)];

                                                                let contact_id = item.id;
                                                                let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                                let contact_phone = item.id === selectedShipper?.contact_id
                                                                    ? selectedShipper?.contact_phone
                                                                    : (item?.primary_phone || '') === 'work'
                                                                        ? item?.phone_work || ''
                                                                        : (item?.primary_phone || '') === 'fax'
                                                                            ? item?.phone_work_fax || ''
                                                                            : (item?.primary_phone || '') === 'mobile'
                                                                                ? item?.phone_mobile || ''
                                                                                : (item?.primary_phone || '') === 'direct'
                                                                                    ? item?.phone_direct || ''
                                                                                    : (item?.primary_phone || '') === 'other'
                                                                                        ? item?.phone_other || ''
                                                                                        : '';
                                                                let contact_primary_phone = item.id === selectedShipper?.contact_id
                                                                    ? selectedShipper?.contact_primary_phone
                                                                    : item?.primary_phone || '';
                                                                let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                    ? (item?.phone_ext || '')
                                                                    : '';

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = contact_id;
                                                                                x.contact_name = contact_name;
                                                                                x.contact_phone = contact_phone;
                                                                                x.contact_primary_phone = contact_primary_phone;
                                                                                x.contact_phone_ext = contact_phone_ext;
                                                                            }

                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: contact_id,
                                                                        contact_name: contact_name,
                                                                        contact_phone: contact_phone,
                                                                        contact_primary_phone: contact_primary_phone,
                                                                        contact_phone_ext: contact_phone_ext
                                                                    }
                                                                })

                                                                setShipperContactNameItems([]);
                                                                refShipperContactNames.current.focus();
                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onBlur={e => {
                                                            let item = (selectedShipper?.contacts || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (selectedShipper?.contact_name || '').trim().toLowerCase());

                                                            if (item) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = item?.id
                                                                            }
                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: item.id
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = null;
                                                                                x.contact_name = '';
                                                                                x.contact_phone = '';
                                                                                x.contact_primary_phone = 'work';
                                                                            }
                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: null,
                                                                        contact_name: '',
                                                                        contact_phone: '',
                                                                        contact_primary_phone: 'work'
                                                                    }
                                                                })

                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onInput={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_id = null;
                                                                            item.contact_name = e.target.value;
                                                                            item.contact_phone = '';
                                                                            item.contact_primary_phone = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: null,
                                                                    contact_name: e.target.value,
                                                                    contact_phone: '',
                                                                    contact_primary_phone: ''
                                                                }
                                                            })

                                                            if (e.target.value.trim() === "") {
                                                                setShipperContactNameItems([]);
                                                            } else {
                                                                setShipperContactNameItems((selectedShipper?.contacts || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((selectedShipper?.contact_name || '').trim().toLowerCase())).map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }
                                                        }}
                                                        onChange={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_id = null;
                                                                            item.contact_name = e.target.value;
                                                                            item.contact_phone = '';
                                                                            item.contact_primary_phone = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: null,
                                                                    contact_name: e.target.value,
                                                                    contact_phone: '',
                                                                    contact_primary_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.contact_name || ""}
                                                        items={shipperContactNameItems}
                                                        getItems={() => {
                                                            let selectedIndex = (selectedShipper?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedShipper?.contact_name || '').trim().toLowerCase());

                                                            if (selectedIndex > -1) {
                                                                setShipperContactNameItems((selectedShipper?.contacts || []).map((item, index) => {
                                                                    item.selected = index === selectedIndex;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setShipperContactNameItems((selectedShipper?.contacts || []).map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }

                                                            window.setTimeout(() => {
                                                                refShipperContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 10)

                                                        }}
                                                        setItems={setShipperContactNameItems}
                                                        onDropdownClick={e => {
                                                            window.setTimeout(() => {
                                                                let selectedIndex = (selectedShipper?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedShipper?.contact_name || '').trim().toLowerCase());

                                                                if (selectedIndex > -1) {
                                                                    setShipperContactNameItems((selectedShipper?.contacts || []).map((item, index) => {
                                                                        item.selected = index === selectedIndex;
                                                                        return item;
                                                                    }))
                                                                } else {
                                                                    setShipperContactNameItems((selectedShipper?.contacts || []).map((item, index) => {
                                                                        item.selected = index === 0;
                                                                        return item;
                                                                    }))
                                                                }

                                                                refShipperContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 100)
                                                        }}
                                                        onPopupClick={item => {
                                                            let contact_id = item.id;
                                                            let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                            let contact_phone = item.id === selectedShipper?.contact_id
                                                                ? selectedShipper?.contact_phone
                                                                : (item?.primary_phone || '') === 'work'
                                                                    ? item?.phone_work || ''
                                                                    : (item?.primary_phone || '') === 'fax'
                                                                        ? item?.phone_work_fax || ''
                                                                        : (item?.primary_phone || '') === 'mobile'
                                                                            ? item?.phone_mobile || ''
                                                                            : (item?.primary_phone || '') === 'direct'
                                                                                ? item?.phone_direct || ''
                                                                                : (item?.primary_phone || '') === 'other'
                                                                                    ? item?.phone_other || ''
                                                                                    : '';
                                                            let contact_primary_phone = item.id === selectedShipper?.contact_id
                                                                ? selectedShipper?.contact_primary_phone
                                                                : item?.primary_phone || '';
                                                            let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                ? (item?.phone_ext || '')
                                                                : '';

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(x => {
                                                                        if (x.selected) {
                                                                            x.contact_id = contact_id;
                                                                            x.contact_name = contact_name;
                                                                            x.contact_phone = contact_phone;
                                                                            x.contact_primary_phone = contact_primary_phone;
                                                                            x.contact_phone_ext = contact_phone_ext;
                                                                        }

                                                                        return x;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: contact_id,
                                                                    contact_name: contact_name,
                                                                    contact_phone: contact_phone,
                                                                    contact_primary_phone: contact_primary_phone,
                                                                    contact_phone_ext: contact_phone_ext
                                                                }
                                                            })

                                                            setShipperContactNameItems([]);
                                                            refShipperContactNames.current.focus();
                                                            setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                        }}
                                                        labelType='contact_first_last'
                                                    />

                                                    <SelectPhoneBox
                                                        className={'input-phone'}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder="Contact Phone"
                                                        popupId="template-shipper-contact-phone"
                                                        tabIndex={22 + props.tabTimes}
                                                        boxStyle={{
                                                            width: '10.25rem',
                                                        }}
                                                        refs={{
                                                            refInput: refShipperContactPhones,
                                                            refPopupItems: refShipperContactPhonePopupItems,
                                                            refDropdown: refShipperContactPhoneDropdown,
                                                        }}
                                                        isDropdownEnabled={(selectedShipper?.id || 0) > 0 && (selectedShipper?.contact_id || 0) > 0}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onEnter={e => {
                                                            if (showShipperContactPhones && shipperContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                let item = shipperContactPhoneItems[shipperContactPhoneItems.findIndex(item => item.selected)];

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = item.type;
                                                                                item.contact_phone = item.phone;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: item.type,
                                                                        contact_phone: item.phone
                                                                    }
                                                                })

                                                                setShowShipperContactPhones(false);
                                                                refShipperContactPhones.current.inputElement.focus();
                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onTab={async e => {
                                                            if (showShipperContactPhones && shipperContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                let item = shipperContactPhoneItems[shipperContactPhoneItems.findIndex(item => item.selected)];


                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = item.type;
                                                                                item.contact_phone = item.phone;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: item.type,
                                                                        contact_phone: item.phone
                                                                    }
                                                                })

                                                                setShowShipperContactPhones(false);
                                                                refShipperContactPhones.current.inputElement.focus();
                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onBlur={e => {
                                                            let phone = shipperContactPhoneItems.find(x => x.phone === selectedShipper?.contact_phone);
                                                            let currentPrimary = selectedShipper?.contact_primary_phone;

                                                            if (phone) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = phone.type;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: phone.type
                                                                    }
                                                                })

                                                                if (phone.type !== currentPrimary) {
                                                                    setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                                }
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = '';
                                                                                item.contact_phone = '';
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedShipper(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: '',
                                                                        contact_phone: ''
                                                                    }
                                                                })

                                                                setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onInput={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone = ''
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        onChange={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone = ''
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.contact_phone || ""}
                                                        items={shipperContactPhoneItems}
                                                        getItems={() => {
                                                            let selectedIndex = (shipperContactPhoneItems || []).findIndex(x => x.phone === selectedShipper?.contact_phone);

                                                            if (selectedIndex > 0) {
                                                                setShipperContactPhoneItems(shipperContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === selectedIndex;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setShipperContactPhoneItems(shipperContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }

                                                            window.setTimeout(() => {
                                                                setShowShipperContactPhones(true);

                                                                refShipperContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 50)
                                                        }}
                                                        setItems={setShipperContactPhoneItems}
                                                        onDropdownClick={e => {
                                                            if (showShipperContactPhones) {
                                                                setShowShipperContactPhones(false);
                                                            } else {
                                                                setShipperContactPhoneItems((shipperContactPhoneItems || []).map((item, index) => {
                                                                    item.selected = item.phone === selectedShipper?.contact_phone;
                                                                    return item;
                                                                }))

                                                                window.setTimeout(() => {
                                                                    setShowShipperContactPhones(true);

                                                                    refShipperContactPhonePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }, 100)
                                                            }
                                                        }}
                                                        onPopupClick={item => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_primary_phone = item.type;
                                                                            item.contact_phone = item.phone;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_primary_phone: item.type,
                                                                    contact_phone: item.phone
                                                                }
                                                            })

                                                            setShowShipperContactPhones(false);
                                                            refShipperContactPhones.current.inputElement.focus();
                                                            setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                        }}
                                                        isShowing={showShipperContactPhones}
                                                        setIsShowing={setShowShipperContactPhones}
                                                        primaryPhone={selectedShipper?.contact_primary_phone || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-state'
                                                        placeholder='Ext'
                                                        tabIndex={23 + props.tabTimes}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9) {
                                                                e.preventDefault();
                                                                setIsShowingShipperSecondPage(true);
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone_ext = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone_ext: ''
                                                                }
                                                            })
                                                        }}
                                                        value={
                                                            (selectedShipper?.contact_id || 0) > 0 && (selectedShipper?.contact_primary_phone || '') === 'work'
                                                                ? (selectedShipper?.contacts || []).find(x => x.id === selectedShipper?.contact_id)?.phone_ext || ''
                                                                : ''
                                                        }
                                                    />
                                                </div>
                                            </animated.div>
                                        ))
                                    }

                                    {
                                        shipperSecondPageTransition((style, item) => item && (
                                            <animated.div className='form-page second-page shipper-second-page' style={{ ...style }}>
                                                <div className="form-row">
                                                    <DateInput
                                                        placeholder="PU Date 1"
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        popupId="shipper-pu-date-1"
                                                        tabIndex={24 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        refs={{
                                                            refInputDate: refPickupDate1,
                                                            refCalendarDropDown: refPickupDate1CalendarDropDown
                                                        }}
                                                        autoFocus={true}
                                                        readOnly={false}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key >= 37 && key <= 40) {
                                                                setIsPickupDate1CalendarShown(true);

                                                                if (moment((selectedShipper?.pu_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date1 || "").trim()) {
                                                                    setPreSelectedPickupDate1(moment(selectedShipper?.pu_date1, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedPickupDate1(moment());
                                                                }
                                                            }
                                                        }}
                                                        onBlur={(formatted) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date1 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date1: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date1 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date1: value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date1 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date1: value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.pu_date1 || ""}
                                                        preDay={preSelectedPickupDate1}
                                                        setPreDay={setPreSelectedPickupDate1}
                                                        isCalendarShown={isPickupDate1CalendarShown}
                                                        setIsCalendarShown={setIsPickupDate1CalendarShown}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onDropDownClick={() => {
                                                            if (isPickupDate1CalendarShown) {
                                                                setIsPickupDate1CalendarShown(false);
                                                            } else {
                                                                setIsPickupDate1CalendarShown(true);

                                                                if (moment((selectedShipper?.pu_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date1 || "").trim()) {
                                                                    setPreSelectedPickupDate1(moment(selectedShipper?.pu_date1, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedPickupDate1(moment());
                                                                }
                                                            }
                                                        }}
                                                        calendarValue={moment((selectedShipper?.pu_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date1 || "").trim() ? moment(selectedShipper?.pu_date1, "MM/DD/YYYY") : moment()}
                                                        onCalendarChange={(day) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date1 = day.format("MM/DD/YYYY");
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date1: day.format("MM/DD/YYYY")
                                                                }
                                                            });
                                                        }}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: refPickupTime1
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-pu-time-1'
                                                        placeholder='PU Time 1'
                                                        maxLength={4}
                                                        tabIndex={25 + props.tabTimes}
                                                        onBlur={(e) => {
                                                            let formatted = getFormattedHours(e.target.value);

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time1 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time1: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time1 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time1 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.pu_time1 || ''}
                                                    />

                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}>To</div>

                                                    <DateInput
                                                        placeholder="PU Date 2"
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        popupId="shipper-pu-date-2"
                                                        tabIndex={26 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        refs={{
                                                            refInputDate: refPickupDate2,
                                                            refCalendarDropDown: refPickupDate2CalendarDropDown
                                                        }}
                                                        readOnly={false}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key >= 37 && key <= 40) {
                                                                setIsPickupDate2CalendarShown(true);

                                                                if (moment((selectedShipper?.pu_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date2 || "").trim()) {
                                                                    setPreSelectedPickupDate2(moment(selectedShipper?.pu_date2, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedPickupDate2(moment());
                                                                }
                                                            }
                                                        }}
                                                        onBlur={(formatted) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date2 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date2: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date2 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date2: value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date2 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date2: value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.pu_date2 || ""}
                                                        preDay={preSelectedPickupDate2}
                                                        setPreDay={setPreSelectedPickupDate2}
                                                        isCalendarShown={isPickupDate2CalendarShown}
                                                        setIsCalendarShown={setIsPickupDate2CalendarShown}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onDropDownClick={() => {
                                                            if (isPickupDate2CalendarShown) {
                                                                setIsPickupDate2CalendarShown(false);
                                                            } else {
                                                                setIsPickupDate2CalendarShown(true);

                                                                if (moment((selectedShipper?.pu_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date2 || "").trim()) {
                                                                    setPreSelectedPickupDate2(moment(selectedShipper?.pu_date2, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedPickupDate2(moment());
                                                                }
                                                            }
                                                        }}
                                                        calendarValue={moment((selectedShipper?.pu_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedShipper?.pu_date2 || "").trim() ? moment(selectedShipper?.pu_date2, "MM/DD/YYYY") : moment()}
                                                        onCalendarChange={(day) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_date2 = day.format("MM/DD/YYYY");
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_date2: day.format("MM/DD/YYYY")
                                                                }
                                                            });
                                                        }}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: refPickupTime2
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-pu-time-2'
                                                        placeholder='PU Time 2'
                                                        maxLength={4}
                                                        tabIndex={27 + props.tabTimes}
                                                        onBlur={(e) => {
                                                            let formatted = getFormattedHours(e.target.value);

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time2 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time2: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time2 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.pu_time2 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pu_time2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.pu_time2 || ''}
                                                    />
                                                </div>

                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: refShipperBolNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-bol-numbers'
                                                        placeholder='BOL Numbers'
                                                        tabIndex={28 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedShipper?._bol_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedShipper?.bol_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedShipper?._bol_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _bol_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.bol_numbers = (selectedShipper?.bol_numbers || '') !== ''
                                                                                            ? selectedShipper.bol_numbers + '|' + selectedShipper._bol_number
                                                                                            : selectedShipper._bol_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                bol_numbers: (selectedShipper?.bol_numbers || '') !== ''
                                                                                    ? selectedShipper.bol_numbers + '|' + selectedShipper._bol_number
                                                                                    : selectedShipper._bol_number,
                                                                                _bol_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refShipperBolNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._bol_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _bol_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._bol_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _bol_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?._bol_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedShipper?.bol_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.bol_numbers = (selectedShipper?.bol_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    bol_numbers: (selectedShipper?.bol_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                        }}
                                                    />
                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}></div>
                                                    <TextInput
                                                        refs={{
                                                            refInput: refShipperPoNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-po-numbers'
                                                        placeholder='PO Numbers'
                                                        tabIndex={29 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedShipper?._po_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedShipper?.po_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedShipper?._po_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _po_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.po_numbers = (selectedShipper?.po_numbers || '') !== ''
                                                                                            ? selectedShipper.po_numbers + '|' + selectedShipper._po_number
                                                                                            : selectedShipper._po_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                po_numbers: (selectedShipper?.po_numbers || '') !== ''
                                                                                    ? selectedShipper.po_numbers + '|' + selectedShipper._po_number
                                                                                    : selectedShipper._po_number,
                                                                                _po_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refShipperPoNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._po_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _po_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._po_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _po_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?._po_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedShipper?.po_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.po_numbers = (selectedShipper?.po_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    po_numbers: (selectedShipper?.po_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: refShipperRefNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-ref-numbers'
                                                        placeholder='REF Numbers'
                                                        tabIndex={30 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedShipper?._ref_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedShipper?.ref_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedShipper?._ref_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _ref_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.ref_numbers = (selectedShipper?.ref_numbers || '') !== ''
                                                                                            ? selectedShipper.ref_numbers + '|' + selectedShipper._ref_number
                                                                                            : selectedShipper._ref_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedShipper(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                ref_numbers: (selectedShipper?.ref_numbers || '') !== ''
                                                                                    ? selectedShipper.ref_numbers + '|' + selectedShipper._ref_number
                                                                                    : selectedShipper._ref_number,
                                                                                _ref_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refShipperRefNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._ref_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _ref_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._ref_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _ref_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?._ref_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedShipper?.ref_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.ref_numbers = (selectedShipper?.ref_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    ref_numbers: (selectedShipper?.ref_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingPickup(selectedShipper?.pickup_id || 0) }, 100);
                                                        }}
                                                    />
                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}></div>
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-seal-number'
                                                        placeholder='SEAL Number'
                                                        tabIndex={31 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.seal_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    seal_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.seal_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    seal_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.seal_number || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='shipper-special-instructions'
                                                        placeholder='Special Instructions'
                                                        tabIndex={32 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9) {
                                                                setIsSavingPickup(selectedShipper?.pickup_id || 0);
                                                                setIsShowingShipperSecondPage(false);
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.special_instructions = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    special_instructions: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    pickups: (selectedTemplate?.pickups || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.special_instructions = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedShipper(prev => {
                                                                return {
                                                                    ...prev,
                                                                    special_instructions: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedShipper?.special_instructions || ''}
                                                    />
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="template-column second">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Consignee</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={`mochi-button${((selectedTemplate?.id || 0) === 0 || (selectedConsignee?.id || 0) > 0) ? ' disabled' : ''}`} onClick={() => {
                                        searchConsignee();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={`mochi-button${(selectedConsignee?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                        let panel = {
                                            panelName: `${props.panelName}-customer`,
                                            component: (
                                                <Customers
                                                    pageName={"Customer"}
                                                    title={"Consignee Company"}
                                                    panelName={`${props.panelName}-customer`}
                                                    tabTimes={20009547 + props.tabTimes}
                                                    componentId={moment().format("x")}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    origin={props.origin}
                                                    customer_id={selectedConsignee?.id}
                                                    closingCallback={() => {
                                                        closePanel(`${props.panelName}-customer`, props.origin);
                                                        refName.current.focus({ preventScroll: true });
                                                    }}
                                                />
                                            ),
                                        };

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Company Info</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    {
                                        isShowingConsigneeSecondPage &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsShowingConsigneeSecondPage(!isShowingConsigneeSecondPage);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">1st Page</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isShowingConsigneeSecondPage &&
                                        <div className={`mochi-button${(selectedConsignee?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                                            setIsShowingConsigneeSecondPage(!isShowingConsigneeSecondPage);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">2nd Page</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-wrapper">
                                <div className="form-row">
                                    <TextInput
                                        refs={{
                                            refInput: refConsigneeCode
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        className='input-code'
                                        placeholder='Code'
                                        maxLength={8}
                                        tabIndex={33 + props.tabTimes}
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9) {
                                                getConsigneeCustomerByCode();
                                            }
                                        }}
                                        onChange={(e) => {
                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                            if (current) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = {
                                                                    ...(item?.customer || {}),
                                                                    code: e.target.value,
                                                                    code_number: 0
                                                                }
                                                            }

                                                            return item;
                                                        })
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: [
                                                            ...(selectedTemplate?.deliveries || []),
                                                            {
                                                                id: 0,
                                                                selected: true,
                                                                customer: {
                                                                    code: e.target.value,
                                                                    code_number: 0
                                                                }
                                                            }
                                                        ]
                                                    }
                                                })
                                            }

                                            setSelectedConsignee(prev => {
                                                return {
                                                    ...prev,
                                                    code: e.target.value,
                                                    code_number: 0
                                                }
                                            })
                                        }}
                                        value={
                                            (selectedConsignee?.code_number || 0) === 0
                                                ? (selectedConsignee?.code || '')
                                                : (selectedConsignee?.code || '') + selectedConsignee?.code_number
                                        }
                                    />

                                    <TextInput
                                        refs={{
                                            refInput: null
                                        }}
                                        disabled={(selectedTemplate?.id || 0) === 0}
                                        placeholder='Name'
                                        tabIndex={34 + props.tabTimes}
                                        boxStyle={{
                                            flexGrow: 1
                                        }}
                                        inputStyle={{
                                            textTransform: 'capitalize'
                                        }}
                                        onChange={(e) => {
                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                            if (current) {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                            if (item.selected) {
                                                                item.customer = {
                                                                    ...(item?.customer || {}),
                                                                    name: e.target.value
                                                                }
                                                            }

                                                            return item;
                                                        })
                                                    }
                                                })
                                            } else {
                                                setSelectedTemplate(prev => {
                                                    return {
                                                        ...prev,
                                                        deliveries: [
                                                            ...(selectedTemplate?.deliveries || []),
                                                            {
                                                                id: 0,
                                                                selected: true,
                                                                customer: {
                                                                    name: e.target.value
                                                                }
                                                            }
                                                        ]
                                                    }
                                                })
                                            }

                                            setSelectedConsignee(prev => {
                                                return {
                                                    ...prev,
                                                    name: e.target.value    
                                                }
                                            })
                                        }}
                                        value={selectedConsignee?.name || ''}
                                    />
                                </div>
                                <div className="form-row">
                                    {
                                        consigneeFirstPageTransition((style, item) => item && (
                                            <animated.div className='form-page first-page consignee-first-page' style={{ ...style }}>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='Address 1'
                                                        tabIndex={35 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    address1: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: [
                                                                            ...(selectedTemplate?.deliveries || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    address1: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    address1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.address1 || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='Address 2'
                                                        tabIndex={36 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    address2: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: [
                                                                            ...(selectedTemplate?.deliveries || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    address2: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    address2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.address2 || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder='City'
                                                        tabIndex={37 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    city: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: [
                                                                            ...(selectedTemplate?.deliveries || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    city: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    city: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.city || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-state'
                                                        placeholder='State'
                                                        tabIndex={38 + props.tabTimes}
                                                        maxLength={2}
                                                        inputStyle={{
                                                            textDecoration: 'uppercase'
                                                        }}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    state: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: [
                                                                            ...(selectedTemplate?.deliveries || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    state: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    state: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.state || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-zip-code'
                                                        placeholder='Postal Code'
                                                        tabIndex={39 + props.tabTimes}
                                                        onChange={(e) => {
                                                            let current = (selectedTemplate?.deliveries || []).find(x => x.selected);

                                                            if (current) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.customer = {
                                                                                    ...(item?.customer || {}),
                                                                                    zip: e.target.value
                                                                                }
                                                                            }

                                                                            return item;
                                                                        })
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: [
                                                                            ...(selectedTemplate?.deliveries || []),
                                                                            {
                                                                                id: 0,
                                                                                selected: true,
                                                                                customer: {
                                                                                    zip: e.target.value
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                })
                                                            }

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    zip: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.zip || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <SelectBox
                                                        className={'template-consignee-contact-name'}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder="Contact Name"
                                                        popupId="template-consignee-contact-name"
                                                        tabIndex={40 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        inputStyle={{
                                                            textTransform: 'capitalize'
                                                        }}
                                                        refs={{
                                                            refInput: refConsigneeContactNames,
                                                            refPopupItems: refConsigneeContactNamePopupItems,
                                                            refDropdown: refConsigneeContactNameDropdown,
                                                        }}
                                                        noStopPropagationOnEsc={true}
                                                        readOnly={false}
                                                        isDropdownEnabled={(selectedConsignee?.contacts || []).length > 0}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onEnter={async e => {
                                                            if (consigneeContactNameItems.length > 0 && consigneeContactNameItems.findIndex(item => item.selected) > -1) {
                                                                let item = consigneeContactNameItems[consigneeContactNameItems.findIndex(item => item.selected)];

                                                                let contact_id = item.id;
                                                                let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                                let contact_phone = item.id === selectedConsignee?.contact_id
                                                                    ? selectedConsignee?.contact_phone
                                                                    : (item?.primary_phone || '') === 'work'
                                                                        ? item?.phone_work || ''
                                                                        : (item?.primary_phone || '') === 'fax'
                                                                            ? item?.phone_work_fax || ''
                                                                            : (item?.primary_phone || '') === 'mobile'
                                                                                ? item?.phone_mobile || ''
                                                                                : (item?.primary_phone || '') === 'direct'
                                                                                    ? item?.phone_direct || ''
                                                                                    : (item?.primary_phone || '') === 'other'
                                                                                        ? item?.phone_other || ''
                                                                                        : '';
                                                                let contact_primary_phone = item.id === selectedConsignee?.contact_id
                                                                    ? selectedConsignee?.contact_primary_phone
                                                                    : item?.primary_phone || '';
                                                                let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                    ? (item?.phone_ext || '')
                                                                    : '';

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = contact_id;
                                                                                x.contact_name = contact_name;
                                                                                x.contact_phone = contact_phone;
                                                                                x.contact_primary_phone = contact_primary_phone;
                                                                                x.contact_phone_ext = contact_phone_ext;
                                                                            }

                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: contact_id,
                                                                        contact_name: contact_name,
                                                                        contact_phone: contact_phone,
                                                                        contact_primary_phone: contact_primary_phone,
                                                                        contact_phone_ext: contact_phone_ext
                                                                    }
                                                                })

                                                                setConsigneeContactNameItems([]);
                                                                refConsigneeContactNames.current.focus();
                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onTab={async e => {
                                                            if (consigneeContactNameItems.length > 0 && consigneeContactNameItems.findIndex(item => item.selected) > -1) {
                                                                let item = consigneeContactNameItems[consigneeContactNameItems.findIndex(item => item.selected)];

                                                                let contact_id = item.id;
                                                                let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                                let contact_phone = item.id === selectedConsignee?.contact_id
                                                                    ? selectedConsignee?.contact_phone
                                                                    : (item?.primary_phone || '') === 'work'
                                                                        ? item?.phone_work || ''
                                                                        : (item?.primary_phone || '') === 'fax'
                                                                            ? item?.phone_work_fax || ''
                                                                            : (item?.primary_phone || '') === 'mobile'
                                                                                ? item?.phone_mobile || ''
                                                                                : (item?.primary_phone || '') === 'direct'
                                                                                    ? item?.phone_direct || ''
                                                                                    : (item?.primary_phone || '') === 'other'
                                                                                        ? item?.phone_other || ''
                                                                                        : '';
                                                                let contact_primary_phone = item.id === selectedConsignee?.contact_id
                                                                    ? selectedConsignee?.contact_primary_phone
                                                                    : item?.primary_phone || '';
                                                                let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                    ? (item?.phone_ext || '')
                                                                    : '';

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = contact_id;
                                                                                x.contact_name = contact_name;
                                                                                x.contact_phone = contact_phone;
                                                                                x.contact_primary_phone = contact_primary_phone;
                                                                                x.contact_phone_ext = contact_phone_ext;
                                                                            }

                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: contact_id,
                                                                        contact_name: contact_name,
                                                                        contact_phone: contact_phone,
                                                                        contact_primary_phone: contact_primary_phone,
                                                                        contact_phone_ext: contact_phone_ext
                                                                    }
                                                                })

                                                                setConsigneeContactNameItems([]);
                                                                refConsigneeContactNames.current.focus();
                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onBlur={e => {
                                                            let item = (selectedConsignee?.contacts || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (selectedConsignee?.contact_name || '').trim().toLowerCase());

                                                            if (item) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = item?.id
                                                                            }
                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: item.id
                                                                    }
                                                                })
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(x => {
                                                                            if (x.selected) {
                                                                                x.contact_id = null;
                                                                                x.contact_name = '';
                                                                                x.contact_phone = '';
                                                                                x.contact_primary_phone = 'work';
                                                                            }
                                                                            return x;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_id: null,
                                                                        contact_name: '',
                                                                        contact_phone: '',
                                                                        contact_primary_phone: 'work'
                                                                    }
                                                                })

                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onInput={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_id = null;
                                                                            item.contact_name = e.target.value;
                                                                            item.contact_phone = '';
                                                                            item.contact_primary_phone = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: null,
                                                                    contact_name: e.target.value,
                                                                    contact_phone: '',
                                                                    contact_primary_phone: ''
                                                                }
                                                            })

                                                            if (e.target.value.trim() === "") {
                                                                setConsigneeContactNameItems([]);
                                                            } else {
                                                                setConsigneeContactNameItems((selectedConsignee?.contacts || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((selectedConsignee?.contact_name || '').trim().toLowerCase())).map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }
                                                        }}
                                                        onChange={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_id = null;
                                                                            item.contact_name = e.target.value;
                                                                            item.contact_phone = '';
                                                                            item.contact_primary_phone = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: null,
                                                                    contact_name: e.target.value,
                                                                    contact_phone: '',
                                                                    contact_primary_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.contact_name || ""}
                                                        items={consigneeContactNameItems}
                                                        getItems={() => {
                                                            let selectedIndex = (selectedConsignee?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedConsignee?.contact_name || '').trim().toLowerCase());

                                                            if (selectedIndex > -1) {
                                                                setConsigneeContactNameItems((selectedConsignee?.contacts || []).map((item, index) => {
                                                                    item.selected = index === selectedIndex;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setConsigneeContactNameItems((selectedConsignee?.contacts || []).map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }

                                                            window.setTimeout(() => {
                                                                refConsigneeContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 10)

                                                        }}
                                                        setItems={setConsigneeContactNameItems}
                                                        onDropdownClick={e => {
                                                            window.setTimeout(() => {
                                                                let selectedIndex = (selectedConsignee?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (selectedConsignee?.contact_name || '').trim().toLowerCase());

                                                                if (selectedIndex > -1) {
                                                                    setConsigneeContactNameItems((selectedConsignee?.contacts || []).map((item, index) => {
                                                                        item.selected = index === selectedIndex;
                                                                        return item;
                                                                    }))
                                                                } else {
                                                                    setConsigneeContactNameItems((selectedConsignee?.contacts || []).map((item, index) => {
                                                                        item.selected = index === 0;
                                                                        return item;
                                                                    }))
                                                                }

                                                                refConsigneeContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 100)
                                                        }}
                                                        onPopupClick={item => {
                                                            let contact_id = item.id;
                                                            let contact_name = (item?.first_name || '') + ' ' + (item?.last_name || '');
                                                            let contact_phone = item.id === selectedConsignee?.contact_id
                                                                ? selectedConsignee?.contact_phone
                                                                : (item?.primary_phone || '') === 'work'
                                                                    ? item?.phone_work || ''
                                                                    : (item?.primary_phone || '') === 'fax'
                                                                        ? item?.phone_work_fax || ''
                                                                        : (item?.primary_phone || '') === 'mobile'
                                                                            ? item?.phone_mobile || ''
                                                                            : (item?.primary_phone || '') === 'direct'
                                                                                ? item?.phone_direct || ''
                                                                                : (item?.primary_phone || '') === 'other'
                                                                                    ? item?.phone_other || ''
                                                                                    : '';
                                                            let contact_primary_phone = item.id === selectedConsignee?.contact_id
                                                                ? selectedConsignee?.contact_primary_phone
                                                                : item?.primary_phone || '';
                                                            let contact_phone_ext = (contact_primary_phone || '') === 'work'
                                                                ? (item?.phone_ext || '')
                                                                : '';

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(x => {
                                                                        if (x.selected) {
                                                                            x.contact_id = contact_id;
                                                                            x.contact_name = contact_name;
                                                                            x.contact_phone = contact_phone;
                                                                            x.contact_primary_phone = contact_primary_phone;
                                                                            x.contact_phone_ext = contact_phone_ext;
                                                                        }

                                                                        return x;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_id: contact_id,
                                                                    contact_name: contact_name,
                                                                    contact_phone: contact_phone,
                                                                    contact_primary_phone: contact_primary_phone,
                                                                    contact_phone_ext: contact_phone_ext
                                                                }
                                                            })

                                                            setConsigneeContactNameItems([]);
                                                            refConsigneeContactNames.current.focus();
                                                            setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                        }}
                                                        labelType='contact_first_last'
                                                    />

                                                    <SelectPhoneBox
                                                        className={'input-phone'}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        placeholder="Contact Phone"
                                                        popupId="template-consignee-contact-phone"
                                                        tabIndex={41 + props.tabTimes}
                                                        boxStyle={{
                                                            width: '10.25rem',
                                                        }}
                                                        refs={{
                                                            refInput: refConsigneeContactPhones,
                                                            refPopupItems: refConsigneeContactPhonePopupItems,
                                                            refDropdown: refConsigneeContactPhoneDropdown,
                                                        }}
                                                        isDropdownEnabled={(selectedConsignee?.id || 0) > 0 && (selectedConsignee?.contact_id || 0) > 0}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onEnter={e => {
                                                            if (showConsigneeContactPhones && consigneeContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                let item = consigneeContactPhoneItems[consigneeContactPhoneItems.findIndex(item => item.selected)];

                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = item.type;
                                                                                item.contact_phone = item.phone;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: item.type,
                                                                        contact_phone: item.phone
                                                                    }
                                                                })

                                                                setShowConsigneeContactPhones(false);
                                                                refConsigneeContactPhones.current.inputElement.focus();
                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onTab={async e => {
                                                            if (showConsigneeContactPhones && consigneeContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                let item = consigneeContactPhoneItems[consigneeContactPhoneItems.findIndex(item => item.selected)];


                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = item.type;
                                                                                item.contact_phone = item.phone;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: item.type,
                                                                        contact_phone: item.phone
                                                                    }
                                                                })

                                                                setShowConsigneeContactPhones(false);
                                                                refConsigneeContactPhones.current.inputElement.focus();
                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onBlur={e => {
                                                            let phone = consigneeContactPhoneItems.find(x => x.phone === selectedConsignee?.contact_phone);
                                                            let currentPrimary = selectedConsignee?.contact_primary_phone;

                                                            if (phone) {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = phone.type;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: phone.type
                                                                    }
                                                                })

                                                                if (phone.type !== currentPrimary) {
                                                                    setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                                }
                                                            } else {
                                                                setSelectedTemplate(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                            if (item.selected) {
                                                                                item.contact_primary_phone = '';
                                                                                item.contact_phone = '';
                                                                            }
                                                                            return item;
                                                                        })
                                                                    }
                                                                })

                                                                setSelectedConsignee(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        contact_primary_phone: '',
                                                                        contact_phone: ''
                                                                    }
                                                                })

                                                                setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                            }
                                                        }}
                                                        onInput={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone = ''
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        onChange={e => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone = ''
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone: ''
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.contact_phone || ""}
                                                        items={consigneeContactPhoneItems}
                                                        getItems={() => {
                                                            let selectedIndex = (consigneeContactPhoneItems || []).findIndex(x => x.phone === selectedConsignee?.contact_phone);

                                                            if (selectedIndex > 0) {
                                                                setConsigneeContactPhoneItems(consigneeContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === selectedIndex;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                setConsigneeContactPhoneItems(consigneeContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            }

                                                            window.setTimeout(() => {
                                                                setShowConsigneeContactPhones(true);

                                                                refConsigneeContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 50)
                                                        }}
                                                        setItems={setConsigneeContactPhoneItems}
                                                        onDropdownClick={e => {
                                                            if (showConsigneeContactPhones) {
                                                                setShowConsigneeContactPhones(false);
                                                            } else {
                                                                setConsigneeContactPhoneItems((consigneeContactPhoneItems || []).map((item, index) => {
                                                                    item.selected = item.phone === selectedConsignee?.contact_phone;
                                                                    return item;
                                                                }))

                                                                window.setTimeout(() => {
                                                                    setShowConsigneeContactPhones(true);

                                                                    refConsigneeContactPhonePopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }, 100)
                                                            }
                                                        }}
                                                        onPopupClick={item => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.contact_primary_phone = item.type;
                                                                            item.contact_phone = item.phone;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    contact_primary_phone: item.type,
                                                                    contact_phone: item.phone
                                                                }
                                                            })

                                                            setShowConsigneeContactPhones(false);
                                                            refConsigneeContactPhones.current.inputElement.focus();
                                                            setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                        }}
                                                        isShowing={showConsigneeContactPhones}
                                                        setIsShowing={setShowConsigneeContactPhones}
                                                        primaryPhone={selectedConsignee?.contact_primary_phone || ''}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='input-state'
                                                        placeholder='Ext'
                                                        tabIndex={42 + props.tabTimes}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9) {
                                                                e.preventDefault();
                                                                setIsShowingConsigneeSecondPage(true);
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._contact_phone_ext = '';
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _contact_phone_ext: ''
                                                                }
                                                            })
                                                        }}
                                                        value={
                                                            (selectedConsignee?.contact_id || 0) > 0 && (selectedConsignee?.contact_primary_phone || '') === 'work'
                                                                ? (selectedConsignee?.contacts || []).find(x => x.id === selectedConsignee?.contact_id)?.phone_ext || ''
                                                                : ''
                                                        }
                                                    />
                                                </div>
                                            </animated.div>
                                        ))
                                    }

                                    {
                                        consigneeSecondPageTransition((style, item) => item && (
                                            <animated.div className='form-page second-page consignee-second-page' style={{ ...style }}>
                                                <div className="form-row">
                                                    <DateInput
                                                        placeholder="PU Date 1"
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        popupId="consignee-pu-date-1"
                                                        tabIndex={43 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        refs={{
                                                            refInputDate: refDeliveryDate1,
                                                            refCalendarDropDown: refDeliveryDate1CalendarDropDown
                                                        }}
                                                        autoFocus={true}
                                                        readOnly={false}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key >= 37 && key <= 40) {
                                                                setIsDeliveryDate1CalendarShown(true);

                                                                if (moment((selectedConsignee?.delivery_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date1 || "").trim()) {
                                                                    setPreSelectedDeliveryDate1(moment(selectedConsignee?.delivery_date1, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedDeliveryDate1(moment());
                                                                }
                                                            }
                                                        }}
                                                        onBlur={(formatted) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date1 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date1: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date1 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date1: value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date1 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date1: value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.delivery_date1 || ""}
                                                        preDay={preSelectedDeliveryDate1}
                                                        setPreDay={setPreSelectedDeliveryDate1}
                                                        isCalendarShown={isDeliveryDate1CalendarShown}
                                                        setIsCalendarShown={setIsDeliveryDate1CalendarShown}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onDropDownClick={() => {
                                                            if (isDeliveryDate1CalendarShown) {
                                                                setIsDeliveryDate1CalendarShown(false);
                                                            } else {
                                                                setIsDeliveryDate1CalendarShown(true);

                                                                if (moment((selectedConsignee?.delivery_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date1 || "").trim()) {
                                                                    setPreSelectedDeliveryDate1(moment(selectedConsignee?.delivery_date1, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedDeliveryDate1(moment());
                                                                }
                                                            }
                                                        }}
                                                        calendarValue={moment((selectedConsignee?.delivery_date1 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date1 || "").trim() ? moment(selectedConsignee?.delivery_date1, "MM/DD/YYYY") : moment()}
                                                        onCalendarChange={(day) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date1 = day.format("MM/DD/YYYY");
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date1: day.format("MM/DD/YYYY")
                                                                }
                                                            });
                                                        }}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: refDeliveryTime1
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-pu-time-1'
                                                        placeholder='PU Time 1'
                                                        maxLength={4}
                                                        tabIndex={44 + props.tabTimes}
                                                        onBlur={(e) => {
                                                            let formatted = getFormattedHours(e.target.value);

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time1 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time1: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time1 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time1 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time1: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.delivery_time1 || ''}
                                                    />

                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}>To</div>

                                                    <DateInput
                                                        placeholder="PU Date 2"
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        popupId="consignee-pu-date-2"
                                                        tabIndex={45 + props.tabTimes}
                                                        boxStyle={{
                                                            flexGrow: 1,
                                                        }}
                                                        refs={{
                                                            refInputDate: refDeliveryDate2,
                                                            refCalendarDropDown: refDeliveryDate2CalendarDropDown
                                                        }}
                                                        readOnly={false}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key >= 37 && key <= 40) {
                                                                setIsDeliveryDate2CalendarShown(true);

                                                                if (moment((selectedConsignee?.delivery_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date2 || "").trim()) {
                                                                    setPreSelectedDeliveryDate2(moment(selectedConsignee?.delivery_date2, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedDeliveryDate2(moment());
                                                                }
                                                            }
                                                        }}
                                                        onBlur={(formatted) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date2 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date2: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date2 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date2: value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date2 = value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date2: value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.delivery_date2 || ""}
                                                        preDay={preSelectedDeliveryDate2}
                                                        setPreDay={setPreSelectedDeliveryDate2}
                                                        isCalendarShown={isDeliveryDate2CalendarShown}
                                                        setIsCalendarShown={setIsDeliveryDate2CalendarShown}
                                                        popupPosition="vertical below right"
                                                        popupStyle={{
                                                            left: '0%'
                                                        }}
                                                        onDropDownClick={() => {
                                                            if (isDeliveryDate2CalendarShown) {
                                                                setIsDeliveryDate2CalendarShown(false);
                                                            } else {
                                                                setIsDeliveryDate2CalendarShown(true);

                                                                if (moment((selectedConsignee?.delivery_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date2 || "").trim()) {
                                                                    setPreSelectedDeliveryDate2(moment(selectedConsignee?.delivery_date2, "MM/DD/YYYY"));
                                                                } else {
                                                                    setPreSelectedDeliveryDate2(moment());
                                                                }
                                                            }
                                                        }}
                                                        calendarValue={moment((selectedConsignee?.delivery_date2 || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedConsignee?.delivery_date2 || "").trim() ? moment(selectedConsignee?.delivery_date2, "MM/DD/YYYY") : moment()}
                                                        onCalendarChange={(day) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_date2 = day.format("MM/DD/YYYY");
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_date2: day.format("MM/DD/YYYY")
                                                                }
                                                            });
                                                        }}
                                                    />

                                                    <TextInput
                                                        refs={{
                                                            refInput: refDeliveryTime2
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-pu-time-2'
                                                        placeholder='PU Time 2'
                                                        maxLength={4}
                                                        tabIndex={46 + props.tabTimes}
                                                        onBlur={(e) => {
                                                            let formatted = getFormattedHours(e.target.value);

                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time2 = formatted;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time2: formatted
                                                                }
                                                            })
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time2 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.delivery_time2 = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    delivery_time2: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.delivery_time2 || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: refConsigneeBolNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-bol-numbers'
                                                        placeholder='BOL Numbers'
                                                        tabIndex={47 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedConsignee?._bol_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedConsignee?.bol_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedConsignee?._bol_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _bol_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.bol_numbers = (selectedConsignee?.bol_numbers || '') !== ''
                                                                                            ? selectedConsignee.bol_numbers + '|' + selectedConsignee._bol_number
                                                                                            : selectedConsignee._bol_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                bol_numbers: (selectedConsignee?.bol_numbers || '') !== ''
                                                                                    ? selectedConsignee.bol_numbers + '|' + selectedConsignee._bol_number
                                                                                    : selectedConsignee._bol_number,
                                                                                _bol_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refConsigneeBolNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._bol_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _bol_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._bol_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _bol_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?._bol_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedConsignee?.bol_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.bol_numbers = (selectedConsignee?.bol_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    bol_numbers: (selectedConsignee?.bol_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                        }}
                                                    />
                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}></div>
                                                    <TextInput
                                                        refs={{
                                                            refInput: refConsigneePoNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-po-numbers'
                                                        placeholder='PO Numbers'
                                                        tabIndex={48 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedConsignee?._po_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedConsignee?.po_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedConsignee?._po_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _po_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.po_numbers = (selectedConsignee?.po_numbers || '') !== ''
                                                                                            ? selectedConsignee.po_numbers + '|' + selectedConsignee._po_number
                                                                                            : selectedConsignee._po_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                po_numbers: (selectedConsignee?.po_numbers || '') !== ''
                                                                                    ? selectedConsignee.po_numbers + '|' + selectedConsignee._po_number
                                                                                    : selectedConsignee._po_number,
                                                                                _po_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refConsigneePoNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._po_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _po_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._po_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _po_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?._po_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedConsignee?.po_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.po_numbers = (selectedConsignee?.po_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    po_numbers: (selectedConsignee?.po_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: refConsigneeRefNumbers
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-ref-numbers'
                                                        placeholder='REF Numbers'
                                                        tabIndex={49 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9 || key === 13) {
                                                                if ((selectedConsignee?._ref_number || '').trim() !== '') {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();

                                                                    let exist = false;
                                                                    (selectedConsignee?.ref_numbers || '').split('|').map(item => {
                                                                        if (item.trim() === (selectedConsignee?._ref_number || '').trim()) {
                                                                            exist = true;
                                                                        }
                                                                        return false;
                                                                    })

                                                                    if (exist) {
                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                _ref_number: ''
                                                                            }
                                                                        })
                                                                    } else {
                                                                        setSelectedTemplate(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                                    if (item.selected) {
                                                                                        item.ref_numbers = (selectedConsignee?.ref_numbers || '') !== ''
                                                                                            ? selectedConsignee.ref_numbers + '|' + selectedConsignee._ref_number
                                                                                            : selectedConsignee._ref_number

                                                                                    }
                                                                                    return item;
                                                                                })
                                                                            }
                                                                        })

                                                                        setSelectedConsignee(prev => {
                                                                            return {
                                                                                ...prev,
                                                                                ref_numbers: (selectedConsignee?.ref_numbers || '') !== ''
                                                                                    ? selectedConsignee.ref_numbers + '|' + selectedConsignee._ref_number
                                                                                    : selectedConsignee._ref_number,
                                                                                _ref_number: ''
                                                                            }
                                                                        })
                                                                    }

                                                                    refConsigneeRefNumbers.current.focus();
                                                                }
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._ref_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _ref_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item._ref_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    _ref_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?._ref_number || ''}
                                                        isDataSplitted={true}
                                                        dataToSplit={selectedConsignee?.ref_numbers || ''}
                                                        separator={'|'}
                                                        removeItem={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.ref_numbers = (selectedConsignee?.ref_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|');
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    ref_numbers: (selectedConsignee?.ref_numbers || '').split('|').filter(x => (x || '').trim() !== e).map(x => x).join('|')
                                                                }
                                                            })

                                                            setTimeout(() => { setIsSavingDelivery(selectedConsignee?.delivery_id || 0) }, 100);
                                                        }}
                                                    />
                                                    <div style={{ textAlign: "center", minWidth: 20, maxWidth: 20 }}></div>
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-seal-number'
                                                        placeholder='SEAL Number'
                                                        tabIndex={50 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.seal_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    seal_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.seal_number = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    seal_number: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.seal_number || ''}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <TextInput
                                                        refs={{
                                                            refInput: null
                                                        }}
                                                        disabled={(selectedTemplate?.id || 0) === 0}
                                                        className='consignee-special-instructions'
                                                        placeholder='Special Instructions'
                                                        tabIndex={51 + props.tabTimes}
                                                        boxStyle={{ flexGrow: 1, flexBasis: '100%' }}
                                                        onKeyDown={(e) => {
                                                            let key = e.keyCode || e.which;

                                                            if (key === 9) {
                                                                setIsSavingDelivery(selectedConsignee?.delivery_id || 0);
                                                                setIsShowingConsigneeSecondPage(false);
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.special_instructions = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    special_instructions: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        onChange={(e) => {
                                                            setSelectedTemplate(prev => {
                                                                return {
                                                                    ...prev,
                                                                    deliveries: (selectedTemplate?.deliveries || []).map(item => {
                                                                        if (item.selected) {
                                                                            item.special_instructions = e.target.value;
                                                                        }
                                                                        return item;
                                                                    })
                                                                }
                                                            })

                                                            setSelectedConsignee(prev => {
                                                                return {
                                                                    ...prev,
                                                                    special_instructions: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={selectedConsignee?.special_instructions || ''}
                                                    />
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="template-column third">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Internal Notes</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div
                                        className={`mochi-button${(selectedTemplate?.id || 0) === 0 ? ' disabled' : ''}`}
                                        onClick={() => {
                                            setSelectedInternalNote({ id: 0 });
                                        }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Note</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="internal-notes-container">
                                <div className="internal-notes-wrapper">
                                    {(selectedTemplate?.internal_notes || []).map((note, index) => {
                                        return (
                                            <div
                                                className="internal-notes-item"
                                                key={index}
                                                onClick={() => setSelectedInternalNote(note)}
                                            >
                                                {note.text}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {noteForCarrierTransition(
                (style, item) =>
                    item && (
                        <animated.div style={{ ...style }}>
                            <Modal
                                selectedData={selectedNoteForCarrier}
                                setSelectedData={setSelectedNoteForCarrier}
                                selectedParent={selectedTemplate}
                                setSelectedParent={(data) => {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            notes_for_carrier: data.notes
                                        };
                                    });
                                }}
                                savingDataUrl="/saveTemplateNotesForCarrier"
                                deletingDataUrl="/deleteTemplateNotesForCarrier"
                                type="note"
                                isEditable={true}
                                isDeletable={true}
                                isAdding={selectedNoteForCarrier?.id === 0}
                            />
                        </animated.div>
                    )
            )}

            {internalNoteTransition(
                (style, item) =>
                    item && (
                        <animated.div style={{ ...style }}>
                            <Modal
                                selectedData={selectedInternalNote}
                                setSelectedData={setSelectedInternalNote}
                                selectedParent={selectedTemplate}
                                setSelectedParent={(data) => {
                                    setSelectedTemplate(prev => {
                                        return {
                                            ...prev,
                                            internal_notes: data.notes
                                        };
                                    });
                                }}
                                savingDataUrl="/saveTemplateInternalNotes"
                                deletingDataUrl="/deleteTemplateInternalNotes"
                                type="note"
                                isEditable={true}
                                isDeletable={true}
                                isAdding={selectedInternalNote?.id === 0}
                            />
                        </animated.div>
                    )
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        user: state.systemReducers.user,
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
})(Template)