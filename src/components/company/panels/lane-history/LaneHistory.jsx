import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import Draggable from 'react-draggable';
import './LaneHistory.css';
import MaskedInput from 'react-text-mask';
import {CalendarPopup} from './../../panels';
import moment from 'moment';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
} from './../../../../actions';

const LaneHistory = (props) => {
    const closePanelBtnClick = (e, name) => {
        props.setOpenedPanels(props.openedPanels.filter((item, index) => {
            return item !== name;
        }));
    }

    const [isDateStartCalendarShown, setIsDateStartCalendarShown] = useState(false);
    const [isDateEndCalendarShown, setIsDateEndCalendarShown] = useState(false);

    const [preSelectedDateStart, setPreSelectedDateStart] = useState(moment());
    const [preSelectedDateEnd, setPreSelectedDateEnd] = useState(moment());

    const refDateStart = useRef();
    const refDateEnd = useRef();

    const refDateStartCalendarPopup = useRef();
    const refDateEndCalendarPopup = useRef();

    const [isLoading, setIsLoading] = useState(false);
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
    const [shipperCode, setShipperCode] = useState('');
    const [consigneeCode, setConsigneeCode] = useState('');

    const dateStartCalendarPopupContainerClasses = classnames({
        'mochi-contextual-container': true,
        'shown': isDateStartCalendarShown
    });

    const dateEndCalendarPopupContainerClasses = classnames({
        'mochi-contextual-container': true,
        'shown': isDateEndCalendarShown
    });

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
            console.log(e);
        }

        return formattedDate;
    }

    useEffect(() => {
        if ((props.selectedCustomer?.id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getOrdersByCustomer', {
                customer_id: (props.selectedCustomer?.id || 0),
                date_start: dateStart,
                date_end: dateEnd,
                origin: props.origin
            }).then(res => {
                if (res.data.result === 'OK') {
                    let newOrders = res.data.orders.map(order => {
                        order.customer_charges = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((order.order_customer_ratings || []).reduce((a, b) => {
                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')));

                        order.carrier_costs = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((order.order_carrier_ratings || []).reduce((a, b) => {
                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')));

                        return order;
                    });

                    if ((cityOrigin || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[0].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.city || '').toLowerCase().includes(cityOrigin.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.city || '').toLowerCase().includes(cityOrigin.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((cityDestination || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[order.routing.length - 1].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.city || '').toLowerCase().includes(cityDestination.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.city || '').toLowerCase().includes(cityDestination.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((stateOrigin || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            console.log(order)
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[0].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.state || '').toLowerCase().includes(stateOrigin.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.state || '').toLowerCase().includes(stateOrigin.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((stateDestination || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[order.routing.length - 1].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.state || '').toLowerCase().includes(stateDestination.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.state || '').toLowerCase().includes(stateDestination.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((zipOrigin || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[0].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.zip || '').toLowerCase().includes(zipOrigin.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.zip || '').toLowerCase().includes(zipOrigin.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((zipDestination || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            if ((order.routing || []).length >= 2) {
                                if (order.routing[order.routing.length - 1].type === 'pickup') {
                                    return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.zip || '').toLowerCase().includes(zipDestination.toLowerCase())
                                } else {
                                    return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.zip || '').toLowerCase().includes(zipDestination.toLowerCase())
                                }
                            } else {
                                return false;
                            }
                        })
                    }

                    if ((billToCode || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            return ((order.bill_to_company?.code || '') + ((order.bill_to_company?.code_number || 0) === 0 ? '' : order.bill_to_company?.code_number)).toLowerCase().includes(billToCode.toLowerCase())
                        });
                    }

                    if ((shipperCode || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            return (order.pickups || []).find(x => ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number)).toLowerCase().includes(shipperCode.toLowerCase())) !== undefined
                        });
                    }

                    if ((consigneeCode || '').trim() !== '') {
                        newOrders = newOrders.filter(order => {
                            return (order.deliveries || []).find(x => ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number)).toLowerCase().includes(consigneeCode.toLowerCase())) !== undefined
                        });
                    }

                    setOrders(newOrders.sort((a, b) => a.bill_to_company.code.localeCompare(b.bill_to_company.code) || a.bill_to_company.code_number - b.bill_to_company.code_number || a.id - b.id))

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
    }, [])

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="close-btn" title="Close" onClick={e => closePanelBtnClick(e, props.panelName)}><span className="fas fa-times"></span></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div className="lane-fields-container">
                <div className="row-fields">
                    <div className="input-box-container date">
                        <MaskedInput
                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                            guide={false} type="text" placeholder="Date Start"
                            ref={refDateStart}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                let curDateStart = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateStart || ''), 'MM/DD/YYYY');

                                await setPreSelectedDateStart(curDateStart);

                                if (key === 9) {
                                    await setIsDateStartCalendarShown(false);
                                }

                                if (key === 13) {
                                    if (isDateStartCalendarShown) {
                                        await setDateStart(preSelectedDateStart.clone().format('MM/DD/YYYY'));
                                        await setIsDateStartCalendarShown(false);
                                    }
                                }

                                if (key >= 37 && key <= 40) {
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
                                    }
                                }
                            }}
                            onBlur={(e) => { setDateStart(getFormattedDates(dateStart)) }}
                            onInput={(e) => { setDateStart(e.target.value) }}
                            onChange={(e) => { setDateStart(e.target.value) }}
                            value={dateStart || ''}
                        />

                        <span className="fas fa-calendar-alt open-calendar-btn" onClick={(e) => {
                            e.stopPropagation();

                            if (moment((dateStart || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateStart || '').trim()) {
                                setPreSelectedDateStart(moment(dateStart, 'MM/DD/YYYY'));
                            } else {
                                setPreSelectedDateStart(moment());
                            }

                            const baseWidth = 0.95;
                            const panelGap = 70;
                            const panelWidth = (window.innerWidth * baseWidth) - (panelGap * props.openedPanels.indexOf(props.panelName));

                            const input = refDateStart.current.inputElement.getBoundingClientRect();

                            let popup = refDateStartCalendarPopup.current;

                            const { innerWidth, innerHeight } = window;

                            let screenWSection = innerWidth / 3;

                            popup && (popup.childNodes[0].className = 'mochi-contextual-popup');
                            popup && popup.childNodes[0].classList.add('vertical');

                            if ((innerHeight - 170 - 30) <= input.top) {
                                popup && popup.childNodes[0].classList.add('above');
                            }

                            if ((innerHeight - 170 - 30) > input.top) {
                                popup && popup.childNodes[0].classList.add('below');
                                popup && (popup.style.top = (input.top + 10) + 'px');
                            }

                            if (input.left <= (screenWSection * 1)) {
                                popup && popup.childNodes[0].classList.add('right');
                                popup && (popup.style.left = input.left + 'px');

                                if (input.width < 70) {
                                    popup && (popup.style.left = (input.left - 60 + (input.width / 2)) + 'px');

                                    if (input.left < 30) {
                                        popup && popup.childNodes[0].classList.add('corner');
                                        popup && (popup.style.left = (input.left + (input.width / 2)) + 'px');
                                    }
                                }
                            }

                            if (input.left <= (screenWSection * 2)) {
                                popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) + 'px');
                            }

                            if (input.left > (screenWSection * 2)) {
                                popup && popup.childNodes[0].classList.add('left');
                                popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) + 'px');

                                if ((innerWidth - input.left) < 100) {
                                    popup && popup.childNodes[0].classList.add('corner');
                                    popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) - (300 - (input.width / 2)) + 'px');
                                }
                            }

                            setIsDateEndCalendarShown(false);
                            setIsDateStartCalendarShown(true)

                            refDateStart.current.inputElement.focus();
                        }}></span>
                    </div>
                    <div className="input-box-container city">
                        <input type="text" placeholder="City Origin"
                            onInput={(e) => { setCityOrigin(e.target.value) }}
                            onChange={(e) => { setCityOrigin(e.target.value) }}
                            value={cityOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container state">
                        <input type="text" placeholder="State Origin"
                            style={{ textTransform: 'uppercase' }}
                            maxLength={2}
                            onInput={(e) => { setStateOrigin(e.target.value) }}
                            onChange={(e) => { setStateOrigin(e.target.value) }}
                            value={stateOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container zip">
                        <input type="text" placeholder="Zip Origin"
                            maxLength={10}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (
                                    key === 9 || // TAB
                                    (key >= 48 && key <= 57) || // NUMBER
                                    (key >= 96 && key <= 105) || // NUMBER
                                    (key === 8 || key === 46) || // BACKSPACE - DELETE
                                    (key >= 37 && key <= 40) // ARROW KEYS
                                ) { } else {
                                    e.preventDefault();
                                }
                            }}
                            onInput={(e) => { setZipOrigin(e.target.value) }}
                            onChange={(e) => { setZipOrigin(e.target.value) }}
                            value={zipOrigin || ''}
                        />
                    </div>
                    <div className="input-box-container input-code">
                        <input type="text" placeholder="Bill To Code"
                            maxLength={10}
                            style={{ textTransform: 'uppercase' }}
                            onInput={(e) => { setBillToCode(e.target.value) }}
                            onChange={(e) => { setBillToCode(e.target.value) }}
                            value={billToCode || ''}
                        />
                    </div>
                    <div className="input-box-container input-code">
                        <input type="text" placeholder="Shipper Code"
                            maxLength={10}
                            style={{ textTransform: 'uppercase' }}
                            onInput={(e) => { setShipperCode(e.target.value) }}
                            onChange={(e) => { setShipperCode(e.target.value) }}
                            value={shipperCode || ''}
                        />
                    </div>
                </div>

                <div className="row-fields">
                    <div className="input-box-container date">
                        <MaskedInput
                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                            guide={false} type="text" placeholder="Date End"
                            ref={refDateEnd}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                let curDateEnd = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(dateEnd || ''), 'MM/DD/YYYY');

                                await setPreSelectedDateEnd(curDateEnd);

                                if (key === 9) {
                                    await setIsDateEndCalendarShown(false);
                                }

                                if (key === 13) {
                                    if (isDateEndCalendarShown) {
                                        await setDateEnd(preSelectedDateEnd.clone().format('MM/DD/YYYY'));
                                        await setIsDateEndCalendarShown(false);
                                    }
                                }

                                if (key >= 37 && key <= 40) {
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
                                    }
                                }
                            }}
                            onBlur={(e) => { setDateEnd(getFormattedDates(dateEnd)) }}
                            onInput={(e) => { setDateEnd(e.target.value) }}
                            onChange={(e) => { setDateEnd(e.target.value) }}
                            value={dateEnd || ''}
                        />

                        <span className="fas fa-calendar-alt open-calendar-btn" onClick={(e) => {
                            e.stopPropagation();

                            if (moment((dateEnd || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateEnd || '').trim()) {
                                setPreSelectedDateEnd(moment(dateEnd, 'MM/DD/YYYY'));
                            } else {
                                setPreSelectedDateEnd(moment());
                            }

                            const baseWidth = 0.95;
                            const panelGap = 70;
                            const panelWidth = (window.innerWidth * baseWidth) - (panelGap * props.openedPanels.indexOf(props.panelName));

                            const input = refDateEnd.current.inputElement.getBoundingClientRect();

                            let popup = refDateEndCalendarPopup.current;

                            const { innerWidth, innerHeight } = window;

                            let screenWSection = innerWidth / 3;

                            popup && (popup.childNodes[0].className = 'mochi-contextual-popup');
                            popup && popup.childNodes[0].classList.add('vertical');

                            if ((innerHeight - 170 - 30) <= input.top) {
                                popup && popup.childNodes[0].classList.add('above');
                            }

                            if ((innerHeight - 170 - 30) > input.top) {
                                popup && popup.childNodes[0].classList.add('below');
                                popup && (popup.style.top = (input.top + 10) + 'px');
                            }

                            if (input.left <= (screenWSection * 1)) {
                                popup && popup.childNodes[0].classList.add('right');
                                popup && (popup.style.left = input.left + 'px');

                                if (input.width < 70) {
                                    popup && (popup.style.left = (input.left - 60 + (input.width / 2)) + 'px');

                                    if (input.left < 30) {
                                        popup && popup.childNodes[0].classList.add('corner');
                                        popup && (popup.style.left = (input.left + (input.width / 2)) + 'px');
                                    }
                                }
                            }

                            if (input.left <= (screenWSection * 2)) {
                                popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) + 'px');
                            }

                            if (input.left > (screenWSection * 2)) {
                                popup && popup.childNodes[0].classList.add('left');
                                popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) + 'px');

                                if ((innerWidth - input.left) < 100) {
                                    popup && popup.childNodes[0].classList.add('corner');
                                    popup && (popup.style.left = (input.left - (window.innerWidth - panelWidth)) - (300 - (input.width / 2)) + 'px');
                                }
                            }

                            setIsDateStartCalendarShown(false);
                            setIsDateEndCalendarShown(true)

                            refDateEnd.current.inputElement.focus();
                        }}></span>
                    </div>
                    <div className="input-box-container city">
                        <input type="text" placeholder="City Destination"
                            onInput={(e) => { setCityDestination(e.target.value) }}
                            onChange={(e) => { setCityDestination(e.target.value) }}
                            value={cityDestination || ''}
                        />
                    </div>
                    <div className="input-box-container state">
                        <input type="text" placeholder="State Destination"
                            maxLength={2}
                            style={{ textTransform: 'uppercase' }}
                            onInput={(e) => { setStateDestination(e.target.value) }}
                            onChange={(e) => { setStateDestination(e.target.value) }}
                            value={stateDestination || ''}
                        />
                    </div>
                    <div className="input-box-container zip">
                        <input type="text" placeholder="Zip Destination"
                            maxLength={10}
                            onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {

                                } else {
                                    e.preventDefault();
                                }
                            }}
                            onInput={(e) => { setZipDestination(e.target.value) }}
                            onChange={(e) => { setZipDestination(e.target.value) }}
                            value={zipDestination || ''}
                        />
                    </div>
                    <div className="input-box-container input-code">
                        <input type="text" placeholder="Consignee Code"
                            maxLength={10}
                            style={{ textTransform: 'uppercase' }}
                            onInput={(e) => { setConsigneeCode(e.target.value) }}
                            onChange={(e) => { setConsigneeCode(e.target.value) }}
                            value={consigneeCode || ''}
                        />
                    </div>
                    <div className="button-container">
                        <div>
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
                                setShipperCode('');
                                setConsigneeCode('');

                                setOrders([]);

                                refDateStart.current.inputElement.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>

                        <div>
                            <div className="mochi-button" onClick={() => {
                                setIsLoading(true);

                                axios.post(props.serverUrl + '/getOrdersByCustomer', {
                                    customer_id: (props.selectedCustomer?.id || 0),
                                    date_start: dateStart,
                                    date_end: dateEnd,
                                    origin: props.origin
                                }).then(res => {
                                    if (res.data.result === 'OK') {
                                        let newOrders = res.data.orders.map(order => {
                                            order.customer_charges = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((order.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')));

                                            order.carrier_costs = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((order.order_carrier_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')));

                                            return order;
                                        });

                                        if ((cityOrigin || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[0].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.city || '').toLowerCase().includes(cityOrigin.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.city || '').toLowerCase().includes(cityOrigin.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((cityDestination || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[order.routing.length - 1].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.city || '').toLowerCase().includes(cityDestination.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.city || '').toLowerCase().includes(cityDestination.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((stateOrigin || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                console.log(order)
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[0].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.state || '').toLowerCase().includes(stateOrigin.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.state || '').toLowerCase().includes(stateOrigin.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((stateDestination || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[order.routing.length - 1].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.state || '').toLowerCase().includes(stateDestination.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.state || '').toLowerCase().includes(stateDestination.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((zipOrigin || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[0].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.zip || '').toLowerCase().includes(zipOrigin.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.zip || '').toLowerCase().includes(zipOrigin.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((zipDestination || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                if ((order.routing || []).length >= 2) {
                                                    if (order.routing[order.routing.length - 1].type === 'pickup') {
                                                        return (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.zip || '').toLowerCase().includes(zipDestination.toLowerCase())
                                                    } else {
                                                        return (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.zip || '').toLowerCase().includes(zipDestination.toLowerCase())
                                                    }
                                                } else {
                                                    return false;
                                                }
                                            })
                                        }

                                        if ((billToCode || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                return ((order.bill_to_company?.code || '') + ((order.bill_to_company?.code_number || 0) === 0 ? '' : order.bill_to_company?.code_number)).toLowerCase().includes(billToCode.toLowerCase())
                                            });
                                        }

                                        if ((shipperCode || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                return (order.pickups || []).find(x => ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number)).toLowerCase().includes(shipperCode.toLowerCase())) !== undefined
                                            });
                                        }

                                        if ((consigneeCode || '').trim() !== '') {
                                            newOrders = newOrders.filter(order => {
                                                return (order.deliveries || []).find(x => ((x.customer?.code || '') + ((x.customer?.code_number || 0) === 0 ? '' : x.customer.code_number)).toLowerCase().includes(consigneeCode.toLowerCase())) !== undefined
                                            });
                                        }

                                        setOrders(newOrders.sort((a, b) => a.bill_to_company.code.localeCompare(b.bill_to_company.code) || a.bill_to_company.code_number - b.bill_to_company.code_number || a.id - b.id))

                                        setNoOrdersFound(newOrders.length === 0);

                                        setIsLoading(false);
                                    } else {
                                        setIsLoading(false);
                                    }
                                }).catch(e => {
                                    console.log('Error on getting orders by customer', e);
                                    setIsLoading(false);
                                })
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Find</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="lane-info-container">
                <div className="form-bordered-box">
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
                        <div className="lane-info-header">
                            <div className="lane-info-header-wrapper">
                                <div className="lane-info-col order-date">Order Date</div>
                                <div className="lane-info-col order-number">Order Number</div>
                                <div className="lane-info-col customer-charges">Customer Charges</div>
                                <div className="lane-info-col carrier-costs">Carrier Costs</div>
                                <div className="lane-info-col profit">Profit</div>
                                <div className="lane-info-col percentage">Percentage</div>
                            </div>
                        </div>
                    }

                    <div className="lane-info-wrapper">
                        {
                            (orders || []).map((order, index) => {
                                return (
                                    <div className="lane-info-item" key={index}>
                                        <div className="lane-info-col order-date">
                                            {
                                                moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')
                                            }
                                        </div>
                                        <div className="lane-info-col order-number">
                                            {
                                                order.order_number
                                            }
                                        </div>
                                        <div className="lane-info-col customer-charges">
                                            <NumberFormat
                                                className={classnames({
                                                    'negative-number': order.customer_charges < 0
                                                })}
                                                value={order.customer_charges}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                prefix={'$ '}
                                                type="text"
                                                onValueChange={(values) => { }}
                                                displayType={'text'}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="lane-info-col carrier-costs">
                                            <NumberFormat
                                                className={classnames({
                                                    'negative-number': order.carrier_costs < 0
                                                })}
                                                value={order.carrier_costs}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                prefix={'$ '}
                                                type="text"
                                                onValueChange={(values) => { }}
                                                displayType={'text'}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="lane-info-col profit">
                                            <NumberFormat
                                                className={classnames({
                                                    'negative-number': (Number(order.customer_charges.replace(',', '')) - Number(order.carrier_costs.replace(',', ''))) < 0
                                                })}
                                                value={(Number(order.customer_charges.replace(',', '')) - Number(order.carrier_costs.replace(',', '')))}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                prefix={'$ '}
                                                type="text"
                                                onValueChange={(values) => { }}
                                                displayType={'text'}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="lane-info-col percentage">
                                            <NumberFormat
                                                className={classnames({
                                                    'negative-number': (
                                                        (Number(order.customer_charges.replace(',', '')) > 0 || Number(order.carrier_costs.replace(',', '')) > 0)
                                                            ?
                                                            ((Number(order.customer_charges.replace(',', '')) - Number(order.carrier_costs.replace(',', ''))) * 100)
                                                            /
                                                            (
                                                                Number(order.customer_charges.replace(',', '')) > 0
                                                                    ? Number(order.customer_charges.replace(',', ''))
                                                                    : Number(order.carrier_costs.replace(',', ''))
                                                            )
                                                            : 0) < 0
                                                })}
                                                value={
                                                    (
                                                        (Number(order.customer_charges.replace(',', '')) > 0 || Number(order.carrier_costs.replace(',', '')) > 0)
                                                            ?
                                                            ((Number(order.customer_charges.replace(',', '')) - Number(order.carrier_costs.replace(',', ''))) * 100)
                                                            /
                                                            (
                                                                Number(order.customer_charges.replace(',', '')) > 0
                                                                    ? Number(order.customer_charges.replace(',', ''))
                                                                    : Number(order.carrier_costs.replace(',', ''))
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
                                )
                            })
                        }
                    </div>
                    {
                        (orders || []).length > 0 && <div style={{ flexGrow: 1 }}></div>
                    }
                    {
                        (orders || []).length > 0 &&
                        <div className="lane-info-footer">
                            <div className="lane-info-footer-wrapper">
                                <div className="lane-info-col order-number"></div>
                                <div className="lane-info-col order-totals">Totals</div>
                                <div className="lane-info-col customer-charges">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (Number((orders.reduce((x, y) => {
                                                return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                            }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                Number((orders.reduce((x, y) => {
                                                    return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => { }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="lane-info-col carrier-costs">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (Number((orders.reduce((x, y) => {
                                                return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                            }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                Number((orders.reduce((x, y) => {
                                                    return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => { }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="lane-info-col profit">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (Number((orders.reduce((x, y) => {
                                                return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                            }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))
                                                -
                                                Number((orders.reduce((x, y) => {
                                                    return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))) < 0
                                        })}
                                        value={
                                            new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                Number((orders.reduce((x, y) => {
                                                    return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))
                                                -
                                                Number((orders.reduce((x, y) => {
                                                    return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))
                                            )
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => { }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="lane-info-col percentage">
                                    <NumberFormat
                                        className={classnames({
                                            'negative-number': (
                                                (Number((orders.reduce((x, y) => {
                                                    return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) > 0 || Number((orders.reduce((x, y) => {
                                                    return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', '')) > 0)
                                                    ?
                                                    ((Number((orders.reduce((x, y) => {
                                                        return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                    }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) - Number((orders.reduce((x, y) => {
                                                        return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                    }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))) * 100)
                                                    /
                                                    (
                                                        Number((orders.reduce((x, y) => {
                                                            return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                        }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) > 0
                                                            ? Number((orders.reduce((x, y) => {
                                                                return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                            }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))
                                                            : Number((orders.reduce((x, y) => {
                                                                return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                            }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))
                                                    )
                                                    : 0) < 0
                                        })}
                                        value={
                                            (
                                                (Number((orders.reduce((x, y) => {
                                                    return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) > 0 || Number((orders.reduce((x, y) => {
                                                    return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', '')) > 0)
                                                    ?
                                                    ((Number((orders.reduce((x, y) => {
                                                        return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                    }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) - Number((orders.reduce((x, y) => {
                                                        return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                    }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))) * 100)
                                                    /
                                                    (
                                                        Number((orders.reduce((x, y) => {
                                                            return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                        }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', '')) > 0
                                                            ? Number((orders.reduce((x, y) => {
                                                                return { customer_charges: Number(x.customer_charges.toString().replace(',', '')) + Number(y.customer_charges.toString().replace(',', '')) }
                                                            }, { customer_charges: '' })?.customer_charges || '').toString().replace(',', ''))
                                                            : Number((orders.reduce((x, y) => {
                                                                return { carrier_costs: Number(x.carrier_costs.toString().replace(',', '')) + Number(y.carrier_costs.toString().replace(',', '')) }
                                                            }, { carrier_costs: '' })?.carrier_costs || '').toString().replace(',', ''))
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
                                        onValueChange={(values) => {
                                            console.log(values)
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

            <CalendarPopup
                popupRef={refDateStartCalendarPopup}
                popupClasses={dateStartCalendarPopupContainerClasses}
                popupGetter={moment((dateStart || ''), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateStart || '')
                    ? moment(dateStart, 'MM/DD/YYYY')
                    : moment()}
                popupSetter={(day) => {
                    setDateStart(day.format('MM/DD/YYYY'))
                }}
                closeCalendar={() => { setIsDateStartCalendarShown(false); }}
                preDay={preSelectedDateStart}
            />

            <CalendarPopup
                popupRef={refDateEndCalendarPopup}
                popupClasses={dateEndCalendarPopupContainerClasses}
                popupGetter={moment((dateEnd || ''), 'MM/DD/YYYY').format('MM/DD/YYYY') === (dateEnd || '')
                    ? moment(dateEnd, 'MM/DD/YYYY')
                    : moment()}
                popupSetter={(day) => {
                    setDateEnd(day.format('MM/DD/YYYY'))
                }}
                closeCalendar={() => { setIsDateEndCalendarShown(false); }}
                preDay={preSelectedDateEnd}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        carrierOpenedPanels: state.carrierReducers.carrierOpenedPanels,
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
})(LaneHistory)