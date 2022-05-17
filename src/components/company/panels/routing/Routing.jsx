import React, { useState, useRef, useEffect } from 'react';
import { connect } from "react-redux";
import './Routing.css';
import classnames from 'classnames';
import MaskedInput from 'react-text-mask';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import moment from 'moment';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';
import { DragDropContext, Droppable, Draggable as DraggableDnd } from 'react-beautiful-dnd'
import {
    setCompanyOpenedPanels,
    setAdminOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedOrder,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedDriver as setSelectedCarrierDriver,
    setSelectedInsurance as setSelectedCarrierInsurance
} from './../../../../actions';

import {
    Carriers
} from './../../../company';

import {
    RateConf
} from './../../panels';

const Routing = (props) => {
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
    const [selectedCarrierInsurance, setSelectedCarrierInsurance] = useState({});
    const [mileageLoaderVisible, setMileageLoaderVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [driverItems, setDriverItems] = useState([]);

    var delayTimer;

    const [list, setList] = useState([]);

    const mapRef = useRef();
    const H = window.H;
    const platform = new H.service.Platform({
        apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
        app_id: "X4qy0Sva14BQxJCbVqXL"
    });
    const routingService = platform.getRoutingService();

    const [equipmentItems, setEquipmentItems] = useState([]);
    const refEquipmentDropDown = useDetectClickOutside({ onTriggered: async () => { await setEquipmentItems([]) } });
    const refEquipmentPopupItems = useRef([]);

    const refEquipment = useRef();
    const refDriverDropDown = useDetectClickOutside({ onTriggered: async () => { await setDriverItems([]) } });
    const refDriverPopupItems = useRef([]);

    const [dragging, setDragging] = useState(false);
    const refCarrierEquipment = useRef();
    const refDriverName = useRef();
    const [carrierEquipment, setCarrierEquipment] = useState({});
    const refPopup = useRef();
    const [popupItems, setPopupItems] = useState([]);
    const popupContainerClasses = classnames({
        'mochi-contextual-container': true,
        'shown': popupItems.length > 0
    });
    const popupItemsRef = useRef([]);
    const [popupActiveInput, setPopupActiveInput] = useState('');

    const dragItem = useRef();
    const dragNode = useRef();

    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const [trigger, setTrigger] = useState(false);

    const [isSavingCarrierInfo, setIsSavingCarrierInfo] = useState(false);
    const [isSavingCarrierContact, setIsSavingCarrierContact] = useState(false);
    const [isSavingCarrierDriver, setIsSavingCarrierDriver] = useState(false);

    useEffect(() => {
        setSelectedOrder({ ...props.selectedOrder });
        setSelectedCarrier({ ...props.selectedOrder.carrier });
        setSelectedCarrierContact((props.selectedOrder?.carrier?.contacts || []).find(c => c.is_primary === 1) || {});
        setSelectedCarrierDriver(props.selectedOrder?.driver || {});

        setList([
            {
                title: 'pickup',
                items: ((props.selectedOrder?.pickups || []).filter(item => (props.selectedOrder?.routing || []).find(x => x.pickup_id === item.id && x.type === 'pickup') === undefined)).map(item => {
                    let pickup = {
                        id: 0,
                        order_id: props.selectedOrder?.id || 0,
                        pickup_id: item.id,
                        delivery_id: null,
                        type: 'pickup',
                        customer: item.customer
                    }

                    return pickup;
                })
            },
            {
                title: 'delivery',
                items: ((props.selectedOrder?.deliveries || []).filter(item => (props.selectedOrder?.routing || []).find(x => x.delivery_id === item.id && x.type === 'delivery') === undefined)).map(item => {
                    let delivery = {
                        id: 0,
                        order_id: props.selectedOrder?.id || 0,
                        pickup_id: null,
                        delivery_id: item.id,
                        type: 'delivery',
                        customer: item.customer
                    }

                    return delivery;
                })
            },
            {
                title: 'route',
                items: (props.selectedOrder?.routing || []).map((r, i) => {
                    let route = {
                        id: 0,
                        order_id: props.selectedOrder?.id || 0,
                        pickup_id: null,
                        delivery_id: null,
                        type: '',
                        customer: {}
                    }

                    if (r.type === 'pickup') {
                        let pickup = (props.selectedOrder?.pickups || []).find(p => p.id === r.pickup_id);
                        route.pickup_id = pickup.id;
                        route.customer = pickup.customer;
                        route.type = pickup.type;
                    }

                    if (r.type === 'delivery') {
                        let delivery = (props.selectedOrder?.deliveries || []).find(p => p.id === r.delivery_id);
                        route.delivery_id = delivery.id;
                        route.customer = delivery.customer;
                        route.type = delivery.type;
                    }
                    return route;
                })
            }
        ]);
    }, []);

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

    useEffect(() => {
        if (trigger) {
            setMileageLoaderVisible(true);
            let routing = list[2].items.map((item, index) => {
                let route = {
                    id: 0,
                    pickup_id: item.type === 'pickup' ? item.pickup_id : null,
                    delivery_id: item.type === 'delivery' ? item.delivery_id : null,
                    type: item.type
                }
                return route;
            })

            let selected_order = { ...selectedOrder };
            selected_order.routing = routing;

            axios.post(props.serverUrl + '/saveOrderRouting', {
                order_id: selectedOrder?.id || 0,
                routing: routing
            }).then(res => {
                if (res.data.result === 'OK') {
                    selected_order = {
                        ...selectedOrder,
                        routing: res.data.order.routing
                    }

                    setSelectedOrder(selected_order);
                    
                    props.setSelectedOrder({
                        id: selectedOrder.id,
                        routing: res.data.order.routing,
                        component_id: props.componentId
                    })

                    if (res.data.order.routing.length >= 2) {
                        let params = {
                            mode: 'fastest;car;traffic:disabled',
                            routeAttributes: 'summary'
                        }

                        let waypointCount = 0;

                        res.data.order.routing.map((item, i) => {
                            if (item.type === 'pickup') {
                                selected_order.pickups.map((p, i) => {
                                    if (p.id === item.pickup_id) {
                                        if ((p.customer?.zip_data || '') !== '') {
                                            params['waypoint' + waypointCount] = 'geo!' + p.customer.zip_data.latitude.toString() + ',' + p.customer.zip_data.longitude.toString();
                                            waypointCount += 1;
                                        }
                                    }
                                    return false;
                                })
                            } else {
                                selected_order.deliveries.map((d, i) => {
                                    if (d.id === item.delivery_id) {
                                        if ((d.customer?.zip_data || '') !== '') {
                                            params['waypoint' + waypointCount] = 'geo!' + d.customer.zip_data.latitude.toString() + ',' + d.customer.zip_data.longitude.toString();
                                            waypointCount += 1;
                                        }
                                    }
                                    return false;
                                })
                            }

                            return true;
                        });

                        routingService.calculateRoute(params,
                            (result) => {
                                let miles = result.response.route[0].summary.distance || 0;

                                selected_order.miles = miles;

                                setSelectedOrder(selected_order);

                                props.setSelectedOrder({
                                    id: selectedOrder.id,
                                    miles: miles,
                                    component_id: props.componentId
                                })

                                setMileageLoaderVisible(false);
                                setTrigger(false);

                                axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                                    if (res.data.result === 'OK') {
                                        setSelectedOrder({
                                            ...selected_order,
                                            order_customer_ratings: res.data.order.order_customer_ratings,
                                            order_carrier_ratings: res.data.order.order_carrier_ratings
                                        })

                                        props.setSelectedOrder({
                                            id: selectedOrder.id,
                                            order_customer_ratings: res.data.order.order_customer_ratings,
                                            order_carrier_ratings: res.data.order.order_carrier_ratings,
                                            component_id: props.componentId
                                        })
                                    }
                                }).catch(e => {
                                    console.log('error on saving order miles', e);
                                    setMileageLoaderVisible(false);
                                    setTrigger(false);
                                });
                            },
                            (error) => {
                                console.log('error getting mileage', error);
                                selected_order.miles = 0;

                                setSelectedOrder(selected_order)

                                props.setSelectedOrder({
                                    id: selectedOrder.id,
                                    miles: 0,
                                    component_id: props.componentId
                                })

                                setMileageLoaderVisible(false);
                                setTrigger(false);

                                axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                                    if (res.data.result === 'OK') {
                                        setSelectedOrder({
                                            ...selected_order,
                                            order_customer_ratings: res.data.order.order_customer_ratings,
                                            order_carrier_ratings: res.data.order.order_carrier_ratings
                                        })

                                        props.setSelectedOrder({
                                            id: selectedOrder.id,
                                            order_customer_ratings: res.data.order.order_customer_ratings,
                                            order_carrier_ratings: res.data.order.order_carrier_ratings,
                                            component_id: props.componentId
                                        })
                                    }
                                }).catch(e => {
                                    console.log('error on saving order miles', e);
                                    setMileageLoaderVisible(false);
                                    setTrigger(false);
                                });
                            });
                    } else {
                        selected_order.miles = 0;
                        setSelectedOrder(selected_order)

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            miles: 0,
                            component_id: props.componentId
                        })

                        setMileageLoaderVisible(false);
                        setTrigger(false);

                        axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                            if (res.data.result === 'OK') {
                                setSelectedOrder({
                                    ...selected_order,
                                    order_customer_ratings: res.data.order.order_customer_ratings,
                                    order_carrier_ratings: res.data.order.order_carrier_ratings
                                })

                                props.setSelectedOrder({
                                    id: selectedOrder.id,
                                    order_customer_ratings: res.data.order.order_customer_ratings,
                                    order_carrier_ratings: res.data.order.order_carrier_ratings,
                                    component_id: props.componentId
                                })
                            }
                        }).catch(e => {
                            console.log('error on saving order miles', e);
                            setMileageLoaderVisible(false);
                            setTrigger(false);
                        });
                    }
                }
            }).catch(e => {
                console.log('error on saving order routing', e);

                selected_order.miles = 0;
                setSelectedOrder(selected_order)

                props.setSelectedOrder({
                    id: selectedOrder.id,
                    miles: 0,
                    component_id: props.componentId
                })

                setMileageLoaderVisible(false);
                setTrigger(false);

                axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                    if (res.data.result === 'OK') {
                        setSelectedOrder({
                            ...selected_order,
                            order_customer_ratings: res.data.order.order_customer_ratings,
                            order_carrier_ratings: res.data.order.order_carrier_ratings
                        })

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            order_customer_ratings: res.data.order.order_customer_ratings,
                            order_carrier_ratings: res.data.order.order_carrier_ratings,
                            component_id: props.componentId
                        })
                    }
                }).catch(e => {
                    console.log('error on saving order miles', e);
                    setMileageLoaderVisible(false);
                    setTrigger(false);
                });
            });
        }
    }, [trigger])

    const handleDragEnd = (e) => {
        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        setDragging(false);

        setTrigger(true);
    }   

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const getCarrierInfoByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {

                if ((selectedOrder?.id || 0) === 0) {
                    e.preventDefault();
                    window.alert('You must create or load an order first!');
                    setSelectedCarrier({});
                    setSelectedCarrierContact({});
                    setSelectedCarrierDriver({});
                    return;
                }

                axios.post(props.serverUrl + '/carriers', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.carriers.length > 0) {

                            setSelectedCarrier(res.data.carriers[0]);

                            res.data.carriers[0].contacts.map(c => {
                                if (c.is_primary === 1) {
                                    setSelectedCarrierContact(c);
                                }
                                return true;
                            });

                            setSelectedCarrierInsurance({});

                            let selected_order = { ...selectedOrder } || { order_number: 0 };

                            selected_order.bill_to_customer_id = (selectedBillToCustomer?.id || 0);
                            selected_order.shipper_customer_id = (selectedShipperCustomer?.id || 0);
                            selected_order.consignee_customer_id = (selectedConsigneeCustomer?.id || 0);
                            selected_order.carrier_id = res.data.carriers[0].id;

                            if (res.data.carriers[0].drivers.length > 0) {
                                setSelectedCarrierDriver(res.data.carriers[0].drivers[0]);
                                selected_order.carrier_driver_id = res.data.carriers[0].drivers[0].id;
                            }

                            if ((selected_order.ae_number || '') === '') {
                                selected_order.ae_number = getRandomInt(1, 100);
                            }

                            if (!isSavingOrder) {
                                setIsSavingOrder(true);
                                axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                                    if (res.data.result === 'OK') {
                                        await setSelectedOrder(res.data.order);
                                    }

                                    setIsSavingOrder(false);
                                }).catch(e => {
                                    console.log('error saving order', e);
                                });
                            }

                        } else {
                            setSelectedCarrier({});
                            setSelectedCarrierDriver({});
                            setSelectedCarrierInsurance({});
                            setSelectedCarrierContact({});
                        }
                    } else {
                        setSelectedCarrier({});
                        setSelectedCarrierDriver({});
                        setSelectedCarrierInsurance({});
                        setSelectedCarrierContact({});
                    }
                }).catch(e => {
                    console.log('error getting carriers', e);
                });
            } else {
                setSelectedCarrier({});
                setSelectedCarrierDriver({});
                setSelectedCarrierInsurance({});
                setSelectedCarrierContact({});
            }
        }
    }

    const validateCarrierInfoForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            window.clearTimeout(delayTimer);

            if ((selectedCarrier.id || 0) === 0) {
                return;
            }

            window.setTimeout(() => {
                let newSelectedCarrierInfoCarrier = { ...selectedCarrier };

                if (newSelectedCarrierInfoCarrier.id === undefined || newSelectedCarrierInfoCarrier.id === -1) {
                    newSelectedCarrierInfoCarrier.id = 0;
                }

                if (
                    (newSelectedCarrierInfoCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                    (newSelectedCarrierInfoCarrier.city || '').trim().replace(/\s/g, "") !== "" &&
                    (newSelectedCarrierInfoCarrier.state || '').trim().replace(/\s/g, "") !== "" &&
                    (newSelectedCarrierInfoCarrier.address1 || '').trim() !== "" &&
                    (newSelectedCarrierInfoCarrier.zip || '').trim() !== ""
                ) {
                    let parseCity = newSelectedCarrierInfoCarrier.city.trim().replace(/\s/g, "").substring(0, 3);

                    if (parseCity.toLowerCase() === "ft.") {
                        parseCity = "FO";
                    }
                    if (parseCity.toLowerCase() === "mt.") {
                        parseCity = "MO";
                    }
                    if (parseCity.toLowerCase() === "st.") {
                        parseCity = "SA";
                    }

                    let newCode = (newSelectedCarrierInfoCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (newSelectedCarrierInfoCarrier.state || '').trim().replace(/\s/g, "").substring(0, 2);

                    newSelectedCarrierInfoCarrier.code = newCode.toUpperCase();

                    if (!isSavingCarrierInfo) {
                        setIsSavingCarrierInfo(true);

                        axios.post(props.serverUrl + '/saveCarrier', newSelectedCarrierInfoCarrier).then(async res => {
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
                        }).catch(e => {
                            console.log('error saving carrier', e);
                        });
                    }
                }
            }, 300);
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

    const validateCarrierContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
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

            if (!isSavingCarrierContact) {
                setIsSavingCarrierContact(true);

                axios.post(props.serverUrl + '/saveCarrierContact', contact).then(async res => {
                    if (res.data.result === 'OK') {
                        await setSelectedCarrier({ ...selectedCarrier, contacts: res.data.contacts });
                        await setSelectedCarrierContact(res.data.contact);
                    }

                    setIsSavingCarrierContact(false);
                }).catch(e => {
                    console.log('error saving carrier contact', e);
                });
            }
        }
    }

    const validateCarrierDriverForSaving = async (e) => {
        let key = e.keyCode || e.which;
        let selectedIndex = -1;
        let items = popupItems.map((a, b) => {
            if (a.selected) selectedIndex = b;
            return a;
        });

        if (key === 37 || key === 38) {
            e.preventDefault();
            if (selectedIndex === -1) {
                // items[0].selected = true;
            } else {
                items = items.map((a, b) => {
                    if (selectedIndex === 0) {
                        if (b === items.length - 1) {
                            a.selected = true;
                        } else {
                            a.selected = false;
                        }
                    } else {
                        if (b === selectedIndex - 1) {
                            a.selected = true;
                        } else {
                            a.selected = false;
                        }
                    }
                    return a;
                });

                await setPopupItems(items);

                popupItemsRef.current.map((r, i) => {
                    if (r && r.classList.contains('selected')) {
                        r.scrollIntoView()
                    }
                    return true;
                });
            }
        }

        if (key === 39 || key === 40) {
            e.preventDefault();
            if (selectedIndex === -1) {
                // items[0].selected = true;
            } else {
                items = items.map((a, b) => {
                    if (selectedIndex === items.length - 1) {
                        if (b === 0) {
                            a.selected = true;
                        } else {
                            a.selected = false;
                        }
                    } else {
                        if (b === selectedIndex + 1) {
                            a.selected = true;
                        } else {
                            a.selected = false;
                        }
                    }
                    return a;
                });

                await setPopupItems(items);

                popupItemsRef.current.map((r, i) => {
                    if (r && r.classList.contains('selected')) {
                        r.scrollIntoView()
                    }
                    return true;
                });
            }
        }

        if (key === 13) {
            await popupItems.map(async (item, index) => {
                if (item.selected) {
                    await setSelectedCarrierDriver(item);
                }

                return true;
            });

            setPopupItems([]);
        }

        if (key === 9) {
            if (popupItems.length === 0) {
                if ((selectedCarrierDriver.id || 0) === 0) {
                    await setSelectedCarrierDriver({});
                } else {
                    // validateDriverForSaving(e);
                }
            } else {
                popupItems.map(async (item, index) => {
                    if (item.selected) {
                        await setSelectedCarrierDriver(item);
                    }

                    return true;
                });

                // validateDriverForSaving(e);
                await setPopupItems([]);
            }
        }

        if (key === 9) {
            let driver = { ...selectedCarrierDriver, id: (selectedCarrierDriver?.id || 0), carrier_id: selectedCarrier?.id };

            if (popupItems.length === 0) {
                if ((selectedCarrierDriver.id || 0) === 0) {
                    await setSelectedCarrierDriver({});
                } else {
                    if ((selectedCarrier?.id || 0) > 0) {
                        if ((driver.first_name || '').trim() !== '') {
                            if (!isSavingCarrierDriver) {
                                setIsSavingCarrierDriver(true);

                                axios.post(props.serverUrl + '/saveCarrierDriver', driver).then(async res => {
                                    if (res.data.result === 'OK') {
                                        await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                        await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                                    }

                                    await setIsSavingCarrierDriver(false);
                                    await setPopupItems([]);
                                }).catch(e => {
                                    console.log('error saving carrier driver', e);
                                });
                            }
                        }
                    }
                }
            } else {
                popupItems.map(async (item, index) => {
                    if (item.selected) {
                        driver = item;
                        await setSelectedCarrierDriver(item);
                    }

                    return true;
                });

                if ((selectedCarrier?.id || 0) > 0) {
                    if ((driver.first_name || '').trim() !== '') {
                        if (!isSavingCarrierDriver) {
                            setIsSavingCarrierDriver(true);

                            axios.post(props.serverUrl + '/saveCarrierDriver', driver).then(async res => {
                                if (res.data.result === 'OK') {
                                    await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                    await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                                }

                                await setIsSavingCarrierDriver(false);
                            }).catch(e => {
                                console.log('error saving carrier driver', e);
                            });
                        }
                    }
                }
                await setPopupItems([]);
            }
        }
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    /**
     * Moves an item from one list to another list.
     */
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === 0) {
            if (dInd !== 2) {
                return;
            } else {
                const result = move(list[sInd].items, list[dInd].items, source, destination);
                let curList = JSON.parse(JSON.stringify(list));
                curList[sInd].items = result[sInd];
                curList[dInd].items = result[dInd];

                setList(curList);
            }
        }

        if (sInd === 1) {
            if (dInd !== 2) {
                return;
            } else {
                const result = move(list[sInd].items, list[dInd].items, source, destination);
                let curList = JSON.parse(JSON.stringify(list));
                curList[sInd].items = result[sInd];
                curList[dInd].items = result[dInd];

                setList(curList);
            }
        }

        if (sInd === 2) {
            let curList = JSON.parse(JSON.stringify(list));

            if (dInd === 2) {
                const items = reorder(list[2].items, source.index, destination.index);
                curList[2].items = items;
                setList(curList);
            } else {
                if (curList[sInd].items[source.index].type === 'pickup') {
                    if (dInd === 0) {
                        const result = move(list[sInd].items, list[dInd].items, source, destination);
                        curList[sInd].items = result[sInd];
                        curList[dInd].items = result[dInd];

                        setList(curList);
                    } else {
                        return;
                    }
                } else {
                    if (dInd === 1) {
                        const result = move(list[sInd].items, list[dInd].items, source, destination);
                        curList[sInd].items = result[sInd];
                        curList[dInd].items = result[dInd];

                        setList(curList);
                    } else {
                        return;
                    }
                }
            }
        }

        setTrigger(true);
    }

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "rgba(43, 193, 255, 0.1)" : "transparent",
        ...draggableStyle
    });
    const getListStyle = isDraggingOver => ({

        background: !isDraggingOver ? 'transparent' : 'rgba(43, 193, 255, 0.1)'
    });

    return (
        <div className="panel-content routing">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gridGap: '1rem',
                width: '50%',
                marginTop: 15,
                marginBottom: 10
            }}>
                <div className="input-box-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>A/E Number</div>
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" disabled={true}
                        onChange={(e) => { }}
                        value={selectedOrder?.ae_number || ''} />
                </div>

                <div className="input-box-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Order Number</div>
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" disabled={true}
                        onChange={(e) => { }}
                        value={selectedOrder?.order_number || ''} />
                </div>

                <div className="input-box-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Trip Number</div>
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" disabled={true}
                        onChange={(e) => { }}
                        value={selectedOrder?.trip_number || ''} />
                </div>

                <div className="input-box-container" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Miles</div>
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" readOnly={true} onChange={() => { }} value={mileageLoaderVisible ? '' : ((selectedOrder?.miles || 0) / 1609.34).toFixed(0)} />
                    <div className="loading-container" style={{
                        width: '100%',
                        height: '100%',
                        left: 'unset',
                        padding: '0 10px',
                        justifyContent: 'flex-end',
                        backgroundColor: 'transparent'
                    }}>
                        <Loader type="ThreeDots" color="#333738" height={20} width={20} visible={mileageLoaderVisible} />
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{
                    flexGrow: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gridGap: '0.5rem',
                    paddingBottom: 20
                }}>

                    <Droppable droppableId="0">
                        {(provided, snapshot) => {
                            return (
                                <div className="form-bordered-box" style={getListStyle(snapshot.isDraggingOver)}>
                                    <div className='form-header'>
                                        <div className='top-border top-border-left'></div>
                                        <div className='form-title'>Pick Ups</div>
                                        <div className='top-border top-border-middle'></div>
                                        <div className='top-border top-border-right'></div>
                                    </div>

                                    <div className="routing-pickup-container" {...provided.droppableProps} ref={provided.innerRef} style={{ flexGrow: 1 }}>
                                        {list.find(grp => grp.title === 'pickup') !== undefined &&
                                            list.find(grp => grp.title === 'pickup').items.map((item, index) => (
                                                <DraggableDnd key={`${item.customer.id}-${index}`} draggableId={`${index}-${item.type}-${item.customer.id}`} index={index}>
                                                    {(provided, snapshot) => {
                                                        if (snapshot.isDragging) {
                                                            provided.draggableProps.style.left = provided.draggableProps.style.offsetLeft;
                                                            provided.draggableProps.style.top = provided.draggableProps.style.offsetTop;
                                                        }

                                                        return (
                                                            <div className="routing-pickup-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{
                                                                ...getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )
                                                            }}

                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                    <span>{item.customer?.name || ''}</span>
                                                                    <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                                </div>

                                                                {
                                                                    snapshot.isDragging &&
                                                                    <div style={{
                                                                        textTransform: 'capitalize',
                                                                        color: 'rgba(0,0,0,0.5)',
                                                                        fontSize: '0.7rem',
                                                                        marginLeft: '0.5rem'
                                                                    }}>{item.type}</div>
                                                                }
                                                            </div>
                                                        )
                                                    }}
                                                </DraggableDnd>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )
                        }}
                    </Droppable>

                    <div className='form-bordered-box' style={{
                        flexGrow: 1, flexBasis: '100%'
                    }}>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Carrier</div>
                            <div className='top-border top-border-middle'></div>
                            <div className='form-buttons'>
                                <div className='mochi-button' onClick={() => {
                                    let panel = {
                                        panelName: `${props.panelName}-carrier`,
                                        component: <Carriers
                                            pageName={'Carrier'}
                                            title={'Carrier'}
                                            panelName={'carrier'}
                                            tabTimes={3000 + props.tabTimes}
                                            screenFocused={props.carrierScreenFocused}
                                            componentId={moment().format('x')}
                                            isOnPanel={true}
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
                                    onKeyDown={getCarrierInfoByCode}
                                    onInput={(e) => { setSelectedCarrier({ ...selectedCarrier, code: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrier({ ...selectedCarrier, code: e.target.value }) }}
                                    value={(selectedCarrier?.code || '') + ((selectedCarrier?.code_number || 0) === 0 ? '' : selectedCarrier.code_number)}

                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={51 + props.tabTimes} type="text" placeholder="Name"
                                    readOnly={true}
                                    onKeyDown={validateCarrierInfoForSaving}
                                    onInput={(e) => { setSelectedCarrier({ ...selectedCarrier, name: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrier({ ...selectedCarrier, name: e.target.value }) }}
                                    value={selectedCarrier?.name || ''}
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
                                    // onInput={(e) => {
                                    //     setSelectedOrder({ ...selectedOrder, carrier_load: e.target.value });
                                    // }}
                                    // onChange={(e) => {
                                    //     setSelectedOrder({ ...selectedOrder, carrier_load: e.target.value });
                                    // }}
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
                                    // onKeyDown={validateCarrierContactForSaving}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_name: e.target.value })
                                        }
                                    }}
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_name: e.target.value })
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
                            <div className="input-box-container grow">
                                <MaskedInput tabIndex={54 + props.tabTimes}
                                    readOnly={true}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    // onKeyDown={validateCarrierContactForSaving}
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_phone: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_phone: e.target.value })
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
                                    onKeyDown={validateCarrierContactForSaving}
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
                            <div className="select-box-container" style={{ width: '9rem' }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        readOnly={true}
                                        tabIndex={56 + props.tabTimes}
                                        placeholder="Equipment"
                                        ref={refEquipment}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (equipmentItems.length > 0) {
                                                        let selectedIndex = equipmentItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEquipmentItems(equipmentItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEquipmentItems(equipmentItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (equipmentItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEquipmentPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setEquipmentItems(res.data.equipments.map((item, index) => {
                                                                    item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierDriver.equipment.id
                                                                    return item;
                                                                }))

                                                                refEquipmentPopupItems.current.map((r, i) => {
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
                                                            console.log('error getting equipments', e);
                                                        })
                                                    }
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (equipmentItems.length > 0) {
                                                        let selectedIndex = equipmentItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEquipmentItems(equipmentItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEquipmentItems(equipmentItems.map((item, index) => {
                                                                if (selectedIndex === (equipmentItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEquipmentPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setEquipmentItems(res.data.equipments.map((item, index) => {
                                                                    item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCarrierDriver.equipment.id
                                                                    return item;
                                                                }))

                                                                refEquipmentPopupItems.current.map((r, i) => {
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
                                                            console.log('error getting equipments', e);
                                                        })
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setEquipmentItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (equipmentItems.length > 0 && equipmentItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedCarrierDriver({
                                                            ...selectedCarrierDriver,
                                                            equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                                            equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id
                                                        });

                                                        axios.post(props.serverUrl + '/saveCarrierDriver', {
                                                            ...selectedCarrierDriver,
                                                            equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                                            equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id,
                                                            id: (selectedCarrierDriver?.id || 0),
                                                            carrier_id: (selectedCarrier?.id || 0)
                                                        }).then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                // await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                                                // await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving carrier driver', e);
                                                        });

                                                        setEquipmentItems([]);
                                                        refEquipment.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (equipmentItems.length > 0) {
                                                        e.preventDefault();
                                                        await setSelectedCarrierDriver({
                                                            ...selectedCarrierDriver,
                                                            equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                                            equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id
                                                        });

                                                        axios.post(props.serverUrl + '/saveCarrierDriver', {
                                                            ...selectedCarrierDriver,
                                                            equipment: equipmentItems[equipmentItems.findIndex(item => item.selected)],
                                                            equipment_id: equipmentItems[equipmentItems.findIndex(item => item.selected)].id,
                                                            id: (selectedCarrierDriver?.id || 0),
                                                            carrier_id: (selectedCarrier?.id || 0)
                                                        }).then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                // await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                                                // await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving carrier driver', e);
                                                        });

                                                        setEquipmentItems([]);
                                                        refEquipment.current.focus();
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onBlur={async () => {
                                            if ((selectedCarrierDriver?.equipment?.id || 0) === 0) {
                                                await setSelectedCarrierDriver({ ...selectedCarrierDriver, equipment: {} });
                                            }
                                        }}
                                        onInput={async (e) => {
                                            let equipment = selectedCarrierDriver?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            await setSelectedCarrierDriver({ ...selectedCarrierDriver, equipment: equipment, equipment_id: equipment.id });

                                            if (e.target.value.trim() === '') {
                                                setEquipmentItems([]);
                                            } else {
                                                axios.post(props.serverUrl + '/getEquipments', {
                                                    name: e.target.value.trim()
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setEquipmentItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierDriver.equipment.id
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting equipments', e);
                                                })
                                            }
                                        }}
                                        onChange={async (e) => {
                                            let equipment = selectedCarrierDriver?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            await setSelectedCarrierDriver({ ...selectedCarrierDriver, equipment: equipment, equipment_id: equipment.id });
                                        }}
                                        value={selectedCarrierDriver?.equipment?.name || ''}
                                    />
                                    {/* <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if (equipmentItems.length > 0) {
                                            setEquipmentItems([]);
                                        } else {
                                            if ((selectedCarrierDriver?.equipment?.id || 0) === 0 && (selectedCarrierDriver?.equipment?.name || '') !== '') {
                                                axios.post(props.serverUrl + '/getEquipments', {
                                                    name: selectedCarrierDriver?.equipment.name
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setEquipmentItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierDriver.equipment.id
                                                            return item;
                                                        }))

                                                        refEquipmentPopupItems.current.map((r, i) => {
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
                                                    console.log('error getting equipments', e);
                                                })
                                            } else {
                                                axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setEquipmentItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedCarrierDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedCarrierDriver.equipment.id
                                                            return item;
                                                        }))

                                                        refEquipmentPopupItems.current.map((r, i) => {
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
                                                    console.log('error getting equipments', e);
                                                })
                                            }
                                        }

                                        refEquipment.current.focus();
                                    }} /> */}
                                </div>

                                {/* <Transition
                                    from={{ opacity: 0, top: 'calc(100% + 10px)' }}
                                    enter={{ opacity: 1, top: 'calc(100% + 15px)' }}
                                    leave={{ opacity: 0, top: 'calc(100% + 10px)' }}
                                    items={equipmentItems.length > 0}
                                    config={{ duration: 100 }}
                                >
                                    {show => show && (styles => (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-equipment"
                                            style={{
                                                ...styles,
                                                left: '-130%',
                                                display: 'block'
                                            }}
                                            ref={refEquipmentDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below left" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            equipmentItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedCarrierDriver?.equipment?.id || 0) === 0 && (selectedCarrierDriver?.equipment?.name || '') !== ''
                                                                    ? selectedCarrierDriver?.equipment?.name : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={async () => {
                                                                            await setSelectedCarrierDriver({
                                                                                ...selectedCarrierDriver,
                                                                                equipment: item,
                                                                                equipment_id: item.id
                                                                            });

                                                                            axios.post(props.serverUrl + '/saveCarrierDriver', {
                                                                                ...selectedCarrierDriver,
                                                                                equipment: item,
                                                                                equipment_id: item.id,
                                                                                id: (selectedCarrierDriver?.id || 0),
                                                                                carrier_id: (selectedCarrier?.id || 0)
                                                                            }).then(async res => {
                                                                                if (res.data.result === 'OK') {
                                                                                    // await setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                                                                    // await setSelectedCarrierDriver({ ...selectedCarrierDriver, id: res.data.driver.id });
                                                                                }
                                                                            }).catch(e => {
                                                                                console.log('error saving carrier driver', e);
                                                                            });
                                                                            setEquipmentItems([]);
                                                                            refEquipment.current.focus();
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
                                    ))}
                                </Transition> */}
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        readOnly={true}
                                        tabIndex={57 + props.tabTimes}
                                        placeholder="Driver Name"
                                        ref={refDriverName}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (driverItems.length > 0) {
                                                        let selectedIndex = driverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverItems(driverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverItems(driverItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (driverItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverPopupItems.current.map((r, i) => {
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
                                                        if ((selectedCarrier?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                                                carrier_id: selectedCarrier.id
                                                            }).then(async res => {
                                                                if (res.data.result === 'OK') {
                                                                    if (res.data.count > 1) {
                                                                        await setDriverItems([
                                                                            ...[{
                                                                                first_name: 'Clear',
                                                                                id: null
                                                                            }],
                                                                            ...res.data.drivers.map((item, index) => {
                                                                                item.selected = (selectedCarrierDriver?.id || 0) === 0
                                                                                    ? index === 0
                                                                                    : item.id === selectedCarrierDriver.id
                                                                                return item;
                                                                            })
                                                                        ])

                                                                        refDriverPopupItems.current.map((r, i) => {
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
                                                                }
                                                            }).catch(async e => {
                                                                console.log('error getting carrier drivers', e);
                                                            })
                                                        }
                                                    }
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (driverItems.length > 0) {
                                                        let selectedIndex = driverItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverItems(driverItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverItems(driverItems.map((item, index) => {
                                                                if (selectedIndex === (driverItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverPopupItems.current.map((r, i) => {
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
                                                        if ((selectedCarrier?.id || 0) > 0) {
                                                            axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                                                carrier_id: selectedCarrier.id
                                                            }).then(async res => {
                                                                if (res.data.result === 'OK') {
                                                                    if (res.data.count > 1) {
                                                                        await setDriverItems([
                                                                            ...[{
                                                                                first_name: 'Clear',
                                                                                id: null
                                                                            }],
                                                                            ...res.data.drivers.map((item, index) => {
                                                                                item.selected = (selectedCarrierDriver?.id || 0) === 0
                                                                                    ? index === 0
                                                                                    : item.id === selectedCarrierDriver.id
                                                                                return item;
                                                                            })
                                                                        ])

                                                                        refDriverPopupItems.current.map((r, i) => {
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
                                                                }
                                                            }).catch(async e => {
                                                                console.log('error getting carrier drivers', e);
                                                            })
                                                        }
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setDriverItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (driverItems.length > 0 && driverItems.findIndex(item => item.selected) > -1) {

                                                        await setSelectedCarrierDriver(driverItems[driverItems.findIndex(item => item.selected)].id === null ? {} : driverItems[driverItems.findIndex(item => item.selected)]);

                                                        await setSelectedOrder({
                                                            ...selectedOrder,
                                                            carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id
                                                        })


                                                        axios.post(props.serverUrl + '/saveOrder', { ...selectedOrder, carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id }).then(res => {
                                                            if (res.data.result === 'OK') {

                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving order', e);
                                                        });
                                                        setDriverItems([]);
                                                        refDriverName.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (driverItems.length > 0) {
                                                        e.preventDefault();
                                                        await setSelectedCarrierDriver(driverItems[driverItems.findIndex(item => item.selected)].id === null ? {} : driverItems[driverItems.findIndex(item => item.selected)]);

                                                        await setSelectedOrder({
                                                            ...selectedOrder,
                                                            carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id
                                                        })

                                                        axios.post(props.serverUrl + '/saveOrder', { ...selectedOrder, carrier_driver_id: driverItems[driverItems.findIndex(item => item.selected)].id }).then(res => {
                                                            if (res.data.result === 'OK') {

                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving order', e);
                                                        });
                                                        setDriverItems([]);
                                                        refDriverName.current.focus();
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onBlur={async (e) => {
                                            if ((selectedCarrierDriver?.id || 0) === 0) {
                                                await setSelectedCarrierDriver({});
                                                await setSelectedOrder({
                                                    ...selectedOrder,
                                                    carrier_driver_id: null
                                                })

                                                axios.post(props.serverUrl + '/saveOrder', { ...selectedOrder, carrier_driver_id: null }).then(res => {
                                                    if (res.data.result === 'OK') {

                                                    }
                                                }).catch(e => {
                                                    console.log('error saving order', e);
                                                });
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

                                                setSelectedCarrierDriver({ ...driver, first_name: first_name, last_name: last_name });

                                                // if ((selectedCarrier?.id || 0) > 0) {
                                                //     axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                                //         carrier_id: selectedCarrier.id
                                                //     }).then(async res => {
                                                //         if (res.data.result === 'OK') {
                                                //             if (res.data.count > 1) {
                                                //                 await setDriverItems(res.data.drivers.map((item, index) => {
                                                //                     item.selected = (selectedCarrierDriver?.id || 0) === 0
                                                //                         ? index === 0
                                                //                         : item.id === selectedCarrierDriver.id
                                                //                     return item;
                                                //                 }))

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
                                                //             }
                                                //         }
                                                //     }).catch(async e => {
                                                //         console.log('error getting carrier drivers', e);
                                                //     })
                                                // }
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

                                                setSelectedCarrierDriver({ ...driver, first_name: first_name, last_name: last_name });

                                            }
                                        }}
                                        value={(selectedCarrierDriver?.first_name || '') + ((selectedCarrierDriver?.last_name || '').trim() === '' ? '' : ' ' + selectedCarrierDriver?.last_name)}
                                    />
                                    {/* {
                                        (selectedCarrier?.drivers || []).length > 1 &&

                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                            if (driverItems.length > 0) {
                                                setDriverItems([]);
                                            } else {
                                                window.setTimeout(async () => {
                                                    if ((selectedCarrier?.id || 0) > 0) {
                                                        axios.post(props.serverUrl + '/getDriversByCarrierId', {
                                                            carrier_id: selectedCarrier.id
                                                        }).then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                if (res.data.count > 1) {

                                                                    await setDriverItems([
                                                                        ...[{
                                                                            first_name: 'Clear',
                                                                            id: null
                                                                        }],
                                                                        ...res.data.drivers.map((item, index) => {
                                                                            item.selected = (selectedCarrierDriver?.id || 0) === 0
                                                                                ? index === 0
                                                                                : item.id === selectedCarrierDriver.id
                                                                            return item;
                                                                        })
                                                                    ])

                                                                    refDriverPopupItems.current.map((r, i) => {
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
                                                            }
                                                        }).catch(async e => {
                                                            console.log('error getting carrier drivers', e);
                                                        })
                                                    }

                                                    refDriverName.current.focus();
                                                }, 0)
                                            }
                                        }} />
                                    } */}
                                </div>

                                {/* <Transition
                                    from={{ opacity: 0, top: 'calc(100% + 10px)' }}
                                    enter={{ opacity: 1, top: 'calc(100% + 15px)' }}
                                    leave={{ opacity: 0, top: 'calc(100% + 10px)' }}
                                    items={driverItems.length > 0}
                                    config={{ duration: 100 }}
                                >
                                    {show => show && (styles => (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-driver-name"
                                            style={{
                                                ...styles,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refDriverDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
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
                                                                            await setSelectedCarrierDriver(item.id === null ? {} : item);

                                                                            await setSelectedOrder({
                                                                                ...selectedOrder,
                                                                                carrier_driver_id: item.id
                                                                            })

                                                                            axios.post(props.serverUrl + '/saveOrder', { ...selectedOrder, carrier_driver_id: item.id }).then(res => {
                                                                                if (res.data.result === 'OK') {

                                                                                }
                                                                            }).catch(e => {
                                                                                console.log('error saving order', e);
                                                                            });
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
                                    ))}
                                </Transition> */}
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{ width: '9rem' }}>
                                <MaskedInput tabIndex={58 + props.tabTimes}
                                    readOnly={true}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Driver Phone"
                                    onKeyDown={validateCarrierDriverForSaving}
                                    onInput={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, phone: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, phone: e.target.value }) }}
                                    value={selectedCarrierDriver.phone || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{
                                maxWidth: '5.8rem',
                                minWidth: '5.8rem'
                            }}>
                                <input tabIndex={59 + props.tabTimes} type="text" placeholder="Unit Number"
                                    readOnly={true}
                                    onKeyDown={validateCarrierDriverForSaving}
                                    onInput={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, truck: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, truck: e.target.value }) }}
                                    value={selectedCarrierDriver.truck || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{
                                maxWidth: '5.8rem',
                                minWidth: '5.8rem'
                            }}>
                                <input tabIndex={60 + props.tabTimes} type="text" placeholder="Trailer Number"
                                    readOnly={true}
                                    onKeyDown={validateCarrierDriverForSaving}
                                    onInput={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, trailer: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrierDriver({ ...selectedCarrierDriver, trailer: e.target.value }) }}
                                    value={selectedCarrierDriver.trailer || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexGrow: 1, alignItems: 'flex-start', marginTop: 10 }}>
                            <div className='mochi-button' onClick={() => {
                                let panel = {
                                    panelName: `${props.panelName}-rate-conf`,
                                    component: <RateConf
                                        title='Rate Conf'
                                        tabTimes={41000 + props.tabTimes}
                                        panelName={`${props.panelName}-rate-conf`}
                                        componentId={moment().format('x')}
                                        selectedOrder={selectedOrder}
                                    />
                                }

                                props.openPanel(panel, props.origin);
                            }}>
                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                <div className='mochi-button-base'>Rate Confirmation</div>
                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                            </div>
                            <div className='mochi-button' onClick={() => {

                            }}>
                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                <div className='mochi-button-base'>E-mail Rate Confirmation</div>
                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                            </div>
                        </div>
                    </div>

                    <Droppable droppableId="1">
                        {(provided, snapshot) => (
                            <div className="form-bordered-box" style={getListStyle(snapshot.isDraggingOver)}>
                                <div className='form-header'>
                                    <div className='top-border top-border-left'></div>
                                    <div className='form-title'>Deliveries</div>
                                    <div className='top-border top-border-middle'></div>
                                    <div className='top-border top-border-right'></div>
                                </div>

                                <div className="routing-delivery-container" {...provided.droppableProps} ref={provided.innerRef} style={{ flexGrow: 1 }}>
                                    {list.find(grp => grp.title === 'delivery') !== undefined &&
                                        list.find(grp => grp.title === 'delivery').items.map((item, index) => (
                                            <DraggableDnd key={`${item.customer.id}-${index}`} draggableId={`${index}-${item.type}-${item.customer.id}`} index={index}>
                                                {(provided, snapshot) => {
                                                    if (snapshot.isDragging) {
                                                        provided.draggableProps.style.left = provided.draggableProps.style.offsetLeft;
                                                        provided.draggableProps.style.top = provided.draggableProps.style.offsetTop;
                                                    }

                                                    return (
                                                        <div className="routing-delivery-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{
                                                            ...getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )
                                                        }}

                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                <span>{item.customer?.name || ''}</span>
                                                                <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                            </div>

                                                            {
                                                                snapshot.isDragging &&
                                                                <div style={{
                                                                    textTransform: 'capitalize',
                                                                    color: 'rgba(0,0,0,0.5)',
                                                                    fontSize: '0.7rem',
                                                                    marginLeft: '0.5rem'
                                                                }}>{item.type}</div>
                                                            }
                                                        </div>
                                                    )
                                                }}
                                            </DraggableDnd>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="2">
                        {(provided, snapshot) => (
                            <div className="form-bordered-box" style={getListStyle(snapshot.isDraggingOver)}>
                                <div className='form-header'>
                                    <div className='top-border top-border-left'></div>
                                    <div className='form-title'>Route</div>
                                    <div className='top-border top-border-middle'></div>
                                    <div className='top-border top-border-right'></div>
                                </div>

                                <div className="routing-route-container" {...provided.droppableProps} ref={provided.innerRef} style={{ flexGrow: 1 }}>
                                    {list.find(grp => grp.title === 'route') !== undefined &&
                                        list.find(grp => grp.title === 'route').items.map((item, index) => (
                                            <DraggableDnd key={`${item.customer.id}-${index}`} draggableId={`r-${index}-${item.type}-${item.customer.id}`} index={index}>
                                                {(provided, snapshot) => {
                                                    if (snapshot.isDragging) {
                                                        provided.draggableProps.style.left = provided.draggableProps.style.offsetLeft;
                                                        provided.draggableProps.style.top = provided.draggableProps.style.offsetTop;
                                                    }

                                                    return (
                                                        <div className="routing-route-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{
                                                            ...getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )
                                                        }}

                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                <span>{item.customer?.name || ''}</span>
                                                                <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                            </div>

                                                            {
                                                                snapshot.isDragging &&
                                                                <div style={{
                                                                    textTransform: 'capitalize',
                                                                    color: 'rgba(0,0,0,0.5)',
                                                                    fontSize: '0.7rem',
                                                                    marginLeft: '0.5rem'
                                                                }}>{item.type}</div>
                                                            }
                                                        </div>
                                                    )
                                                }}
                                            </DraggableDnd>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
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
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedCarrierDriver: state.carrierReducers.selectedDriver,
        selectedCarrierInsurance: state.carrierReducers.selectedInsurance,
    }
}

export default connect(mapStateToProps, {
    setCompanyOpenedPanels,
    setAdminOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedOrder,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedCarrierDriver,
    setSelectedCarrierInsurance
})(Routing)