import React, { useState, useRef, useEffect } from 'react';
import './CompanySetup.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import axios from 'axios';
import { useDetectClickOutside } from "react-detect-click-outside";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import {
    Employees,
    EmployeeSearch,
    Agents,
    AgentSearch,
    Drivers,
    DriverSearch,
    Operators,
    OperatorSearch
} from './../panels';

import {
    setSelectedCompany,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedCompanyDriver as setSelectedDriver,
    setSelectedOwnerOperator as setSelectedOperator
} from './../../../actions';

function CompanySetup(props) {
    const refCompanyInputLogo = useRef();
    const refCompanyCode = useRef();
    const refMailingAddressCode = useRef();
    const refMailingAddressName = useRef();
    const refCompanyName = useRef();
    const refEmployeeFirstName = useRef();
    const refEmployeePhone = useRef();
    const refEmployeeEmail = useRef();
    const refAgentFirstName = useRef();
    const refAgentPhone = useRef();
    const refAgentEmail = useRef();
    const refDriverFirstName = useRef();
    const refDriverPhone = useRef();
    const refDriverEmail = useRef();
    const refOperatorFirstName = useRef();
    const refOperatorPhone = useRef();
    const refOperatorEmail = useRef();

    const [selectedCompany, setSelectedCompany] = useState({});
    const [selectedMailingAddress, setSelectedMailingAddress] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [showingEmployeeList, setShowingEmployeeList] = useState(true);
    const [employeeSearch, setEmployeeSearch] = useState({});
    const [selectedAgent, setSelectedAgent] = useState({});
    const [showingAgentList, setShowingAgentList] = useState(true);
    const [agentSearch, setAgentSearch] = useState({});
    const [selectedDriver, setSelectedDriver] = useState({});
    const [showingDriverList, setShowingDriverList] = useState(true);
    const [driverSearch, setDriverSearch] = useState({});
    const [selectedOperator, setSelectedOperator] = useState({});
    const [showingOperatorList, setShowingOperatorList] = useState(true);
    const [operatorSearch, setOperatorSearch] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const [isSavingCompany, setIsSavingCompany] = useState(false);
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);
    const [isEditingMailingAddress, setIsEditingMailingAddress] = useState(false);
    const [isSavingEmployee, setIsSavingEmployee] = useState(false);
    const [isSavingAgent, setIsSavingAgent] = useState(false);
    const [isSavingDriver, setIsSavingDriver] = useState(false);
    const [isSavingOperator, setIsSavingOperator] = useState(false);

    const [employeePhoneItems, setEmployeePhoneItems] = useState([]);
    const [showEmployeePhones, setShowEmployeePhones] = useState(false);
    const refEmployeePhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowEmployeePhones(false) } });
    const refEmployeePhonePopupItems = useRef([]);

    const [employeeEmailItems, setEmployeeEmailItems] = useState([]);
    const [showEmployeeEmails, setShowEmployeeEmails] = useState(false);
    const refEmployeeEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowEmployeeEmails(false) } });
    const refEmployeeEmailPopupItems = useRef([]);

    const [agentPhoneItems, setAgentPhoneItems] = useState([]);
    const [showAgentPhones, setShowAgentPhones] = useState(false);
    const refAgentPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowAgentPhones(false) } });
    const refAgentPhonePopupItems = useRef([]);

    const [agentEmailItems, setAgentEmailItems] = useState([]);
    const [showAgentEmails, setShowAgentEmails] = useState(false);
    const refAgentEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowAgentEmails(false) } });
    const refAgentEmailPopupItems = useRef([]);

    const [driverPhoneItems, setDriverPhoneItems] = useState([]);
    const [showDriverPhones, setShowDriverPhones] = useState(false);
    const refDriverPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowDriverPhones(false) } });
    const refDriverPhonePopupItems = useRef([]);

    const [driverEmailItems, setDriverEmailItems] = useState([]);
    const [showDriverEmails, setShowDriverEmails] = useState(false);
    const refDriverEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowDriverEmails(false) } });
    const refDriverEmailPopupItems = useRef([]);

    const [operatorPhoneItems, setOperatorPhoneItems] = useState([]);
    const [showOperatorPhones, setShowOperatorPhones] = useState(false);
    const refOperatorPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowOperatorPhones(false) } });
    const refOperatorPhonePopupItems = useRef([]);

    const [operatorEmailItems, setOperatorEmailItems] = useState([]);
    const [showOperatorEmails, setShowOperatorEmails] = useState(false);
    const refOperatorEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowOperatorEmails(false) } });
    const refOperatorEmailPopupItems = useRef([]);

    const setInitialValues = (clearCode = true) => {
        setIsSavingCompany(false);
        setSelectedEmployee({});
        setSelectedAgent({});
        setSelectedDriver({});
        setSelectedOperator({});
        setShowingEmployeeList(true);
        setShowingAgentList(true);
        setShowingDriverList(true);
        setShowingOperatorList(true);
        setEmployeeSearch({});
        setAgentSearch({});
        setDriverSearch({});
        setOperatorSearch({});
        setSelectedCompany({ id: 0, code: clearCode ? '' : selectedCompany?.code });
    }

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    const employeePhonesTransition = useTransition(showEmployeePhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showEmployeePhones
    });

    const employeeEmailsTransition = useTransition(showEmployeeEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showEmployeeEmails
    });

    const agentPhonesTransition = useTransition(showAgentPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showAgentPhones
    });

    const agentEmailsTransition = useTransition(showAgentEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showAgentEmails
    });

    const driverPhonesTransition = useTransition(showDriverPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showDriverPhones
    });

    const driverEmailsTransition = useTransition(showDriverEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showDriverEmails
    });

    const operatorPhonesTransition = useTransition(showOperatorPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showOperatorPhones
    });

    const operatorEmailsTransition = useTransition(showOperatorEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showOperatorEmails
    });

    useEffect(() => {
        if (props.screenFocused) {
            refCompanyCode.current.focus({
                preventScroll: true
            });
        }
    }, [props.screenFocused])

    useEffect(() => {
        if ((props.selectedCompany?.component_id || '') !== props.componentId) {
            setSelectedCompany(selectedCompany => {
                return {
                    ...selectedCompany,
                    ...props.selectedCompany
                }
            })
        }
    }, [props.selectedCompany])

    useEffect(() => {
        if ((props.selectedEmployee?.component_id || '') !== props.componentId) {
            if (((selectedEmployee?.id || 0) > 0 && (props.selectedEmployee?.id || 0) > 0) && selectedEmployee.id === props.selectedEmployee.id) {
                setSelectedEmployee(selectedEmployee => {
                    return {
                        ...selectedEmployee,
                        ...props.selectedEmployee
                    }
                })
            }
        }
    }, [props.selectedEmployee])

    useEffect(() => {
        if ((props.selectedAgent?.component_id || '') !== props.componentId) {
            if (((selectedAgent?.id || 0) > 0 && (props.selectedAgent?.id || 0) > 0) && selectedAgent.id === props.selectedAgent.id) {
                setSelectedAgent(selectedAgent => {
                    return {
                        ...selectedAgent,
                        ...props.selectedAgent
                    }
                })
            }
        }
    }, [props.selectedAgent])

    useEffect(() => {
        if ((props.selectedDriver?.component_id || '') !== props.componentId) {
            if (((selectedDriver?.id || 0) > 0 && (props.selectedDriver?.id || 0) > 0) && selectedDriver.id === props.selectedDriver.id) {
                setSelectedDriver(selectedDriver => {
                    return {
                        ...selectedDriver,
                        ...props.selectedDriver
                    }
                })
            }
        }
    }, [props.selectedDriver])

    useEffect(() => {
        if ((props.selectedOperator?.component_id || '') !== props.componentId) {
            if (((selectedOperator?.id || 0) > 0 && (props.selectedOperator?.id || 0) > 0) && selectedOperator.id === props.selectedOperator.id) {
                setSelectedOperator(selectedOperator => {
                    return {
                        ...selectedOperator,
                        ...props.selectedOperator
                    }
                })
            }
        }
    }, [props.selectedOperator])

    useEffect(() => {
        if (isSavingCompany) {
            if (selectedCompany?.id === undefined || selectedCompany?.id === -1) {
                selectedCompany.id = 0;
                setSelectedCompany(selectedCompany => {
                    return {
                        ...selectedCompany,
                        id: 0
                    }
                })
            }

            if (
                (selectedCompany?.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedCompany?.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedCompany?.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedCompany?.address1 || '').trim() !== "" &&
                (selectedCompany?.zip || '').trim() !== ""
            ) {
                let parseCity = selectedCompany.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (selectedCompany.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (selectedCompany.state || '').trim().replace(/\s/g, "").substring(0, 2);

                selectedCompany.code = newCode.toUpperCase();

                axios.post(props.serverUrl + '/saveCompany', selectedCompany).then(res => {
                    if (res.data.result === 'OK') {
                        let company = JSON.parse(JSON.stringify(res.data.company));
                        if ((selectedCompany?.id || 0) === 0) {
                            setSelectedCompany(selectedCompany => {
                                return {
                                    ...selectedCompany,
                                    id: company.id,
                                    code: company.code,
                                    code_number: company.code_number,
                                    employees: company.employees || [],
                                    agents: company.agents || [],
                                    company_drivers: company.company_drivers || [],
                                    owner_operators: company.owner_operators || [],
                                }
                            });

                            props.setSelectedCompany({
                                ...company,
                                component_id: props.componentId
                            })
                        } else {
                            setSelectedCompany(selectedCompany => {
                                return {
                                    ...selectedCompany,
                                    employees: company.employees || [],
                                    agents: company.agents || [],
                                    company_drivers: company.company_drivers || [],
                                    owner_operators: company.owner_operators || [],
                                }
                            });

                            props.setSelectedCompany({
                                ...selectedCompany,
                                employees: company.employees || [],
                                agents: company.agents || [],
                                company_drivers: company.company_drivers || [],
                                owner_operators: company.owner_operators || [],
                                component_id: props.componentId
                            });
                        }
                    }

                    setIsSavingCompany(false);
                }).catch(e => {
                    console.log('error saving company', e);
                    setIsSavingCompany(false);
                });
            } else {
                setIsSavingCompany(false);
            }
        }
    }, [isSavingCompany])

    useEffect(() => {
        if (isSavingMailingAddress) {
            if ((selectedCompany.id || 0) > 0) {
                let mailing_address = selectedCompany.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }
                mailing_address.customer_id = selectedCompany.id;

                if (
                    (mailing_address.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                    (mailing_address.city || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.state || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.address1 || '').trim() !== "" &&
                    (mailing_address.zip || '').trim() !== ""
                ) {
                    let parseCity = mailing_address.city.trim().replace(/\s/g, "").substring(0, 3);

                    if (parseCity.toLowerCase() === "ft.") {
                        parseCity = "FO";
                    }
                    if (parseCity.toLowerCase() === "mt.") {
                        parseCity = "MO";
                    }
                    if (parseCity.toLowerCase() === "st.") {
                        parseCity = "SA";
                    }

                    let newCode = (mailing_address.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (mailing_address.state || '').trim().replace(/\s/g, "").substring(0, 2);

                    mailing_address.code = newCode.toUpperCase();

                    axios.post(props.serverUrl + '/saveCompanyMailingAddress', mailing_address).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedCompany({ ...selectedCompany, mailing_address: res.data.mailing_address });

                            props.setSelectedCompany({
                                ...selectedCompany,
                                mailing_address: res.data.mailing_address,
                                component_id: props.componentId
                            });
                        }

                        setIsSavingMailingAddress(false);
                    }).catch(e => {
                        console.log('error on saving company mailing address', e);
                        setIsSavingMailingAddress(false);
                    });
                } else {
                    setIsSavingMailingAddress(false);
                }
            }
        }
    }, [isSavingMailingAddress]);

    useEffect(() => {
        if (isSavingEmployee) {
            if ((selectedCompany?.id || 0) === 0) {
                setIsSavingEmployee(false);
                return;
            }

            if (selectedEmployee.company_id === undefined || selectedEmployee.company_id === 0) {
                selectedEmployee.company_id = selectedCompany.id;
            }

            if ((selectedEmployee.first_name || '').trim() === '' ||
                (selectedEmployee.last_name || '').trim() === '' ||
                ((selectedEmployee.phone_work || '').trim() === '' &&
                    (selectedEmployee.phone_work_fax || '').trim() === '' &&
                    (selectedEmployee.phone_mobile || '').trim() === '' &&
                    (selectedEmployee.phone_direct || '').trim() === '' &&
                    (selectedEmployee.phone_other || '').trim() === '')) {
                setIsSavingEmployee(false);
                return;
            }

            if ((selectedEmployee.address1 || '').trim() === '' && (selectedEmployee.address2 || '').trim() === '') {
                selectedEmployee.address1 = selectedCompany?.address1;
                selectedEmployee.address2 = selectedCompany?.address2;
                selectedEmployee.city = selectedCompany?.city;
                selectedEmployee.state = selectedCompany?.state;
                selectedEmployee.zip_code = selectedCompany?.zip;
            }

            axios.post(props.serverUrl + '/saveEmployee', selectedEmployee).then(res => {
                if (res.data.result === 'OK') {

                    setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            employees: res.data.employees
                        }
                    });

                    props.setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            employees: res.data.employees,
                            component_id: props.componentId
                        }
                    });

                    setSelectedEmployee(res.data.employee);
                }

                setIsSavingEmployee(false);
            }).catch(e => {
                console.log('error saving company employee', e);
                setIsSavingEmployee(false);
            });
        }
    }, [isSavingEmployee])

    useEffect(() => {
        if (isSavingAgent) {
            if ((selectedCompany?.id || 0) === 0) {
                setIsSavingAgent(false);
                return;
            }

            if (selectedAgent.company_id === undefined || selectedAgent.company_id === 0) {
                selectedAgent.company_id = selectedCompany.id;
            }

            if ((selectedAgent.first_name || '').trim() === '' ||
                (selectedAgent.last_name || '').trim() === '' ||
                ((selectedAgent.phone_work || '').trim() === '' &&
                    (selectedAgent.phone_work_fax || '').trim() === '' &&
                    (selectedAgent.phone_mobile || '').trim() === '' &&
                    (selectedAgent.phone_direct || '').trim() === '' &&
                    (selectedAgent.phone_other || '').trim() === '')) {
                setIsSavingAgent(false);
                return;
            }

            if ((selectedAgent.address1 || '').trim() === '' && (selectedAgent.address2 || '').trim() === '') {
                selectedAgent.address1 = selectedCompany?.address1;
                selectedAgent.address2 = selectedCompany?.address2;
                selectedAgent.city = selectedCompany?.city;
                selectedAgent.state = selectedCompany?.state;
                selectedAgent.zip_code = selectedCompany?.zip;
            }

            axios.post(props.serverUrl + '/saveAgent', selectedAgent).then(res => {
                if (res.data.result === 'OK') {

                    setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            agents: res.data.agents
                        }
                    });

                    props.setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            agents: res.data.agents,
                            component_id: props.componentId
                        }
                    });
                    setSelectedAgent(res.data.agent);
                }

                setIsSavingAgent(false);
            }).catch(e => {
                console.log('error saving company agent', e);
                setIsSavingAgent(false);
            });
        }
    }, [isSavingAgent])

    useEffect(() => {
        if (isSavingDriver) {
            if ((selectedCompany?.id || 0) === 0) {
                setIsSavingDriver(false);
                return;
            }

            if (selectedDriver.company_id === undefined || selectedDriver.company_id === 0) {
                selectedDriver.company_id = selectedCompany.id;
            }

            if ((selectedDriver.first_name || '').trim() === '' ||
                (selectedDriver.last_name || '').trim() === '' ||
                ((selectedDriver.phone_work || '').trim() === '' &&
                    (selectedDriver.phone_work_fax || '').trim() === '' &&
                    (selectedDriver.phone_mobile || '').trim() === '' &&
                    (selectedDriver.phone_direct || '').trim() === '' &&
                    (selectedDriver.phone_other || '').trim() === '')) {
                setIsSavingDriver(false);
                return;
            }

            if ((selectedDriver.address1 || '').trim() === '' && (selectedDriver.address2 || '').trim() === '') {
                selectedDriver.address1 = selectedCompany?.address1;
                selectedDriver.address2 = selectedCompany?.address2;
                selectedDriver.city = selectedCompany?.city;
                selectedDriver.state = selectedCompany?.state;
                selectedDriver.zip_code = selectedCompany?.zip;
            }

            axios.post(props.serverUrl + '/saveDriver', selectedDriver).then(res => {
                if (res.data.result === 'OK') {

                    setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            drivers: res.data.drivers
                        }
                    });

                    props.setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            drivers: res.data.drivers,
                            component_id: props.componentId
                        }
                    });
                    setSelectedDriver(res.data.driver);
                }

                setIsSavingDriver(false);
            }).catch(e => {
                console.log('error saving company driver', e);
                setIsSavingDriver(false);
            });
        }
    }, [isSavingDriver])

    useEffect(() => {
        if (isSavingOperator) {
            if ((selectedCompany?.id || 0) === 0) {
                setIsSavingOperator(false);
                return;
            }

            if (selectedOperator.company_id === undefined || selectedOperator.company_id === 0) {
                selectedOperator.company_id = selectedCompany.id;
            }

            if ((selectedOperator.first_name || '').trim() === '' ||
                (selectedOperator.last_name || '').trim() === '' ||
                ((selectedOperator.phone_work || '').trim() === '' &&
                    (selectedOperator.phone_work_fax || '').trim() === '' &&
                    (selectedOperator.phone_mobile || '').trim() === '' &&
                    (selectedOperator.phone_direct || '').trim() === '' &&
                    (selectedOperator.phone_other || '').trim() === '')) {
                setIsSavingOperator(false);
                return;
            }

            if ((selectedOperator.address1 || '').trim() === '' && (selectedOperator.address2 || '').trim() === '') {
                selectedOperator.address1 = selectedCompany?.address1;
                selectedOperator.address2 = selectedCompany?.address2;
                selectedOperator.city = selectedCompany?.city;
                selectedOperator.state = selectedCompany?.state;
                selectedOperator.zip_code = selectedCompany?.zip;
            }

            axios.post(props.serverUrl + '/saveOperator', selectedOperator).then(res => {
                if (res.data.result === 'OK') {

                    setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            operators: res.data.operators
                        }
                    });

                    props.setSelectedCompany(selectedCompany => {
                        return {
                            ...selectedCompany,
                            operators: res.data.operators,
                            component_id: props.componentId
                        }
                    });
                    setSelectedOperator(res.data.operator);
                }

                setIsSavingOperator(false);
            }).catch(e => {
                console.log('error saving company operator', e);
                setIsSavingOperator(false);
            });
        }
    }, [isSavingOperator])

    const validateCompanyForSaving = e => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingCompany) {
                setIsSavingCompany(true);
            }
        }
    }

    const validateMailingAddressForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingMailingAddress) {
                setIsSavingMailingAddress(true);
            }
        }
    }

    const validateEmployeeForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingEmployee) {
                setIsSavingEmployee(true);
            }
        }
    }

    const validateAgentForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingAgent) {
                setIsSavingAgent(true);
            }
        }
    }

    const validateDriverForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingDriver) {
                setIsSavingDriver(true);
            }
        }
    }

    const validateOperatorForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingOperator) {
                setIsSavingOperator(true);
            }
        }
    }

    const mailingAddressIsTheSameBtn = () => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You must select a company first');
            return;
        }

        if (!isEditingMailingAddress) {
            window.alert('You must click on Edit button first!');
            return;
        }

        let mailing_address = {};

        mailing_address.id = -1;
        mailing_address.company_id = selectedCompany.id;
        mailing_address.code = selectedCompany.code;
        mailing_address.code_number = selectedCompany.code_number;
        mailing_address.name = selectedCompany.name;
        mailing_address.address1 = selectedCompany.address1;
        mailing_address.address2 = selectedCompany.address2;
        mailing_address.city = selectedCompany.city;
        mailing_address.state = selectedCompany.state;
        mailing_address.zip = selectedCompany.zip;
        mailing_address.main_phone_number = selectedCompany.main_phone_number;
        mailing_address.main_fax_number = selectedCompany.main_fax_number;
        mailing_address.website = selectedCompany.website;

        setSelectedCompany({ ...selectedCompany, mailing_address: mailing_address });

        validateMailingAddressForSaving({ keyCode: 9 });
    }

    const searchCompanyByCode = e => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {
                setIsLoading(true);

                axios.post(props.serverUrl + '/companies', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.companies.length > 0) {
                            setInitialValues();
                            setSelectedCompany(res.data.companies[0]);

                            setSelectedEmployee((res.data.companies[0].employees || []).length > 0 ? res.data.companies[0].employees[0] : {});
                            setSelectedAgent((res.data.companies[0].agents || []).length > 0 ? res.data.companies[0].agents[0] : {});
                            setSelectedDriver((res.data.companies[0].drivers || []).length > 0 ? res.data.companies[0].drivers[0] : {});
                            setSelectedOperator((res.data.companies[0].operators || []).length > 0 ? res.data.companies[0].operators[0] : {});
                        } else {
                            setInitialValues(false);
                        }
                    } else {
                        setInitialValues(false);
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting companies', e);
                    setIsLoading(false);
                });
            } else {
                setInitialValues(false);
            }
        }
    }

    const searchEmployeeBtnClick = () => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You must select a company first!');
            return;
        }

        let filters = [
            {
                field: 'Company Id',
                data: selectedCompany?.id || 0
            },
            {
                field: 'First Name',
                data: (employeeSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (employeeSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (employeeSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (employeeSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (employeeSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (employeeSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: employeeSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (employeeSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-employee-search`,
            component: <EmployeeSearch
                title='Employee Search Results'
                tabTimes={122000 + props.tabTimes}
                panelName={`${props.panelName}-employee-search`}
                owner='company'
                origin={props.origin}
                suborigin='company'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                employeeSearch={{ search: filters }}

                callback={(employee) => {
                    new Promise((resolve, reject) => {
                        if (employee) {
                            setSelectedCompany(employee.company);
                            setSelectedEmployee(employee);
                            setShowingEmployeeList(true);
                            setEmployeeSearch({});
                            resolve('OK');
                        } else {
                            reject('no employee');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-employee-search`, props.origin);
                        refCompanyName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-employee-search`, props.origin);
                        refCompanyCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchAgentBtnClick = () => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You must select a company first!');
            return;
        }

        let filters = [
            {
                field: 'Company Id',
                data: selectedCompany?.id || 0
            },
            {
                field: 'First Name',
                data: (agentSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (agentSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (agentSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (agentSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (agentSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (agentSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: agentSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (agentSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-agent-search`,
            component: <AgentSearch
                title='Agent Search Results'
                tabTimes={222000 + props.tabTimes}
                panelName={`${props.panelName}-agent-search`}
                owner='company'
                origin={props.origin}
                suborigin='company'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                agentSearch={{ search: filters }}

                callback={(agent) => {
                    new Promise((resolve, reject) => {
                        if (agent) {
                            setSelectedCompany(agent.company);
                            setSelectedAgent(agent);
                            setShowingAgentList(true);
                            setAgentSearch({});
                            resolve('OK');
                        } else {
                            reject('no agent');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-agent-search`, props.origin);
                        refCompanyName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-agent-search`, props.origin);
                        refCompanyCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchDriverBtnClick = () => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You must select a company first!');
            return;
        }

        let filters = [
            {
                field: 'Company Id',
                data: selectedCompany?.id || 0
            },
            {
                field: 'First Name',
                data: (driverSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (driverSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (driverSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (driverSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (driverSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (driverSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: driverSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (driverSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-driver-search`,
            component: <DriverSearch
                title='Driver Search Results'
                tabTimes={322000 + props.tabTimes}
                panelName={`${props.panelName}-driver-search`}
                owner='company'
                origin={props.origin}
                suborigin='company'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                driverSearch={{ search: filters }}

                callback={(driver) => {
                    new Promise((resolve, reject) => {
                        if (driver) {
                            setSelectedCompany(driver.company);
                            setSelectedDriver(driver);
                            setShowingDriverList(true);
                            setDriverSearch({});
                            resolve('OK');
                        } else {
                            reject('no driver');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-driver-search`, props.origin);
                        refCompanyName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-driver-search`, props.origin);
                        refCompanyCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchOperatorBtnClick = () => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You must select a company first!');
            return;
        }

        let filters = [
            {
                field: 'Company Id',
                data: selectedCompany?.id || 0
            },
            {
                field: 'First Name',
                data: (operatorSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (operatorSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (operatorSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (operatorSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (operatorSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (operatorSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: operatorSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (operatorSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-operator-search`,
            component: <OperatorSearch
                title='Operator Search Results'
                tabTimes={422000 + props.tabTimes}
                panelName={`${props.panelName}-operator-search`}
                owner='company'
                origin={props.origin}
                suborigin='company'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                operatorSearch={{ search: filters }}

                callback={(operator) => {
                    new Promise((resolve, reject) => {
                        if (operator) {
                            setSelectedCompany(operator.company);
                            setSelectedOperator(operator);
                            setShowingOperatorList(true);
                            setOperatorSearch({});
                            resolve('OK');
                        } else {
                            reject('no operator');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-operator-search`, props.origin);
                        refCompanyName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-operator-search`, props.origin);
                        refCompanyCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const uploadCompanyLogo = (e) => {
        if ((selectedCompany?.id || 0) === 0) {
            window.alert('You have to load a company first!');
            return;
        }

        let files = e.target.files;
        const maxSize = 3145728;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 3mb");
                return;
            }

            let formData = new FormData();
            formData.append("logo", files[0]);
            formData.append("id", selectedCompany?.id);

            const options = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + '/uploadCompanyLogo', formData, options)
                .then(async res => {
                    if (res.data.result === "OK") {
                        setSelectedCompany(selectedCompany => {
                            return {
                                ...selectedCompany,
                                logo: res.data.company.logo
                            }
                        });

                        props.setSelectedCompany({
                            ...selectedCompany,
                            logo: res.data.company.logo,
                            component_id: props.componentId
                        });

                    }
                    refCompanyInputLogo.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing company logo", err);
                    refCompanyInputLogo.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeCompanyLogo = () => {
        axios.post(props.serverUrl + '/removeCompanyLogo', { id: selectedCompany?.id }).then(async res => {
            if (res.data.result === "OK") {
                setSelectedCompany(selectedCompany => {
                    return {
                        ...selectedCompany,
                        logo: ''
                    }
                });

                props.setSelectedCompany({
                    ...selectedCompany,
                    logo: '',
                    component_id: props.componentId
                });
            }
        }).catch(e => {
            console.log('error removig company logo', e);
        });
    }

    return (
        <div className="company-setup-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? 'transparent' : 'rgb(250, 250, 250)',
            background: props.isOnPanel ? 'transparent' : '-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : '-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : 'radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative'
        }}>

            <div className="company-left-container">
                <div className="company-logo-container">


                    <form encType='multipart/form-data' style={{ display: 'none' }}>
                        <input type="file" ref={refCompanyInputLogo} accept='image/*' onChange={uploadCompanyLogo} />
                    </form>

                    <div className="company-logo-wrapper">
                        <img src={((selectedCompany?.id || 0) > 0 && (selectedCompany?.logo || '') !== '') ? props.serverUrl + '/company-logo/' + selectedCompany.logo : 'img/company-logo-default.png'} alt="" />
                    </div>
                </div>

                <div className="company-logo-buttons">
                    {
                        ((selectedCompany?.id || 0) > 0 && (selectedCompany?.logo || '') !== '') &&
                        <div className="mochi-button" onClick={removeCompanyLogo} style={{
                            marginRight: 10
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base" style={{ color: 'darkred' }}>Remove Logo</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    }
                    <div className="mochi-button" onClick={() => { refCompanyInputLogo.current.click() }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Upload Logo</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>

                <div className="company-extra-info">
                    <div className="input-box-container">
                        <input tabIndex={47 + props.tabTimes} type="text" placeholder="EIN" id="txt-company-ein"
                            onInput={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    ein: e.target.value
                                })
                            }}
                            onChange={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    ein: e.target.value
                                })
                            }}
                            value={selectedCompany?.ein || ''} />
                    </div>
                    <div className="input-box-container">
                        <input tabIndex={48 + props.tabTimes} type="text" placeholder="Zulip Name" id="txt-company-zulip-name"
                            onInput={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    zulip_name: e.target.value
                                })
                            }}
                            onChange={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    zulip_name: e.target.value
                                })
                            }}
                            value={selectedCompany?.zulip_name || ''} />
                    </div>
                    <div className="input-box-container">
                        <input tabIndex={49 + props.tabTimes} type="text" placeholder="Jitsi Name" id="txt-company-jitsi-name"
                            onKeyDown={validateCompanyForSaving}
                            onInput={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    jitsi_name: e.target.value
                                })
                            }}
                            onChange={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    jitsi_name: e.target.value
                                })
                            }}
                            value={selectedCompany?.jitsi_name || ''} />
                    </div>
                </div>
            </div>

            <div className="company-right-container">
                <div className="company-info-container">
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Company</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    isEditingCompany
                                        ?
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingCompany(false);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Done</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                        :
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingCompany(true);
                                            refCompanyName.current.focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                }

                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={1 + props.tabTimes} type="text" placeholder="Code" maxLength="8" id="txt-company-code"
                                    ref={refCompanyCode}
                                    readOnly={true}
                                    onKeyDown={searchCompanyByCode}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    value={(selectedCompany.code_number || 0) === 0 ? (selectedCompany.code || '') : selectedCompany.code + selectedCompany.code_number} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={2 + props.tabTimes} type="text" placeholder="Name"
                                    ref={refCompanyName}
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            name: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            name: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={3 + props.tabTimes} type="text" placeholder="Address 1"
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            address1: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            address1: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={4 + props.tabTimes} type="text" placeholder="Address 2"
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            address2: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            address2: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={5 + props.tabTimes} type="text" placeholder="City"
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            city: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            city: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={6 + props.tabTimes} type="text" placeholder="State" maxLength="2" style={{ textTransform: 'uppercase' }}
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            state: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            state: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={7 + props.tabTimes} type="text" placeholder="Postal Code"
                                    readOnly={!isEditingCompany}
                                    onKeyDown={validateCompanyForSaving}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            zip: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            zip: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow" style={{ position: 'relative' }}>
                                <MaskedInput
                                    tabIndex={8 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Main Phone Number"
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            main_phone_number: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            main_phone_number: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.main_phone_number || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow" style={{ position: 'relative' }}>
                                <MaskedInput
                                    tabIndex={9 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Main Fax Number"
                                    readOnly={!isEditingCompany}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            main_fax_number: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            main_fax_number: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.main_fax_number || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}>
                                <input tabIndex={10 + props.tabTimes}
                                    type="text"
                                    placeholder="Website"
                                    style={{ textTransform: 'lowercase' }}
                                    readOnly={!isEditingCompany}
                                    onKeyDown={validateCompanyForSaving}
                                    onInput={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            website: e.target.value
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany({
                                            ...selectedCompany,
                                            website: e.target.value
                                        })
                                    }}
                                    value={selectedCompany?.website || ''}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="company-info-mailing-address">
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Mailing Address</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={mailingAddressIsTheSameBtn}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Mailing address is the same</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>

                                {
                                    isEditingMailingAddress
                                        ?
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingMailingAddress(false);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Done</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                        :
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingMailingAddress(true);
                                            refMailingAddressName.current.focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                }


                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={11 + props.tabTimes} type="text" placeholder="Code" maxLength="8" id="txt-mailing-address-code"
                                    ref={refMailingAddressCode}
                                    readOnly={true}
                                    onInput={e => { }}
                                    onChange={e => { }}
                                    value={(selectedCompany?.mailing_address?.code || '') + ((selectedCompany?.mailing_address?.code_number || 0) === 0 ? '' : selectedCompany?.mailing_address?.code_number)} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={12 + props.tabTimes} type="text" placeholder="Name"
                                    readOnly={!isEditingMailingAddress}
                                    ref={refMailingAddressName}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    name: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    name: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={13 + props.tabTimes} type="text" placeholder="Address 1"
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    address1: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    address1: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={14 + props.tabTimes} type="text" placeholder="Address 2"
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    address2: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    address2: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={15 + props.tabTimes} type="text" placeholder="City"
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    city: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    city: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={16 + props.tabTimes} type="text" placeholder="State" maxLength="2" style={{ textTransform: 'uppercase' }}
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    state: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    state: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={17 + props.tabTimes} type="text" placeholder="Postal Code"
                                    readOnly={!isEditingMailingAddress}
                                    onKeyDown={validateMailingAddressForSaving}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    zip: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    zip: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow" style={{ position: 'relative' }}>
                                <MaskedInput
                                    tabIndex={18 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Main Phone Number"
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    main_phone_number: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    main_phone_number: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.main_phone_number || ''}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow" style={{ position: 'relative' }}>
                                <MaskedInput
                                    tabIndex={19 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Main Fax Number"
                                    readOnly={!isEditingMailingAddress}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    main_fax_number: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    main_fax_number: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.main_fax_number || ''}
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}>
                                <input tabIndex={20 + props.tabTimes}
                                    type="text"
                                    placeholder="Website"
                                    style={{ textTransform: 'lowercase' }}
                                    readOnly={!isEditingMailingAddress}
                                    onKeyDown={validateMailingAddressForSaving}
                                    onInput={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    website: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCompany(selectedCompany => {
                                            return {
                                                ...selectedCompany,
                                                mailing_address: {
                                                    ...(selectedCompany?.mailing_address || {}),
                                                    website: e.target.value
                                                }
                                            }
                                        })
                                    }}
                                    value={selectedCompany?.mailing_address?.website || ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="company-info-employees">

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Employees</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    if (selectedEmployee.id === undefined) {
                                        window.alert('You must select an employee first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-employees`,
                                        component: <Employees
                                            title='Employee'
                                            tabTimes={122000 + props.tabTimes}
                                            panelName={`${props.panelName}-employees`}
                                            savingEmployeeUrl='/saveEmployee'
                                            deletingEmployeeUrl='/deleteEmployee'
                                            uploadAvatarUrl='/uploadEmployeeAvatar'
                                            removeAvatarUrl='/removeEmployeeAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            employeeSearchCompany={{
                                                ...selectedCompany,
                                                selectedEmployee: selectedEmployee
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-employees`,
                                        component: <Employees
                                            title='Employee'
                                            tabTimes={122000 + props.tabTimes}
                                            panelName={`${props.panelName}-employees`}
                                            savingEmployeeUrl='/saveEmployee'
                                            deletingEmployeeUrl='/deleteEmployee'
                                            uploadAvatarUrl='/uploadEmployeeAvatar'
                                            removeAvatarUrl='/removeEmployeeAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            isEditingEmployee={true}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            employeeSearchCompany={{
                                                ...selectedCompany,
                                                selectedEmployee: { id: 0, company_id: selectedCompany?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Employee</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedEmployee({});
                                    refEmployeeFirstName.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={21 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refEmployeeFirstName}
                                    onInput={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedEmployee?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={22 + props.tabTimes} type="text" placeholder="Last Name"
                                    onInput={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedEmployee?.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={23 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text"
                                        placeholder="Phone"
                                        ref={refEmployeePhone}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showEmployeePhones) {
                                                        let selectedIndex = employeePhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (employeePhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEmployeePhonePopupItems.current.map((r, i) => {
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
                                                        if (employeePhoneItems.length > 1) {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedEmployee?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowEmployeePhones(true);

                                                            refEmployeePhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showEmployeePhones) {
                                                        let selectedIndex = employeePhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                if (selectedIndex === (employeePhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEmployeePhonePopupItems.current.map((r, i) => {
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
                                                        if (employeePhoneItems.length > 1) {
                                                            await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedEmployee?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowEmployeePhones(true);

                                                            refEmployeePhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowEmployeePhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showEmployeePhones && employeePhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                primary_phone: employeePhoneItems[employeePhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                        setShowEmployeePhones(false);
                                                        refEmployeePhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showEmployeePhones) {
                                                        e.preventDefault();
                                                        await setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                primary_phone: employeePhoneItems[employeePhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                        setShowEmployeePhones(false);
                                                        refEmployeePhone.current.inputElement.focus();
                                                    } else {
                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedEmployee?.id || 0) === 0) {
                                                setSelectedEmployee(selectedEmployee => {
                                                    return {
                                                        ...selectedEmployee,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedEmployee?.primary_phone || '') === '') {
                                                    setSelectedEmployee(selectedEmployee => {
                                                        return {
                                                            ...selectedEmployee,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedEmployee?.primary_phone) {
                                                        case 'work':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedEmployee?.id || 0) === 0) {
                                                setSelectedEmployee(selectedEmployee => {
                                                    return {
                                                        ...selectedEmployee,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedEmployee?.primary_phone || '') === '') {
                                                    setSelectedEmployee(selectedEmployee => {
                                                        return {
                                                            ...selectedEmployee,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedEmployee?.primary_phone) {
                                                        case 'work':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedEmployee(selectedEmployee => {
                                                                return {
                                                                    ...selectedEmployee,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedEmployee?.primary_phone || '') === 'work'
                                                ? (selectedEmployee?.phone_work || '')
                                                : (selectedEmployee?.primary_phone || '') === 'fax'
                                                    ? (selectedEmployee?.phone_work_fax || '')
                                                    : (selectedEmployee?.primary_phone || '') === 'mobile'
                                                        ? (selectedEmployee?.phone_mobile || '')
                                                        : (selectedEmployee?.primary_phone || '') === 'direct'
                                                            ? (selectedEmployee?.phone_direct || '')
                                                            : (selectedEmployee?.primary_phone || '') === 'other'
                                                                ? (selectedEmployee?.phone_other || '')
                                                                : ''
                                        } />
                                    {
                                        (selectedEmployee?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-employee-primary-phone': true,
                                                'pushed': (employeePhoneItems.length > 1)
                                            })}>
                                            {selectedEmployee?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        employeePhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showEmployeePhones) {
                                                setShowEmployeePhones(false);
                                            } else {
                                                if (employeePhoneItems.length > 1) {
                                                    await setEmployeePhoneItems(employeePhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedEmployee?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowEmployeePhones(true);

                                                        refEmployeePhonePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refEmployeePhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    employeePhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-employee-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refEmployeePhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            employeePhoneItems.map((item, index) => {
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
                                                                            await setSelectedEmployee(selectedEmployee => {
                                                                                return {
                                                                                    ...selectedEmployee,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateEmployeeForSaving({ keyCode: 9 });
                                                                            setShowEmployeePhones(false);
                                                                            refEmployeePhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refEmployeePhonePopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Phone Work `
                                                                                : item.type === 'fax' ? `Phone Work Fax `
                                                                                    : item.type === 'mobile' ? `Phone Mobile `
                                                                                        : item.type === 'direct' ? `Phone Direct `
                                                                                            : item.type === 'other' ? `Phone Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.phone
                                                                                    : item.type === 'fax' ? item.phone
                                                                                        : item.type === 'mobile' ? item.phone
                                                                                            : item.type === 'direct' ? item.phone
                                                                                                : item.type === 'other' ? item.phone : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={24 + props.tabTimes} type="text" placeholder="Ext"
                                        onInput={e => {
                                            setSelectedEmployee(selectedEmployee => {
                                                return {
                                                    ...selectedEmployee,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedEmployee(selectedEmployee => {
                                                return {
                                                    ...selectedEmployee,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedEmployee?.phone_ext || ''} />
                                </div>
                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + '-cbox-company-employee-primary-admin-btn'}
                                        onChange={(e) => {
                                            setSelectedEmployee(selectedEmployee => {
                                                return {
                                                    ...selectedEmployee,
                                                    is_primary_admin: e.target.checked ? 1 : 0
                                                }
                                            });
                                            validateEmployeeForSaving({ keyCode: 9 });
                                        }}
                                        checked={(selectedEmployee.is_primary_admin || 0) === 1}
                                    />
                                    <label htmlFor={props.panelName + '-cbox-company-employee-primary-admin-btn'}>
                                        <div className="label-text">Primary Admin</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input style={{
                                        width: 'calc(100% - 25px)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                        tabIndex={25 + props.tabTimes}
                                        type="text"
                                        placeholder="E-Mail"
                                        ref={refEmployeeEmail}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showEmployeeEmails) {
                                                        let selectedIndex = employeeEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (employeeEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEmployeeEmailPopupItems.current.map((r, i) => {
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
                                                        if (employeeEmailItems.length > 1) {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedEmployee?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowEmployeeEmails(true);

                                                            refEmployeeEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showEmployeeEmails) {
                                                        let selectedIndex = employeeEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                if (selectedIndex === (employeeEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refEmployeeEmailPopupItems.current.map((r, i) => {
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
                                                        if (employeeEmailItems.length > 1) {
                                                            await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedEmployee?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowEmployeeEmails(true);

                                                            refEmployeeEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowEmployeeEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showEmployeeEmails && employeeEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                primary_email: employeeEmailItems[employeeEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                        setShowEmployeeEmails(false);
                                                        refEmployeeEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showEmployeeEmails) {
                                                        e.preventDefault();
                                                        await setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                primary_email: employeeEmailItems[employeeEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                        setShowEmployeeEmails(false);
                                                        refEmployeeEmail.current.focus();
                                                    } else {
                                                        validateEmployeeForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedEmployee?.primary_email || '') === '') {
                                                setSelectedEmployee(selectedEmployee => {
                                                    return {
                                                        ...selectedEmployee,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedEmployee?.primary_email) {
                                                    case 'work':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedEmployee?.primary_email || '') === '') {
                                                setSelectedEmployee(selectedEmployee => {
                                                    return {
                                                        ...selectedEmployee,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedEmployee?.primary_email) {
                                                    case 'work':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedEmployee(selectedEmployee => {
                                                            return {
                                                                ...selectedEmployee,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedEmployee?.primary_email || '') === 'work'
                                                ? (selectedEmployee?.email_work || '')
                                                : (selectedEmployee?.primary_email || '') === 'personal'
                                                    ? (selectedEmployee?.email_personal || '')
                                                    : (selectedEmployee?.primary_email || '') === 'other'
                                                        ? (selectedEmployee?.email_other || '')
                                                        : ''
                                        } />

                                    {
                                        (selectedEmployee?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-employee-primary-email': true,
                                                'pushed': (employeeEmailItems.length > 1)
                                            })}>
                                            {selectedEmployee?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        employeeEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showEmployeeEmails) {
                                                setShowEmployeeEmails(false);
                                            } else {
                                                if (employeeEmailItems.length > 1) {
                                                    await setEmployeeEmailItems(employeeEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedEmployee?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowEmployeeEmails(true);

                                                        refEmployeeEmailPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refEmployeeEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    employeeEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-employee-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refEmployeeEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            employeeEmailItems.map((item, index) => {
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
                                                                            await setSelectedEmployee(selectedEmployee => {
                                                                                return {
                                                                                    ...selectedEmployee,
                                                                                    primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateEmployeeForSaving({ keyCode: 9 });
                                                                            setShowEmployeeEmails(false);
                                                                            refEmployeeEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refEmployeeEmailPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Email Work `
                                                                                : item.type === 'personal' ? `Email Personal `
                                                                                    : item.type === 'other' ? `Email Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.email
                                                                                    : item.type === 'personal' ? item.email
                                                                                        : item.type === 'other' ? item.email : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={26 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={validateEmployeeForSaving}
                                    onInput={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedEmployee(selectedEmployee => {
                                            return {
                                                ...selectedEmployee,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedEmployee?.notes || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    showingEmployeeList &&
                                    <div className="mochi-button" onClick={() => setShowingEmployeeList(false)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                {
                                    !showingEmployeeList &&
                                    <div className="mochi-button" onClick={() => setShowingEmployeeList(true)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Cancel</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    !showingEmployeeList &&
                                    <div className="mochi-button" onClick={searchEmployeeBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Send</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-slider">
                            <div className="form-slider-wrapper" style={{ left: showingEmployeeList ? 0 : '-100%' }}>
                                <div className="employee-list-box">
                                    {
                                        (selectedCompany?.employees || []).length > 0 &&
                                        <div className="employee-list-header">
                                            <div className="employee-list-col tcol first-name">First Name</div>
                                            <div className="employee-list-col tcol last-name">Last Name</div>
                                            <div className="employee-list-col tcol phone-work">Phone</div>
                                            <div className="employee-list-col tcol email-work">E-Mail</div>
                                            <div className="employee-list-col tcol employee-selected"></div>
                                            <div className="employee-list-col tcol pri"></div>
                                        </div>
                                    }

                                    <div className="employee-list-wrapper">
                                        {
                                            (selectedCompany?.employees || []).map((employee, index) => {
                                                return (
                                                    <div className="employee-list-item" key={index} onDoubleClick={async () => {
                                                        let panel = {
                                                            panelName: `${props.panelName}-employees`,
                                                            component: <Employees
                                                                title='Employee'
                                                                tabTimes={122000 + props.tabTimes}
                                                                panelName={`${props.panelName}-employees`}
                                                                savingEmployeeUrl='/saveEmployee'
                                                                deletingEmployeeUrl='/deleteEmployee'
                                                                uploadAvatarUrl='/uploadEmployeeAvatar'
                                                                removeAvatarUrl='/removeEmployeeAvatar'
                                                                origin={props.origin}
                                                                owner='company'
                                                                openPanel={props.openPanel}
                                                                closePanel={props.closePanel}
                                                                componentId={moment().format('x')}

                                                                employeeSearchCompany={{
                                                                    ...selectedCompany,
                                                                    selectedEmployee: employee
                                                                }}
                                                            />
                                                        }

                                                        props.openPanel(panel, props.origin);
                                                    }} onClick={() => setSelectedEmployee(employee)}>
                                                        <div className="employee-list-col tcol first-name">{employee.first_name}</div>
                                                        <div className="employee-list-col tcol last-name">{employee.last_name}</div>
                                                        <div className="employee-list-col tcol phone-work">{
                                                            employee.primary_phone === 'work' ? employee.phone_work
                                                                : employee.primary_phone === 'fax' ? employee.phone_work_fax
                                                                    : employee.primary_phone === 'mobile' ? employee.phone_mobile
                                                                        : employee.primary_phone === 'direct' ? employee.phone_direct
                                                                            : employee.primary_phone === 'other' ? employee.phone_other
                                                                                : ''
                                                        }</div>
                                                        <div className="employee-list-col tcol email-work">{
                                                            employee.primary_email === 'work' ? employee.email_work
                                                                : employee.primary_email === 'personal' ? employee.email_personal
                                                                    : employee.primary_email === 'other' ? employee.email_other
                                                                        : ''
                                                        }</div>
                                                        {
                                                            (employee.id === (selectedEmployee?.id || 0)) &&
                                                            <div className="employee-list-col tcol employee-selected">
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </div>
                                                        }
                                                        {
                                                            (employee.is_primary_admin === 1) &&
                                                            <div className="employee-list-col tcol pri">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="employee-search-box">
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="First Name" onChange={e => setEmployeeSearch({ ...employeeSearch, first_name: e.target.value })} value={employeeSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, last_name: e.target.value })} value={employeeSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, address1: e.target.value })} value={employeeSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, address2: e.target.value })} value={employeeSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, city: e.target.value })} value={employeeSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, state: e.target.value })} value={employeeSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => { setShowingEmployeeList(false) }} onChange={e => setEmployeeSearch({ ...employeeSearch, phone: e.target.value })} value={employeeSearch.phone || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.keyCode || e.which;

                                                    if (key === 9) {
                                                        let elems = document.getElementsByTagName('input');

                                                        for (var i = elems.length; i--;) {
                                                            if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === '29') {
                                                                elems[i].focus();
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => { setShowingEmployeeList(false) }}
                                                onChange={e => setEmployeeSearch({ ...employeeSearch, email: e.target.value })}
                                                value={employeeSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="company-info-agents">

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Agents</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    if (selectedAgent.id === undefined) {
                                        window.alert('You must select an agent first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-agents`,
                                        component: <Agents
                                            title='Agent'
                                            tabTimes={222000 + props.tabTimes}
                                            panelName={`${props.panelName}-agents`}
                                            savingAgentUrl='/saveAgent'
                                            deletingAgentUrl='/deleteAgent'
                                            uploadAvatarUrl='/uploadAgentAvatar'
                                            removeAvatarUrl='/removeAgentAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            agentSearchCompany={{
                                                ...selectedCompany,
                                                selectedAgent: selectedAgent
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-agents`,
                                        component: <Agents
                                            title='Agent'
                                            tabTimes={222000 + props.tabTimes}
                                            panelName={`${props.panelName}-agents`}
                                            savingAgentUrl='/saveAgent'
                                            deletingAgentUrl='/deleteAgent'
                                            uploadAvatarUrl='/uploadAgentAvatar'
                                            removeAvatarUrl='/removeAgentAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            isEditingAgent={true}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            agentSearchCompany={{
                                                ...selectedCompany,
                                                selectedAgent: { id: 0, company_id: selectedCompany?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Agent</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedAgent({});
                                    refAgentFirstName.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={27 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refAgentFirstName}
                                    onInput={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedAgent?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={28 + props.tabTimes} type="text" placeholder="Last Name"
                                    onInput={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedAgent?.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={29 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text"
                                        placeholder="Phone"
                                        ref={refAgentPhone}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showAgentPhones) {
                                                        let selectedIndex = agentPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (agentPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentPhonePopupItems.current.map((r, i) => {
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
                                                        if (agentPhoneItems.length > 1) {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgent?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowAgentPhones(true);

                                                            refAgentPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showAgentPhones) {
                                                        let selectedIndex = agentPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (agentPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentPhonePopupItems.current.map((r, i) => {
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
                                                        if (agentPhoneItems.length > 1) {
                                                            await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgent?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowAgentPhones(true);

                                                            refAgentPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowAgentPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showAgentPhones && agentPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                primary_phone: agentPhoneItems[agentPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentForSaving({ keyCode: 9 });
                                                        setShowAgentPhones(false);
                                                        refAgentPhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showAgentPhones) {
                                                        e.preventDefault();
                                                        await setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                primary_phone: agentPhoneItems[agentPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentForSaving({ keyCode: 9 });
                                                        setShowAgentPhones(false);
                                                        refAgentPhone.current.inputElement.focus();
                                                    } else {
                                                        validateAgentForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedAgent?.id || 0) === 0) {
                                                setSelectedAgent(selectedAgent => {
                                                    return {
                                                        ...selectedAgent,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedAgent?.primary_phone || '') === '') {
                                                    setSelectedAgent(selectedAgent => {
                                                        return {
                                                            ...selectedAgent,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedAgent?.primary_phone) {
                                                        case 'work':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedAgent?.id || 0) === 0) {
                                                setSelectedAgent(selectedAgent => {
                                                    return {
                                                        ...selectedAgent,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedAgent?.primary_phone || '') === '') {
                                                    setSelectedAgent(selectedAgent => {
                                                        return {
                                                            ...selectedAgent,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedAgent?.primary_phone) {
                                                        case 'work':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedAgent?.primary_phone || '') === 'work'
                                                ? (selectedAgent?.phone_work || '')
                                                : (selectedAgent?.primary_phone || '') === 'fax'
                                                    ? (selectedAgent?.phone_work_fax || '')
                                                    : (selectedAgent?.primary_phone || '') === 'mobile'
                                                        ? (selectedAgent?.phone_mobile || '')
                                                        : (selectedAgent?.primary_phone || '') === 'direct'
                                                            ? (selectedAgent?.phone_direct || '')
                                                            : (selectedAgent?.primary_phone || '') === 'other'
                                                                ? (selectedAgent?.phone_other || '')
                                                                : ''
                                        } />
                                    {
                                        (selectedAgent?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-agent-primary-phone': true,
                                                'pushed': (agentPhoneItems.length > 1)
                                            })}>
                                            {selectedAgent?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        agentPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showAgentPhones) {
                                                setShowAgentPhones(false);
                                            } else {
                                                if (agentPhoneItems.length > 1) {
                                                    await setAgentPhoneItems(agentPhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedAgent?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowAgentPhones(true);

                                                        refAgentPhonePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refAgentPhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    agentPhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-agent-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refAgentPhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            agentPhoneItems.map((item, index) => {
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
                                                                            await setSelectedAgent(selectedAgent => {
                                                                                return {
                                                                                    ...selectedAgent,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateAgentForSaving({ keyCode: 9 });
                                                                            setShowAgentPhones(false);
                                                                            refAgentPhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refAgentPhonePopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Phone Work `
                                                                                : item.type === 'fax' ? `Phone Work Fax `
                                                                                    : item.type === 'mobile' ? `Phone Mobile `
                                                                                        : item.type === 'direct' ? `Phone Direct `
                                                                                            : item.type === 'other' ? `Phone Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.phone
                                                                                    : item.type === 'fax' ? item.phone
                                                                                        : item.type === 'mobile' ? item.phone
                                                                                            : item.type === 'direct' ? item.phone
                                                                                                : item.type === 'other' ? item.phone : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={30 + props.tabTimes} type="text" placeholder="Ext"
                                        onInput={e => {
                                            setSelectedAgent(selectedAgent => {
                                                return {
                                                    ...selectedAgent,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedAgent(selectedAgent => {
                                                return {
                                                    ...selectedAgent,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedAgent?.phone_ext || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={31 + props.tabTimes} type="text" placeholder="Agent Code"
                                        readOnly={true}
                                        onInput={e => { }}
                                        onChange={e => { }}
                                        value={
                                            (selectedAgent?.id || 0) > 0
                                                ? 'AG' + selectedAgent.id.toString().padStart(4, '0')
                                                : ''
                                        } />
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input style={{
                                        width: 'calc(100% - 25px)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                        tabIndex={32 + props.tabTimes}
                                        type="text"
                                        placeholder="E-Mail"
                                        ref={refAgentEmail}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showAgentEmails) {
                                                        let selectedIndex = agentEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (agentEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentEmailPopupItems.current.map((r, i) => {
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
                                                        if (agentEmailItems.length > 1) {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgent?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowAgentEmails(true);

                                                            refAgentEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showAgentEmails) {
                                                        let selectedIndex = agentEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                if (selectedIndex === (agentEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentEmailPopupItems.current.map((r, i) => {
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
                                                        if (agentEmailItems.length > 1) {
                                                            await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgent?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowAgentEmails(true);

                                                            refAgentEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowAgentEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showAgentEmails && agentEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                primary_email: agentEmailItems[agentEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentForSaving({ keyCode: 9 });
                                                        setShowAgentEmails(false);
                                                        refAgentEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showAgentEmails) {
                                                        e.preventDefault();
                                                        await setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                primary_email: agentEmailItems[agentEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentForSaving({ keyCode: 9 });
                                                        setShowAgentEmails(false);
                                                        refAgentEmail.current.focus();
                                                    } else {
                                                        validateAgentForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedAgent?.primary_email || '') === '') {
                                                setSelectedAgent(selectedAgent => {
                                                    return {
                                                        ...selectedAgent,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedAgent?.primary_email) {
                                                    case 'work':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedAgent?.primary_email || '') === '') {
                                                setSelectedAgent(selectedAgent => {
                                                    return {
                                                        ...selectedAgent,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedAgent?.primary_email) {
                                                    case 'work':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedAgent(selectedAgent => {
                                                            return {
                                                                ...selectedAgent,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedAgent?.primary_email || '') === 'work'
                                                ? (selectedAgent?.email_work || '')
                                                : (selectedAgent?.primary_email || '') === 'personal'
                                                    ? (selectedAgent?.email_personal || '')
                                                    : (selectedAgent?.primary_email || '') === 'other'
                                                        ? (selectedAgent?.email_other || '')
                                                        : ''
                                        } />

                                    {
                                        (selectedAgent?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-agent-primary-email': true,
                                                'pushed': (agentEmailItems.length > 1)
                                            })}>
                                            {selectedAgent?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        agentEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showAgentEmails) {
                                                setShowAgentEmails(false);
                                            } else {
                                                if (agentEmailItems.length > 1) {
                                                    await setAgentEmailItems(agentEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedAgent?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowAgentEmails(true);

                                                        refAgentEmailPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refAgentEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    agentEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-agent-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refAgentEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            agentEmailItems.map((item, index) => {
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
                                                                            await setSelectedAgent(selectedAgent => {
                                                                                return {
                                                                                    ...selectedAgent,
                                                                                    primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateAgentForSaving({ keyCode: 9 });
                                                                            setShowAgentEmails(false);
                                                                            refAgentEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refAgentEmailPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Email Work `
                                                                                : item.type === 'personal' ? `Email Personal `
                                                                                    : item.type === 'other' ? `Email Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.email
                                                                                    : item.type === 'personal' ? item.email
                                                                                        : item.type === 'other' ? item.email : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={33 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={validateAgentForSaving}
                                    onInput={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedAgent(selectedAgent => {
                                            return {
                                                ...selectedAgent,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedAgent?.notes || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    showingAgentList &&
                                    <div className="mochi-button" onClick={() => setShowingAgentList(false)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                {
                                    !showingAgentList &&
                                    <div className="mochi-button" onClick={() => setShowingAgentList(true)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Cancel</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    !showingAgentList &&
                                    <div className="mochi-button" onClick={searchAgentBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Send</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-slider">
                            <div className="form-slider-wrapper" style={{ left: showingAgentList ? 0 : '-100%' }}>
                                <div className="agent-list-box">
                                    {
                                        (selectedCompany?.agents || []).length > 0 &&
                                        <div className="agent-list-header">
                                            <div className="agent-list-col tcol first-name">First Name</div>
                                            <div className="agent-list-col tcol last-name">Last Name</div>
                                            <div className="agent-list-col tcol phone-work">Phone</div>
                                            <div className="agent-list-col tcol email-work">E-Mail</div>
                                            <div className="agent-list-col tcol agent-selected"></div>
                                            <div className="agent-list-col tcol pri"></div>
                                        </div>
                                    }

                                    <div className="agent-list-wrapper">
                                        {
                                            (selectedCompany?.agents || []).map((agent, index) => {
                                                return (
                                                    <div className="agent-list-item" key={index} onDoubleClick={async () => {
                                                        let panel = {
                                                            panelName: `${props.panelName}-agents`,
                                                            component: <Agents
                                                                title='Agent'
                                                                tabTimes={222000 + props.tabTimes}
                                                                panelName={`${props.panelName}-agents`}
                                                                savingAgentUrl='/saveAgent'
                                                                deletingAgentUrl='/deleteAgent'
                                                                uploadAvatarUrl='/uploadAgentAvatar'
                                                                removeAvatarUrl='/removeAgentAvatar'
                                                                origin={props.origin}
                                                                owner='company'
                                                                openPanel={props.openPanel}
                                                                closePanel={props.closePanel}
                                                                componentId={moment().format('x')}

                                                                agentSearchCompany={{
                                                                    ...selectedCompany,
                                                                    selectedAgent: agent
                                                                }}
                                                            />
                                                        }

                                                        props.openPanel(panel, props.origin);
                                                    }} onClick={() => setSelectedAgent(agent)}>
                                                        <div className="agent-list-col tcol first-name">{agent.first_name}</div>
                                                        <div className="agent-list-col tcol last-name">{agent.last_name}</div>
                                                        <div className="agent-list-col tcol phone-work">{
                                                            agent.primary_phone === 'work' ? agent.phone_work
                                                                : agent.primary_phone === 'fax' ? agent.phone_work_fax
                                                                    : agent.primary_phone === 'mobile' ? agent.phone_mobile
                                                                        : agent.primary_phone === 'direct' ? agent.phone_direct
                                                                            : agent.primary_phone === 'other' ? agent.phone_other
                                                                                : ''
                                                        }</div>
                                                        <div className="agent-list-col tcol email-work">{
                                                            agent.primary_email === 'work' ? agent.email_work
                                                                : agent.primary_email === 'personal' ? agent.email_personal
                                                                    : agent.primary_email === 'other' ? agent.email_other
                                                                        : ''
                                                        }</div>
                                                        {
                                                            (agent.id === (selectedAgent?.id || 0)) &&
                                                            <div className="agent-list-col tcol agent-selected">
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </div>
                                                        }
                                                        {
                                                            (agent.is_primary_admin === 1) &&
                                                            <div className="agent-list-col tcol pri">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="agent-search-box">
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="First Name" onChange={e => setAgentSearch({ ...agentSearch, first_name: e.target.value })} value={agentSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, last_name: e.target.value })} value={agentSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, address1: e.target.value })} value={agentSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, address2: e.target.value })} value={agentSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, city: e.target.value })} value={agentSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, state: e.target.value })} value={agentSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => { setShowingAgentList(false) }} onChange={e => setAgentSearch({ ...agentSearch, phone: e.target.value })} value={agentSearch.phone || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.keyCode || e.which;

                                                    if (key === 9) {
                                                        let elems = document.getElementsByTagName('input');

                                                        for (var i = elems.length; i--;) {
                                                            if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === '29') {
                                                                elems[i].focus();
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => { setShowingAgentList(false) }}
                                                onChange={e => setAgentSearch({ ...agentSearch, email: e.target.value })}
                                                value={agentSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="company-info-drivers">

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Company Drivers</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    if (selectedDriver.id === undefined) {
                                        window.alert('You must select a driver first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-drivers`,
                                        component: <Drivers
                                            title='Driver'
                                            tabTimes={322000 + props.tabTimes}
                                            panelName={`${props.panelName}-drivers`}
                                            savingDriverUrl='/saveDriver'
                                            deletingDriverUrl='/deleteDriver'
                                            uploadAvatarUrl='/uploadDriverAvatar'
                                            removeAvatarUrl='/removeDriverAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            driverSearchCompany={{
                                                ...selectedCompany,
                                                selectedDriver: selectedDriver
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-drivers`,
                                        component: <Drivers
                                            title='Driver'
                                            tabTimes={322000 + props.tabTimes}
                                            panelName={`${props.panelName}-drivers`}
                                            savingDriverUrl='/saveDriver'
                                            deletingDriverUrl='/deleteDriver'
                                            uploadAvatarUrl='/uploadDriverAvatar'
                                            removeAvatarUrl='/removeDriverAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            isEditingDriver={true}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            driverSearchCompany={{
                                                ...selectedCompany,
                                                selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Driver</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedDriver({});
                                    refDriverFirstName.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={34 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refDriverFirstName}
                                    onInput={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedDriver?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={35 + props.tabTimes} type="text" placeholder="Last Name"
                                    onInput={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedDriver?.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={36 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text"
                                        placeholder="Phone"
                                        ref={refDriverPhone}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showDriverPhones) {
                                                        let selectedIndex = driverPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (driverPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverPhonePopupItems.current.map((r, i) => {
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
                                                        if (driverPhoneItems.length > 1) {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedDriver?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowDriverPhones(true);

                                                            refDriverPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showDriverPhones) {
                                                        let selectedIndex = driverPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (driverPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverPhonePopupItems.current.map((r, i) => {
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
                                                        if (driverPhoneItems.length > 1) {
                                                            await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedDriver?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowDriverPhones(true);

                                                            refDriverPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowDriverPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showDriverPhones && driverPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                primary_phone: driverPhoneItems[driverPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setShowDriverPhones(false);
                                                        refDriverPhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showDriverPhones) {
                                                        e.preventDefault();
                                                        await setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                primary_phone: driverPhoneItems[driverPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setShowDriverPhones(false);
                                                        refDriverPhone.current.inputElement.focus();
                                                    } else {
                                                        validateDriverForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedDriver?.id || 0) === 0) {
                                                setSelectedDriver(selectedDriver => {
                                                    return {
                                                        ...selectedDriver,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedDriver?.primary_phone || '') === '') {
                                                    setSelectedDriver(selectedDriver => {
                                                        return {
                                                            ...selectedDriver,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedDriver?.primary_phone) {
                                                        case 'work':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedDriver?.id || 0) === 0) {
                                                setSelectedDriver(selectedDriver => {
                                                    return {
                                                        ...selectedDriver,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedDriver?.primary_phone || '') === '') {
                                                    setSelectedDriver(selectedDriver => {
                                                        return {
                                                            ...selectedDriver,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedDriver?.primary_phone) {
                                                        case 'work':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedDriver(selectedDriver => {
                                                                return {
                                                                    ...selectedDriver,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedDriver?.primary_phone || '') === 'work'
                                                ? (selectedDriver?.phone_work || '')
                                                : (selectedDriver?.primary_phone || '') === 'fax'
                                                    ? (selectedDriver?.phone_work_fax || '')
                                                    : (selectedDriver?.primary_phone || '') === 'mobile'
                                                        ? (selectedDriver?.phone_mobile || '')
                                                        : (selectedDriver?.primary_phone || '') === 'direct'
                                                            ? (selectedDriver?.phone_direct || '')
                                                            : (selectedDriver?.primary_phone || '') === 'other'
                                                                ? (selectedDriver?.phone_other || '')
                                                                : ''
                                        } />
                                    {
                                        (selectedDriver?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-driver-primary-phone': true,
                                                'pushed': (driverPhoneItems.length > 1)
                                            })}>
                                            {selectedDriver?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        driverPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showDriverPhones) {
                                                setShowDriverPhones(false);
                                            } else {
                                                if (driverPhoneItems.length > 1) {
                                                    await setDriverPhoneItems(driverPhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedDriver?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowDriverPhones(true);

                                                        refDriverPhonePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refDriverPhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    driverPhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-driver-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refDriverPhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            driverPhoneItems.map((item, index) => {
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
                                                                            await setSelectedDriver(selectedDriver => {
                                                                                return {
                                                                                    ...selectedDriver,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateDriverForSaving({ keyCode: 9 });
                                                                            setShowDriverPhones(false);
                                                                            refDriverPhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refDriverPhonePopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Phone Work `
                                                                                : item.type === 'fax' ? `Phone Work Fax `
                                                                                    : item.type === 'mobile' ? `Phone Mobile `
                                                                                        : item.type === 'direct' ? `Phone Direct `
                                                                                            : item.type === 'other' ? `Phone Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.phone
                                                                                    : item.type === 'fax' ? item.phone
                                                                                        : item.type === 'mobile' ? item.phone
                                                                                            : item.type === 'direct' ? item.phone
                                                                                                : item.type === 'other' ? item.phone : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={37 + props.tabTimes} type="text" placeholder="Ext"
                                        onInput={e => {
                                            setSelectedDriver(selectedDriver => {
                                                return {
                                                    ...selectedDriver,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDriver(selectedDriver => {
                                                return {
                                                    ...selectedDriver,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDriver?.phone_ext || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={38 + props.tabTimes} type="text" placeholder="Driver Code"
                                        readOnly={true}
                                        onInput={e => { }}
                                        onChange={e => { }}
                                        value={
                                            (selectedDriver?.id || 0) > 0
                                                ? 'DV' + selectedDriver.id.toString().padStart(4, '0')
                                                : ''
                                        } />
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input style={{
                                        width: 'calc(100% - 25px)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                        tabIndex={39 + props.tabTimes}
                                        type="text"
                                        placeholder="E-Mail"
                                        ref={refDriverEmail}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showDriverEmails) {
                                                        let selectedIndex = driverEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (driverEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverEmailPopupItems.current.map((r, i) => {
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
                                                        if (driverEmailItems.length > 1) {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedDriver?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowDriverEmails(true);

                                                            refDriverEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showDriverEmails) {
                                                        let selectedIndex = driverEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                if (selectedIndex === (driverEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverEmailPopupItems.current.map((r, i) => {
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
                                                        if (driverEmailItems.length > 1) {
                                                            await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedDriver?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowDriverEmails(true);

                                                            refDriverEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowDriverEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showDriverEmails && driverEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                primary_email: driverEmailItems[driverEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setShowDriverEmails(false);
                                                        refDriverEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showDriverEmails) {
                                                        e.preventDefault();
                                                        await setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                primary_email: driverEmailItems[driverEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setShowDriverEmails(false);
                                                        refDriverEmail.current.focus();
                                                    } else {
                                                        validateDriverForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedDriver?.primary_email || '') === '') {
                                                setSelectedDriver(selectedDriver => {
                                                    return {
                                                        ...selectedDriver,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedDriver?.primary_email) {
                                                    case 'work':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedDriver?.primary_email || '') === '') {
                                                setSelectedDriver(selectedDriver => {
                                                    return {
                                                        ...selectedDriver,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedDriver?.primary_email) {
                                                    case 'work':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedDriver(selectedDriver => {
                                                            return {
                                                                ...selectedDriver,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedDriver?.primary_email || '') === 'work'
                                                ? (selectedDriver?.email_work || '')
                                                : (selectedDriver?.primary_email || '') === 'personal'
                                                    ? (selectedDriver?.email_personal || '')
                                                    : (selectedDriver?.primary_email || '') === 'other'
                                                        ? (selectedDriver?.email_other || '')
                                                        : ''
                                        } />

                                    {
                                        (selectedDriver?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-driver-primary-email': true,
                                                'pushed': (driverEmailItems.length > 1)
                                            })}>
                                            {selectedDriver?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        driverEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showDriverEmails) {
                                                setShowDriverEmails(false);
                                            } else {
                                                if (driverEmailItems.length > 1) {
                                                    await setDriverEmailItems(driverEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedDriver?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowDriverEmails(true);

                                                        refDriverEmailPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refDriverEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    driverEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-driver-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refDriverEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            driverEmailItems.map((item, index) => {
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
                                                                            await setSelectedDriver(selectedDriver => {
                                                                                return {
                                                                                    ...selectedDriver,
                                                                                    primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateDriverForSaving({ keyCode: 9 });
                                                                            setShowDriverEmails(false);
                                                                            refDriverEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refDriverEmailPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Email Work `
                                                                                : item.type === 'personal' ? `Email Personal `
                                                                                    : item.type === 'other' ? `Email Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.email
                                                                                    : item.type === 'personal' ? item.email
                                                                                        : item.type === 'other' ? item.email : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={40 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver(selectedDriver => {
                                            return {
                                                ...selectedDriver,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedDriver?.notes || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    showingDriverList &&
                                    <div className="mochi-button" onClick={() => setShowingDriverList(false)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                {
                                    !showingDriverList &&
                                    <div className="mochi-button" onClick={() => setShowingDriverList(true)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Cancel</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    !showingDriverList &&
                                    <div className="mochi-button" onClick={searchDriverBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Send</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-slider">
                            <div className="form-slider-wrapper" style={{ left: showingDriverList ? 0 : '-100%' }}>
                                <div className="driver-list-box">
                                    {
                                        (selectedCompany?.drivers || []).length > 0 &&
                                        <div className="driver-list-header">
                                            <div className="driver-list-col tcol first-name">First Name</div>
                                            <div className="driver-list-col tcol last-name">Last Name</div>
                                            <div className="driver-list-col tcol phone-work">Phone</div>
                                            <div className="driver-list-col tcol email-work">E-Mail</div>
                                            <div className="driver-list-col tcol driver-selected"></div>
                                            <div className="driver-list-col tcol pri"></div>
                                        </div>
                                    }

                                    <div className="driver-list-wrapper">
                                        {
                                            (selectedCompany?.drivers || []).map((driver, index) => {
                                                return (
                                                    <div className="driver-list-item" key={index} onDoubleClick={async () => {
                                                        let panel = {
                                                            panelName: `${props.panelName}-drivers`,
                                                            component: <Drivers
                                                                title='Driver'
                                                                tabTimes={322000 + props.tabTimes}
                                                                panelName={`${props.panelName}-drivers`}
                                                                savingDriverUrl='/saveDriver'
                                                                deletingDriverUrl='/deleteDriver'
                                                                uploadAvatarUrl='/uploadDriverAvatar'
                                                                removeAvatarUrl='/removeDriverAvatar'
                                                                origin={props.origin}
                                                                owner='company'
                                                                openPanel={props.openPanel}
                                                                closePanel={props.closePanel}
                                                                componentId={moment().format('x')}

                                                                driverSearchCompany={{
                                                                    ...selectedCompany,
                                                                    selectedDriver: driver
                                                                }}
                                                            />
                                                        }

                                                        props.openPanel(panel, props.origin);
                                                    }} onClick={() => setSelectedDriver(driver)}>
                                                        <div className="driver-list-col tcol first-name">{driver.first_name}</div>
                                                        <div className="driver-list-col tcol last-name">{driver.last_name}</div>
                                                        <div className="driver-list-col tcol phone-work">{
                                                            driver.primary_phone === 'work' ? driver.phone_work
                                                                : driver.primary_phone === 'fax' ? driver.phone_work_fax
                                                                    : driver.primary_phone === 'mobile' ? driver.phone_mobile
                                                                        : driver.primary_phone === 'direct' ? driver.phone_direct
                                                                            : driver.primary_phone === 'other' ? driver.phone_other
                                                                                : ''
                                                        }</div>
                                                        <div className="driver-list-col tcol email-work">{
                                                            driver.primary_email === 'work' ? driver.email_work
                                                                : driver.primary_email === 'personal' ? driver.email_personal
                                                                    : driver.primary_email === 'other' ? driver.email_other
                                                                        : ''
                                                        }</div>
                                                        {
                                                            (driver.id === (selectedDriver?.id || 0)) &&
                                                            <div className="driver-list-col tcol driver-selected">
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </div>
                                                        }
                                                        {
                                                            (driver.is_primary_admin === 1) &&
                                                            <div className="driver-list-col tcol pri">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="driver-search-box">
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="First Name" onChange={e => setDriverSearch({ ...driverSearch, first_name: e.target.value })} value={driverSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, last_name: e.target.value })} value={driverSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, address1: e.target.value })} value={driverSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, address2: e.target.value })} value={driverSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, city: e.target.value })} value={driverSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, state: e.target.value })} value={driverSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => { setShowingDriverList(false) }} onChange={e => setDriverSearch({ ...driverSearch, phone: e.target.value })} value={driverSearch.phone || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.keyCode || e.which;

                                                    if (key === 9) {
                                                        let elems = document.getElementsByTagName('input');

                                                        for (var i = elems.length; i--;) {
                                                            if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === '29') {
                                                                elems[i].focus();
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => { setShowingDriverList(false) }}
                                                onChange={e => setDriverSearch({ ...driverSearch, email: e.target.value })}
                                                value={driverSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="company-info-owner-operators">

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Owner Operators</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    if (selectedOperator.id === undefined) {
                                        window.alert('You must select an operator first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-operators`,
                                        component: <Operators
                                            title='Operator'
                                            tabTimes={422000 + props.tabTimes}
                                            panelName={`${props.panelName}-operators`}
                                            savingOperatorUrl='/saveOperator'
                                            deletingOperatorUrl='/deleteOperator'
                                            uploadAvatarUrl='/uploadOperatorAvatar'
                                            removeAvatarUrl='/removeOperatorAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            operatorSearchCompany={{
                                                ...selectedCompany,
                                                selectedOperator: selectedOperator
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-operators`,
                                        component: <Operators
                                            title='Operator'
                                            tabTimes={422000 + props.tabTimes}
                                            panelName={`${props.panelName}-operators`}
                                            savingOperatorUrl='/saveOperator'
                                            deletingOperatorUrl='/deleteOperator'
                                            uploadAvatarUrl='/uploadOperatorAvatar'
                                            removeAvatarUrl='/removeOperatorAvatar'
                                            origin={props.origin}
                                            owner='company'
                                            isEditingOperator={true}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            operatorSearchCompany={{
                                                ...selectedCompany,
                                                selectedOperator: { id: 0, company_id: selectedCompany?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Operator</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedOperator({});
                                    refOperatorFirstName.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={41 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refOperatorFirstName}
                                    onInput={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedOperator?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={42 + props.tabTimes} type="text" placeholder="Last Name"
                                    onInput={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedOperator?.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={43 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text"
                                        placeholder="Phone"
                                        ref={refOperatorPhone}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showOperatorPhones) {
                                                        let selectedIndex = operatorPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (operatorPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refOperatorPhonePopupItems.current.map((r, i) => {
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
                                                        if (operatorPhoneItems.length > 1) {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedOperator?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowOperatorPhones(true);

                                                            refOperatorPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showOperatorPhones) {
                                                        let selectedIndex = operatorPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (operatorPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refOperatorPhonePopupItems.current.map((r, i) => {
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
                                                        if (operatorPhoneItems.length > 1) {
                                                            await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedOperator?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowOperatorPhones(true);

                                                            refOperatorPhonePopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowOperatorPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showOperatorPhones && operatorPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                primary_phone: operatorPhoneItems[operatorPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateOperatorForSaving({ keyCode: 9 });
                                                        setShowOperatorPhones(false);
                                                        refOperatorPhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showOperatorPhones) {
                                                        e.preventDefault();
                                                        await setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                primary_phone: operatorPhoneItems[operatorPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateOperatorForSaving({ keyCode: 9 });
                                                        setShowOperatorPhones(false);
                                                        refOperatorPhone.current.inputElement.focus();
                                                    } else {
                                                        validateOperatorForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedOperator?.id || 0) === 0) {
                                                setSelectedOperator(selectedOperator => {
                                                    return {
                                                        ...selectedOperator,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedOperator?.primary_phone || '') === '') {
                                                    setSelectedOperator(selectedOperator => {
                                                        return {
                                                            ...selectedOperator,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedOperator?.primary_phone) {
                                                        case 'work':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedOperator?.id || 0) === 0) {
                                                setSelectedOperator(selectedOperator => {
                                                    return {
                                                        ...selectedOperator,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedOperator?.primary_phone || '') === '') {
                                                    setSelectedOperator(selectedOperator => {
                                                        return {
                                                            ...selectedOperator,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedOperator?.primary_phone) {
                                                        case 'work':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedOperator(selectedOperator => {
                                                                return {
                                                                    ...selectedOperator,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedOperator?.primary_phone || '') === 'work'
                                                ? (selectedOperator?.phone_work || '')
                                                : (selectedOperator?.primary_phone || '') === 'fax'
                                                    ? (selectedOperator?.phone_work_fax || '')
                                                    : (selectedOperator?.primary_phone || '') === 'mobile'
                                                        ? (selectedOperator?.phone_mobile || '')
                                                        : (selectedOperator?.primary_phone || '') === 'direct'
                                                            ? (selectedOperator?.phone_direct || '')
                                                            : (selectedOperator?.primary_phone || '') === 'other'
                                                                ? (selectedOperator?.phone_other || '')
                                                                : ''
                                        } />
                                    {
                                        (selectedOperator?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-operator-primary-phone': true,
                                                'pushed': (operatorPhoneItems.length > 1)
                                            })}>
                                            {selectedOperator?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        operatorPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showOperatorPhones) {
                                                setShowOperatorPhones(false);
                                            } else {
                                                if (operatorPhoneItems.length > 1) {
                                                    await setOperatorPhoneItems(operatorPhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedOperator?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowOperatorPhones(true);

                                                        refOperatorPhonePopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refOperatorPhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    operatorPhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-operator-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refOperatorPhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            operatorPhoneItems.map((item, index) => {
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
                                                                            await setSelectedOperator(selectedOperator => {
                                                                                return {
                                                                                    ...selectedOperator,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateOperatorForSaving({ keyCode: 9 });
                                                                            setShowOperatorPhones(false);
                                                                            refOperatorPhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refOperatorPhonePopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Phone Work `
                                                                                : item.type === 'fax' ? `Phone Work Fax `
                                                                                    : item.type === 'mobile' ? `Phone Mobile `
                                                                                        : item.type === 'direct' ? `Phone Direct `
                                                                                            : item.type === 'other' ? `Phone Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.phone
                                                                                    : item.type === 'fax' ? item.phone
                                                                                        : item.type === 'mobile' ? item.phone
                                                                                            : item.type === 'direct' ? item.phone
                                                                                                : item.type === 'other' ? item.phone : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={44 + props.tabTimes} type="text" placeholder="Ext"
                                        onInput={e => {
                                            setSelectedOperator(selectedOperator => {
                                                return {
                                                    ...selectedOperator,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedOperator(selectedOperator => {
                                                return {
                                                    ...selectedOperator,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedOperator?.phone_ext || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={45 + props.tabTimes} type="text" placeholder="Operator Code"
                                        readOnly={true}
                                        onInput={e => { }}
                                        onChange={e => { }}
                                        value={
                                            (selectedOperator?.id || 0) > 0
                                                ? 'OO' + selectedOperator.id.toString().padStart(4, '0')
                                                : ''
                                        } />
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input style={{
                                        width: 'calc(100% - 25px)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                        tabIndex={46 + props.tabTimes}
                                        type="text"
                                        placeholder="E-Mail"
                                        ref={refOperatorEmail}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showOperatorEmails) {
                                                        let selectedIndex = operatorEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (operatorEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refOperatorEmailPopupItems.current.map((r, i) => {
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
                                                        if (operatorEmailItems.length > 1) {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedOperator?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowOperatorEmails(true);

                                                            refOperatorEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showOperatorEmails) {
                                                        let selectedIndex = operatorEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                if (selectedIndex === (operatorEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refOperatorEmailPopupItems.current.map((r, i) => {
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
                                                        if (operatorEmailItems.length > 1) {
                                                            await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedOperator?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowOperatorEmails(true);

                                                            refOperatorEmailPopupItems.current.map((r, i) => {
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
                                                    break;

                                                case 27: // escape
                                                    setShowOperatorEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showOperatorEmails && operatorEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                primary_email: operatorEmailItems[operatorEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateOperatorForSaving({ keyCode: 9 });
                                                        setShowOperatorEmails(false);
                                                        refOperatorEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showOperatorEmails) {
                                                        e.preventDefault();
                                                        await setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                primary_email: operatorEmailItems[operatorEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateOperatorForSaving({ keyCode: 9 });
                                                        setShowOperatorEmails(false);
                                                        refOperatorEmail.current.focus();
                                                    } else {
                                                        validateOperatorForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedOperator?.primary_email || '') === '') {
                                                setSelectedOperator(selectedOperator => {
                                                    return {
                                                        ...selectedOperator,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedOperator?.primary_email) {
                                                    case 'work':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedOperator?.primary_email || '') === '') {
                                                setSelectedOperator(selectedOperator => {
                                                    return {
                                                        ...selectedOperator,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedOperator?.primary_email) {
                                                    case 'work':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedOperator(selectedOperator => {
                                                            return {
                                                                ...selectedOperator,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedOperator?.primary_email || '') === 'work'
                                                ? (selectedOperator?.email_work || '')
                                                : (selectedOperator?.primary_email || '') === 'personal'
                                                    ? (selectedOperator?.email_personal || '')
                                                    : (selectedOperator?.primary_email || '') === 'other'
                                                        ? (selectedOperator?.email_other || '')
                                                        : ''
                                        } />

                                    {
                                        (selectedOperator?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-operator-primary-email': true,
                                                'pushed': (operatorEmailItems.length > 1)
                                            })}>
                                            {selectedOperator?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        operatorEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showOperatorEmails) {
                                                setShowOperatorEmails(false);
                                            } else {
                                                if (operatorEmailItems.length > 1) {
                                                    await setOperatorEmailItems(operatorEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedOperator?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowOperatorEmails(true);

                                                        refOperatorEmailPopupItems.current.map((r, i) => {
                                                            if (r && r.classList.contains('selected')) {
                                                                r.scrollIntoView({
                                                                    behavior: 'auto',
                                                                    block: 'center',
                                                                    inline: 'nearest'
                                                                })
                                                            }
                                                            return true;
                                                        });
                                                    }, 0)
                                                }
                                            }

                                            refOperatorEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    operatorEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-operator-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refOperatorEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            operatorEmailItems.map((item, index) => {
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
                                                                            await setSelectedOperator(selectedOperator => {
                                                                                return {
                                                                                    ...selectedOperator,
                                                                                    primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateOperatorForSaving({ keyCode: 9 });
                                                                            setShowOperatorEmails(false);
                                                                            refOperatorEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refOperatorEmailPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            item.type === 'work' ? `Email Work `
                                                                                : item.type === 'personal' ? `Email Personal `
                                                                                    : item.type === 'other' ? `Email Other ` : ''
                                                                        }

                                                                        (<b>
                                                                            {
                                                                                item.type === 'work' ? item.email
                                                                                    : item.type === 'personal' ? item.email
                                                                                        : item.type === 'other' ? item.email : ''
                                                                            }
                                                                        </b>)

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
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={47 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={validateOperatorForSaving}
                                    onInput={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedOperator(selectedOperator => {
                                            return {
                                                ...selectedOperator,
                                                notes: e.target.value
                                            }
                                        })
                                    }}
                                    value={selectedOperator?.notes || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    showingOperatorList &&
                                    <div className="mochi-button" onClick={() => setShowingOperatorList(false)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                {
                                    !showingOperatorList &&
                                    <div className="mochi-button" onClick={() => setShowingOperatorList(true)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Cancel</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    !showingOperatorList &&
                                    <div className="mochi-button" onClick={searchOperatorBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Send</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-slider">
                            <div className="form-slider-wrapper" style={{ left: showingOperatorList ? 0 : '-100%' }}>
                                <div className="operator-list-box">
                                    {
                                        (selectedCompany?.operators || []).length > 0 &&
                                        <div className="operator-list-header">
                                            <div className="operator-list-col tcol first-name">First Name</div>
                                            <div className="operator-list-col tcol last-name">Last Name</div>
                                            <div className="operator-list-col tcol phone-work">Phone</div>
                                            <div className="operator-list-col tcol email-work">E-Mail</div>
                                            <div className="operator-list-col tcol operator-selected"></div>
                                            <div className="operator-list-col tcol pri"></div>
                                        </div>
                                    }

                                    <div className="operator-list-wrapper">
                                        {
                                            (selectedCompany?.operators || []).map((operator, index) => {
                                                return (
                                                    <div className="operator-list-item" key={index} onDoubleClick={async () => {
                                                        let panel = {
                                                            panelName: `${props.panelName}-operators`,
                                                            component: <Operators
                                                                title='Operator'
                                                                tabTimes={422000 + props.tabTimes}
                                                                panelName={`${props.panelName}-operators`}
                                                                savingOperatorUrl='/saveOperator'
                                                                deletingOperatorUrl='/deleteOperator'
                                                                uploadAvatarUrl='/uploadOperatorAvatar'
                                                                removeAvatarUrl='/removeOperatorAvatar'
                                                                origin={props.origin}
                                                                owner='company'
                                                                openPanel={props.openPanel}
                                                                closePanel={props.closePanel}
                                                                componentId={moment().format('x')}

                                                                operatorSearchCompany={{
                                                                    ...selectedCompany,
                                                                    selectedOperator: operator
                                                                }}
                                                            />
                                                        }

                                                        props.openPanel(panel, props.origin);
                                                    }} onClick={() => setSelectedOperator(operator)}>
                                                        <div className="operator-list-col tcol first-name">{operator.first_name}</div>
                                                        <div className="operator-list-col tcol last-name">{operator.last_name}</div>
                                                        <div className="operator-list-col tcol phone-work">{
                                                            operator.primary_phone === 'work' ? operator.phone_work
                                                                : operator.primary_phone === 'fax' ? operator.phone_work_fax
                                                                    : operator.primary_phone === 'mobile' ? operator.phone_mobile
                                                                        : operator.primary_phone === 'direct' ? operator.phone_direct
                                                                            : operator.primary_phone === 'other' ? operator.phone_other
                                                                                : ''
                                                        }</div>
                                                        <div className="operator-list-col tcol email-work">{
                                                            operator.primary_email === 'work' ? operator.email_work
                                                                : operator.primary_email === 'personal' ? operator.email_personal
                                                                    : operator.primary_email === 'other' ? operator.email_other
                                                                        : ''
                                                        }</div>
                                                        {
                                                            (operator.id === (selectedOperator?.id || 0)) &&
                                                            <div className="operator-list-col tcol operator-selected">
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </div>
                                                        }
                                                        {
                                                            (operator.is_primary_admin === 1) &&
                                                            <div className="operator-list-col tcol pri">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="operator-search-box">
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="First Name" onChange={e => setOperatorSearch({ ...operatorSearch, first_name: e.target.value })} value={operatorSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, last_name: e.target.value })} value={operatorSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, address1: e.target.value })} value={operatorSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, address2: e.target.value })} value={operatorSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, city: e.target.value })} value={operatorSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, state: e.target.value })} value={operatorSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => { setShowingOperatorList(false) }} onChange={e => setOperatorSearch({ ...operatorSearch, phone: e.target.value })} value={operatorSearch.phone || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.keyCode || e.which;

                                                    if (key === 9) {
                                                        let elems = document.getElementsByTagName('input');

                                                        for (var i = elems.length; i--;) {
                                                            if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === '29') {
                                                                elems[i].focus();
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => { setShowingOperatorList(false) }}
                                                onChange={e => setOperatorSearch({ ...operatorSearch, email: e.target.value })}
                                                value={operatorSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        serverUrl: state.systemReducers.serverUrl,
        scale: state.systemReducers.scale,
        mainScreen: state.systemReducers.mainScreen,
        pages: state.adminReducers.pages,
        selectedPageIndex: state.adminReducers.selectedPageIndex,
        mainAdminScreenFocused: state.adminReducers.mainAdminScreenFocused,
        customerScreenFocused: state.adminReducers.customerScreenFocused,
        carrierScreenFocused: state.adminReducers.carrierScreenFocused,
        reportsScreenFocused: state.adminReducers.reportsScreenFocused,
        setupCompanyScreenFocused: state.adminReducers.setupCompanyScreenFocused,
        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedEmployee: state.companySetupReducers.selectedEmployee,
        selectedAgent: state.companySetupReducers.selectedAgent,
        selectedDriver: state.companySetupReducers.selectedDriver,
        selectedOperator: state.companySetupReducers.selectedOperator,
    }
}

export default connect(mapStateToProps, {
    setSelectedCompany,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedDriver,
    setSelectedOperator
})(CompanySetup)