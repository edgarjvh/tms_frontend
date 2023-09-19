import React, { useState, useRef, useEffect } from 'react';
import { connect } from "react-redux";
import './EquipmentInformation.css';
import classnames from 'classnames';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";

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

    setSelectedCarrier,
} from './../../../../actions';
import axios from 'axios';

const EquipmentInformation = (props) => {
    const [equipmentInformation, setEquipmentInformation] = useState({});

    const refEquipmentCarrierCode = useRef();

    const refEquipment = useRef();
    const [equipmentDropdownItems, setEquipmentDropdownItems] = useState([]);
    const refEquipmentDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setEquipmentDropdownItems([])
        }
    });
    const refEquipmentPopupItems = useRef([]);

    const refLength = useRef();
    const [lengthDropdownItems, setLengthDropdownItems] = useState([
        {
            id: 1,
            name: 'Feet',
            value: 'ft',
            selected: false
        },
        {
            id: 2,
            name: 'Inches',
            value: 'in',
            selected: false
        }
    ]);
    const refLengthDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowLengthDropdownItems(false)
        }
    });
    const refLengthPopupItems = useRef([]);
    const [showLengthDropdownItems, setShowLengthDropdownItems] = useState(false);

    const refWidth = useRef();
    const [widthDropdownItems, setWidthDropdownItems] = useState([
        {
            id: 1,
            name: 'Feet',
            value: 'ft',
            selected: false
        },
        {
            id: 2,
            name: 'Inches',
            value: 'in',
            selected: false
        }
    ]);
    const refWidthDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowWidthDropdownItems(false)
        }
    });
    const refWidthPopupItems = useRef([]);
    const [showWidthDropdownItems, setShowWidthDropdownItems] = useState(false);

    const refHeight = useRef();
    const [heightDropdownItems, setHeightDropdownItems] = useState([
        {
            id: 1,
            name: 'Feet',
            value: 'ft',
            selected: false
        },
        {
            id: 2,
            name: 'Inches',
            value: 'in',
            selected: false
        }
    ]);
    const refHeightDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowHeightDropdownItems(false)
        }
    });
    const refHeightPopupItems = useRef([]);
    const [showHeightDropdownItems, setShowHeightDropdownItems] = useState(false);

    const [isSavingEquipmentInformation, setIsSavingEquipmentInformation] = useState(false);

    const equipmentTransition = useTransition(equipmentDropdownItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: equipmentDropdownItems.length > 0
    });

    const lengthTransition = useTransition(showLengthDropdownItems, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showLengthDropdownItems
    });

    const widthTransition = useTransition(showWidthDropdownItems, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showWidthDropdownItems
    });

    const heightTransition = useTransition(showHeightDropdownItems, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showHeightDropdownItems
    });

    useEffect(() => {
        if ((props.carrier?.id || 0) > 0) {
            axios.post(props.serverUrl + '/getCarrierEquipments', { carrier_id: props.carrier.id }).then(res => {
                if (res.data.result === 'OK') {
                    setEquipmentInformation(equipmentInformation => {
                        return {
                            ...equipmentInformation,
                            carrier: {
                                ...(props.carrier || {}),
                                equipments_information: res.data.equipments_information
                            }
                        }
                    });

                    refEquipment.current.focus({
                        preventScroll: true
                    })
                }
            }).catch(e => {
                console.log(e)
            });
        } else {
            setEquipmentInformation(equipmentInformation => {
                return {
                    ...equipmentInformation,
                    carrier: {}
                }
            });

            refEquipmentCarrierCode.current.focus({
                preventScroll: true
            })
        }
    }, []);

    useEffect(() => {
        if (isSavingEquipmentInformation) {
            if ((props.user?.user_code?.is_admin || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0) {
                return;
            }

            let newEquipmentInformation = { ...equipmentInformation };
            let carrier = newEquipmentInformation?.carrier || {};
            let equipment = newEquipmentInformation?.equipment || {};

            newEquipmentInformation.carrier_id = carrier.id || 0;
            newEquipmentInformation.equipment_id = equipment.id || 0;

            if (newEquipmentInformation.carrier_id > 0 &&
                newEquipmentInformation.equipment_id > 0) {

                axios.post(props.serverUrl + '/saveCarrierEquipment', newEquipmentInformation).then(res => {
                    if (res.data.result === 'OK') {
                        setEquipmentInformation(equipmentInformation => {
                            return {
                                ...equipmentInformation,
                                carrier: {
                                    ...equipmentInformation.carrier,
                                    equipments_information: res.data.equipments_information
                                },
                                id: null,
                                equipment_id: 0,
                                equipment: {},
                                units: '',
                                equipment_length: '',
                                equipment_width: '',
                                equipment_height: ''
                            }
                        });

                        refEquipment.current.focus();
                    }
                    setIsSavingEquipmentInformation(false);
                }).catch(async e => {
                    console.log('error on saving carrier equipment information', e);
                    setIsSavingEquipmentInformation(false);
                });
            } else {
                setIsSavingEquipmentInformation(false);
            }
        }
    }, [isSavingEquipmentInformation]);


    const searchCarrierByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {

                axios.post(props.serverUrl + '/carriers', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.carriers.length > 0) {
                            setEquipmentInformation(equipmentInformation => {
                                return {
                                    ...equipmentInformation,
                                    carrier: {
                                        id: res.data.carriers[0].id,
                                        code: res.data.carriers[0].code,
                                        code_number: res.data.carriers[0].code_number,
                                        name: res.data.carriers[0].name,
                                        equipments_information: res.data.carriers[0].equipments_information
                                    }
                                }
                            });

                            refEquipment.current.focus();
                        } else {
                            setEquipmentInformation(equipmentInformation => {
                                return {
                                    ...equipmentInformation,
                                    carrier: {
                                        ...equipmentInformation.carrier,
                                        id: 0,
                                        code_number: 0,
                                        name: '',
                                        equipments_information: []
                                    },
                                    id: 0,
                                    equipment_id: 0,
                                    equipment: {},
                                    units: '',
                                    equipment_length: '',
                                    equipment_width: '',
                                    equipment_height: ''
                                }
                            });
                        }
                    }
                });
            } else {
                setEquipmentInformation(equipmentInformation => {
                    return {
                        ...equipmentInformation,
                        carrier: {
                            ...equipmentInformation.carrier,
                            id: 0,
                            code_number: 0,
                            name: '',
                            equipments_information: []
                        },
                        id: 0,
                        equipment_id: 0,
                        equipment: {},
                        units: '',
                        equipment_length: '',
                        equipment_width: '',
                        equipment_height: ''
                    }
                });
            }
        }
    }

    const validateEquipmentForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingEquipmentInformation) {
                e.preventDefault();
                setIsSavingEquipmentInformation(true);
            } else {
                e.preventDefault();
                refEquipmentCarrierCode.current.focus();
                setIsSavingEquipmentInformation(false);
            }
        }
    }

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
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            <div className='form-bordered-box' style={{ margin: '20px 0 10px 0', flexGrow: 'initial' }}>
                <div className='form-header'>
                    <div className='top-border top-border-left'></div>
                    <div className='top-border top-border-middle'></div>
                    <div className="form-buttons">
                        <div className="mochi-button" onClick={() => {
                            setEquipmentInformation({
                                ...equipmentInformation,
                                id: null,
                                equipment: {},
                                equipment_id: null,
                                units: '',
                                equipment_length: '',
                                equipment_length_unit: '',
                                equipment_width: '',
                                equipment_width_unit: '',
                                equipment_height: '',
                                equipment_height_unit: '',
                            });

                            refEquipment.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Clear</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>
                    <div className='top-border top-border-right'></div>
                </div>

                <div className="form-row">
                    <div className="input-box-container input-code">
                        <input tabIndex={1 + props.tabTimes} type="text" maxLength="8" placeholder="Code"
                            readOnly={
                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                            }
                            ref={refEquipmentCarrierCode}
                            onKeyDown={searchCarrierByCode}
                            onInput={e => {
                                setEquipmentInformation({
                                    ...equipmentInformation, carrier: {
                                        ...equipmentInformation.carrier,
                                        code: e.target.value
                                    }
                                })
                            }}
                            onChange={e => {
                                setEquipmentInformation({
                                    ...equipmentInformation, carrier: {
                                        ...equipmentInformation.carrier,
                                        code: e.target.value
                                    }
                                })
                            }}
                            value={(equipmentInformation?.carrier?.code_number || 0) === 0 ? (equipmentInformation?.carrier?.code || '') : equipmentInformation?.carrier?.code + equipmentInformation?.carrier?.code_number}
                        />
                    </div>
                    <div className="form-h-sep"></div>
                    <div className="input-box-container grow">
                        <input tabIndex={2 + props.tabTimes} type="text" placeholder="Name"
                            readOnly={true}
                            onInput={e => {
                                setEquipmentInformation({
                                    ...equipmentInformation, carrier: {
                                        ...equipmentInformation.carrier,
                                        name: e.target.value
                                    }
                                })
                            }}
                            onChange={e => {
                                setEquipmentInformation({
                                    ...equipmentInformation, carrier: {
                                        ...equipmentInformation.carrier,
                                        name: e.target.value
                                    }
                                })
                            }}
                            value={equipmentInformation?.carrier?.name || ''}
                        />
                    </div>
                </div>
                <div className="form-v-sep"></div>
                <div className="form-row">
                    <div className="select-box-container" style={{ flexGrow: 1 }}>
                        <div className="select-box-wrapper">
                            <input tabIndex={3 + props.tabTimes} type="text" placeholder="Equipment"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                                }
                                ref={refEquipment}
                                onKeyDown={async (e) => {
                                    let key = e.keyCode || e.which;

                                    switch (key) {
                                        case 37:
                                        case 38: // arrow left | arrow up
                                            e.preventDefault();
                                            if (equipmentDropdownItems.length > 0) {
                                                let selectedIndex = equipmentDropdownItems.findIndex(item => item.selected);

                                                if (selectedIndex === -1) {
                                                    await setEquipmentDropdownItems(equipmentDropdownItems.map((item, index) => {
                                                        item.selected = index === 0;
                                                        return item;
                                                    }))
                                                } else {
                                                    await setEquipmentDropdownItems(equipmentDropdownItems.map((item, index) => {
                                                        if (selectedIndex === 0) {
                                                            item.selected = index === (equipmentDropdownItems.length - 1);
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
                                                axios.post(props.serverUrl + '/getEquipments').then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (equipmentInformation?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === equipmentInformation.equipment.id
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
                                                    console.log('error getting driver equipments', e);
                                                })
                                            }
                                            break;

                                        case 39:
                                        case 40: // arrow right | arrow down
                                            e.preventDefault();
                                            if (equipmentDropdownItems.length > 0) {
                                                let selectedIndex = equipmentDropdownItems.findIndex(item => item.selected);

                                                if (selectedIndex === -1) {
                                                    await setEquipmentDropdownItems(equipmentDropdownItems.map((item, index) => {
                                                        item.selected = index === 0;
                                                        return item;
                                                    }))
                                                } else {
                                                    await setEquipmentDropdownItems(equipmentDropdownItems.map((item, index) => {
                                                        if (selectedIndex === (equipmentDropdownItems.length - 1)) {
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
                                                axios.post(props.serverUrl + '/getEquipments').then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (equipmentInformation?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === equipmentInformation.equipment.id
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
                                                    console.log('error getting driver equipments', e);
                                                })
                                            }
                                            break;

                                        case 27: // escape
                                            setEquipmentDropdownItems([]);
                                            break;

                                        case 13: // enter
                                            if (equipmentDropdownItems.length > 0 && equipmentDropdownItems.findIndex(item => item.selected) > -1) {
                                                await setEquipmentInformation({
                                                    ...equipmentInformation,
                                                    equipment: equipmentDropdownItems[equipmentDropdownItems.findIndex(item => item.selected)]
                                                });
                                                setEquipmentDropdownItems([]);
                                                refEquipment.current.focus();
                                            }
                                            break;

                                        case 9: // tab
                                            if (equipmentDropdownItems.length > 0) {
                                                e.preventDefault();
                                                await setEquipmentInformation({
                                                    ...equipmentInformation,
                                                    equipment: equipmentDropdownItems[equipmentDropdownItems.findIndex(item => item.selected)]
                                                });
                                                setEquipmentDropdownItems([]);
                                                refEquipment.current.focus();
                                            }
                                            break;

                                        default:
                                            break;
                                    }
                                }}
                                onBlur={async () => {
                                    if ((equipmentInformation?.equipment?.id || 0) === 0) {
                                        await setEquipmentInformation({ ...equipmentInformation, equipment: {} });
                                    }
                                }}
                                onInput={(e) => {
                                    let equipment = equipmentInformation?.equipment || {};
                                    equipment.id = 0;
                                    equipment.name = e.target.value;
                                    setEquipmentInformation(equipmentInformation => {
                                        return { ...equipmentInformation, equipment: equipment }
                                    });

                                    if (e.target.value.trim() === '') {
                                        setEquipmentDropdownItems([]);
                                    } else {
                                        axios.post(props.serverUrl + '/getEquipments', {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                setEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                    item.selected = (equipmentInformation?.equipment?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === equipmentInformation.equipment.id
                                                    return item;
                                                }))
                                            }
                                        }).catch(async e => {
                                            console.log('error getting equipments', e);
                                        })
                                    }
                                }}
                                onChange={(e) => {
                                    let equipment = equipmentInformation?.equipment || {};
                                    equipment.id = 0;
                                    equipment.name = e.target.value;
                                    setEquipmentInformation(equipmentInformation => {
                                        return { ...equipmentInformation, equipment: equipment }
                                    });
                                }}
                                value={equipmentInformation?.equipment?.name || ''}
                            />
                            {
                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 1 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 1)) &&
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (equipmentDropdownItems.length > 0) {
                                        setEquipmentDropdownItems([]);
                                    } else {
                                        if ((equipmentInformation?.equipment?.id || 0) === 0 && (equipmentInformation?.equipment?.name || '') !== '') {
                                            axios.post(props.serverUrl + '/getEquipments', {
                                                name: equipmentInformation?.equipment.name
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                        item.selected = (equipmentInformation?.equipment?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === equipmentInformation.equipment.id
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
                                            axios.post(props.serverUrl + '/getEquipments').then(res => {
                                                if (res.data.result === 'OK') {
                                                    setEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                        item.selected = (equipmentInformation?.equipment?.id || 0) === 0
                                                            ? index === 0
                                                            : item.id === equipmentInformation.equipment.id
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
                                }} />
                            }

                        </div>
                        {
                            equipmentTransition((style, item) => item && (
                                <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-equipment"
                                    style={{
                                        ...style,
                                        left: 0,
                                        display: 'block'
                                    }}
                                    ref={refEquipmentDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below right">
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                {
                                                    equipmentDropdownItems.map((item, index) => {
                                                        const mochiItemClasses = classnames({
                                                            'mochi-item': true,
                                                            'selected': item.selected
                                                        });

                                                        const searchValue = (equipmentInformation?.equipment?.id || 0) === 0 && (equipmentInformation?.equipment?.name || '') !== ''
                                                            ? equipmentInformation?.equipment?.name : undefined;

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={mochiItemClasses}
                                                                id={item.id}
                                                                onClick={async () => {
                                                                    await setEquipmentInformation({
                                                                        ...equipmentInformation,
                                                                        equipment: item
                                                                    });
                                                                    setEquipmentDropdownItems([]);
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
                                                                    <FontAwesomeIcon className="dropdown-selected"
                                                                        icon={faCaretRight} />
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
                    <div className="form-h-sep"></div>
                    <div className="input-box-container" style={{
                        width: '10rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Number of
                            Units
                        </div>
                        <input tabIndex={4 + props.tabTimes} style={{ textAlign: 'right', fontWeight: 'bold' }}
                            readOnly={
                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                            }
                            type="text"
                            onInput={(e) => {
                                setEquipmentInformation({ ...equipmentInformation, units: e.target.value })
                            }}
                            onChange={(e) => {
                                setEquipmentInformation({ ...equipmentInformation, units: e.target.value })
                            }}
                            value={equipmentInformation.units || ''}
                        />
                    </div>
                </div>
                <div className="form-v-sep"></div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: 2 }}>
                    <div className="select-box-container"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="select-box-wrapper">
                            <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Length
                            </div>
                            <input style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                paddingRight: (equipmentInformation?.equipment_length || '').trim().length > 0 ? 25 : 0
                            }}
                                tabIndex={5 + props.tabTimes} type="text"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                                }
                                ref={refLength}
                                onKeyDown={async (e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 70) {
                                        e.preventDefault();

                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_length_unit: 'ft'
                                        })
                                    } else if (key === 73) {
                                        e.preventDefault();
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_length_unit: 'in'
                                        })
                                    } else if (key === 38) {
                                        e.preventDefault();
                                        if (showLengthDropdownItems) {
                                            let selectedIndex = lengthDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (lengthDropdownItems.length - 1);
                                                    } else {
                                                        item.selected = index === (selectedIndex - 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_length_unit === item.value
                                                return item;
                                            }))

                                            await setShowLengthDropdownItems(true);
                                        }

                                        refLengthPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 40) {
                                        e.preventDefault();
                                        if (showLengthDropdownItems) {
                                            let selectedIndex = lengthDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                    if (selectedIndex === (lengthDropdownItems.length - 1)) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === (selectedIndex + 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_length_unit === item.value
                                                return item;
                                            }))

                                            await setShowLengthDropdownItems(true);
                                        }

                                        refLengthPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 27) {
                                        await setShowLengthDropdownItems(false);
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_length_unit: ''
                                        })
                                    } else if (key === 13) {
                                        if (showLengthDropdownItems && lengthDropdownItems.findIndex(item => item.selected) > -1) {
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_length_unit: lengthDropdownItems[lengthDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowLengthDropdownItems(false);
                                            refLength.current.focus();
                                        }
                                    } else if (key === 9) {
                                        if (showLengthDropdownItems) {
                                            e.preventDefault();
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_length_unit: lengthDropdownItems[lengthDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowLengthDropdownItems(false);
                                            refLength.current.focus();
                                        }
                                    } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {

                                    } else if (key === 8 || key === 46) {

                                    } else {
                                        e.preventDefault();
                                    }
                                }}

                                onInput={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_length: e.target.value
                                    })
                                }}
                                onChange={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_length: e.target.value
                                    })
                                }}
                                value={equipmentInformation.equipment_length || ''}
                            />
                            {
                                (equipmentInformation?.equipment_length || '').trim().length > 0 &&
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '18px',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Mochi Med Oblique',
                                    fontWeight: 'bold'
                                }}>{equipmentInformation?.equipment_length_unit || ''}</div>
                            }
                            {
                                (equipmentInformation?.equipment_length || '').trim().length > 0 &&
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (showLengthDropdownItems) {
                                        setShowLengthDropdownItems(false);
                                    } else {
                                        setLengthDropdownItems(lengthDropdownItems.map((item, index) => {
                                            item.selected = equipmentInformation.equipment_length_unit === item.value
                                            return item;
                                        }))

                                        window.setTimeout(() => {
                                            setShowLengthDropdownItems(true);
                                        }, 0)
                                    }

                                    refLength.current.focus();
                                }} />
                            }
                        </div>
                        {
                            lengthTransition((style, item) => item && (
                                <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-equipment-length"
                                    style={{
                                        ...style,
                                        left: 0,
                                        display: 'block'
                                    }}
                                    ref={refLengthDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below right">
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                {
                                                    lengthDropdownItems.map((item, index) => {
                                                        const mochiItemClasses = classnames({
                                                            'mochi-item': true,
                                                            'selected': item.selected
                                                        });

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={mochiItemClasses}
                                                                id={item.id}
                                                                onClick={async () => {
                                                                    await setEquipmentInformation({
                                                                        ...equipmentInformation,
                                                                        equipment_length_unit: item.value
                                                                    });
                                                                    setShowLengthDropdownItems(false);
                                                                    refLength.current.focus();
                                                                }}
                                                                ref={ref => refLengthPopupItems.current.push(ref)}
                                                            >
                                                                {
                                                                    item.name
                                                                }
                                                                {
                                                                    item.selected &&
                                                                    <FontAwesomeIcon className="dropdown-selected"
                                                                        icon={faCaretRight} />
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

                    <div className="select-box-container"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="select-box-wrapper">
                            <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Width
                            </div>
                            <input style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                paddingRight: (equipmentInformation?.equipment_width || '').trim().length > 0 ? 25 : 0
                            }}
                                tabIndex={6 + props.tabTimes} type="text"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                                }
                                ref={refWidth}
                                onKeyDown={async (e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 70) {
                                        e.preventDefault();

                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_width_unit: 'ft'
                                        })
                                    } else if (key === 73) {
                                        e.preventDefault();
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_width_unit: 'in'
                                        })
                                    } else if (key === 38) {
                                        e.preventDefault();
                                        if (showWidthDropdownItems) {
                                            let selectedIndex = widthDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (widthDropdownItems.length - 1);
                                                    } else {
                                                        item.selected = index === (selectedIndex - 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_width_unit === item.value
                                                return item;
                                            }))

                                            await setShowWidthDropdownItems(true);
                                        }

                                        refWidthPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 40) {
                                        e.preventDefault();
                                        if (showWidthDropdownItems) {
                                            let selectedIndex = widthDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                    if (selectedIndex === (widthDropdownItems.length - 1)) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === (selectedIndex + 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_width_unit === item.value
                                                return item;
                                            }))

                                            await setShowWidthDropdownItems(true);
                                        }

                                        refWidthPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 27) {
                                        await setShowWidthDropdownItems(false);
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_width_unit: ''
                                        })
                                    } else if (key === 13) {
                                        if (showWidthDropdownItems && widthDropdownItems.findIndex(item => item.selected) > -1) {
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_width_unit: widthDropdownItems[widthDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowWidthDropdownItems(false);
                                            refWidth.current.focus();
                                        }
                                    } else if (key === 9) {
                                        if (showWidthDropdownItems) {
                                            e.preventDefault();
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_width_unit: widthDropdownItems[widthDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowWidthDropdownItems(false);
                                            refWidth.current.focus();
                                        }
                                    } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {

                                    } else if (key === 8 || key === 46) {

                                    } else {
                                        e.preventDefault();
                                    }
                                }}

                                onInput={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_width: e.target.value
                                    })
                                }}
                                onChange={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_width: e.target.value
                                    })
                                }}
                                value={equipmentInformation.equipment_width || ''}
                            />
                            {
                                (equipmentInformation?.equipment_width || '').trim().length > 0 &&
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '18px',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Mochi Med Oblique',
                                    fontWeight: 'bold'
                                }}>{equipmentInformation?.equipment_width_unit || ''}</div>
                            }
                            {
                                (equipmentInformation?.equipment_width || '').trim().length > 0 &&
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (showWidthDropdownItems) {
                                        setShowWidthDropdownItems(false);
                                    } else {
                                        setWidthDropdownItems(widthDropdownItems.map((item, index) => {
                                            item.selected = equipmentInformation.equipment_width_unit === item.value
                                            return item;
                                        }))

                                        window.setTimeout(() => {
                                            setShowWidthDropdownItems(true);
                                        }, 0)
                                    }

                                    refWidth.current.focus();
                                }} />
                            }
                        </div>
                        {
                            widthTransition((style, item) => item && (
                                <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-equipment-width"
                                    style={{
                                        ...style,
                                        left: 0,
                                        display: 'block'
                                    }}
                                    ref={refWidthDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below right">
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                {
                                                    widthDropdownItems.map((item, index) => {
                                                        const mochiItemClasses = classnames({
                                                            'mochi-item': true,
                                                            'selected': item.selected
                                                        });

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={mochiItemClasses}
                                                                id={item.id}
                                                                onClick={async () => {
                                                                    await setEquipmentInformation({
                                                                        ...equipmentInformation,
                                                                        equipment_width_unit: item.value
                                                                    });
                                                                    setShowWidthDropdownItems(false);
                                                                    refWidth.current.focus();
                                                                }}
                                                                ref={ref => refWidthPopupItems.current.push(ref)}
                                                            >
                                                                {
                                                                    item.name
                                                                }
                                                                {
                                                                    item.selected &&
                                                                    <FontAwesomeIcon className="dropdown-selected"
                                                                        icon={faCaretRight} />
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

                    <div className="select-box-container"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="select-box-wrapper">
                            <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Height
                            </div>
                            <input style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                paddingRight: (equipmentInformation?.equipment_height || '').trim().length > 0 ? 25 : 0
                            }}
                                tabIndex={7 + props.tabTimes} type="text"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.edit || 0) === 0
                                }
                                ref={refHeight}
                                onKeyDown={async (e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 70) {
                                        e.preventDefault();

                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_height_unit: 'ft'
                                        })
                                    } else if (key === 73) {
                                        e.preventDefault();
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_height_unit: 'in'
                                        })
                                    } else if (key === 38) {
                                        e.preventDefault();
                                        if (showHeightDropdownItems) {
                                            let selectedIndex = heightDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (heightDropdownItems.length - 1);
                                                    } else {
                                                        item.selected = index === (selectedIndex - 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_height_unit === item.value
                                                return item;
                                            }))

                                            await setShowHeightDropdownItems(true);
                                        }

                                        refHeightPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 40) {
                                        e.preventDefault();
                                        if (showHeightDropdownItems) {
                                            let selectedIndex = heightDropdownItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                    if (selectedIndex === (heightDropdownItems.length - 1)) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === (selectedIndex + 1)
                                                    }
                                                    return item;
                                                }))
                                            }
                                        } else {
                                            await setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                                item.selected = equipmentInformation.equipment_height_unit === item.value
                                                return item;
                                            }))

                                            await setShowHeightDropdownItems(true);
                                        }

                                        refHeightPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains('selected')) {
                                                r.scrollIntoView({
                                                    behavior: 'auto',
                                                    block: 'center',
                                                    inline: 'nearest'
                                                })
                                            }
                                            return true;
                                        });

                                    } else if (key === 27) {
                                        await setShowHeightDropdownItems(false);
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            equipment_height_unit: ''
                                        })
                                    } else if (key === 13) {
                                        if (showHeightDropdownItems && heightDropdownItems.findIndex(item => item.selected) > -1) {
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_height_unit: heightDropdownItems[heightDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowHeightDropdownItems(false);
                                            refHeight.current.focus();
                                        }
                                    } else if (key === 9) {
                                        e.preventDefault();

                                        if (showHeightDropdownItems) {
                                            await setEquipmentInformation({
                                                ...equipmentInformation,
                                                equipment_height_unit: heightDropdownItems[heightDropdownItems.findIndex(item => item.selected)].value
                                            });
                                            await setShowHeightDropdownItems(false);
                                            refHeight.current.focus();
                                        }

                                        validateEquipmentForSaving(e);
                                    } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {

                                    } else if (key === 8 || key === 46) {

                                    } else {
                                        e.preventDefault();
                                    }

                                    switch (key) {
                                        case 9: // tab
                                            e.preventDefault();
                                            if (showHeightDropdownItems) {
                                                await setEquipmentInformation({
                                                    ...equipmentInformation,
                                                    equipment_height_unit: heightDropdownItems[heightDropdownItems.findIndex(item => item.selected)].value
                                                });
                                                await setShowHeightDropdownItems(false);
                                                refHeight.current.focus();
                                            }

                                            validateEquipmentForSaving(e);
                                            break;

                                        default:
                                            break;
                                    }
                                }}

                                onInput={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_height: e.target.value
                                    })
                                }}
                                onChange={(e) => {
                                    setEquipmentInformation({
                                        ...equipmentInformation,
                                        equipment_height: e.target.value
                                    })
                                }}
                                value={equipmentInformation.equipment_height || ''}
                            />
                            {
                                (equipmentInformation?.equipment_height || '').trim().length > 0 &&
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '18px',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Mochi Med Oblique',
                                    fontWeight: 'bold'
                                }}>{equipmentInformation?.equipment_height_unit || ''}</div>
                            }
                            {
                                (equipmentInformation?.equipment_height || '').trim().length > 0 &&
                                <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                    if (showHeightDropdownItems) {
                                        setShowHeightDropdownItems(false);
                                    } else {
                                        setHeightDropdownItems(heightDropdownItems.map((item, index) => {
                                            item.selected = equipmentInformation.equipment_height_unit === item.value
                                            return item;
                                        }))

                                        window.setTimeout(() => {
                                            setShowHeightDropdownItems(true);
                                        }, 0)
                                    }

                                    refHeight.current.focus();
                                }} />
                            }
                        </div>
                        {
                            heightTransition((style, item) => item && (
                                <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-equipment-height"
                                    style={{
                                        ...style,
                                        left: '-100%',
                                        display: 'block'
                                    }}
                                    ref={refHeightDropDown}
                                >
                                    <div className="mochi-contextual-popup vertical below left">
                                        <div className="mochi-contextual-popup-content">
                                            <div className="mochi-contextual-popup-wrapper">
                                                {
                                                    heightDropdownItems.map((item, index) => {
                                                        const mochiItemClasses = classnames({
                                                            'mochi-item': true,
                                                            'selected': item.selected
                                                        });

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={mochiItemClasses}
                                                                id={item.id}
                                                                onClick={async () => {
                                                                    await setEquipmentInformation({
                                                                        ...equipmentInformation,
                                                                        equipment_height_unit: item.value
                                                                    });
                                                                    setShowHeightDropdownItems(false);
                                                                    refHeight.current.focus();
                                                                }}
                                                                ref={ref => refHeightPopupItems.current.push(ref)}
                                                            >
                                                                {
                                                                    item.name
                                                                }
                                                                {
                                                                    item.selected &&
                                                                    <FontAwesomeIcon className="dropdown-selected"
                                                                        icon={faCaretRight} />
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

            <div className='form-bordered-box' style={{ marginBottom: 10 }}>
                <div className='form-header'>
                    <div className='top-border top-border-left'></div>
                    <div className='top-border top-border-middle'></div>
                    <div className='top-border top-border-right'></div>
                </div>

                <div className="equipment-list-box">
                    {
                        (equipmentInformation?.carrier?.equipments_information || []).length > 0 &&
                        <div className="equipment-list-header">
                            <div className="equipment-list-col tcol equipment">Equipment</div>
                            <div className="equipment-list-col tcol units">Unit</div>
                            <div className="equipment-list-col tcol equipment_length">Length</div>
                            <div className="equipment-list-col tcol equipment_width">Width</div>
                            <div className="equipment-list-col tcol equipment_height">Height</div>
                        </div>
                    }

                    <div className="equipment-list-wrapper">
                        {
                            (equipmentInformation?.carrier?.equipments_information || []).map((eq, index) => {
                                const itemClasses = classnames({
                                    'equipment-list-item': true,
                                    'selected': eq.id === equipmentInformation.id
                                })
                                return (
                                    <div className='equipment-list-item' key={index} onClick={() => {
                                        setEquipmentInformation({
                                            ...equipmentInformation,
                                            id: eq.id,
                                            equipment: eq.equipment,
                                            equipment_id: eq.equipment.id,
                                            units: eq.units,
                                            equipment_length: eq.equipment_length,
                                            equipment_length_unit: eq.equipment_length_unit,
                                            equipment_width: eq.equipment_width,
                                            equipment_width_unit: eq.equipment_width_unit,
                                            equipment_height: eq.equipment_height,
                                            equipment_height_unit: eq.equipment_height_unit
                                        });

                                        refEquipment.current.focus();
                                    }}>
                                        <div className="equipment-list-col tcol equipment">{eq.equipment.name}</div>
                                        <div className="equipment-list-col tcol units">{eq.units}</div>
                                        <div
                                            className="equipment-list-col tcol equipment_length">{(eq.equipment_length || '') === '' ? '' : eq.equipment_length + ((eq.equipment_length_unit || '') === 'ft' ? '\'' : (eq.equipment_length_unit || '') === 'in' ? '"' : '')}</div>
                                        <div
                                            className="equipment-list-col tcol equipment_width">{(eq.equipment_width || '') === '' ? '' : eq.equipment_width + ((eq.equipment_width_unit || '') === 'ft' ? '\'' : (eq.equipment_width_unit || '') === 'in' ? '"' : '')}</div>
                                        <div
                                            className="equipment-list-col tcol equipment_height">{(eq.equipment_height || '') === '' ? '' : eq.equipment_height + ((eq.equipment_height_unit || '') === 'ft' ? '\'' : (eq.equipment_height_unit || '') === 'in' ? '"' : '')}</div>
                                        <div className="equipment-list-col tcol equipment-selected">

                                            {
                                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'carrier equipment info')?.pivot?.delete || 0) === 1) &&
                                                <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: 10 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to proceed?')) {
                                                            axios.post(props.serverUrl + '/deleteCarrierEquipment', {
                                                                id: eq.id,
                                                                carrier_id: equipmentInformation?.carrier?.id
                                                            }).then(res => {
                                                                if (res.data.result === 'OK') {
                                                                    setEquipmentInformation(equipmentInformation => {
                                                                        return {
                                                                            ...equipmentInformation,
                                                                            carrier: {
                                                                                ...(equipmentInformation?.carrier || {}),
                                                                                equipments_information: res.data.equipments_information
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }).catch(e => {
                                                                console.log(e);
                                                            })
                                                        }
                                                    }}
                                                />
                                            }

                                            {
                                                (eq.id === equipmentInformation.id) &&
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
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

    setSelectedCarrier,
})(EquipmentInformation)