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

    setSelectedOrder,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedDriver as setSelectedCarrierDriver,
    setSelectedInsurance as setSelectedCarrierInsurance
} from './../../../../actions';

import {
    Customers,
    Carriers
} from './../../../company';

import {
    RateConf,
    RoutingMap
} from './../../panels';

const Routing = (props) => {
    const refRoutingContainer = useRef();
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
    const [isGettingMiles, setIsGettingMiles] = useState(false);
    const [isSavingMiles, setIsSavingMiles] = useState(false);

    const [driverItems, setDriverItems] = useState([]);

    var delayTimer;

    const [list, setList] = useState([]);

    const mapRef = useRef();
    const H = window.H;
    const platform = new H.service.Platform({
        apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
        // app_id: "X4qy0Sva14BQxJCbVqXL"
    });
    const routingService = platform.getRoutingService(null, 8);
    // const routingService = {};

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

        refRoutingContainer.current.focus({
            preventScroll: true
        })
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
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            if (trigger) {                
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

                let url = (props.owner || 'order') === 'template' ? '/saveTemplateRouting' : '/saveOrderRouting';

                axios.post(props.serverUrl + url, {
                    order_id: selectedOrder?.id || 0,
                    template_id: selectedOrder?.id || 0,
                    routing: routing
                }).then(res => {
                    if (res.data.result === 'OK') {
                        selected_order = {
                            ...selectedOrder,
                            routing: (props.owner || 'order') === 'template' ? res.data.routing : res.data.order.routing
                        }

                        setSelectedOrder(selected_order);

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            routing: (props.owner || 'order') === 'template' ? res.data.routing : res.data.order.routing,
                            component_id: props.componentId
                        })
                        setTrigger(false);
                        setTimeout(() => { setIsGettingMiles(true) }, 100);                        
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

                    // axios.post(props.serverUrl + '/saveOrder', selected_order).then(async res => {
                    //     if (res.data.result === 'OK') {
                    //         setSelectedOrder({
                    //             ...selected_order,
                    //             order_customer_ratings: res.data.order.order_customer_ratings,
                    //             order_carrier_ratings: res.data.order.order_carrier_ratings
                    //         })

                    //         props.setSelectedOrder({
                    //             id: selectedOrder.id,
                    //             order_customer_ratings: res.data.order.order_customer_ratings,
                    //             order_carrier_ratings: res.data.order.order_carrier_ratings,
                    //             component_id: props.componentId
                    //         })
                    //     }
                    // }).catch(e => {
                    //     console.log('error on saving order miles', e);
                    //     setMileageLoaderVisible(false);
                    //     setTrigger(false);
                    // });
                });
            }
        }
    }, [trigger])

    useEffect(() => {
        if (isGettingMiles) {
            let pickups = selectedOrder?.pickups || [];
            let deliveries = selectedOrder?.deliveries || [];
            let routing = selectedOrder?.routing || [];
            let currentWaypoints = selectedOrder?.waypoints || '';
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
                })

                let strWaypoints = JSON.stringify(origin) + JSON.stringify(waypoints) + JSON.stringify(destination);

                console.log(routing);
                console.log(currentWaypoints);
                console.log(strWaypoints);
                
                if (currentWaypoints !== strWaypoints) {
                    let routingParams = {
                        'routingMode': 'fast',
                        'transportMode': 'car',
                        'origin': origin,
                        'via': new H.service.Url.MultiValueQueryParameter(waypoints),
                        'destination': destination,
                        'return': 'summary'
                    }

                    console.log(routingParams);
                    
                    if (routingService) {
                        routingService.calculateRoute(routingParams, (result) => {
                            let miles = (result?.routes[0]?.sections || []).reduce((a, b) => {
                                return a + b.summary.length;
                            }, 0) || 0;

                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    miles: miles,
                                    waypoints: strWaypoints
                                }
                            })

                            props.setSelectedOrder({
                                id: selectedOrder.id,
                                miles: miles,
                                waypoints: strWaypoints,
                                component_id: props.componentId
                            })

                            if ((props.owner || 'order') === 'template'){
                                props.callback({
                                    routing: routing,
                                    miles: miles,
                                    waypoints: strWaypoints
                                })
                            }

                            setIsGettingMiles(false);
                            setTimeout(() => { setIsSavingMiles(true); }, 100);
                        }, (error) => {
                            console.log("error getting mileage", error);
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    miles: 0,
                                    waypoints: currentWaypoints
                                }
                            })

                            props.setSelectedOrder({
                                id: selectedOrder.id,
                                miles: 0,
                                waypoints: currentWaypoints,
                                component_id: props.componentId
                            })

                            if ((props.owner || 'order') === 'template'){
                                props.callback({
                                    routing: routing,
                                    miles: 0,
                                    waypoints: currentWaypoints
                                })
                            }

                            setIsGettingMiles(false);
                            setTimeout(() => { setIsSavingMiles(true); }, 100);
                        })
                    } else {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                miles: 0,
                                waypoints: currentWaypoints
                            }
                        })

                        props.setSelectedOrder({
                            id: selectedOrder.id,
                            miles: 0,
                            waypoints: currentWaypoints,
                            component_id: props.componentId
                        })

                        if ((props.owner || 'order') === 'template'){
                            props.callback({
                                routing: routing,
                                miles: 0,
                                waypoints: currentWaypoints
                            })
                        }

                        setIsGettingMiles(false);
                        setTimeout(() => { setIsSavingMiles(true); }, 100);
                    }
                } else {
                    setIsGettingMiles(false);
                }
            } else {
                setSelectedOrder(prev => {
                    return {
                        ...prev,
                        miles: 0,
                        waypoints: currentWaypoints
                    }
                })

                props.setSelectedOrder({
                    id: selectedOrder.id,
                    miles: 0,
                    waypoints: currentWaypoints,
                    component_id: props.componentId
                })

                if ((props.owner || 'order') === 'template'){
                    props.callback({
                        routing: routing,
                        miles: 0,
                        waypoints: currentWaypoints
                    })
                }

                setIsGettingMiles(false);
                setTimeout(() => { setIsSavingMiles(true); }, 100);
            }

        }
    }, [isGettingMiles]);

    useEffect(() => {
        if (isSavingMiles) {
            if ((selectedOrder?.id || 0) > 0) {
                let url = (props.owner || 'order') === 'template' ? '/saveTemplateMilesWaypoints' : '/saveOrderMilesWaypoints';

                axios.post(props.serverUrl + url, {
                    id: selectedOrder.id,
                    miles: selectedOrder?.miles,
                    waypoints: selectedOrder?.waypoints
                }).catch(e => {
                    console.log('error saving miles waypoints', e);
                }).finally(() => {
                    setIsSavingMiles(false);
                })
            } else {
                setIsSavingMiles(false);
            }
        }
    }, [isSavingMiles]);

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

    const insuranceStatusClasses = () => {
        let classes = "input-box-container insurance-status";
        let curDate = moment().startOf("day");
        let curDate2 = moment();
        let futureMonth = curDate2.add(1, "M");
        let statusClass = "";

        (selectedCarrier.insurances || []).map((insurance, index) => {
            let expDate = moment(insurance.expiration_date, "MM/DD/YYYY");

            if (expDate < curDate) {
                statusClass = "expired";
            } else if (expDate >= curDate && expDate <= futureMonth) {
                if (statusClass !== "expired") {
                    statusClass = "warning";
                }
            } else {
                if (statusClass !== "expired" && statusClass !== "warning") {
                    statusClass = "active";
                }
            }
        });

        return (classes + " " + statusClass).trim();
    }

    const reorder = (list, startIndex, endIndex) => {
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);

            return result;
        }
    };

    /**
     * Moves an item from one list to another list.
     */
    const move = (source, destination, droppableSource, droppableDestination) => {
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            const sourceClone = Array.from(source);
            const destClone = Array.from(destination);
            const [removed] = sourceClone.splice(droppableSource.index, 1);

            destClone.splice(droppableDestination.index, 0, removed);

            const result = {};
            result[droppableSource.droppableId] = sourceClone;
            result[droppableDestination.droppableId] = destClone;

            return result;
        }
    };

    const onDragEnd = (result) => {
        console.log(result)
        if ((selectedOrder?.is_cancelled || 0) === 0) {
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
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "rgba(43, 193, 255, 0.1)" : "transparent",
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({

        background: !isDraggingOver ? 'transparent' : 'rgba(43, 193, 255, 0.1)'
    });

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

    const addPickupsToRoute = (type = 'all') => {
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            let curList = JSON.parse(JSON.stringify(list));
            let pickups = curList.find(x => x.title === 'pickup')?.items || [];
            let route = curList.find(x => x.title === 'route')?.items || [];

            if (type === 'all') {
                pickups.map(item => {
                    route.push({ ...item, checked: false });
                    return true;
                })

                pickups = [];
            } else {
                pickups.map(item => {
                    if (item.checked) {
                        route.push({ ...item, checked: false });
                    }
                    return true;
                })

                pickups = pickups.filter(x => !x.checked);
            }

            curList[0].items = pickups;
            curList[2].items = route;

            setList(curList);
            setTrigger(true);
        }
    }

    const addDeliveriesToRoute = (type = 'all') => {
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            let curList = JSON.parse(JSON.stringify(list));
            let deliveries = curList.find(x => x.title === 'delivery')?.items || [];
            let route = curList.find(x => x.title === 'route')?.items || [];

            if (type === 'all') {
                deliveries.map(item => {
                    route.push({ ...item, checked: false });
                    return true;
                })

                deliveries = [];
            } else {
                deliveries.map(item => {
                    if (item.checked) {
                        route.push({ ...item, checked: false });
                    }
                    return true;
                })

                deliveries = deliveries.filter(x => !x.checked);
            }

            curList[1].items = deliveries;
            curList[2].items = route;

            setList(curList);
            setTrigger(true);
        }
    }

    const removeFromRoute = (type = 'all') => {
        if ((selectedOrder?.is_cancelled || 0) === 0) {
            let curList = JSON.parse(JSON.stringify(list));
            let pickups = curList.find(x => x.title === 'pickup')?.items || [];
            let deliveries = curList.find(x => x.title === 'delivery')?.items || [];
            let route = curList.find(x => x.title === 'route')?.items || [];

            switch (type) {
                case 'all':
                    route.map(item => {
                        if (item.type === 'pickup') {
                            pickups.push({ ...item, checked: false });
                        }

                        if (item.type === 'delivery') {
                            deliveries.push({ ...item, checked: false });
                        }

                        return true;
                    })

                    route = [];
                    break;
                case 'selected':
                    route.map(item => {
                        if (item.checked) {
                            if (item.type === 'pickup') {
                                pickups.push({ ...item, checked: false });
                            }

                            if (item.type === 'delivery') {
                                deliveries.push({ ...item, checked: false });
                            }
                        }

                        return true;
                    })

                    route = route.filter(x => !x.checked);
                    break;
                case 'pickups':
                    route.map(item => {
                        if (item.type === 'pickup') {
                            pickups.push({ ...item, checked: false });
                        }

                        return true;
                    })

                    route = route.filter(x => x.type !== 'pickup');
                    break;
                case 'deliveries':
                    route.map(item => {
                        if (item.type === 'delivery') {
                            deliveries.push({ ...item, checked: false });
                        }

                        return true;
                    })

                    route = route.filter(x => x.type !== 'delivery');
                    break;
                default:
                    break;
            }

            curList[0].items = pickups;
            curList[1].items = deliveries;
            curList[2].items = route;

            setList(curList);
            setTrigger(true);
        }
    }

    return (
        <div className="panel-content routing" tabIndex={0} ref={refRoutingContainer}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                gridGap: '1rem',
                width: '50%',
                marginTop: 15,
                marginBottom: 10
            }}>
                <div className="input-box-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>A/E Number</div>
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" disabled={true}
                        onChange={(e) => { }}
                        value={props.user.user_code.code} />
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
                    <input style={{ textAlign: 'right', fontWeight: 'bold' }} type="text" readOnly={true} onChange={() => { }} value={isGettingMiles ? '' : ((selectedOrder?.miles || 0) / 1609.34).toFixed(0)} />
                    <div className="loading-container" style={{
                        width: '100%',
                        height: '100%',
                        left: 'unset',
                        padding: '0 10px',
                        justifyContent: 'flex-end',
                        backgroundColor: 'transparent'
                    }}>
                        <Loader type="ThreeDots" color="#333738" height={20} width={20} visible={isGettingMiles} />
                    </div>
                </div>

                <div className='mochi-button' onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-routing-map`,
                        component: <RoutingMap
                            title='Routing Map'
                            tabTimes={484000 + props.tabTimes}
                            panelName={`${props.panelName}-routing-map`}
                            componentId={moment().format('x')}
                            origin={props.origin}


                            selectedOrder={selectedOrder}
                        />
                    }

                    openPanel(panel, props.origin);
                }}>
                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                    <div className='mochi-button-base'>Map</div>
                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
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
                                        <div className='form-buttons'>
                                            <div className={`mochi-button ${(list.find(grp => grp.title === 'pickup')?.items || []).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                                addPickupsToRoute('all');
                                            }}>
                                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                <div className='mochi-button-base'>Add All</div>
                                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                            </div>

                                            <div className={`mochi-button ${(list.find(grp => grp.title === 'pickup')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                                addPickupsToRoute('selected');
                                            }}>
                                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                <div className='mochi-button-base'>Add Selected</div>
                                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                            </div>

                                            <div className={`mochi-button ${(list.find(grp => grp.title === 'pickup')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                                let curList = list.map(x => {
                                                    if (x.title === 'pickup') {
                                                        x.items.map(i => {
                                                            i.checked = false;
                                                            return i;
                                                        })
                                                    }
                                                    return x;
                                                });

                                                setList(curList);
                                            }}>
                                                <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                                <div className='mochi-button-base'>Clear Selection</div>
                                                <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                            </div>
                                        </div>
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
                                                            <div
                                                                className="routing-pickup-item"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style
                                                                    )
                                                                }}

                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center' }} onDoubleClick={() => {
                                                                    let panel = {
                                                                        panelName: `${props.panelName}-customer`,
                                                                        component: (
                                                                            <Customers
                                                                                pageName={"Customer"}
                                                                                title={
                                                                                    (item?.type).toLowerCase() === 'pickup'
                                                                                        ? "Shipper Company"
                                                                                        : (item?.type).toLowerCase() === 'delivery'
                                                                                            ? "Consignee Company"
                                                                                            : "Customer"
                                                                                }
                                                                                panelName={`${props.panelName}-customer`}
                                                                                tabTimes={43000 + props.tabTimes}
                                                                                componentId={moment().format("x")}
                                                                                isOnPanel={true}
                                                                                isAdmin={props.isAdmin}
                                                                                origin={props.origin}


                                                                                customer_id={item?.customer?.id}
                                                                            />
                                                                        ),
                                                                    };

                                                                    openPanel(panel, props.origin);
                                                                }}>
                                                                    <input type="checkbox" onDoubleClick={(e) => e.stopPropagation()}
                                                                        checked={item.checked}
                                                                        onChange={(e) => {
                                                                            let newList = [...list];
                                                                            let pickupIndex = newList.findIndex(x => x.title === 'pickup');
                                                                            newList[pickupIndex].items[index].checked = e.target.checked;

                                                                            setList(newList);
                                                                        }}
                                                                        id={`routing-route-item-${index}`}
                                                                    />
                                                                    <label htmlFor={`routing-route-item-${index}`}>
                                                                        <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                        <span>{item.customer?.name || ''}</span>
                                                                        <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                                    </label>
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
                                    // onKeyDown={getCarrierInfoByCode}
                                    onInput={(e) => { setSelectedCarrier({ ...selectedCarrier, code: e.target.value }) }}
                                    onChange={(e) => { setSelectedCarrier({ ...selectedCarrier, code: e.target.value }) }}
                                    value={(selectedCarrier?.code || '') + ((selectedCarrier?.code_number || 0) === 0 ? '' : selectedCarrier.code_number)}

                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={51 + props.tabTimes} type="text" placeholder="Name"
                                    readOnly={true}
                                    // onKeyDown={validateCarrierInfoForSaving}
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
                                        (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.first_name + ' ' +
                                        (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.last_name
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow" style={{ position: 'relative' }}>
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
                                        (selectedOrder?.carrier_contact_primary_phone || 'work') === 'work'
                                            ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_work || ''
                                            : (selectedOrder?.carrier_contact_primary_phone || 'work') === 'fax'
                                                ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_work_fax || ''
                                                : (selectedOrder?.carrier_contact_primary_phone || 'work') === 'mobile'
                                                    ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_mobile || ''
                                                    : (selectedOrder?.carrier_contact_primary_phone || 'work') === 'direct'
                                                        ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_direct || ''
                                                        : (selectedOrder?.carrier_contact_primary_phone || 'work') === 'other'
                                                            ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_other || ''
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
                                        {(selectedOrder?.carrier_contact_primary_phone || '')}
                                    </div>
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={55 + props.tabTimes} type="text" placeholder="Ext"
                                    readOnly={true}
                                    // onKeyDown={validateCarrierContactForSaving}
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
                                        (selectedOrder?.carrier_contact_primary_phone || 'work') === 'work'
                                            ? (selectedCarrier?.contacts || []).find(x => x.id === (selectedOrder?.carrier_contact_id || 0))?.phone_ext || ''
                                            : ''
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
                                        value={selectedOrder?.equipment?.name || ''}
                                    />
                                </div>
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
                                        value={selectedCarrierDriver?.name || ""}
                                    />
                                </div>
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container" style={{ width: '9rem' }}>
                                <MaskedInput tabIndex={58 + props.tabTimes}
                                    readOnly={true}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Driver Phone"
                                    // onKeyDown={validateCarrierDriverForSaving}
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
                                    // onKeyDown={validateCarrierDriverForSaving}
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
                                    // onKeyDown={validateCarrierDriverForSaving}
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

                                openPanel(panel, props.origin);
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
                                    <div className='form-buttons'>
                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'delivery')?.items || []).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            addDeliveriesToRoute('all');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Add All</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'delivery')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            addDeliveriesToRoute('selected');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Add Selected</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'delivery')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            let curList = list.map(x => {
                                                if (x.title === 'delivery') {
                                                    x.items.map(i => {
                                                        i.checked = false;
                                                        return i;
                                                    })
                                                }
                                                return x;
                                            });

                                            setList(curList);
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Clear Selection</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>
                                    </div>
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
                                                        <div
                                                            className="routing-delivery-item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )
                                                            }}

                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center' }} onDoubleClick={() => {
                                                                let panel = {
                                                                    panelName: `${props.panelName}-customer`,
                                                                    component: (
                                                                        <Customers
                                                                            pageName={"Customer"}
                                                                            title={
                                                                                (item?.type).toLowerCase() === 'pickup'
                                                                                    ? "Shipper Company"
                                                                                    : (item?.type).toLowerCase() === 'delivery'
                                                                                        ? "Consignee Company"
                                                                                        : "Customer"
                                                                            }
                                                                            panelName={`${props.panelName}-customer`}
                                                                            tabTimes={43000 + props.tabTimes}
                                                                            componentId={moment().format("x")}
                                                                            isOnPanel={true}
                                                                            isAdmin={props.isAdmin}
                                                                            origin={props.origin}


                                                                            customer_id={item?.customer?.id}
                                                                        />
                                                                    ),
                                                                };

                                                                openPanel(panel, props.origin);
                                                            }}>
                                                                <input type="checkbox" onDoubleClick={(e) => e.stopPropagation()}
                                                                    checked={item.checked}
                                                                    onChange={(e) => {
                                                                        let newList = [...list];
                                                                        let deliveryIndex = newList.findIndex(x => x.title === 'delivery');
                                                                        newList[deliveryIndex].items[index].checked = e.target.checked;

                                                                        setList(newList);
                                                                    }}
                                                                    id={`routing-delivery-item-${index}`}
                                                                />
                                                                <label htmlFor={`routing-delivery-item-${index}`}>
                                                                    <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                    <span>{item.customer?.name || ''}</span>
                                                                    <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                                </label>

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
                                    <div className='form-buttons'>
                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'route')?.items || []).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            removeFromRoute('all');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Remove All</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'route')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            removeFromRoute('selected');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Remove Selected</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'route')?.items || []).filter(x => x.type === 'pickup').length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            removeFromRoute('pickups');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Remove Pick Ups</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'route')?.items || []).filter(x => x.type === 'delivery').length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            removeFromRoute('deliveries');
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Remove Deliveries</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>

                                        <div className={`mochi-button ${(list.find(grp => grp.title === 'route')?.items || []).filter(x => x.checked).length > 0 ? '' : 'disabled'}`} onClick={() => {
                                            let curList = list.map(x => {
                                                if (x.title === 'route') {
                                                    x.items.map(i => {
                                                        i.checked = false;
                                                        return i;
                                                    })
                                                }
                                                return x;
                                            });

                                            setList(curList);
                                        }}>
                                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                            <div className='mochi-button-base'>Clear Selection</div>
                                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                        </div>
                                    </div>
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
                                                            <div style={{ display: 'flex', alignItems: 'center' }} onDoubleClick={() => {
                                                                let panel = {
                                                                    panelName: `${props.panelName}-customer`,
                                                                    component: (
                                                                        <Customers
                                                                            pageName={"Customer"}
                                                                            title={
                                                                                (item?.type).toLowerCase() === 'pickup'
                                                                                    ? "Shipper Company"
                                                                                    : (item?.type).toLowerCase() === 'delivery'
                                                                                        ? "Consignee Company"
                                                                                        : "Customer"
                                                                            }
                                                                            panelName={`${props.panelName}-customer`}
                                                                            tabTimes={43000 + props.tabTimes}
                                                                            componentId={moment().format("x")}
                                                                            isOnPanel={true}
                                                                            isAdmin={props.isAdmin}
                                                                            origin={props.origin}


                                                                            customer_id={item?.customer?.id}
                                                                        />
                                                                    ),
                                                                };

                                                                openPanel(panel, props.origin);
                                                            }}>
                                                                <input type="checkbox" onDoubleClick={(e) => e.stopPropagation()}
                                                                    checked={item.checked}
                                                                    onChange={(e) => {
                                                                        let newList = [...list];
                                                                        let routeIndex = newList.findIndex(x => x.title === 'route');
                                                                        newList[routeIndex].items[index].checked = e.target.checked;

                                                                        setList(newList);
                                                                    }}
                                                                    id={`routing-route-item-${index}`}
                                                                />
                                                                <label htmlFor={`routing-route-item-${index}`}>
                                                                    <span>{(item.customer?.code || '') + ((item.customer?.code_number || 0) === 0 ? '' : item.customer.code_number)}</span>
                                                                    <span>{item.customer?.name || ''}</span>
                                                                    <span>{item.customer?.city || ''}-{item.customer?.state || ''}</span>
                                                                </label>
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

        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedCarrierDriver: state.carrierReducers.selectedDriver,
        selectedCarrierInsurance: state.carrierReducers.selectedInsurance,
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

    setSelectedOrder,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedCarrierDriver,
    setSelectedCarrierInsurance
})(Routing)