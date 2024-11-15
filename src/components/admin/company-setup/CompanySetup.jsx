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
    OperatorSearch,
    Divisions,
    CompanyDrivers
} from './../panels';

import {
    setSelectedCompany,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedCompanyDriver as setSelectedDriver,
    setSelectedCompanyOperator as setSelectedOperator,
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
    setCompanyReportPanels
} from './../../../actions';

import { MainForm } from './../../company/forms';

function CompanySetup(props) {
    const refCompanyInputLogo = useRef();
    const refCompanyCode = useRef();
    const refMailingAddressCode = useRef();
    const refMailingAddressName = useRef();
    const refCompanyName = useRef();
    const refEmployeeFirstName = useRef();
    const refEmployeePhone = useRef();
    const refEmployeeEmail = useRef();
    const refAgentContactFirstName = useRef();
    const refAgentContactPhone = useRef();
    const refAgentContactEmail = useRef();
    const refDriverCode = useRef();
    const refDriverName = useRef();
    const refDriverEmail = useRef();
    const refOperatorCode = useRef();
    const refOperatorName = useRef();
    const refOperatorEmail = useRef();

    const [selectedCompany, setSelectedCompany] = useState({});
    const [selectedMailingAddress, setSelectedMailingAddress] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [showingEmployeeList, setShowingEmployeeList] = useState(true);
    const [employeeSearch, setEmployeeSearch] = useState({});
    const [selectedAgent, setSelectedAgent] = useState({});
    const [selectedAgentContact, setSelectedAgentContact] = useState({});
    const [showingAgentList, setShowingAgentList] = useState(true);
    const [agentSearch, setAgentSearch] = useState({});
    const [selectedDriver, setSelectedDriver] = useState({});
    const [showingDriverList, setShowingDriverList] = useState(true);
    const [driverSearch, setDriverSearch] = useState({});
    const [selectedOperator, setSelectedOperator] = useState({});
    const [selectedOperatorContact, setSelectedOperatorContact] = useState({});
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
    const refEmployeePhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowEmployeePhones(false)
        }
    });
    const refEmployeePhonePopupItems = useRef([]);

    const [employeeEmailItems, setEmployeeEmailItems] = useState([]);
    const [showEmployeeEmails, setShowEmployeeEmails] = useState(false);
    const refEmployeeEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowEmployeeEmails(false)
        }
    });
    const refEmployeeEmailPopupItems = useRef([]);

    const [agentContactPhoneItems, setAgentContactPhoneItems] = useState([]);
    const [showAgentContactPhones, setShowAgentContactPhones] = useState(false);
    const refAgentContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowAgentContactPhones(false)
        }
    });
    const refAgentContactPhonePopupItems = useRef([]);

    const [agentContactEmailItems, setAgentContactEmailItems] = useState([]);
    const [showAgentContactEmails, setShowAgentContactEmails] = useState(false);
    const refAgentContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowAgentContactEmails(false)
        }
    });
    const refAgentContactEmailPopupItems = useRef([]);

    const [driverPhoneItems, setDriverPhoneItems] = useState([]);
    const [showDriverPhones, setShowDriverPhones] = useState(false);
    const refDriverPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowDriverPhones(false)
        }
    });
    const refDriverPhonePopupItems = useRef([]);

    const [driverEmailItems, setDriverEmailItems] = useState([]);
    const [showDriverEmails, setShowDriverEmails] = useState(false);
    const refDriverEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowDriverEmails(false)
        }
    });
    const refDriverEmailPopupItems = useRef([]);

    const [operatorPhoneItems, setOperatorPhoneItems] = useState([]);
    const [showOperatorPhones, setShowOperatorPhones] = useState(false);
    const refOperatorPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowOperatorPhones(false)
        }
    });
    const refOperatorPhonePopupItems = useRef([]);

    const [operatorEmailItems, setOperatorEmailItems] = useState([]);
    const [showOperatorEmails, setShowOperatorEmails] = useState(false);
    const refOperatorEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowOperatorEmails(false)
        }
    });
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

    const agentPhonesTransition = useTransition(showAgentContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showAgentContactPhones
    });

    const agentEmailsTransition = useTransition(showAgentContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showAgentContactEmails
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

            let driver = {
                ...selectedDriver,
                mailing_address: null,
                contacts: [],
                license: null,
                tractor_info: null,
                trailer_info: null
            }

            if ((driver?.company_id || 0) === 0) {
                driver.company_id = selectedCompany.id;
            }

            if ((driver?.name || '') !== '') {

                let first_name = driver.name.split(' ')[0].trim();
                let last_name = driver.name.substring(first_name.length).trim();

                driver.first_name = first_name;
                driver.last_name = last_name;

                axios.post(props.serverUrl + `/saveDriver`, { ...driver, sub_origin: 'driver' }).then(res => {
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

                            setSelectedCompany(prev => {
                                return {
                                    ...prev,
                                    drivers: (res.data.drivers || []).filter(x => x.owner_type === 'company')
                                }
                            });
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

    useEffect(() => {
        if ((selectedAgent?.id || 0) > 0) {
            setSelectedAgentContact((selectedAgent?.contacts || []).find(c => c.is_primary === 1) || {});
        } else {
            setSelectedAgentContact({});
        }
    }, [selectedAgent])

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

    const validateAgentContactForSaving = (e) => {
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
                        closePanel(`${props.panelName}-employee-search`, props.origin);
                        refCompanyName.current.focus({preventScroll: true});
                    }).catch(e => {
                        closePanel(`${props.panelName}-employee-search`, props.origin);
                        refCompanyCode.current.focus({preventScroll: true});
                    })

                }}
            />
        }

        openPanel(panel, props.origin);
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
                        closePanel(`${props.panelName}-agent-search`, props.origin);
                        refCompanyName.current.focus({preventScroll: true});
                    }).catch(e => {
                        closePanel(`${props.panelName}-agent-search`, props.origin);
                        refCompanyCode.current.focus({preventScroll: true});
                    })

                }}
            />
        }

        openPanel(panel, props.origin);
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
                data: (driverSearch?.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (driverSearch?.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (driverSearch?.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (driverSearch?.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (driverSearch?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (driverSearch?.state || '').toLowerCase()
            },
            {
                field: 'Zip',
                data: driverSearch?.phone || ''
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


                componentId={moment().format('x')}
                driverSearch={{ search: filters }}

                callback={(driver) => {
                    new Promise((resolve, reject) => {
                        if (driver) {
                            // setSelectedCompany(driver?.company || {});
                            setSelectedDriver(driver);
                            setShowingDriverList(true);
                            setDriverSearch({});
                            resolve('OK');
                        } else {
                            reject('no driver');
                        }
                    }).then(response => {
                        closePanel(`${props.panelName}-driver-search`, props.origin);
                        refCompanyName.current.focus({preventScroll: true});
                    }).catch(e => {
                        closePanel(`${props.panelName}-driver-search`, props.origin);
                        refCompanyCode.current.focus({preventScroll: true});
                    })

                }}
            />
        }

        openPanel(panel, props.origin);
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
                data: (operatorSearch?.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (operatorSearch?.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (operatorSearch?.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (operatorSearch?.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (operatorSearch?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (operatorSearch?.state || '').toLowerCase()
            },
            {
                field: 'Zip',
                data: operatorSearch?.Zip || ''
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


                componentId={moment().format('x')}
                operatorSearch={{ search: filters }}

                callback={(operator) => {
                    new Promise((resolve, reject) => {
                        if (operator) {
                            // setSelectedCompany(operator.company);
                            setSelectedOperator(operator);
                            setShowingOperatorList(true);
                            setOperatorSearch({});
                            resolve('OK');
                        } else {
                            reject('no operator');
                        }
                    }).then(response => {
                        closePanel(`${props.panelName}-operator-search`, props.origin);
                        refCompanyName.current.focus({preventScroll: true});
                    }).catch(e => {
                        closePanel(`${props.panelName}-operator-search`, props.origin);
                        refCompanyCode.current.focus({preventScroll: true});
                    })

                }}
            />
        }

        openPanel(panel, props.origin);
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

    const searchDriverInfoByCode = () => {
        if ((selectedDriver?.code || '') !== '') {
            axios.post(props.serverUrl + `/getDriverByCode`, {
                code: selectedDriver.code
            }).then(res => {
                if (res.data.result === 'OK') {

                    setSelectedDriver({ ...res.data.driver });

                    refDriverName.current.focus({preventScroll: true});
                }
            }).catch(e => {
                console.log('error getting driver by code', e);
            })
        }
    };

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
        <div className="company-setup-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? "transparent" : "rgb(250, 250, 250)",
            background: props.isOnPanel ? "transparent" : "-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            background: props.isOnPanel ? "transparent" : "-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            background: props.isOnPanel ? "transparent" : "radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative'
        }}>

            <div className="company-left-container">
                <div className="company-logo-container">


                    <form encType='multipart/form-data' style={{ display: 'none' }}>
                        <input type="file" ref={refCompanyInputLogo} accept='image/*' onChange={uploadCompanyLogo} />
                    </form>

                    <div className="company-logo-wrapper">
                        <img
                            src={((selectedCompany?.id || 0) > 0 && (selectedCompany?.logo || '') !== '') ? props.serverUrl + '/company-logo/' + selectedCompany.logo : 'img/company-logo-default.png'}
                            alt="" />
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
                    <div className="mochi-button" onClick={() => {
                        refCompanyInputLogo.current.click()
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Upload Logo</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>

                <div className="company-extra-info">
                    <div className="input-box-container">
                        <input tabIndex={59 + props.tabTimes} type="text" placeholder="EIN" id="txt-company-ein"
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
                        <input tabIndex={60 + props.tabTimes} type="text" placeholder="MC Number"
                            id="txt-company-mc-number"
                            onInput={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    mc_number: e.target.value
                                })
                            }}
                            onChange={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    mc_number: e.target.value
                                })
                            }}
                            value={selectedCompany?.mc_number || ''} />
                    </div>
                    <div className="input-box-container">
                        <input tabIndex={61 + props.tabTimes} type="text" placeholder="DOT Number"
                            id="txt-company-dot-number"
                            onKeyDown={e => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                    e.preventDefault();
                                    validateCompanyForSaving(e);
                                    refCompanyCode.current.focus({preventScroll: true});
                                }

                            }}
                            onInput={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    dot_number: e.target.value
                                })
                            }}
                            onChange={e => {
                                setSelectedCompany({
                                    ...selectedCompany,
                                    dot_number: e.target.value
                                })
                            }}
                            value={selectedCompany?.dot_number || ''} />
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
                                <div className="mochi-button" onClick={() => {
                                    if (selectedCompany?.id === undefined) {
                                        window.alert('You must select a company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-divisions`,
                                        component: <Divisions
                                            title='Divisions'
                                            tabTimes={832000 + props.tabTimes}
                                            panelName={`${props.panelName}-divisions`}
                                            origin={props.origin}
                                            owner='company'
                                            isEditingDriver={true}
                                            componentId={moment().format('x')}
                                            selectedCompany={selectedCompany}
                                            isAdmin={props.isAdmin}
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Divisions</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>

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
                                            refCompanyName.current.focus({preventScroll: true});
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
                                <input tabIndex={1 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    id="txt-company-code"
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                <input tabIndex={6 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    style={{ textTransform: 'uppercase' }}
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
                                            refMailingAddressName.current.focus({preventScroll: true});
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
                                <input tabIndex={11 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    id="txt-mailing-address-code"
                                    ref={refMailingAddressCode}
                                    readOnly={true}
                                    onInput={e => {
                                    }}
                                    onChange={e => {
                                    }}
                                    value={(selectedCompany?.mailing_address?.code || '') + ((selectedCompany?.mailing_address?.code_number || 0) === 0 ? '' : selectedCompany?.mailing_address?.code_number)} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={12 + props.tabTimes} type="text" placeholder="Name"
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                <input tabIndex={16 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    style={{ textTransform: 'uppercase' }}
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


                                            componentId={moment().format('x')}

                                            employeeSearchCompany={{
                                                ...selectedCompany,
                                                selectedEmployee: selectedEmployee
                                            }}
                                        />
                                    }

                                    openPanel(panel, props.origin);
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


                                            componentId={moment().format('x')}

                                            employeeSearchCompany={{
                                                ...selectedCompany,
                                                selectedEmployee: { id: 0, company_id: selectedCompany?.id }
                                            }}
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Employee</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedEmployee({});
                                    refEmployeeFirstName.current.focus({preventScroll: true});
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
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
                                                case 37:
                                                case 38: // arrow left | arrow up
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

                                                case 39:
                                                case 40: // arrow right | arrow down
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
                                                        refEmployeePhone.current.inputElement.focus({preventScroll: true});
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
                                                        refEmployeePhone.current.inputElement.focus({preventScroll: true});
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
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                            onClick={async () => {
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

                                                refEmployeePhone.current.inputElement.focus({preventScroll: true});
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
                                            <div className="mochi-contextual-popup vertical below right"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
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
                                                                            refEmployeePhone.current.inputElement.focus({preventScroll: true});
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
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
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
                                    <input type="checkbox"
                                        id={props.panelName + '-cbox-company-employee-primary-admin-btn'}
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
                                                case 37:
                                                case 38: // arrow left | arrow up
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

                                                case 39:
                                                case 40: // arrow right | arrow down
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
                                                        refEmployeeEmail.current.focus({preventScroll: true});
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
                                                        refEmployeeEmail.current.focus({preventScroll: true});
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
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                            onClick={async () => {
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

                                                refEmployeeEmail.current.focus({preventScroll: true});
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
                                            <div className="mochi-contextual-popup vertical below right"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
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
                                                                            refEmployeeEmail.current.focus({preventScroll: true});
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
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
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
                                                    <div className="employee-list-item" key={index}
                                                        onDoubleClick={async () => {
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


                                                                    componentId={moment().format('x')}

                                                                    employeeSearchCompany={{
                                                                        ...selectedCompany,
                                                                        selectedEmployee: employee
                                                                    }}
                                                                />
                                                            }

                                                            openPanel(panel, props.origin);
                                                        }} onClick={() => setSelectedEmployee(employee)}>
                                                        <div
                                                            className="employee-list-col tcol first-name">{employee.first_name}</div>
                                                        <div
                                                            className="employee-list-col tcol last-name">{employee.last_name}</div>
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
                                            <input type="text" placeholder="First Name"
                                                onChange={e => setEmployeeSearch({
                                                    ...employeeSearch,
                                                    first_name: e.target.value
                                                })} value={employeeSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => {
                                                setShowingEmployeeList(false)
                                            }} onChange={e => setEmployeeSearch({
                                                ...employeeSearch,
                                                last_name: e.target.value
                                            })} value={employeeSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => {
                                                setShowingEmployeeList(false)
                                            }} onChange={e => setEmployeeSearch({
                                                ...employeeSearch,
                                                address1: e.target.value
                                            })} value={employeeSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => {
                                                setShowingEmployeeList(false)
                                            }} onChange={e => setEmployeeSearch({
                                                ...employeeSearch,
                                                address2: e.target.value
                                            })} value={employeeSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => {
                                                setShowingEmployeeList(false)
                                            }} onChange={e => setEmployeeSearch({
                                                ...employeeSearch,
                                                city: e.target.value
                                            })} value={employeeSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                setShowingEmployeeList(false)
                                            }} onChange={e => setEmployeeSearch({
                                                ...employeeSearch,
                                                state: e.target.value
                                            })} value={employeeSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => {
                                                    setShowingEmployeeList(false)
                                                }} onChange={e => setEmployeeSearch({
                                                    ...employeeSearch,
                                                    phone: e.target.value
                                                })} value={employeeSearch.phone || ''} />
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
                                                                elems[i].focus({preventScroll: true});
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => {
                                                    setShowingEmployeeList(false)
                                                }}
                                                onChange={e => setEmployeeSearch({
                                                    ...employeeSearch,
                                                    email: e.target.value
                                                })}
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
                                            tabTimes={222200 + props.tabTimes}
                                            panelName={`${props.panelName}-agents`}
                                            origin={props.origin}


                                            componentId={moment().format('x')}
                                            isAdmin={props.isAdmin}
                                            setSelectedCompany={setSelectedCompany}
                                            selectedCompany={selectedCompany}
                                            selectedAgent={selectedAgent}
                                        />
                                    }

                                    openPanel(panel, props.origin);
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
                                            tabTimes={222200 + props.tabTimes}
                                            panelName={`${props.panelName}-agents`}
                                            origin={props.origin}


                                            isAdmin={props.isAdmin}
                                            componentId={moment().format('x')}
                                            selectedCompany={selectedCompany}
                                            setSelectedCompany={setSelectedCompany}
                                        />
                                    }

                                    openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Agent</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setSelectedAgent({});
                                    refAgentContactFirstName.current.focus({preventScroll: true});
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
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
                                    readOnly={true}
                                    ref={refAgentContactFirstName}
                                    onInput={e => {
                                        setSelectedAgentContact(selectedAgentContact => {
                                            return {
                                                ...selectedAgentContact,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedAgentContact(selectedAgentContact => {
                                            return {
                                                ...selectedAgentContact,
                                                first_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedAgentContact?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={28 + props.tabTimes} type="text" placeholder="Last Name"
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
                                    readOnly={true}
                                    onInput={e => {
                                        setSelectedAgentContact(selectedAgentContact => {
                                            return {
                                                ...selectedAgentContact,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    onChange={e => {
                                        setSelectedAgentContact(selectedAgentContact => {
                                            return {
                                                ...selectedAgentContact,
                                                last_name: e.target.value
                                            }
                                        });
                                    }}
                                    value={selectedAgentContact?.last_name || ''} />
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
                                        ref={refAgentContactPhone}
                                        readOnly={true}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showAgentContactPhones) {
                                                        let selectedIndex = agentContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (agentContactPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                        if (agentContactPhoneItems.length > 1) {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgentContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowAgentContactPhones(true);

                                                            refAgentContactPhonePopupItems.current.map((r, i) => {
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

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showAgentContactPhones) {
                                                        let selectedIndex = agentContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (agentContactPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                        if (agentContactPhoneItems.length > 1) {
                                                            await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgentContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowAgentContactPhones(true);

                                                            refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                    setShowAgentContactPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showAgentContactPhones && agentContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                primary_phone: agentContactPhoneItems[agentContactPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                        setShowAgentContactPhones(false);
                                                        refAgentContactPhone.current.inputElement.focus({preventScroll: true});
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showAgentContactPhones) {
                                                        e.preventDefault();
                                                        await setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                primary_phone: agentContactPhoneItems[agentContactPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                        setShowAgentContactPhones(false);
                                                        refAgentContactPhone.current.inputElement.focus({preventScroll: true});
                                                    } else {
                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedAgentContact?.id || 0) === 0) {
                                                setSelectedAgentContact(selectedAgentContact => {
                                                    return {
                                                        ...selectedAgentContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedAgentContact?.primary_phone || '') === '') {
                                                    setSelectedAgentContact(selectedAgentContact => {
                                                        return {
                                                            ...selectedAgentContact,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedAgentContact?.primary_phone) {
                                                        case 'work':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedAgentContact?.id || 0) === 0) {
                                                setSelectedAgentContact(selectedAgentContact => {
                                                    return {
                                                        ...selectedAgentContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    }
                                                });
                                            } else {
                                                if ((selectedAgentContact?.primary_phone || '') === '') {
                                                    setSelectedAgentContact(selectedAgentContact => {
                                                        return {
                                                            ...selectedAgentContact,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        }
                                                    });
                                                } else {
                                                    switch (selectedAgentContact?.primary_phone) {
                                                        case 'work':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_work: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_work_fax: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_mobile: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_direct: e.target.value
                                                                }
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedAgentContact(selectedAgentContact => {
                                                                return {
                                                                    ...selectedAgentContact,
                                                                    phone_other: e.target.value
                                                                }
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedAgentContact?.primary_phone || '') === 'work'
                                                ? (selectedAgentContact?.phone_work || '')
                                                : (selectedAgentContact?.primary_phone || '') === 'fax'
                                                    ? (selectedAgentContact?.phone_work_fax || '')
                                                    : (selectedAgentContact?.primary_phone || '') === 'mobile'
                                                        ? (selectedAgentContact?.phone_mobile || '')
                                                        : (selectedAgentContact?.primary_phone || '') === 'direct'
                                                            ? (selectedAgentContact?.phone_direct || '')
                                                            : (selectedAgentContact?.primary_phone || '') === 'other'
                                                                ? (selectedAgentContact?.phone_other || '')
                                                                : ''
                                        } />
                                    {
                                        (selectedAgentContact?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-agent-primary-phone': true,
                                                'pushed': (agentContactPhoneItems.length > 1)
                                            })}>
                                            {selectedAgentContact?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        agentContactPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                            onClick={async () => {
                                                if (showAgentContactPhones) {
                                                    setShowAgentContactPhones(false);
                                                } else {
                                                    if (agentContactPhoneItems.length > 1) {
                                                        await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                            item.selected = item.type === (selectedAgentContact?.primary_phone || '')
                                                            return item;
                                                        }))

                                                        window.setTimeout(async () => {
                                                            await setShowAgentContactPhones(true);

                                                            refAgentContactPhonePopupItems.current.map((r, i) => {
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

                                                refAgentContactPhone.current.inputElement.focus({preventScroll: true});
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
                                            ref={refAgentContactPhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            agentContactPhoneItems.map((item, index) => {
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
                                                                            await setSelectedAgentContact(selectedAgentContact => {
                                                                                return {
                                                                                    ...selectedAgentContact,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateAgentContactForSaving({ keyCode: 9 });
                                                                            setShowAgentContactPhones(false);
                                                                            refAgentContactPhone.current.inputElement.focus({preventScroll: true});
                                                                        }}
                                                                        ref={ref => refAgentContactPhonePopupItems.current.push(ref)}
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
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
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
                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={30 + props.tabTimes} type="text" placeholder="Ext"
                                        onInput={e => {
                                            setSelectedAgentContact(selectedAgentContact => {
                                                return {
                                                    ...selectedAgentContact,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedAgentContact(selectedAgentContact => {
                                                return {
                                                    ...selectedAgentContact,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedAgentContact?.phone_ext || ''} />
                                </div>
                                <div className="form-h-sep"></div>

                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + '-cbox-agent-contacts-primary-btn'}
                                        style={{ pointerEvents: 'none' }}
                                        onChange={(e) => {
                                            setSelectedAgentContact({
                                                ...selectedAgentContact,
                                                is_primary: e.target.checked ? 1 : 0
                                            });
                                            validateAgentContactForSaving({ keyCode: 9 });
                                        }}
                                        checked={(selectedAgentContact.is_primary || 0) === 1} />
                                    <label htmlFor={props.panelName + '-cbox-agent-contacts-primary-btn'}
                                        style={{ pointerEvents: 'none' }}>
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
                                        tabIndex={32 + props.tabTimes}
                                        type="text"
                                        placeholder="E-Mail"
                                        ref={refAgentContactEmail}
                                        readOnly={true}
                                        onKeyDown={async e => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37:
                                                case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showAgentContactEmails) {
                                                        let selectedIndex = agentContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (agentContactEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (agentContactEmailItems.length > 1) {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgentContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowAgentContactEmails(true);

                                                            refAgentContactEmailPopupItems.current.map((r, i) => {
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

                                                case 39:
                                                case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showAgentContactEmails) {
                                                        let selectedIndex = agentContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === (agentContactEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (agentContactEmailItems.length > 1) {
                                                            await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedAgentContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowAgentContactEmails(true);

                                                            refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                    setShowAgentContactEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showAgentContactEmails && agentContactEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                primary_email: agentContactEmailItems[agentContactEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                        setShowAgentContactEmails(false);
                                                        refAgentContactEmail.current.focus({preventScroll: true});
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showAgentContactEmails) {
                                                        e.preventDefault();
                                                        await setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                primary_email: agentContactEmailItems[agentContactEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                        setShowAgentContactEmails(false);
                                                        refAgentContactEmail.current.focus({preventScroll: true});
                                                    } else {
                                                        validateAgentContactForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            if ((selectedAgentContact?.primary_email || '') === '') {
                                                setSelectedAgentContact(selectedAgentContact => {
                                                    return {
                                                        ...selectedAgentContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedAgentContact?.primary_email) {
                                                    case 'work':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        onChange={e => {
                                            if ((selectedAgentContact?.primary_email || '') === '') {
                                                setSelectedAgentContact(selectedAgentContact => {
                                                    return {
                                                        ...selectedAgentContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    }
                                                });
                                            } else {
                                                switch (selectedAgentContact?.primary_email) {
                                                    case 'work':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_work: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'personal':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_personal: e.target.value
                                                            }
                                                        });
                                                        break;
                                                    case 'other':
                                                        setSelectedAgentContact(selectedAgentContact => {
                                                            return {
                                                                ...selectedAgentContact,
                                                                email_other: e.target.value
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedAgentContact?.primary_email || '') === 'work'
                                                ? (selectedAgentContact?.email_work || '')
                                                : (selectedAgentContact?.primary_email || '') === 'personal'
                                                    ? (selectedAgentContact?.email_personal || '')
                                                    : (selectedAgentContact?.primary_email || '') === 'other'
                                                        ? (selectedAgentContact?.email_other || '')
                                                        : ''
                                        } />

                                    {
                                        (selectedAgentContact?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-company-agent-primary-email': true,
                                                'pushed': (agentContactEmailItems.length > 1)
                                            })}>
                                            {selectedAgentContact?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        agentContactEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                            onClick={async () => {
                                                if (showAgentContactEmails) {
                                                    setShowAgentContactEmails(false);
                                                } else {
                                                    if (agentContactEmailItems.length > 1) {
                                                        await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                            item.selected = item.type === (selectedAgentContact?.primary_email || '')
                                                            return item;
                                                        }))

                                                        window.setTimeout(async () => {
                                                            await setShowAgentContactEmails(true);

                                                            refAgentContactEmailPopupItems.current.map((r, i) => {
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

                                                refAgentContactEmail.current.focus({preventScroll: true});
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
                                            ref={refAgentContactEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right"
                                                style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            agentContactEmailItems.map((item, index) => {
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
                                                                            await setSelectedAgentContact(selectedAgentContact => {
                                                                                return {
                                                                                    ...selectedAgentContact,
                                                                                    primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateAgentContactForSaving({ keyCode: 9 });
                                                                            setShowAgentContactEmails(false);
                                                                            refAgentContactEmail.current.focus({preventScroll: true});
                                                                        }}
                                                                        ref={ref => refAgentContactEmailPopupItems.current.push(ref)}
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
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
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
                            <div className="input-box-container grow">
                                <input tabIndex={31 + props.tabTimes} type="text" placeholder="Agent Code"
                                    readOnly={true}
                                    onInput={e => {
                                    }}
                                    onChange={e => {
                                    }}
                                    value={selectedAgent?.code || ''} />
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
                                            <div className="agent-list-col tcol first-name">Code</div>
                                            <div className="agent-list-col tcol last-name">Name</div>
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
                                                    <div className="agent-list-item" key={index}
                                                        onDoubleClick={async () => {
                                                            let panel = {
                                                                panelName: `${props.panelName}-agents`,
                                                                component: <Agents
                                                                    title='Agent'
                                                                    tabTimes={222200 + props.tabTimes}
                                                                    panelName={`${props.panelName}-agents`}
                                                                    origin={props.origin}


                                                                    componentId={moment().format('x')}
                                                                    isAdmin={props.isAdmin}
                                                                    setSelectedCompany={setSelectedCompany}
                                                                    selectedCompany={selectedCompany}
                                                                    selectedAgent={agent}
                                                                />
                                                            }

                                                            openPanel(panel, props.origin);
                                                        }} onClick={() => setSelectedAgent(agent)}>
                                                        <div
                                                            className="agent-list-col tcol first-name">{agent?.code || ''}</div>
                                                        <div
                                                            className="agent-list-col tcol last-name">{agent?.name}</div>
                                                        <div className="agent-list-col tcol phone-work">{
                                                            (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_phone || '') === 'work'
                                                                ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.phone_work || '')
                                                                : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_phone || '') === 'fax'
                                                                    ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.phone_work_fax || '')
                                                                    : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_phone || '') === 'mobile'
                                                                        ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.phone_mobile || '')
                                                                        : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_phone || '') === 'direct'
                                                                            ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.phone_direct || '')
                                                                            : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_phone || '') === 'other'
                                                                                ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.phone_other || '')
                                                                                : ''
                                                        }</div>
                                                        <div className="agent-list-col tcol email-work">{
                                                            (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_email || '') === 'work'
                                                                ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.email_work || '')
                                                                : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_email || '') === 'personal'
                                                                    ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.email_personal || '')
                                                                    : (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.primary_email || '') === 'other'
                                                                        ? (((agent?.contacts || []).find(c => c.is_primary === 1) || {})?.email_other || '')
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
                                            <input type="text" placeholder="First Name" onChange={e => setAgentSearch({
                                                ...agentSearch,
                                                first_name: e.target.value
                                            })} value={agentSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => {
                                                setShowingAgentList(false)
                                            }} onChange={e => setAgentSearch({
                                                ...agentSearch,
                                                last_name: e.target.value
                                            })} value={agentSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => {
                                                setShowingAgentList(false)
                                            }} onChange={e => setAgentSearch({
                                                ...agentSearch,
                                                address1: e.target.value
                                            })} value={agentSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => {
                                                setShowingAgentList(false)
                                            }} onChange={e => setAgentSearch({
                                                ...agentSearch,
                                                address2: e.target.value
                                            })} value={agentSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => {
                                                setShowingAgentList(false)
                                            }} onChange={e => setAgentSearch({ ...agentSearch, city: e.target.value })}
                                                value={agentSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                setShowingAgentList(false)
                                            }} onChange={e => setAgentSearch({ ...agentSearch, state: e.target.value })}
                                                value={agentSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => {
                                                    setShowingAgentList(false)
                                                }} onChange={e => setAgentSearch({ ...agentSearch, phone: e.target.value })}
                                                value={agentSearch.phone || ''} />
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
                                                                elems[i].focus({preventScroll: true});
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFocus={() => {
                                                    setShowingAgentList(false)
                                                }}
                                                onChange={e => setAgentSearch({
                                                    ...agentSearch,
                                                    email: e.target.value
                                                })}
                                                value={agentSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {
                    !(process.env.NODE_ENV === 'production' && process.env.REACT_APP_PRO_SERVER_URL === 'https://server.anchortms.com/api') &&
                    <div className="company-info-drivers">

                        <MainForm
                            formTitle={`Company Drivers`}
                            formButtons={[
                                {
                                    title: "More",
                                    onClick: () => {
                                        if ((selectedCompany?.id || 0) === 0) {
                                            window.alert('You must select a company first!');
                                            return;
                                        }

                                        if ((selectedDriver?.id || 0) === 0) {
                                            window.alert('You must select a driver first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-company-drivers`,
                                            component: <CompanyDrivers
                                                title='Company Driver'
                                                tabTimes={322000 + props.tabTimes}
                                                panelName={`${props.panelName}-company-drivers`}
                                                savingDriverUrl='/saveDriver'
                                                deletingDriverUrl='/deleteDriver'
                                                uploadAvatarUrl='/uploadDriverAvatar'
                                                removeAvatarUrl='/removeDriverAvatar'
                                                origin={props.origin}
                                                subOrigin='driver'
                                                owner='company'
                                                isEditingDriver={true}


                                                componentId={moment().format('x')}
                                                selectedDriverId={selectedDriver.id}
                                                selectedParent={selectedCompany}

                                                driverSearchCompany={{
                                                    ...selectedCompany,
                                                    selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                }}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    },
                                    isEnabled: true,
                                },
                                {
                                    title: "Add Driver",
                                    onClick: () => {
                                        if ((selectedCompany?.id || 0) === 0) {
                                            window.alert('You must select a company first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-company-drivers`,
                                            component: <CompanyDrivers
                                                title='Company Driver'
                                                tabTimes={322000 + props.tabTimes}
                                                panelName={`${props.panelName}-company-drivers`}
                                                savingDriverUrl='/saveDriver'
                                                deletingDriverUrl='/deleteDriver'
                                                uploadAvatarUrl='/uploadDriverAvatar'
                                                removeAvatarUrl='/removeDriverAvatar'
                                                origin={props.origin}
                                                subOrigin='driver'
                                                owner='company'
                                                isEditingDriver={true}


                                                componentId={moment().format('x')}
                                                selectedParent={selectedCompany}

                                                driverSearchCompany={{
                                                    ...selectedCompany,
                                                    selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                }}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    },
                                    isEnabled: true,
                                },
                                {
                                    title: "Delete",
                                    onClick: () => {
                                        if (window.confirm("Are you sure you want to proceed?")) {

                                            axios.post(props.serverUrl + '/deleteDriver', {
                                                id: selectedDriver.id,
                                                sub_origin: 'driver'
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setSelectedCompany(prev => {
                                                        return {
                                                            ...prev,
                                                            drivers: (res.data.drivers || []).filter(x => x.owner_type === 'company')
                                                        }
                                                    });

                                                    setSelectedDriver({});
                                                    refDriverCode.current.focus({preventScroll: true});
                                                }
                                            }).catch(e => {
                                                console.log('error deleting driver');
                                            });
                                        }
                                    },
                                    isEnabled: (selectedDriver?.id || 0) > 0,
                                },
                                {
                                    title: "Clear",
                                    onClick: () => {
                                        setSelectedDriver({});
                                        refDriverCode.current.focus({preventScroll: true});
                                    },
                                    isEnabled: true,
                                },
                            ]}
                            refs={{
                                refCode: refDriverCode,
                                refName: refDriverName,
                                refEmail: refDriverEmail,
                            }}
                            tabTimesFrom={34}
                            tabTimes={props.tabTimes}
                            searchByCode={searchDriverInfoByCode}
                            validateForSaving={validateDriverForSaving}
                            selectedParent={selectedDriver}
                            setSelectedParent={setSelectedDriver}
                            fields={[
                                'code',
                                'name',
                                'contact',
                                'phone',
                                'ext',
                                'email'
                            ]}
                            triggerFields={['email']}
                        />

                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="top-border top-border-middle"></div>
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
                                                        <div className="driver-list-item" key={index}
                                                            onDoubleClick={async () => {
                                                                let panel = {
                                                                    panelName: `${props.panelName}-company-drivers`,
                                                                    component: <CompanyDrivers
                                                                        title='Company Driver'
                                                                        tabTimes={322000 + props.tabTimes}
                                                                        panelName={`${props.panelName}-company-drivers`}
                                                                        savingDriverUrl='/saveDriver'
                                                                        deletingDriverUrl='/deleteDriver'
                                                                        uploadAvatarUrl='/uploadDriverAvatar'
                                                                        removeAvatarUrl='/removeDriverAvatar'
                                                                        origin={props.origin}
                                                                        subOrigin='driver'
                                                                        owner='company'
                                                                        isEditingDriver={true}


                                                                        componentId={moment().format('x')}
                                                                        selectedDriverId={driver.id}
                                                                        selectedParent={selectedCompany}

                                                                        driverSearchCompany={{
                                                                            ...selectedCompany,
                                                                            selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                                        }}
                                                                    />
                                                                }

                                                                openPanel(panel, props.origin);
                                                            }}
                                                            onClick={() => setSelectedDriver(driver)}
                                                        >
                                                            <div className="driver-list-col tcol first-name">{driver?.first_name || ''}</div>
                                                            <div className="driver-list-col tcol last-name">{driver?.last_name || ''}</div>
                                                            <div className="driver-list-col tcol phone-work">{
                                                                ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'work'
                                                                    ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_work || ''
                                                                    : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'fax'
                                                                        ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_work_fax || ''
                                                                        : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'mobile'
                                                                            ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_mobile || ''
                                                                            : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'direct'
                                                                                ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_direct || ''
                                                                                : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'other'
                                                                                    ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_other || ''
                                                                                    : (driver?.contact_phone || '')
                                                            }</div>
                                                            <div className="driver-list-col tcol email-work">{
                                                                ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'work'
                                                                    ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_work || ''
                                                                    : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'personal'
                                                                        ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_personal || ''
                                                                        : ((driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'other'
                                                                            ? (driver.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_other || ''
                                                                            : (driver?.email || '')
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
                                                <input type="text" placeholder="First Name" onChange={e => setDriverSearch({
                                                    ...driverSearch,
                                                    first_name: e.target.value
                                                })} value={driverSearch.first_name || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Last Name" onFocus={() => {
                                                    setShowingDriverList(false)
                                                }} onChange={e => setDriverSearch({
                                                    ...driverSearch,
                                                    last_name: e.target.value
                                                })} value={driverSearch.last_name || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 1" onFocus={() => {
                                                    setShowingDriverList(false)
                                                }} onChange={e => setDriverSearch({
                                                    ...driverSearch,
                                                    address1: e.target.value
                                                })} value={driverSearch.address1 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 2" onFocus={() => {
                                                    setShowingDriverList(false)
                                                }} onChange={e => setDriverSearch({
                                                    ...driverSearch,
                                                    address2: e.target.value
                                                })} value={driverSearch.address2 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="City" onFocus={() => {
                                                    setShowingDriverList(false)
                                                }} onChange={e => setDriverSearch({ ...driverSearch, city: e.target.value })}
                                                    value={driverSearch.city || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container input-state">
                                                <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                    setShowingDriverList(false)
                                                }} onChange={e => setDriverSearch({ ...driverSearch, state: e.target.value })}
                                                    value={driverSearch.state || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <MaskedInput
                                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={true}
                                                    type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => {
                                                        setShowingDriverList(false)
                                                    }} onChange={e => setDriverSearch({ ...driverSearch, phone: e.target.value })}
                                                    value={driverSearch.phone || ''} />
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
                                                                    elems[i].focus({preventScroll: true});
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        setShowingDriverList(false)
                                                    }}
                                                    onChange={e => setDriverSearch({
                                                        ...driverSearch,
                                                        email: e.target.value
                                                    })}
                                                    value={driverSearch.email || ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }

                {
                    !(process.env.NODE_ENV === 'production' && process.env.REACT_APP_PRO_SERVER_URL === 'https://server.anchortms.com/api') &&
                    <div className="company-info-owner-operators">

                        <MainForm
                            formTitle={`Owner Operators`}
                            formButtons={[
                                {
                                    title: "More",
                                    onClick: () => {
                                        if ((selectedCompany?.id || 0) === 0) {
                                            window.alert('You must select a company first!');
                                            return;
                                        }

                                        if ((selectedOperator?.id || 0) === 0) {
                                            window.alert('You must select a operator first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-company-operators`,
                                            component: <CompanyDrivers
                                                title='Owner Operator'
                                                tabTimes={322000 + props.tabTimes}
                                                panelName={`${props.panelName}-company-operators`}
                                                savingDriverUrl='/saveDriver'
                                                deletingDriverUrl='/deleteDriver'
                                                uploadAvatarUrl='/uploadDriverAvatar'
                                                removeAvatarUrl='/removeDriverAvatar'
                                                origin={props.origin}
                                                subOrigin='operator'
                                                owner='company'
                                                isEditingDriver={true}


                                                componentId={moment().format('x')}
                                                selectedDriverId={selectedOperator.id}
                                                selectedParent={selectedCompany}

                                                driverSearchCompany={{
                                                    ...selectedCompany,
                                                    selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                }}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    },
                                    isEnabled: true,
                                },
                                {
                                    title: "Add Operator",
                                    onClick: () => {
                                        if ((selectedCompany?.id || 0) === 0) {
                                            window.alert('You must select a company first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-company-operators`,
                                            component: <CompanyDrivers
                                                title='Owner Operator'
                                                tabTimes={322000 + props.tabTimes}
                                                panelName={`${props.panelName}-company-operators`}
                                                savingDriverUrl='/saveDriver'
                                                deletingDriverUrl='/deleteDriver'
                                                uploadAvatarUrl='/uploadDriverAvatar'
                                                removeAvatarUrl='/removeDriverAvatar'
                                                origin={props.origin}
                                                subOrigin='operator'
                                                owner='company'
                                                isEditingDriver={true}


                                                componentId={moment().format('x')}
                                                selectedParent={selectedCompany}

                                                driverSearchCompany={{
                                                    ...selectedCompany,
                                                    selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                }}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    },
                                    isEnabled: true,
                                },
                                {
                                    title: "Delete",
                                    onClick: () => {
                                        if (window.confirm("Are you sure you want to proceed?")) {

                                            axios.post(props.serverUrl + '/deleteDriver', {
                                                id: selectedOperator.id,
                                                sub_origin: 'operator'
                                            }).then(res => {
                                                if (res.data.result === 'OK') {
                                                    setSelectedCompany(prev => {
                                                        return {
                                                            ...prev,
                                                            operators: (res.data.drivers || []).filter(x => x.owner_type === 'operator')
                                                        }
                                                    });

                                                    setSelectedOperator({});
                                                    refOperatorCode.current.focus({preventScroll: true});
                                                }
                                            }).catch(e => {
                                                console.log('error deleting operator');
                                            });
                                        }
                                    },
                                    isEnabled: (selectedOperator?.id || 0) > 0,
                                },
                                {
                                    title: "Clear",
                                    onClick: () => {
                                        setSelectedOperator({});
                                        refOperatorCode.current.focus({preventScroll: true});
                                    },
                                    isEnabled: true,
                                },
                            ]}
                            refs={{
                                refCode: refOperatorCode,
                                refName: refOperatorName,
                                refEmail: refOperatorEmail,
                            }}
                            tabTimesFrom={46}
                            tabTimes={props.tabTimes}
                            searchByCode={searchDriverInfoByCode}
                            validateForSaving={validateDriverForSaving}
                            selectedParent={selectedOperator}
                            setSelectedParent={setSelectedOperator}
                            fields={[
                                'code',
                                'name',
                                'contact',
                                'phone',
                                'ext',
                                'email'
                            ]}
                            triggerFields={['email']}
                        />

                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="top-border top-border-middle"></div>
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
                                                        <div className="operator-list-item" key={index}
                                                            onDoubleClick={async () => {
                                                                let panel = {
                                                                    panelName: `${props.panelName}-company-operators`,
                                                                    component: <CompanyDrivers
                                                                        title='Owner Operator'
                                                                        tabTimes={322000 + props.tabTimes}
                                                                        panelName={`${props.panelName}-company-operators`}
                                                                        savingDriverUrl='/saveOperator'
                                                                        deletingDriverUrl='/deleteOperator'
                                                                        uploadAvatarUrl='/uploadOperatorAvatar'
                                                                        removeAvatarUrl='/removeOperatorAvatar'
                                                                        origin={props.origin}
                                                                        subOrigin='operator'
                                                                        owner='company'
                                                                        isEditingDriver={true}


                                                                        componentId={moment().format('x')}
                                                                        selectedDriverId={operator.id}
                                                                        selectedParent={selectedCompany}

                                                                        driverSearchCompany={{
                                                                            ...selectedCompany,
                                                                            selectedDriver: { id: 0, company_id: selectedCompany?.id }
                                                                        }}
                                                                    />
                                                                }

                                                                openPanel(panel, props.origin);
                                                            }} onClick={() => setSelectedOperator(operator)}>
                                                            <div
                                                                className="operator-list-col tcol first-name">{operator.first_name}</div>
                                                            <div
                                                                className="operator-list-col tcol last-name">{operator.last_name}</div>
                                                            <div className="operator-list-col tcol phone-work">{
                                                                ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'work'
                                                                    ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_work || ''
                                                                    : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'fax'
                                                                        ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_work_fax || ''
                                                                        : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'mobile'
                                                                            ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_mobile || ''
                                                                            : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'direct'
                                                                                ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_direct || ''
                                                                                : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_phone || '') === 'other'
                                                                                    ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.phone_other || ''
                                                                                    : (operator?.contact_phone || '')
                                                            }</div>
                                                            <div className="operator-list-col tcol email-work">{
                                                                ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'work'
                                                                    ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_work || ''
                                                                    : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'personal'
                                                                        ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_personal || ''
                                                                        : ((operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.primary_email || '') === 'other'
                                                                            ? (operator.contacts || []).find(x => (x.is_primary || 0) === 1)?.email_other || ''
                                                                            : (operator?.email || '')
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
                                                <input type="text" placeholder="First Name"
                                                    onChange={e => setOperatorSearch({
                                                        ...operatorSearch,
                                                        first_name: e.target.value
                                                    })} value={operatorSearch.first_name || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Last Name" onFocus={() => {
                                                    setShowingOperatorList(false)
                                                }} onChange={e => setOperatorSearch({
                                                    ...operatorSearch,
                                                    last_name: e.target.value
                                                })} value={operatorSearch.last_name || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 1" onFocus={() => {
                                                    setShowingOperatorList(false)
                                                }} onChange={e => setOperatorSearch({
                                                    ...operatorSearch,
                                                    address1: e.target.value
                                                })} value={operatorSearch.address1 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 2" onFocus={() => {
                                                    setShowingOperatorList(false)
                                                }} onChange={e => setOperatorSearch({
                                                    ...operatorSearch,
                                                    address2: e.target.value
                                                })} value={operatorSearch.address2 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="City" onFocus={() => {
                                                    setShowingOperatorList(false)
                                                }} onChange={e => setOperatorSearch({
                                                    ...operatorSearch,
                                                    city: e.target.value
                                                })} value={operatorSearch.city || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container input-state">
                                                <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                    setShowingOperatorList(false)
                                                }} onChange={e => setOperatorSearch({
                                                    ...operatorSearch,
                                                    state: e.target.value
                                                })} value={operatorSearch.state || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <MaskedInput
                                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={true}
                                                    type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => {
                                                        setShowingOperatorList(false)
                                                    }} onChange={e => setOperatorSearch({
                                                        ...operatorSearch,
                                                        phone: e.target.value
                                                    })} value={operatorSearch.phone || ''} />
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
                                                                    elems[i].focus({preventScroll: true});
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        setShowingOperatorList(false)
                                                    }}
                                                    onChange={e => setOperatorSearch({
                                                        ...operatorSearch,
                                                        email: e.target.value
                                                    })}
                                                    value={operatorSearch.email || ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }

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
    setSelectedCompany,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedDriver,
    setSelectedOperator,
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
    setCompanyReportPanels
})(CompanySetup)