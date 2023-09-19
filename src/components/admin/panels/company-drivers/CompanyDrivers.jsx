import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import $ from "jquery";
import axios from "axios";
import Draggable from "react-draggable";
import { useTransition, animated } from "react-spring";
import "./CompanyDrivers.css";
import MaskedInput from "react-text-mask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCalendarAlt, faCheck, faPencilAlt, faTrashAlt, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import moment from "moment";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import defaultLicenseImage from './../../../../img/id-card.svg';

import { MainForm, DriverMailingAddressForm, EmergencyContactForm, EmergencyContactList } from "./../../../company/forms";

import { SelectBox, DateInput } from "./../../../controls";

import { Documents, Contacts } from './../../../company/panels';

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

    setSelectedCompany,
    setSelectedCompanyDriver as setSelectedDriver,
    setSelectedDriverContact,
    setSelectedCompanyOperator as setSelectedOperator,
    setSelectedOperatorContact,
    setSelectedCarrier,
    setSelectedDriver as setSelectedCarrierDriver,
    setSelectedAgent,
    setSelectedAgentDriver
} from './../../../../actions';

const CompanyDrivers = props => {
    const refDriverInfoCode = useRef();
    const refDriverInfoName = useRef();
    const refDriverInfoEmail = useRef();

    const refMailingCode = useRef();
    const refMailingName = useRef();
    const refMailingAddress1 = useRef();
    const refMailingContactName = useRef();
    const refMailingContactNameDropDown = useRef();
    const refMailingContactNamePopupItems = useRef([]);
    const refMailingContactPhone = useRef();
    const refMailingContactPhonePopupItems = useRef([]);
    const refMailingContactEmail = useRef();
    const refMailingContactEmailPopupItems = useRef([]);
    const refCustomerMailingName = useRef();
    const refEmergencyContactRelationships = useRef();
    const refEmergencyContactName = useRef();
    const refEmergencyContactPhone = useRef();
    const refEmergencyContactEmail = useRef();
    const refEmergencyContactSearchFirstName = useRef();
    const refDriverLicenseNumber = useRef();
    const refDriverTractorNumber = useRef();
    const refDriverTrailerNumber = useRef();
    const refClasses = useRef();
    const refClassItems = useRef();
    const refClassPopupItems = useRef([]);
    const refClassDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setClassItems([])
        }
    });
    const refEndorsements = useRef();
    const refEndorsementPopupItems = useRef([]);
    const refEndorsementDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setEndorsementItems([])
        }
    });
    const refRestrictions = useRef();
    const refRestrictionPopupItems = useRef([]);
    const refRestrictionDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setRestrictionItems([])
        }
    });
    const refLicenseExpirationDate = useRef();
    const refLicenceExpirationDateDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsLicenseExpirationDateCalendarShown(false)
        }
    });
    const refDriverLicenseImage = useRef();
    const refMedicalCardExpirationDate = useRef();
    const refMedicalCardExpirationDateDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsMedicalCardExpirationDateCalendarShown(false)
        }
    });
    const refMedicalCardIssueDate = useRef();
    const refMedicalCardIssueDateDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setIsMedicalCardIssueDateCalendarShown(false)
        }
    });
    const refDriverMedicalCardImage = useRef();
    const refDriverTractorTypes = useRef();
    const refDriverTractorTypePopupItems = useRef([]);
    const refDriverTractorTypeDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setTractorTypeItems([])
        }
    });
    const refDriverTrailerTypes = useRef();
    const refDriverTrailerTypePopupItems = useRef([]);
    const refDriverTrailerTypeDropdown = useDetectClickOutside({
        onTriggered: async () => {
            await setTrailerTypeItems([])
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSavingDriver, setIsSavingDriver] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isSavingLicense, setIsSavingLicense] = useState(false);
    const [isSavingMedicalCard, setIsSavingMedicalCard] = useState(false);
    const [isSavingTractor, setIsSavingTractor] = useState(false);
    const [isSavingTrailer, setIsSavingTrailer] = useState(false);

    const [selectedDriver, setSelectedDriver] = useState({});
    const [selectedMailingAddress, setSelectedMailingAddress] = useState({});
    const [selectedContact, setSelectedContact] = useState({});
    const [showingContactList, setShowingContactList] = useState(true);
    const [selectedLicense, setSelectedLicense] = useState({});
    const [selectedMedicalCard, setSelectedMedicalCard] = useState({});
    const [selectedTractor, setSelectedTractor] = useState({});
    const [selectedTrailer, setSelectedTrailer] = useState({});

    const [endorsementItems, setEndorsementItems] = useState([]);
    const [classItems, setClassItems] = useState([]);
    const [restrictionItems, setRestrictionItems] = useState([]);
    const [tractorTypeItems, setTractorTypeItems] = useState([]);
    const [trailerTypeItems, setTrailerTypeItems] = useState([]);

    const [isLicenseExpirationDateCalendarShown, setIsLicenseExpirationDateCalendarShown] = useState(false);
    const [preSelectedLicenseExpirationDate, setPreSelectedLicenseExpirationDate] = useState(moment());

    const [isMedicalCardIssueDateCalendarShown, setIsMedicalCardIssueDateCalendarShown] = useState(false);
    const [preSelectedMedicalCardIssueDate, setPreSelectedMedicalCardIssueDate] = useState(moment());

    const [isMedicalCardExpirationDateCalendarShown, setIsMedicalCardExpirationDateCalendarShown] = useState(false);
    const [preSelectedMedicalCardExpirationDate, setPreSelectedMedicalCardExpirationDate] = useState(moment());

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    useEffect(() => {

        if ((selectedDriver?.id || 0) === 0) {
            if ((props.selectedDriverId || 0) > 0) {
                setIsLoading(true);
                axios.post(props.serverUrl + `/getDriverById`, { id: props.selectedDriverId }).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedDriver({ ...res.data.driver });
                        setSelectedMailingAddress({ ...res.data.driver?.mailing_address });
                        setSelectedContact((res.data.driver?.contacts || []).length > 0 ? res.data.driver?.contacts[0] : {});
                        setSelectedLicense({ ...res.data.driver?.license });
                        setSelectedMedicalCard({ ...res.data.driver?.medical_card });
                        setSelectedTractor({ ...res.data.driver?.tractor });
                        setSelectedTrailer({ ...res.data.driver?.trailer });
                    }
                }).catch(e => {
                    console.log('error getting driver by id', e);
                }).finally(() => {
                    setIsLoading(false);
                })
            }
        }

        refDriverInfoCode.current.focus({
            preventScroll: true,
        });
    }, []);

    const setInitialValues = () => {
        setSelectedDriver({});
        setSelectedMailingAddress({});
        setSelectedContact({});
        setShowingContactList(true);
        setSelectedLicense({});
        setSelectedMedicalCard({});
        setSelectedTractor({});
        setSelectedTrailer({});
    };

    const searchDriverInfoByCode = () => {
        if ((selectedDriver?.code || '') !== '') {
            axios.post(props.serverUrl + `/getDriverByCode`, {
                code: selectedDriver.code
            }).then(res => {
                if (res.data.result === 'OK') {


                    let mailing = { ...res.data.driver?.mailing_address };
                    let mailingContact = (res.data.driver?.contacts || []).find(x => x.id === res.data.driver?.mailing_contact_id);

                    if (mailingContact) {
                        mailing.contact_name = (mailingContact.first_name + ' ' + mailingContact.last_name).trim();
                        mailing.contact_phone = (res.data.driver?.mailing_contact_primary_phone || 'work') === 'work'
                            ? mailingContact?.phone_work || ''
                            : (res.data.driver?.mailing_contact_primary_phone || 'work') === 'fax'
                                ? mailingContact?.phone_work_fax || ''
                                : (res.data.driver?.mailing_contact_primary_phone || 'work') === 'mobile'
                                    ? mailingContact?.phone_mobile || ''
                                    : (res.data.driver?.mailing_contact_primary_phone || 'work') === 'direct'
                                        ? mailingContact?.phone_direct || ''
                                        : (res.data.driver?.mailing_contact_primary_phone || 'work') === 'other'
                                            ? mailingContact?.phone_other || ''
                                            : '';
                        mailing.ext = (res.data.driver?.mailing_contact_primary_phone || 'work') === 'work' ? mailingContact?.phone_ext || '' : '';
                        mailing.email = (res.data.driver?.mailing_contact_primary_email || 'work') === 'work'
                            ? mailingContact?.email_work || ''
                            : (res.data.driver?.mailing_contact_primary_email || 'work') === 'personal'
                                ? mailingContact?.email_personal || ''
                                : (res.data.driver?.mailing_contact_primary_email || 'work') === 'other'
                                    ? mailingContact?.email_other || ''
                                    : '';
                    }

                    setSelectedDriver({ ...res.data.driver, mailing_address: mailing });
                    setSelectedMailingAddress(mailing);
                    setSelectedContact((res.data.driver?.contacts || []).length > 0 ? res.data.driver?.contacts[0] : {});
                    setSelectedLicense({ ...res.data.driver?.license });
                    setSelectedMedicalCard({ ...res.data.driver?.medical_card });
                    setSelectedTractor({ ...res.data.driver?.tractor });
                    setSelectedTrailer({ ...res.data.driver?.trailer });

                    refDriverInfoName.current.focus();
                }
            }).catch(e => {
                console.log('error getting driver by code', e);
            })
        }
    };

    const validateDriverInfoForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingDriver(true);
        }
    };

    useEffect(() => {
        if (isSavingDriver) {

            let driver = {
                ...selectedDriver,
                mailing_address: null,
                contacts: [],
                license: null,
                tractor_info: null,
                trailer_info: null
            }

            if (props.subOrigin === 'driver' || props.subOrigin === 'operator') {
                driver.company_id = props.selectedParent.id;
            }

            if (props.subOrigin === 'carrier') {
                driver.carrier_id = props.selectedParent.id;
            }

            if (props.subOrigin === 'agent') {
                driver.agent_id = props.selectedParent.id;
            }

            if ((driver?.name || '') !== '' &&
                (driver?.address1 || '') !== '' &&
                (driver?.city || '') !== '' &&
                (driver?.state || '') !== '' &&
                (driver?.zip || '') !== '') {

                let first_name = driver.name.split(' ')[0].trim();
                let last_name = driver.name.substring(first_name.length).trim();

                driver.first_name = first_name;
                driver.last_name = last_name;

                axios.post(props.serverUrl + `/saveDriver`, { ...driver, sub_origin: props.subOrigin }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.driver) {
                            setSelectedDriver(prev => {
                                return {
                                    ...prev,
                                    id: res.data.driver.id,
                                    code: res.data.driver.code,
                                    contacts: res.data.driver?.contacts || []
                                }
                            })

                            switch (props.subOrigin) {
                                case 'driver':
                                    props.setSelectedCompany({
                                        drivers: (res.data.drivers || []).filter(x => x.owner_type === 'company'),
                                        component_id: props.componentId
                                    });

                                    props.setSelectedDriver({
                                        ...selectedDriver,
                                        id: res.data.driver.id,
                                        code: res.data.driver.code,
                                        contacts: res.data.driver?.contacts || [],
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'operator':
                                    props.setSelectedCompany({
                                        operators: (res.data.drivers || []).filter(x => x.owner_type === 'operator'),
                                        component_id: props.componentId
                                    });

                                    props.setSelectedOperator({
                                        ...selectedDriver,
                                        id: res.data.driver.id,
                                        code: res.data.driver.code,
                                        contacts: res.data.driver?.contacts || [],
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'carrier':
                                    props.setSelectedCarrier({
                                        drivers: (res.data.drivers || []).filter(x => x.owner_type === 'carrier'),
                                        component_id: props.componentId
                                    })

                                    props.setSelectedCarrierDriver({
                                        ...selectedDriver,
                                        id: res.data.driver.id,
                                        code: res.data.driver.code,
                                        contacts: [...res.data.contacts],
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'agent':
                                    props.setSelectedCarrier({
                                        drivers: (res.data.drivers || []).filter(x => x.owner_type === 'agent'),
                                        component_id: props.componentId
                                    })

                                    props.setSelectedAgentDriver({
                                        ...selectedDriver,
                                        id: res.data.driver.id,
                                        code: res.data.driver.code,
                                        contacts: [...res.data.contacts],
                                        component_id: props.componentId
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                        setIsSavingDriver(false);
                    } else {
                        setIsSavingDriver(false);
                    }
                }).catch(e => {
                    console.log('erros saving company driver', e);
                    setIsSavingDriver(false);
                })
            }

            setIsSavingDriver(false);
        }
    }, [isSavingDriver])

    const validateMailingAddressForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingMailingAddress(true);
        }
    };

    useEffect(() => {
        if (isSavingMailingAddress) {
            let mailing = { ...selectedDriver?.mailing_address };
            mailing.driver_id = selectedDriver?.id;

            if ((mailing?.driver_id || 0) > 0) {
                if ((mailing?.address1 || '') !== '' &&
                    (mailing?.city || '') !== '' &&
                    (mailing?.state || '') !== '' &&
                    (mailing?.zip || '') !== '' &&
                    (mailing?.remit_to_address_is_the_same || 0) !== 0) {
                    axios.post(props.serverUrl + `/saveDriverMailingAddress`, mailing).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedDriver(prev => {
                                return {
                                    ...prev,
                                    mailing_address: { ...res.data.mailing_address }
                                }
                            });

                            setSelectedMailingAddress(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        id: res.data.mailing_address?.id
                                    }
                                }
                            });
                        }
                        setIsSavingMailingAddress(false);
                    }).catch(e => {
                        console.log('error saving driver mailing address', e);
                        setIsSavingMailingAddress(false);
                    })
                }
            }

            setIsSavingMailingAddress(false);
        }
    }, [isSavingMailingAddress])

    const remitToAddressBtn = () => {
        if ((selectedDriver?.id || 0) > 0) {
            let mailing = {
                driver_id: selectedDriver?.id,
                address1: (selectedDriver?.address1 || ''),
                address2: (selectedDriver?.address2 || ''),
                city: (selectedDriver?.city || ''),
                state: (selectedDriver?.state || ''),
                zip: (selectedDriver?.zip || ''),
                contact_name: (selectedDriver?.contact_name || ''),
                contact_phone: (selectedDriver?.contact_phone || ''),
                ext: (selectedDriver?.ext || ''),
                email: '',
            }

            let contact = (selectedDriver?.contacts || []).find(x => x.priority === 1);

            if (contact) {
                mailing.contact_name = (contact.first_name + ' ' + contact.last_name).trim();
                mailing.contact_phone = (contact?.primary_phone || 'work') === 'work'
                    ? contact?.phone_work || ''
                    : (contact?.primary_phone || 'work') === 'fax'
                        ? contact?.phone_work_fax || ''
                        : (contact?.primary_phone || 'work') === 'mobile'
                            ? contact?.phone_mobile || ''
                            : (contact?.primary_phone || 'work') === 'direct'
                                ? contact?.phone_direct || ''
                                : (contact?.primary_phone || 'work') === 'other'
                                    ? contact?.phone_other || ''
                                    : '';
                mailing.ext = (contact?.primary_phone || 'work') === 'work' ? contact?.phone_ext || '' : '';
                mailing.email = (contact?.primary_email || 'work') === 'work'
                    ? contact?.email_work || ''
                    : (contact?.primary_email || 'work') === 'personal'
                        ? contact?.email_personal || ''
                        : (contact?.primary_email || 'work') === 'other'
                            ? contact?.email_other || ''
                            : '';
            }

            setSelectedDriver(prev => {
                return {
                    ...prev,
                    mailing_address: mailing,
                    mailing_contact_id: contact?.id,
                    mailing_contact_primary_phone: contact?.primary_phone,
                    mailing_contact_primary_email: contact?.primary_email,
                    remit_to_address_is_the_same: 1
                }
            })

            setSelectedMailingAddress(mailing);

            axios.post(props.serverUrl + `/saveDriverMailingAddress`,
                {
                    ...mailing,
                    mailing_contact_id: contact?.id,
                    mailing_contact_primary_phone: contact?.primary_phone,
                    mailing_contact_primary_email: contact?.primary_email,
                }).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedDriver(prev => {
                            return {
                                ...prev,
                                mailing_address: { ...res.data.mailing_address }
                            }
                        });
                    }
                    setIsSavingMailingAddress(false);
                }).catch(e => {
                    console.log('error saving driver mailing address', e);
                    setIsSavingMailingAddress(false);
                })
        } else {
            window.alert('You must select a driver first!');
        }
    };

    const mailingAddressClearBtn = () => {
        setSelectedMailingAddress({});
        refMailingAddress1.current.focus();

        if ((selectedDriver?.id || 0) > 0) {
            axios.post(props.serverUrl + `/deleteDriverMailingAddress`, {
                driver_id: selectedDriver.id
            }).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedDriver(prev => {
                        return {
                            ...prev,
                            mailing_address: null,
                            remit_to_address_is_the_same: 0,
                            mailing_contact_id: null,
                            mailing_contact_primary_phone: 'work',
                            mailing_contact_primary_email: 'work'
                        }
                    });


                }
            }).catch(e => {
                console.log('error removing driver mailing address', e);
            })
        }
    };

    const validateEmergencyContactForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingContact(true);
        }
    };

    useEffect(() => {
        if (isSavingContact) {
            if ((selectedDriver?.id || 0) > 0) {

                let contact = { ...selectedContact, driver_id: selectedDriver.id };

                if ((contact?.name || '') !== '' &&
                    // (contact?.relationship || '') !== '' &&
                    (contact?.priority || '') !== '' &&
                    (contact?.address1 || '') !== '' &&
                    (contact?.city || '') !== '' &&
                    (contact?.state || '') !== '' &&
                    (contact?.zip_code || '') !== '' &&
                    ((contact.phone_work || '').trim() !== '' ||
                        (contact.phone_work_fax || '').trim() !== '' ||
                        (contact.phone_mobile || '').trim() !== '' ||
                        (contact.phone_direct || '').trim() !== '' ||
                        (contact.phone_other || '').trim() !== '')) {

                    let names = contact.name.split(' ');
                    let first = names[0];
                    let last = (names || []).filter((x, i) => i > 0).join(' ');

                    contact.first_name = first;
                    contact.last_name = last;

                    axios.post(props.serverUrl + `/saveDriverEmergencyContact`, contact).then(res => {
                        if (res.data.result === 'OK') {

                            if (res.data.contact) {
                                setSelectedContact(prev => {
                                    return {
                                        ...prev,
                                        id: res.data.contact.id
                                    }
                                })

                                setSelectedDriver(prev => {
                                    return {
                                        ...prev,
                                        contacts: [...res.data.contacts]
                                    }
                                })

                                switch (props.subOrigin) {
                                    case 'driver':
                                        props.setSelectedCompany({
                                            drivers: (res.data.drivers || []).filter(x => x.owner_type === 'company'),
                                            component_id: props.componentId
                                        });

                                        props.setSelectedDriver({
                                            ...selectedDriver,
                                            id: res.data.driver.id,
                                            code: res.data.driver.code,
                                            contacts: [...res.data.contacts],
                                            component_id: props.componentId
                                        });
                                        break;

                                    case 'operator':
                                        props.setSelectedCompany({
                                            operators: (res.data.drivers || []).filter(x => x.owner_type === 'operator'),
                                            component_id: props.componentId
                                        });

                                        props.setSelectedOperator({
                                            ...selectedDriver,
                                            id: res.data.driver.id,
                                            code: res.data.driver.code,
                                            contacts: [...res.data.contacts],
                                            component_id: props.componentId
                                        });
                                        break;

                                    case 'carrier':
                                        props.setSelectedCarrier({
                                            drivers: (res.data.drivers || []).filter(x => x.owner_type === 'carrier'),
                                            component_id: props.componentId
                                        })

                                        props.setSelectedCarrierDriver({
                                            ...selectedDriver,
                                            id: res.data.driver.id,
                                            code: res.data.driver.code,
                                            contacts: [...res.data.contacts],
                                            component_id: props.componentId
                                        });
                                        break;
                                    case 'agent':
                                        props.setSelectedCarrier({
                                            drivers: (res.data.drivers || []).filter(x => x.owner_type === 'agent'),
                                            component_id: props.componentId
                                        })

                                        props.setSelectedAgentDriver({
                                            ...selectedDriver,
                                            id: res.data.driver.id,
                                            code: res.data.driver.code,
                                            contacts: [...res.data.contacts],
                                            component_id: props.componentId
                                        });
                                        break;
                                    default:
                                        break;
                                }

                                refEmergencyContactName.current.focus()
                            }

                        }

                        setIsSavingContact(false);
                    }).catch(e => {
                        console.log('error saving driver emergency contact', e);
                    }).finally(() => {
                        setIsSavingContact(false);
                    });
                } else {
                    refDriverLicenseNumber.current.focus();
                }
            } else {
                refDriverLicenseNumber.current.focus();
            }
            setIsSavingContact(false);
        }
    }, [isSavingContact])

    const searchEmergencyContactBtnClick = () => { };

    const contactItemDoubleClick = (contact) => {
        let panel = {
            panelName: `${props.panelName}-contacts`,
            component: <Contacts
                title='Contacts'
                tabTimes={2258000 + props.tabTimes}
                panelName={`${props.panelName}-contacts`}
                savingContactUrl={`/saveDriverEmergencyContact`}
                deletingContactUrl={`/deleteDriverEmergencyContact`}
                uploadAvatarUrl={`/uploadDriverEmergencyContactAvatar`}
                removeAvatarUrl={`/removeDriverEmergencyContactAvatar`}
                permissionName='customer contacts'
                origin={props.origin}
                owner={props.subOrigin}
                // isEditingContact={true}
                
                
                componentId={moment().format('x')}

                contactSearchCustomer={{
                    ...selectedDriver,
                    selectedContact: { ...contact }
                }}
            />
        }

        openPanel(panel, props.origin);
    };

    const validateDriverLicenseToSave = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingLicense(true);
        }
    }

    useEffect(() => {
        if (isSavingLicense) {
            if ((selectedDriver?.id || 0) > 0) {
                let license = { ...selectedLicense, driver_id: selectedDriver.id };

                if ((selectedLicense?.license_number || '') !== '' &&
                    (selectedLicense?.state || '') !== '' &&
                    (selectedLicense?.class_id || 0) > 0 &&
                    (selectedLicense?.endorsement_id || 0) > 0 &&
                    (selectedLicense?.expiration_date || '') !== '' &&
                    (selectedLicense?.restriction_id || 0) > 0) {

                    axios.post(props.serverUrl + `/saveDriverLicense`, license).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedLicense(prev => {
                                return {
                                    ...prev,
                                    id: res.data.license.id
                                }
                            })
                        }

                        setIsSavingLicense(false);
                    }).catch(e => {
                        console.log('error saving driver license', e);
                        setIsSavingLicense(false);
                    })
                } else {
                    setIsSavingLicense(false);
                }
            } else {
                setIsSavingLicense(false);
            }
        }
    }, [isSavingLicense])

    const driverLicenseImageChange = (e) => {
        let files = e.target.files;
        const maxSize = 1048576 * 2;

        if (files[0].size > maxSize) {
            window.alert("Selected image is too large, please select an image below 2mb");
            return;
        }

        let formData = new FormData();
        formData.append("image", files[0]);
        formData.append("license_id", selectedLicense?.id);
        formData.append("license_number", selectedLicense?.license_number);
        formData.append("state", selectedLicense?.state);
        formData.append("cdl", selectedLicense?.cdl);
        formData.append("class_id", selectedLicense?.class_id);
        formData.append("endorsement_id", selectedLicense?.endorsement_id);
        formData.append("expiration_date", selectedLicense?.expiration_date);
        formData.append("restriction_id", selectedLicense?.restriction_id);

        axios.post(props.serverUrl + `/uploadDriverLicenseImage`, formData, {})
            .then(async res => {
                if (res.data.result === "OK") {
                    setSelectedLicense(prev => {
                        return {
                            ...prev,
                            image: res.data.image
                        }
                    })
                }
                refDriverLicenseImage.current.value = "";
            })
            .catch((err) => {
                console.log("error changing license image", err);
                refDriverLicenseImage.current.value = "";
            });
    }

    const licenceUploadImageBtnClass = classnames({
        'mochi-button': true,
        'disabled': ((selectedDriver?.id || 0) === 0 ||
            (selectedLicense?.license_number || '') === '' ||
            (selectedLicense?.state || '') === '' ||
            (selectedLicense?.class_id || 0) === 0 ||
            (selectedLicense?.endorsement_id || 0) === 0 ||
            (selectedLicense?.expiration_date || '') === '' ||
            (selectedLicense?.restriction_id || 0) === 0)
    })

    const validateDriverMedicalCardToSave = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingMedicalCard(true);
        }
    }

    useEffect(() => {
        if (isSavingMedicalCard) {
            if ((selectedDriver?.id || 0) > 0) {
                let card = { ...selectedMedicalCard, driver_id: selectedDriver.id };

                if ((card?.issue_date || '') !== '' &&
                    (card?.expiration_date || '') !== '') {

                    axios.post(props.serverUrl + `/saveDriverMedicalCard`, card).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedMedicalCard(prev => {
                                return {
                                    ...prev,
                                    id: res.data.card.id
                                }
                            })
                        }

                        setIsSavingMedicalCard(false);
                    }).catch(e => {
                        console.log('error saving driver medical card', e);
                        setIsSavingMedicalCard(false);
                    })
                } else {
                    setIsSavingMedicalCard(false);
                }
            } else {
                setIsSavingMedicalCard(false);
            }
        }
    }, [isSavingMedicalCard])

    const driverMedicalCardImageChange = (e) => {
        let files = e.target.files;
        const maxSize = 1048576 * 2;

        if (files[0].size > maxSize) {
            window.alert("Selected image is too large, please select an image below 2mb");
            return;
        }

        let formData = new FormData();
        formData.append("image", files[0]);
        formData.append("medical_card_id", selectedMedicalCard?.id);
        formData.append("issue_date", selectedMedicalCard?.issue_date);
        formData.append("expiration_date", selectedMedicalCard?.expiration_date);

        axios.post(props.serverUrl + `/uploadDriverMedicalCardImage`, formData, {})
            .then(async res => {
                if (res.data.result === "OK") {
                    setSelectedMedicalCard(prev => {
                        return {
                            ...prev,
                            image: res.data.image
                        }
                    })
                }
                refDriverMedicalCardImage.current.value = "";
            })
            .catch((err) => {
                console.log("error changing medical card image", err);
                refDriverMedicalCardImage.current.value = "";
            });
    }

    const medicalCardUploadImageBtnClass = classnames({
        'mochi-button': true,
        'disabled': ((selectedDriver?.id || 0) === 0 ||
            (selectedMedicalCard?.issue_date || '') === '' ||
            (selectedMedicalCard?.expiration_date || '') === '')
    })

    const validateDriverTractorToSave = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingTractor(true);
        }
    }

    useEffect(() => {
        if (isSavingTractor) {
            if ((selectedDriver?.id || 0) > 0) {
                let tractor = { ...selectedTractor, driver_id: selectedDriver.id };

                if ((tractor?.plate_state || '') !== '' &&
                    (tractor?.plate_number || '') !== '' &&
                    (tractor?.year || '') !== '' &&
                    (tractor?.make || '') !== '' &&
                    (tractor?.model || '') !== '' &&
                    (tractor?.vin || '') !== '' &&
                    (tractor?.color || '') !== '' &&
                    (tractor?.type_id || 0) > 0) {

                    axios.post(props.serverUrl + `/saveDriverTractor`, tractor).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedTractor(prev => {
                                return {
                                    ...prev,
                                    id: res.data.tractor.id,
                                    number: res.data.tractor.number
                                }
                            })
                        }

                        setIsSavingTractor(false);
                    }).catch(e => {
                        console.log('error saving company driver tractor', e);
                        setIsSavingTractor(false);
                    })

                } else {
                    setIsSavingTractor(false);
                }

            } else {
                setIsSavingTractor(false);
            }
        }
    }, [isSavingTractor])

    const validateDriverTrailerToSave = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            setIsSavingTrailer(true);
        }
    }

    useEffect(() => {
        if (isSavingTrailer) {
            if ((selectedDriver?.id || 0) > 0) {
                let trailer = { ...selectedTrailer, driver_id: selectedDriver.id };

                if ((trailer?.plate_state || '') !== '' &&
                    (trailer?.plate_number || '') !== '' &&
                    (trailer?.year || '') !== '' &&
                    (trailer?.make || '') !== '' &&
                    (trailer?.model || '') !== '' &&
                    (trailer?.vin || '') !== '' &&
                    (trailer?.length || '') !== '' &&
                    (trailer?.width || '') !== '' &&
                    (trailer?.height || '') !== '' &&
                    (trailer?.type_id || 0) > 0) {

                    axios.post(props.serverUrl + `/saveDriverTrailer`, trailer).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedTrailer(prev => {
                                return {
                                    ...prev,
                                    id: res.data.trailer.id,
                                    number: res.data.trailer.number,
                                    length: res.data.trailer.length,
                                    width: res.data.trailer.width,
                                    height: res.data.trailer.height
                                }
                            })
                        }

                        setIsSavingTrailer(false);
                    }).catch(e => {
                        console.log('error saving company driver trailer', e);
                        setIsSavingTrailer(false);
                    })

                } else {
                    setIsSavingTrailer(false);
                }

            } else {
                setIsSavingTrailer(false);
            }
        }
    }, [isSavingTrailer])

    useEffect(() => {
        if ((props.subOrigin || 'driver') === 'driver') {
            if ((props.selectedDriver?.component_id || "") !== props.componentId) {
                if ((selectedDriver?.id || 0) > 0 && (props.selectedDriver?.id || 0) > 0 && selectedDriver.id === props.selectedDriver.id) {
                    setSelectedDriver(prev => {
                        return {
                            ...prev,
                            ...props.selectedDriver,
                        };
                    });
                }
            }
        }

        if ((props.subOrigin || 'driver') === 'operator') {
            if ((props.selectedOperator?.component_id || "") !== props.componentId) {
                if ((selectedDriver?.id || 0) > 0 && (props.selectedOperator?.id || 0) > 0 && selectedDriver.id === props.selectedOperator.id) {
                    setSelectedDriver(prev => {
                        return {
                            ...prev,
                            ...props.selectedOperator,
                        };
                    });
                }
            }
        }

    }, [props.selectedDriver, props.selectedOperator])

    useEffect(() => {
        if ((props.subOrigin || 'driver') === 'driver') {
            if ((props.selectedDriverContact?.component_id || "") !== props.componentId) {
                if ((selectedContact?.id || 0) > 0 && (props.selectedDriverContact?.id || 0) > 0 && selectedContact.id === props.selectedDriverContact.id) {
                    setSelectedContact(prev => {
                        return {
                            ...prev,
                            ...props.selectedDriverContact,
                        };
                    });
                }
            }
        }

        if ((props.subOrigin || 'driver') === 'operator') {
            if ((props.selectedOperatorContact?.component_id || "") !== props.componentId) {
                if ((selectedContact?.id || 0) > 0 && (props.selectedOperatorContact?.id || 0) > 0 && selectedContact.id === props.selectedOperatorContact.id) {
                    setSelectedContact(prev => {
                        return {
                            ...prev,
                            ...props.selectedOperatorContact,
                        };
                    });
                }
            }
        }

    }, [props.selectedDriverContact, props.selectedOperatorContact])

    const licenseAddDocumentBtnClick = (e) => {
        let panel = {
            panelName: `${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-license`,
            component: (
                <Documents
                    title="Documents"
                    tabTimes={310236 + props.tabTimes}
                    panelName={`${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-license`}
                    origin={props.origin}
                    suborigin={`company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-license`}
                    
                    
                    componentId={moment().format("x")}
                    selectedOwner={{ ...selectedLicense }}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format("MM/DD/YYYY"),
                    }}
                    savingDocumentUrl={`/saveDriverLicenseDocument`}
                    deletingDocumentUrl={`/deleteDriverLicenseDocument`}
                    savingDocumentNoteUrl={`/saveDriverLicenseDocumentNote`}
                    deletingDocumentNoteUrl={`/deleteDriverLicenseDocumentNote`}
                    serverDocumentsFolder={`/company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-license-documents/`}
                    permissionName={`company ${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'} documents`}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const medicalCardAddDocumentBtnClick = (e) => {
        let panel = {
            panelName: `${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-medical-card`,
            component: (
                <Documents
                    title="Documents"
                    tabTimes={310236 + props.tabTimes}
                    panelName={`${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-medical-card`}
                    origin={props.origin}
                    suborigin={`company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-medical-card`}
                    
                    
                    componentId={moment().format("x")}
                    selectedOwner={{ ...selectedMedicalCard }}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format("MM/DD/YYYY"),
                    }}
                    savingDocumentUrl={`/saveDriverMedicalCardDocument`}
                    deletingDocumentUrl={`/deleteDriverMedicalCardDocument`}
                    savingDocumentNoteUrl={`/saveDriverMedicalCardDocumentNote`}
                    deletingDocumentNoteUrl={`/deleteDriverMedicalCardDocumentNote`}
                    serverDocumentsFolder={`/company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-medical-card-documents/`}
                    permissionName={`company ${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'} documents`}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const tractorAddDocumentBtnClick = (e) => {
        let panel = {
            panelName: `${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-tractor`,
            component: (
                <Documents
                    title="Documents"
                    tabTimes={310236 + props.tabTimes}
                    panelName={`${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-tractor`}
                    origin={props.origin}
                    suborigin={`company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-tractor`}
                    
                    
                    componentId={moment().format("x")}
                    selectedOwner={{ ...selectedTractor }}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format("MM/DD/YYYY"),
                    }}
                    savingDocumentUrl={`/saveDriverTractorDocument`}
                    deletingDocumentUrl={`/deleteDriverTractorDocument`}
                    savingDocumentNoteUrl={`/saveDriverTractorDocumentNote`}
                    deletingDocumentNoteUrl={`/deleteDriverTractorDocumentNote`}
                    serverDocumentsFolder={`/company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-tractor-documents/`}
                    permissionName={`company ${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'} documents`}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const trailerAddDocumentBtnClick = (e) => {
        let panel = {
            panelName: `${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-trailer`,
            component: (
                <Documents
                    title="Documents"
                    tabTimes={310236 + props.tabTimes}
                    panelName={`${props.panelName}-documents-company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-trailer`}
                    origin={props.origin}
                    suborigin={`company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-trailer`}
                    
                    
                    componentId={moment().format("x")}
                    selectedOwner={{ ...selectedTrailer }}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format("MM/DD/YYYY"),
                    }}
                    savingDocumentUrl={`/saveDriverTrailerDocument`}
                    deletingDocumentUrl={`/deleteDriverTrailerDocument`}
                    savingDocumentNoteUrl={`/saveDriverTrailerDocumentNote`}
                    deletingDocumentNoteUrl={`/deleteDriverTrailerDocumentNote`}
                    serverDocumentsFolder={`/company-${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'}-trailer-documents/`}
                    permissionName={`company ${(props.subOrigin || 'driver') === 'operator' ? 'operator' : 'driver'} documents`}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const licenseAddDocumentBtnClasses = classnames({
        'mochi-button': true,
        'disabled': (selectedLicense?.id || 0) === 0
    })

    const medicalCardAddDocumentBtnClasses = classnames({
        'mochi-button': true,
        'disabled': (selectedMedicalCard?.id || 0) === 0
    })

    const tractorAddDocumentBtnClasses = classnames({
        'mochi-button': true,
        'disabled': (selectedTractor?.id || 0) === 0
    })

    const trailerAddDocumentBtnClasses = classnames({
        'mochi-button': true,
        'disabled': (selectedTrailer?.id || 0) === 0
    })

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

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper" style={{
                            position: 'absolute',
                            flexDirection: 'column'
                        }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="company-driver-container">
                <MainForm
                    formTitle={`Driver info`}
                    formButtons={[
                        {
                            title: "Search",
                            onClick: () => { },
                            isEnabled: true,
                        },
                        {
                            title: "Clear",
                            onClick: () => {
                                setInitialValues();
                                refDriverInfoCode.current.focus();
                            },
                            isEnabled: true,
                        },
                    ]}
                    refs={{
                        refCode: refDriverInfoCode,
                        refName: refDriverInfoName,
                        refEmail: refDriverInfoEmail,
                    }}
                    tabTimesFrom={1}
                    tabTimes={props.tabTimes}
                    searchByCode={searchDriverInfoByCode}
                    validateForSaving={validateDriverInfoForSaving}
                    selectedParent={selectedDriver}
                    setSelectedParent={setSelectedDriver}
                    fields={[
                        'code',
                        'name',
                        'address1',
                        'address2',
                        'city',
                        'state',
                        'zip',
                        'contact',
                        'phone',
                        'ext',
                        'email',
                        'notes'
                    ]}
                    triggerFields={['notes']}
                />

                <div className="form-bordered-box drivers-license-info">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">{(props.subOrigin || 'driver') === 'operator' ? 'Operator' : 'Driver'}'s License Info</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={licenseAddDocumentBtnClasses} onClick={(e) => { licenseAddDocumentBtnClick(e) }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="mochi-button" onClick={() => {
                                setSelectedLicense({});
                                refDriverLicenseNumber.current.focus();

                                if ((selectedLicense?.id || 0) > 0) {
                                    axios.post(props.serverUrl + `/deleteDriverLicense`, {
                                        id: selectedLicense.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {

                                        }
                                    }).catch(e => {
                                        console.log('error removing driver license', e);
                                    });
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-col" style={{ flexGrow: 1 }}>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input
                                    tabIndex={props.tabTimes + 30}
                                    type="text"
                                    placeholder="Driver License Number"
                                    style={{
                                        textTransform: "uppercase",
                                    }}
                                    ref={refDriverLicenseNumber}
                                    onChange={e => {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                license_number: e.target.value,
                                            }
                                        })
                                    }}
                                    value={selectedLicense?.license_number || ""}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container state">
                                <input
                                    tabIndex={props.tabTimes + 31}
                                    type="text"
                                    placeholder="State"
                                    maxLength={2}
                                    style={{
                                        textTransform: "uppercase",
                                    }}
                                    onChange={e => {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                state: e.target.value,
                                            }
                                        })
                                    }}
                                    value={selectedLicense?.state || ""}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-toggle-container">
                                <input type="checkbox"
                                    id={props.panelName + '-cbox-company-driver-license-cdl-btn'}
                                    onChange={e => {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                cdl: e.target.checked ? 1 : 0
                                            }
                                        })
                                    }}
                                    checked={(selectedLicense?.cdl || 0) === 1} />
                                <label htmlFor={props.panelName + '-cbox-company-driver-license-cdl-btn'}>
                                    <div className="label-text">CDL</div>
                                    <div className="input-toggle-btn"></div>
                                </label>
                            </div>
                            <div className="form-h-sep"></div>
                            <SelectBox
                                placeholder="Class"
                                popupId="class"
                                tabIndex={props.tabTimes + 32}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    textTransform: 'uppercase'
                                }}
                                refs={{
                                    refInput: refClasses,
                                    refPopupItems: refClassPopupItems,
                                    refDropdown: refClassDropdown,
                                }}
                                readOnly={false}
                                isDropdownEnabled={true}
                                popupPosition="vertical below"
                                onEnter={async e => {
                                    if (classItems.length > 0 && classItems.findIndex(item => item.selected) > -1) {
                                        let item = classItems[classItems.findIndex(item => item.selected)];

                                        await setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                class: item,
                                                class_id: item.id
                                            }
                                        })

                                        // validateDriverLicenseToSave({ keyCode: 9 });
                                        setClassItems([]);
                                        refClasses.current.focus();
                                    }
                                }}
                                onTab={async e => {
                                    let item = classItems[classItems.findIndex(item => item.selected)];

                                    await setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            class: item,
                                            class_id: item.id
                                        }
                                    })

                                    // validateDriverLicenseToSave({ keyCode: 9 });
                                    setClassItems([]);
                                    refClasses.current.focus();
                                }}
                                onBlur={e => {
                                    if ((selectedLicense?.class?.id || 0) === 0) {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                class: {},
                                                class_id: null
                                            }
                                        })
                                    }
                                }}
                                onInput={e => {
                                    let _class = selectedLicense?.class || {};
                                    _class.id = 0;
                                    _class.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            class: _class
                                        }
                                    })

                                    if (e.target.value.trim() === "") {
                                        setClassItems([]);
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseClasses", {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === "OK") {
                                                setClassItems(res.data.classes.map((item, index) => {
                                                    item.selected = (selectedDriver?.license?.class?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedDriver.license.class.id
                                                    return item;
                                                }));
                                            }
                                        }).catch(e => {
                                            console.log("error getting classes", e);
                                        })
                                    }
                                }}
                                onChange={e => {
                                    let _class = selectedLicense?.class || {};
                                    _class.id = 0;
                                    _class.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            class: _class
                                        }
                                    })
                                }}
                                value={selectedLicense?.class?.name || ""}
                                items={classItems}
                                getItems={() => {
                                    axios.post(props.serverUrl + "/getLicenseClasses").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setClassItems(res.data.classes.map((item, index) => {
                                                item.selected = (selectedDriver?.license?.class?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedDriver.license.class.id
                                                return item;
                                            }));

                                            refEndorsementPopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting classes", e);
                                    });
                                }}
                                setItems={setClassItems}
                                onDropdownClick={e => {
                                    if ((selectedLicense?.class?.id || 0) === 0 && (selectedLicense?.class?.name || "") !== "") {
                                        axios.post(props.serverUrl + "/getLicenseClasses", {
                                            name: selectedLicense?.class?.name
                                        }).then(async res => {
                                            if (res.data.result === "OK") {
                                                await setClassItems(res.data.classes.map((item, index) => {
                                                    item.selected = (selectedLicense?.class?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.class.id
                                                    return item;
                                                }));

                                                refEndorsementPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting classes", e);
                                        });
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseClasses").then(async res => {
                                            if (res.data.result === "OK") {
                                                await setClassItems(res.data.classes.map((item, index) => {
                                                    item.selected = (selectedLicense?.class?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.class.id
                                                    return item;
                                                }));

                                                refEndorsementPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting classes", e);
                                        });
                                    }
                                }}
                                onPopupClick={item => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            class: item,
                                            class_id: item.id
                                        }
                                    })

                                    // validateDriverLicenseToSave({ keyCode: 9 });

                                    setClassItems([]);
                                    refClasses.current.focus();
                                }}
                            />
                            <div className="form-h-sep"></div>
                            <SelectBox
                                placeholder="Endorsement"
                                popupId="endorsement"
                                tabIndex={props.tabTimes + 33}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    textTransform: 'uppercase'
                                }}
                                refs={{
                                    refInput: refEndorsements,
                                    refPopupItems: refEndorsementPopupItems,
                                    refDropdown: refEndorsementDropdown,
                                }}
                                readOnly={false}
                                isDropdownEnabled={true}
                                popupPosition="vertical below"
                                onEnter={async e => {
                                    if (endorsementItems.length > 0 && endorsementItems.findIndex(item => item.selected) > -1) {
                                        let item = endorsementItems[endorsementItems.findIndex(item => item.selected)];

                                        await setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                endorsement: item,
                                                endorsement_id: item.id
                                            }
                                        })

                                        // validateDriverLicenseToSave({ keyCode: 9 });
                                        setEndorsementItems([]);
                                        refEndorsements.current.focus();
                                    }
                                }}
                                onTab={async e => {
                                    let item = endorsementItems[endorsementItems.findIndex(item => item.selected)];

                                    await setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            endorsement: item,
                                            endorsement_id: item.id
                                        }
                                    })

                                    // validateDriverLicenseToSave({ keyCode: 9 });
                                    setEndorsementItems([]);
                                    refEndorsements.current.focus();
                                }}
                                onBlur={e => {
                                    if ((selectedLicense?.endorsement?.id || 0) === 0) {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                endorsement: {},
                                                endorsement_id: null
                                            }
                                        })
                                    }
                                }}
                                onInput={e => {
                                    let endorsement = selectedLicense?.endorsement || {};
                                    endorsement.id = 0;
                                    endorsement.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            endorsement: endorsement
                                        }
                                    })

                                    if (e.target.value.trim() === "") {
                                        setEndorsementItems([]);
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseEndorsements", {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === "OK") {
                                                setEndorsementItems(res.data.endorsements.map((item, index) => {
                                                    item.selected = (selectedDriver?.license?.endorsement?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedDriver.license.endorsement.id
                                                    return item;
                                                }));
                                            }
                                        }).catch(e => {
                                            console.log("error getting endorments", e);
                                        })
                                    }
                                }}
                                onChange={e => {
                                    let endorsement = selectedLicense?.endorsement || {};
                                    endorsement.id = 0;
                                    endorsement.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            endorsement: endorsement
                                        }
                                    })
                                }}
                                value={selectedLicense?.endorsement?.name || ""}
                                items={endorsementItems}
                                getItems={() => {
                                    axios.post(props.serverUrl + "/getLicenseEndorsements").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setEndorsementItems(res.data.endorsements.map((item, index) => {
                                                item.selected = (selectedDriver?.license?.endorsement?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedDriver.license.endorsement.id
                                                return item;
                                            }));

                                            refEndorsementPopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting endorsements", e);
                                    });
                                }}
                                setItems={setEndorsementItems}
                                onDropdownClick={e => {
                                    if ((selectedLicense?.endorsement?.id || 0) === 0 && (selectedLicense?.endorsement?.name || "") !== "") {
                                        axios.post(props.serverUrl + "/getLicenseEndorsements", {
                                            name: selectedLicense?.endorsement?.name
                                        }).then(async res => {
                                            if (res.data.result === "OK") {
                                                await setEndorsementItems(res.data.endorsements.map((item, index) => {
                                                    item.selected = (selectedLicense?.endorsement?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.endorsement.id
                                                    return item;
                                                }));

                                                refEndorsementPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting endorsements", e);
                                        });
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseEndorsements").then(async res => {
                                            if (res.data.result === "OK") {
                                                await setEndorsementItems(res.data.endorsements.map((item, index) => {
                                                    item.selected = (selectedLicense?.endorsement?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.endorsement.id
                                                    return item;
                                                }));

                                                refEndorsementPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting endorsements", e);
                                        });
                                    }
                                }}
                                onPopupClick={item => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            endorsement: item,
                                            endorsement_id: item.id
                                        }
                                    })

                                    // validateDriverLicenseToSave({ keyCode: 9 });

                                    setEndorsementItems([]);
                                    refEndorsements.current.focus();
                                }}
                            />
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <DateInput
                                placeholder="Expiration Date"
                                popupId="driver-license-expiration-date"
                                tabIndex={props.tabTimes + 34}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                refs={{
                                    refInputDate: refLicenseExpirationDate,
                                    refCalendarDropDown: refLicenceExpirationDateDropDown
                                }}
                                readOnly={false}
                                onKeyDown={() => { }}
                                onBlur={(formatted) => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: formatted
                                        }
                                    })
                                }}
                                onInput={(value) => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: value
                                        }
                                    })
                                }}
                                onChange={(value) => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: value
                                        }
                                    })
                                }}
                                value={selectedLicense?.expiration_date || ""}
                                preDay={preSelectedLicenseExpirationDate}
                                setPreDay={setPreSelectedLicenseExpirationDate}
                                isCalendarShown={isLicenseExpirationDateCalendarShown}
                                setIsCalendarShown={setIsLicenseExpirationDateCalendarShown}
                                popupPosition="vertical below"
                                onDropDownClick={() => {
                                    if (isLicenseExpirationDateCalendarShown) {
                                        setIsLicenseExpirationDateCalendarShown(false);
                                    } else {
                                        setIsLicenseExpirationDateCalendarShown(true);

                                        if (moment((selectedLicense?.expiration_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedLicense?.expiration_date || "").trim()) {
                                            setPreSelectedLicenseExpirationDate(moment(selectedLicense?.expiration_date, "MM/DD/YYYY"));
                                        } else {
                                            setPreSelectedLicenseExpirationDate(moment());
                                        }
                                    }

                                }}
                                calendarValue={moment((selectedLicense?.expiration_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedLicense?.expiration_date || "").trim() ? moment(selectedLicense?.expiration_date, "MM/DD/YYYY") : moment()}
                                onCalendarChange={(day) => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: day.format("MM/DD/YYYY"),
                                        }
                                    });
                                }}
                            />
                            <div className="form-h-sep"></div>
                            <SelectBox
                                placeholder="Restriction"
                                popupId="restriction"
                                tabIndex={props.tabTimes + 35}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    textTransform: 'uppercase'
                                }}
                                refs={{
                                    refInput: refRestrictions,
                                    refPopupItems: refRestrictionPopupItems,
                                    refDropdown: refRestrictionDropdown,
                                }}
                                readOnly={false}
                                isDropdownEnabled={true}
                                popupPosition="vertical below"
                                validateToSave={(e) => {
                                    validateDriverLicenseToSave(e);
                                }}
                                triggerField={1}
                                onEnter={async e => {
                                    if (restrictionItems.length > 0 && restrictionItems.findIndex(item => item.selected) > -1) {
                                        let item = restrictionItems[restrictionItems.findIndex(item => item.selected)];

                                        await setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                restriction: item,
                                                restriction_id: item.id
                                            }
                                        })

                                        // validateDriverLicenseToSave({ keyCode: 9 });
                                        setRestrictionItems([]);
                                        refRestrictions.current.focus();
                                    }
                                }}
                                onTab={async e => {
                                    let item = restrictionItems[restrictionItems.findIndex(item => item.selected)];

                                    await setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            restriction: item,
                                            restriction_id: item.id
                                        }
                                    })

                                    validateDriverLicenseToSave(e);
                                    setRestrictionItems([]);
                                    refRestrictions.current.focus();
                                }}
                                onBlur={e => {
                                    if ((selectedLicense?.restriction?.id || 0) === 0) {
                                        setSelectedLicense(prev => {
                                            return {
                                                ...prev,
                                                restriction: {},
                                                restriction_id: null
                                            }
                                        })
                                    }
                                }}
                                onInput={e => {
                                    let restriction = selectedLicense?.restriction || {};
                                    restriction.id = 0;
                                    restriction.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            restriction: restriction
                                        }
                                    })

                                    if (e.target.value.trim() === "") {
                                        setRestrictionItems([]);
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseRestrictions", {
                                            name: e.target.value.trim()
                                        }).then(res => {
                                            if (res.data.result === "OK") {
                                                setRestrictionItems(res.data.restrictions.map((item, index) => {
                                                    item.selected = (selectedDriver?.license?.restriction?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedDriver.license.restriction.id
                                                    return item;
                                                }));
                                            }
                                        }).catch(e => {
                                            console.log("error getting restrictions", e);
                                        })
                                    }
                                }}
                                onChange={e => {
                                    let restriction = selectedLicense?.restriction || {};
                                    restriction.id = 0;
                                    restriction.name = e.target.value;

                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            restriction: restriction
                                        }
                                    })
                                }}
                                value={selectedLicense?.restriction?.name || ""}
                                items={restrictionItems}
                                getItems={() => {
                                    axios.post(props.serverUrl + "/getLicenseRestrictions").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setRestrictionItems(res.data.restrictions.map((item, index) => {
                                                item.selected = (selectedDriver?.license?.restriction?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedDriver.license.restriction.id
                                                return item;
                                            }));

                                            refRestrictionPopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting restrictions", e);
                                    });
                                }}
                                setItems={setRestrictionItems}
                                onDropdownClick={e => {
                                    if ((selectedLicense?.restriction?.id || 0) === 0 && (selectedLicense?.restriction?.name || "") !== "") {
                                        axios.post(props.serverUrl + "/getLicenseRestrictions", {
                                            name: selectedLicense?.restriction?.name
                                        }).then(async res => {
                                            if (res.data.result === "OK") {
                                                await setRestrictionItems(res.data.restrictions.map((item, index) => {
                                                    item.selected = (selectedLicense?.restriction?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.restriction.id
                                                    return item;
                                                }));

                                                refRestrictionPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting restrictions", e);
                                        });
                                    } else {
                                        axios.post(props.serverUrl + "/getLicenseRestrictions").then(async res => {
                                            if (res.data.result === "OK") {
                                                await setRestrictionItems(res.data.restrictions.map((item, index) => {
                                                    item.selected = (selectedLicense?.restriction?.id || 0) === 0
                                                        ? index === 0
                                                        : item.id === selectedLicense.restriction.id
                                                    return item;
                                                }));

                                                refRestrictionPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains("selected")) {
                                                        r.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "center",
                                                            inline: "nearest",
                                                        });
                                                    }
                                                    return true;
                                                });
                                            }
                                        }).catch(async e => {
                                            console.log("error getting restrictions", e);
                                        });
                                    }
                                }}
                                onPopupClick={item => {
                                    setSelectedLicense(prev => {
                                        return {
                                            ...prev,
                                            restriction: item,
                                            restriction_id: item.id
                                        }
                                    })

                                    // validateDriverLicenseToSave({ keyCode: 9 });

                                    setRestrictionItems([]);
                                    refRestrictions.current.focus();
                                }}
                            />
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row" style={{
                            marginTop: 'auto',
                            justifyContent: 'space-evenly'
                        }}>
                            <div className={licenceUploadImageBtnClass} onClick={() => {
                                refDriverLicenseImage.current.click();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Upload Image</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={`mochi-button${(selectedLicense?.image || '') === '' ? ' disabled' : ''}`} onClick={() => {
                                if (window.confirm('Are you sure you want to proceed?')) {
                                    axios.post(props.serverUrl + `/removeDriverLicenseImage`, {
                                        id: selectedLicense.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {
                                            setSelectedLicense(prev => {
                                                return {
                                                    ...prev,
                                                    image: ''
                                                }
                                            })
                                        }
                                    }).catch(e => {
                                        console.log('error removing driver license image', e);
                                    })
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Remove Image</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <form encType='multipart/form-data' style={{ display: 'none' }}>
                            <input type="file" ref={refDriverLicenseImage} accept='image/*'
                                onChange={driverLicenseImageChange} />
                        </form>
                    </div>

                    <div className="form-col">
                        <div className="license-image-main-container">
                            {
                                (selectedLicense?.image || '') !== ''
                                    ? <img src={(props.serverUrl.replace('api', '')) + 'license-images/' + selectedLicense.image} alt="License Image" />
                                    : <img src='img/id-card.png' alt="" />
                            }
                        </div>
                    </div>
                </div>

                <DriverMailingAddressForm
                    formTitle="Mailing Address"
                    formButtons={[
                        {
                            title: "Remit to address is the same",
                            onClick: () => {
                                remitToAddressBtn();
                            },
                            isEnabled: true,
                        },
                        {
                            title: "Clear",
                            onClick: () => {
                                mailingAddressClearBtn();
                            },
                            isEnabled: true,
                        },
                    ]}
                    refs={{
                        refAddress1: refMailingAddress1,
                        refContactName: refMailingContactName,
                        refContactNamePopupItems: refMailingContactNamePopupItems,
                        refContactPhone: refMailingContactPhone,
                        refContactPhonePopupItems: refMailingContactPhonePopupItems,
                        refContactEmail: refMailingContactEmail,
                        refContactEmailPopupItems: refMailingContactEmailPopupItems,
                    }}
                    tabTimesFrom={11}
                    tabTimes={props.tabTimes}
                    validateForSaving={validateDriverInfoForSaving}
                    validateMailingAddressForSaving={validateMailingAddressForSaving}
                    selectedParent={selectedDriver}
                    setSelectedParent={setSelectedDriver}
                    remitToAddressBtn={remitToAddressBtn}
                    clearBtn={mailingAddressClearBtn}
                />

                <div className="form-bordered-box drivers-medical-card-info">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Medical Card Info</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={medicalCardAddDocumentBtnClasses} onClick={(e) => { medicalCardAddDocumentBtnClick(e) }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="mochi-button" onClick={() => {
                                setSelectedMedicalCard({});
                                refMedicalCardIssueDate.current.inputElement.focus();

                                if ((selectedMedicalCard?.id || 0) > 0) {
                                    axios.post(props.serverUrl + `/deleteDriverMedicalCard`, {
                                        id: selectedMedicalCard.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {

                                        }
                                    }).catch(e => {
                                        console.log('error removing driver medical card', e);
                                    });
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-col" style={{ flexGrow: 1 }}>
                        <div className="form-row">
                            <DateInput
                                placeholder="Issue Date"
                                popupId="driver-medical-card-issue-date"
                                tabIndex={props.tabTimes + 36}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                refs={{
                                    refInputDate: refMedicalCardIssueDate,
                                    refCalendarDropDown: refMedicalCardIssueDateDropDown
                                }}
                                readOnly={false}
                                onKeyDown={() => { }}
                                onBlur={(formatted) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            issue_date: formatted
                                        }
                                    })
                                }}
                                onInput={(value) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            issue_date: value
                                        }
                                    })
                                }}
                                onChange={(value) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            issue_date: value
                                        }
                                    })
                                }}
                                value={selectedMedicalCard?.issue_date || ""}
                                preDay={preSelectedMedicalCardIssueDate}
                                setPreDay={setPreSelectedMedicalCardIssueDate}
                                isCalendarShown={isMedicalCardIssueDateCalendarShown}
                                setIsCalendarShown={setIsMedicalCardIssueDateCalendarShown}
                                popupPosition="vertical below"
                                onDropDownClick={() => {
                                    if (isMedicalCardIssueDateCalendarShown) {
                                        setIsMedicalCardIssueDateCalendarShown(false);
                                    } else {
                                        setIsMedicalCardIssueDateCalendarShown(true);

                                        if (moment((selectedMedicalCard?.issue_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedMedicalCard?.issue_date || "").trim()) {
                                            setPreSelectedMedicalCardIssueDate(moment(selectedMedicalCard?.issue_date, "MM/DD/YYYY"));
                                        } else {
                                            setPreSelectedMedicalCardIssueDate(moment());
                                        }
                                    }

                                }}
                                calendarValue={moment((selectedMedicalCard?.issue_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedMedicalCard?.issue_date || "").trim() ? moment(selectedMedicalCard?.issue_date, "MM/DD/YYYY") : moment()}
                                onCalendarChange={(day) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            issue_date: day.format("MM/DD/YYYY"),
                                        }
                                    });
                                }}
                            />
                            <div className="form-h-sep"></div>
                            <DateInput
                                placeholder="Expiration Date"
                                popupId="driver-medical-card-expiration-date"
                                tabIndex={props.tabTimes + 37}
                                boxStyle={{
                                    flexGrow: 1,
                                }}
                                refs={{
                                    refInputDate: refMedicalCardExpirationDate,
                                    refCalendarDropDown: refMedicalCardExpirationDateDropDown
                                }}
                                readOnly={false}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        validateDriverMedicalCardToSave(e);
                                    }
                                }}
                                onBlur={(formatted) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: formatted
                                        }
                                    })
                                }}
                                onInput={(value) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: value
                                        }
                                    })
                                }}
                                onChange={(value) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: value
                                        }
                                    })
                                }}
                                value={selectedMedicalCard?.expiration_date || ""}
                                preDay={preSelectedMedicalCardExpirationDate}
                                setPreDay={setPreSelectedMedicalCardExpirationDate}
                                isCalendarShown={isMedicalCardExpirationDateCalendarShown}
                                setIsCalendarShown={setIsMedicalCardExpirationDateCalendarShown}
                                popupPosition="vertical below"
                                onDropDownClick={() => {
                                    if (isMedicalCardExpirationDateCalendarShown) {
                                        setIsMedicalCardExpirationDateCalendarShown(false);
                                    } else {
                                        setIsMedicalCardExpirationDateCalendarShown(true);

                                        if (moment((selectedMedicalCard?.expiration_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedMedicalCard?.expiration_date || "").trim()) {
                                            setPreSelectedMedicalCardExpirationDate(moment(selectedMedicalCard?.expiration_date, "MM/DD/YYYY"));
                                        } else {
                                            setPreSelectedMedicalCardExpirationDate(moment());
                                        }
                                    }

                                }}
                                calendarValue={moment((selectedMedicalCard?.expiration_date || "").trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === (selectedMedicalCard?.expiration_date || "").trim() ? moment(selectedMedicalCard?.expiration_date, "MM/DD/YYYY") : moment()}
                                onCalendarChange={(day) => {
                                    setSelectedMedicalCard(prev => {
                                        return {
                                            ...prev,
                                            expiration_date: day.format("MM/DD/YYYY"),
                                        }
                                    });
                                }}
                            />
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row" style={{
                            marginTop: 'auto',
                            justifyContent: 'space-evenly'
                        }}>
                            <div className={medicalCardUploadImageBtnClass} onClick={() => {
                                refDriverMedicalCardImage.current.click();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Upload Image</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={`mochi-button${(selectedMedicalCard?.image || '') === '' ? ' disabled' : ''}`} onClick={() => {
                                if (window.confirm('Are you sure you want to proceed?')) {
                                    axios.post(props.serverUrl + `/removeDriverMedicalCardImage`, {
                                        id: selectedMedicalCard.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {
                                            setSelectedMedicalCard(prev => {
                                                return {
                                                    ...prev,
                                                    image: ''
                                                }
                                            })
                                        }
                                    }).catch(e => {
                                        console.log('error removing driver medical card image', e);
                                    })
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Remove Image</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <form encType='multipart/form-data' style={{ display: 'none' }}>
                            <input type="file" ref={refDriverMedicalCardImage} accept='image/*'
                                onChange={driverMedicalCardImageChange} />
                        </form>
                    </div>

                    <div className="form-col">
                        <div className="medical-card-image-main-container">
                            {
                                (selectedMedicalCard?.image || '') !== ''
                                    ? <img src={(props.serverUrl.replace('api', '')) + 'medical-card-images/' + selectedMedicalCard.image} alt="Medical Card Image" />
                                    : <img src='img/id-card.png' alt="" />
                            }
                        </div>
                    </div>
                </div>

                <EmergencyContactForm
                    formTitle="Emergency Contact"
                    formButtons={[
                        {
                            title: "More",
                            onClick: () => {
                                if ((selectedDriver?.id || 0) === 0) {
                                    window.alert("You must select a driver first!");
                                    return;
                                }

                                if ((selectedContact?.id || 0) === 0) {
                                    window.alert("You must select a contact");
                                    return;
                                }

                                let panel = {
                                    panelName: `${props.panelName}-contacts`,
                                    component: <Contacts
                                        title='Contacts'
                                        tabTimes={2258000 + props.tabTimes}
                                        panelName={`${props.panelName}-contacts`}
                                        savingContactUrl={`/saveDriverEmergencyContact`}
                                        deletingContactUrl={`/deleteDriverEmergencyContact`}
                                        uploadAvatarUrl={`/uploadDriverEmergencyContactAvatar`}
                                        removeAvatarUrl={`/removeDriverEmergencyContactAvatar`}
                                        permissionName='customer contacts'
                                        origin={props.origin}
                                        owner={props.subOrigin}
                                        // isEditingContact={true}
                                        
                                        
                                        componentId={moment().format('x')}

                                        contactSearchCustomer={{
                                            ...selectedDriver,
                                            selectedContact: { ...selectedContact }
                                        }}
                                    />
                                }

                                openPanel(panel, props.origin);
                            },
                            isEnabled: true,
                        },
                        {
                            title: "Add New Contact",
                            onClick: () => {
                                if ((selectedDriver?.id || 0) === 0) {
                                    window.alert('You must select a driver first!');
                                    return;
                                }

                                let panel = {
                                    panelName: `${props.panelName}-contacts`,
                                    component: <Contacts
                                        title='Contacts'
                                        tabTimes={2258000 + props.tabTimes}
                                        panelName={`${props.panelName}-contacts`}
                                        savingContactUrl={`/saveDriverEmergencyContact`}
                                        deletingContactUrl={`/deleteDriverEmergencyContact`}
                                        uploadAvatarUrl={`/uploadDriverEmergencyContactAvatar`}
                                        removeAvatarUrl={`/removeDriverEmergencyContactAvatar`}
                                        permissionName='customer contacts'
                                        origin={props.origin}
                                        owner={props.subOrigin}
                                        isEditingContact={true}
                                        
                                        
                                        componentId={moment().format('x')}

                                        contactSearchCustomer={{
                                            ...selectedDriver,
                                            selectedContact: {
                                                id: 0,
                                                driver_id: selectedDriver?.id
                                            }
                                        }}
                                    />
                                }

                                openPanel(panel, props.origin);
                            },
                            isEnabled: true,
                        },
                        {
                            title: "Clear",
                            onClick: () => {
                                setSelectedContact({})
                                refEmergencyContactName.current.focus();
                            },
                            isEnabled: true,
                        },
                    ]}
                    refs={{
                        refName: refEmergencyContactName,
                        refPhone: refEmergencyContactPhone,
                        refEmail: refEmergencyContactEmail,
                        refRelationship: refEmergencyContactRelationships
                    }}
                    triggerField='email'
                    tabTimesFrom={20}
                    tabTimes={props.tabTimes}
                    validateForSaving={(e) => { validateEmergencyContactForSaving(e) }}
                    selectedParent={selectedContact}
                    setSelectedParent={setSelectedContact}
                    withEmail={1}
                    contactList={selectedDriver?.contacts || []}
                />

                <div className="form-bordered-box drivers-tractor-info">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Tractor Information</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={tractorAddDocumentBtnClasses} onClick={(e) => { tractorAddDocumentBtnClick(e) }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="mochi-button" onClick={() => {
                                setSelectedTractor({});
                                refDriverTractorNumber.current.focus();

                                if ((selectedTractor?.id || 0) > 0) {
                                    axios.post(props.serverUrl + `/deleteDriverTractor`, {
                                        id: selectedTractor.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {

                                        }
                                    }).catch(e => {
                                        console.log('error removing driver tractor', e);
                                    });
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-row" style={{ justifyContent: 'flex-end' }}>
                        <div className="input-box-container input-code" style={{ marginRight: 'auto' }}>
                            <input
                                tabIndex={props.tabTimes + 38}
                                type="text"
                                placeholder="Tractor Number"
                                style={{
                                    textTransform: "uppercase",
                                }}
                                ref={refDriverTractorNumber}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            number: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.number || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 39}
                                type="text"
                                placeholder="Plate State"
                                style={{
                                    textTransform: "uppercase",
                                }}
                                maxLength={2}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            plate_state: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.plate_state || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 40}
                                type="text"
                                placeholder="Plate Number"
                                style={{
                                    textTransform: "uppercase",
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            plate_number: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.plate_number || ""}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 41}
                                type="text"
                                placeholder="Year"
                                maxLength={4}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (!((key >= 48 && key <= 57) ||
                                        (key >= 96 && key <= 105) ||
                                        key === 37 || key === 39 ||
                                        key === 13 || key === 9 ||
                                        key === 8 || key === 46 ||
                                        key === 35 || key === 36)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            year: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.year || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input
                                tabIndex={props.tabTimes + 42}
                                type="text"
                                placeholder="Make"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            make: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.make || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input
                                tabIndex={props.tabTimes + 43}
                                type="text"
                                placeholder="Model"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            model: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.model || ""}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <div className="input-box-container grow">
                            <input
                                tabIndex={props.tabTimes + 44}
                                type="text"
                                placeholder="VIN"
                                style={{
                                    textTransform: 'uppercase'
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            vin: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.vin || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container" style={{
                            width: 'calc(((100% - 7.5rem) / 2) - 2px)'
                        }}>
                            <input
                                tabIndex={props.tabTimes + 45}
                                type="text"
                                placeholder="Color"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            color: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTractor?.color || ""}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <SelectBox
                            placeholder="Type"
                            popupId="driver-tractor-type"
                            tabIndex={props.tabTimes + 46}
                            refs={{
                                refInput: refDriverTractorTypes,
                                refPopupItems: refDriverTractorTypePopupItems,
                                refDropdown: refDriverTractorTypeDropdown,
                            }}
                            readOnly={false}
                            isDropdownEnabled={true}
                            popupPosition="vertical below"
                            validateToSave={(e) => {
                                validateDriverTractorToSave(e);
                            }}
                            triggerField={1}
                            onEnter={async e => {
                                if (tractorTypeItems.length > 0 && tractorTypeItems.findIndex(item => item.selected) > -1) {
                                    let item = tractorTypeItems[tractorTypeItems.findIndex(item => item.selected)];

                                    await setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            type: item,
                                            type_id: item.id
                                        }
                                    })

                                    setTractorTypeItems([]);
                                    refDriverTractorTypes.current.focus();
                                }
                            }}
                            onTab={async e => {
                                let item = tractorTypeItems[tractorTypeItems.findIndex(item => item.selected)];

                                await setSelectedTractor(prev => {
                                    return {
                                        ...prev,
                                        type: item,
                                        type_id: item.id
                                    }
                                })

                                validateDriverTractorToSave(e);
                                setTractorTypeItems([]);
                                refDriverTractorTypes.current.focus();
                            }}
                            onBlur={e => {
                                if ((selectedTractor?.type?.id || 0) === 0) {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            type: {},
                                            type_id: null
                                        }
                                    })
                                }
                            }}
                            onInput={e => {
                                let type = selectedTractor?.type || {};
                                type.id = 0;
                                type.name = e.target.value;

                                setSelectedTractor(prev => {
                                    return {
                                        ...prev,
                                        type: type
                                    }
                                })

                                if (e.target.value.trim() === "") {
                                    setTractorTypeItems([]);
                                } else {
                                    axios.post(props.serverUrl + "/getEquipments", {
                                        name: e.target.value.trim()
                                    }).then(res => {
                                        if (res.data.result === "OK") {
                                            setTractorTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTractor?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTractor.type.id
                                                return item;
                                            }));
                                        }
                                    }).catch(e => {
                                        console.log("error getting tractor types", e);
                                    })
                                }
                            }}
                            onChange={e => {
                                let type = selectedTractor?.type || {};
                                type.id = 0;
                                type.name = e.target.value;

                                setSelectedTractor(prev => {
                                    return {
                                        ...prev,
                                        type: type
                                    }
                                })
                            }}
                            value={selectedTractor?.type?.name || ""}
                            items={tractorTypeItems}
                            getItems={() => {
                                axios.post(props.serverUrl + "/getEquipments").then(async res => {
                                    if (res.data.result === "OK") {
                                        await setTractorTypeItems(res.data.equipments.map((item, index) => {
                                            item.selected = (selectedTractor?.type?.id || 0) === 0
                                                ? index === 0
                                                : item.id === selectedTractor.type.id
                                            return item;
                                        }));

                                        refDriverTractorTypePopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    }
                                }).catch(async e => {
                                    console.log("error getting tractor types", e);
                                });
                            }}
                            setItems={setTractorTypeItems}
                            onDropdownClick={e => {
                                if ((selectedTractor?.type?.id || 0) === 0 && (selectedTractor?.type?.name || "") !== "") {
                                    axios.post(props.serverUrl + "/getEquipments", {
                                        name: selectedTractor?.type?.name
                                    }).then(async res => {
                                        if (res.data.result === "OK") {
                                            await setTractorTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTractor?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTractor.type.id
                                                return item;
                                            }));

                                            refDriverTractorTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting tractor types", e);
                                    });
                                } else {
                                    axios.post(props.serverUrl + "/getEquipments").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setTractorTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTractor?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTractor.type.id
                                                return item;
                                            }));

                                            refDriverTractorTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting tractor types", e);
                                    });
                                }
                            }}
                            onPopupClick={item => {
                                setSelectedTractor(prev => {
                                    return {
                                        ...prev,
                                        type: item,
                                        type_id: item.id
                                    }
                                })

                                validateDriverTractorToSave({ keyCode: 9 });
                                setTractorTypeItems([]);
                                refDriverTractorTypes.current.focus();
                            }}
                        />
                        <div className="form-h-sep"></div>
                        <div className="radio-toggle-container" style={{ marginLeft: 'auto' }}>
                            <input type="radio"
                                id={props.panelName + '-cbox-company-driver-tractor-axle-btn-single'}
                                name='tractor-axle-btn'
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            axle: e.target.checked ? 'single' : 'double'
                                        }
                                    })

                                    if (e.target.checked) {
                                        validateDriverTractorToSave({ keyCode: 9 });
                                    }
                                }}
                                checked={(selectedTractor?.axle || 'single') === 'single'} />
                            <input type="radio"
                                id={props.panelName + '-cbox-company-driver-tractor-axle-btn-double'}
                                name='tractor-axle-btn'
                                onChange={e => {
                                    setSelectedTractor(prev => {
                                        return {
                                            ...prev,
                                            axle: e.target.checked ? 'double' : 'single'
                                        }
                                    })

                                    if (e.target.checked) {
                                        validateDriverTractorToSave({ keyCode: 9 });
                                    }
                                }}
                                checked={(selectedTractor?.axle || 'single') === 'double'} />

                            <label htmlFor={props.panelName + '-cbox-company-driver-tractor-axle-btn-single'} style={{
                                backgroundColor: (selectedTractor?.axle || 'single') === 'single' ? '#ffb80d' : 'rgba(0,0,0,0.05)',

                            }}>
                                <div className="label-text">Single Axle</div>
                            </label>

                            <label htmlFor={props.panelName + '-cbox-company-driver-tractor-axle-btn-double'} style={{
                                backgroundColor: (selectedTractor?.axle || 'single') === 'double' ? '#ffb80d' : 'rgba(0,0,0,0.05)'
                            }}>
                                <div className="label-text">Double Axle</div>
                            </label>
                        </div>
                    </div>
                </div>

                <EmergencyContactList
                    formTitle=""
                    // formButtons={[
                    //     // {
                    //     //     title: "Search",
                    //     //     onClick: () => {
                    //     //         setShowingContactList(false);
                    //     //         refEmergencyContactSearchFirstName.current.focus();
                    //     //     },
                    //     //     isEnabled: true,
                    //     // },
                    //     {
                    //         title: "Cancel",
                    //         onClick: () => {
                    //             setShowingContactList(true);
                    //             refEmergencyContactEmail.current.focus();
                    //         },
                    //         isEnabled: !showingContactList,
                    //     },
                    //     {
                    //         title: "Send",
                    //         onClick: () => {
                    //             searchEmergencyContactBtnClick();
                    //         },
                    //         isEnabled: !showingContactList,
                    //     },
                    // ]}
                    refs={{
                        refContactSearchName: refEmergencyContactSearchFirstName,
                        refEmergencyContactEmail: refEmergencyContactEmail,
                    }}
                    tabTimes={props.tabTimes}
                    selectedParent={selectedDriver}
                    selectedContact={selectedContact}
                    setSelectedContact={setSelectedContact}
                    showingContactList={showingContactList}
                    setShowingContactList={setShowingContactList}
                    contactListItemDoubleClick={contactItemDoubleClick}
                />

                <div className="form-bordered-box drivers-trailer-info">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Trailer Information</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={trailerAddDocumentBtnClasses} onClick={(e) => { trailerAddDocumentBtnClick(e) }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                            <div className="mochi-button" onClick={() => {
                                setSelectedTrailer({});
                                refDriverTrailerNumber.current.focus();

                                if ((selectedTrailer?.id || 0) > 0) {
                                    axios.post(props.serverUrl + `/deleteDriverTrailer`, {
                                        id: selectedTrailer.id
                                    }).then(res => {
                                        if (res.data.result === 'OK') {

                                        }
                                    }).catch(e => {
                                        console.log('error removing driver trailer', e);
                                    });
                                }
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-row" style={{ justifyContent: 'flex-end' }}>
                        <div className="input-box-container input-code" style={{ marginRight: 'auto' }}>
                            <input
                                tabIndex={props.tabTimes + 47}
                                type="text"
                                placeholder="Trailer Number"
                                style={{
                                    textTransform: "uppercase",
                                }}
                                ref={refDriverTrailerNumber}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            number: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.number || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 48}
                                type="text"
                                placeholder="Plate State"
                                maxLength={2}
                                style={{
                                    textTransform: "uppercase",
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            plate_state: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.plate_state || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 49}
                                type="text"
                                placeholder="Plate Number"
                                style={{
                                    textTransform: "uppercase",
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            plate_number: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.plate_number || ""}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <div className="input-box-container input-code">
                            <input
                                tabIndex={props.tabTimes + 50}
                                type="text"
                                placeholder="Year"
                                maxLength={4}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (!((key >= 48 && key <= 57) ||
                                        (key >= 96 && key <= 105) ||
                                        key === 37 || key === 39 ||
                                        key === 13 || key === 9 ||
                                        key === 8 || key === 46 ||
                                        key === 35 || key === 36)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            year: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.year || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input
                                tabIndex={props.tabTimes + 51}
                                type="text"
                                placeholder="Make"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            make: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.make || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container grow">
                            <input
                                tabIndex={props.tabTimes + 52}
                                type="text"
                                placeholder="Model"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            model: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.model || ""}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <div className="input-box-container grow" style={{ minWidth: '50%' }}>
                            <input
                                tabIndex={props.tabTimes + 53}
                                type="text"
                                placeholder="VIN"
                                style={{
                                    textTransform: 'uppercase'
                                }}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            vin: e.target.value,
                                        }
                                    })
                                }}
                                value={selectedTrailer?.vin || ""}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container">
                            <MaskedInput
                                tabIndex={props.tabTimes + 54}
                                mask={[/[0-9]/, /\d/, " ft"]}
                                guide={true}
                                type="text"
                                placeholder='Length'
                                onChange={(e) => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            length: e.target.value
                                        }
                                    })
                                }}
                                value={selectedTrailer?.length || ''}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container">
                            <MaskedInput
                                tabIndex={props.tabTimes + 55}
                                mask={[/[0-9]/, /\d/, /\d/, " in"]}
                                guide={true}
                                type="text"
                                placeholder='Width'
                                onChange={(e) => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            width: e.target.value
                                        }
                                    })
                                }}
                                value={selectedTrailer?.width || ''}
                            />
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-box-container">
                            <MaskedInput
                                tabIndex={props.tabTimes + 56}
                                mask={[/[0-9]/, /\d/, /\d/, " in"]}
                                guide={true}
                                type="text"
                                placeholder='Height'
                                onChange={(e) => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            height: e.target.value
                                        }
                                    })
                                }}
                                value={selectedTrailer?.height || ''}
                            />
                        </div>
                    </div>
                    <div className="form-v-sep"></div>
                    <div className="form-row">
                        <SelectBox
                            placeholder="Type"
                            popupId="driver-trailer-type"
                            tabIndex={props.tabTimes + 57}
                            refs={{
                                refInput: refDriverTrailerTypes,
                                refPopupItems: refDriverTrailerTypePopupItems,
                                refDropdown: refDriverTrailerTypeDropdown,
                            }}
                            readOnly={false}
                            isDropdownEnabled={true}
                            popupPosition="vertical above"
                            transitionFromTop="calc(-162px + 12px)"
                            transitionEnterTop="calc(-162px + 7px)"
                            transitionLeaveTop="calc(-162px + 12px)"
                            validateToSave={(e) => {
                                validateDriverTrailerToSave(e);
                            }}
                            triggerField={1}
                            onEnter={async e => {
                                if (trailerTypeItems.length > 0 && trailerTypeItems.findIndex(item => item.selected) > -1) {
                                    let item = trailerTypeItems[trailerTypeItems.findIndex(item => item.selected)];

                                    await setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            type: item,
                                            type_id: item.id
                                        }
                                    })

                                    setTrailerTypeItems([]);
                                    refDriverTrailerTypes.current.focus();
                                }
                            }}
                            onTab={async e => {
                                let item = trailerTypeItems[trailerTypeItems.findIndex(item => item.selected)];

                                await setSelectedTrailer(prev => {
                                    return {
                                        ...prev,
                                        type: item,
                                        type_id: item.id
                                    }
                                })

                                validateDriverTrailerToSave(e);
                                setTrailerTypeItems([]);
                                refDriverTrailerTypes.current.focus();
                            }}
                            onBlur={e => {
                                if ((selectedTrailer?.type?.id || 0) === 0) {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            type: {},
                                            type_id: null
                                        }
                                    })
                                }
                            }}
                            onInput={e => {
                                let type = selectedTrailer?.type || {};
                                type.id = 0;
                                type.name = e.target.value;

                                setSelectedTrailer(prev => {
                                    return {
                                        ...prev,
                                        type: type
                                    }
                                })

                                if (e.target.value.trim() === "") {
                                    setTrailerTypeItems([]);
                                } else {
                                    axios.post(props.serverUrl + "/getEquipments", {
                                        name: e.target.value.trim()
                                    }).then(res => {
                                        if (res.data.result === "OK") {
                                            setTrailerTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTrailer?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTrailer.type.id
                                                return item;
                                            }));
                                        }
                                    }).catch(e => {
                                        console.log("error getting trailer types", e);
                                    })
                                }
                            }}
                            onChange={e => {
                                let type = selectedTrailer?.type || {};
                                type.id = 0;
                                type.name = e.target.value;

                                setSelectedTrailer(prev => {
                                    return {
                                        ...prev,
                                        type: type
                                    }
                                })
                            }}
                            value={selectedTrailer?.type?.name || ""}
                            items={trailerTypeItems}
                            getItems={() => {
                                axios.post(props.serverUrl + "/getEquipments").then(async res => {
                                    if (res.data.result === "OK") {
                                        await setTrailerTypeItems(res.data.equipments.map((item, index) => {
                                            item.selected = (selectedTrailer?.type?.id || 0) === 0
                                                ? index === 0
                                                : item.id === selectedTrailer.type.id
                                            return item;
                                        }));

                                        refDriverTrailerTypePopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    }
                                }).catch(async e => {
                                    console.log("error getting trailer types", e);
                                });
                            }}
                            setItems={setTrailerTypeItems}
                            onDropdownClick={e => {
                                if ((selectedTrailer?.type?.id || 0) === 0 && (selectedTrailer?.type?.name || "") !== "") {
                                    axios.post(props.serverUrl + "/getEquipments", {
                                        name: selectedTrailer?.type?.name
                                    }).then(async res => {
                                        if (res.data.result === "OK") {
                                            await setTrailerTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTrailer?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTrailer.type.id
                                                return item;
                                            }));

                                            refDriverTrailerTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting trailer types", e);
                                    });
                                } else {
                                    axios.post(props.serverUrl + "/getEquipments").then(async res => {
                                        if (res.data.result === "OK") {
                                            await setTrailerTypeItems(res.data.equipments.map((item, index) => {
                                                item.selected = (selectedTrailer?.type?.id || 0) === 0
                                                    ? index === 0
                                                    : item.id === selectedTrailer.type.id
                                                return item;
                                            }));

                                            refDriverTrailerTypePopupItems.current.map((r, i) => {
                                                if (r && r.classList.contains("selected")) {
                                                    r.scrollIntoView({
                                                        behavior: "auto",
                                                        block: "center",
                                                        inline: "nearest",
                                                    });
                                                }
                                                return true;
                                            });
                                        }
                                    }).catch(async e => {
                                        console.log("error getting trailer types", e);
                                    });
                                }
                            }}
                            onPopupClick={item => {
                                setSelectedTrailer(prev => {
                                    return {
                                        ...prev,
                                        type: item,
                                        type_id: item.id
                                    }
                                })

                                validateDriverTrailerToSave({ keyCode: 9 });
                                setTrailerTypeItems([]);
                                refDriverTrailerTypes.current.focus();
                            }}
                        />
                        <div className="form-h-sep"></div>
                        <div className="input-toggle-container" style={{ marginLeft: 'auto' }}>
                            <input type="checkbox"
                                id={props.panelName + '-cbox-company-driver-trailer-liftgate-btn'}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            liftgate: e.target.checked ? 1 : 0
                                        }
                                    })

                                    validateDriverTrailerToSave({ keyCode: 9 });
                                }}
                                checked={(selectedTrailer?.liftgate || 0) === 1} />
                            <label htmlFor={props.panelName + '-cbox-company-driver-trailer-liftgate-btn'}>
                                <div className="label-text">Liftgate</div>
                                <div className="input-toggle-btn"></div>
                            </label>
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-toggle-container">
                            <input type="checkbox"
                                id={props.panelName + '-cbox-company-driver-trailer-ramps-btn'}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            ramps: e.target.checked ? 1 : 0
                                        }
                                    })

                                    validateDriverTrailerToSave({ keyCode: 9 });
                                }}
                                checked={(selectedTrailer?.ramps || 0) === 1} />
                            <label htmlFor={props.panelName + '-cbox-company-driver-trailer-ramps-btn'}>
                                <div className="label-text">Ramps</div>
                                <div className="input-toggle-btn"></div>
                            </label>
                        </div>
                        <div className="form-h-sep"></div>
                        <div className="input-toggle-container">
                            <input type="checkbox"
                                id={props.panelName + '-cbox-company-driver-trailer-tarps-btn'}
                                onChange={e => {
                                    setSelectedTrailer(prev => {
                                        return {
                                            ...prev,
                                            tarps: e.target.checked ? 1 : 0
                                        }
                                    })

                                    validateDriverTrailerToSave({ keyCode: 9 });
                                }}
                                checked={(selectedTrailer?.tarps || 0) === 1} />
                            <label htmlFor={props.panelName + '-cbox-company-driver-trailer-tarps-btn'}>
                                <div className="label-text">Tarps</div>
                                <div className="input-toggle-btn"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,

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


        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedDriver: state.companySetupReducers.selectedDriver,
        selectedDriverContact: state.companySetupReducers.selectedDriverContact,
        selectedOperator: state.companySetupReducers.selectedOperator,
        selectedOperatorContact: state.companySetupReducers.selectedOperatorContact,
        selectedAgent: state.companySetupReducers.selectedAgent,
        selectedAgentDriver: state.companySetupReducers.selectedAgentDriver,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierDriver: state.carrierReducers.selectedDriver,
    };
};

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

    setSelectedDriver,
    setSelectedCompany,
    setSelectedDriverContact,
    setSelectedOperator,
    setSelectedOperatorContact,
    setSelectedCarrier,
    setSelectedCarrierDriver,
    setSelectedAgent,
    setSelectedAgentDriver
})(CompanyDrivers);
