
import React, { useState, useRef, useEffect } from 'react';
import { connect } from "react-redux";
import './RoutingMap.css';
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
    setSelectedOrder
} from './../../../../actions';

import { HEREMap } from 'here-maps-react';

const RoutingMap = (props) => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 10.998666, lng: -63.79841 });
    const [selectedOrder, setSelectedOrder] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const mapRef = useRef();
    const H = window.H;
    const platform = new H.service.Platform({
        apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
        app_id: "X4qy0Sva14BQxJCbVqXL"
    });
    const routingService = platform.getRoutingService(null, 8);

    let hMap = null;

    useEffect(() => {

        // `mapRef.current` will be `undefined` when this hook first runs; edge case that
        if (!mapRef.current) return;

        const defaultLayers = platform.createDefaultLayers();
        hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            center: { lat: 32.803418, lng: -96.8335293 },
            zoom: 4,
            pixelRatio: window.devicePixelRatio || 1,
            padding: { top: 50, left: 50, bottom: 50, right: 50 }
        });
        
        // add a resize listener to make sure that the map occupies the whole container
        window.addEventListener('resize', () => hMap.getViewPort().resize());

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

        const ui = H.ui.UI.createDefault(hMap, defaultLayers);

        ui.getControl('zoom').setDisabled(false);

        var mapSettings = ui.getControl('mapsettings');
        var zoom = ui.getControl('zoom');
        var scalebar = ui.getControl('scalebar');

        mapSettings.setAlignment('top-left');
        zoom.setAlignment('top-left');
        scalebar.setAlignment('top-left');

        let origin = null;
        let destination = null;

        if ((props.selectedOrder?.routing || []).length >= 2) {
            let start = props.selectedOrder.routing[0];
            let waypoints = [];
            let end = props.selectedOrder.routing[props.selectedOrder.routing.length - 1];

            if (start.type === 'pickup') {
                props.selectedOrder.pickups.map((p, i) => {
                    if (p.id === start.pickup_id) {
                        if ((p.customer?.zip_data || '') !== '') {
                            origin = `${p.customer.zip_data.latitude.toString()},${p.customer.zip_data.longitude.toString()}`;
                        }
                    }
                    return false;
                })
            } else {
                props.selectedOrder.deliveries.map((d, i) => {
                    if (d.id === start.delivery_id) {
                        if ((d.customer?.zip_data || '') !== '') {
                            origin = `${d.customer.zip_data.latitude.toString()},${d.customer.zip_data.longitude.toString()}`;
                        }
                    }
                    return false;
                })
            }

            props.selectedOrder.routing.map((item, i) => {
                if (i > 0 && i < (props.selectedOrder.routing.length - 1)) {
                    if (item.type === 'pickup') {
                        props.selectedOrder.pickups.map((p, i) => {
                            if (p.id === item.pickup_id) {
                                if ((p.customer?.zip_data || '') !== '') {
                                    waypoints.push(`${p.customer.zip_data.latitude.toString()},${p.customer.zip_data.longitude.toString()}`);
                                }
                            }
                            return false;
                        })
                    } else {
                        props.selectedOrder.deliveries.map((d, i) => {
                            if (d.id === item.delivery_id) {
                                if ((d.customer?.zip_data || '') !== '') {
                                    waypoints.push(`${d.customer.zip_data.latitude.toString()},${d.customer.zip_data.longitude.toString()}`);
                                }
                            }
                            return false;
                        })
                    }
                }

                return true;
            });

            if (end.type === 'pickup') {
                props.selectedOrder.pickups.map((p, i) => {
                    if (p.id === end.pickup_id) {
                        if ((p.customer?.zip_data || '') !== '') {
                            destination = `${p.customer.zip_data.latitude.toString()},${p.customer.zip_data.longitude.toString()}`;
                        }
                    }
                    return false;
                })
            } else {
                props.selectedOrder.deliveries.map((d, i) => {
                    if (d.id === end.delivery_id) {
                        if ((d.customer?.zip_data || '') !== '') {
                            destination = `${d.customer.zip_data.latitude.toString()},${d.customer.zip_data.longitude.toString()}`;
                        }
                    }
                    return false;
                })
            }

            let params = {
                'routingMode': 'fast',
                'transportMode': 'car',
                'origin': origin,
                'via': new H.service.Url.MultiValueQueryParameter(waypoints),
                'destination': destination,
                'return': 'polyline,summary'
            }

            routingService.calculateRoute(params, (result) => {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, lineWidth: 3 }
                    });
                    
                    let startMarker = new H.map.Marker(section.departure.place.location);

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location);

                    // Add the route polyline and the two markers to the map:
                    let group = new H.map.Group();

                    hMap.addObject(group);

                    // // add 'tap' event listener, that opens info bubble, to the group
                    // group.addEventListener('tap', function (evt) {
                    //     // event target is the marker itself, group is a parent event target
                    //     // for all objects that it contains
                    //     let bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                    //         // read custom data
                    //         content: evt.target.getData()
                    //     });
                    //     // show info bubble
                    //     ui.addBubble(bubble);
                    // }, false);

                    addMarkerToGroup(group, section.departure.place.location,
                        '<div style="width:50px; height:50px"><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
                        '<div>City of Manchester Stadium<br />Capacity: 55,097</div>');

                    addMarkerToGroup(group, section.arrival.place.location,
                        '<div style="width:50px; height:50px"><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
                        '<div>City of Manchester Stadium<br />Capacity: 55,097</div>');

                    hMap.addObjects([routeLine]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }, (error) => {
                console.log(error.message);
            });
        }

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose();
        };
    }, [mapRef]);

    const addMarkerToGroup = (group, coord, html) => {
        var marker = new H.map.Marker(coord);
        // add custom data to the marker
        marker.setData(html);
        group.addObject(marker);
    }

    return (
        <div className="panel-content routing-map">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div className="map" ref={mapRef} style={{ height: "100%" }} />
        </div>
    )
}

export default RoutingMap;