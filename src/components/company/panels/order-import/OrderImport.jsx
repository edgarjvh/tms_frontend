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
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
} from './../../../../actions';

import * as XLSX from 'xlsx';
import classNames from 'classnames';

const OrderImport = (props) => {
    const refInputFile = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [groupOrderList, setGroupOrderList] = useState([]);
    const [orderTotalListLength, setOrderTotalListLength] = useState(0);
    const [orderCurrentListLength, setOrderCurrentListLength] = useState(0);
    const [customersShown, setCustomersShown] = useState([]);
    const [ordersRelatedData, setOrdersRelatedData] = useState({});
    const [linesRead, setLinesRead] = useState(0);
    const [readingLines, setReadingLines] = useState(false);


    const [shipperCounter, setShipperCounter] = useState(1);
    const [consigneeCounter, setConsigneeCounter] = useState(1);

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
                        let order_number = (row[Object.keys(row).find(key => ['order', 'order_number'].includes(key.toLowerCase()))] || '').trim();

                        if (last_order_number === '') {
                            order_group.push(row);
                            last_order_number = order_number;

                            if (index === (order_list.length - 1)) {
                                let bill_to_code = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'bill_to_code')] || '');
                                let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                if (bill_to_customer) {
                                    let order = {};
                                    let trip_number = (order_group[0][Object.keys(order_group[0]).find(key => ['trip', 'trip_number'].includes(key.toLowerCase()))] || '').trim();
                                    let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0][Object.keys(order_group[0]).find(key => ['load_type', 'order_type'].includes(key.toLowerCase()))]).toLowerCase());
                                    let order_comments = (order_group[0][Object.keys(order_group[0]).find(key => ['order_comments'].includes(key.toLowerCase()))] || '');
                                    let haz_mat = (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === 'n' ? 0 : 1;
                                    let expedited = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === 'n' ? 0 : 1;
                                    let miles = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'miles')] || 0;
                                    let creation_date = moment((order_group[0][Object.keys(order_group[0]).find(key => ['creation_date', 'order_date'].includes(key.toLowerCase()))] || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                    let carrier_code = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'carrier_code')];
                                    let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                    let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'equipment_type')] || '')).toLowerCase())?.id || null;

                                    order.order_number = last_order_number;
                                    order.trip_number = trip_number;
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

                                    //handle internal notes
                                    order_comments = order_comments.split(':');

                                    if (order_comments.length === 3) {
                                        let message = order_comments.pop();
                                        order_comments = order_comments.join(':');
                                        order_comments = order_comments.split(' ');
                                        order_comments.shift();
                                        order_comments.pop();
                                        let date_time = order_comments.join(' ');

                                        order.internal_notes.push({
                                            date_time: moment(date_time.trim(), 'M/D/YY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                                            text: message.trim(),
                                            user_code_id: props.user?.user_code?.id
                                        });
                                    } else if (order_comments.length === 4) {
                                        let message = order_comments.pop();
                                        order_comments = order_comments.join(':');
                                        order_comments = order_comments.split(' ');
                                        order_comments.shift();
                                        order_comments.pop();
                                        let date_time = order_comments.join(' ');

                                        order.internal_notes.push({
                                            date_time: moment(date_time.trim(), 'M/D/YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'),
                                            text: message.trim(),
                                            user_code_id: props.user?.user_code?.id
                                        });
                                    }

                                    // handle order ratings
                                    order_group.map((item, x) => {
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                        if (check_call.toLowerCase() === 'begin segment') {
                                            let customer_rate = {};
                                            let carrier_rate = {};
                                            let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                            let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim());
                                            let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim());
                                            let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                            let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                            let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

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

                                                    if (order.carrier_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
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


                                        return item;
                                    });

                                    // handle pickups, deliveries and events
                                    let shipper_data = [];
                                    let consignee_data = [];
                                    let carrier_data = [];
                                    let comment_data = [];
                                    let routing_position = 0;
                                    let po_data = '';
                                    let bol_data = '';

                                    order_group.map((item, i) => {
                                        let customer_code = (item[Object.keys(item).find(key => ['customer_code'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call_date = (item[Object.keys(item).find(key => ['check_call_date'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call_comment = (item[Object.keys(item).find(key => ['check_call_comment'].includes(key.toLowerCase()))] || '').trim();
                                        po_data = (item[Object.keys(item).find(key => ['po_number'].includes(key.toLowerCase()))] || '').trim();
                                        bol_data = (item[Object.keys(item).find(key => ['bol_number'].includes(key.toLowerCase()))] || '').trim();
                                        let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (customer_code !== '') {
                                            if (shipper_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('pickup') > -1) {
                                                shipper_data.push({ customer_code, check_call_date });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (shipper_customer) {
                                                    routing_position = routing_position + 1;

                                                    order.pickups.push({
                                                        customer_id: shipper_customer.id,
                                                        code: customer_code,
                                                        name: shipper_customer.name,
                                                        routing_position: routing_position
                                                    })

                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                        shipper_id: shipper_customer.id,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                        event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id
                                                    })
                                                }
                                            }

                                            if (consignee_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('delivered') > -1) {
                                                consignee_data.push({ customer_code, check_call_date });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (consignee_customer) {
                                                    routing_position = routing_position + 1;

                                                    order.deliveries.push({
                                                        customer_id: consignee_customer.id,
                                                        code: customer_code,
                                                        name: consignee_customer.name,
                                                        routing_position: routing_position
                                                    })

                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                        consignee_id: consignee_customer.id,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                        event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id
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
                                                user_code_id: props.user?.user_code?.id
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
                                                user_code_id: props.user?.user_code?.id
                                            })
                                        }

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

                                    order_list.push(order);
                                }
                            }
                        } else {
                            if (last_order_number === order_number) {
                                order_group.push(row);

                                if (index === (order_list.length - 1)) {
                                    let bill_to_code = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'bill_to_code')] || '');
                                    let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                    if (bill_to_customer) {
                                        let order = {};
                                        let trip_number = (order_group[0][Object.keys(order_group[0]).find(key => ['trip', 'trip_number'].includes(key.toLowerCase()))] || '').trim();
                                        let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0][Object.keys(order_group[0]).find(key => ['load_type', 'order_type'].includes(key.toLowerCase()))]).toLowerCase());
                                        let order_comments = (order_group[0][Object.keys(order_group[0]).find(key => ['order_comments'].includes(key.toLowerCase()))] || '');
                                        let haz_mat = (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === 'n' ? 0 : 1;
                                        let expedited = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === 'n' ? 0 : 1;
                                        let miles = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'miles')] || 0;
                                        let creation_date = moment((order_group[0][Object.keys(order_group[0]).find(key => ['creation_date', 'order_date'].includes(key.toLowerCase()))] || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                        let carrier_code = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'carrier_code')];
                                        let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                        let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'equipment_type')] || '')).toLowerCase())?.id || null;

                                        order.order_number = last_order_number;
                                        order.trip_number = trip_number;
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

                                        //handle internal notes
                                        order_comments = order_comments.split(':');

                                        if (order_comments.length === 3) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = order_comments.join(' ');

                                            order.internal_notes.push({
                                                date_time: moment(date_time.trim(), 'M/D/YY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 4) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = order_comments.join(' ');

                                            order.internal_notes.push({
                                                date_time: moment(date_time.trim(), 'M/D/YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }

                                        // handle order ratings
                                        order_group.map((item, x) => {
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                            if (check_call.toLowerCase() === 'begin segment') {
                                                let customer_rate = {};
                                                let carrier_rate = {};
                                                let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                                let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim());
                                                let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim());
                                                let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                                let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                                let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

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

                                                        if (order.carrier_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
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


                                            return item;
                                        });

                                        // handle pickups, deliveries and events
                                        let shipper_data = [];
                                        let consignee_data = [];
                                        let carrier_data = [];
                                        let comment_data = [];
                                        let routing_position = 0;
                                        let po_data = '';
                                        let bol_data = '';

                                        order_group.map((item, i) => {
                                            let customer_code = (item[Object.keys(item).find(key => ['customer_code'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call_date = (item[Object.keys(item).find(key => ['check_call_date'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call_comment = (item[Object.keys(item).find(key => ['check_call_comment'].includes(key.toLowerCase()))] || '').trim();
                                            po_data = (item[Object.keys(item).find(key => ['po_number'].includes(key.toLowerCase()))] || '').trim();
                                            bol_data = (item[Object.keys(item).find(key => ['bol_number'].includes(key.toLowerCase()))] || '').trim();
                                            let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (customer_code !== '') {
                                                if (shipper_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                    check_call.toLowerCase().indexOf('pickup') > -1) {
                                                    shipper_data.push({ customer_code, check_call_date });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        routing_position = routing_position + 1;

                                                        order.pickups.push({
                                                            customer_id: shipper_customer.id,
                                                            code: customer_code,
                                                            name: shipper_customer.name,
                                                            routing_position: routing_position
                                                        })

                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                            shipper_id: shipper_customer.id,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                            event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id
                                                        })
                                                    }
                                                }

                                                if (consignee_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                    check_call.toLowerCase().indexOf('delivered') > -1) {
                                                    consignee_data.push({ customer_code, check_call_date });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        routing_position = routing_position + 1;

                                                        order.deliveries.push({
                                                            customer_id: consignee_customer.id,
                                                            code: customer_code,
                                                            name: consignee_customer.name,
                                                            routing_position: routing_position
                                                        })

                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                            consignee_id: consignee_customer.id,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                            event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id
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
                                                    user_code_id: props.user?.user_code?.id
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
                                                    user_code_id: props.user?.user_code?.id
                                                })
                                            }

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

                                        order_list.push(order);
                                    }
                                }
                            } else {
                                let bill_to_code = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'bill_to_code')] || '');
                                let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                if (bill_to_customer) {
                                    let order = {};
                                    let trip_number = (order_group[0][Object.keys(order_group[0]).find(key => ['trip', 'trip_number'].includes(key.toLowerCase()))] || '').trim();
                                    let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0][Object.keys(order_group[0]).find(key => ['load_type', 'order_type'].includes(key.toLowerCase()))]).toLowerCase());
                                    let order_comments = (order_group[0][Object.keys(order_group[0]).find(key => ['order_comments'].includes(key.toLowerCase()))] || '');
                                    let haz_mat = (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === 'n' ? 0 : 1;
                                    let expedited = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === 'n' ? 0 : 1;
                                    let miles = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'miles')] || 0;
                                    let creation_date = moment((order_group[0][Object.keys(order_group[0]).find(key => ['creation_date', 'order_date'].includes(key.toLowerCase()))] || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                    let carrier_code = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'carrier_code')];
                                    let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                    let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'equipment_type')] || '')).toLowerCase())?.id || null;

                                    order.order_number = last_order_number;
                                    order.trip_number = trip_number;
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

                                    //handle internal notes
                                    order_comments = order_comments.split(':');

                                    if (order_comments.length === 3) {
                                        let message = order_comments.pop();
                                        order_comments = order_comments.join(':');
                                        order_comments = order_comments.split(' ');
                                        order_comments.shift();
                                        order_comments.pop();
                                        let date_time = order_comments.join(' ');

                                        order.internal_notes.push({
                                            date_time: moment(date_time.trim(), 'M/D/YY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                                            text: message.trim(),
                                            user_code_id: props.user?.user_code?.id
                                        });
                                    } else if (order_comments.length === 4) {
                                        let message = order_comments.pop();
                                        order_comments = order_comments.join(':');
                                        order_comments = order_comments.split(' ');
                                        order_comments.shift();
                                        order_comments.pop();
                                        let date_time = order_comments.join(' ');

                                        order.internal_notes.push({
                                            date_time: moment(date_time.trim(), 'M/D/YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'),
                                            text: message.trim(),
                                            user_code_id: props.user?.user_code?.id
                                        });
                                    }

                                    // handle order ratings
                                    order_group.map((item, x) => {
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                        if (check_call.toLowerCase() === 'begin segment') {
                                            let customer_rate = {};
                                            let carrier_rate = {};
                                            let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                            let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim());
                                            let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim());
                                            let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                            let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                            let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

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

                                                    if (order.carrier_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
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


                                        return item;
                                    });

                                    // handle pickups, deliveries and events
                                    let shipper_data = [];
                                    let consignee_data = [];
                                    let carrier_data = [];
                                    let comment_data = [];
                                    let routing_position = 0;
                                    let po_data = '';
                                    let bol_data = '';

                                    order_group.map((item, i) => {
                                        let customer_code = (item[Object.keys(item).find(key => ['customer_code'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call_date = (item[Object.keys(item).find(key => ['check_call_date'].includes(key.toLowerCase()))] || '').trim();
                                        let check_call_comment = (item[Object.keys(item).find(key => ['check_call_comment'].includes(key.toLowerCase()))] || '').trim();
                                        po_data = (item[Object.keys(item).find(key => ['po_number'].includes(key.toLowerCase()))] || '').trim();
                                        bol_data = (item[Object.keys(item).find(key => ['bol_number'].includes(key.toLowerCase()))] || '').trim();
                                        let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                        let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                        if (customer_code !== '') {
                                            if (shipper_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('pickup') > -1) {
                                                shipper_data.push({ customer_code, check_call_date });

                                                let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (shipper_customer) {
                                                    routing_position = routing_position + 1;

                                                    order.pickups.push({
                                                        customer_id: shipper_customer.id,
                                                        code: customer_code,
                                                        name: shipper_customer.name,
                                                        routing_position: routing_position
                                                    })

                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                        shipper_id: shipper_customer.id,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                        event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id
                                                    })
                                                }
                                            }

                                            if (consignee_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                check_call.toLowerCase().indexOf('delivered') > -1) {
                                                consignee_data.push({ customer_code, check_call_date });

                                                let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                if (consignee_customer) {
                                                    routing_position = routing_position + 1;

                                                    order.deliveries.push({
                                                        customer_id: consignee_customer.id,
                                                        code: customer_code,
                                                        name: consignee_customer.name,
                                                        routing_position: routing_position
                                                    })

                                                    order.events.push({
                                                        event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                        consignee_id: consignee_customer.id,
                                                        time: event_time,
                                                        event_time: event_time,
                                                        date: event_date,
                                                        event_date: event_date,
                                                        event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                        event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                        user_code_id: props.user?.user_code?.id
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
                                                user_code_id: props.user?.user_code?.id
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
                                                user_code_id: props.user?.user_code?.id
                                            })
                                        }

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

                                    order_list.push(order);
                                }

                                last_order_number = order_number;
                                order_group = [];
                                order_group.push(row);

                                if (index === (order_list.length - 1)) {
                                    let bill_to_code = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'bill_to_code')] || '');
                                    let bill_to_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === bill_to_code.toLowerCase());

                                    if (bill_to_customer) {
                                        let order = {};
                                        let trip_number = (order_group[0][Object.keys(order_group[0]).find(key => ['trip', 'trip_number'].includes(key.toLowerCase()))] || '').trim();
                                        let load_type = (loadTypes || []).find(l => l.name.toLowerCase() === (order_group[0][Object.keys(order_group[0]).find(key => ['load_type', 'order_type'].includes(key.toLowerCase()))]).toLowerCase());
                                        let order_comments = (order_group[0][Object.keys(order_group[0]).find(key => ['order_comments'].includes(key.toLowerCase()))] || '');
                                        let haz_mat = (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === 'n' ? 0 : 1;
                                        let expedited = (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === '' ? 0 : (order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === 'n' ? 0 : 1;
                                        let miles = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'miles')] || 0;
                                        let creation_date = moment((order_group[0][Object.keys(order_group[0]).find(key => ['creation_date', 'order_date'].includes(key.toLowerCase()))] || '').toString().trim(), 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                                        let carrier_code = order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'carrier_code')];
                                        let carrier = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrier_code);

                                        let equipment_id = (equipments || []).find(e => e.name.toLowerCase() === ((order_group[0][Object.keys(order_group[0]).find(key => key.toLowerCase() === 'equipment_type')] || '')).toLowerCase())?.id || null;

                                        order.order_number = last_order_number;
                                        order.trip_number = trip_number;
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

                                        //handle internal notes
                                        order_comments = order_comments.split(':');

                                        if (order_comments.length === 3) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = order_comments.join(' ');

                                            order.internal_notes.push({
                                                date_time: moment(date_time.trim(), 'M/D/YY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        } else if (order_comments.length === 4) {
                                            let message = order_comments.pop();
                                            order_comments = order_comments.join(':');
                                            order_comments = order_comments.split(' ');
                                            order_comments.shift();
                                            order_comments.pop();
                                            let date_time = order_comments.join(' ');

                                            order.internal_notes.push({
                                                date_time: moment(date_time.trim(), 'M/D/YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'),
                                                text: message.trim(),
                                                user_code_id: props.user?.user_code?.id
                                            });
                                        }

                                        // handle order ratings
                                        order_group.map((item, x) => {
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();

                                            if (check_call.toLowerCase() === 'begin segment') {
                                                let customer_rate = {};
                                                let carrier_rate = {};
                                                let description = item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '';
                                                let charges = Number((item[Object.keys(item).find(key => ['charges'].includes(key.toLowerCase()))] || 0).toString().trim());
                                                let cost = Number((item[Object.keys(item).find(key => ['cost'].includes(key.toLowerCase()))] || 0).toString().trim());
                                                let pieces = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')];
                                                let pieces_unit = (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk';
                                                let weight = (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')];

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

                                                        if (order.carrier_rating.find(x => x.id === (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id) === undefined) {
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


                                            return item;
                                        });

                                        // handle pickups, deliveries and events
                                        let shipper_data = [];
                                        let consignee_data = [];
                                        let carrier_data = [];
                                        let comment_data = [];
                                        let routing_position = 0;
                                        let po_data = '';
                                        let bol_data = '';

                                        order_group.map((item, i) => {
                                            let customer_code = (item[Object.keys(item).find(key => ['customer_code'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call = (item[Object.keys(item).find(key => ['check_call'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call_date = (item[Object.keys(item).find(key => ['check_call_date'].includes(key.toLowerCase()))] || '').trim();
                                            let check_call_comment = (item[Object.keys(item).find(key => ['check_call_comment'].includes(key.toLowerCase()))] || '').trim();
                                            po_data = (item[Object.keys(item).find(key => ['po_number'].includes(key.toLowerCase()))] || '').trim();
                                            bol_data = (item[Object.keys(item).find(key => ['bol_number'].includes(key.toLowerCase()))] || '').trim();
                                            let event_date = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('MM/DD/YYYY');
                                            let event_time = moment(check_call_date, 'MM/DD/YYYY HH:mm:ss').format('HHmm');

                                            if (customer_code !== '') {
                                                if (shipper_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                    check_call.toLowerCase().indexOf('pickup') > -1) {
                                                    shipper_data.push({ customer_code, check_call_date });

                                                    let shipper_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (shipper_customer) {
                                                        routing_position = routing_position + 1;

                                                        order.pickups.push({
                                                            customer_id: shipper_customer.id,
                                                            code: customer_code,
                                                            name: shipper_customer.name,
                                                            routing_position: routing_position
                                                        })

                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                                                            shipper_id: shipper_customer.id,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: shipper_customer.city + ' ' + shipper_customer.state.toUpperCase(),
                                                            event_notes: `Loaded at Shipper ${customer_code} - ${shipper_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id
                                                        })
                                                    }
                                                }

                                                if (consignee_data.filter(x => x.customer_code === customer_code && x.check_call_date === check_call_date).length === 0 &&
                                                    check_call.toLowerCase().indexOf('delivered') > -1) {
                                                    consignee_data.push({ customer_code, check_call_date });

                                                    let consignee_customer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)).toLowerCase() === customer_code.toLowerCase());

                                                    if (consignee_customer) {
                                                        routing_position = routing_position + 1;

                                                        order.deliveries.push({
                                                            customer_id: consignee_customer.id,
                                                            code: customer_code,
                                                            name: consignee_customer.name,
                                                            routing_position: routing_position
                                                        })

                                                        order.events.push({
                                                            event_type_id: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                                                            consignee_id: consignee_customer.id,
                                                            time: event_time,
                                                            event_time: event_time,
                                                            date: event_date,
                                                            event_date: event_date,
                                                            event_location: consignee_customer.city + ' ' + consignee_customer.state.toUpperCase(),
                                                            event_notes: `Delivered at Consignee ${customer_code} - ${consignee_customer.name}`,
                                                            user_code_id: props.user?.user_code?.id
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
                                                    user_code_id: props.user?.user_code?.id
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
                                                    user_code_id: props.user?.user_code?.id
                                                })
                                            }

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
                        pickups: item.pickups,
                        deliveries: item.deliveries,
                        internal_notes: item.internal_notes,
                        customer_rating: item.customer_rating,
                        carrier_rating: item.carrier_rating,
                        events: item.events
                    }

                    return newItem
                });

                const chunkSize = 500;

                setGroupOrderList(listToSend.map((e, i) => {
                    return i % chunkSize === 0 ? listToSend.slice(i, i + chunkSize) : null;
                }).filter(e => { return e; }));
            }
        }
    }

    useEffect(() => {
        if (groupOrderList.length > 0) {
            processSubmit();
        }
    }, [groupOrderList]);

    const processSubmit = () => {
        if (groupOrderList.length) {
            axios.post(props.serverUrl + '/submitOrderImport2', { list: groupOrderList[0] }).then(res => {
                console.log(res.data);
            }).catch(e => {

            }).finally(() => {
                groupOrderList.shift();
                processSubmit();
            })
        } else {
            setIsLoading(false);
            setIsSubmitting(false);
            setOrderList([]);
            refInputFile.current.value = "";
        }
    }

    const submitBtnClasses = classNames({
        'mochi-button': true,
        'disabled': orderList.length === 0
    })

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper" style={{ flexDirection: 'column' }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                            {
                                !isSubmitting &&
                                <div>please wait while file is being processed...</div>
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
                                                'hidden': false,
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
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
})(OrderImport)