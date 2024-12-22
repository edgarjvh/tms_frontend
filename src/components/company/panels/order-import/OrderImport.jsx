/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './OrderImport.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import NumberFormat from "react-number-format";
import classnames from "classnames";
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

import * as XLSX from 'xlsx';
import classNames from 'classnames';

const OrderImport = (props) => {
    const refOrderImportContainer = useRef();
    const refInputFile = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [groupOrderList, setGroupOrderList] = useState([]);
    const [listTotal, setListTotal] = useState(0);
    const [orderTotalListLength, setOrderTotalListLength] = useState(0);
    const [orderCurrentListLength, setOrderCurrentListLength] = useState(0);
    const [customersShown, setCustomersShown] = useState([]);
    const [ordersRelatedData, setOrdersRelatedData] = useState({});
    const [linesRead, setLinesRead] = useState(0);
    const [readingLines, setReadingLines] = useState(false);

    const [shipperCounter, setShipperCounter] = useState(1);
    const [consigneeCounter, setConsigneeCounter] = useState(1);

    const [isTriggered, setIsTriggered] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const ExcelDateToJSDate = (date) => {
        let converted_date = new Date(Math.round((date - 25569) * 864e5));
        converted_date = String(converted_date).slice(4, 15)
        date = converted_date.split(" ")
        let day = date[1];
        let month = date[0];
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
        if (month.toString().length <= 1)
            month = '0' + month
        let year = date[2];
        return String(day + '-' + month + '-' + year.slice(2, 4))
    }

    const inputFileChange = (e) => {
        let file = e.target.files[0];
        const maxSize = 104857600;

        if (FileReader && file) {
            if (file.size > maxSize) {
                window.alert("Selected file is too large, please select a file below 100mb");
                refInputFile.current.value = '';
                return;
            }
            setIsLoading(true);

            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = async (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: 'buffer' });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = await XLSX.utils.sheet_to_json(ws, { raw: false });

                    resolve(data);
                }

                fileReader.onerror = (error) => {
                    reject(error);
                }
            });

            promise.then(res => {
                new Promise((resolve, reject) => {
                    axios.post(props.serverUrl + '/getOrdersRelatedData').then(data => {
                        resolve({
                            customers: data.data.customers,
                            carriers: data.data.carriers,
                            loadTypes: data.data.load_types,
                            equipments: data.data.equipments,
                            rateTypes: data.data.rate_types,
                            eventTypes: data.data.event_types
                        });
                    }).catch(e => {
                        reject(e);
                    })
                }).then(ordersRelatedData => {
                    let customers = ordersRelatedData.customers;
                    let carriers = ordersRelatedData.carriers;
                    let loadTypes = ordersRelatedData.loadTypes;
                    let equipments = ordersRelatedData.equipments;
                    let rateTypes = ordersRelatedData.rateTypes;
                    let eventTypes = ordersRelatedData.eventTypes;

                    let last_order_number = '';
                    let order_group = [];
                    let order_list = [];

                    (res || []).map((row, index) => {
                        let order_number = (row.order_number || '').trim();

                        if (last_order_number === '') {
                            order_group.push(row);
                            last_order_number = order_number;

                            if (index === (order_list.length - 1)) {
                                let bill_to_code = (order_group[0].bill_to_code || '').trim();
                                let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                if (bill_to_customer) {
                                    let order = {};
                                    let trip_number = (order_group[0].trip_number || '').trim();
                                    let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0].load_type || '').toLowerCase());
                                    let order_comments = (order_group[0].order_comments || '').trim();
                                    let internal_order_comments = (order_group[0].internal_order_comments || '').trim();
                                    let haz_mat = (order_group[0].haz_mat || '').toLowerCase() === '' ? 0 : (order_group[0].haz_mat || '').toLowerCase() === 'n' ? 0 : 1;
                                    let expedited = (order_group[0].expedited || '').toLowerCase() === '' ? 0 : (order_group[0].expedited || '').toLowerCase() === 'n' ? 0 : 1;
                                    let miles = (order_group[0].miles || 0);
                                    let creation_date = moment((order_group[0].creation_date || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                    let carrier_code = (order_group[0].carrier_code || '').trim();
                                    let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                    let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0].equipment_type || '')).toLowerCase())?.id || null;

                                    order.order_number = last_order_number;
                                    order.trip_number = trip_number === '' ? null : trip_number;
                                    order.load_type = load_type;
                                    order.load_type_id = load_type?.id || null;
                                    order.bill_to_customer = bill_to_customer;
                                    order.carrier = carrier;
                                    order.equipment_id = equipment_id;
                                    order.haz_mat = haz_mat;
                                    order.expedited = expedited;
                                    order.miles = miles;
                                    order.order_date_time = creation_date;
                                    order.user_code_id = props.user?.user_code?.id;
                                    order.customer_rating = [];
                                    order.carrier_rating = [];
                                    order.pickups = [];
                                    order.deliveries = [];
                                    order.events = [];
                                    order.internal_notes = [];
                                    order.notes_for_carrier = [];

                                    //handle notes for carrier
                                    let original_note = order_comments;

                                    if (order_comments !== '') {
                                        order_comments = order_comments.split(':');

                                        if (order_comments.length === 3) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = moment(order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.notes_for_carrier.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 4) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = moment(order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.notes_for_carrier.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 1) {
                                            let message = order_comments.join(':');

                                            order.notes_for_carrier.push({
                                                date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }
                                    }

                                    //handle internal notes
                                    original_note = internal_order_comments;

                                    if (internal_order_comments !== '') {
                                        internal_order_comments = internal_order_comments.split(':');

                                        if (internal_order_comments.length === 3) {
                                            let message = internal_order_comments.pop();
                                            internal_order_comments = internal_order_comments.join(':');
                                            internal_order_comments = internal_order_comments.split(' ');
                                            internal_order_comments.shift();
                                            internal_order_comments.pop();
                                            let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.internal_notes.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (internal_order_comments.length === 4) {
                                            let message = internal_order_comments.pop();
                                            internal_order_comments = internal_order_comments.join(':');
                                            internal_order_comments = internal_order_comments.split(' ');
                                            internal_order_comments.shift();
                                            internal_order_comments.pop();
                                            let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.internal_notes.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (internal_order_comments.length === 1) {
                                            let message = internal_order_comments.join(':');

                                            order.internal_notes.push({
                                                date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }
                                    }

                                    // handle order ratings
                                    let rate_data = [];

                                    order_group.map((item, x) => {
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                        if (check_call.toLowerCase() === 'begin segment') {
                                            let customer_rate = {};
                                            let carrier_rate = {};
                                            let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                            let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                            let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                            let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                            let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                            let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

                                            if (rate_data.filter(x => x.description === description && x.charges === charges).length === 0) {
                                                rate_data.push({ description, charges });

                                                if (order_number === '30022') {
                                                    console.log(description, charges, rate_data);
                                                }

                                                if (description !== '') {
                                                    if (charges > 0) {
                                                        customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                        customer_rate.description = description;
                                                        customer_rate.total_charges = charges;

                                                        if (order.customer_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                            customer_rate.pieces = pieces;
                                                            customer_rate.pieces_unit = pieces_unit;
                                                            customer_rate.weight = weight;
                                                        }

                                                        if (order.carrier_rating.find(x => x.rate_type_id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                            carrier_rate.description = description;
                                                            carrier_rate.total_charges = cost;
                                                            carrier_rate.pieces = pieces;
                                                            carrier_rate.pieces_unit = pieces_unit;
                                                            carrier_rate.weight = weight;
                                                        } else {
                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            carrier_rate.description = description;
                                                        }
                                                    } else {
                                                        customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                        customer_rate.description = description;

                                                        carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                        carrier_rate.description = description;
                                                    }

                                                    order.customer_rating.push(customer_rate);
                                                    order.carrier_rating.push(carrier_rate);
                                                }
                                            }
                                        }


                                        return item;
                                    });

                                    let shipper_data = [];
                                    let consignee_data = [];
                                    let event_data = [];
                                    let carrier_data = [];
                                    let comment_data = [];
                                    let routing_position = 0;
                                    let po_data = '';
                                    let bol_data = '';

                                    // handle pickups
                                    order_group.sort((a, b) => a.shipper_position - b.shipper_position);

                                    order_group.map((item, i) => {
                                        let shipper_position = item?.shipper_position || 0;
                                        let shipper_code = (item?.shipper_code || '').trim();
                                        let pickup_early_appt = (item?.pickup_early_appt || '').trim();
                                        let pickup_late_appt = (item?.pickup_late_appt || '').trim();
                                        let pickup_date1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let pickup_time1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        let pickup_date2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let pickup_time2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        po_data = (item?.po_number || '').trim();
                                        bol_data = (item?.bol_number || '').trim();

                                        if (shipper_code !== '') {
                                            if (shipper_data.filter(x => x.position === shipper_position && x.code === shipper_code).length === 0) {
                                                shipper_data.push({ position: shipper_position, code: shipper_code });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === shipper_code.toLowerCase());

                                                if (shipper_customer) {
                                                    order.pickups.push({
                                                        customer_id: shipper_customer.id,
                                                        code: shipper_code,
                                                        name: shipper_customer.name,
                                                        pu_date1: pickup_date1,
                                                        pu_date2: pickup_date2,
                                                        pu_time1: pickup_time1,
                                                        pu_time2: pickup_time2,
                                                        type: 'pickup'
                                                    })
                                                }
                                            }
                                        }

                                        return true;
                                    })

                                    // handle deliveries
                                    order_group.sort((a, b) => a.consignee_position - b.consignee_position);

                                    order_group.map((item, i) => {
                                        let consignee_position = item?.consignee_position || 0;
                                        let consignee_code = (item?.consignee_code || '').trim();
                                        let delivery_early_appt = (item?.delivery_early_appt || '').trim();
                                        let delivery_late_appt = (item?.delivery_late_appt || '').trim();
                                        let delivery_date1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let delivery_time1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        let delivery_date2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let delivery_time2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (consignee_code !== '') {
                                            if (consignee_data.filter(x => x.position === consignee_position && x.code === consignee_code).length === 0) {
                                                consignee_data.push({ position: consignee_position, code: consignee_code });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === consignee_code.toLowerCase());

                                                if (consignee_customer) {
                                                    order.deliveries.push({
                                                        customer_id: consignee_customer.id,
                                                        code: consignee_code,
                                                        name: consignee_customer.name,
                                                        delivery_date1: delivery_date1,
                                                        delivery_date2: delivery_date2,
                                                        delivery_time1: delivery_time1,
                                                        delivery_time2: delivery_time2,
                                                        type: 'delivery'
                                                    })
                                                }
                                            }
                                        }

                                        return true;
                                    })

                                    // handle events
                                    order_group.map((item, i) => {
                                        let customer_code = (item?.customer_code || '').trim();
                                        let check_call = (item?.check_call || '').trim();
                                        let check_call_date = (item?.check_call_date || '').trim();
                                        let check_call_comment = (item?.check_call_comment || '').trim();
                                        let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (customer_code !== '') {
                                            if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'pickup').length === 0 &&
                                                check_call.toLowerCase().indexOf('pickup') > -1) {
                                                event_data.push({ customer_code, check_call_date, type: 'pickup' });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (shipper_customer) {
                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                        shipper_id: shipper_customer.id,
                                                        code: customer_code,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                        event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id,
                                                        timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                        type: 'pickup'
                                                    })
                                                }
                                            }

                                            if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'delivery').length === 0 &&
                                                check_call.toLowerCase().indexOf('delivered') > -1) {
                                                event_data.push({ customer_code, check_call_date, type: 'delivery' });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (consignee_customer) {
                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                        consignee_id: consignee_customer.id,
                                                        code: customer_code,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                        event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id,
                                                        timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                        type: 'delivery'
                                                    })
                                                }
                                            }
                                        }

                                        if (carrier_data.filter(x => x.check_call_comment === check_call_comment && x.check_call_date === check_call_date).length === 0 &&
                                            check_call.toLowerCase().indexOf('changed carrier') > -1) {
                                            carrier_data.push({ check_call_comment, check_call_date });

                                            let carrier_codes = check_call_comment.split(' ').filter(x => x === x.toUpperCase());
                                            let old_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[0].toLowerCase() || ''));
                                            let new_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[1].toLowerCase() || ''));

                                            order.events.push({
                                                event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'changed carrier').id,
                                                old_carrier_id: old_carrier?.id || null,
                                                new_carrier_id: new_carrier?.id || null,
                                                time: event_time,
                                                event_time: event_time,
                                                date: event_date,
                                                event_date: event_date,
                                                event_location: '',
                                                event_notes: `Changed Carrier from: "Old Carrier (${carrier_codes[0] || ''} - ${old_carrier?.name || ''})" to "New Carrier (${carrier_codes[1] || ''} - ${new_carrier?.name || ''})"`,
                                                user_code_id: props.user?.user_code?.id,
                                                timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                            })
                                        }

                                        if (comment_data.filter(x => x.check_call_date === check_call_date).length === 0 && check_call.toLowerCase().indexOf('comment') > -1) {
                                            comment_data.push({ check_call_date });

                                            order.events.push({
                                                event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'general comment').id,
                                                time: event_time,
                                                event_time: event_time,
                                                date: event_date,
                                                event_date: event_date,
                                                event_location: '',
                                                event_notes: check_call_comment,
                                                user_code_id: props.user?.user_code?.id,
                                                timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                            })
                                        }

                                        return true;
                                    });

                                    if (po_data !== '') {
                                        if (order.pickups.length === 1) {
                                            po_data = po_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                            order.pickups = order.pickups.map((p, i) => {
                                                if (i === 0) {
                                                    p.po_numbers = po_data;
                                                }

                                                return p;
                                            })
                                        } else if (order.pickups.length > 1) {
                                            po_data = po_data.split('/');

                                            order.pickups = order.pickups.map((p, i) => {
                                                p.po_numbers = (po_data[i] || '').trim();
                                                return p;
                                            })
                                        }
                                    }

                                    if (bol_data !== '') {
                                        if (order.pickups.length === 1) {
                                            bol_data = bol_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                            order.pickups = order.pickups.map((p, i) => {
                                                if (i === 0) {
                                                    p.bol_numbers = (bol_data || '');
                                                }

                                                return p;
                                            })
                                        } else if (order.pickups.length > 1) {
                                            bol_data = bol_data.split('/');

                                            order.pickups = order.pickups.map((p, i) => {
                                                p.bol_numbers = (bol_data[i] || '').trim();
                                                return p;
                                            })
                                        }
                                    }

                                    order.events.sort((a, b) => a.timestamp - b.timestamp);

                                    order.pickups.sort((a, b) => a.timestamp - b.timestamp);
                                    order.deliveries.sort((a, b) => a.timestamp - b.timestamp);

                                    order.routing = [
                                        ...order.pickups,
                                        ...order.deliveries
                                    ];

                                    let pos = 0;

                                    order.events.map((e, i) => {
                                        order.routing = order.routing.map(route => {
                                            if (e.code === route.code && e.type === route.type && (route.position || 0) === 0) {
                                                pos = pos + 1;
                                                route.position = pos;
                                            }

                                            return route;
                                        })

                                        return e;
                                    })

                                    order.routing.sort((a, b) => a.position - b.position);

                                    if (order.order_number === '30941') {
                                        console.log(order)
                                    }

                                    order_list.push(order);
                                }
                            }
                        } else {
                            if (last_order_number === order_number) {
                                order_group.push(row);

                                if (index === (order_list.length - 1)) {
                                    let bill_to_code = (order_group[0].bill_to_code || '').trim();
                                    let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                    if (bill_to_customer) {
                                        let order = {};
                                        let trip_number = (order_group[0].trip_number || '').trim();
                                        let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0].load_type || '').toLowerCase());
                                        let order_comments = (order_group[0].order_comments || '').trim();
                                        let internal_order_comments = (order_group[0].internal_order_comments || '').trim();
                                        let haz_mat = (order_group[0].haz_mat || '').toLowerCase() === '' ? 0 : (order_group[0].haz_mat || '').toLowerCase() === 'n' ? 0 : 1;
                                        let expedited = (order_group[0].expedited || '').toLowerCase() === '' ? 0 : (order_group[0].expedited || '').toLowerCase() === 'n' ? 0 : 1;
                                        let miles = (order_group[0].miles || 0);
                                        let creation_date = moment((order_group[0].creation_date || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                        let carrier_code = (order_group[0].carrier_code || '').trim();
                                        let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                        let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0].equipment_type || '')).toLowerCase())?.id || null;

                                        order.order_number = last_order_number;
                                        order.trip_number = trip_number === '' ? null : trip_number;
                                        order.load_type = load_type;
                                        order.load_type_id = load_type?.id || null;
                                        order.bill_to_customer = bill_to_customer;
                                        order.carrier = carrier;
                                        order.equipment_id = equipment_id;
                                        order.haz_mat = haz_mat;
                                        order.expedited = expedited;
                                        order.miles = miles;
                                        order.order_date_time = creation_date;
                                        order.user_code_id = props.user?.user_code?.id;
                                        order.customer_rating = [];
                                        order.carrier_rating = [];
                                        order.pickups = [];
                                        order.deliveries = [];
                                        order.events = [];
                                        order.internal_notes = [];
                                        order.notes_for_carrier = [];

                                        //handle notes for carrier
                                        let original_note = order_comments;

                                        if (order_comments !== '') {
                                            order_comments = order_comments.split(':');

                                            if (order_comments.length === 3) {
                                                let message = order_comments.pop();
                                                order_comments = order_comments.join(':');
                                                order_comments = order_comments.split(' ');
                                                order_comments.shift();
                                                order_comments.pop();
                                                let date_time = moment(order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.notes_for_carrier.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (order_comments.length === 4) {
                                                let message = order_comments.pop();
                                                order_comments = order_comments.join(':');
                                                order_comments = order_comments.split(' ');
                                                order_comments.shift();
                                                order_comments.pop();
                                                let date_time = moment(order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.notes_for_carrier.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (order_comments.length === 1) {
                                                let message = order_comments.join(':');

                                                order.notes_for_carrier.push({
                                                    date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            }
                                        }

                                        //handle internal notes
                                        original_note = internal_order_comments;

                                        if (internal_order_comments !== '') {
                                            internal_order_comments = internal_order_comments.split(':');

                                            if (internal_order_comments.length === 3) {
                                                let message = internal_order_comments.pop();
                                                internal_order_comments = internal_order_comments.join(':');
                                                internal_order_comments = internal_order_comments.split(' ');
                                                internal_order_comments.shift();
                                                internal_order_comments.pop();
                                                let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.internal_notes.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (internal_order_comments.length === 4) {
                                                let message = internal_order_comments.pop();
                                                internal_order_comments = internal_order_comments.join(':');
                                                internal_order_comments = internal_order_comments.split(' ');
                                                internal_order_comments.shift();
                                                internal_order_comments.pop();
                                                let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.internal_notes.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (internal_order_comments.length === 1) {
                                                let message = internal_order_comments.join(':');

                                                order.internal_notes.push({
                                                    date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            }
                                        }

                                        // handle order ratings
                                        let rate_data = [];

                                        order_group.map((item, x) => {
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                            if (check_call.toLowerCase() === 'begin segment') {
                                                let customer_rate = {};
                                                let carrier_rate = {};
                                                let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                                let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                                let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                                let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                                let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                                let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

                                                if (rate_data.filter(x => x.description === description && x.charges === charges).length === 0) {
                                                    rate_data.push({ description, charges });

                                                    if (order_number === '30022') {
                                                        console.log(description, charges, rate_data);
                                                    }

                                                    if (description !== '') {
                                                        if (charges > 0) {
                                                            customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                            customer_rate.description = description;
                                                            customer_rate.total_charges = charges;

                                                            if (order.customer_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                                customer_rate.pieces = pieces;
                                                                customer_rate.pieces_unit = pieces_unit;
                                                                customer_rate.weight = weight;
                                                            }

                                                            if (order.carrier_rating.find(x => x.rate_type_id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                                carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                                carrier_rate.description = description;
                                                                carrier_rate.total_charges = cost;
                                                                carrier_rate.pieces = pieces;
                                                                carrier_rate.pieces_unit = pieces_unit;
                                                                carrier_rate.weight = weight;
                                                            } else {
                                                                carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                                carrier_rate.description = description;
                                                            }
                                                        } else {
                                                            customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            customer_rate.description = description;

                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            carrier_rate.description = description;
                                                        }

                                                        order.customer_rating.push(customer_rate);
                                                        order.carrier_rating.push(carrier_rate);
                                                    }
                                                }
                                            }


                                            return item;
                                        });

                                        let shipper_data = [];
                                        let consignee_data = [];
                                        let event_data = [];
                                        let carrier_data = [];
                                        let comment_data = [];
                                        let routing_position = 0;
                                        let po_data = '';
                                        let bol_data = '';

                                        // handle pickups
                                        order_group.sort((a, b) => a.shipper_position - b.shipper_position);

                                        order_group.map((item, i) => {
                                            let shipper_position = item?.shipper_position || 0;
                                            let shipper_code = (item?.shipper_code || '').trim();
                                            let pickup_early_appt = (item?.pickup_early_appt || '').trim();
                                            let pickup_late_appt = (item?.pickup_late_appt || '').trim();
                                            let pickup_date1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let pickup_time1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            let pickup_date2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let pickup_time2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            po_data = (item?.po_number || '').trim();
                                            bol_data = (item?.bol_number || '').trim();

                                            if (shipper_code !== '') {
                                                if (shipper_data.filter(x => x.position = shipper_position && x.code === shipper_code).length === 0) {
                                                    shipper_data.push({ position: shipper_position, code: shipper_code });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === shipper_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        order.pickups.push({
                                                            customer_id: shipper_customer.id,
                                                            code: shipper_code,
                                                            name: shipper_customer.name,
                                                            pu_date1: pickup_date1,
                                                            pu_date2: pickup_date2,
                                                            pu_time1: pickup_time1,
                                                            pu_time2: pickup_time2,
                                                            type: 'pickup'
                                                        })
                                                    }
                                                }
                                            }

                                            return true;
                                        })

                                        // handle deliveries
                                        order_group.sort((a, b) => a.consignee_position - b.consignee_position);

                                        order_group.map((item, i) => {
                                            let consignee_position = item?.consignee_position || 0;
                                            let consignee_code = (item?.consignee_code || '').trim();
                                            let delivery_early_appt = (item?.delivery_early_appt || '').trim();
                                            let delivery_late_appt = (item?.delivery_late_appt || '').trim();
                                            let delivery_date1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let delivery_time1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            let delivery_date2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let delivery_time2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (consignee_code !== '') {
                                                if (consignee_data.filter(x => x.position = consignee_position && x.code === consignee_code).length === 0) {
                                                    consignee_data.push({ position: consignee_position, code: consignee_code });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === consignee_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        order.deliveries.push({
                                                            customer_id: consignee_customer.id,
                                                            code: consignee_code,
                                                            name: consignee_customer.name,
                                                            delivery_date1: delivery_date1,
                                                            delivery_date2: delivery_date2,
                                                            delivery_time1: delivery_time1,
                                                            delivery_time2: delivery_time2,
                                                            type: 'delivery'
                                                        })
                                                    }
                                                }
                                            }

                                            return true;
                                        })

                                        // handle events
                                        order_group.map((item, i) => {
                                            let customer_code = (item?.customer_code || '').trim();
                                            let check_call = (item?.check_call || '').trim();
                                            let check_call_date = (item?.check_call_date || '').trim();
                                            let check_call_comment = (item?.check_call_comment || '').trim();
                                            let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (customer_code !== '') {
                                                if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'pickup').length === 0 &&
                                                    check_call.toLowerCase().indexOf('pickup') > -1) {
                                                    event_data.push({ customer_code, check_call_date, type: 'pickup' });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                            shipper_id: shipper_customer.id,
                                                            code: customer_code,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                            event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id,
                                                            timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                            type: 'pickup'
                                                        })
                                                    }
                                                }

                                                if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'delivery').length === 0 &&
                                                    check_call.toLowerCase().indexOf('delivered') > -1) {
                                                    event_data.push({ customer_code, check_call_date, type: 'delivery' });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                            consignee_id: consignee_customer.id,
                                                            code: customer_code,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                            event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id,
                                                            timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                            type: 'delivery'
                                                        })
                                                    }
                                                }
                                            }

                                            if (carrier_data.filter(x => x.check_call_comment === check_call_comment && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('changed carrier') > -1) {
                                                carrier_data.push({ check_call_comment, check_call_date });

                                                let carrier_codes = check_call_comment.split(' ').filter(x => x === x.toUpperCase());
                                                let old_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[0].toLowerCase() || ''));
                                                let new_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[1].toLowerCase() || ''));

                                                order.events.push({
                                                    event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'changed carrier').id,
                                                    old_carrier_id: old_carrier?.id || null,
                                                    new_carrier_id: new_carrier?.id || null,
                                                    time: event_time,
                                                    event_time: event_time,
                                                    date: event_date,
                                                    event_date: event_date,
                                                    event_location: '',
                                                    event_notes: `Changed Carrier from: "Old Carrier (${carrier_codes[0] || ''} - ${old_carrier?.name || ''})" to "New Carrier (${carrier_codes[1] || ''} - ${new_carrier?.name || ''})"`,
                                                    user_code_id: props.user?.user_code?.id,
                                                    timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                                })
                                            }

                                            if (comment_data.filter(x => x.check_call_date === check_call_date).length === 0 && check_call.toLowerCase().indexOf('comment') > -1) {
                                                comment_data.push({ check_call_date });

                                                order.events.push({
                                                    event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'general comment').id,
                                                    time: event_time,
                                                    event_time: event_time,
                                                    date: event_date,
                                                    event_date: event_date,
                                                    event_location: '',
                                                    event_notes: check_call_comment,
                                                    user_code_id: props.user?.user_code?.id,
                                                    timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                                })
                                            }

                                            return true;
                                        });

                                        if (po_data !== '') {
                                            if (order.pickups.length === 1) {
                                                po_data = po_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    if (i === 0) {
                                                        p.po_numbers = po_data;
                                                    }

                                                    return p;
                                                })
                                            } else if (order.pickups.length > 1) {
                                                po_data = po_data.split('/');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    p.po_numbers = (po_data[i] || '').trim();
                                                    return p;
                                                })
                                            }
                                        }

                                        if (bol_data !== '') {
                                            if (order.pickups.length === 1) {
                                                bol_data = bol_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    if (i === 0) {
                                                        p.bol_numbers = (bol_data || '');
                                                    }

                                                    return p;
                                                })
                                            } else if (order.pickups.length > 1) {
                                                bol_data = bol_data.split('/');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    p.bol_numbers = (bol_data[i] || '').trim();
                                                    return p;
                                                })
                                            }
                                        }

                                        order.events.sort((a, b) => a.timestamp - b.timestamp);

                                        order.pickups.sort((a, b) => a.timestamp - b.timestamp);
                                        order.deliveries.sort((a, b) => a.timestamp - b.timestamp);

                                        order.routing = [
                                            ...order.pickups,
                                            ...order.deliveries
                                        ];

                                        let pos = 0;

                                        order.events.map((e, i) => {
                                            order.routing = order.routing.map(route => {
                                                if (e.code === route.code && e.type === route.type && (route.position || 0) === 0) {
                                                    pos = pos + 1;
                                                    route.position = pos;
                                                }

                                                return route;
                                            })

                                            return e;
                                        })

                                        order.routing.sort((a, b) => a.position - b.position);

                                        if (order.order_number === '30941') {
                                            console.log(order)
                                        }

                                        order_list.push(order);
                                    }
                                }
                            } else {
                                let bill_to_code = (order_group[0].bill_to_code || '').trim();
                                let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                if (bill_to_customer) {
                                    let order = {};
                                    let trip_number = (order_group[0].trip_number || '').trim();
                                    let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0].load_type || '').toLowerCase());
                                    let order_comments = (order_group[0].order_comments || '').trim();
                                    let internal_order_comments = (order_group[0].internal_order_comments || '').trim();
                                    let haz_mat = (order_group[0].haz_mat || '').toLowerCase() === '' ? 0 : (order_group[0].haz_mat || '').toLowerCase() === 'n' ? 0 : 1;
                                    let expedited = (order_group[0].expedited || '').toLowerCase() === '' ? 0 : (order_group[0].expedited || '').toLowerCase() === 'n' ? 0 : 1;
                                    let miles = (order_group[0].miles || 0);
                                    let creation_date = moment((order_group[0].creation_date || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                    let carrier_code = (order_group[0].carrier_code || '').trim();
                                    let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                    let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0].equipment_type || '')).toLowerCase())?.id || null;

                                    order.order_number = last_order_number;
                                    order.trip_number = trip_number === '' ? null : trip_number;
                                    order.load_type = load_type;
                                    order.load_type_id = load_type?.id || null;
                                    order.bill_to_customer = bill_to_customer;
                                    order.carrier = carrier;
                                    order.equipment_id = equipment_id;
                                    order.haz_mat = haz_mat;
                                    order.expedited = expedited;
                                    order.miles = miles;
                                    order.order_date_time = creation_date;
                                    order.user_code_id = props.user?.user_code?.id;
                                    order.customer_rating = [];
                                    order.carrier_rating = [];
                                    order.pickups = [];
                                    order.deliveries = [];
                                    order.events = [];
                                    order.internal_notes = [];
                                    order.notes_for_carrier = [];

                                    //handle notes for carrier
                                    let original_note = order_comments;

                                    if (order_comments !== '') {
                                        order_comments = order_comments.split(':');

                                        if (order_comments.length === 3) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = moment(order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.notes_for_carrier.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 4) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = moment(order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.notes_for_carrier.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 1) {
                                            let message = order_comments.join(':');

                                            order.notes_for_carrier.push({
                                                date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }
                                    }

                                    //handle internal notes
                                    original_note = internal_order_comments;

                                    if (internal_order_comments !== '') {
                                        internal_order_comments = internal_order_comments.split(':');

                                        if (internal_order_comments.length === 3) {
                                            let message = internal_order_comments.pop();
                                            internal_order_comments = internal_order_comments.join(':');
                                            internal_order_comments = internal_order_comments.split(' ');
                                            internal_order_comments.shift();
                                            internal_order_comments.pop();
                                            let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.internal_notes.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (internal_order_comments.length === 4) {
                                            let message = internal_order_comments.pop();
                                            internal_order_comments = internal_order_comments.join(':');
                                            internal_order_comments = internal_order_comments.split(' ');
                                            internal_order_comments.shift();
                                            internal_order_comments.pop();
                                            let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                            if ((date_time.year() || 0) > 2000) {
                                                date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                if ((date_time || '').toLowerCase() === 'invalid date') {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }
                                            } else {
                                                message = original_note;
                                                date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                            }

                                            order.internal_notes.push({
                                                date_time: date_time,
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (internal_order_comments.length === 1) {
                                            let message = internal_order_comments.join(':');

                                            order.internal_notes.push({
                                                date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }
                                    }

                                    // handle order ratings
                                    let rate_data = [];

                                    order_group.map((item, x) => {
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                        if (check_call.toLowerCase() === 'begin segment') {
                                            let customer_rate = {};
                                            let carrier_rate = {};
                                            let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                            let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                            let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                            let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                            let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                            let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

                                            if (rate_data.filter(x => x.description === description && x.charges === charges).length === 0) {
                                                rate_data.push({ description, charges });

                                                if (order_number === '30022') {
                                                    console.log(description, charges, rate_data);
                                                }

                                                if (description !== '') {
                                                    if (charges > 0) {
                                                        customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                        customer_rate.description = description;
                                                        customer_rate.total_charges = charges;

                                                        if (order.customer_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                            customer_rate.pieces = pieces;
                                                            customer_rate.pieces_unit = pieces_unit;
                                                            customer_rate.weight = weight;
                                                        }

                                                        if (order.carrier_rating.find(x => x.rate_type_id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                            carrier_rate.description = description;
                                                            carrier_rate.total_charges = cost;
                                                            carrier_rate.pieces = pieces;
                                                            carrier_rate.pieces_unit = pieces_unit;
                                                            carrier_rate.weight = weight;
                                                        } else {
                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            carrier_rate.description = description;
                                                        }
                                                    } else {
                                                        customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                        customer_rate.description = description;

                                                        carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                        carrier_rate.description = description;
                                                    }

                                                    order.customer_rating.push(customer_rate);
                                                    order.carrier_rating.push(carrier_rate);
                                                }
                                            }
                                        }


                                        return item;
                                    });

                                    let shipper_data = [];
                                    let consignee_data = [];
                                    let event_data = [];
                                    let carrier_data = [];
                                    let comment_data = [];
                                    let routing_position = 0;
                                    let po_data = '';
                                    let bol_data = '';

                                    // handle pickups
                                    order_group.sort((a, b) => a.shipper_position - b.shipper_position);

                                    order_group.map((item, i) => {
                                        let shipper_position = item?.shipper_position || 0;
                                        let shipper_code = (item?.shipper_code || '').trim();
                                        let pickup_early_appt = (item?.pickup_early_appt || '').trim();
                                        let pickup_late_appt = (item?.pickup_late_appt || '').trim();
                                        let pickup_date1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let pickup_time1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        let pickup_date2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let pickup_time2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        po_data = (item?.po_number || '').trim();
                                        bol_data = (item?.bol_number || '').trim();

                                        if (shipper_code !== '') {
                                            if (shipper_data.filter(x => x.position = shipper_position && x.code === shipper_code).length === 0) {
                                                shipper_data.push({ position: shipper_position, code: shipper_code });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === shipper_code.toLowerCase());

                                                if (shipper_customer) {
                                                    order.pickups.push({
                                                        customer_id: shipper_customer.id,
                                                        code: shipper_code,
                                                        name: shipper_customer.name,
                                                        pu_date1: pickup_date1,
                                                        pu_date2: pickup_date2,
                                                        pu_time1: pickup_time1,
                                                        pu_time2: pickup_time2,
                                                        type: 'pickup'
                                                    })
                                                }
                                            }
                                        }

                                        return true;
                                    })

                                    // handle deliveries
                                    order_group.sort((a, b) => a.consignee_position - b.consignee_position);

                                    order_group.map((item, i) => {
                                        let consignee_position = item?.consignee_position || 0;
                                        let consignee_code = (item?.consignee_code || '').trim();
                                        let delivery_early_appt = (item?.delivery_early_appt || '').trim();
                                        let delivery_late_appt = (item?.delivery_late_appt || '').trim();
                                        let delivery_date1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let delivery_time1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                        let delivery_date2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let delivery_time2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (consignee_code !== '') {
                                            if (consignee_data.filter(x => x.position = consignee_position && x.code === consignee_code).length === 0) {
                                                consignee_data.push({ position: consignee_position, code: consignee_code });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === consignee_code.toLowerCase());

                                                if (consignee_customer) {
                                                    order.deliveries.push({
                                                        customer_id: consignee_customer.id,
                                                        code: consignee_code,
                                                        name: consignee_customer.name,
                                                        delivery_date1: delivery_date1,
                                                        delivery_date2: delivery_date2,
                                                        delivery_time1: delivery_time1,
                                                        delivery_time2: delivery_time2,
                                                        type: 'delivery'
                                                    })
                                                }
                                            }
                                        }

                                        return true;
                                    })

                                    // handle events
                                    order_group.map((item, i) => {
                                        let customer_code = (item?.customer_code || '').trim();
                                        let check_call = (item?.check_call || '').trim();
                                        let check_call_date = (item?.check_call_date || '').trim();
                                        let check_call_comment = (item?.check_call_comment || '').trim();
                                        let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (customer_code !== '') {
                                            if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'pickup').length === 0 &&
                                                check_call.toLowerCase().indexOf('pickup') > -1) {
                                                event_data.push({ customer_code, check_call_date, type: 'pickup' });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (shipper_customer) {
                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                        shipper_id: shipper_customer.id,
                                                        code: customer_code,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                        event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id,
                                                        timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                        type: 'pickup'
                                                    })
                                                }
                                            }

                                            if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'delivery').length === 0 &&
                                                check_call.toLowerCase().indexOf('delivered') > -1) {
                                                event_data.push({ customer_code, check_call_date, type: 'delivery' });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (consignee_customer) {
                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                        consignee_id: consignee_customer.id,
                                                        code: customer_code,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                        event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id,
                                                        timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                        type: 'delivery'
                                                    })
                                                }
                                            }
                                        }

                                        if (carrier_data.filter(x => x.check_call_comment === check_call_comment && x.check_call_date === check_call_date).length === 0 &&
                                            check_call.toLowerCase().indexOf('changed carrier') > -1) {
                                            carrier_data.push({ check_call_comment, check_call_date });

                                            let carrier_codes = check_call_comment.split(' ').filter(x => x === x.toUpperCase());
                                            let old_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[0].toLowerCase() || ''));
                                            let new_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[1].toLowerCase() || ''));

                                            order.events.push({
                                                event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'changed carrier').id,
                                                old_carrier_id: old_carrier?.id || null,
                                                new_carrier_id: new_carrier?.id || null,
                                                time: event_time,
                                                event_time: event_time,
                                                date: event_date,
                                                event_date: event_date,
                                                event_location: '',
                                                event_notes: `Changed Carrier from: "Old Carrier (${carrier_codes[0] || ''} - ${old_carrier?.name || ''})" to "New Carrier (${carrier_codes[1] || ''} - ${new_carrier?.name || ''})"`,
                                                user_code_id: props.user?.user_code?.id,
                                                timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                            })
                                        }

                                        if (comment_data.filter(x => x.check_call_date === check_call_date).length === 0 && check_call.toLowerCase().indexOf('comment') > -1) {
                                            comment_data.push({ check_call_date });

                                            order.events.push({
                                                event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'general comment').id,
                                                time: event_time,
                                                event_time: event_time,
                                                date: event_date,
                                                event_date: event_date,
                                                event_location: '',
                                                event_notes: check_call_comment,
                                                user_code_id: props.user?.user_code?.id,
                                                timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                            })
                                        }
                                        return true;
                                    });

                                    if (po_data !== '') {
                                        if (order.pickups.length === 1) {
                                            po_data = po_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                            order.pickups = order.pickups.map((p, i) => {
                                                if (i === 0) {
                                                    p.po_numbers = po_data;
                                                }

                                                return p;
                                            })
                                        } else if (order.pickups.length > 1) {
                                            po_data = po_data.split('/');

                                            order.pickups = order.pickups.map((p, i) => {
                                                p.po_numbers = (po_data[i] || '').trim();
                                                return p;
                                            })
                                        }
                                    }

                                    if (bol_data !== '') {
                                        if (order.pickups.length === 1) {
                                            bol_data = bol_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                            order.pickups = order.pickups.map((p, i) => {
                                                if (i === 0) {
                                                    p.bol_numbers = (bol_data || '');
                                                }

                                                return p;
                                            })
                                        } else if (order.pickups.length > 1) {
                                            bol_data = bol_data.split('/');

                                            order.pickups = order.pickups.map((p, i) => {
                                                p.bol_numbers = (bol_data[i] || '').trim();
                                                return p;
                                            })
                                        }
                                    }

                                    order.events.sort((a, b) => a.timestamp - b.timestamp);

                                    order.pickups.sort((a, b) => a.timestamp - b.timestamp);
                                    order.deliveries.sort((a, b) => a.timestamp - b.timestamp);

                                    order.routing = [
                                        ...order.pickups,
                                        ...order.deliveries
                                    ];

                                    let pos = 0;

                                    order.events.map((e, i) => {
                                        order.routing = order.routing.map(route => {
                                            if (e.code === route.code && e.type === route.type && (route.position || 0) === 0) {
                                                pos = pos + 1;
                                                route.position = pos;
                                            }

                                            return route;
                                        })

                                        return e;
                                    })

                                    order.routing.sort((a, b) => a.position - b.position);

                                    if (order.order_number === '30941') {
                                        console.log(order)
                                    }

                                    order_list.push(order);
                                }

                                last_order_number = order_number;
                                order_group = [];
                                order_group.push(row);

                                if (index === (order_list.length - 1)) {
                                    let bill_to_code = (order_group[0].bill_to_code || '').trim();
                                    let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                    if (bill_to_customer) {
                                        let order = {};
                                        let trip_number = (order_group[0].trip_number || '').trim();
                                        let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0].load_type || '').toLowerCase());
                                        let order_comments = (order_group[0].order_comments || '').trim();
                                        let internal_order_comments = (order_group[0].internal_order_comments || '').trim();
                                        let haz_mat = (order_group[0].haz_mat || '').toLowerCase() === '' ? 0 : (order_group[0].haz_mat || '').toLowerCase() === 'n' ? 0 : 1;
                                        let expedited = (order_group[0].expedited || '').toLowerCase() === '' ? 0 : (order_group[0].expedited || '').toLowerCase() === 'n' ? 0 : 1;
                                        let miles = (order_group[0].miles || 0);
                                        let creation_date = moment((order_group[0].creation_date || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                        let carrier_code = (order_group[0].carrier_code || '').trim();
                                        let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                        let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0].equipment_type || '')).toLowerCase())?.id || null;

                                        order.order_number = last_order_number;
                                        order.trip_number = trip_number === '' ? null : trip_number;
                                        order.load_type = load_type;
                                        order.load_type_id = load_type?.id || null;
                                        order.bill_to_customer = bill_to_customer;
                                        order.carrier = carrier;
                                        order.equipment_id = equipment_id;
                                        order.haz_mat = haz_mat;
                                        order.expedited = expedited;
                                        order.miles = miles;
                                        order.order_date_time = creation_date;
                                        order.user_code_id = props.user?.user_code?.id;
                                        order.customer_rating = [];
                                        order.carrier_rating = [];
                                        order.pickups = [];
                                        order.deliveries = [];
                                        order.events = [];
                                        order.internal_notes = [];
                                        order.notes_for_carrier = [];

                                        //handle notes for carrier
                                        let original_note = order_comments;

                                        if (order_comments !== '') {
                                            order_comments = order_comments.split(':');

                                            if (order_comments.length === 3) {
                                                let message = order_comments.pop();
                                                order_comments = order_comments.join(':');
                                                order_comments = order_comments.split(' ');
                                                order_comments.shift();
                                                order_comments.pop();
                                                let date_time = moment(order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.notes_for_carrier.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (order_comments.length === 4) {
                                                let message = order_comments.pop();
                                                order_comments = order_comments.join(':');
                                                order_comments = order_comments.split(' ');
                                                order_comments.shift();
                                                order_comments.pop();
                                                let date_time = moment(order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.notes_for_carrier.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (order_comments.length === 1) {
                                                let message = order_comments.join(':');

                                                order.notes_for_carrier.push({
                                                    date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            }
                                        }

                                        //handle internal notes
                                        original_note = internal_order_comments;

                                        if (internal_order_comments !== '') {
                                            internal_order_comments = internal_order_comments.split(':');

                                            if (internal_order_comments.length === 3) {
                                                let message = internal_order_comments.pop();
                                                internal_order_comments = internal_order_comments.join(':');
                                                internal_order_comments = internal_order_comments.split(' ');
                                                internal_order_comments.shift();
                                                internal_order_comments.pop();
                                                let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YY HH:mm');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.internal_notes.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (internal_order_comments.length === 4) {
                                                let message = internal_order_comments.pop();
                                                internal_order_comments = internal_order_comments.join(':');
                                                internal_order_comments = internal_order_comments.split(' ');
                                                internal_order_comments.shift();
                                                internal_order_comments.pop();
                                                let date_time = moment(internal_order_comments.join(' ').trim(), 'M/D/YYYY h:m:s A');

                                                if ((date_time.year() || 0) > 2000) {
                                                    date_time = date_time.format('YYYY-MM-DD HH:mm:ss');

                                                    if ((date_time || '').toLowerCase() === 'invalid date') {
                                                        message = original_note;
                                                        date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                    }
                                                } else {
                                                    message = original_note;
                                                    date_time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                }

                                                order.internal_notes.push({
                                                    date_time: date_time,
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            } else if (internal_order_comments.length === 1) {
                                                let message = internal_order_comments.join(':');

                                                order.internal_notes.push({
                                                    date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    text: message.trim(),
                                                    user_code_id: props.user?.user_code?.id
                                                });
                                            }
                                        }

                                        // handle order ratings
                                        let rate_data = [];

                                        order_group.map((item, x) => {
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                            if (check_call.toLowerCase() === 'begin segment') {
                                                let customer_rate = {};
                                                let carrier_rate = {};
                                                let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                                let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                                let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim().replace('$', '').replace(',', ''));
                                                let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                                let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                                let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

                                                if (rate_data.filter(x => x.description === description && x.charges === charges).length === 0) {
                                                    rate_data.push({ description, charges });

                                                    if (order_number === '30022') {
                                                        console.log(description, charges, rate_data);
                                                    }

                                                    if (description !== '') {
                                                        if (charges > 0) {
                                                            customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                            customer_rate.description = description;
                                                            customer_rate.total_charges = charges;

                                                            if (order.customer_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                                customer_rate.pieces = pieces;
                                                                customer_rate.pieces_unit = pieces_unit;
                                                                customer_rate.weight = weight;
                                                            }

                                                            if (order.carrier_rating.find(x => x.rate_type_id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
                                                                carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id;
                                                                carrier_rate.description = description;
                                                                carrier_rate.total_charges = cost;
                                                                carrier_rate.pieces = pieces;
                                                                carrier_rate.pieces_unit = pieces_unit;
                                                                carrier_rate.weight = weight;
                                                            } else {
                                                                carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                                carrier_rate.description = description;
                                                            }
                                                        } else {
                                                            customer_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            customer_rate.description = description;

                                                            carrier_rate.rate_type_id = (rateTypes || []).find(r => r.name.toLowerCase() === 'comment').id;
                                                            carrier_rate.description = description;
                                                        }

                                                        order.customer_rating.push(customer_rate);
                                                        order.carrier_rating.push(carrier_rate);
                                                    }
                                                }
                                            }


                                            return item;
                                        });

                                        let shipper_data = [];
                                        let consignee_data = [];
                                        let event_data = [];
                                        let carrier_data = [];
                                        let comment_data = [];
                                        let routing_position = 0;
                                        let po_data = '';
                                        let bol_data = '';

                                        // handle pickups
                                        order_group.sort((a, b) => a.shipper_position - b.shipper_position);

                                        order_group.map((item, i) => {
                                            let shipper_position = item?.shipper_position || 0;
                                            let shipper_code = (item?.shipper_code || '').trim();
                                            let pickup_early_appt = (item?.pickup_early_appt || '').trim();
                                            let pickup_late_appt = (item?.pickup_late_appt || '').trim();
                                            let pickup_date1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let pickup_time1 = pickup_early_appt === '' ? '' : moment(pickup_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            let pickup_date2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let pickup_time2 = pickup_late_appt === '' ? '' : moment(pickup_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            po_data = (item?.po_number || '').trim();
                                            bol_data = (item?.bol_number || '').trim();

                                            if (shipper_code !== '') {
                                                if (shipper_data.filter(x => x.position = shipper_position && x.code === shipper_code).length === 0) {
                                                    shipper_data.push({ position: shipper_position, code: shipper_code });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === shipper_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        order.pickups.push({
                                                            customer_id: shipper_customer.id,
                                                            code: shipper_code,
                                                            name: shipper_customer.name,
                                                            pu_date1: pickup_date1,
                                                            pu_date2: pickup_date2,
                                                            pu_time1: pickup_time1,
                                                            pu_time2: pickup_time2,
                                                            type: 'pickup'
                                                        })
                                                    }
                                                }
                                            }

                                            return true;
                                        })

                                        // handle deliveries
                                        order_group.sort((a, b) => a.consignee_position - b.consignee_position);

                                        order_group.map((item, i) => {
                                            let consignee_position = item?.consignee_position || 0;
                                            let consignee_code = (item?.consignee_code || '').trim();
                                            let delivery_early_appt = (item?.delivery_early_appt || '').trim();
                                            let delivery_late_appt = (item?.delivery_late_appt || '').trim();
                                            let delivery_date1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let delivery_time1 = delivery_early_appt === '' ? '' : moment(delivery_early_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');
                                            let delivery_date2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let delivery_time2 = delivery_late_appt === '' ? '' : moment(delivery_late_appt, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (consignee_code !== '') {
                                                if (consignee_data.filter(x => x.position = consignee_position && x.code === consignee_code).length === 0) {
                                                    consignee_data.push({ position: consignee_position, code: consignee_code });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === consignee_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        order.deliveries.push({
                                                            customer_id: consignee_customer.id,
                                                            code: consignee_code,
                                                            name: consignee_customer.name,
                                                            delivery_date1: delivery_date1,
                                                            delivery_date2: delivery_date2,
                                                            delivery_time1: delivery_time1,
                                                            delivery_time2: delivery_time2,
                                                            type: 'delivery'
                                                        })
                                                    }
                                                }
                                            }

                                            return true;
                                        })

                                        // handle events
                                        order_group.map((item, i) => {
                                            let customer_code = (item?.customer_code || '').trim();
                                            let check_call = (item?.check_call || '').trim();
                                            let check_call_date = (item?.check_call_date || '').trim();
                                            let check_call_comment = (item?.check_call_comment || '').trim();
                                            let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (customer_code !== '') {
                                                if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'pickup').length === 0 &&
                                                    check_call.toLowerCase().indexOf('pickup') > -1) {
                                                    event_data.push({ customer_code, check_call_date, type: 'pickup' });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                            shipper_id: shipper_customer.id,
                                                            code: customer_code,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                            event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id,
                                                            timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                            type: 'pickup'
                                                        })
                                                    }
                                                }

                                                if (event_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date && x.type === 'delivery').length === 0 &&
                                                    check_call.toLowerCase().indexOf('delivered') > -1) {
                                                    event_data.push({ customer_code, check_call_date, type: 'delivery' });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                            consignee_id: consignee_customer.id,
                                                            code: customer_code,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                            event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id,
                                                            timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix(),
                                                            type: 'delivery'
                                                        })
                                                    }
                                                }
                                            }

                                            if (carrier_data.filter(x => x.check_call_comment === check_call_comment && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('changed carrier') > -1) {
                                                carrier_data.push({ check_call_comment, check_call_date });

                                                let carrier_codes = check_call_comment.split(' ').filter(x => x === x.toUpperCase());
                                                let old_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[0].toLowerCase() || ''));
                                                let new_carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === (carrier_codes[1].toLowerCase() || ''));

                                                order.events.push({
                                                    event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'changed carrier').id,
                                                    old_carrier_id: old_carrier?.id || null,
                                                    new_carrier_id: new_carrier?.id || null,
                                                    time: event_time,
                                                    event_time: event_time,
                                                    date: event_date,
                                                    event_date: event_date,
                                                    event_location: '',
                                                    event_notes: `Changed Carrier from: "Old Carrier (${carrier_codes[0] || ''} - ${old_carrier?.name || ''})" to "New Carrier (${carrier_codes[1] || ''} - ${new_carrier?.name || ''})"`,
                                                    user_code_id: props.user?.user_code?.id,
                                                    timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                                })
                                            }

                                            if (comment_data.filter(x => x.check_call_date === check_call_date).length === 0 && check_call.toLowerCase().indexOf('comment') > -1) {
                                                comment_data.push({ check_call_date });

                                                order.events.push({
                                                    event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'general comment').id,
                                                    time: event_time,
                                                    event_time: event_time,
                                                    date: event_date,
                                                    event_date: event_date,
                                                    event_location: '',
                                                    event_notes: check_call_comment,
                                                    user_code_id: props.user?.user_code?.id,
                                                    timestamp: moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').unix()
                                                })
                                            }
                                            return true;
                                        });

                                        if (po_data !== '') {
                                            if (order.pickups.length === 1) {
                                                po_data = po_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    if (i === 0) {
                                                        p.po_numbers = po_data;
                                                    }

                                                    return p;
                                                })
                                            } else if (order.pickups.length > 1) {
                                                po_data = po_data.split('/');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    p.po_numbers = (po_data[i] || '').trim();
                                                    return p;
                                                })
                                            }
                                        }

                                        if (bol_data !== '') {
                                            if (order.pickups.length === 1) {
                                                bol_data = bol_data.split(' ').filter(s => s).join(' ').replace(' ', '-');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    if (i === 0) {
                                                        p.bol_numbers = (bol_data || '');
                                                    }

                                                    return p;
                                                })
                                            } else if (order.pickups.length > 1) {
                                                bol_data = bol_data.split('/');

                                                order.pickups = order.pickups.map((p, i) => {
                                                    p.bol_numbers = (bol_data[i] || '').trim();
                                                    return p;
                                                })
                                            }
                                        }

                                        order.events.sort((a, b) => a.timestamp - b.timestamp);

                                        order.pickups.sort((a, b) => a.timestamp - b.timestamp);
                                        order.deliveries.sort((a, b) => a.timestamp - b.timestamp);

                                        order.routing = [
                                            ...order.pickups,
                                            ...order.deliveries
                                        ];

                                        let pos = 0;

                                        order.events.map((e, i) => {
                                            order.routing = order.routing.map(route => {
                                                if (e.code === route.code && e.type === route.type && (route.position || 0) === 0) {
                                                    pos = pos + 1;
                                                    route.position = pos;
                                                }

                                                return route;
                                            })

                                            return e;
                                        })

                                        order.routing.sort((a, b) => a.position - b.position);

                                        if (order.order_number === '30941') {
                                            console.log(order)
                                        }

                                        order_list.push(order);
                                    }
                                }
                            }
                        }

                        return true;
                    });

                    setOrderTotalListLength(order_list.length);
                    setOrderList(order_list);
                    refInputFile.current.value = '';
                    setIsLoading(false);
                }).catch(err => {
                    console.log(err);
                    setIsLoading(false);
                })
            });

            promise.catch(err => {
                console.log('error reading file', err);
                setIsLoading(false);
                refInputFile.current.value = '';
            });
        }
    }

    const submitImport = () => {
        if (window.confirm('Are you sure you want to proceed?')) {
            setIsLoading(true);
            setIsSubmitting(true);

            if (orderList.length > 0) {
                let listToSend = orderList.map(item => {
                    let newItem = {
                        user_code_id: props.user?.user_code?.id,
                        order_number: item.order_number,
                        trip_number: item.trip_number,
                        load_type_id: item.load_type_id,
                        equipment_id: item.equipment_id,
                        haz_mat: item.haz_mat,
                        expedited: item.expedited,
                        miles: item.miles,
                        order_date_time: item.order_date_time,
                        bill_to_customer_id: item.bill_to_customer.id,
                        carrier_id: item.carrier?.id || null,
                        routing: item.routing,
                        notes_for_carrier: item.notes_for_carrier,
                        internal_notes: item.internal_notes,
                        customer_rating: item.customer_rating,
                        carrier_rating: item.carrier_rating,
                        events: item.events
                    }

                    return newItem
                });

                const chunkSize = 500;

                let chunkList = listToSend.map((e, i) => {
                    return i % chunkSize === 0 ? listToSend.slice(i, i + chunkSize) : null;
                }).filter(e => { return e; });

                setListTotal(chunkList.length);

                setGroupOrderList(chunkList);
            }
        }
    }

    useEffect(() => {
        refOrderImportContainer.current.focus({
            preventScroll: true
        })
    }, []);

    useEffect(() => {
        if (groupOrderList.length > 0) {
            processSubmit();
        } else {
            setIsLoading(false);
            setIsSubmitting(false);
            setOrderList([]);
            setListTotal(0);
            refInputFile.current.value = "";
        }
    }, [groupOrderList]);

    const processSubmit = () => {
        axios.post(props.serverUrl + '/submitOrderImport2', { list: groupOrderList[0] }).then(res => {
            console.log(res.data);
        }).catch(e => {
        }).finally(() => {
            setGroupOrderList(prev => {
                prev.shift();
                return [...prev];
            })
            // processSubmit();
        })
    }

    const submitBtnClasses = classNames({
        'mochi-button': true,
        'disabled': orderList.length === 0
    })

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
        <div className="panel-content" tabIndex={0} ref={refOrderImportContainer} onKeyDown={(e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                if (refInputFile.current.files.length > 0 || orderList.length > 0) {
                    refInputFile.current.value = '';
                    setOrderList([]);
                }else{
                    props.closingCallback();
                }
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper" style={{ flexDirection: 'column' }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                            {
                                !isSubmitting
                                    ? <div>please wait while file is being processed...</div>
                                    : <div className="progress-bar-container" style={{
                                        overflow: 'unset',
                                        width: '50%',
                                        marginTop: 10
                                    }}>
                                        <div
                                            className="progress-bar-title">{isNaN(Math.floor(((listTotal - groupOrderList.length) * 100) / listTotal)) ? 0 : Math.floor(((listTotal - groupOrderList.length) * 100) / listTotal)}%
                                        </div>
                                        <div className="progress-bar-wrapper"
                                            style={{ width: (isNaN(Math.floor(((listTotal - groupOrderList.length) * 100) / listTotal)) ? 0 : Math.floor(((listTotal - groupOrderList.length) * 100) / listTotal)) + '%' }}></div>
                                    </div>
                            }
                        </div>
                    </animated.div>
                )
            }

            <div className="import-buttons">
                <form encType='multipart/form-data' style={{ display: 'none' }}>
                    <input type="file" ref={refInputFile} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={inputFileChange} />
                </form>

                <div>
                    <div className="mochi-button" onClick={() => {
                        refInputFile.current.click();
                    }} style={{ marginRight: 10 }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Select File</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>

                    <div className="mochi-button" onClick={() => {
                        setOrderList([]);
                        // setCurrentCustomers([]);
                        refInputFile.current.value = "";
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>

                <div>
                    <div className={submitBtnClasses} onClick={() => {
                        submitImport();
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Submit</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
            </div>

            <div className="form-bordered-box import order" style={{
                marginTop: 10,
                marginBottom: 10
            }}>
                <div className="form-header">
                    <div className="top-border top-border-left"></div>
                    <div className="top-border top-border-middle"></div>
                    <div className="top-border top-border-right"></div>
                </div>

                <div className="import-body">
                    {
                        (orderList || []).length === 0
                            ? (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ width: '145%' }}>
                                        <div className="import-header-wrapper">
                                            <div className="trow">
                                                {/* <div className="tcol status">Status</div> */}
                                                <div className="tcol order">Order</div>
                                                <div className="tcol trip">Trip</div>
                                                <div className="tcol load-type">Load Type</div>
                                                <div className="tcol code">Bill-To Code</div>
                                                <div className="tcol name">Bill-To Name</div>
                                                <div className="tcol code">Carrier Code</div>
                                                <div className="tcol name">Carrier Name</div>
                                                <div className="shipper" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Nº of Pickups</div>
                                                </div>
                                                <div className="consignee" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Nº of Deliveries</div>
                                                </div>
                                                <div className="tcol revenue">Revenue</div>
                                                <div className="tcol cost">Cost</div>
                                                <div className="tcol date">Order Date</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                            : (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ display: 'table-row' }}>
                                        <div className="import-header-wrapper">
                                            <div className="trow">
                                                {/* <div className="tcol status">Status</div> */}
                                                <div className="tcol order">Order</div>
                                                <div className="tcol trip">Trip</div>
                                                <div className="tcol load-type">Load Type</div>
                                                <div className="tcol code">Bill-To Code</div>
                                                <div className="tcol name">Bill-To Name</div>
                                                <div className="tcol code">Carrier Code</div>
                                                <div className="tcol name">Carrier Name</div>
                                                <div className="shipper" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Nº of Pickups</div>
                                                </div>
                                                <div className="consignee" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Nº of Deliveries</div>
                                                </div>
                                                <div className="tcol revenue">Revenue</div>
                                                <div className="tcol cost">Cost</div>
                                                <div className="tcol date">Order Date</div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        orderList.map((order, index) => {

                                            // let parseCity = customer.city.toLowerCase().trim().replace(/\s/g, "").substring(0, 3);

                                            // if (parseCity.toLowerCase() === "ft.") {
                                            //     parseCity = "FO";
                                            // }
                                            // if (parseCity.toLowerCase() === "mt.") {
                                            //     parseCity = "MO";
                                            // }
                                            // if (parseCity.toLowerCase() === "st.") {
                                            //     parseCity = "SA";
                                            // }

                                            // const code = ((customer.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (customer.state || '').trim().replace(/\s/g, "").substring(0, 2)).toUpperCase();

                                            // customer.matches = currentCustomers.filter(cus => cus.code.toUpperCase() === code);

                                            const rowContainerClasses = classNames({
                                                'row-container': true,
                                                'hidden': false
                                            });

                                            const rowClasses = classNames({
                                                'trow': true,
                                                'save': true
                                            })

                                            const matchesContainerClasses = classNames({
                                                'matches-container': true,
                                                'shown': false
                                            })

                                            return (
                                                <div className={rowContainerClasses} key={index}>
                                                    <div className={rowClasses}>

                                                        <div className="tcol order">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.order_number || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol trip">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.trip_number || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol load-type">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.load_type?.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol code">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.bill_to_customer?.code || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.bill_to_customer?.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol code">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.carrier?.code || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.carrier?.name || ''}
                                                            />
                                                        </div>

                                                        <div className="shipper" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <div className="tcol code">{order.pickups.length}</div>
                                                        </div>
                                                        <div className="consignee" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <div className="tcol code">{order.deliveries.length}</div>
                                                        </div>

                                                        <div className="tcol revenue">
                                                            <NumberFormat
                                                                className={classnames({
                                                                    "negative-number":
                                                                        ((order.customer_rating || []).reduce((a, b) => {
                                                                            return a + (b?.total_charges || 0)
                                                                        }, 0)) < 0,
                                                                })}
                                                                style={{ fontSize: "0.7rem", textAlign: "center" }}
                                                                value={new Intl.NumberFormat("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(((order.customer_rating || []).reduce((a, b) => {
                                                                    return a + (b?.total_charges || 0)
                                                                }, 0)))}
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

                                                        <div className="tcol cost">
                                                            <NumberFormat
                                                                className={classnames({
                                                                    "negative-number":
                                                                        ((order.carrier_rating || []).reduce((a, b) => {
                                                                            return a + (b?.total_charges || 0)
                                                                        }, 0)) < 0,
                                                                })}
                                                                style={{ fontSize: "0.7rem", textAlign: "center" }}
                                                                value={new Intl.NumberFormat("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(((order.carrier_rating || []).reduce((a, b) => {
                                                                    return a + (b?.total_charges || 0)
                                                                }, 0)))}
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

                                                        <div className="tcol date">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.order_date_time || ''}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
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

})(OrderImport)