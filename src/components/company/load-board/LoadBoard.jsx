import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './LoadBoard.css';
import PanelContainer from './panels/panel-container/PanelContainer.jsx';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import classnames from 'classnames';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
} from './../../../actions';

import {
    Customers,
    Carriers,
    Invoice,
    Dispatch
} from './../../company';

import {
    Routing,
    Order
} from './../panels';

const LoadBoard = (props) => {
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedBillToCustomer, setSelectedBillToCustomer] = useState({});
    const [selectedBillToCustomerContact, setSelectedBillToCustomerContact] = useState({});
    const [selectedShipperCustomer, setSelectedShipperCustomer] = useState({});
    const [selectedShipperCustomerContact, setSelectedShipperCustomerContact] = useState({});
    const [selectedConsigneeCustomer, setSelectedConsigneeCustomer] = useState({});
    const [selectedConsigneeCustomerContact, setSelectedConsigneeCustomerContact] = useState({});
    const [selectedCarrier, setSelectedCarrier] = useState({});
    const [selectedCarrierContact, setSelectedCarrierContact] = useState({});
    const [selectedCarrierDriver, setSelectedCarrierDriver] = useState({});

    const [systemConfig, setSystemConfig] = useState([]);
    const [refreshIntervalItems, setRefreshIntervalItems] = useState([
        {
            id: 0,
            time: 2,
            interval: 'min',
            selected: true
        },
        {
            id: 1,
            time: 5,
            interval: 'min',
            selected: false
        },
        {
            id: 2,
            time: 10,
            interval: 'min',
            selected: false
        },
        {
            id: 3,
            time: 15,
            interval: 'min',
            selected: false
        },
        {
            id: 4,
            time: 30,
            interval: 'min',
            selected: false
        },
        {
            id: 5,
            time: 1,
            interval: 'hr',
            selected: false
        }
    ]);
    const [showRefreshIntervals, setShowRefreshIntervals] = useState(false);
    const refShowRefreshIntervalsDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowRefreshIntervals(false) } });
    const refRefreshIntervalPopupItems = useRef([]);
    const refAutoRefresh = useRef([]);

    const panelRefs = useRef([]);
    const [currentSystemDateTime, setCurrentSystemDateTime] = useState(moment());
    const [orders, setOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [bookedOrders, setBookedOrders] = useState([]);
    const [inTransitOrders, setInTransitOrders] = useState([]);
    const [deliveredNotInvoiceOrders, setDeliveredNotInvoicedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showingShipperSecondPage, setShowingShipperSecondPage] = useState(false);
    const [showingConsigneeSecondPage, setShowingConsigneeSecondPage] = useState(false);

    const refreshIntervalTransition = useTransition(showRefreshIntervals, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showRefreshIntervals
    });

    useEffect(() => {
        if ((props.selectedOrder?.component_id || '') !== props.componentId) {
            if (((selectedOrder?.id || 0) > 0 && (props.selectedOrder?.id || 0) > 0) && selectedOrder.id === props.selectedOrder.id) {
                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        ...props.selectedOrder
                    }
                })
            }
        }
    }, [props.selectedOrder])

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

            if (((selectedShipperCustomer?.id || 0) > 0 && (props.selectedCustomer?.id || 0) > 0) && selectedShipperCustomer.id === props.selectedCustomer.id) {
                setSelectedShipperCustomer(selectedShipperCustomer => {
                    return {
                        ...selectedShipperCustomer,
                        ...props.selectedCustomer
                    }
                })

                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        pickups: (selectedOrder.pickups || []).map(item => {
                            if (item.customer?.id === props.selectedCustomer.id) {
                                item.customer = props.selectedCustomer;
                            }

                            return item;
                        })
                    }
                })
            }

            if (((selectedConsigneeCustomer?.id || 0) > 0 && (props.selectedCustomer?.id || 0) > 0) && selectedConsigneeCustomer.id === props.selectedCustomer.id) {
                setSelectedConsigneeCustomer(selectedConsigneeCustomer => {
                    return {
                        ...selectedConsigneeCustomer,
                        ...props.selectedCustomer
                    }
                })

                setSelectedOrder(selectedOrder => {
                    return {
                        ...selectedOrder,
                        deliveries: (selectedOrder.deliveries || []).map(item => {
                            if (item.customer?.id === props.selectedCustomer.id) {
                                item.customer = props.selectedCustomer;
                            }

                            return item;
                        })
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

            if (((selectedShipperCustomerContact?.id || 0) > 0 && (props.selectedCustomerContact?.id || 0) > 0) && selectedShipperCustomerContact.id === props.selectedCustomerContact.id) {
                setSelectedShipperCustomerContact(selectedShipperCustomerContact => {
                    return {
                        ...selectedShipperCustomerContact,
                        ...props.selectedCustomerContact
                    }
                })
            }

            if (((selectedConsigneeCustomerContact?.id || 0) > 0 && (props.selectedCustomerContact?.id || 0) > 0) && selectedConsigneeCustomerContact.id === props.selectedCustomerContact.id) {
                setSelectedConsigneeCustomerContact(selectedConsigneeCustomerContact => {
                    return {
                        ...selectedConsigneeCustomerContact,
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

    var refreshTimer = null;

    const setLoadBoardTimer = () => {
        clearTimeout(refreshTimer);

        let { time, interval } = refreshIntervalItems.find(i => i.selected);
        if (interval === 'sec') {
            time = time * 1000;
        }

        if (interval === 'min') {
            time = time * 1000 * 60;
        }

        if (interval === 'hr') {
            time = time * 1000 * 60 * 60;
        }

        refreshTimer = window.setTimeout(() => {
            axios.post(props.serverUrl + '/getConfig').then(res => {
                if (res.data.result === 'OK') {
                    let load_board_auto_refresh_enabled = res.data.config.find(c => c.name === 'load_board_auto_refresh_enabled');

                    if (load_board_auto_refresh_enabled === undefined) {
                       
                    } else {
                        if (load_board_auto_refresh_enabled.value === '0') {
                            
                        } else {
                            setIsLoading(true);

                            axios.post(props.serverUrl + '/getOrders').then(async res => {
                                if (res.data.result === 'OK') {
                                    setOrders(res.data.orders.map(item => item));

                                    setAvailableOrders(res.data.orders.filter(item => (item.carrier_id || 0) === 0));

                                    setBookedOrders(res.data.orders.filter(item => ((item.carrier_id || 0) > 0) && (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') === undefined)));

                                    setInTransitOrders(res.data.orders.filter(item =>
                                        ((item.carrier_id || 0) > 0) &&
                                        (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                                        // ((item.deliveries.length === 0) || (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) === undefined))))
                                        ((item.deliveries.length === 0) || (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length > 0))))

                                    setDeliveredNotInvoicedOrders(res.data.orders.filter(item =>
                                        ((item.order_invoiced || 0) === 0) &&
                                        ((item.carrier_id || 0) > 0) &&
                                        (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                                        // ((item.deliveries.length > 0) && (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) !== undefined))))
                                        ((item.deliveries.length > 0) && (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length === 0))))

                                    if ((selectedOrder?.id || 0) > 0) {
                                        let order = res.data.orders.find(o => o.id === selectedOrder.id);

                                        setSelectedOrder(order);

                                        setSelectedBillToCustomer(order.bill_to_company || {})
                                        setSelectedBillToCustomerContact({});

                                        order.bill_to_company?.contacts.map(c => {
                                            if (c.is_primary === 1) {
                                                setSelectedBillToCustomerContact(c);
                                            }
                                            return true;
                                        });

                                        setSelectedCarrier(order.carrier || {})
                                        setSelectedCarrierContact({})

                                        order.carrier?.contacts.map(c => {
                                            if (c.is_primary === 1) {
                                                setSelectedCarrierContact(c);
                                            }
                                            return true;
                                        });

                                        setSelectedCarrierDriver(order.driver || {});

                                        setSelectedShipperCustomer(order.pickups[0]?.customer || {});
                                        setSelectedShipperCustomerContact({});

                                        ((order.pickups.length > 0 ? order.pickups[0]?.customer : {}).contacts || []).map(c => {
                                            if (c.is_primary === 1) {
                                                setSelectedShipperCustomerContact(c);
                                            }
                                            return true;
                                        });

                                        setSelectedConsigneeCustomer(order.deliveries.length > 0 ? order.deliveries[0]?.customer : {});
                                        setSelectedConsigneeCustomerContact({});

                                        ((order.deliveries.length > 0 ? order.deliveries[0]?.customer : {}).contacts || []).map(c => {
                                            if (c.is_primary === 1) {
                                                setSelectedConsigneeCustomerContact(c);
                                            }
                                            return true;
                                        });
                                    }

                                    setIsLoading(false);

                                    setLoadBoardTimer();
                                }
                            }).catch(e => {
                                console.log('error loading orders', e)
                                setIsLoading(false);
                            })
                        }
                    }
                }
            }).catch(e => {
                console.log('error getting config', e);
            });
        }, time);
    }

    useEffect(() => {
        axios.post(props.serverUrl + '/getConfig').then(res => {
            if (res.data.result === 'OK') {
                setSystemConfig(res.data.config);
            }
        }).catch(e => {
            console.log('error getting config', e);
        })
    }, []);

    useEffect(() => {
        setIsLoading(true);

        axios.post(props.serverUrl + '/getOrders').then(async res => {
            if (res.data.result === 'OK') {
                setOrders(res.data.orders.map(item => item));

                setAvailableOrders(res.data.orders.filter(item => (item.carrier_id || 0) === 0));

                setBookedOrders(res.data.orders.filter(item => ((item.carrier_id || 0) > 0) && (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') === undefined)));

                setInTransitOrders(res.data.orders.filter(item =>
                    ((item.carrier_id || 0) > 0) &&
                    (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                    // ((item.deliveries.length === 0) || (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) === undefined))))
                    ((item.deliveries.length === 0) || (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length > 0))))

                setDeliveredNotInvoicedOrders(res.data.orders.filter(item =>
                    ((item.order_invoiced || 0) === 0) &&
                    ((item.carrier_id || 0) > 0) &&
                    (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                    // ((item.deliveries.length > 0) && (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) !== undefined))))
                    ((item.deliveries.length > 0) && (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length === 0))))

                setIsLoading(false);
            }
        }).catch(e => {
            console.log('error loading orders', e)
            setIsLoading(false);
        })

        updateSystemDateTime();

    }, [props.screenFocused])

    const updateSystemDateTime = () => {
        window.setTimeout(() => {
            setCurrentSystemDateTime(moment());
            updateSystemDateTime();
        }, 1000)
    }

    const printWindow = (data) => {
        let mywindow = window.open('', 'new div', 'height=400,width=600');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('<link rel="stylesheet" href="../../css/index.css" type="text/css" media="all" />');
        mywindow.document.write('<style>@media print {@page {margin: 0;}body {margin:0;padding: 15mm 10mm;}}</style>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        setTimeout(function () { mywindow.print(); }, 1000);

        return true;
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

    const onOrderClick = (order) => {
        setSelectedOrder(order);

        setSelectedBillToCustomer({ ...order.bill_to_company })
        setSelectedBillToCustomerContact({ ...(order.bill_to_company?.contacts || []).find(c => c.is_primary === 1) });

        setSelectedCarrier({ ...order.carrier })
        setSelectedCarrierContact({ ...(order.carrier?.contacts || []).find(c => c.is_primary === 1) })
        setSelectedCarrierDriver({
            ...order.driver,
            name: (order.driver?.first_name || '') + ((order.driver?.last_name || '').trim() === '' ? '' : ' ' + (order.driver?.last_name || ''))
        });

        let pickup_id = (order.routing || []).find(r => r.type === 'pickup')?.pickup_id || 0;
        let pickup = { ...((order.pickups || []).find(p => p.id === pickup_id) || (order.pickups || [])[0]) };

        setSelectedShipperCustomer(pickup === undefined ? {} : {
            ...pickup.customer,
            pickup_id: pickup.id,
            pu_date1: pickup.pu_date1,
            pu_date2: pickup.pu_date2,
            pu_time1: pickup.pu_time1,
            pu_time2: pickup.pu_time2,
            bol_numbers: pickup.bol_numbers,
            po_numbers: pickup.po_numbers,
            ref_numbers: pickup.ref_numbers,
            seal_number: pickup.seal_number,
            special_instructions: pickup.special_instructions,
            type: pickup.type,
        });
        setSelectedShipperCustomerContact({ ...(pickup.contacts || []).find(c => c.is_primary === 1) });

        let delivery_id = (order.routing || []).find(r => r.type === 'delivery')?.delivery_id || 0;
        let delivery = { ...((order.deliveries || []).find(d => d.id === delivery_id) || (order.deliveries || [])[0]) };

        setSelectedConsigneeCustomer(delivery === undefined ? {} : {
            ...delivery.customer,
            delivery_id: delivery.id,
            delivery_date1: delivery.delivery_date1,
            delivery_date2: delivery.delivery_date2,
            delivery_time1: delivery.delivery_time1,
            delivery_time2: delivery.delivery_time2,
            special_instructions: delivery.special_instructions,
            type: delivery.type,
        });
        setSelectedConsigneeCustomerContact({ ...(delivery.contacts || []).find(c => c.is_primary === 1) });
    }

    const getPickupsOnRouting = () => {
        let pickups = [];

        (selectedOrder?.routing || []).map((r, i) => {
            if (r.type === 'pickup') {
                pickups.push(selectedOrder.pickups.find(p => p.id === r.pickup_id))
            }
            return false;
        })

        return pickups;
    }

    const getDeliveriesOnRouting = () => {
        let deliveries = [];

        (selectedOrder?.routing || []).map((r, i) => {
            if (r.type === 'delivery') {
                deliveries.push(selectedOrder.deliveries.find(d => d.id === r.delivery_id))
            }
            return false;
        })

        return deliveries;
    }

    const onRefreshBtnClick = () => {
        if (!isLoading) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getOrders').then(async res => {
                if (res.data.result === 'OK') {
                    setOrders(res.data.orders.map(item => item));

                    setAvailableOrders(res.data.orders.filter(item => (item.carrier_id || 0) === 0));

                    setBookedOrders(res.data.orders.filter(item => ((item.carrier_id || 0) > 0) && (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') === undefined)));

                    setInTransitOrders(res.data.orders.filter(item =>
                        ((item.carrier_id || 0) > 0) &&
                        (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                        // ((item.deliveries.length === 0) || (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) === undefined))))
                        ((item.deliveries.length === 0) || (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length > 0))))

                    setDeliveredNotInvoicedOrders(res.data.orders.filter(item =>
                        ((item.order_invoiced || 0) === 0) &&
                        ((item.carrier_id || 0) > 0) &&
                        (item.events.find(ev => (ev.event_type?.name || '').toLowerCase() === 'loaded') !== undefined) &&
                        // ((item.deliveries.length > 0) && (item.events.find(ev => ev.consignee_id === item.deliveries[item.deliveries.length - 1].id) !== undefined))))
                        ((item.deliveries.length > 0) && (item.deliveries.filter(del => item.events.find(el => el.consignee_id === del.customer.id) === undefined).length === 0))))

                    if ((selectedOrder?.id || 0) > 0) {
                        let order = res.data.orders.find(o => o.id === selectedOrder.id);

                        setSelectedOrder(order);

                        setSelectedBillToCustomer(order.bill_to_company || {})
                        setSelectedBillToCustomerContact({});

                        order.bill_to_company?.contacts.map(c => {
                            if (c.is_primary === 1) {
                                setSelectedBillToCustomerContact(c);
                            }
                            return true;
                        });

                        setSelectedCarrier(order.carrier || {})
                        setSelectedCarrierContact({})

                        order.carrier?.contacts.map(c => {
                            if (c.is_primary === 1) {
                                setSelectedCarrierContact(c);
                            }
                            return true;
                        });

                        setSelectedCarrierDriver(order.driver || {});

                        setSelectedShipperCustomer(order.pickups[0]?.customer || {});
                        setSelectedShipperCustomerContact({});

                        ((order.pickups.length > 0 ? order.pickups[0]?.customer : {}).contacts || []).map(c => {
                            if (c.is_primary === 1) {
                                setSelectedShipperCustomerContact(c);
                            }
                            return true;
                        });

                        setSelectedConsigneeCustomer(order.deliveries.length > 0 ? order.deliveries[0]?.customer : {});
                        setSelectedConsigneeCustomerContact({});

                        ((order.deliveries.length > 0 ? order.deliveries[0]?.customer : {}).contacts || []).map(c => {
                            if (c.is_primary === 1) {
                                setSelectedConsigneeCustomerContact(c);
                            }
                            return true;
                        });
                    }

                    setIsLoading(false);
                }
            }).catch(e => {
                console.log('error loading orders', e)
                setIsLoading(false);
            })
        }
    }

    return (
        <div className="load-board-main-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? 'transparent' : 'rgb(250, 250, 250)',
            background: props.isOnPanel ? 'transparent' : '-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : '-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : 'radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative'
        }}>

            <div className="fields-container-col grow" style={{ marginRight: 10 }}>
                <div className="form-bordered-box" style={{ marginBottom: 10 }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Available</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if (availableOrders.length === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                let html = `<h2>Available Orders</h2></br></br>`;

                                html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Order Number</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Starting City/State</div>
                                            <div style="min-width:50%;max-width:50%;text-decoration:underline">Destination City/State</div>
                                            
                                        </div>
                                        `;

                                availableOrders.map((item, index) => {
                                    html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:20%;max-width:20%">${item.order_number}</div>
                                            <div style="min-width:30%;max-width:30%">${item.pickups.length > 0
                                            ? item.pickups[0].city + ', ' + item.pickups[0].state
                                            : ''
                                        }</div>
                                            <div style="min-width:50%;max-width:50%">${item.deliveries.length > 0
                                            ? item.deliveries[item.deliveries.length - 1].city + ', ' + item.deliveries[item.deliveries.length - 1].state
                                            : ''
                                        }</div>
                                            
                                        </div>
                                        `;
                                })

                                printWindow(html);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="lb-form-container">
                        <div className="lb-form-wrapper">
                            {
                                availableOrders.length > 0 &&
                                <div className="lb-form-item">
                                    <div className="order-number">Order Number</div>
                                    <div className="starting-city-state">Starting City/State</div>
                                    <div className="destination-city-state">Destination City/State</div>
                                </div>
                            }
                            {
                                availableOrders.map((item, i) => {
                                    const itemClasses = classnames({
                                        'lb-form-item': true,
                                        'selected': (selectedOrder.id || 0) === item.id
                                    })
                                    return (
                                        <div className={itemClasses} key={i} onClick={() => { onOrderClick(item) }} onDoubleClick={() => {
                                            let panel = {
                                                panelName: `${props.panelName}-dispatch`,
                                                component: <Dispatch
                                                    title='Dispatch'
                                                    tabTimes={22000 + props.tabTimes}
                                                    panelName={`${props.panelName}-dispatch`}
                                                    origin={props.origin}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    openPanel={props.openPanel}
                                                    closePanel={props.closePanel}
                                                    componentId={moment().format('x')}

                                                    order_id={item.id}
                                                />
                                            }

                                            props.openPanel(panel, props.origin);
                                        }}>
                                            <div className="order-number">{item.order_number}</div>
                                            <div className="starting-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[0].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                            <div className="destination-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[item.routing.length - 1].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="form-bordered-box" style={{ marginBottom: 10 }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Booked</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if (bookedOrders.length === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                let html = `<h2>Booked Orders</h2></br></br>`;

                                html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Order Number</div>
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Carrier Code</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Starting City/State</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Destination City/State</div>
                                            
                                        </div>
                                        `;

                                bookedOrders.map((item, index) => {
                                    html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:20%;max-width:20%">${item.order_number}</div>
                                            <div style="min-width:20%;max-width:20%">${item.carrier.code.toUpperCase() + (item.carrier.code_number === 0 ? '' : item.carrier.code_number)}</div>
                                            <div style="min-width:30%;max-width:30%">${item.pickups.length > 0
                                            ? item.pickups[0].customer?.city + ', ' + item.pickups[0].customer?.state
                                            : ''
                                        }</div>
                                            <div style="min-width:30%;max-width:30%">${item.deliveries.length > 0
                                            ? item.deliveries[item.deliveries.length - 1].customer?.city + ', ' + item.deliveries[item.deliveries.length - 1].customer?.state
                                            : ''
                                        }</div>
                                            
                                        </div>
                                        `;
                                })

                                printWindow(html);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="lb-form-container">
                        <div className="lb-form-wrapper">
                            {
                                bookedOrders.length > 0 &&
                                <div className="lb-form-item">
                                    <div className="order-number">Order Number</div>
                                    <div className="carrier-code">Carrier Code</div>
                                    <div className="starting-city-state">Starting City/State</div>
                                    <div className="destination-city-state">Destination City/State</div>
                                </div>
                            }
                            {
                                bookedOrders.map((item, i) => {
                                    const itemClasses = classnames({
                                        'lb-form-item': true,
                                        'selected': (selectedOrder.id || 0) === item.id
                                    })
                                    return (
                                        <div className={itemClasses} key={i} onClick={() => { onOrderClick(item) }} onDoubleClick={() => {
                                            let panel = {
                                                panelName: `${props.panelName}-dispatch`,
                                                component: <Dispatch
                                                    title='Dispatch'
                                                    tabTimes={22000 + props.tabTimes}
                                                    panelName={`${props.panelName}-dispatch`}
                                                    origin={props.origin}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    openPanel={props.openPanel}
                                                    closePanel={props.closePanel}
                                                    componentId={moment().format('x')}

                                                    order_id={item.id}
                                                />
                                            }

                                            props.openPanel(panel, props.origin);
                                        }}>
                                            <div className="order-number">{item.order_number}</div>
                                            <div className="carrier-code">{item.carrier?.code.toUpperCase() + (item.carrier?.code_number === 0 ? '' : item.carrier?.code_number)}</div>
                                            <div className="starting-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[0].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                            <div className="destination-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[item.routing.length - 1].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">In Transit</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if (inTransitOrders.length === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                let html = `<h2>In Transit Orders</h2></br></br>`;

                                html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Order Number</div>
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Carrier Code</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Starting City/State</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Destination City/State</div>
                                            
                                        </div>
                                        `;

                                inTransitOrders.map((item, index) => {
                                    html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:20%;max-width:20%">${item.order_number}</div>
                                            <div style="min-width:20%;max-width:20%">${item.carrier.code.toUpperCase() + (item.carrier.code_number === 0 ? '' : item.carrier.code_number)}</div>
                                            <div style="min-width:30%;max-width:30%">${item.pickups.length > 0
                                            ? item.pickups[0].customer?.city + ', ' + item.pickups[0].customer?.state
                                            : ''
                                        }</div>
                                            <div style="min-width:30%;max-width:30%">${item.deliveries.length > 0
                                            ? item.deliveries[item.deliveries.length - 1].customer?.city + ', ' + item.deliveries[item.deliveries.length - 1].customer?.state
                                            : ''
                                        }</div>
                                            
                                        </div>
                                        `;
                                })

                                printWindow(html);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="lb-form-container">
                        <div className="lb-form-wrapper">
                            {
                                inTransitOrders.length > 0 &&
                                <div className="lb-form-item">
                                    <div className="order-number">Order Number</div>
                                    <div className="carrier-code">Carrier Code</div>
                                    <div className="starting-city-state">Starting City/State</div>
                                    <div className="destination-city-state">Destination City/State</div>
                                </div>
                            }
                            {
                                inTransitOrders.map((item, i) => {
                                    const itemClasses = classnames({
                                        'lb-form-item': true,
                                        'selected': (selectedOrder.id || 0) === item.id
                                    })
                                    return (
                                        <div className={itemClasses} key={i} onClick={() => { onOrderClick(item) }} onDoubleClick={() => {
                                            let panel = {
                                                panelName: `${props.panelName}-dispatch`,
                                                component: <Dispatch
                                                    title='Dispatch'
                                                    tabTimes={22000 + props.tabTimes}
                                                    panelName={`${props.panelName}-dispatch`}
                                                    origin={props.origin}
                                                    isOnPanel={true}
                                                    isAdmin={props.isAdmin}
                                                    openPanel={props.openPanel}
                                                    closePanel={props.closePanel}
                                                    componentId={moment().format('x')}

                                                    order_id={item.id}
                                                />
                                            }

                                            props.openPanel(panel, props.origin);
                                        }}>
                                            <div className="order-number">{item.order_number}</div>
                                            <div className="carrier-code">{item.carrier.code.toUpperCase() + (item.carrier.code_number === 0 ? '' : item.carrier.code_number)}</div>
                                            <div className="starting-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[0].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                            <div className="destination-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[item.routing.length - 1].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="fields-container-col grow" style={{ minWidth: '800px' }}>
                <div className="form-borderless-box" style={{ marginBottom: 15 }}>
                    <div className="form-row" style={{ position: 'relative' }}>
                        <div className="mochi-button" onClick={onRefreshBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Refresh</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        {
                            isLoading &&
                            <div className="loading-container" style={{
                                backgroundColor: 'transparent',
                                width: '50%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Loader type="Circles" color="#009bdd" height={20} width={20} visible={isLoading} />
                            </div>
                        }

                        <div className="input-toggle-container" style={{ position: 'relative' }}>
                            <input type="hidden"
                                ref={refAutoRefresh}
                                onKeyDown={(e) => {

                                }}
                            />
                            <input type="checkbox" id="cbox-load-board-auto-refresh-btn"
                                onChange={(e) => {
                                    let index = systemConfig.findIndex(c => c.name === 'load_board_auto_refresh_enabled');
                                    let newSystemConfig = [...systemConfig];

                                    if (index > -1) {
                                        newSystemConfig[index] = {
                                            name: 'load_board_auto_refresh_enabled',
                                            value: e.target.checked ? '1' : '0'
                                        }

                                        setSystemConfig(newSystemConfig);
                                    } else {
                                        newSystemConfig.push({
                                            name: 'load_board_auto_refresh_enabled',
                                            value: e.target.checked ? '1' : '0'
                                        });

                                        setSystemConfig(newSystemConfig);
                                    }

                                    axios.post(props.serverUrl + '/saveConfig', { config: newSystemConfig }).then(res => {
                                        if (e.target.checked) {
                                            setShowRefreshIntervals(true);
                                            refAutoRefresh.current.focus();
                                        }
                                    }).catch(e => {
                                        console.log('error saving config', e);
                                    });
                                }}
                                checked={systemConfig.find(c => c.name === 'load_board_auto_refresh_enabled') === undefined ? false : systemConfig.find(c => c.name === 'load_board_auto_refresh_enabled').value === '1'}
                            />
                            <label htmlFor="cbox-load-board-auto-refresh-btn">
                                <div className="label-text">Auto Refresh</div>
                                <div className="input-toggle-btn"></div>
                            </label>
                            {
                                refreshIntervalTransition((style, item) => item && (
                                    <animated.div
                                        className="mochi-contextual-container"
                                        id="mochi-contextual-container-refresh-intervals"
                                        style={{
                                            ...style,
                                            left: '-280%',
                                            display: 'block'
                                        }}
                                        ref={refShowRefreshIntervalsDropDown}
                                    >
                                        <div className="mochi-contextual-popup vertical below left corner">
                                            <div className="mochi-contextual-popup-content">
                                                <div className="mochi-contextual-popup-wrapper">
                                                    {
                                                        refreshIntervalItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                'mochi-item': true,
                                                                'selected': item.selected
                                                            });

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    style={{ position: 'relative', cursor: 'default' }}
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();

                                                                        let indexTime = systemConfig.findIndex(c => c.name === 'load_board_auto_refresh_time');
                                                                        let indexInterval = systemConfig.findIndex(c => c.name === 'load_board_auto_refresh_interval');

                                                                        let newSystemConfig = [...systemConfig];

                                                                        if (indexTime > -1) {
                                                                            newSystemConfig[indexTime] = {
                                                                                name: 'load_board_auto_refresh_time',
                                                                                value: item.time
                                                                            }
                                                                        } else {
                                                                            newSystemConfig.push({
                                                                                name: 'load_board_auto_refresh_time',
                                                                                value: item.time
                                                                            });
                                                                        }

                                                                        if (indexInterval > -1) {
                                                                            newSystemConfig[indexInterval] = {
                                                                                name: 'load_board_auto_refresh_interval',
                                                                                value: item.interval
                                                                            }
                                                                        } else {
                                                                            newSystemConfig.push({
                                                                                name: 'load_board_auto_refresh_interval',
                                                                                value: item.interval
                                                                            });
                                                                        }

                                                                        setSystemConfig(newSystemConfig);

                                                                        axios.post(props.serverUrl + '/saveConfig', { config: newSystemConfig }).then(res => {
                                                                            setShowRefreshIntervals(false);
                                                                            setLoadBoardTimer();
                                                                        }).catch(e => {
                                                                            console.log('error saving config', e);
                                                                            setShowRefreshIntervals(false);
                                                                        });
                                                                    }}
                                                                    onMouseOver={() => {
                                                                        setRefreshIntervalItems(refreshIntervalItems.map((x) => {
                                                                            x.selected = x.id === item.id;
                                                                            return x;
                                                                        }))
                                                                    }}
                                                                    ref={ref => refRefreshIntervalPopupItems.current.push(ref)}
                                                                >
                                                                    <span>{item.time}</span> <span style={{ textTransform: 'capitalize' }}>{item.interval}</span>
                                                                    {
                                                                        item.selected &&
                                                                        <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} style={{
                                                                            position: 'absolute',
                                                                            left: '-5px',
                                                                            color: '#2bc1ff',
                                                                            top: '50%',
                                                                            transform: 'translateY(-50%)'
                                                                        }} />
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
                </div>
                <div className="form-bordered-box" style={{ marginBottom: 10, paddingTop: 20 }}>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Load Information</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if ((selectedOrder?.id || 0) === 0) {
                                    window.alert('You must select an order first!');
                                    return;
                                }

                                let panel = {
                                    panelName: `${props.panelName}-order`,
                                    component: <Order
                                        title='Order'
                                        tabTimes={37000 + props.tabTimes}
                                        panelName={`${props.panelName}-order`}
                                        origin={props.origin}
                                        componentId={moment().format('x')}
                                        selectedOrder={selectedOrder}
                                    />
                                }

                                props.openPanel(panel, props.origin);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    {
                        selectedOrder.id !== undefined &&

                        <div className="lb-form-container rows">
                            <div className="lb-form-row">

                                <div className='form-bordered-box'>
                                    <div className='form-header'>
                                        <div className='top-border top-border-left'></div>
                                        <div className='form-title'>Bill To</div>
                                        <div className='top-border top-border-middle'></div>
                                        <div className='form-buttons'>
                                            <div className='mochi-button' onClick={() => {
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
                                                        openPanel={props.openPanel}
                                                        closePanel={props.closePanel}

                                                        customer_id={selectedBillToCustomer.id}
                                                    />
                                                }

                                                props.openPanel(panel, props.origin);
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
                                                value={(selectedBillToCustomer.code_number || 0) === 0 ? (selectedBillToCustomer.code || '') : selectedBillToCustomer.code + selectedBillToCustomer.code_number}

                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={7 + props.tabTimes} type="text" placeholder="Name"
                                                readOnly={true}
                                                value={selectedBillToCustomer.name || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input tabIndex={8 + props.tabTimes} type="text" placeholder="Address 1"
                                                readOnly={true}
                                                value={selectedBillToCustomer.address1 || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input tabIndex={9 + props.tabTimes} type="text" placeholder="Address 2"
                                                readOnly={true}
                                                value={selectedBillToCustomer.address2 || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input tabIndex={10 + props.tabTimes} type="text" placeholder="City"
                                                readOnly={true}
                                                value={selectedBillToCustomer.city || ''}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input tabIndex={11 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                                readOnly={true}
                                                value={selectedBillToCustomer.state || ''}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-zip-code">
                                            <input tabIndex={12 + props.tabTimes} type="text" placeholder="Postal Code"
                                                readOnly={true}
                                                value={selectedBillToCustomer.zip || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input tabIndex={13 + props.tabTimes} type="text" placeholder="Contact Name"
                                                readOnly={true}
                                                value={
                                                    (selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                        ? (selectedBillToCustomer?.contact_name || '')
                                                        : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).last_name
                                                }
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                            <MaskedInput tabIndex={14 + props.tabTimes}
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Contact Phone"
                                                readOnly={true}
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
                                                value={
                                                    (selectedBillToCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                        ? (selectedBillToCustomer?.ext || '')
                                                        : selectedBillToCustomer?.contacts.find(c => c.is_primary === 1).phone_ext
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-bordered-box'>
                                    <div className='form-header'>
                                        <div className='top-border top-border-left'></div>
                                        <div className='form-title'>Carrier</div>
                                        <div className='top-border top-border-middle'></div>
                                        <div className='form-buttons'>
                                            <div className='mochi-button' onClick={() => {
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
                                                        openPanel={props.openPanel}
                                                        closePanel={props.closePanel}

                                                        carrier_id={selectedCarrier.id}
                                                    />
                                                }

                                                props.openPanel(panel, props.origin);
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
                                                value={(selectedCarrier.code_number || 0) === 0 ? (selectedCarrier.code || '') : selectedCarrier.code + selectedCarrier.code_number}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={51 + props.tabTimes} type="text" placeholder="Name"
                                                readOnly={true}
                                                value={selectedCarrier.name || ''}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className={insuranceStatusClasses()} style={{ width: '7rem' }}>
                                            <input type="text" placeholder="Insurance" readOnly={true} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input tabIndex={52 + props.tabTimes} type="text" placeholder="Carrier Load - Starting City State - Destination City State"
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
                                        <div className="input-box-container grow">
                                            <input tabIndex={53 + props.tabTimes} type="text" placeholder="Contact Name"
                                                readOnly={true}
                                                value={
                                                    (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                        ? (selectedCarrier?.contact_name || '')
                                                        : selectedCarrier?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedCarrier?.contacts.find(c => c.is_primary === 1).last_name
                                                }
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow" style={{ position: 'relative' }}>
                                            <MaskedInput tabIndex={54 + props.tabTimes}
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Contact Phone"
                                                readOnly={true}
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
                                            {
                                                ((selectedCarrier?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                                <div
                                                    className={classnames({
                                                        'selected-carrier-contact-primary-phone': true,
                                                        'pushed': false
                                                    })}>
                                                    {selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone}
                                                </div>
                                            }
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-phone-ext">
                                            <input tabIndex={55 + props.tabTimes} type="text" placeholder="Ext"
                                                readOnly={true}
                                                value={
                                                    (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                        ? (selectedCarrier?.ext || '')
                                                        : selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_ext
                                                }
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow" style={{ position: 'relative' }}>
                                            <input tabIndex={56 + props.tabTimes} type="text" placeholder="Equipments"
                                                readOnly={true}
                                                value={selectedCarrierDriver.equipment?.name || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow" style={{ position: 'relative' }}>
                                            <input tabIndex={57 + props.tabTimes} type="text" placeholder="Driver Name"
                                                readOnly={true}
                                                value={selectedCarrierDriver.first_name + ((selectedCarrierDriver.last_name || '').trim() === '' ? '' : ' ' + selectedCarrierDriver.last_name)}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput tabIndex={58 + props.tabTimes}
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Driver Phone"
                                                readOnly={true}
                                                value={selectedCarrierDriver.phone || ''}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={59 + props.tabTimes} type="text" placeholder="Unit Number"
                                                readOnly={true}
                                                value={selectedCarrierDriver.truck || ''}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={60 + props.tabTimes} type="text" placeholder="Trailer Number"
                                                readOnly={true}
                                                value={selectedCarrierDriver.trailer || ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lb-form-row" style={{
                                minHeight: '2.5rem',
                                display: 'flex'
                            }}>

                                <div className="pickups-container" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div className="lb-swiper-pickup-prev-btn"><span className="fas fa-chevron-left"></span></div>

                                    <Swiper
                                        slidesPerView={5}
                                        navigation={{
                                            prevEl: ".lb-swiper-pickup-prev-btn",
                                            nextEl: ".lb-swiper-pickup-next-btn"
                                        }}
                                    >
                                        {
                                            [
                                                ...getPickupsOnRouting(),
                                                ...(selectedOrder?.pickups || []).filter(p => selectedOrder?.routing.find(r => r.pickup_id === p.id) === undefined)
                                            ].map((pickup, index) => {
                                                let fulDateTime1 = (pickup.pu_date1 || '') + ' ' + (pickup.pu_time1 || '');
                                                let fulDateTime2 = (pickup.pu_date2 || '') + ' ' + (pickup.pu_time2 || '');
                                                let puDateTime = undefined;
                                                let statusClass = 'active';
                                                let curDateTime = currentSystemDateTime;

                                                if (moment(fulDateTime2, 'MM/DD/YYYY HHmm').format('MM/DD/YYYY HHmm') === fulDateTime2) {
                                                    puDateTime = moment(fulDateTime2, 'MM/DD/YYYY HHmm');
                                                } else if (moment(fulDateTime1, 'MM/DD/YYYY HHmm').format('MM/DD/YYYY HHmm') === fulDateTime1) {
                                                    puDateTime = moment(fulDateTime1, 'MM/DD/YYYY HHmm');
                                                }

                                                if (puDateTime !== undefined) {
                                                    let pastHour = puDateTime.clone().subtract(1, 'hours');

                                                    if (curDateTime < pastHour) {
                                                        statusClass = 'active';
                                                    } else if (curDateTime >= pastHour && curDateTime <= puDateTime) {
                                                        statusClass = 'warning';
                                                    } else {
                                                        statusClass = 'expired';
                                                    }

                                                    if ((selectedOrder?.events || []).length > 0) {
                                                        selectedOrder.events.map(item => {
                                                            if ((item.event_type?.name || '').toLowerCase() === 'loaded' && item.shipper_id === pickup.customer_id) {
                                                                curDateTime = moment(item.event_date + ' ' + item.event_time, 'MM/DD/YYYY HHmm');

                                                                if (curDateTime <= puDateTime) {
                                                                    statusClass = 'active';
                                                                } else {
                                                                    statusClass = 'expired';
                                                                }
                                                            }
                                                            return true;
                                                        })
                                                    }


                                                }

                                                let classes = classnames({
                                                    'order-pickup': true,
                                                    'selected': selectedShipperCustomer?.pickup_id === pickup.id,
                                                    'active': statusClass === 'active',
                                                    'warning': statusClass === 'warning',
                                                    'expired': statusClass === 'expired',
                                                    'unsaved': pickup.id === 0
                                                })

                                                return (
                                                    <SwiperSlide className={classes} key={index} onClick={() => {
                                                        setSelectedShipperCustomer({
                                                            ...pickup.customer,
                                                            pickup_id: pickup.id,
                                                            pu_date1: pickup.pu_date1,
                                                            pu_date2: pickup.pu_date2,
                                                            pu_time1: pickup.pu_time1,
                                                            pu_time2: pickup.pu_time2,
                                                            bol_numbers: pickup.bol_numbers,
                                                            po_numbers: pickup.po_numbers,
                                                            ref_numbers: pickup.ref_numbers,
                                                            seal_number: pickup.seal_number,
                                                            special_instructions: pickup.special_instructions,
                                                            type: pickup.type,
                                                        });

                                                        setSelectedShipperCustomerContact((pickup.customer?.contacts || []).find(c => c.is_primary === 1) || {});

                                                    }}>
                                                        <div>PU {index + 1}</div>

                                                    </SwiperSlide>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className="lb-swiper-pickup-next-btn"><span className="fas fa-chevron-right"></span></div>
                                </div>

                                <div className="form-h-sep"></div>
                                <div className='mochi-button' onClick={() => {
                                    if ((selectedOrder?.id || 0) === 0) {
                                        window.alert('You must select an order first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-routing`,
                                        component: <Routing
                                            panelName={`${props.panelName}-routing`}
                                            title='Routing'
                                            tabTimes={39000 + props.tabTimes}
                                            origin={props.origin}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}
                                            isAdmin={props.isAdmin}
                                            selectedOrder={selectedOrder}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                    <div className='mochi-button-base'>Routing</div>
                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="deliveries-container" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div className="lb-swiper-delivery-prev-btn"><span className="fas fa-chevron-left"></span></div>

                                    <Swiper
                                        slidesPerView={5}
                                        navigation={{
                                            prevEl: ".lb-swiper-delivery-prev-btn",
                                            nextEl: ".lb-swiper-delivery-next-btn"
                                        }}
                                    >
                                        {
                                            [
                                                ...getDeliveriesOnRouting(),
                                                ...(selectedOrder?.deliveries || []).filter(d => selectedOrder?.routing.find(r => r.delivery_id === d.id) === undefined)
                                            ].map((delivery, index) => {
                                                let fulDateTime1 = (delivery.delivery_date1 || '') + ' ' + (delivery.delivery_time1 || '');
                                                let fulDateTime2 = (delivery.delivery_date2 || '') + ' ' + (delivery.delivery_time2 || '');
                                                let deliveryDateTime = undefined;
                                                let statusClass = 'active';
                                                let curDateTime = currentSystemDateTime;

                                                if (moment(fulDateTime2, 'MM/DD/YYYY HHmm').format('MM/DD/YYYY HHmm') === fulDateTime2) {
                                                    deliveryDateTime = moment(fulDateTime2, 'MM/DD/YYYY HHmm');
                                                } else if (moment(fulDateTime1, 'MM/DD/YYYY HHmm').format('MM/DD/YYYY HHmm') === fulDateTime1) {
                                                    deliveryDateTime = moment(fulDateTime1, 'MM/DD/YYYY HHmm');
                                                }

                                                if (deliveryDateTime !== undefined) {
                                                    let pastHour = deliveryDateTime.clone().subtract(1, 'hours');

                                                    if (curDateTime < pastHour) {
                                                        statusClass = 'active';
                                                    } else if (curDateTime >= pastHour && curDateTime <= deliveryDateTime) {
                                                        statusClass = 'warning';
                                                    } else {
                                                        statusClass = 'expired';
                                                    }

                                                    if ((selectedOrder?.events || []).length > 0) {
                                                        selectedOrder.events.map(item => {
                                                            if ((item.event_type?.name || '').toLowerCase() === 'delivered' && item.consignee_id === delivery.customer_id) {
                                                                curDateTime = moment(item.event_date + ' ' + item.event_time, 'MM/DD/YYYY HHmm');

                                                                if (curDateTime <= deliveryDateTime) {
                                                                    statusClass = 'active';
                                                                } else {
                                                                    statusClass = 'expired';
                                                                }
                                                            }
                                                            return true;
                                                        })
                                                    }


                                                }

                                                let classes = classnames({
                                                    'order-delivery': true,
                                                    'selected': selectedConsigneeCustomer?.delivery_id === delivery.id,
                                                    'active': statusClass === 'active',
                                                    'warning': statusClass === 'warning',
                                                    'expired': statusClass === 'expired',
                                                    'unsaved': delivery.id === 0
                                                })

                                                return (
                                                    <SwiperSlide className={classes} key={index} onClick={() => {
                                                        setSelectedConsigneeCustomer({
                                                            ...delivery.customer,
                                                            delivery_id: delivery.id,
                                                            delivery_date1: delivery.delivery_date1,
                                                            delivery_date2: delivery.delivery_date2,
                                                            delivery_time1: delivery.delivery_time1,
                                                            delivery_time2: delivery.delivery_time2,
                                                            special_instructions: delivery.special_instructions,
                                                            type: delivery.type,
                                                        });

                                                        setSelectedConsigneeCustomerContact((delivery.customer?.contacts || []).find(c => c.is_primary === 1) || {});
                                                    }}>
                                                        <div>Delivery {index + 1}</div>

                                                    </SwiperSlide>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className="lb-swiper-delivery-next-btn"><span className="fas fa-chevron-right"></span></div>
                                </div>

                            </div>


                            <div className="lb-form-row">
                                <div className='form-bordered-box'>
                                    <div className='form-header'>
                                        <div className='top-border top-border-left'></div>
                                        <div className='form-title'>Shipper</div>
                                        <div className='top-border top-border-middle'></div>
                                        <div className='form-buttons'>
                                            <div className='mochi-button' onClick={() => {
                                                if ((selectedShipperCustomer.id || 0) === 0) {
                                                    window.alert('You must select a customer first!');
                                                    return;
                                                }

                                                let panel = {
                                                    panelName: `${props.panelName}-customer`,
                                                    component: <Customers
                                                        pageName={'Customer'}
                                                        title={'Shipper Company'}
                                                        panelName={`${props.panelName}-customer`}
                                                        tabTimes={28000 + props.tabTimes}
                                                        componentId={moment().format('x')}
                                                        isOnPanel={true}
                                                        isAdmin={props.isAdmin}
                                                        origin={props.origin}
                                                        openPanel={props.openPanel}
                                                        closePanel={props.closePanel}

                                                        customer_id={selectedShipperCustomer.id}
                                                    />
                                                }

                                                props.openPanel(panel, props.origin);
                                            }}>
                                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                <div className='mochi-button-base'>Company info</div>
                                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                            </div>
                                            {
                                                showingShipperSecondPage &&
                                                <div className='mochi-button' onClick={() => { setShowingShipperSecondPage(false) }}>
                                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                    <div className='mochi-button-base'>1st Page</div>
                                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                                </div>
                                            }
                                            {
                                                !showingShipperSecondPage &&
                                                <div className='mochi-button' onClick={() => { setShowingShipperSecondPage(true) }}>
                                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                    <div className='mochi-button-base'>2nd Page</div>
                                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                                </div>
                                            }

                                        </div>
                                        <div className='top-border top-border-right'></div>
                                    </div>

                                    <div className="form-row">
                                        <div className="input-box-container input-code">
                                            <input tabIndex={16 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                                readOnly={true}
                                                value={(selectedShipperCustomer.code_number || 0) === 0 ? (selectedShipperCustomer.code || '') : selectedShipperCustomer.code + selectedShipperCustomer.code_number}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={17 + props.tabTimes} type="text" placeholder="Name"
                                                readOnly={true}
                                                value={selectedShipperCustomer.name || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-slider">
                                        <div className="form-slider-wrapper" style={{ left: !showingShipperSecondPage ? 0 : '-100%' }}>
                                            <div className="first-page">
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={18 + props.tabTimes} type="text" placeholder="Address 1"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer.address1 || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={19 + props.tabTimes} type="text" placeholder="Address 2"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer.address2 || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={20 + props.tabTimes} type="text" placeholder="City"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer.city || ''}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-state">
                                                        <input tabIndex={21 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer.state || ''}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-zip-code">
                                                        <input tabIndex={22 + props.tabTimes} type="text" placeholder="Postal Code"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer.zip || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={23 + props.tabTimes} type="text" placeholder="Contact Name"
                                                            readOnly={true}
                                                            value={
                                                                (selectedShipperCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedShipperCustomer?.contact_name || '')
                                                                    : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).last_name
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                                        <MaskedInput tabIndex={24 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={true}
                                                            type="text" placeholder="Contact Phone"
                                                            readOnly={true}
                                                            value={
                                                                (selectedShipperCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedShipperCustomer?.contact_phone || '')
                                                                    : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                                        ? selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_work
                                                                        : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                                            ? selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                                            : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                                                ? selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                                                : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                                                    ? selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_direct
                                                                                    : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                                        ? selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_other
                                                                                        : ''
                                                            }
                                                        />
                                                        {
                                                            ((selectedShipperCustomer?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                                            <div
                                                                className={classnames({
                                                                    'selected-customer-contact-primary-phone': true,
                                                                    'pushed': false
                                                                })}>
                                                                {selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).primary_phone}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-phone-ext">
                                                        <input tabIndex={25 + props.tabTimes} type="text" placeholder="Ext"
                                                            readOnly={true}
                                                            value={
                                                                (selectedShipperCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedShipperCustomer?.ext || '')
                                                                    : selectedShipperCustomer?.contacts.find(c => c.is_primary === 1).phone_ext
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="second-page" onFocus={() => { setShowingShipperSecondPage(true) }}>
                                                <div className="form-row" style={{ alignItems: 'center' }}>
                                                    <div className="input-box-container grow">
                                                        <MaskedInput tabIndex={26 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={false}
                                                            type="text" placeholder="PU Date 1"
                                                            readOnly={true}
                                                            value={(selectedShipperCustomer?.pu_date1 || '')}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={27 + props.tabTimes} type="text" placeholder="PU Time 1"
                                                            readOnly={true}
                                                            value={(selectedShipperCustomer?.pu_time1 || '')}
                                                        />
                                                    </div>
                                                    <div style={{ minWidth: '1.5rem', fontSize: '0.7rem', textAlign: 'center' }}>To</div>
                                                    <div className="input-box-container grow">
                                                        <MaskedInput tabIndex={28 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={false}
                                                            type="text" placeholder="PU Date 2"
                                                            value={(selectedShipperCustomer?.pu_date2 || '')}
                                                        />

                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={29 + props.tabTimes} type="text" placeholder="PU Time 2"
                                                            readOnly={true}
                                                            value={(selectedShipperCustomer?.pu_time2 || '')}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row" style={{ alignItems: 'center' }}>
                                                    <div className="input-box-container grow" style={{ flexGrow: 1, flexBasis: '100%' }}>
                                                        {
                                                            (selectedShipperCustomer?.bol_numbers || '').split(' ').map((item, index) => {
                                                                if (item.trim() !== '') {
                                                                    return (
                                                                        <div key={index} style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            fontSize: '0.7rem',
                                                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                                                            padding: '2px 10px',
                                                                            borderRadius: '10px',
                                                                            marginRight: '2px',
                                                                            cursor: 'default'
                                                                        }} title={item}>
                                                                            <span className="automatic-email-inputted" style={{ whiteSpace: 'nowrap' }}>{item.toLowerCase()}</span>
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return false;
                                                                }
                                                            })
                                                        }
                                                        <input tabIndex={30 + props.tabTimes} type="text" placeholder="BOL Numbers"
                                                            readOnly={true}
                                                            value={''}
                                                        />
                                                    </div>
                                                    <div style={{ minWidth: '1.5rem', fontSize: '1rem', textAlign: 'center' }}></div>
                                                    <div className="input-box-container grow" style={{ flexGrow: 1, flexBasis: '100%' }}>
                                                        {
                                                            (selectedShipperCustomer?.po_numbers || '').split(' ').map((item, index) => {
                                                                if (item.trim() !== '') {
                                                                    return (
                                                                        <div key={index} style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            fontSize: '0.7rem',
                                                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                                                            padding: '2px 10px',
                                                                            borderRadius: '10px',
                                                                            marginRight: '2px',
                                                                            cursor: 'default'
                                                                        }} title={item}>
                                                                            <span className="automatic-email-inputted" style={{ whiteSpace: 'nowrap' }}>{item.toLowerCase()}</span>
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return false;
                                                                }
                                                            })
                                                        }
                                                        <input tabIndex={31 + props.tabTimes} type="text" placeholder="PO Numbers"
                                                            readOnly={true}
                                                            value={''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row" style={{ alignItems: 'center' }}>
                                                    <div className="input-box-container grow" style={{ flexGrow: 1, flexBasis: '100%' }}>
                                                        {
                                                            (selectedShipperCustomer?.ref_numbers || '').split(' ').map((item, index) => {
                                                                if (item.trim() !== '') {
                                                                    return (
                                                                        <div key={index} style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            fontSize: '0.7rem',
                                                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                                                            padding: '2px 10px',
                                                                            borderRadius: '10px',
                                                                            marginRight: '2px',
                                                                            cursor: 'default'
                                                                        }} title={item}>
                                                                            <span className="automatic-email-inputted" style={{ whiteSpace: 'nowrap' }}>{item.toLowerCase()}</span>
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return false;
                                                                }
                                                            })
                                                        }
                                                        <input tabIndex={32 + props.tabTimes} type="text" placeholder="REF Numbers"
                                                            readOnly={true}
                                                            value={''}
                                                        />
                                                    </div>
                                                    <div style={{ minWidth: '1.5rem', fontSize: '1rem', textAlign: 'center' }}></div>
                                                    <div className="input-box-container grow" style={{ flexGrow: 1, flexBasis: '100%' }}>
                                                        <input tabIndex={33 + props.tabTimes} type="text" placeholder="SEAL Number"
                                                            readOnly={true}
                                                            value={selectedShipperCustomer?.seal_number || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row" style={{ alignItems: 'center' }}>
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={34 + props.tabTimes} type="text" placeholder="Special Instructions"
                                                            readOnly={true}
                                                            value={props.selectedShipperCompanyInfo?.special_instructions || ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='form-bordered-box'>
                                    <div className='form-header'>
                                        <div className='top-border top-border-left'></div>
                                        <div className='form-title'>Consignee</div>
                                        <div className='top-border top-border-middle'></div>
                                        <div className='form-buttons'>
                                            <div className='mochi-button' onClick={() => {
                                                if ((selectedConsigneeCustomer.id || 0) === 0) {
                                                    window.alert('You must select a customer first!');
                                                    return;
                                                }

                                                let panel = {
                                                    panelName: `${props.panelName}-customer`,
                                                    component: <Customers
                                                        pageName={'Customer'}
                                                        title={'Consignee Company'}
                                                        panelName={`${props.panelName}-customer`}
                                                        tabTimes={28000 + props.tabTimes}
                                                        componentId={moment().format('x')}
                                                        isOnPanel={true}
                                                        isAdmin={props.isAdmin}
                                                        origin={props.origin}
                                                        openPanel={props.openPanel}
                                                        closePanel={props.closePanel}

                                                        customer_id={selectedConsigneeCustomer.id}
                                                    />
                                                }

                                                props.openPanel(panel, props.origin);
                                            }}>
                                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                <div className='mochi-button-base'>Company info</div>
                                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                            </div>
                                            {
                                                showingConsigneeSecondPage &&
                                                <div className='mochi-button' onClick={() => { setShowingConsigneeSecondPage(false) }}>
                                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                    <div className='mochi-button-base'>1st Page</div>
                                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                                </div>
                                            }
                                            {
                                                !showingConsigneeSecondPage &&
                                                <div className='mochi-button' onClick={() => { setShowingConsigneeSecondPage(true) }}>
                                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                    <div className='mochi-button-base'>2nd Page</div>
                                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                                </div>
                                            }
                                        </div>
                                        <div className='top-border top-border-right'></div>
                                    </div>

                                    <div className="form-row">
                                        <div className="input-box-container input-code">
                                            <input tabIndex={35 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                                readOnly={true}
                                                value={(selectedConsigneeCustomer.code_number || 0) === 0 ? (selectedConsigneeCustomer.code || '') : selectedConsigneeCustomer.code + selectedConsigneeCustomer.code_number}
                                            />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input tabIndex={36 + props.tabTimes} type="text" placeholder="Name"
                                                readOnly={true}
                                                value={selectedConsigneeCustomer.name || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-slider">
                                        <div className="form-slider-wrapper" style={{ left: !showingConsigneeSecondPage ? 0 : '-100%' }}>
                                            <div className="first-page">
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={37 + props.tabTimes} type="text" placeholder="Address 1"
                                                            readOnly={true}
                                                            value={selectedConsigneeCustomer.address1 || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={38 + props.tabTimes} type="text" placeholder="Address 2"
                                                            readOnly={true}
                                                            value={selectedConsigneeCustomer.address2 || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={39 + props.tabTimes} type="text" placeholder="City"
                                                            readOnly={true}
                                                            value={selectedConsigneeCustomer.city || ''}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-state">
                                                        <input tabIndex={40 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                                            readOnly={true}
                                                            value={selectedConsigneeCustomer.state || ''}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-zip-code">
                                                        <input tabIndex={41 + props.tabTimes} type="text" placeholder="Postal Code"
                                                            readOnly={true}
                                                            value={selectedConsigneeCustomer.zip || ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row">
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={42 + props.tabTimes} type="text" placeholder="Contact Name"
                                                            readOnly={true}
                                                            value={
                                                                (selectedConsigneeCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedConsigneeCustomer?.contact_name || '')
                                                                    : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).last_name
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                                        <MaskedInput tabIndex={43 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={true}
                                                            type="text" placeholder="Contact Phone"
                                                            readOnly={true}
                                                            value={
                                                                (selectedConsigneeCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedConsigneeCustomer?.contact_phone || '')
                                                                    : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                                        ? selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_work
                                                                        : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                                            ? selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                                            : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                                                ? selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                                                : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                                                    ? selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_direct
                                                                                    : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                                        ? selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_other
                                                                                        : ''
                                                            }
                                                        />

                                                        {
                                                            ((selectedConsigneeCustomer?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                                            <div
                                                                className={classnames({
                                                                    'selected-customer-contact-primary-phone': true,
                                                                    'pushed': false
                                                                })}>
                                                                {selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).primary_phone}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container input-phone-ext">
                                                        <input tabIndex={44 + props.tabTimes} type="text" placeholder="Ext"
                                                            readOnly={true}
                                                            value={
                                                                (selectedConsigneeCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                                    ? (selectedConsigneeCustomer?.ext || '')
                                                                    : selectedConsigneeCustomer?.contacts.find(c => c.is_primary === 1).phone_ext
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="second-page" onFocus={() => { setShowingConsigneeSecondPage(true) }}>
                                                <div className="form-row" style={{ alignItems: 'center' }}>
                                                    <div className="input-box-container grow">
                                                        <MaskedInput tabIndex={45 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={false}
                                                            type="text" placeholder="Delivery Date 1"
                                                            readOnly={true}
                                                            value={(selectedConsigneeCustomer?.delivery_date1 || '')}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={46 + props.tabTimes} type="text" placeholder="Delivery Time 1"
                                                            readOnly={true}
                                                            value={(selectedConsigneeCustomer?.delivery_time1 || '')}
                                                        />
                                                    </div>
                                                    <div style={{ minWidth: '1.5rem', fontSize: '0.7rem', textAlign: 'center' }}>To</div>
                                                    <div className="input-box-container grow">
                                                        <MaskedInput tabIndex={47 + props.tabTimes}
                                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                            guide={false}
                                                            type="text" placeholder="Delivery Date 2"
                                                            readOnly={true}
                                                            value={(selectedConsigneeCustomer?.delivery_date2 || '')}
                                                        />
                                                    </div>
                                                    <div className="form-h-sep"></div>
                                                    <div className="input-box-container grow">
                                                        <input tabIndex={48 + props.tabTimes} type="text" placeholder="Delivery Time 2"
                                                            readOnly={true}
                                                            value={(selectedConsigneeCustomer?.delivery_time2 || '')}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-v-sep"></div>
                                                <div className="form-row" style={{ flexGrow: 1 }}>
                                                    <div className="input-box-container grow" style={{ maxHeight: 'initial', minHeight: 'initial' }}>
                                                        <textarea tabIndex={49 + props.tabTimes} placeholder="Special Instructions" style={{
                                                            resize: 'none',
                                                            flexGrow: 1,
                                                            border: 0,
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                            readOnly={true}
                                                            value={(selectedConsigneeCustomer?.special_instructions || '')}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    }
                </div>

                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Loads Delivered but not Invoiced</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if (deliveredNotInvoiceOrders.length === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                let html = `<h2>Delivered But Not Invoiced Orders</h2></br></br>`;

                                html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Order Number</div>
                                            <div style="min-width:20%;max-width:20%;text-decoration:underline">Carrier Code</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Starting City/State</div>
                                            <div style="min-width:30%;max-width:30%;text-decoration:underline">Destination City/State</div>
                                            
                                        </div>
                                        `;

                                deliveredNotInvoiceOrders.map((item, index) => {
                                    html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:20%;max-width:20%">${item.order_number}</div>
                                            <div style="min-width:20%;max-width:20%">${item.carrier.code.toUpperCase() + (item.carrier.code_number === 0 ? '' : item.carrier.code_number)}</div>
                                            <div style="min-width:30%;max-width:30%">${item.pickups.length > 0
                                            ? item.pickups[0].customer?.city + ', ' + item.pickups[0].customer?.state
                                            : ''
                                        }</div>
                                            <div style="min-width:30%;max-width:30%">${item.deliveries.length > 0
                                            ? item.deliveries[item.deliveries.length - 1].customer?.city + ', ' + item.deliveries[item.deliveries.length - 1].customer?.state
                                            : ''
                                        }</div>
                                            
                                        </div>
                                        `;
                                })

                                printWindow(html);
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="lb-form-container">
                        <div className="lb-form-wrapper">
                            {
                                deliveredNotInvoiceOrders.length > 0 &&
                                <div className="lb-form-item">
                                    <div className="order-number">Order Number</div>
                                    <div className="carrier-code">Carrier Code</div>
                                    <div className="starting-city-state">Starting City/State</div>
                                    <div className="destination-city-state">Destination City/State</div>
                                </div>
                            }
                            {
                                deliveredNotInvoiceOrders.map((item, i) => {
                                    const itemClasses = classnames({
                                        'lb-form-item': true,
                                        'selected': (selectedOrder.id || 0) === item.id
                                    })
                                    return (
                                        <div className={itemClasses} key={i} onClick={() => { onOrderClick(item) }} onDoubleClick={() => {
                                            let panel = {
                                                panelName: `${props.panelName}-invoice`,
                                                component: <Invoice
                                                    pageName={'Invoice'}
                                                    title={'Invoice'}
                                                    panelName={'invoice'}
                                                    tabTimes={5000 + props.tabTimes}
                                                    screenFocused={props.invoiceScreenFocused}
                                                    componentId={moment().format('x')}
                                                    isOnPanel={true}
                                                    origin={props.origin}
                                                    openPanel={props.openPanel}
                                                    closePanel={props.closePanel}
                                                    order_id={item.id}
                                                />
                                            }

                                            props.openPanel(panel, props.origin);
                                        }} >
                                            <div className="order-number">{item.order_number}</div>
                                            <div className="carrier-code">{item.carrier.code.toUpperCase() + (item.carrier.code_number === 0 ? '' : item.carrier.code_number)}</div>
                                            <div className="starting-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[0].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[0].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[0].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                            <div className="destination-city-state">{
                                                ((item.routing || []).length >= 2)
                                                    ? item.routing[item.routing.length - 1].type === 'pickup'
                                                        ? (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (item.pickups.find(p => p.id === item.routing[item.routing.length - 1].pickup_id).customer?.state || '')
                                                        : (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (item.deliveries.find(d => d.id === item.routing[item.routing.length - 1].delivery_id).customer?.state || '')
                                                    : ''
                                            }</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
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

        selectedOrder: state.dispatchReducers.selected_order,
        selectedCustomer: state.customerReducers.selectedCustomer,
        selectedCustomerContact: state.customerReducers.selectedContact,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedCarrierDriver: state.carrierReducers.selectedDriver,
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
})(LoadBoard)