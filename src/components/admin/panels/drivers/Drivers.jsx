import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './Drivers.css';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faCheck, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
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
    setSelectedCompanyDriver as setSelectedDriver
} from './../../../../actions';

import { Documents, Calendar } from './../../../company/panels';

const Drivers = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const refDriverInfoWrapper = useRef();
    const refPerHourPerDay = useRef();
    const [tempSelectedDriver, setTempSelectedDriver] = useState({});
    const [isEditingDriver, setIsEditingDriver] = useState(false);
    const [driverSearchCompany, setDriverSearchCompany] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);

    const numberMask = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 15,
        allowNegative: true,
        allowLeadingZeroes: false,
        fixedDecimalScale: true
    })
    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingDriver
    });

    const [perHourPerDayUnitItems, setPerHourPerDayUnitItems] = useState([
        {
            id: 1,
            name: 'Hour',
            value: 'hr',
            selected: false
        },
        {
            id: 2,
            name: 'Day',
            value: 'day',
            selected: false
        }
    ]);
    const [showPerHourPerDayUnitItems, setShowPerHourPerDayUnitItems] = useState(false);
    const refPerHourPerDayUnitDropDown = useDetectClickOutside({ onTriggered: async () => { setShowPerHourPerDayUnitItems(false) } });
    const refPerHourPerDayUnitPopupItems = useRef([]);

    const [preSelectedExpirationDate, setPreSelectedExpirationDate] = useState(moment());
    const refExpirationDate = useRef();
    const [isExpirationDateCalendarShown, setIsExpirationDateCalendarShown] = useState(false);
    const refExpirationDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsExpirationDateCalendarShown(false) } });

    const [preSelectedHireDate, setPreSelectedHireDate] = useState(moment());
    const refHireDate = useRef();
    const [isHireDateCalendarShown, setIsHireDateCalendarShown] = useState(false);
    const refHireDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsHireDateCalendarShown(false) } });

    const [preSelectedTerminationDate, setPreSelectedTerminationDate] = useState(moment());
    const refTerminationDate = useRef();
    const [isTerminationDateCalendarShown, setIsTerminationDateCalendarShown] = useState(false);
    const refTerminationDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsTerminationDateCalendarShown(false) } });

    const [preSelectedPhysicalDate, setPreSelectedPhysicalDate] = useState(moment());
    const refPhysicalDate = useRef();
    const [isPhysicalDateCalendarShown, setIsPhysicalDateCalendarShown] = useState(false);
    const refPhysicalDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsPhysicalDateCalendarShown(false) } });

    const [preSelectedRenewalDate, setPreSelectedRenewalDate] = useState(moment());
    const refRenewalDate = useRef();
    const [isRenewalDateCalendarShown, setIsRenewalDateCalendarShown] = useState(false);
    const refRenewalDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsRenewalDateCalendarShown(false) } });

    const [preSelectedDrugTestDate, setPreSelectedDrugTestDate] = useState(moment());
    const refDrugTestDate = useRef();
    const [isDrugTestDateCalendarShown, setIsDrugTestDateCalendarShown] = useState(false);
    const refDrugTestDateCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsDrugTestDateCalendarShown(false) } });

    const expirationDateCalendarTransition = useTransition(isExpirationDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isExpirationDateCalendarShown,
        config: { duration: 100 }
    });

    const hireDateCalendarTransition = useTransition(isHireDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isHireDateCalendarShown,
        config: { duration: 100 }
    });

    const terminationDateCalendarTransition = useTransition(isTerminationDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isTerminationDateCalendarShown,
        config: { duration: 100 }
    });

    const physicalDateCalendarTransition = useTransition(isPhysicalDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isPhysicalDateCalendarShown,
        config: { duration: 100 }
    });

    const renewalDateCalendarTransition = useTransition(isRenewalDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isRenewalDateCalendarShown,
        config: { duration: 100 }
    });

    const drugTestDateCalendarTransition = useTransition(isDrugTestDateCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isDrugTestDateCalendarShown,
        config: { duration: 100 }
    });

    const perHourPerDayTransition = useTransition(showPerHourPerDayUnitItems, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: showPerHourPerDayUnitItems,
        config: { duration: 100 }
    });

    useEffect(async () => {
        setDriverSearchCompany(props.driverSearchCompany || {});

        if (props.isEditingDriver) {
            setIsEditingDriver(true);
            refPrefix.current.focus({
                preventScroll: true
            });
        }

    }, [])

    const saveDriver = () => {
        let driver = driverSearchCompany?.selectedDriver;

        if ((tempSelectedDriver.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((tempSelectedDriver.last_name || '').trim() === '') {
            window.alert('You must enter the last name!');
            return;
        }

        if ((tempSelectedDriver.phone_work || '').trim() === '' &&
            (tempSelectedDriver.phone_work_fax || '').trim() === '' &&
            (tempSelectedDriver.phone_mobile || '').trim() === '' &&
            (tempSelectedDriver.phone_direct || '').trim() === '' &&
            (tempSelectedDriver.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempSelectedDriver.primary_phone) {
            case 'work':
                if ((tempSelectedDriver.phone_work || '').trim() === '') {
                    tempSelectedDriver.primary_phone = (tempSelectedDriver.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedDriver.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedDriver.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedDriver.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempSelectedDriver.phone_work_fax || '').trim() === '') {
                    tempSelectedDriver.primary_phone = (tempSelectedDriver.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedDriver.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedDriver.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempSelectedDriver.phone_mobile || '').trim() === '') {
                    tempSelectedDriver.primary_phone = (tempSelectedDriver.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedDriver.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedDriver.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempSelectedDriver.phone_direct || '').trim() === '') {
                    tempSelectedDriver.primary_phone = (tempSelectedDriver.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedDriver.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedDriver.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedDriver.phone_other || '').trim() === '') {
                    tempSelectedDriver.primary_phone = (tempSelectedDriver.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedDriver.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedDriver.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempSelectedDriver.primary_phone = 'work'
                break;
        }

        switch (tempSelectedDriver.primary_email) {
            case 'work':
                if ((tempSelectedDriver.email_work || '').trim() === '') {
                    tempSelectedDriver.primary_email = (tempSelectedDriver.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedDriver.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempSelectedDriver.email_personal || '').trim() === '') {
                    tempSelectedDriver.primary_email = (tempSelectedDriver.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedDriver.email_other || '').trim() === '') {
                    tempSelectedDriver.primary_email = (tempSelectedDriver.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedDriver.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempSelectedDriver.primary_email = 'work'
                break;
        }

        if ((tempSelectedDriver.address1 || '').trim() === '' && (tempSelectedDriver.address2 || '').trim() === '') {
            tempSelectedDriver.address1 = driverSearchCompany.address1;
            tempSelectedDriver.address2 = driverSearchCompany.address2;
            tempSelectedDriver.city = driverSearchCompany.city;
            tempSelectedDriver.state = driverSearchCompany.state;
            tempSelectedDriver.zip_code = driverSearchCompany.zip;
        }

        tempSelectedDriver.pay_rate = Number((tempSelectedDriver.pay_rate || 0).toString().replace(',', ''));
        tempSelectedDriver.per_hour_per_day = Number((tempSelectedDriver.per_hour_per_day || 0).toString().replace(',', ''));

        axios.post(props.serverUrl + props.savingDriverUrl, tempSelectedDriver).then(res => {
            if (res.data.result === 'OK') {
                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.driver.company_id || 0), drivers: res.data.drivers });
                props.setSelectedDriver(res.data.driver);

                setDriverSearchCompany({ ...driverSearchCompany, selectedDriver: res.data.driver, drivers: res.data.drivers });
                setIsEditingDriver(false);
            }
        }).catch(e => {
            console.log('error saving driver', e);
        });
    }

    const deleteDriver = () => {
        let driver = driverSearchCompany?.selectedDriver;

        if (window.confirm('Are you sure to delete this driver?')) {
            axios.post(props.serverUrl + props.deletingDriverUrl, driver).then(res => {
                if (res.data.result === 'OK') {
                    props.setSelectedCompany({ ...props.selectedCompany, drivers: res.data.drivers });
                    props.setSelectedDriver({ id: driver.id, deleted: true });

                    setDriverSearchCompany({ ...driverSearchCompany, selectedDriver: {}, drivers: res.data.drivers });
                    setIsEditingDriver(false);
                }
            }).catch(e => {
                console.log('error deleting driver', e);
            });
        }
    }

    const driverAvatarChange = (e) => {
        let files = e.target.files;
        const maxSize = 3145728;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 3mb");
                return;
            }

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("driver_id", driverSearchCompany?.selectedDriver?.id);
            formData.append("company_id", driverSearchCompany.id);

            const options = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + props.uploadAvatarUrl, formData, options)
                .then(async res => {
                    if (res.data.result === "OK") {
                        props.setSelectedCompany({
                            ...props.selectedCompany,
                            drivers: res.data.drivers
                        });

                        await setDriverSearchCompany(driverSearchCompany => {
                            return {
                                ...driverSearchCompany,
                                selectedDriver: res.data.driver,
                                drivers: res.data.drivers
                            }
                        });
                    }
                    refInputAvatar.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing driver avatar", err);
                    refInputAvatar.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeDriverAvatar = (e) => {
        axios.post(props.serverUrl + props.removeAvatarUrl, driverSearchCompany?.selectedDriver).then(async res => {
            if (res.data.result === "OK") {
                props.setSelectedCompany({ ...props.selectedCompany, drivers: res.data.drivers });

                await setDriverSearchCompany(driverSearchCompany => {
                    return {
                        ...driverSearchCompany,
                        selectedDriver: res.data.driver,
                        drivers: res.data.drivers
                    }
                });
            }
        }).catch(e => {
            console.log('error removig driver avatar', e);
        });
    }

    const onKeyDownExpirationDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.expiration_date || ''), 'MM/DD/YYYY');
            await setPreSelectedExpirationDate(expiration_date);

            if (isExpirationDateCalendarShown) {
                expiration_date = preSelectedExpirationDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.expiration_date = expiration_date;

                await setTempSelectedDriver(tempDriver);

                await setIsExpirationDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.expiration_date || ''), 'MM/DD/YYYY');
            await setPreSelectedExpirationDate(expiration_date);

            if (isExpirationDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsExpirationDateCalendarShown(true);
                }
            }
        }
    }

    const onKeyDownHireDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let hire_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.hire_date || ''), 'MM/DD/YYYY');
            await setPreSelectedHireDate(hire_date);

            if (isHireDateCalendarShown) {
                hire_date = preSelectedHireDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.hire_date = hire_date;

                await setTempSelectedDriver(tempDriver);

                await setIsHireDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let hire_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.hire_date || ''), 'MM/DD/YYYY');
            await setPreSelectedHireDate(hire_date);

            if (isHireDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedHireDate(preSelectedHireDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedHireDate(preSelectedHireDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedHireDate(preSelectedHireDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedHireDate(preSelectedHireDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsHireDateCalendarShown(true);
                }
            }
        }
    }

    const onKeyDownTerminationDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let termination_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.termination_date || ''), 'MM/DD/YYYY');
            await setPreSelectedTerminationDate(termination_date);

            if (isTerminationDateCalendarShown) {
                termination_date = preSelectedTerminationDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.termination_date = termination_date;

                await setTempSelectedDriver(tempDriver);

                await setIsTerminationDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let termination_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.termination_date || ''), 'MM/DD/YYYY');
            await setPreSelectedTerminationDate(termination_date);

            if (isTerminationDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedTerminationDate(preSelectedTerminationDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedTerminationDate(preSelectedTerminationDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedTerminationDate(preSelectedTerminationDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedTerminationDate(preSelectedTerminationDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsTerminationDateCalendarShown(true);
                }
            }
        }
    }

    const onKeyDownPhysicalDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let physical_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.physical_date || ''), 'MM/DD/YYYY');
            await setPreSelectedPhysicalDate(physical_date);

            if (isPhysicalDateCalendarShown) {
                physical_date = preSelectedPhysicalDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.physical_date = physical_date;

                await setTempSelectedDriver(tempDriver);

                await setIsPhysicalDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let physical_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.physical_date || ''), 'MM/DD/YYYY');
            await setPreSelectedPhysicalDate(physical_date);

            if (isPhysicalDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedPhysicalDate(preSelectedPhysicalDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedPhysicalDate(preSelectedPhysicalDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedPhysicalDate(preSelectedPhysicalDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedPhysicalDate(preSelectedPhysicalDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsPhysicalDateCalendarShown(true);
                }
            }
        }
    }

    const onKeyDownRenewalDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let renewal_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.renewal_date || ''), 'MM/DD/YYYY');
            await setPreSelectedRenewalDate(renewal_date);

            if (isRenewalDateCalendarShown) {
                renewal_date = preSelectedRenewalDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.renewal_date = renewal_date;

                await setTempSelectedDriver(tempDriver);

                await setIsRenewalDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let renewal_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.renewal_date || ''), 'MM/DD/YYYY');
            await setPreSelectedRenewalDate(renewal_date);

            if (isRenewalDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedRenewalDate(preSelectedRenewalDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedRenewalDate(preSelectedRenewalDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedRenewalDate(preSelectedRenewalDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedRenewalDate(preSelectedRenewalDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsRenewalDateCalendarShown(true);
                }
            }
        }
    }

    const onKeyDownDrugTestDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let drug_test_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.drug_test_date || ''), 'MM/DD/YYYY');
            await setPreSelectedDrugTestDate(drug_test_date);

            if (isDrugTestDateCalendarShown) {
                drug_test_date = preSelectedDrugTestDate.clone().format('MM/DD/YYYY');

                let tempDriver = { ...tempSelectedDriver };
                tempDriver.drug_test_date = drug_test_date;

                await setTempSelectedDriver(tempDriver);

                await setIsDrugTestDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let drug_test_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedDriver?.drug_test_date || ''), 'MM/DD/YYYY');
            await setPreSelectedDrugTestDate(drug_test_date);

            if (isDrugTestDateCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedDrugTestDate(preSelectedDrugTestDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedDrugTestDate(preSelectedDrugTestDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedDrugTestDate(preSelectedDrugTestDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedDrugTestDate(preSelectedDrugTestDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsDrugTestDateCalendarShown(true);
                }
            }
        }
    }

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

            <div className="driver-container" style={{ overflow: 'initial' }}>
                <div className="driver-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="driver-list">
                        <div className="driver-list-wrapper">
                            <div className="row-driver" style={{
                                marginTop: 10
                            }}>
                                <div className="driver-avatar-container">
                                    <img src={driverSearchCompany?.selectedDriver?.avatar ? props.serverUrl + '/avatars/' + driverSearchCompany?.selectedDriver?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                                <div className="driver-data">
                                    <div className="driver-name" style={{
                                        textTransform: 'capitalize'
                                    }}>
                                        {(driverSearchCompany?.selectedDriver?.prefix || '') + " " + (driverSearchCompany?.selectedDriver?.first_name || '') + " " + (driverSearchCompany?.selectedDriver?.middle_name || '') + " " + (driverSearchCompany?.selectedDriver?.last_name || '')}
                                    </div>
                                    <div className="online-status">
                                        {isEditingDriver ? tempSelectedDriver.prefix || '' : driverSearchCompany?.selectedDriver?.prefix || ''}
                                        <div className={(isEditingDriver ? tempSelectedDriver.is_online : driverSearchCompany?.selectedDriver?.is_online) === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                        {/* <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div className="row-driver-info">
                                <div className="info-row">
                                    <div className="info-row-label">Driver Number:</div>
                                    <div className="info-row-input">
                                        {driverSearchCompany?.selectedDriver?.id !== undefined
                                            ? 'DV' + driverSearchCompany?.selectedDriver.id.toString().padStart(4, '0')
                                            : ''}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Phone Mobile:</div>
                                    <div className="info-row-input">{driverSearchCompany?.selectedDriver?.phone_mobile || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Driver Manager:</div>
                                    <div className="info-row-input">{driverSearchCompany?.selectedDriver?.driver_manager || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Division:</div>
                                    <div className="info-row-input">{driverSearchCompany?.selectedDriver?.division || '-'}</div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                <div className="driver-form-bg">
                    <div className="driver-form">
                        <div className="driver-form-header">
                            <div className="driver-avatar-container">

                                {
                                    (isEditingDriver && (driverSearchCompany?.selectedDriver?.id || 0) > 0 && (driverSearchCompany?.selectedDriver?.avatar || '') !== '') && <span className="fas fa-trash-alt remove-driver-avatar-btn" onClick={removeDriverAvatar}></span>
                                }
                                {
                                    (isEditingDriver && (driverSearchCompany?.selectedDriver?.id || 0) > 0) && <span className="fas fa-plus change-driver-avatar-btn" onClick={() => { refInputAvatar.current.click() }}></span>
                                }

                                <form encType='multipart/form-data' style={{ display: 'none' }}>
                                    <input type="file" ref={refInputAvatar} accept='image/*' onChange={driverAvatarChange} />
                                </form>

                                <div className="driver-avatar-wrapper">
                                    <img src={driverSearchCompany?.selectedDriver?.avatar ? props.serverUrl + '/avatars/' + driverSearchCompany?.selectedDriver?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                            </div>
                            <div className="driver-info">
                                <div className="driver-name">
                                    {(driverSearchCompany?.selectedDriver?.prefix || '') + " " + (driverSearchCompany?.selectedDriver?.first_name || '') + " " + (driverSearchCompany?.selectedDriver?.middle_name || '') + " " + (driverSearchCompany?.selectedDriver?.last_name || '')}
                                </div>
                                {/* <div className="driver-code">
                                    {
                                        (driverSearchCompany?.selectedDriver?.id || 0) > 0 &&
                                        <span>
                                            {driverSearchCompany?.selectedDriver?.id !== undefined
                                                ? 'DV' + driverSearchCompany?.selectedDriver.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }
                                </div> */}
                                <div className="driver-company">
                                    <span>
                                        {driverSearchCompany?.selectedDriver?.id !== undefined ? driverSearchCompany.name : ''}
                                    </span>

                                    <span>
                                        {(driverSearchCompany?.selectedDriver?.title || '')}
                                    </span>

                                    <span>
                                        {(driverSearchCompany?.selectedDriver?.department || '')}
                                    </span>
                                </div>

                                <div className="driver-username-info">
                                    <div className="username-chat">
                                        <div className="driver-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>

                                    {/* <div className="username-video">
                                        <div className="driver-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="driver-buttons">
                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingDriver &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingDriver(false);
                                            setTempSelectedDriver({});
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingDriver &&
                                        <div className="mochi-button" onClick={saveDriver}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isEditingDriver &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingDriver(true);
                                            setTempSelectedDriver({ ...driverSearchCompany?.selectedDriver });
                                        }} style={{
                                            color: driverSearchCompany?.selectedDriver?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: driverSearchCompany?.selectedDriver?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <div className="mochi-button" onClick={deleteDriver} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: (driverSearchCompany?.selectedDriver?.id !== undefined && driverSearchCompany?.selectedDriver?.id > 0) ? 'all' : 'none'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base" style={{ color: (driverSearchCompany?.selectedDriver?.id !== undefined && driverSearchCompany?.selectedDriver?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>

                                <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {
                                    if ((driverSearchCompany?.selectedDriver?.id || 0) > 0) {
                                        let panel = {
                                            panelName: `${props.panelName}-driver-documents`,
                                            component: <Documents
                                                title='Documents'
                                                tabTimes={626000 + props.tabTimes}
                                                panelName={`${props.panelName}-driver-documents`}
                                                origin={props.origin}
                                                suborigin={'company-driver'}
                                                
                                                
                                                componentId={moment().format('x')}
                                                selectedOwner={{ ...driverSearchCompany.selectedDriver }}
                                                selectedOwnerDocument={{
                                                    id: 0,
                                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                    date_entered: moment().format('MM/DD/YYYY')
                                                }}
                                                savingDocumentUrl='/saveDriverDocument'
                                                deletingDocumentUrl='/deleteDriverDocument'
                                                savingDocumentNoteUrl='/saveDriverDocumentNote'
                                                deletingDocumentNoteUrl='/deleteDriverDocumentNote'
                                                serverDocumentsFolder='/driver-documents/'
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    } else {
                                        window.alert('You must select an driver first!');
                                    }
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Documents</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                        </div>
                        <div className="driver-form-fields">
                            <div className="col-driver-form">
                                <div className="driver-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, prefix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, prefix: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.prefix || '' : driverSearchCompany?.selectedDriver?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, first_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, first_name: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.first_name || '' : driverSearchCompany?.selectedDriver?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, middle_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, middle_name: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.middle_name || '' : driverSearchCompany?.selectedDriver?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, last_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, last_name: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.last_name || '' : driverSearchCompany?.selectedDriver?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, suffix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, suffix: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.suffix || '' : driverSearchCompany?.selectedDriver?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={driverSearchCompany?.selectedDriver?.id !== undefined ? driverSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, title: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, title: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.title || '' : driverSearchCompany?.selectedDriver?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, department: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, department: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.department || '' : driverSearchCompany?.selectedDriver?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_work: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_work: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.email_work || '' : driverSearchCompany?.selectedDriver?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.email_personal || '' : driverSearchCompany?.selectedDriver?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_other: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, email_other: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.email_other || '' : driverSearchCompany?.selectedDriver?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_work: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_work: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_work || '' : driverSearchCompany?.selectedDriver?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_ext: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_ext: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_ext || '' : driverSearchCompany?.selectedDriver?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_work_fax: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_work_fax: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_work_fax || '' : driverSearchCompany?.selectedDriver?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_mobile: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_mobile: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_mobile || '' : driverSearchCompany?.selectedDriver?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_direct: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_direct: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_direct || '' : driverSearchCompany?.selectedDriver?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_other: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, phone_other: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.phone_other || '' : driverSearchCompany?.selectedDriver?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, country: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, country: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.country || '' : driverSearchCompany?.selectedDriver?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, address1: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, address1: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.address1 || '' : driverSearchCompany?.selectedDriver?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, address2: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, address2: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.address2 || '' : driverSearchCompany?.selectedDriver?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingDriver} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, city: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, city: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.city || '' : driverSearchCompany?.selectedDriver?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, state: e.target.value.toUpperCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, state: e.target.value.toUpperCase() });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.state || '' : driverSearchCompany?.selectedDriver?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, zip_code: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, zip_code: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.zip_code || '' : driverSearchCompany?.selectedDriver?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, birthday: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, birthday: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.birthday || '' : driverSearchCompany?.selectedDriver?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, website: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, website: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.website || '' : driverSearchCompany?.selectedDriver?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, notes: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, notes: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.notes || '' : driverSearchCompany?.selectedDriver?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-driver-splitter">

                            </div>
                            <div className="col-driver-info" >
                                <div className="col-title">Driver Info</div>

                                <div className="driver-info-wrapper" ref={refDriverInfoWrapper} onScroll={(e) => {
                                    if (refExpirationDateCalendarDropDown.current) {
                                        refExpirationDateCalendarDropDown.current.style.top = `${125 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refHireDateCalendarDropDown.current) {
                                        refHireDateCalendarDropDown.current.style.top = `${250 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refTerminationDateCalendarDropDown.current) {
                                        refTerminationDateCalendarDropDown.current.style.top = `${310 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refPhysicalDateCalendarDropDown.current) {
                                        refPhysicalDateCalendarDropDown.current.style.top = `${370 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refRenewalDateCalendarDropDown.current) {
                                        refRenewalDateCalendarDropDown.current.style.top = `${430 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refDrugTestDateCalendarDropDown.current) {
                                        refDrugTestDateCalendarDropDown.current.style.top = `${490 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refPerHourPerDayUnitDropDown.current) {
                                        refPerHourPerDayUnitDropDown.current.style.top = `${610 + (-refDriverInfoWrapper.current.scrollTop)}px`;
                                    }
                                }}>
                                    <div className="field-container">
                                        <div className="field-title">Unit Number</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, unit_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, unit_number: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.unit_number || '' : driverSearchCompany?.selectedDriver?.unit_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Trailer Number</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, trailer_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, trailer_number: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.trailer_number || '' : driverSearchCompany?.selectedDriver?.trailer_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Tractor Plate</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, tractor_plate: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, tractor_plate: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.tractor_plate || '' : driverSearchCompany?.selectedDriver?.tractor_plate || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Trailer Plate</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, trailer_plate: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, trailer_plate: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.trailer_plate || '' : driverSearchCompany?.selectedDriver?.trailer_plate || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Driver's License Number</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, drivers_license_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, drivers_license_number: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.drivers_license_number || '' : driverSearchCompany?.selectedDriver?.drivers_license_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, driver_state: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, driver_state: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.driver_state || '' : driverSearchCompany?.selectedDriver?.driver_state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Expiration Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownExpirationDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            expiration_date: getFormattedDates(tempSelectedDriver?.expiration_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            expiration_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            expiration_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.expiration_date || '' : driverSearchCompany?.selectedDriver?.expiration_date || ''}
                                                    ref={refExpirationDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);


                                                        if (isExpirationDateCalendarShown) {
                                                            setIsExpirationDateCalendarShown(false);
                                                        } else {
                                                            setIsExpirationDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.expiration_date || '').trim()) {
                                                            setPreSelectedExpirationDate(moment(tempSelectedDriver?.expiration_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedExpirationDate(moment());
                                                        }

                                                        refExpirationDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Endorsements</div>
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, endorsements: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, endorsements: e.target.value });
                                            }}
                                            value={isEditingDriver ? tempSelectedDriver.endorsements || '' : driverSearchCompany?.selectedDriver?.endorsements || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Hire Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownHireDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            hire_date: getFormattedDates(tempSelectedDriver?.hire_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            hire_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            hire_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.hire_date || '' : driverSearchCompany?.selectedDriver?.hire_date || ''}
                                                    ref={refHireDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);

                                                        if (isHireDateCalendarShown) {
                                                            setIsHireDateCalendarShown(false);
                                                        } else {
                                                            setIsHireDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.hire_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.hire_date || '').trim()) {
                                                            setPreSelectedHireDate(moment(tempSelectedDriver?.hire_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedHireDate(moment());
                                                        }

                                                        refHireDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Termination Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownTerminationDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            termination_date: getFormattedDates(tempSelectedDriver?.termination_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            termination_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            termination_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.termination_date || '' : driverSearchCompany?.selectedDriver?.termination_date || ''}
                                                    ref={refTerminationDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);

                                                        if (isTerminationDateCalendarShown) {
                                                            setIsTerminationDateCalendarShown(false);
                                                        } else {
                                                            setIsTerminationDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.termination_date || '').trim()) {
                                                            setPreSelectedTerminationDate(moment(tempSelectedDriver?.termination_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedTerminationDate(moment());
                                                        }

                                                        refTerminationDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Physical Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownPhysicalDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            physical_date: getFormattedDates(tempSelectedDriver?.physical_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            physical_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            physical_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.physical_date || '' : driverSearchCompany?.selectedDriver?.physical_date || ''}
                                                    ref={refPhysicalDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);

                                                        if (isPhysicalDateCalendarShown) {
                                                            setIsPhysicalDateCalendarShown(false);
                                                        } else {
                                                            setIsPhysicalDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.physical_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.physical_date || '').trim()) {
                                                            setPreSelectedPhysicalDate(moment(tempSelectedDriver?.physical_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedPhysicalDate(moment());
                                                        }

                                                        refPhysicalDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Renewal Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownRenewalDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            renewal_date: getFormattedDates(tempSelectedDriver?.renewal_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            renewal_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            renewal_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.renewal_date || '' : driverSearchCompany?.selectedDriver?.renewal_date || ''}
                                                    ref={refRenewalDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);

                                                        if (isRenewalDateCalendarShown) {
                                                            setIsRenewalDateCalendarShown(false);
                                                        } else {
                                                            setIsRenewalDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.renewal_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.renewal_date || '').trim()) {
                                                            setPreSelectedRenewalDate(moment(tempSelectedDriver?.renewal_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedRenewalDate(moment());
                                                        }

                                                        refRenewalDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Drug Test Date</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput tabIndex={88 + props.tabTimes}
                                                    readOnly={!isEditingDriver}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownDrugTestDate}
                                                    onBlur={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            drug_test_date: getFormattedDates(tempSelectedDriver?.drug_test_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            drug_test_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            drug_test_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingDriver ? tempSelectedDriver.drug_test_date || '' : driverSearchCompany?.selectedDriver?.drug_test_date || ''}
                                                    ref={refDrugTestDate}
                                                />

                                                {isEditingDriver &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setShowPerHourPerDayUnitItems(false);

                                                        if (isDrugTestDateCalendarShown) {
                                                            setIsDrugTestDateCalendarShown(false);
                                                        } else {
                                                            setIsDrugTestDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedDriver?.drug_test_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.drug_test_date || '').trim()) {
                                                            setPreSelectedDrugTestDate(moment(tempSelectedDriver?.drug_test_date, 'MM/DD/YYYY'));
                                                        } else {
                                                            setPreSelectedDrugTestDate(moment());
                                                        }

                                                        refDrugTestDate.current.inputElement.focus();
                                                    }} />
                                                }

                                            </div>

                                        </div>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Pay Rate $</div>
                                        <MaskedInput
                                            readOnly={!isEditingDriver}
                                            ref={refPerHourPerDay}
                                            style={{ textAlign: 'left', paddingRight: (isEditingDriver ? tempSelectedDriver.pay_rate || '' : driverSearchCompany?.selectedDriver?.pay_rate || '') !== '' ? 40 : 0 }}
                                            mask={numberMask}
                                            type="text"
                                            guide={false}
                                            value={
                                                isEditingDriver
                                                    ? tempSelectedDriver?.pay_rate || ''
                                                    : driverSearchCompany?.selectedDriver?.pay_rate || ''
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === '.') {
                                                    if (e.target.value.includes('.')) {
                                                        e.preventDefault();
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                new Promise((resolve, reject) => {
                                                    if (e.target.value.includes('.')) {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            pay_rate: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                                        })
                                                    }
                                                }).then(response => {
                                                    setTempSelectedDriver({ ...tempSelectedDriver });
                                                }).catch(e => {

                                                });
                                            }}
                                            onChange={(e) => {
                                                setTempSelectedDriver({
                                                    ...tempSelectedDriver,
                                                    pay_rate: e.target.value
                                                })
                                            }}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Per Hour/Per Day $</div>
                                        <div className="select-box-container">
                                            <div className="select-box-wrapper" style={{
                                                borderRadius: 0,
                                                border: 0,
                                                backgroundColor: 'transparent',
                                                padding: 0
                                            }}>
                                                <MaskedInput
                                                    readOnly={!isEditingDriver}
                                                    ref={refPerHourPerDay}
                                                    style={{ textAlign: 'left', paddingRight: (isEditingDriver ? tempSelectedDriver.per_hour_per_day || '' : driverSearchCompany?.selectedDriver?.per_hour_per_day || '') !== '' ? 40 : 0 }}
                                                    mask={numberMask}
                                                    type="text"
                                                    guide={false}
                                                    value={
                                                        isEditingDriver
                                                            ? tempSelectedDriver.per_hour_per_day || ''
                                                            : driverSearchCompany?.selectedDriver?.per_hour_per_day || ''
                                                    }
                                                    onKeyDown={(e) => {
                                                        let key = e.keyCode || e.which;

                                                        if (isEditingDriver) {
                                                            if (key === 72) {
                                                                e.preventDefault();
                                                                setTempSelectedDriver({
                                                                    ...tempSelectedDriver,
                                                                    per_hour_per_day_unit: 'hr'
                                                                })
                                                            } else if (key === 68) {
                                                                e.preventDefault();
                                                                setTempSelectedDriver({
                                                                    ...tempSelectedDriver,
                                                                    per_hour_per_day_unit: 'day'
                                                                })
                                                            } else if (key === 38) {
                                                                e.preventDefault();
                                                                if (showPerHourPerDayUnitItems) {
                                                                    let selectedIndex = perHourPerDayUnitItems.findIndex(item => item.selected);

                                                                    if (selectedIndex === -1) {
                                                                        setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                            item.selected = index === 0;
                                                                            return item;
                                                                        }))
                                                                    } else {
                                                                        setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                            if (selectedIndex === 0) {
                                                                                item.selected = index === (perHourPerDayUnitItems.length - 1);
                                                                            } else {
                                                                                item.selected = index === (selectedIndex - 1);
                                                                            }
                                                                            return item;
                                                                        }))
                                                                    }
                                                                } else {
                                                                    setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                        item.selected = (tempSelectedDriver.per_hour_per_day_unit || '') === item.value
                                                                        return item;
                                                                    }))

                                                                    setShowPerHourPerDayUnitItems(true)
                                                                }

                                                                refPerHourPerDayUnitPopupItems.current.map((r, i) => {
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
                                                                if (showPerHourPerDayUnitItems) {
                                                                    let selectedIndex = perHourPerDayUnitItems.findIndex(item => item.selected);

                                                                    if (selectedIndex === -1) {
                                                                        setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                            item.selected = index === 0;
                                                                            return item;
                                                                        }))
                                                                    } else {
                                                                        setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                            if (selectedIndex === (perHourPerDayUnitItems.length - 1)) {
                                                                                item.selected = index === 0;
                                                                            } else {
                                                                                item.selected = index === (selectedIndex + 1);
                                                                            }
                                                                            return item;
                                                                        }))
                                                                    }
                                                                } else {
                                                                    setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                        item.selected = (tempSelectedDriver.per_hour_per_day_unit || '') === item.value
                                                                        return item;
                                                                    }))

                                                                    setShowPerHourPerDayUnitItems(true)
                                                                }

                                                                refPerHourPerDayUnitPopupItems.current.map((r, i) => {
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
                                                                setShowPerHourPerDayUnitItems(false);
                                                                setTempSelectedDriver({
                                                                    ...tempSelectedDriver,
                                                                    per_hour_per_day_unit: ''
                                                                })
                                                            } else if (key === 13) {
                                                                if (showPerHourPerDayUnitItems && perHourPerDayUnitItems.findIndex(item => item.selected) > -1) {
                                                                    setTempSelectedDriver({
                                                                        ...tempSelectedDriver,
                                                                        per_hour_per_day_unit: perHourPerDayUnitItems[perHourPerDayUnitItems.findIndex(item => item.selected)].value
                                                                    })

                                                                    window.setTimeout(() => {
                                                                        setShowPerHourPerDayUnitItems(false);
                                                                        refPerHourPerDay.current.inputElement.focus();
                                                                    }, 0);
                                                                }
                                                            } else if (key === 9) {
                                                                if (showPerHourPerDayUnitItems) {
                                                                    e.preventDefault();
                                                                    setTempSelectedDriver({
                                                                        ...tempSelectedDriver,
                                                                        per_hour_per_day_unit: perHourPerDayUnitItems[perHourPerDayUnitItems.findIndex(item => item.selected)].value
                                                                    })

                                                                    window.setTimeout(() => {
                                                                        setShowPerHourPerDayUnitItems(false);
                                                                        refPerHourPerDay.current.inputElement.focus();
                                                                    }, 0);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === '.') {
                                                            if (e.target.value.includes('.')) {
                                                                e.preventDefault();
                                                            }
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        new Promise((resolve, reject) => {
                                                            if (e.target.value.includes('.')) {
                                                                setTempSelectedDriver({
                                                                    ...tempSelectedDriver,
                                                                    per_hour_per_day: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                                                })
                                                            }
                                                        }).then(response => {
                                                            setTempSelectedDriver({ ...tempSelectedDriver });
                                                        }).catch(e => {

                                                        });
                                                    }}
                                                    onChange={(e) => {
                                                        setTempSelectedDriver({
                                                            ...tempSelectedDriver,
                                                            per_hour_per_day: e.target.value
                                                        })
                                                    }}
                                                />
                                                {
                                                    ((tempSelectedDriver?.per_hour_per_day || '') !== '' || (driverSearchCompany?.selectedDriver?.per_hour_per_day || '') !== '') &&
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '25px',
                                                        transform: 'translateY(-50%)',
                                                        fontSize: '0.9rem',
                                                        fontFamily: 'Mochi Med Oblique',
                                                        fontWeight: 'regular'
                                                    }}>{isEditingDriver ? tempSelectedDriver?.per_hour_per_day_unit || '' : driverSearchCompany?.selectedDriver?.per_hour_per_day_unit || ''}</div>
                                                }
                                                {
                                                    ((tempSelectedDriver?.per_hour_per_day || '') !== '' || (driverSearchCompany?.selectedDriver?.per_hour_per_day || '') !== '') &&
                                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                                        if (isEditingDriver) {
                                                            setIsExpirationDateCalendarShown(false);
                                                            setIsHireDateCalendarShown(false);
                                                            setIsTerminationDateCalendarShown(false);
                                                            setIsPhysicalDateCalendarShown(false);
                                                            setIsRenewalDateCalendarShown(false);
                                                            setIsDrugTestDateCalendarShown(false);


                                                            if (showPerHourPerDayUnitItems) {
                                                                setShowPerHourPerDayUnitItems(false);
                                                            } else {
                                                                setPerHourPerDayUnitItems(perHourPerDayUnitItems.map((item, index) => {
                                                                    item.selected = (tempSelectedDriver.per_hour_per_day_unit || '') === item.value;
                                                                    return item;
                                                                }))

                                                                window.setTimeout(() => {
                                                                    setShowPerHourPerDayUnitItems(true);

                                                                    refPerHourPerDayUnitPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains('selected')) {
                                                                            r.scrollIntoView({
                                                                                behavior: 'auto',
                                                                                block: 'center',
                                                                                inline: 'nearest'
                                                                            })
                                                                        }
                                                                        return true;
                                                                    });
                                                                }, 0);
                                                            }

                                                            refPerHourPerDay.current.inputElement.focus();
                                                        }
                                                    }} />
                                                }
                                            </div>
                                        </div>

                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                                {
                                    expirationDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-expiration-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${125 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refExpirationDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.expiration_date || '').trim()
                                                                ? moment(tempSelectedDriver?.expiration_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, expiration_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsExpirationDateCalendarShown(false); }}
                                                            preDay={preSelectedExpirationDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedExpirationDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    hireDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-hire-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${250 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refHireDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.hire_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.hire_date || '').trim()
                                                                ? moment(tempSelectedDriver?.hire_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, hire_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsHireDateCalendarShown(false); }}
                                                            preDay={preSelectedHireDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedHireDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    terminationDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-termination-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${310 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refTerminationDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.termination_date || '').trim()
                                                                ? moment(tempSelectedDriver?.termination_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, termination_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsTerminationDateCalendarShown(false); }}
                                                            preDay={preSelectedTerminationDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedTerminationDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    physicalDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-physical-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${370 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refPhysicalDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.physical_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.physical_date || '').trim()
                                                                ? moment(tempSelectedDriver?.physical_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, physical_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsPhysicalDateCalendarShown(false); }}
                                                            preDay={preSelectedPhysicalDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedPhysicalDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    renewalDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-renewal-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${430 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refRenewalDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.renewal_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.renewal_date || '').trim()
                                                                ? moment(tempSelectedDriver?.renewal_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, renewal_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsRenewalDateCalendarShown(false); }}
                                                            preDay={preSelectedRenewalDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedRenewalDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    drugTestDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-drug-test-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${490 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refDrugTestDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedDriver?.drug_test_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedDriver?.drug_test_date || '').trim()
                                                                ? moment(tempSelectedDriver?.drug_test_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedDriver({ ...tempSelectedDriver, drug_test_date: day.format('MM/DD/YYYY') });
                                                            }}
                                                            closeCalendar={() => { setIsDrugTestDateCalendarShown(false); }}
                                                            preDay={preSelectedDrugTestDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedDrugTestDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }

                                {
                                    perHourPerDayTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-per-hour-per-day"
                                            style={{
                                                ...style,
                                                left: 'calc(100% - 330px)',
                                                top: `${740 + (-refDriverInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refPerHourPerDayUnitDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above left corner" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            perHourPerDayUnitItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (tempSelectedDriver.per_hour_per_day_unit || '') === '' && (tempSelectedDriver.per_hour_per_day_unit || '') !== ''
                                                                    ? tempSelectedDriver.per_hour_per_day_unit : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={() => {
                                                                            setTempSelectedDriver({
                                                                                ...tempSelectedDriver,
                                                                                per_hour_per_day_unit: item.value
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                setShowPerHourPerDayUnitItems(false);
                                                                                refPerHourPerDay.current.inputElement.focus();
                                                                            }, 0);
                                                                        }}
                                                                        ref={ref => refPerHourPerDayUnitPopupItems.current.push(ref)}
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
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className="mochi-button" onClick={() => {
                            setDriverSearchCompany({ ...driverSearchCompany, selectedDriver: { id: 0, company_id: driverSearchCompany.id } });
                            setTempSelectedDriver({ id: 0, company_id: driverSearchCompany.id });

                            setIsEditingDriver(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Driver
                            </div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
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

    setSelectedCompany,
    setSelectedDriver
})(Drivers)