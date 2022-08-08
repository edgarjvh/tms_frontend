import React, { useState, useEffect, useRef } from 'react'
import './ChangeCarrier.css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import axios from 'axios';
import NumberFormat from "react-number-format";
import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import {
    setCompanyOpenedPanels,
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
    CustomerSearch,
    RatingScreen
} from './../../panels';


const ChangeCarrier = (props) => {
    const [newCarrier, setNewCarrier] = useState({});
    const [currentCarrier, setCurrentCarrier] = useState({});
    const [currentCarrierCosts, setCurrentCarrierCosts] = useState(0);


    const refNewCarrierCode = useRef();
    const refNewCarrierName = useRef();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if ((props.selectedOrder?.carrier?.id || 0) > 0) {
            setCurrentCarrier({ ...props.selectedOrder.carrier });
            setCurrentCarrierCosts((props.selectedOrder?.order_carrier_ratings || []).reduce((accumulator, item) => {
                return accumulator + item.total_charges;
            }, 0));

            refNewCarrierCode.current.focus({
                preventScroll: true
            })
        }
    }, [])

    const getCarrierByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            e.preventDefault();
            if (e.target.value.trim() !== '') {

                setIsLoading(true);
                axios.post(props.serverUrl + '/carriers', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.carriers.length > 0) {
                            setNewCarrier(res.data.carriers[0]);
                            refNewCarrierName.current.focus();
                        } else {
                            setNewCarrier({});
                        }
                    } else {
                        setNewCarrier({});
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting carrier by code', e);
                    setIsLoading(false);
                });
            } else {
                setNewCarrier({});
            }
        }
    }

    const searchCarrierBtnClick = () => {
        let carrierSearch = [
            {
                field: 'Code',
                data: (newCarrier.code || '').toLowerCase()
            },
            {
                field: 'Name',
                data: (newCarrier.name || '').toLowerCase()
            },
            {
                field: 'City',
                data: ''
            },
            {
                field: 'State',
                data: ''
            },
            {
                field: 'Postal Code',
                data: ''
            },
            {
                field: 'Contact Name',
                data: ''
            },
            {
                field: 'Contact Phone',
                data: ''
            },
            {
                field: 'E-Mail',
                data: ''
            }
        ]

        let panel = {
            panelName: `${props.panelName}-carrier-search`,
            component: <CustomerSearch
                title='Carrier Search Results'
                tabTimes={69000 + props.tabTimes}
                panelName={`${props.panelName}-carrier-search`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                suborigin={'carrier'}

                customerSearch={carrierSearch}

                callback={(carrier) => {
                    if (carrier) {
                        new Promise((resolve, reject) => {
                            setNewCarrier({ ...carrier });
                            resolve('OK');
                        }).then(response => {
                            if (response === 'OK') {
                                props.closePanel(`${props.panelName}-carrier-search`, props.origin);
                                refNewCarrierName.current.focus();
                            }
                        });
                    } else {
                        refNewCarrierCode.current.focus();
                    }
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const updateCurrentCarrier = () => {
        if ((newCarrier?.id || 0) === 0) {
            window.alert('You must select a new carrier first!');
            return;
        }

        if (props.selectedOrder.carrier.id === newCarrier.id) {
            window.alert('You must select a carrier different from the current one!');
            return;
        }

        if (window.confirm('Are you sure you want to change the carrier?')) {
            setIsLoading(true);

            let selected_order = { ...props.selectedOrder };

            selected_order.carrier_id = newCarrier.id;

            let event_parameters = {
                order_id: selected_order.id,
                time: moment().format('HHmm'),
                event_time: moment().format('HHmm'),
                date: moment().format('MM/DD/YYYY'),
                event_date: moment().format('MM/DD/YYYY'),
                user_code_id: props.user.user_code.id || null,
                event_location: '',
                event_notes: `Changed Carrier from: "Old Carrier (${currentCarrier.code + (currentCarrier.code_number === 0 ? '' : currentCarrier.code_number) + ' - ' + currentCarrier.name})" to "New Carrier (${newCarrier.code + (newCarrier.code_number === 0 ? '' : newCarrier.code_number) + ' - ' + newCarrier.name})"`,
                event_type_id: 3,
                old_carrier_id: currentCarrier.id,
                new_carrier_id: newCarrier.id
            }

            axios.post(props.serverUrl + '/saveOrderEvent', event_parameters).then(res => {
                if (res.data.result === 'OK') {
                    selected_order.carrier_driver_id = newCarrier.drivers.length > 0 ? newCarrier.drivers[0].id : null

                    axios.post(props.serverUrl + '/saveOrder', selected_order).then(res => {
                        if (res.data.result === 'OK') {
                            props.setSelectedOrder({
                                id: res.data.order.id,
                                carrier: { ...newCarrier },
                                carrier_id: newCarrier.id,
                                carrier_driver_id: (newCarrier.drivers || []).length > 0 ? newCarrier.drivers[0].id : null,
                                events: res.data.order.events,
                                component_id: props.componentId
                            });

                            props.setSelectedCarrier({
                                ...newCarrier,
                                component_id: props.componentId,
                                change_carrier: true
                            });

                            props.setSelectedCarrierContact({
                                ...((newCarrier.contacts || []).find(c => c.is_primary === 1) || {}),
                                component_id: props.componentId,
                                change_carrier: true
                            });

                            props.setSelectedCarrierDriver({
                                ...((newCarrier.drivers || []).length > 0 ? newCarrier.drivers[0] : {}),
                                name: (newCarrier.drivers || []).length > 0 ? newCarrier.drivers[0].first_name + (newCarrier.drivers[0].last_name.trim() === '' ? '' : ' ' + newCarrier.drivers[0].last_name) : '',
                                component_id: props.componentId,
                                change_carrier: true
                            });

                            props.setSelectedCarrierInsurance({});

                            setNewCarrier({});
                            setIsLoading(false);
                            props.closeModal();
                        }
                    }).catch(e => {
                        console.log('error saving order changing carrier', e);
                        setIsLoading(false);
                    });
                } else if (res.data.result === 'ORDER ID NOT VALID') {
                    window.alert('The order number is not valid!');
                }
            }).catch(e => {
                console.log('error saving order event', e);
            })
        }
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const buttonClasses = classnames({
        'mochi-button': true,
        'disabled': isLoading
    });

    return (
        <div className="change-carrier-content">
            <div className="form-container">
                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Current Carrier</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-row">
                        <div className="input-box-container input-code">
                            <input tabIndex={6 + props.tabTimes * 5} type="text" placeholder="Code" maxLength="8"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        e.preventDefault();
                                    }
                                }}
                                readOnly={true}
                                value={((currentCarrier?.code || '') + ((currentCarrier?.code_number || 0) === 0 ? '' : currentCarrier.code_number)).toUpperCase()}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input tabIndex={7 + props.tabTimes * 5} type="text" placeholder="Name"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        e.preventDefault();
                                    }
                                }}
                                readOnly={true}
                                value={(currentCarrier?.name || '')}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row" style={{ marginTop: 15 }}>
                        <div className="label-box-container input-code">
                            <div>Carrier Rate</div>
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <NumberFormat
                                className={classnames({
                                    "negative-number":
                                        currentCarrierCosts < 0,
                                })}
                                style={{ fontSize: "0.7rem", textAlign: "center" }}
                                value={
                                    new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(currentCarrierCosts)
                                }
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
                    </div>
                </div>

                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">New Carrier</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={buttonClasses} onClick={() => { searchCarrierBtnClick() }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Search</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-row">
                        <div className="input-box-container input-code">
                            <input tabIndex={9 + props.tabTimes * 5} type="text" placeholder="Code" maxLength="8"
                                ref={refNewCarrierCode}
                                onKeyDown={(e) => { getCarrierByCode(e) }}
                                onInput={(e) => {
                                    setNewCarrier(newCarrier => {
                                        return {
                                            ...newCarrier,
                                            code: e.target.value
                                        }
                                    });
                                }}
                                onChange={(e) => {
                                    setNewCarrier(newCarrier => {
                                        return {
                                            ...newCarrier,
                                            code: e.target.value
                                        }
                                    });
                                }}
                                value={((newCarrier?.code || '') + ((newCarrier?.code_number || 0) === 0 ? '' : newCarrier.code_number)).toUpperCase()}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input tabIndex={10 + props.tabTimes * 5} type="text" placeholder="Name"
                                ref={refNewCarrierName}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        e.preventDefault();
                                    }
                                }}
                                onInput={(e) => {
                                    setNewCarrier(newCarrier => {
                                        return {
                                            ...newCarrier,
                                            name: e.target.value
                                        }
                                    });
                                }}
                                onChange={(e) => {
                                    setNewCarrier(newCarrier => {
                                        return {
                                            ...newCarrier,
                                            name: e.target.value
                                        }
                                    });
                                }}
                                value={newCarrier.name || ''}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row" style={{ marginTop: 15 }}>
                        <div className="label-box-container input-code">
                            <div>Carrier Rate</div>
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input tabIndex={11 + props.tabTimes * 5} type="text" placeholder="Rate"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        e.preventDefault();
                                    }
                                }}
                                readOnly={true}
                                value={(newCarrier?.id || 0) === 0 ? '' : '$1,234,00'}
                            />
                        </div>
                    </div>

                    {
                        isLoading &&
                        <div className="loading-container2">
                            <Loader type="ThreeDots" color="#333738" height={20} width={20} active={true} />
                        </div>
                    }
                </div>
            </div>

            <div className="button-container" tabIndex={-1} onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {                   
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}>
                <div className={buttonClasses} onClick={() => {
                    props.closeModal();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Cancel</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={buttonClasses} onClick={() => {
                    setNewCarrier({});
                    refNewCarrierCode.current.focus();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Clear</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={buttonClasses} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-rating`,
                        component: <RatingScreen
                            panelName={`${props.panelName}-rating`}
                            title='Rating Screen'
                            tabTimes={34000 + props.tabTimes}
                            componentId={moment().format('x')}
                            origin={props.origin}
                            selectedOrder={props.selectedOrder}
                        />
                    }

                    props.openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Adjust Rate</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={buttonClasses} onClick={() => { updateCurrentCarrier() }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Update</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
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
    setSelectedOrder,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedCarrierDriver,
    setSelectedCarrierInsurance
})(ChangeCarrier)