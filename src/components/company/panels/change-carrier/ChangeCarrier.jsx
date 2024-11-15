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
                axios.post(props.serverUrl + '/getOrderCarrierByCode', {
                    code: e.target.value.toLowerCase(),
                    division_type: props.selectedOrder?.division?.type
                }).then(res => {
                    if (res.data.result === 'OK') {
                        const carrier = { ...res.data.carrier };
                        if ((carrier?.insurance_status || '') === 'active') {
                            window.alert("This carrier isn't allowed to be assigned to an order because it doesn't have an active insurance status.");
                            return;
                        }

                        setNewCarrier({ ...carrier, driver_code: res.data?.driver_code });
                        refNewCarrierName.current.focus();
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
                suborigin={'carrier'}
                customerSearch={carrierSearch}
                callback={(id) => {
                    if (id) {
                        new Promise((resolve, reject) => {
                            axios.post(props.serverUrl + '/getCarrierById', { id: id }).then(res => {
                                if (res.data.result === 'OK') {
                                    const carrier = res.data.carrier;

                                    if (carrier) {
                                        if ((carrier?.insurance_status || '') === 'active') {
                                            window.alert("This carrier isn't allowed to be assigned to an order because it doesn't have an active insurance status.");
                                            reject("no carrier");
                                            return;
                                        }
                                        setNewCarrier({ ...carrier });
                                        resolve("OK");
                                    } else {
                                        reject("no carrier");
                                    }
                                }
                            }).catch(e => {
                                console.log('error on getting carrier', e);
                            })
                        }).then(response => {
                            if (response === 'OK') {
                                closePanel(`${props.panelName}-carrier-search`, props.origin);
                                refNewCarrierName.current.focus();
                            }
                        });
                    } else {
                        refNewCarrierCode.current.focus();
                    }
                }}
            />
        }

        openPanel(panel, props.origin);
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
            selected_order.carrier = { ...newCarrier };

            let driver = null;
            let contact = null;

            if ((newCarrier?.drivers || []).length > 0) {
                driver = newCarrier.drivers.find(x => x.code.toUpperCase() === (newCarrier?.driver_code || '').toUpperCase()) || newCarrier.drivers[0];
            }

            if ((newCarrier?.contacts || []).length > 0) {
                contact = newCarrier.contacts.find(x => (x.is_primary || 0) === 1) || newCarrier.contacts[0];
            }

            selected_order.equipment_id = driver?.tractor?.type_id;
            selected_order.equipment = driver?.tractor?.type;
            selected_order.carrier_contact_id = contact?.id;
            selected_order.carrier_contact_primary_phone = contact?.primary_phone || 'work';
            selected_order.carrier_driver_id = driver?.id;
            selected_order.driver = driver;

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
                                carrier_contact_id: contact?.id,
                                carrier_driver_id: driver?.id,
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

    return (
        <div className="change-carrier-content" onKeyDown={(e) => {
            let key = e.keyCode || e.which;

            if (key === 27) {
                e.stopPropagation();
                props.closeModal();
            }
        }}>
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

                    openPanel(panel, props.origin);
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
})(ChangeCarrier)