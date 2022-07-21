// src/DisplayMapClass.js
import React, { Component } from 'react';
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
    setSelectedOrder,
} from './../../../../actions';

import {
    Carriers
} from './../../../company';

import {
    RateConf,
    // RoutingMap
} from './../../panels';


class RoutingMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // The map instance to use during cleanup
            map: null
        };
    }

    mapRef = React.createRef();

    componentDidMount() {

        const H = window.H;
        const platform = new H.service.Platform({
            apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
            app_id: "X4qy0Sva14BQxJCbVqXL"
        });

        const defaultLayers = platform.createDefaultLayers();

        // Create an instance of the map
        const map = new H.Map(
            this.mapRef.current,
            defaultLayers.vector.normal.map,
            {
                // This map is centered over Europe
                center: { lat: 50, lng: 5 },
                zoom: 4,
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        // This variable is unused and is present for explanatory purposes
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components to allow the user to interact with them
        // This variable is unused
        const ui = H.ui.UI.createDefault(map, defaultLayers);

        this.setState({ map });
    }

    componentWillUnmount() {
        // Cleanup after the map to avoid memory leaks when this component exits the page
        this.state.map.dispose();
    }

    render() {
        return (
            <div className="panel-content routing-map">
                <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
                <div className="title">{this.props.title}</div><div className="side-title"><div>{this.props.title}</div></div>

                <div className="map-main-container">
                    <div ref={this.mapRef} style={{ height: "100%" }} />
                </div>
            </div>

        );
    }
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

export default connect()(RoutingMap)