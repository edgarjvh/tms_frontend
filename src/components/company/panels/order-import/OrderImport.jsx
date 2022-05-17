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

    const inputFileChange = (e) => {
        let file = e.target.files[0];
        const maxSize = 104857600;

        if (FileReader && file) {
            if (file.size > maxSize) {
                window.alert("Selected file is too large, please select a file below 100mb");
                refInputFile.current.value = '';
                return;
            }

            const promise = new Promise((resolve, reject) => {
                setIsLoading(false);

                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: 'buffer' });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws);

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

                    let list = (res || []).map((item, index) => {
                        let status = [];
                        let order = item[Object.keys(item).find(key => ['order', 'order_number'].includes(key.toLowerCase()))] || '';
                        let trip = item[Object.keys(item).find(key => ['trip', 'trip_number'].includes(key.toLowerCase()))] || '';
                        let loadType = (loadTypes || []).find(l => l.name.toLowerCase() === (item[Object.keys(item).find(key => ['load_type', 'order_type'].includes(key.toLowerCase()))]).toLowerCase());
                        let hazMat = (item[Object.keys(item).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === '' ? 0 : (item[Object.keys(item).find(key => ['haz_mat', 'hazmat'].includes(key.toLowerCase()))] || '').toLowerCase() === 'n' ? 0 : 1;
                        let expedited = (item[Object.keys(item).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === '' ? 0 : (item[Object.keys(item).find(key => key.toLowerCase() === 'expedited')] || '').toLowerCase() === 'n' ? 0 : 1;
                        let miles = item[Object.keys(item).find(key => key.toLowerCase() === 'miles')] || 0;
                        let creation_date = (item[Object.keys(item).find(key => ['creation_date', 'order_date'].includes(key.toLowerCase()))] || '').toString();
                        let orderDateTime = moment(creation_date.trim(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');



                        let billToCode = (item[Object.keys(item).find(key => key.toLowerCase() === 'bill_to_code')] || '').toUpperCase();
                        let billtoCustomer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === billToCode);

                        if (billtoCustomer === undefined) {
                            status.push('BILL-TO DOESN\'T EXIST');
                        }

                        let carrierCode = item[Object.keys(item).find(key => key.toLowerCase() === 'carrier_code')];
                        let carrierCustomer = (carriers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === carrierCode);
                        let equipment = (equipments || []).find(e => e.name.toLowerCase() === ((item[Object.keys(item).find(key => key.toLowerCase() === 'equipment_type')] || '')).toLowerCase());

                        if (carrierCustomer === undefined) {
                            status.push('CARRIER DOESN\'T EXIST');
                        }

                        let refNumbers = item[Object.keys(item).find(key => key.toLowerCase() === 'reference_number1')] || '';
                        let refNumber2 = item[Object.keys(item).find(key => key.toLowerCase() === 'reference_number2')] || '';

                        if (refNumber2 !== '') {
                            if (refNumbers === '') {
                                refNumbers = refNumber2;
                            } else {
                                refNumbers += ' ' + refNumber2;
                            }
                        }

                        let shipperList = [];

                        let shipperCode = item[Object.keys(item).find(key => key.toLowerCase() === 'shipper1_code')];
                        let shipperAppointment = item[Object.keys(item).find(key => key.toLowerCase() === 'shipper1_appointment')] || '';
                        let shipperCustomer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === shipperCode);

                        if (shipperCustomer === undefined) {
                            status.push(`SHIPPER 1 DOESN\'T EXIST`);
                        } else {
                            if (moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('DD/MM/YYYY H:mm') === shipperAppointment.trim()) {
                                shipperCustomer.pu_date1 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                shipperCustomer.pu_time1 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                                shipperCustomer.pu_date2 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                shipperCustomer.pu_time2 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                            } else if (moment(shipperAppointment.trim(), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm') === shipperAppointment.trim()) {
                                shipperCustomer.pu_date1 = moment(shipperAppointment.trim(), 'DD/MM/YYYY HH:mm').format('MM/DD/YYYY');
                                shipperCustomer.pu_time1 = moment(shipperAppointment.trim(), 'DD/MM/YYYY HH:mm').format('HHmm');
                                shipperCustomer.pu_date2 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                shipperCustomer.pu_time2 = moment(shipperAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                            } else if (moment(shipperAppointment.trim(), 'DD/MM/YYYY').format('DD/MM/YYYY') === shipperAppointment.trim()) {
                                shipperCustomer.pu_date1 = moment(shipperAppointment.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                                shipperCustomer.pu_time1 = '0800';
                                shipperCustomer.pu_date2 = moment(shipperAppointment.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                                shipperCustomer.pu_time2 = '0800';
                            }

                            shipperCustomer.ref_numbers = refNumbers;
                        }

                        shipperList.push({
                            shipperCode: shipperCode,
                            shipperCustomer: shipperCustomer
                        });

                        let consigneeList = [];
                        let consigneeCode = item[Object.keys(item).find(key => key.toLowerCase() === 'consignee1_code')];
                        let consigneeAppointment = item[Object.keys(item).find(key => key.toLowerCase() === 'consignee1_appointment')] || '';
                        let consigneeCustomer = (customers || []).find(c => (c.code + (c.code_number === 0 ? '' : c.code_number)) === consigneeCode);

                        if (consigneeCustomer === undefined) {
                            status.push(`CONSIGNEE 1 DOESN\'T EXIST`);
                        } else {
                            if (moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('DD/MM/YYYY H:mm') === consigneeAppointment.trim()) {
                                consigneeCustomer.delivery_date1 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time1 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                                consigneeCustomer.delivery_date2 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time2 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                            } else if (moment(consigneeAppointment.trim(), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm') === consigneeAppointment.trim()) {
                                consigneeCustomer.delivery_date1 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY HH:mm').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time1 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY HH:mm').format('HHmm');
                                consigneeCustomer.delivery_date2 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time2 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                            } else if (moment(consigneeAppointment.trim(), 'DD/MM/YYYY').format('DD/MM/YYYY') === consigneeAppointment.trim()) {
                                consigneeCustomer.delivery_date1 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time1 = '0800';
                                consigneeCustomer.delivery_date2 = moment(consigneeAppointment.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                                consigneeCustomer.delivery_time2 = '0800';
                            }
                        }

                        consigneeList.push({
                            consigneeCode: consigneeCode,
                            consigneeCustomer: consigneeCustomer
                        });

                        let customerRating = {
                            rateTypeId: (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id,
                            description: item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '',
                            pieces: (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')],
                            piecesUnit: (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk',
                            weight: (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')],
                            total_charges: item[Object.keys(item).find(key => key.toLowerCase() === 'revenue')] || 0
                        };

                        let carrierRating = {
                            rateTypeId: (rateTypes || []).find(r => r.name.toLowerCase() === 'flat').id,
                            description: item[Object.keys(item).find(key => key.toLowerCase() === 'description')] || '',
                            pieces: (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')],
                            piecesUnit: (item[Object.keys(item).find(key => key.toLowerCase() === 'pieces')] || '0') === '0' ? '' : 'sk',
                            weight: (item[Object.keys(item).find(key => key.toLowerCase() === 'weight')] || '0') === '0' ? 0 : item[Object.keys(item).find(key => key.toLowerCase() === 'weight')],
                            total_charges: item[Object.keys(item).find(key => key.toLowerCase() === 'cost')] || 0
                        };

                        let firstPickCheckCall = item[Object.keys(item).find(key => key.toLowerCase() === 'first_pick_check_call')] || '';
                        let firstPickDate = '';
                        let firstPickTime = '';

                        if (moment(firstPickCheckCall.trim(), 'DD/MM/YYYY H:mm').format('DD/MM/YYYY H:mm') === firstPickCheckCall.trim()) {
                            firstPickDate = moment(firstPickCheckCall.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                            firstPickTime = moment(firstPickCheckCall.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                        } else if (moment(firstPickCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm') === firstPickCheckCall.trim()) {
                            firstPickDate = moment(firstPickCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('MM/DD/YYYY');
                            firstPickTime = moment(firstPickCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('HHmm');
                        } else if (moment(firstPickCheckCall.trim(), 'DD/MM/YYYY').format('DD/MM/YYYY') === firstPickCheckCall.trim()) {
                            firstPickDate = moment(firstPickCheckCall.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                            firstPickTime = '0800';
                        }

                        let loadedEvent = {
                            isValid: firstPickCheckCall !== '',
                            eventTypeId: (eventTypes || []).find(e => e.name.toLowerCase() === 'loaded').id,
                            time: firstPickTime,
                            date: firstPickDate,
                            eventTime: firstPickTime,
                            eventDate: firstPickDate,
                            eventLocation: shipperList.length > 0 ? shipperList[0].shipperCustomer?.city + ', ' + shipperList[0].shipperCustomer?.state : '',
                            eventNotes: shipperList.length > 0 ? 'Loaded at Shipper ' + shipperList[0].shipperCode + ' - ' + shipperList[0].shipperCustomer?.name : '',
                        }

                        let lastDeliveryCheckCall = item[Object.keys(item).find(key => key.toLowerCase() === 'last_delivery_check_call')] || '';
                        let lastDeliveryDate = '';
                        let lastDeliveryTime = '';

                        if (moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY H:mm').format('DD/MM/YYYY H:mm') === lastDeliveryCheckCall.trim()) {
                            lastDeliveryDate = moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY H:mm').format('MM/DD/YYYY');
                            lastDeliveryTime = moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY H:mm').format('HHmm');
                        } else if (moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm') === lastDeliveryCheckCall.trim()) {
                            lastDeliveryDate = moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('MM/DD/YYYY');
                            lastDeliveryTime = moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY HH:mm').format('HHmm');
                        } else if (moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY').format('DD/MM/YYYY') === lastDeliveryCheckCall.trim()) {
                            lastDeliveryDate = moment(lastDeliveryCheckCall.trim(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                            lastDeliveryTime = '0800';
                        }

                        let deliveredEvent = {
                            isValid: lastDeliveryCheckCall !== '',
                            eventTypeId: (eventTypes || []).find(e => e.name.toLowerCase() === 'delivered').id,
                            time: lastDeliveryTime,
                            date: lastDeliveryDate,
                            eventTime: lastDeliveryTime,
                            eventDate: lastDeliveryDate,
                            eventLocation: consigneeList.length > 0 ? consigneeList[consigneeList.length - 1].consigneeCustomer?.city + ', ' + consigneeList[consigneeList.length - 1].consigneeCustomer?.state : '',
                            eventNotes: consigneeList.length > 0 ? 'Delivered at Consignee ' + consigneeList[consigneeList.length - 1].consigneeCode + ' - ' + consigneeList[consigneeList.length - 1].consigneeCustomer?.name : '',
                        }

                        item = {
                            order: order,
                            trip: trip,
                            loadType: loadType,
                            hazMat: hazMat,
                            expedited: expedited,
                            miles: miles,
                            orderDateTime: orderDateTime,
                            billToCode: billToCode,
                            billToCustomer: billtoCustomer,
                            carrierCode: carrierCode,
                            carrierCustomer: carrierCustomer,
                            equipment: equipment,
                            shipperList: shipperList,
                            consigneeList: consigneeList,
                            customerRating: customerRating,
                            carrierRating: carrierRating,
                            loadedEvent: loadedEvent,
                            deliveredEvent: deliveredEvent,
                            status: status
                        }

                        return item;
                    });

                    setOrderTotalListLength(list.length);
                    setOrderList(list);
                    console.log(list);
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
            processSubmit();


        }
    }

    const processSubmit = () => {
        if (orderList.length) {
            let listToSend = orderList.map(item => {
                let newItem = {
                    order: item.order,
                    trip: item.trip,
                    loadTypeId: item.loadType.id || 0,
                    hazMat: item.hazMat,
                    expedited: item.expedited,
                    miles: item.miles || 0,
                    orderDateTime: item.orderDateTime,
                    billToCustomerId: item.billToCustomer?.id || 0,
                    carrierId: item.carrierCustomer?.id || 0,
                    equipmentTypeId: item.equipment?.id || 0,
                    shipperCustomerId: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.id || 0 : 0,
                    pu_date1: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.pu_date1 || '' : '',
                    pu_date2: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.pu_date2 || '' : '',
                    pu_time1: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.pu_time1 || '' : '',
                    pu_time2: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.pu_time2 || '' : '',
                    ref_numbers: item.shipperList.length > 0 ? item.shipperList[0].shipperCustomer?.ref_numbers || '' : '',
                    consigneeCustomerId: item.consigneeList.length > 0 ? item.consigneeList[0].consigneeCustomer?.id || 0 : 0,
                    delivery_date1: item.consigneeList.length > 0 ? item.consigneeList[0].consigneeCustomer?.delivery_date1 || '' : '',
                    delivery_date2: item.consigneeList.length > 0 ? item.consigneeList[0].consigneeCustomer?.delivery_date2 || '' : '',
                    delivery_time1: item.consigneeList.length > 0 ? item.consigneeList[0].consigneeCustomer?.delivery_time1 || '' : '',
                    delivery_time2: item.consigneeList.length > 0 ? item.consigneeList[0].consigneeCustomer?.delivery_time2 || '' : '',
                    customerRating: item.customerRating,
                    carrierRating: item.carrierRating,
                    loadedEvent: item.loadedEvent,
                    deliveredEvent: item.deliveredEvent,
                }

                return newItem
            })
            axios.post(props.serverUrl + '/submitOrderImport2', { list: listToSend }).then(res => {
                console.log(orderList.length, res.data)
            }).catch(e => {
                console.log(orderList.length, e)
            }).finally(() => {                
                setIsLoading(false);
                setIsSubmitting(false);
                setOrderList([]);                
                refInputFile.current.value = "";
            })
        } else {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    }

    // const processSubmit = () => {
    //     if (orderList.length) {            
    //         axios.post(props.serverUrl + '/submitOrderImport', {
    //             order: orderList[0].order,
    //             trip: orderList[0].trip,
    //             loadTypeId: orderList[0].loadType.id || 0,
    //             hazMat: orderList[0].hazMat,
    //             expedited: orderList[0].expedited,
    //             miles: orderList[0].miles || 0,
    //             orderDateTime: orderList[0].orderDateTime,
    //             billToCustomerId: orderList[0].billToCustomer?.id || 0,
    //             carrierId: orderList[0].carrierCustomer?.id || 0,
    //             equipmentTypeId: orderList[0].equipment?.id || 0,
    //             shipperCustomerId: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.id || 0 : 0,
    //             pu_date1: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.pu_date1 || '' : '',
    //             pu_date2: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.pu_date2 || '' : '',
    //             pu_time1: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.pu_time1 || '' : '',
    //             pu_time2: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.pu_time2 || '' : '',
    //             ref_numbers: orderList[0].shipperList.length > 0 ? orderList[0].shipperList[0].shipperCustomer?.ref_numbers || '' : '',
    //             consigneeCustomerId: orderList[0].consigneeList.length > 0 ? orderList[0].consigneeList[0].consigneeCustomer?.id || 0 : 0,
    //             delivery_date1: orderList[0].consigneeList.length > 0 ? orderList[0].consigneeList[0].consigneeCustomer?.delivery_date1 || '' : '',
    //             delivery_date2: orderList[0].consigneeList.length > 0 ? orderList[0].consigneeList[0].consigneeCustomer?.delivery_date2 || '' : '',
    //             delivery_time1: orderList[0].consigneeList.length > 0 ? orderList[0].consigneeList[0].consigneeCustomer?.delivery_time1 || '' : '',
    //             delivery_time2: orderList[0].consigneeList.length > 0 ? orderList[0].consigneeList[0].consigneeCustomer?.delivery_time2 || '' : '',
    //             customerRating: orderList[0].customerRating,
    //             carrierRating: orderList[0].carrierRating,
    //             loadedEvent: orderList[0].loadedEvent,
    //             deliveredEvent: orderList[0].deliveredEvent,
    //         }).then(res => {
    //             console.log(orderList.length, res.data)
    //         }).catch(e => {
    //             console.log(orderList.length, e)
    //         }).finally(() => {
    //             orderList.shift();
    //             setOrderCurrentListLength(orderTotalListLength - orderList.length);
    //             processSubmit();
    //         })
    //     } else {
    //         setIsLoading(false);
    //         setIsSubmitting(false);
    //     }
    // }

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
                            {/* {
                                isSubmitting &&
                                <div style={{
                                    position: 'relative',
                                    width: '90%',
                                    maxWidth: '600px',
                                    height: 15,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                    display: 'flex',
                                    backgroundColor: 'lightgray',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ fontSize: '12px', zIndex: 1 }}>{orderCurrentListLength} of {orderTotalListLength} | {Math.floor((orderCurrentListLength / orderTotalListLength) * 100)}%</div>
                                    <div style={{
                                        background: 'linear-gradient(to bottom, rgba(122,188,255,1) 0%,rgba(96,171,248,1) 50%,rgba(64,150,238,1) 100%)',
                                        position: 'absolute',
                                        height: '100%',
                                        top: 0,
                                        left: 0,
                                        width: (Math.floor((orderCurrentListLength / orderTotalListLength) * 100)) + '%'
                                    }}></div>
                                </div>
                            } */}
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
                                                    <div className="tcol code">Shipper Code</div>
                                                    <div className="tcol name">Shipper Name</div>
                                                </div>
                                                <div className="consignee" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Consignee Code</div>
                                                    <div className="tcol name">Consignee Name</div>
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
                                                    <div className="tcol code">Shipper Code</div>
                                                    <div className="tcol name">Shipper Name</div>
                                                </div>
                                                <div className="consignee" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="tcol code">Consignee Code</div>
                                                    <div className="tcol name">Consignee Name</div>
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
                                                                value={order.order || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol trip">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.trip || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol load-type">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.loadType?.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol code">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.billToCustomer?.code || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.billToCustomer?.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol code">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.carrierCustomer?.code || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text" readOnly={true}
                                                                onChange={(e) => { }}
                                                                value={order.carrierCustomer?.name || ''}
                                                            />
                                                        </div>

                                                        {
                                                            (order.shipperList || []).map((shipper, index) => {
                                                                return (
                                                                    <div className="shipper" key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div className="tcol code">
                                                                            <input type="text" readOnly={true}
                                                                                onChange={(e) => { }}
                                                                                value={shipper.shipperCustomer?.code || ''}
                                                                            />
                                                                        </div>
                                                                        <div className="tcol name">
                                                                            <input type="text" readOnly={true}
                                                                                onChange={(e) => { }}
                                                                                value={shipper.shipperCustomer?.name || ''}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        {
                                                            (order.consigneeList || []).map((consignee, index) => {
                                                                return (
                                                                    <div className="consignee" key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div className="tcol code">
                                                                            <input type="text" readOnly={true}
                                                                                onChange={(e) => { }}
                                                                                value={consignee.consigneeCustomer?.code || ''}
                                                                            />
                                                                        </div>
                                                                        <div className="tcol name">
                                                                            <input type="text" readOnly={true}
                                                                                onChange={(e) => { }}
                                                                                value={consignee.consigneeCustomer?.name || ''}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="tcol revenue">
                                                            <NumberFormat
                                                                className={classnames({
                                                                    "negative-number":
                                                                        (order.customerRating?.total_charges || 0) < 0,
                                                                })}
                                                                style={{ fontSize: "0.7rem", textAlign: "center" }}
                                                                value={new Intl.NumberFormat("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format((order.customerRating?.total_charges || 0)
                                                                )}
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
                                                                        (order.carrierRating?.total_charges || 0) < 0,
                                                                })}
                                                                style={{ fontSize: "0.7rem", textAlign: "center" }}
                                                                value={new Intl.NumberFormat("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format((order.carrierRating?.total_charges || 0)
                                                                )}
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
                                                                value={order.orderDateTime || ''}
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