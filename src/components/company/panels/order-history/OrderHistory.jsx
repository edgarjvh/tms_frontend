import React, {useState, useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import './OrderHistory.css';
import MaskedInput from 'react-text-mask';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import {useTransition, useSpring, animated, Transition, config} from 'react-spring';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretRight, faCalendarAlt, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {useDetectClickOutside} from "react-detect-click-outside";
import {CalendarPopup, Calendar} from './../../panels';
import moment from 'moment';
import axios from 'axios';
import NumberFormat from 'react-number-format';
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

import {
    Dispatch
} from './../../../company';

const OrderHistory = (props) => {
    const [isDateStartCalendarShown, setIsDateStartCalendarShown] = useState(false);
    const [isDateEndCalendarShown, setIsDateEndCalendarShown] = useState(false);

    const refDateStart = useRef();
    const refDateEnd = useRef();

    const [preSelectedDateStart, setPreSelectedDateStart] = useState(moment());
    const [preSelectedDateEnd, setPreSelectedDateEnd] = useState(moment());

    const refDateStartCalendarDropDown = useDetectClickOutside({
        onTriggered: () => {
            setIsDateStartCalendarShown(false)
        }
    });
    const refDateEndCalendarDropDown = useDetectClickOutside({
        onTriggered: () => {
            setIsDateEndCalendarShown(false)
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: {opacity: 0, display: 'block'},
        enter: {opacity: 1, display: 'block'},
        leave: {opacity: 0, display: 'none'},
        reverse: isLoading,
    });

    const [noOrdersFound, setNoOrdersFound] = useState(false);
    const [orders, setOrders] = useState([]);

    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [cityOrigin, setCityOrigin] = useState('');
    const [cityDestination, setCityDestination] = useState('');
    const [stateOrigin, setStateOrigin] = useState('');
    const [stateDestination, setStateDestination] = useState('');
    const [zipOrigin, setZipOrigin] = useState('');
    const [zipDestination, setZipDestination] = useState('');
    const [billToCode, setBillToCode] = useState('');
    const [customerCode, setCustomerCode] = useState('');
    const [showCustomerTotals, setShowCustomerTotals] = useState(true);
    const [showYearTotals, setShowYearTotals] = useState(false);
    const [showMonthTotals, setShowMonthTotals] = useState(false);

    const [url, setUrl] = useState('/getOrderHistoryCustomer');

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

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            await setUrl(props.suborigin === 'customer' ? '/getOrderHistoryCustomer' : '/getOrderHistoryCarrier');
            resolve('OK');
        }).then(response => {
            if ((props.selectedCustomer?.id || 0) > 0) {
                let customer_code = props.selectedCustomer.code + (props.selectedCustomer.code_number === 0 ? '' : props.selectedCustomer.code_number);

                setCustomerCode(customer_code);

                setIsLoading(true);

                axios.post(props.serverUrl + (props.suborigin === 'customer' ? '/getOrderHistoryCustomer' : '/getOrderHistoryCarrier'), {
                    customer_id: props.selectedCustomer?.id || 0,
                    carrier_id: props.selectedCustomer?.id || 0,
                    bill_to_code: billToCode,
                    customer_code: customer_code,
                    carrier_code: customer_code,
                    date_start: dateStart,
                    date_end: dateEnd,
                    city_origin: (cityOrigin || '').trim(),
                    city_destination: (cityDestination || '').trim(),
                    state_origin: (stateOrigin || '').trim(),
                    state_destination: (stateDestination || '').trim(),
                    zip_origin: (zipOrigin || '').trim(),
                    zip_destination: (zipDestination || '').trim(),
                    origin: props.suborigin,
                    for_revenue: true
                }).then(res => {
                    if (res.data.result === 'OK') {
                        let newOrders = res.data.orders.map(order => order);

                        let currentMonth = '';
                        let currentYear = '';
                        let lastMonth = '';
                        let lastYear = '';
                        let groupedOrders = [];
                        let currentDateGroup = [];
                        let currentOrderGroup = [];

                        newOrders.map((order, index) => {
                            currentMonth = moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM');
                            currentYear = moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY');

                            if (customer_code === '') {
                                order.isOnBillTo = false;
                                order.isOnShipper = false;
                                order.isOnConsignee = false;
                            } else {
                                order.isOnBillTo = ((order.bill_to_company?.code || '') + ((order.bill_to_company?.code_number || 0) === 0 ? '' : order.bill_to_company.code_number)) === customer_code.toUpperCase();
                                order.isOnShipper = order.pickups.find(x => (x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number) === customer_code.toUpperCase()) !== undefined;
                                order.isOnConsignee = order.deliveries.find(x => (x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number) === customer_code.toUpperCase()) !== undefined;
                            }

                            if (lastYear === '') {
                                lastYear = currentYear;
                                lastMonth = currentMonth;
                                currentOrderGroup.push(order);

                                if (index === newOrders.length - 1) {
                                    groupedOrders.push({
                                        year: lastYear,
                                        months: [{
                                            month: lastMonth,
                                            year: lastYear,
                                            orders: currentOrderGroup,
                                            showMonthGroup: true
                                        }],
                                        showYearGroup: true
                                    });
                                }

                            } else {
                                if (lastYear !== currentYear) {
                                    currentDateGroup.push({
                                        month: lastMonth,
                                        year: lastYear,
                                        orders: currentOrderGroup,
                                        showMonthGroup: true
                                    });

                                    groupedOrders.push({
                                        year: lastYear,
                                        months: currentDateGroup,
                                        showYearGroup: true
                                    });

                                    lastMonth = currentMonth;
                                    lastYear = currentYear;
                                    currentDateGroup = [];
                                    currentOrderGroup = [];

                                    currentOrderGroup.push(order);

                                    if (index === newOrders.length - 1) {
                                        groupedOrders.push({
                                            year: lastYear,
                                            months: [{
                                                month: lastMonth,
                                                year: lastYear,
                                                orders: currentOrderGroup,
                                                showMonthGroup: true
                                            }],
                                            showYearGroup: true
                                        });
                                    }
                                } else {
                                    if (lastMonth !== currentMonth) {
                                        currentDateGroup.push({
                                            month: lastMonth,
                                            year: lastYear,
                                            orders: currentOrderGroup,
                                            showMonthGroup: true
                                        });

                                        lastMonth = currentMonth;
                                        lastYear = currentYear;

                                        currentOrderGroup = [];
                                        currentOrderGroup.push(order);

                                        if (index === newOrders.length - 1) {
                                            currentDateGroup.push({
                                                month: lastMonth,
                                                year: lastYear,
                                                orders: currentOrderGroup,
                                                showMonthGroup: true
                                            });

                                            groupedOrders.push({
                                                year: lastYear,
                                                months: currentDateGroup,
                                                showYearGroup: true
                                            });
                                        }
                                    } else {
                                        currentOrderGroup.push(order);

                                        if (index === newOrders.length - 1) {
                                            currentDateGroup.push({
                                                month: lastMonth,
                                                year: lastYear,
                                                orders: currentOrderGroup,
                                                showMonthGroup: true
                                            });

                                            groupedOrders.push({
                                                year: lastYear,
                                                months: currentDateGroup,
                                                showYearGroup: true
                                            });
                                        }
                                    }
                                }
                            }


                            return false;
                        })

                        console.log(groupedOrders);

                        groupedOrders = groupedOrders.map((year) => {

                            year.totals = {
                                orderCount: year.months.reduce((a, b) => {
                                    return a + b.orders.length;
                                }, 0),
                                customerCharges: year.months.reduce((a, b) => {
                                    return a + b.orders.reduce((c, d) => {
                                        return c + d.total_customer_rating;
                                    }, 0);
                                }, 0),
                                carrierCosts: year.months.reduce((a, b) => {
                                    return a + b.orders.reduce((c, d) => {
                                        return c + d.total_carrier_rating;
                                    }, 0);
                                }, 0),
                                profit: ((year.months.reduce((a, b) => {
                                    return a + b.orders.reduce((c, d) => {
                                        return c + d.total_customer_rating;
                                    }, 0);
                                }, 0)) - (year.months.reduce((a, b) => {
                                    return a + b.orders.reduce((c, d) => {
                                        return c + d.total_carrier_rating;
                                    }, 0);
                                }, 0)))
                            }

                            year.months.map((month) => {
                                month.totals = {
                                    orderCount: month.orders.length,
                                    customerCharges: month.orders.reduce((a, b) => {
                                        return a + b.total_customer_rating;
                                    }, 0),
                                    carrierCosts: month.orders.reduce((a, b) => {
                                        return a + b.total_carrier_rating;
                                    }, 0),
                                    profit: ((month.orders.reduce((a, b) => {
                                        return a + b.total_customer_rating;
                                    }, 0)) - (month.orders.reduce((a, b) => {
                                        return a + b.total_carrier_rating;
                                    }, 0)))
                                }

                                return month;
                            })

                            return year;
                        })

                        setOrders(groupedOrders);

                        setNoOrdersFound(newOrders.length === 0);

                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                    }
                }).catch(e => {
                    console.log('Error on getting orders by customer', e);
                    setIsLoading(false);
                })
            }

            refDateStart.current.inputElement.focus({
                preventScroll: true
            });
        }).catch(e => {

        });
    }, [])

    const dateStartTransition = useTransition(isDateStartCalendarShown, {
        from: {opacity: 0, display: 'block', top: 'calc(100% + 7px)'},
        enter: {opacity: 1, display: 'block', top: 'calc(100% + 12px)'},
        leave: {opacity: 0, display: 'none', top: 'calc(100% + 7px)'},
        reverse: isDateStartCalendarShown,
        config: {duration: 100}
    })

    const dateEndTransition = useTransition(isDateEndCalendarShown, {
        from: {opacity: 0, display: 'block', top: 'calc(100% + 7px)'},
        enter: {opacity: 1, display: 'block', top: 'calc(100% + 12px)'},
        leave: {opacity: 0, display: 'none', top: 'calc(100% + 7px)'},
        reverse: isDateEndCalendarShown,
        config: {duration: 100}
    })

    const doSearch = () => {
        if (dateStart !== '' && dateEnd !== '') {
            let dStart = moment(dateStart, 'MM/DD/YYYY');
            let dEnd = moment(dateEnd, 'MM/DD/YYYY');

            if (dStart > dEnd) {
                window.alert('Date End must be greater than the Date Start!');
                refDateStart.current.inputElement.focus();
                return;
            }
        }

        setIsLoading(true);

        axios.post(props.serverUrl + url, {
            customer_id: props.selectedCustomer?.id || 0,
            carrier_id: props.selectedCustomer?.id || 0,
            bill_to_code: billToCode,
            customer_code: customerCode,
            carrier_code: customerCode,
            date_start: dateStart,
            date_end: dateEnd,
            city_origin: (cityOrigin || '').trim(),
            city_destination: (cityDestination || '').trim(),
            state_origin: (stateOrigin || '').trim(),
            state_destination: (stateDestination || '').trim(),
            zip_origin: (zipOrigin || '').trim(),
            zip_destination: (zipDestination || '').trim(),
            origin: props.suborigin,
        }).then(res => {
            if (res.data.result === 'OK') {
                let newOrders = res.data.orders.map(order => order);

                let currentMonth = '';
                let currentYear = '';
                let lastMonth = '';
                let lastYear = '';
                let groupedOrders = [];
                let currentDateGroup = [];
                let currentOrderGroup = [];

                newOrders.map((order, index) => {
                    currentMonth = moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM');
                    currentYear = moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY');

                    if (customerCode === '' || props.suborigin === 'carrier') {
                        order.isOnBillTo = false;
                        order.isOnShipper = false;
                        order.isOnConsignee = false;
                    } else {
                        order.isOnBillTo = ((order.bill_to_company?.code || '') + ((order.bill_to_company?.code_number || 0) === 0 ? '' : order.bill_to_company.code_number)) === customerCode.toUpperCase();
                        order.isOnShipper = order.pickups.find(x => (x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number) === customerCode.toUpperCase()) !== undefined;
                        order.isOnConsignee = order.deliveries.find(x => (x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number) === customerCode.toUpperCase()) !== undefined;
                    }

                    if (lastYear === '') {
                        lastYear = currentYear;
                        lastMonth = currentMonth;
                        currentOrderGroup.push(order);

                        if (index === newOrders.length - 1) {
                            groupedOrders.push({
                                year: lastYear,
                                months: [{
                                    month: lastMonth,
                                    year: lastYear,
                                    orders: currentOrderGroup,
                                    showMonthGroup: true
                                }],
                                showYearGroup: true
                            });
                        }

                    } else {
                        if (lastYear !== currentYear) {
                            currentDateGroup.push({
                                month: lastMonth,
                                year: lastYear,
                                orders: currentOrderGroup,
                                showMonthGroup: true
                            });

                            groupedOrders.push({
                                year: lastYear,
                                months: currentDateGroup,
                                showYearGroup: true
                            });

                            lastMonth = currentMonth;
                            lastYear = currentYear;
                            currentDateGroup = [];
                            currentOrderGroup = [];

                            currentOrderGroup.push(order);

                            if (index === newOrders.length - 1) {
                                groupedOrders.push({
                                    year: lastYear,
                                    months: [{
                                        month: lastMonth,
                                        year: lastYear,
                                        orders: currentOrderGroup,
                                        showMonthGroup: true
                                    }],
                                    showYearGroup: true
                                });
                            }
                        } else {
                            if (lastMonth !== currentMonth) {
                                currentDateGroup.push({
                                    month: lastMonth,
                                    year: lastYear,
                                    orders: currentOrderGroup,
                                    showMonthGroup: true
                                });

                                lastMonth = currentMonth;
                                lastYear = currentYear;

                                currentOrderGroup = [];
                                currentOrderGroup.push(order);

                                if (index === newOrders.length - 1) {
                                    currentDateGroup.push({
                                        month: lastMonth,
                                        year: lastYear,
                                        orders: currentOrderGroup,
                                        showMonthGroup: true
                                    });

                                    groupedOrders.push({
                                        year: lastYear,
                                        months: currentDateGroup,
                                        showYearGroup: true
                                    });
                                }
                            } else {
                                currentOrderGroup.push(order);

                                if (index === newOrders.length - 1) {
                                    currentDateGroup.push({
                                        month: lastMonth,
                                        year: lastYear,
                                        orders: currentOrderGroup,
                                        showMonthGroup: true
                                    });

                                    groupedOrders.push({
                                        year: lastYear,
                                        months: currentDateGroup,
                                        showYearGroup: true
                                    });
                                }
                            }
                        }
                    }


                    return false;
                })

                console.log(groupedOrders);

                groupedOrders = groupedOrders.map((year) => {

                    year.totals = {
                        orderCount: year.months.reduce((a, b) => {
                            return a + b.orders.length;
                        }, 0),
                        customerCharges: year.months.reduce((a, b) => {
                            return a + b.orders.reduce((c, d) => {
                                return c + d.total_customer_rating;
                            }, 0);
                        }, 0),
                        carrierCosts: year.months.reduce((a, b) => {
                            return a + b.orders.reduce((c, d) => {
                                return c + d.total_carrier_rating;
                            }, 0);
                        }, 0),
                        profit: ((year.months.reduce((a, b) => {
                            return a + b.orders.reduce((c, d) => {
                                return c + d.total_customer_rating;
                            }, 0);
                        }, 0)) - (year.months.reduce((a, b) => {
                            return a + b.orders.reduce((c, d) => {
                                return c + d.total_carrier_rating;
                            }, 0);
                        }, 0)))
                    }

                    year.months.map((month) => {
                        month.totals = {
                            orderCount: month.orders.length,
                            customerCharges: month.orders.reduce((a, b) => {
                                return a + b.total_customer_rating;
                            }, 0),
                            carrierCosts: month.orders.reduce((a, b) => {
                                return a + b.total_carrier_rating;
                            }, 0),
                            profit: ((month.orders.reduce((a, b) => {
                                return a + b.total_customer_rating;
                            }, 0)) - (month.orders.reduce((a, b) => {
                                return a + b.total_carrier_rating;
                            }, 0)))
                        }

                        return month;
                    })

                    return year;
                })

                setOrders(groupedOrders);

                setNoOrdersFound(newOrders.length === 0);

                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }).catch(e => {
            console.log('Error on getting orders by customer', e);
            setIsLoading(false);
        })
    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item}/>
                        </div>
                    </animated.div>
                )
            }

            <div className="order-fields-container">

                <div className="search-fields">
                    <div className="select-box-container date" style={{position: 'relative', marginRight: 2}}>
                        <div className="select-box-wrapper">
                            <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>Date
                                Start
                            </div>
                            <MaskedInput
                                tabIndex={1 + props.tabTimes}
                                mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                guide={false} type="text"
                                ref={refDateStart}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key >= 37 && key <= 40) {
                                        let tempDateStart = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateStart || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateStart(tempDateStart);

                                        if (isDateStartCalendarShown) {
                                            e.preventDefault();

                                            if (key === 37) { // left - minus 1
                                                setPreSelectedDateStart(preSelectedDateStart.clone().subtract(1, 'day'));
                                            }

                                            if (key === 38) { // up - minus 7
                                                setPreSelectedDateStart(preSelectedDateStart.clone().subtract(7, 'day'));
                                            }

                                            if (key === 39) { // right - plus 1
                                                setPreSelectedDateStart(preSelectedDateStart.clone().add(1, 'day'));
                                            }

                                            if (key === 40) { // down - plus 7
                                                setPreSelectedDateStart(preSelectedDateStart.clone().add(7, 'day'));
                                            }


                                        } else {
                                            setIsDateStartCalendarShown(true);
                                        }
                                    }

                                    if (key === 13) {
                                        let tempDateStart = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateStart || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateStart(tempDateStart);

                                        if (isDateStartCalendarShown) {
                                            tempDateStart = preSelectedDateStart.clone().format('MM/DD/YYYY');

                                            setDateStart(tempDateStart);

                                            setIsDateStartCalendarShown(false);
                                        }
                                    }

                                    if (key === 9) {
                                        let tempDateStart = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateStart || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateStart(tempDateStart);

                                        if (isDateStartCalendarShown) {
                                            tempDateStart = preSelectedDateStart.clone().format('MM/DD/YYYY');

                                            setDateStart(tempDateStart);

                                            setIsDateStartCalendarShown(false);
                                        }
                                    }

                                }}
                                onBlur={e => {
                                    setDateStart(getFormattedDates(dateStart))
                                }}
                                onInput={e => {
                                    setDateStart(e.target.value)
                                }}
                                onChange={e => {
                                    setDateStart(e.target.value)
                                }}
                                value={dateStart || ''}
                            />

                            <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                e.stopPropagation();

                                if (isDateStartCalendarShown) {
                                    setIsDateStartCalendarShown(false);
                                    setIsDateEndCalendarShown(false);
                                } else {
                                    window.setTimeout(() => {
                                        setIsDateStartCalendarShown(true);
                                        setIsDateEndCalendarShown(false);
                                    }, 0);

                                    if (moment((dateStart || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateStart || '').trim()) {
                                        setPreSelectedDateStart(moment(dateStart, 'MM/DD/YYYY'));
                                    } else {
                                        setPreSelectedDateStart(moment());
                                    }

                                    refDateStart.current.inputElement.focus();
                                }
                            }}/>
                        </div>

                        {
                            dateStartTransition((style, item) => item &&
                                (<animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-order-history-start-date"
                                    style={{
                                        ...style,
                                        left: '0px',
                                    }}
                                    ref={refDateStartCalendarDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below right" style={{height: 275}}>
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                <Calendar
                                                    value={moment((dateStart || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateStart || '').trim()
                                                        ? moment(dateStart, 'MM/DD/YYYY')
                                                        : moment()}
                                                    onChange={(day) => {
                                                        setDateStart(day.format('MM/DD/YYYY'))
                                                    }}
                                                    closeCalendar={() => {
                                                        setIsDateStartCalendarShown(false);
                                                    }}
                                                    preDay={preSelectedDateStart}
                                                    onChangePreDay={(preDay) => {
                                                        setPreSelectedDateStart(preDay);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </animated.div>)
                            )
                        }
                    </div>
                    <div className="input-box-container city">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>City Origin
                        </div>
                        <input type="text"
                               tabIndex={3 + props.tabTimes}
                               onInput={(e) => {
                                   setCityOrigin(e.target.value)
                               }}
                               onChange={(e) => {
                                   setCityOrigin(e.target.value)
                               }}
                               value={cityOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container state">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>State Origin
                        </div>
                        <input type="text"
                               tabIndex={5 + props.tabTimes}
                               style={{textTransform: 'uppercase'}}
                               maxLength={2}
                               onInput={(e) => {
                                   setStateOrigin(e.target.value)
                               }}
                               onChange={(e) => {
                                   setStateOrigin(e.target.value)
                               }}
                               value={stateOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container zip">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>Zip Origin
                        </div>
                        <input type="text"
                               tabIndex={7 + props.tabTimes}
                               maxLength={10}
                               onKeyDown={(e) => {
                                   let key = e.keyCode || e.which;

                                   if (
                                       key === 9 || // TAB
                                       (key >= 48 && key <= 57) || // NUMBER
                                       (key >= 96 && key <= 105) || // NUMBER
                                       (key === 8 || key === 46) || // BACKSPACE - DELETE
                                       (key >= 37 && key <= 40) // ARROW KEYS
                                   ) {
                                   } else {
                                       e.preventDefault();
                                   }
                               }}
                               onInput={(e) => {
                                   setZipOrigin(e.target.value)
                               }}
                               onChange={(e) => {
                                   setZipOrigin(e.target.value)
                               }}
                               value={zipOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>Bill-To Code
                        </div>
                        <input type="text"
                               tabIndex={9 + props.tabTimes}
                               maxLength={10}
                               style={{textTransform: 'uppercase'}}
                               onInput={(e) => {
                                   setBillToCode(e.target.value)
                               }}
                               onChange={(e) => {
                                   setBillToCode(e.target.value)
                               }}
                               value={billToCode || ''}
                        />
                    </div>
                    <div className="input-toggle-container" style={{minWidth: '7.5rem', maxWidth: '7.5rem'}}>
                        <input type="checkbox"
                               id={props.panelName + '-cbox-order-history-show-year-totals-btn'}
                               onChange={(e) => {
                                   setShowYearTotals(e.target.checked);
                               }}
                               checked={showYearTotals}/>
                        <label htmlFor={props.panelName + '-cbox-order-history-show-year-totals-btn'}
                               style={{fontSize: '0.7rem'}}>
                            <div className="label-text">Show Year Totals</div>
                            <div className="input-toggle-btn"></div>
                        </label>
                    </div>
                    <div className="button-container">
                        <div className="mochi-button" onClick={() => {
                            setDateStart('');
                            setDateEnd('');
                            setCityOrigin('');
                            setCityDestination('');
                            setStateOrigin('');
                            setStateDestination('');
                            setZipOrigin('');
                            setZipDestination('');
                            setBillToCode('');
                            if ((props.selectedCustomer?.id || 0) === 0) {
                                setCustomerCode('');
                            }

                            setOrders([]);

                            refDateStart.current.inputElement.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Clear</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>

                    <div className="select-box-container date" style={{position: 'relative', marginRight: 2}}>
                        <div className="select-box-wrapper">
                            <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>Date End
                            </div>
                            <MaskedInput
                                tabIndex={2 + props.tabTimes}
                                mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                guide={false} type="text"
                                ref={refDateEnd}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key >= 37 && key <= 40) {
                                        let tempDateEnd = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateEnd || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateEnd(tempDateEnd);

                                        if (isDateEndCalendarShown) {
                                            e.preventDefault();

                                            if (key === 37) { // left - minus 1
                                                setPreSelectedDateEnd(preSelectedDateEnd.clone().subtract(1, 'day'));
                                            }

                                            if (key === 38) { // up - minus 7
                                                setPreSelectedDateEnd(preSelectedDateEnd.clone().subtract(7, 'day'));
                                            }

                                            if (key === 39) { // right - plus 1
                                                setPreSelectedDateEnd(preSelectedDateEnd.clone().add(1, 'day'));
                                            }

                                            if (key === 40) { // down - plus 7
                                                setPreSelectedDateEnd(preSelectedDateEnd.clone().add(7, 'day'));
                                            }
                                        } else {
                                            setIsDateEndCalendarShown(true);
                                        }
                                    }

                                    if (key === 13) {
                                        let tempDateEnd = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateEnd || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateEnd(tempDateEnd);

                                        if (isDateEndCalendarShown) {
                                            tempDateEnd = preSelectedDateEnd.clone().format('MM/DD/YYYY');

                                            setDateEnd(tempDateEnd);

                                            setIsDateEndCalendarShown(false);
                                        }
                                    }

                                    if (key === 9) {
                                        let tempDateEnd = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateEnd || ''), 'MM/DD/YYYY');
                                        setPreSelectedDateEnd(tempDateEnd);

                                        if (isDateEndCalendarShown) {
                                            tempDateEnd = preSelectedDateEnd.clone().format('MM/DD/YYYY');

                                            setDateEnd(tempDateEnd);

                                            setIsDateEndCalendarShown(false);
                                        }
                                    }

                                }}
                                onBlur={e => {
                                    setDateEnd(getFormattedDates(dateEnd))
                                }}
                                onInput={e => {
                                    setDateEnd(e.target.value)
                                }}
                                onChange={e => {
                                    setDateEnd(e.target.value)
                                }}
                                value={dateEnd || ''}
                            />

                            <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                e.stopPropagation();

                                if (isDateEndCalendarShown) {
                                    setIsDateEndCalendarShown(false);
                                    setIsDateStartCalendarShown(false);
                                } else {
                                    window.setTimeout(() => {
                                        setIsDateEndCalendarShown(true);
                                        setIsDateStartCalendarShown(false);
                                    }, 0);

                                    if (moment((dateEnd || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateEnd || '').trim()) {
                                        setPreSelectedDateEnd(moment(dateEnd, 'MM/DD/YYYY'));
                                    } else {
                                        setPreSelectedDateEnd(moment());
                                    }

                                    refDateEnd.current.inputElement.focus();
                                }
                            }}/>
                        </div>

                        {
                            useTransition(isDateEndCalendarShown, {
                                from: {opacity: 0, display: 'block', top: 'calc(100% + 7px)'},
                                enter: {opacity: 1, display: 'block', top: 'calc(100% + 12px)'},
                                leave: {opacity: 0, display: 'none', top: 'calc(100% + 7px)'},
                                reverse: isDateEndCalendarShown,
                                config: {duration: 100}
                            })((style, item) => item &&
                                (<animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-order-history-end-date"
                                    style={{
                                        ...style,
                                        left: '0px',
                                    }}
                                    ref={refDateEndCalendarDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below right" style={{height: 275}}>
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                <Calendar
                                                    value={moment((dateEnd || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateEnd || '').trim()
                                                        ? moment(dateEnd, 'MM/DD/YYYY')
                                                        : moment()}
                                                    onChange={(day) => {
                                                        setDateEnd(day.format('MM/DD/YYYY'))
                                                    }}
                                                    closeCalendar={() => {
                                                        setIsDateEndCalendarShown(false);
                                                    }}
                                                    preDay={preSelectedDateEnd}
                                                    onChangePreDay={(preDay) => {
                                                        setPreSelectedDateEnd(preDay);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </animated.div>)
                            )
                        }
                    </div>
                    <div className="input-box-container city">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>City
                            Destination
                        </div>
                        <input type="text"
                               tabIndex={4 + props.tabTimes}
                               onInput={(e) => {
                                   setCityDestination(e.target.value)
                               }}
                               onChange={(e) => {
                                   setCityDestination(e.target.value)
                               }}
                               value={cityDestination || ''}
                        />
                    </div>
                    <div className="input-box-container state">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>State
                            Destination
                        </div>
                        <input type="text"
                               tabIndex={6 + props.tabTimes}
                               maxLength={2}
                               style={{textTransform: 'uppercase'}}
                               onInput={(e) => {
                                   setStateDestination(e.target.value)
                               }}
                               onChange={(e) => {
                                   setStateDestination(e.target.value)
                               }}
                               value={stateDestination || ''}
                        />
                    </div>
                    <div className="input-box-container zip">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>Zip
                            Destination
                        </div>
                        <input type="text"
                               tabIndex={8 + props.tabTimes}
                               maxLength={10}
                               onKeyDown={(e) => {
                                   let key = e.keyCode || e.which;

                                   if (
                                       key === 9 || // TAB
                                       (key >= 48 && key <= 57) || // NUMBER
                                       (key >= 96 && key <= 105) || // NUMBER
                                       (key === 8 || key === 46) || // BACKSPACE - DELETE
                                       (key >= 37 && key <= 40) // ARROW KEYS
                                   ) {
                                   } else {
                                       e.preventDefault();
                                   }
                               }}
                               onInput={(e) => {
                                   setZipDestination(e.target.value)
                               }}
                               onChange={(e) => {
                                   setZipDestination(e.target.value)
                               }}
                               value={zipDestination || ''}
                        />
                    </div>
                    <div className="input-box-container">
                        <div style={{fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>
                            {props.suborigin === 'customer' ? 'Customer Code' : 'Carrier Code'}
                        </div>
                        <input type="text"
                               readOnly={(props.selectedCustomer?.id || 0) > 0}
                               tabIndex={10 + props.tabTimes}
                               maxLength={10}
                               onKeyDown={e => {
                                   let key = e.keyCode || e.which;

                                   if (key === 9) {
                                       e.preventDefault();
                                       refDateStart.current.inputElement.focus();

                                       doSearch();
                                   }
                               }}
                               style={{textTransform: 'uppercase'}}
                               onInput={(e) => {
                                   setCustomerCode(e.target.value)
                               }}
                               onChange={(e) => {
                                   setCustomerCode(e.target.value)
                               }}
                               value={customerCode || ''}
                        />
                    </div>
                    <div className="input-toggle-container" style={{minWidth: '7.5rem', maxWidth: '7.5rem'}}>
                        <input type="checkbox"
                               id={props.panelName + '-cbox-order-history-show-month-totals-btn'}
                               onChange={(e) => {
                                   setShowMonthTotals(e.target.checked);
                               }}
                               checked={showMonthTotals}/>
                        <label htmlFor={props.panelName + '-cbox-order-history-show-month-totals-btn'}
                               style={{fontSize: '0.7rem'}}>
                            <div className="label-text">Show Month Totals</div>
                            <div className="input-toggle-btn"></div>
                        </label>
                    </div>
                    <div className="button-container">
                        <div>
                            <div className="mochi-button" onClick={doSearch}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Find</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="order-info-container">
                <div className="form-bordered-box" style={{
                    backgroundColor: (orders || []).length > 0 ? 'rgba(0,0,0,0.1)' : 'transparent'
                }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button">
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    {
                        noOrdersFound &&
                        <div className="no-orders-found">No Orders Were Found</div>
                    }

                    {
                        (orders || []).length > 0 &&
                        <div className="order-info-header">
                            <div className="order-info-header-wrapper">
                                <div className="order-info-col order-date">Order Date</div>
                                <div className="order-info-col order-number">Order Number</div>
                                <div className="order-info-col customer-charges">Customer Charges</div>
                                <div className="order-info-col carrier-costs">Carrier Costs</div>
                                <div className="order-info-col profit">Profit</div>
                                <div className="order-info-col percentage">Percentage</div>
                            </div>
                        </div>
                    }
                    {
                        (orders || []).length > 0 &&
                        <div className="order-info-wrapper">
                            {
                                (orders || []).map((yearGroup, index2) => {
                                    const {months} = yearGroup;
                                    const yearOrdersClasses = classnames({
                                        'year-orders': true,
                                        'hidden': !yearGroup.showYearGroup
                                    })

                                    return (
                                        <div className="year-container" key={index2}>

                                            <div className="year-info">
                                                <span>{yearGroup.year}</span>

                                                <FontAwesomeIcon
                                                    icon={yearGroup.showYearGroup ? faCaretDown : faCaretUp}
                                                    style={{
                                                        color: yearGroup.showYearGroup ? '000000' : '#2bc1ff',
                                                        fontSize: '1.2rem',
                                                        cursor: "pointer",
                                                        marginLeft: 10
                                                    }} onClick={() => {
                                                    setOrders(_orders => _orders.map((year, i) => {
                                                        if (index2 === i) {
                                                            year.showYearGroup = !year.showYearGroup;
                                                        }

                                                        return year;
                                                    }))
                                                }}/>
                                            </div>

                                            <div className={yearOrdersClasses}>
                                                {
                                                    (months || []).map((group, index3) => {
                                                        const {orders} = group;
                                                        const monthOrdersClasses = classnames({
                                                            'month-orders': true,
                                                            'hidden': !group.showMonthGroup
                                                        })

                                                        return (
                                                            <div className="month-container"
                                                                 key={index3}>
                                                                <div className="month-info">
                                                                    <div className="order-info-col order-date" style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <span>{group.month}</span>

                                                                        <FontAwesomeIcon
                                                                            icon={group.showMonthGroup ? faCaretDown : faCaretUp}
                                                                            style={{
                                                                                color: group.showMonthGroup ? '000000' : '#2bc1ff',
                                                                                fontSize: '1.2rem',
                                                                                cursor: "pointer",
                                                                                marginLeft: 10
                                                                            }} onClick={() => {
                                                                            setOrders(_orders => _orders.map((year, i) => {
                                                                                if (index2 === i) {
                                                                                    year.months.map((month, y) => {
                                                                                        if (index3 === y) {
                                                                                            month.showMonthGroup = !month.showMonthGroup;
                                                                                        }

                                                                                        return month;
                                                                                    })
                                                                                }

                                                                                return year;
                                                                            }))
                                                                        }}/>
                                                                    </div>
                                                                    <div className="order-info-col order-number"></div>
                                                                    <div
                                                                        className="order-info-col customer-charges"></div>
                                                                    <div className="order-info-col carrier-costs"></div>
                                                                    <div className="order-info-col profit"></div>
                                                                    <div className="order-info-col percentage"></div>
                                                                </div>

                                                                <div className={monthOrdersClasses}>
                                                                    {
                                                                        orders.map((order, index4) => {
                                                                            const orderOriginBillToClasses = classnames({
                                                                                'order-origin': true,
                                                                                'active': order.isOnBillTo
                                                                            })
                                                                            const orderOriginShipperClasses = classnames({
                                                                                'order-origin': true,
                                                                                'active': order.isOnShipper
                                                                            })
                                                                            const orderOriginConsigneeClasses = classnames({
                                                                                'order-origin': true,
                                                                                'active': order.isOnConsignee
                                                                            })
                                                                            return (
                                                                                <div
                                                                                    className="date-group-order-container">
                                                                                    {
                                                                                        (customerCode !== '' && props.suborigin === 'customer') &&
                                                                                        <div
                                                                                            className="date-group-order-origin">
                                                                                            <div
                                                                                                className={orderOriginBillToClasses}>Bill-To
                                                                                            </div>
                                                                                            <div
                                                                                                className={orderOriginShipperClasses}>Shipper
                                                                                            </div>
                                                                                            <div
                                                                                                className={orderOriginConsigneeClasses}>Consignee
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                    <div
                                                                                        className="date-group-order-item"
                                                                                        key={index4}
                                                                                        onClick={() => {
                                                                                            let panel = {
                                                                                                panelName: `${props.panelName}-dispatch`,
                                                                                                component:
                                                                                                    <Dispatch
                                                                                                        pageName={'Dispatch Page'}
                                                                                                        panelName={`${props.panelName}-dispatch`}
                                                                                                        title='Dispatch'
                                                                                                        tabTimes={1000 + (props.tabTimes || 0)}
                                                                                                        isOnPanel={true}
                                                                                                        isAdmin={props.isAdmin}
                                                                                                        origin={props.origin}
                                                                                                        openPanel={props.openPanel}
                                                                                                        closePanel={props.closePanel}

                                                                                                        order_id={order.id}
                                                                                                    />
                                                                                            }

                                                                                            props.openPanel(panel, props.origin);
                                                                                        }}>
                                                                                        <div
                                                                                            className="order-info-col order-date">
                                                                                            {
                                                                                                moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')
                                                                                            }
                                                                                        </div>
                                                                                        <div
                                                                                            className="order-info-col order-number">
                                                                                            {
                                                                                                order.order_number
                                                                                            }
                                                                                        </div>
                                                                                        <div
                                                                                            className="order-info-col customer-charges">
                                                                                            <NumberFormat
                                                                                                className={classnames({
                                                                                                    'negative-number': order.total_customer_rating < 0
                                                                                                })}
                                                                                                value={order.total_customer_rating}
                                                                                                thousandsGroupStyle="thousand"
                                                                                                thousandSeparator={true}
                                                                                                decimalScale={2}
                                                                                                fixedDecimalScale={true}
                                                                                                prefix={'$ '}
                                                                                                type="text"
                                                                                                displayType={'text'}
                                                                                                readOnly={true}
                                                                                            />
                                                                                        </div>
                                                                                        <div
                                                                                            className="order-info-col carrier-costs">
                                                                                            <NumberFormat
                                                                                                className={classnames({
                                                                                                    'negative-number': order.total_carrier_rating < 0
                                                                                                })}
                                                                                                value={order.total_carrier_rating}
                                                                                                thousandsGroupStyle="thousand"
                                                                                                thousandSeparator={true}
                                                                                                decimalScale={2}
                                                                                                fixedDecimalScale={true}
                                                                                                prefix={'$ '}
                                                                                                type="text"
                                                                                                displayType={'text'}
                                                                                                readOnly={true}
                                                                                            />
                                                                                        </div>
                                                                                        <div
                                                                                            className="order-info-col profit">
                                                                                            <NumberFormat
                                                                                                className={classnames({
                                                                                                    'negative-number': (order.total_customer_rating - order.total_carrier_rating) < 0
                                                                                                })}
                                                                                                value={(order.total_customer_rating - order.total_carrier_rating)}
                                                                                                thousandsGroupStyle="thousand"
                                                                                                thousandSeparator={true}
                                                                                                decimalScale={2}
                                                                                                fixedDecimalScale={true}
                                                                                                prefix={'$ '}
                                                                                                type="text"
                                                                                                displayType={'text'}
                                                                                                readOnly={true}
                                                                                            />
                                                                                        </div>
                                                                                        <div
                                                                                            className="order-info-col percentage">
                                                                                            <NumberFormat
                                                                                                className={classnames({
                                                                                                    'negative-number': (
                                                                                                        (order.total_customer_rating > 0 || order.total_carrier_rating > 0)
                                                                                                            ?
                                                                                                            ((order.total_customer_rating - order.total_carrier_rating) * 100)
                                                                                                            /
                                                                                                            (
                                                                                                                order.total_customer_rating > 0
                                                                                                                    ? order.total_customer_rating
                                                                                                                    : order.total_carrier_rating
                                                                                                            )
                                                                                                            : 0) < 0
                                                                                                })}
                                                                                                value={
                                                                                                    (
                                                                                                        (order.total_customer_rating > 0 || order.total_carrier_rating > 0)
                                                                                                            ?
                                                                                                            ((order.total_customer_rating - order.total_carrier_rating) * 100)
                                                                                                            /
                                                                                                            (
                                                                                                                order.total_customer_rating > 0
                                                                                                                    ? order.total_customer_rating
                                                                                                                    : order.total_carrier_rating
                                                                                                            )
                                                                                                            : 0)
                                                                                                }
                                                                                                thousandsGroupStyle="thousand"
                                                                                                thousandSeparator={true}
                                                                                                decimalScale={2}
                                                                                                fixedDecimalScale={true}
                                                                                                prefix={''}
                                                                                                suffix={'%'}
                                                                                                type="text"
                                                                                                displayType={'text'}
                                                                                                readOnly={true}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>

                                                                {
                                                                    showMonthTotals &&
                                                                    <div className="month-totals">
                                                                        <div
                                                                            className="order-info-col order-number">
                                                                            Total <span
                                                                            style={{fontWeight: 'bold'}}>{group.month}</span>
                                                                        </div>
                                                                        <div
                                                                            className="order-info-col order-totals">
                                                    <span style={{
                                                        fontWeight: 'bold',
                                                        color: 'rgba(0, 0, 0, 0.7)',
                                                        marginRight: 10
                                                    }}>
                                                        Orders:</span>
                                                                            {group.totals.orderCount}
                                                                        </div>
                                                                        <div
                                                                            className="order-info-col customer-charges">
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (group.totals.customerCharges) < 0
                                                                                })}
                                                                                value={group.totals.customerCharges}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$ '}
                                                                                type="text"
                                                                                onValueChange={(values) => {
                                                                                }}
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="order-info-col carrier-costs">
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (group.totals.carrierCosts) < 0
                                                                                })}
                                                                                value={group.totals.carrierCosts}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$ '}
                                                                                type="text"
                                                                                onValueChange={(values) => {
                                                                                }}
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="order-info-col profit">
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (group.totals.profit) < 0
                                                                                })}
                                                                                value={group.totals.profit}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$ '}
                                                                                type="text"
                                                                                onValueChange={(values) => {
                                                                                }}
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="order-info-col percentage">
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (
                                                                                        (group.totals.customerCharges > 0 || group.totals.carrierCosts > 0)
                                                                                            ? (group.totals.profit * 100)
                                                                                            /
                                                                                            (
                                                                                                group.totals.customerCharges > 0
                                                                                                    ? group.totals.customerCharges
                                                                                                    : group.totals.carrierCosts
                                                                                            )
                                                                                            : 0
                                                                                    ) < 0
                                                                                })}
                                                                                value={
                                                                                    (group.totals.customerCharges > 0 || group.totals.carrierCosts > 0)
                                                                                        ? (group.totals.profit * 100)
                                                                                        /
                                                                                        (
                                                                                            group.totals.customerCharges > 0
                                                                                                ? group.totals.customerCharges
                                                                                                : group.totals.carrierCosts
                                                                                        )
                                                                                        : 0
                                                                                }
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={''}
                                                                                suffix={'%'}
                                                                                type="text"
                                                                                onValueChange={(values) => {

                                                                                }}
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            {
                                                showYearTotals &&
                                                <div className="year-totals">
                                                    <div className="order-info-col order-number">
                                                        Total <span
                                                        style={{fontWeight: 'bold'}}>{yearGroup.year}</span>
                                                    </div>
                                                    <div className="order-info-col order-totals">
                                                    <span style={{
                                                        fontWeight: 'bold',
                                                        color: 'rgba(0, 0, 0, 0.7)',
                                                        marginRight: 10
                                                    }}>
                                                        Orders:</span>
                                                        {yearGroup.totals.orderCount}
                                                    </div>
                                                    <div
                                                        className="order-info-col customer-charges">
                                                        <NumberFormat
                                                            className={classnames({
                                                                'negative-number': (yearGroup.totals.customerCharges) < 0
                                                            })}
                                                            value={yearGroup.totals.customerCharges}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={'$ '}
                                                            type="text"
                                                            onValueChange={(values) => {
                                                            }}
                                                            displayType={'text'}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="order-info-col carrier-costs">
                                                        <NumberFormat
                                                            className={classnames({
                                                                'negative-number': (yearGroup.totals.carrierCosts) < 0
                                                            })}
                                                            value={yearGroup.totals.carrierCosts}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={'$ '}
                                                            type="text"
                                                            onValueChange={(values) => {
                                                            }}
                                                            displayType={'text'}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="order-info-col profit">
                                                        <NumberFormat
                                                            className={classnames({
                                                                'negative-number': (yearGroup.totals.profit) < 0
                                                            })}
                                                            value={yearGroup.totals.profit}
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={'$ '}
                                                            type="text"
                                                            onValueChange={(values) => {
                                                            }}
                                                            displayType={'text'}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="order-info-col percentage">
                                                        <NumberFormat
                                                            className={classnames({
                                                                'negative-number': (
                                                                    (yearGroup.totals.customerCharges > 0 || yearGroup.totals.carrierCosts > 0)
                                                                        ? (yearGroup.totals.profit * 100)
                                                                        /
                                                                        (
                                                                            yearGroup.totals.customerCharges > 0
                                                                                ? yearGroup.totals.customerCharges
                                                                                : yearGroup.totals.carrierCosts
                                                                        )
                                                                        : 0
                                                                ) < 0
                                                            })}
                                                            value={
                                                                (yearGroup.totals.customerCharges > 0 || yearGroup.totals.carrierCosts > 0)
                                                                    ? (yearGroup.totals.profit * 100)
                                                                    /
                                                                    (
                                                                        yearGroup.totals.customerCharges > 0
                                                                            ? yearGroup.totals.customerCharges
                                                                            : yearGroup.totals.carrierCosts
                                                                    )
                                                                    : 0
                                                            }
                                                            thousandsGroupStyle="thousand"
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            prefix={''}
                                                            suffix={'%'}
                                                            type="text"
                                                            onValueChange={(values) => {

                                                            }}
                                                            displayType={'text'}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }


                    {
                        (orders || []).length > 0 && <div style={{flexGrow: 1}}></div>
                    }
                    {
                        (orders || []).length > 0 &&
                        <div className="order-info-footer">
                            <div className="order-info-footer-wrapper">
                                <div className="order-info-col order-number">Totals</div>
                                <div className="order-info-col order-totals">
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: 'rgba(0, 0, 0, 0.7)',
                                        marginRight: 10
                                    }}>Orders:</span>
                                    {
                                        orders.reduce((a, b) => {
                                            return a + b.totals.orderCount
                                        }, 0)
                                    }
                                </div>
                                <div className="order-info-col customer-charges">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0)) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(
                                                orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0)
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="order-info-col carrier-costs">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0)) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(
                                                orders.reduce((a, b) => {
                                                    return a + b.totals.carrierCosts
                                                }, 0)
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="order-info-col profit">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0) - orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0)) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(
                                                orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0) - orders.reduce((a, b) => {
                                                    return a + b.totals.carrierCosts
                                                }, 0)
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="order-info-col percentage">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (
                                                (orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0) > 0 || orders.reduce((a, b) => {
                                                    return a + b.totals.carrierCosts
                                                }, 0) > 0)
                                                    ? ((orders.reduce((a, b) => {
                                                        return a + b.totals.customerCharges
                                                    }, 0) - orders.reduce((a, b) => {
                                                        return a + b.totals.carrierCosts
                                                    }, 0)) * 100)
                                                    /
                                                    (
                                                        orders.reduce((a, b) => {
                                                            return a + b.totals.customerCharges
                                                        }, 0) > 0
                                                            ? orders.reduce((a, b) => {
                                                                return a + b.totals.customerCharges
                                                            }, 0)
                                                            : orders.reduce((a, b) => {
                                                                return a + b.totals.carrierCosts
                                                            }, 0)
                                                    )
                                                    : 0
                                            ) < 0
                                        })}
                                        value={
                                            (orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0) > 0 || orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0) > 0)
                                                ? ((orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0) - orders.reduce((a, b) => {
                                                    return a + b.totals.carrierCosts
                                                }, 0)) * 100)
                                                /
                                                (
                                                    orders.reduce((a, b) => {
                                                        return a + b.totals.customerCharges
                                                    }, 0) > 0
                                                        ? orders.reduce((a, b) => {
                                                            return a + b.totals.customerCharges
                                                        }, 0)
                                                        : orders.reduce((a, b) => {
                                                            return a + b.totals.carrierCosts
                                                        }, 0)
                                                )
                                                : 0
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={''}
                                        suffix={'%'}
                                        type="text"
                                        onValueChange={(values) => {

                                        }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
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
})(OrderHistory)