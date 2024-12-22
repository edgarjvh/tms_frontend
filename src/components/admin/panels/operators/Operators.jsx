/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './Operators.css';
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
    setSelectedOwnerOperator as setSelectedOperator
} from './../../../../actions';

import { Documents, Calendar } from './../../../company/panels';

const Operators = (props) => {
    const refOperatorsContainer = useRef();
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const refOperatorInfoWrapper = useRef();
    const [tempSelectedOperator, setTempSelectedOperator] = useState({});
    const [isEditingOperator, setIsEditingOperator] = useState(false);
    const [operatorSearchCompany, setOperatorSearchCompany] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingOperator
    });

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

    useEffect(() => {
        setOperatorSearchCompany(props.operatorSearchCompany || {});

        if (props.isEditingOperator) {
            setIsEditingOperator(true);
            refPrefix.current.focus({
                preventScroll: true
            });
        }else{
            refOperatorsContainer.current.focus({ preventScroll: true });
        }
    }, [])

    const saveOperator = () => {
        let operator = operatorSearchCompany?.selectedOperator;

        if ((tempSelectedOperator.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((tempSelectedOperator.last_name || '').trim() === '') {
            window.alert('You must enter the last name!');
            return;
        }

        if ((tempSelectedOperator.phone_work || '').trim() === '' &&
            (tempSelectedOperator.phone_work_fax || '').trim() === '' &&
            (tempSelectedOperator.phone_mobile || '').trim() === '' &&
            (tempSelectedOperator.phone_direct || '').trim() === '' &&
            (tempSelectedOperator.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempSelectedOperator.primary_phone) {
            case 'work':
                if ((tempSelectedOperator.phone_work || '').trim() === '') {
                    tempSelectedOperator.primary_phone = (tempSelectedOperator.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedOperator.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedOperator.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedOperator.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempSelectedOperator.phone_work_fax || '').trim() === '') {
                    tempSelectedOperator.primary_phone = (tempSelectedOperator.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedOperator.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedOperator.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempSelectedOperator.phone_mobile || '').trim() === '') {
                    tempSelectedOperator.primary_phone = (tempSelectedOperator.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedOperator.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedOperator.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempSelectedOperator.phone_direct || '').trim() === '') {
                    tempSelectedOperator.primary_phone = (tempSelectedOperator.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedOperator.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedOperator.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedOperator.phone_other || '').trim() === '') {
                    tempSelectedOperator.primary_phone = (tempSelectedOperator.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedOperator.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedOperator.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempSelectedOperator.primary_phone = 'work'
                break;
        }

        switch (tempSelectedOperator.primary_email) {
            case 'work':
                if ((tempSelectedOperator.email_work || '').trim() === '') {
                    tempSelectedOperator.primary_email = (tempSelectedOperator.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedOperator.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempSelectedOperator.email_personal || '').trim() === '') {
                    tempSelectedOperator.primary_email = (tempSelectedOperator.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedOperator.email_other || '').trim() === '') {
                    tempSelectedOperator.primary_email = (tempSelectedOperator.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedOperator.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempSelectedOperator.primary_email = 'work'
                break;
        }

        if ((tempSelectedOperator.address1 || '').trim() === '' && (tempSelectedOperator.address2 || '').trim() === '') {
            tempSelectedOperator.address1 = operatorSearchCompany.address1;
            tempSelectedOperator.address2 = operatorSearchCompany.address2;
            tempSelectedOperator.city = operatorSearchCompany.city;
            tempSelectedOperator.state = operatorSearchCompany.state;
            tempSelectedOperator.zip_code = operatorSearchCompany.zip;
        }

        axios.post(props.serverUrl + props.savingOperatorUrl, tempSelectedOperator).then(res => {
            if (res.data.result === 'OK') {
                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.operator.company_id || 0), operators: res.data.operators });
                props.setSelectedOperator(res.data.operator);

                setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: res.data.operator, operators: res.data.operators });
                setIsEditingOperator(false);
            }
        }).catch(e => {
            console.log('error saving operator', e);
        });
    }

    const deleteOperator = () => {
        let operator = operatorSearchCompany?.selectedOperator;

        if (window.confirm('Are you sure to delete this operator?')) {
            axios.post(props.serverUrl + props.deletingOperatorUrl, operator).then(res => {
                if (res.data.result === 'OK') {
                    props.setSelectedCompany({ ...props.selectedCompany, operators: res.data.operators });
                    props.setSelectedOperator({ id: operator.id, deleted: true });

                    setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: {}, operators: res.data.operators });
                    setIsEditingOperator(false);
                }
            }).catch(e => {
                console.log('error deleting operator', e);
            });
        }
    }

    const operatorAvatarChange = (e) => {
        let files = e.target.files;
        const maxSize = 3145728;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 3mb");
                return;
            }

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("operator_id", operatorSearchCompany?.selectedOperator?.id);
            formData.append("company_id", operatorSearchCompany.id);

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
                            operators: res.data.operators
                        });

                        await setOperatorSearchCompany(operatorSearchCompany => {
                            return {
                                ...operatorSearchCompany,
                                selectedOperator: res.data.operator,
                                operators: res.data.operators
                            }
                        });
                    }
                    refInputAvatar.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing operator avatar", err);
                    refInputAvatar.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeOperatorAvatar = (e) => {
        axios.post(props.serverUrl + props.removeAvatarUrl, operatorSearchCompany?.selectedOperator).then(async res => {
            if (res.data.result === "OK") {
                props.setSelectedCompany({ ...props.selectedCompany, operators: res.data.operators });

                await setOperatorSearchCompany(operatorSearchCompany => {
                    return {
                        ...operatorSearchCompany,
                        selectedOperator: res.data.operator,
                        operators: res.data.operators
                    }
                });
            }
        }).catch(e => {
            console.log('error removig operator avatar', e);
        });
    }

    const onKeyDownExpirationDate = async (e) => {
        let key = e.keyCode || e.which;


        if (key === 13) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.expiration_date || ''), 'MM/DD/YYYY');
            await setPreSelectedExpirationDate(expiration_date);

            if (isExpirationDateCalendarShown) {
                expiration_date = preSelectedExpirationDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.expiration_date = expiration_date;

                await setTempSelectedOperator(tempOperator);

                await setIsExpirationDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.expiration_date || ''), 'MM/DD/YYYY');
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
            let hire_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.hire_date || ''), 'MM/DD/YYYY');
            await setPreSelectedHireDate(hire_date);

            if (isHireDateCalendarShown) {
                hire_date = preSelectedHireDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.hire_date = hire_date;

                await setTempSelectedOperator(tempOperator);

                await setIsHireDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let hire_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.hire_date || ''), 'MM/DD/YYYY');
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
            let termination_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.termination_date || ''), 'MM/DD/YYYY');
            await setPreSelectedTerminationDate(termination_date);

            if (isTerminationDateCalendarShown) {
                termination_date = preSelectedTerminationDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.termination_date = termination_date;

                await setTempSelectedOperator(tempOperator);

                await setIsTerminationDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let termination_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.termination_date || ''), 'MM/DD/YYYY');
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
            let physical_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.physical_date || ''), 'MM/DD/YYYY');
            await setPreSelectedPhysicalDate(physical_date);

            if (isPhysicalDateCalendarShown) {
                physical_date = preSelectedPhysicalDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.physical_date = physical_date;

                await setTempSelectedOperator(tempOperator);

                await setIsPhysicalDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let physical_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.physical_date || ''), 'MM/DD/YYYY');
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
            let renewal_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.renewal_date || ''), 'MM/DD/YYYY');
            await setPreSelectedRenewalDate(renewal_date);

            if (isRenewalDateCalendarShown) {
                renewal_date = preSelectedRenewalDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.renewal_date = renewal_date;

                await setTempSelectedOperator(tempOperator);

                await setIsRenewalDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let renewal_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.renewal_date || ''), 'MM/DD/YYYY');
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
            let drug_test_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.drug_test_date || ''), 'MM/DD/YYYY');
            await setPreSelectedDrugTestDate(drug_test_date);

            if (isDrugTestDateCalendarShown) {
                drug_test_date = preSelectedDrugTestDate.clone().format('MM/DD/YYYY');

                let tempOperator = { ...tempSelectedOperator };
                tempOperator.drug_test_date = drug_test_date;

                await setTempSelectedOperator(tempOperator);

                await setIsDrugTestDateCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let drug_test_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(tempSelectedOperator?.drug_test_date || ''), 'MM/DD/YYYY');
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
        <div className="panel-content" ref={refOperatorsContainer} tabIndex={0} onKeyDown={e => {
            if (e.key === 'Escape'){
                e.stopPropagation();
                props.closingCallback();
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>

            <div className="operator-container" style={{ overflow: 'initial' }}>
                <div className="operator-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="operator-list">
                        <div className="operator-list-wrapper">
                            <div className="row-operator" style={{
                                marginTop: 10
                            }}>
                                <div className="operator-avatar-container">
                                    <img src={operatorSearchCompany?.selectedOperator?.avatar ? props.serverUrl + '/avatars/' + operatorSearchCompany?.selectedOperator?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                                <div className="operator-data">
                                    <div className="operator-name" style={{
                                        textTransform: 'capitalize'
                                    }}>
                                        {(operatorSearchCompany?.selectedOperator?.prefix || '') + " " + (operatorSearchCompany?.selectedOperator?.first_name || '') + " " + (operatorSearchCompany?.selectedOperator?.middle_name || '') + " " + (operatorSearchCompany?.selectedOperator?.last_name || '')}
                                    </div>
                                    <div className="online-status">
                                        {isEditingOperator ? tempSelectedOperator.prefix || '' : operatorSearchCompany?.selectedOperator?.prefix || ''}
                                        <div className={(isEditingOperator ? tempSelectedOperator.is_online : operatorSearchCompany?.selectedOperator?.is_online) === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
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

                            <div className="row-operator-info">
                                <div className="info-row">
                                    <div className="info-row-label">O/O Number:</div>
                                    <div className="info-row-input">
                                        {operatorSearchCompany?.selectedOperator?.id !== undefined
                                            ? 'OP' + operatorSearchCompany?.selectedOperator.id.toString().padStart(4, '0')
                                            : ''}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Phone Mobile:</div>
                                    <div className="info-row-input">{operatorSearchCompany?.selectedOperator?.phone_mobile || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">E-Mail:</div>
                                    <div className="info-row-input">{operatorSearchCompany?.selectedOperator?.email_work || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Driver Manager:</div>
                                    <div className="info-row-input" style={{
                                        textTransform: 'capitalize'
                                    }}>{operatorSearchCompany?.selectedOperator?.operator_manager || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Division:</div>
                                    <div className="info-row-input" style={{
                                        textTransform: 'capitalize'
                                    }}>{operatorSearchCompany?.selectedOperator?.division || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Does O/O Own Units?:</div>
                                    <div className="info-row-input">
                                        <div className="input-option">
                                            <input type="radio" id='operator-own-unit-yes' name='operator-own-unit' checked={(operatorSearchCompany?.selectedOperator?.operator_own_units || 0) === 1}
                                                onChange={e => {
                                                    setOperatorSearchCompany(operatorSearchCompany => {
                                                        return {
                                                            ...operatorSearchCompany,
                                                            selectedOperator: {
                                                                ...operatorSearchCompany.selectedOperator,
                                                                operator_own_units: e.target.checked ? 1 : 0
                                                            }
                                                        }
                                                    })

                                                    if ((operatorSearchCompany?.selectedOperator?.id || 0) > 0) {
                                                        axios.post(props.serverUrl + props.savingOperatorUrl, {
                                                            ...operatorSearchCompany.selectedOperator,
                                                            operator_own_units: e.target.checked ? 1 : 0
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.operator.company_id || 0), operators: res.data.operators });
                                                                props.setSelectedOperator(res.data.operator);

                                                                setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: res.data.operator, operators: res.data.operators });
                                                                setIsEditingOperator(false);
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving operator', e);
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="operator-own-unit-yes">Yes</label>
                                        </div>

                                        <div className="input-option" style={{ marginLeft: 15 }}>
                                            <input type="radio" id='operator-own-unit-no' name='operator-own-unit' checked={(operatorSearchCompany?.selectedOperator?.operator_own_units || 0) === 0}
                                                onChange={e => {
                                                    setOperatorSearchCompany(operatorSearchCompany => {
                                                        return {
                                                            ...operatorSearchCompany,
                                                            selectedOperator: {
                                                                ...operatorSearchCompany.selectedOperator,
                                                                operator_own_units: e.target.checked ? 0 : 1
                                                            }
                                                        }
                                                    })

                                                    if ((operatorSearchCompany?.selectedOperator?.id || 0) > 0) {
                                                        axios.post(props.serverUrl + props.savingOperatorUrl, {
                                                            ...operatorSearchCompany.selectedOperator,
                                                            operator_own_units: e.target.checked ? 0 : 1
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.operator.company_id || 0), operators: res.data.operators });
                                                                props.setSelectedOperator(res.data.operator);

                                                                setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: res.data.operator, operators: res.data.operators });
                                                                setIsEditingOperator(false);
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving operator', e);
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="operator-own-unit-no">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Carrier Code:</div>
                                    <div className="info-row-input">
                                        {(operatorSearchCompany?.selectedOperator?.carrier_code || '') === '' ? '-' : operatorSearchCompany?.selectedOperator?.carrier_code + ((operatorSearchCompany?.selectedOperator?.carrier_code_number || 0) === 0 ? '' : operatorSearchCompany?.selectedOperator?.carrier_code_number)}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Operator Pay Own Units:</div>
                                    <div className="info-row-input">{operatorSearchCompany?.selectedOperator?.operator_pay_own_units || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="operator-form-bg">
                    <div className="operator-form">
                        <div className="operator-form-header">
                            <div className="operator-avatar-container">

                                {
                                    (isEditingOperator && (operatorSearchCompany?.selectedOperator?.id || 0) > 0 && (operatorSearchCompany?.selectedOperator?.avatar || '') !== '') && <span className="fas fa-trash-alt remove-operator-avatar-btn" onClick={removeOperatorAvatar}></span>
                                }
                                {
                                    (isEditingOperator && (operatorSearchCompany?.selectedOperator?.id || 0) > 0) && <span className="fas fa-plus change-operator-avatar-btn" onClick={() => { refInputAvatar.current.click() }}></span>
                                }

                                <form encType='multipart/form-data' style={{ display: 'none' }}>
                                    <input type="file" ref={refInputAvatar} accept='image/*' onChange={operatorAvatarChange} />
                                </form>

                                <div className="operator-avatar-wrapper">
                                    <img src={operatorSearchCompany?.selectedOperator?.avatar ? props.serverUrl + '/avatars/' + operatorSearchCompany?.selectedOperator?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                            </div>
                            <div className="operator-info">
                                <div className="operator-name">
                                    {(operatorSearchCompany?.selectedOperator?.prefix || '') + " " + (operatorSearchCompany?.selectedOperator?.first_name || '') + " " + (operatorSearchCompany?.selectedOperator?.middle_name || '') + " " + (operatorSearchCompany?.selectedOperator?.last_name || '')}
                                </div>
                                {/* <div className="operator-code">
                                    {
                                        (operatorSearchCompany?.selectedOperator?.id || 0) > 0 &&
                                        <span>
                                            {operatorSearchCompany?.selectedOperator?.id !== undefined
                                                ? 'OP' + operatorSearchCompany?.selectedOperator.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }
                                </div> */}
                                <div className="operator-company">
                                    <span>
                                        {operatorSearchCompany?.selectedOperator?.id !== undefined ? operatorSearchCompany.name : ''}
                                    </span>

                                    <span>
                                        {(operatorSearchCompany?.selectedOperator?.title || '')}
                                    </span>

                                    <span>
                                        {(operatorSearchCompany?.selectedOperator?.department || '')}
                                    </span>
                                </div>

                                <div className="operator-username-info">
                                    <div className="username-chat">
                                        <div className="operator-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>

                                    {/* <div className="username-video">
                                        <div className="operator-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="operator-buttons">
                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingOperator &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingOperator(false);
                                            setTempSelectedOperator({});
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingOperator &&
                                        <div className="mochi-button" onClick={saveOperator}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isEditingOperator &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingOperator(true);
                                            setTempSelectedOperator({ ...operatorSearchCompany?.selectedOperator });
                                        }} style={{
                                            color: operatorSearchCompany?.selectedOperator?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: operatorSearchCompany?.selectedOperator?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <div className="mochi-button" onClick={deleteOperator} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: (operatorSearchCompany?.selectedOperator?.id !== undefined && operatorSearchCompany?.selectedOperator?.id > 0) ? 'all' : 'none'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base" style={{ color: (operatorSearchCompany?.selectedOperator?.id !== undefined && operatorSearchCompany?.selectedOperator?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>

                                <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {
                                    if ((operatorSearchCompany?.selectedOperator?.id || 0) > 0) {
                                        let panel = {
                                            panelName: `${props.panelName}-operator-documents`,
                                            component: <Documents
                                                title='Documents'
                                                tabTimes={826000 + props.tabTimes}
                                                panelName={`${props.panelName}-operator-documents`}
                                                origin={props.origin}
                                                suborigin={'company-operator'}
                                                closingCallback={() => {
                                                    closePanel(`${props.panelName}-operator-documents`, props.origin);
                                                    if (isEditingOperator){
                                                        refPrefix.current.focus({ preventScroll: true });
                                                    }else{
                                                        refOperatorsContainer.current.focus({ preventScroll: true });
                                                    }
                                                }}
                                                
                                                componentId={moment().format('x')}
                                                selectedOwner={{ ...operatorSearchCompany.selectedOperator }}
                                                selectedOwnerDocument={{
                                                    id: 0,
                                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                    date_entered: moment().format('MM/DD/YYYY')
                                                }}
                                                savingDocumentUrl='/saveOperatorDocument'
                                                deletingDocumentUrl='/deleteOperatorDocument'
                                                savingDocumentNoteUrl='/saveOperatorDocumentNote'
                                                deletingDocumentNoteUrl='/deleteOperatorDocumentNote'
                                                serverDocumentsFolder='/operator-documents/'
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    } else {
                                        window.alert('You must select an operator first!');
                                    }
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Documents</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                        </div>
                        <div className="operator-form-fields">
                            <div className="col-operator-form">
                                <div className="operator-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, prefix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, prefix: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.prefix || '' : operatorSearchCompany?.selectedOperator?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, first_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, first_name: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.first_name || '' : operatorSearchCompany?.selectedOperator?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, middle_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, middle_name: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.middle_name || '' : operatorSearchCompany?.selectedOperator?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, last_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, last_name: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.last_name || '' : operatorSearchCompany?.selectedOperator?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, suffix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, suffix: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.suffix || '' : operatorSearchCompany?.selectedOperator?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={operatorSearchCompany?.selectedOperator?.id !== undefined ? operatorSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, title: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, title: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.title || '' : operatorSearchCompany?.selectedOperator?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, department: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, department: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.department || '' : operatorSearchCompany?.selectedOperator?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_work: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_work: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.email_work || '' : operatorSearchCompany?.selectedOperator?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.email_personal || '' : operatorSearchCompany?.selectedOperator?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_other: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, email_other: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.email_other || '' : operatorSearchCompany?.selectedOperator?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_work: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_work: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_work || '' : operatorSearchCompany?.selectedOperator?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_ext: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_ext: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_ext || '' : operatorSearchCompany?.selectedOperator?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_work_fax: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_work_fax: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_work_fax || '' : operatorSearchCompany?.selectedOperator?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_mobile: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_mobile: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_mobile || '' : operatorSearchCompany?.selectedOperator?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_direct: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_direct: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_direct || '' : operatorSearchCompany?.selectedOperator?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_other: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, phone_other: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.phone_other || '' : operatorSearchCompany?.selectedOperator?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, country: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, country: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.country || '' : operatorSearchCompany?.selectedOperator?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, address1: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, address1: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.address1 || '' : operatorSearchCompany?.selectedOperator?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, address2: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, address2: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.address2 || '' : operatorSearchCompany?.selectedOperator?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingOperator} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, city: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, city: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.city || '' : operatorSearchCompany?.selectedOperator?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, state: e.target.value.toUpperCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, state: e.target.value.toUpperCase() });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.state || '' : operatorSearchCompany?.selectedOperator?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, zip_code: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, zip_code: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.zip_code || '' : operatorSearchCompany?.selectedOperator?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, birthday: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, birthday: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.birthday || '' : operatorSearchCompany?.selectedOperator?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, website: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, website: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.website || '' : operatorSearchCompany?.selectedOperator?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, notes: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, notes: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.notes || '' : operatorSearchCompany?.selectedOperator?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-operator-splitter">

                            </div>
                            <div className="col-operator-info">
                                <div className="col-title">Operator Info</div>

                                <div className="operator-info-wrapper" ref={refOperatorInfoWrapper} onScroll={(e) => {
                                    if (refExpirationDateCalendarDropDown.current) {
                                        refExpirationDateCalendarDropDown.current.style.top = `${125 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refHireDateCalendarDropDown.current) {
                                        refHireDateCalendarDropDown.current.style.top = `${250 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refTerminationDateCalendarDropDown.current) {
                                        refTerminationDateCalendarDropDown.current.style.top = `${310 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refPhysicalDateCalendarDropDown.current) {
                                        refPhysicalDateCalendarDropDown.current.style.top = `${370 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refRenewalDateCalendarDropDown.current) {
                                        refRenewalDateCalendarDropDown.current.style.top = `${430 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }

                                    if (refDrugTestDateCalendarDropDown.current) {
                                        refDrugTestDateCalendarDropDown.current.style.top = `${490 + (-refOperatorInfoWrapper.current.scrollTop)}px`;
                                    }
                                }}>
                                    <div className="field-container">
                                        <div className="field-title">Unit Number</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, unit_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, unit_number: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.unit_number || '' : operatorSearchCompany?.selectedOperator?.unit_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Trailer Number</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, trailer_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, trailer_number: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.trailer_number || '' : operatorSearchCompany?.selectedOperator?.trailer_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Tractor Plate</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, tractor_plate: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, tractor_plate: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.tractor_plate || '' : operatorSearchCompany?.selectedOperator?.tractor_plate || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Trailer Plate</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, trailer_plate: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, trailer_plate: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.trailer_plate || '' : operatorSearchCompany?.selectedOperator?.trailer_plate || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Driver's License Number</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, drivers_license_number: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, drivers_license_number: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.drivers_license_number || '' : operatorSearchCompany?.selectedOperator?.drivers_license_number || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, operator_state: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, operator_state: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.operator_state || '' : operatorSearchCompany?.selectedOperator?.operator_state || ''}
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownExpirationDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            expiration_date: getFormattedDates(tempSelectedOperator?.expiration_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            expiration_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            expiration_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.expiration_date || '' : operatorSearchCompany?.selectedOperator?.expiration_date || ''}
                                                    ref={refExpirationDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);



                                                        if (isExpirationDateCalendarShown) {
                                                            setIsExpirationDateCalendarShown(false);
                                                        } else {
                                                            setIsExpirationDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.expiration_date || '').trim()) {
                                                            setPreSelectedExpirationDate(moment(tempSelectedOperator?.expiration_date, 'MM/DD/YYYY'));
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
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, endorsements: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedOperator({ ...tempSelectedOperator, endorsements: e.target.value });
                                            }}
                                            value={isEditingOperator ? tempSelectedOperator.endorsements || '' : operatorSearchCompany?.selectedOperator?.endorsements || ''}
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownHireDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            hire_date: getFormattedDates(tempSelectedOperator?.hire_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            hire_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            hire_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.hire_date || '' : operatorSearchCompany?.selectedOperator?.hire_date || ''}
                                                    ref={refHireDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);


                                                        if (isHireDateCalendarShown) {
                                                            setIsHireDateCalendarShown(false);
                                                        } else {
                                                            setIsHireDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.hire_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.hire_date || '').trim()) {
                                                            setPreSelectedHireDate(moment(tempSelectedOperator?.hire_date, 'MM/DD/YYYY'));
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownTerminationDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            termination_date: getFormattedDates(tempSelectedOperator?.termination_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            termination_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            termination_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.termination_date || '' : operatorSearchCompany?.selectedOperator?.termination_date || ''}
                                                    ref={refTerminationDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);


                                                        if (isTerminationDateCalendarShown) {
                                                            setIsTerminationDateCalendarShown(false);
                                                        } else {
                                                            setIsTerminationDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.termination_date || '').trim()) {
                                                            setPreSelectedTerminationDate(moment(tempSelectedOperator?.termination_date, 'MM/DD/YYYY'));
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownPhysicalDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            physical_date: getFormattedDates(tempSelectedOperator?.physical_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            physical_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            physical_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.physical_date || '' : operatorSearchCompany?.selectedOperator?.physical_date || ''}
                                                    ref={refPhysicalDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);


                                                        if (isPhysicalDateCalendarShown) {
                                                            setIsPhysicalDateCalendarShown(false);
                                                        } else {
                                                            setIsPhysicalDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.physical_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.physical_date || '').trim()) {
                                                            setPreSelectedPhysicalDate(moment(tempSelectedOperator?.physical_date, 'MM/DD/YYYY'));
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownRenewalDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            renewal_date: getFormattedDates(tempSelectedOperator?.renewal_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            renewal_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            renewal_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.renewal_date || '' : operatorSearchCompany?.selectedOperator?.renewal_date || ''}
                                                    ref={refRenewalDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsDrugTestDateCalendarShown(false);


                                                        if (isRenewalDateCalendarShown) {
                                                            setIsRenewalDateCalendarShown(false);
                                                        } else {
                                                            setIsRenewalDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.renewal_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.renewal_date || '').trim()) {
                                                            setPreSelectedRenewalDate(moment(tempSelectedOperator?.renewal_date, 'MM/DD/YYYY'));
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
                                                    readOnly={!isEditingOperator}
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={false}
                                                    type="text"
                                                    onKeyDown={onKeyDownDrugTestDate}
                                                    onBlur={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            drug_test_date: getFormattedDates(tempSelectedOperator?.drug_test_date)
                                                        })
                                                    }}
                                                    onInput={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            drug_test_date: e.target.value
                                                        })
                                                    }}
                                                    onChange={e => {
                                                        setTempSelectedOperator({
                                                            ...tempSelectedOperator,
                                                            drug_test_date: e.target.value
                                                        })
                                                    }}
                                                    value={isEditingOperator ? tempSelectedOperator.drug_test_date || '' : operatorSearchCompany?.selectedOperator?.drug_test_date || ''}
                                                    ref={refDrugTestDate}
                                                />

                                                {isEditingOperator &&
                                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                                        e.stopPropagation();

                                                        setIsExpirationDateCalendarShown(false);
                                                        setIsHireDateCalendarShown(false);
                                                        setIsTerminationDateCalendarShown(false);
                                                        setIsPhysicalDateCalendarShown(false);
                                                        setIsRenewalDateCalendarShown(false);


                                                        if (isDrugTestDateCalendarShown) {
                                                            setIsDrugTestDateCalendarShown(false);
                                                        } else {
                                                            setIsDrugTestDateCalendarShown(true);
                                                        }

                                                        if (moment((tempSelectedOperator?.drug_test_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.drug_test_date || '').trim()) {
                                                            setPreSelectedDrugTestDate(moment(tempSelectedOperator?.drug_test_date, 'MM/DD/YYYY'));
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
                                </div>

                                {
                                    expirationDateCalendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-expiration-date"
                                            style={{
                                                ...style,
                                                left: 0,
                                                top: `${125 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refExpirationDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.expiration_date || '').trim()
                                                                ? moment(tempSelectedOperator?.expiration_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, expiration_date: day.format('MM/DD/YYYY') });
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
                                                top: `${250 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refHireDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.hire_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.hire_date || '').trim()
                                                                ? moment(tempSelectedOperator?.hire_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, hire_date: day.format('MM/DD/YYYY') });
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
                                                top: `${310 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refTerminationDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.termination_date || '').trim()
                                                                ? moment(tempSelectedOperator?.termination_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, termination_date: day.format('MM/DD/YYYY') });
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
                                                top: `${370 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refPhysicalDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.physical_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.physical_date || '').trim()
                                                                ? moment(tempSelectedOperator?.physical_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, physical_date: day.format('MM/DD/YYYY') });
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
                                                top: `${430 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refRenewalDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.renewal_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.renewal_date || '').trim()
                                                                ? moment(tempSelectedOperator?.renewal_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, renewal_date: day.format('MM/DD/YYYY') });
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
                                                top: `${490 + (-refOperatorInfoWrapper.current.scrollTop)}px`,
                                                display: 'block'
                                            }}
                                            ref={refDrugTestDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical above right" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((tempSelectedOperator?.drug_test_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (tempSelectedOperator?.drug_test_date || '').trim()
                                                                ? moment(tempSelectedOperator?.drug_test_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setTempSelectedOperator({ ...tempSelectedOperator, drug_test_date: day.format('MM/DD/YYYY') });
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

                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className="mochi-button" onClick={() => {
                            setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: { id: 0, company_id: operatorSearchCompany.id } });
                            setTempSelectedOperator({ id: 0, company_id: operatorSearchCompany.id });

                            setIsEditingOperator(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Operator
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
        selectedOperator: state.companySetupReducers.selectedOperator,
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
    setSelectedOperator
})(Operators)