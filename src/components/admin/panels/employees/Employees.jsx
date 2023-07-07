import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './Employees.css';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faCheck, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setCompanySetupOpenedPanels,
    setSelectedCompany,
    setSelectedEmployee
} from './../../../../actions';

import { PassModal } from './../../panels';

import { Documents } from './../../../company/panels';

const Employees = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [tempSelectedEmployee, setTempSelectedEmployee] = useState({});
    const [isEditingEmployee, setIsEditingEmployee] = useState(false);
    const [employeeSearchCompany, setEmployeeSearchCompany] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const [newPassword, setNewPassword] = useState('');

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingEmployee
    });

    const newPasswordTransition = useTransition(newPassword !== '', {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: newPassword !== '',
        config: { duration: 100 }
    });


    useEffect(async () => {
        setEmployeeSearchCompany(props.employeeSearchCompany || {});

        if (props.isEditingEmployee) {
            setIsEditingEmployee(true);
            refPrefix.current.focus({
                preventScroll: true
            });
        }

    }, [])

    useEffect(() => {
        if ((props.selectedEmployee?.component_id || '') !== props.componentId) {
            if (((employeeSearchCompany?.selectedEmployee?.id || 0) > 0 && (props.selectedEmployee?.id || 0) > 0) && employeeSearchCompany.selectedEmployee.id === props.selectedEmployee.id) {
                setEmployeeSearchCompany(employeeSearchCompany => {
                    return {
                        ...employeeSearchCompany,
                        selectedEmployee: {
                            ...employeeSearchCompany.selectedEmployee,
                            ...props.selectedEmployee
                        }
                    }
                })

                props.setSelectedCompany({
                    ...props.selectedCompany,
                    employees: (props.selectedCompany.employees || []).map(employee => {
                        if (employee.id === employeeSearchCompany.selectedEmployee.id) {
                            employee = { ...props.selectedEmployee }
                        }

                        return employee;
                    })
                })
            }
        }
    }, [props.selectedEmployee])

    const saveEmployee = () => {
        let employee = employeeSearchCompany?.selectedEmployee;

        if ((tempSelectedEmployee.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((tempSelectedEmployee.last_name || '').trim() === '') {
            window.alert('You must enter the last name!');
            return;
        }

        if ((tempSelectedEmployee.phone_work || '').trim() === '' &&
            (tempSelectedEmployee.phone_work_fax || '').trim() === '' &&
            (tempSelectedEmployee.phone_mobile || '').trim() === '' &&
            (tempSelectedEmployee.phone_direct || '').trim() === '' &&
            (tempSelectedEmployee.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempSelectedEmployee.primary_phone) {
            case 'work':
                if ((tempSelectedEmployee.phone_work || '').trim() === '') {
                    tempSelectedEmployee.primary_phone = (tempSelectedEmployee.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedEmployee.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedEmployee.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedEmployee.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempSelectedEmployee.phone_work_fax || '').trim() === '') {
                    tempSelectedEmployee.primary_phone = (tempSelectedEmployee.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedEmployee.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedEmployee.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempSelectedEmployee.phone_mobile || '').trim() === '') {
                    tempSelectedEmployee.primary_phone = (tempSelectedEmployee.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedEmployee.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedEmployee.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempSelectedEmployee.phone_direct || '').trim() === '') {
                    tempSelectedEmployee.primary_phone = (tempSelectedEmployee.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedEmployee.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedEmployee.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedEmployee.phone_other || '').trim() === '') {
                    tempSelectedEmployee.primary_phone = (tempSelectedEmployee.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedEmployee.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedEmployee.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempSelectedEmployee.primary_phone = 'work'
                break;
        }

        switch (tempSelectedEmployee.primary_email) {
            case 'work':
                if ((tempSelectedEmployee.email_work || '').trim() === '') {
                    tempSelectedEmployee.primary_email = (tempSelectedEmployee.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedEmployee.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempSelectedEmployee.email_personal || '').trim() === '') {
                    tempSelectedEmployee.primary_email = (tempSelectedEmployee.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedEmployee.email_other || '').trim() === '') {
                    tempSelectedEmployee.primary_email = (tempSelectedEmployee.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedEmployee.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempSelectedEmployee.primary_email = 'work'
                break;
        }

        if ((tempSelectedEmployee.address1 || '').trim() === '' && (tempSelectedEmployee.address2 || '').trim() === '') {
            tempSelectedEmployee.address1 = employeeSearchCompany.address1;
            tempSelectedEmployee.address2 = employeeSearchCompany.address2;
            tempSelectedEmployee.city = employeeSearchCompany.city;
            tempSelectedEmployee.state = employeeSearchCompany.state;
            tempSelectedEmployee.zip_code = employeeSearchCompany.zip;
        }

        axios.post(props.serverUrl + props.savingEmployeeUrl, tempSelectedEmployee).then(res => {
            if (res.data.result === 'OK') {
                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.employee.company_id || 0), employees: res.data.employees });
                props.setSelectedEmployee(res.data.employee);

                setEmployeeSearchCompany({ ...employeeSearchCompany, selectedEmployee: res.data.employee, employees: res.data.employees });
                setIsEditingEmployee(false);
            }
        }).catch(e => {
            console.log('error saving employee', e);
        });
    }

    const deleteEmployee = () => {
        let employee = employeeSearchCompany?.selectedEmployee;

        if (window.confirm('Are you sure to delete this employee?')) {
            axios.post(props.serverUrl + props.deletingEmployeeUrl, employee).then(res => {
                if (res.data.result === 'OK') {
                    props.setSelectedCompany({ ...props.selectedCompany, employees: res.data.employees });
                    props.setSelectedEmployee({ id: employee.id, deleted: true });

                    setEmployeeSearchCompany({ ...employeeSearchCompany, selectedEmployee: {}, employees: res.data.employees });
                    setIsEditingEmployee(false);
                }
            }).catch(e => {
                console.log('error deleting employee', e);
            });
        }
    }

    const employeeAvatarChange = (e) => {
        let files = e.target.files;
        const maxSize = 3145728;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 3mb");
                return;
            }

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("employee_id", employeeSearchCompany?.selectedEmployee?.id);
            formData.append("company_id", employeeSearchCompany.id);

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
                            employees: res.data.employees
                        });

                        await setEmployeeSearchCompany(employeeSearchCompany => {
                            return {
                                ...employeeSearchCompany,
                                selectedEmployee: res.data.employee,
                                employees: res.data.employees
                            }
                        });
                    }
                    refInputAvatar.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing employee avatar", err);
                    refInputAvatar.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeEmployeeAvatar = (e) => {
        axios.post(props.serverUrl + props.removeAvatarUrl, employeeSearchCompany?.selectedEmployee).then(async res => {
            if (res.data.result === "OK") {
                props.setSelectedCompany({ ...props.selectedCompany, employees: res.data.employees });

                await setEmployeeSearchCompany(employeeSearchCompany => {
                    return {
                        ...employeeSearchCompany,
                        selectedEmployee: res.data.employee,
                        employees: res.data.employees
                    }
                });
            }
        }).catch(e => {
            console.log('error removig employee avatar', e);
        });
    }

    const setEmployeePassword = () => {
        if (window.confirm('Are you sure you want to proceed?')) {
            axios.post(props.serverUrl + '/resetEmployeePassword', { id: (employeeSearchCompany?.selectedEmployee?.id || 0) }).then(res => {
                if (res.data.result === 'OK') {
                    setNewPassword(res.data.newpass);
                } else {
                    window.alert('An error occurred while getting a new password');
                }
            })
        }
    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>

            <div className="employee-container" style={{ overflow: 'initial' }}>
                <div className="employee-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="employee-list">
                        <div className="employee-list-wrapper">
                            <div className="row-employee" style={{
                                marginTop: 10
                            }}>
                                <div className="employee-avatar-container">
                                    <img src={employeeSearchCompany?.selectedEmployee?.avatar ? props.serverUrl + '/avatars/' + employeeSearchCompany?.selectedEmployee?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                                <div className="employee-data">
                                    <div className="employee-name" style={{
                                        textTransform: 'capitalize'
                                    }}>
                                        {(employeeSearchCompany?.selectedEmployee?.prefix || '') + " " + (employeeSearchCompany?.selectedEmployee?.first_name || '') + " " + (employeeSearchCompany?.selectedEmployee?.middle_name || '') + " " + (employeeSearchCompany?.selectedEmployee?.last_name || '')}
                                    </div>
                                    <div className="online-status">
                                        <div className={(isEditingEmployee ? tempSelectedEmployee.is_online : employeeSearchCompany?.selectedEmployee?.is_online) === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                        <div className="mochi-button" onClick={(e) => {
                                            e.stopPropagation();
                                            window.open('https://mm.et3.dev', '_blank').focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                        <div className="mochi-button" onClick={(e) => { 
                                            e.stopPropagation();
                                            window.open('https://meet.et3.dev/', '_blank').focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row-employee-info">
                                <div className="info-row">
                                    <div className="info-row-label">Employee Number:</div>
                                    <div className="info-row-input">
                                        {employeeSearchCompany?.selectedEmployee?.id !== undefined
                                            ? 'EM' + employeeSearchCompany?.selectedEmployee.id.toString().padStart(4, '0')
                                            : ''}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">E-mail Address:</div>
                                    <div className="info-row-input">{employeeSearchCompany?.selectedEmployee?.email_work || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Phone Number:</div>
                                    <div className="info-row-input">
                                        <div>{employeeSearchCompany?.selectedEmployee?.phone_work || '-'}</div>
                                        <div><span>ext:</span> {employeeSearchCompany?.selectedEmployee?.phone_ext || '-'}</div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Department:</div>
                                    <div className="info-row-input">{employeeSearchCompany?.selectedEmployee?.department || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Phone Mobile:</div>
                                    <div className="info-row-input">{employeeSearchCompany?.selectedEmployee?.phone_mobile || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="employee-form-bg">
                    <div className="employee-form">
                        <div className="employee-form-header">
                            <div className="employee-avatar-container">

                                {
                                    (isEditingEmployee && (employeeSearchCompany?.selectedEmployee?.id || 0) > 0 && (employeeSearchCompany?.selectedEmployee?.avatar || '') !== '') && <span className="fas fa-trash-alt remove-employee-avatar-btn" onClick={removeEmployeeAvatar}></span>
                                }
                                {
                                    (isEditingEmployee && (employeeSearchCompany?.selectedEmployee?.id || 0) > 0) && <span className="fas fa-plus change-employee-avatar-btn" onClick={() => { refInputAvatar.current.click() }}></span>
                                }

                                <form encType='multipart/form-data' style={{ display: 'none' }}>
                                    <input type="file" ref={refInputAvatar} accept='image/*' onChange={employeeAvatarChange} />
                                </form>

                                <div className="employee-avatar-wrapper">
                                    <img src={employeeSearchCompany?.selectedEmployee?.avatar ? props.serverUrl + '/avatars/' + employeeSearchCompany?.selectedEmployee?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                            </div>
                            <div className="employee-info">
                                <div className="employee-name">
                                    {(employeeSearchCompany?.selectedEmployee?.prefix || '') + " " + (employeeSearchCompany?.selectedEmployee?.first_name || '') + " " + (employeeSearchCompany?.selectedEmployee?.middle_name || '') + " " + (employeeSearchCompany?.selectedEmployee?.last_name || '')}
                                </div>
                                {/* <div className="employee-code">
                                    {
                                        (employeeSearchCompany?.selectedEmployee?.id || 0) > 0 &&
                                        <span>
                                            {employeeSearchCompany?.selectedEmployee?.id !== undefined
                                                ? 'EM' + employeeSearchCompany?.selectedEmployee.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }

                                </div> */}

                                <div className="employee-company">
                                    <span>
                                        {employeeSearchCompany?.selectedEmployee?.id !== undefined ? employeeSearchCompany.name : ''}
                                    </span>

                                    <span>
                                        {(employeeSearchCompany?.selectedEmployee?.title || '')}
                                    </span>

                                    <span>
                                        {(employeeSearchCompany?.selectedEmployee?.department || '')}
                                    </span>
                                </div>

                                <div className="employee-username-info">
                                    <div className="username-chat">
                                        <div className="mochi-button" onClick={(e) => { 
                                            e.stopPropagation();
                                            window.open('https://mm.et3.dev', '_blank').focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>

                                    <div className="username-video">
                                        <div className="mochi-button" onClick={(e) => { 
                                            e.stopPropagation();
                                            window.open('https://meet.et3.dev/', '_blank').focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="employee-buttons">
                                <div className="input-toggle-container">
                                    <input type="checkbox" id="cbox-panel-company-employees-primary-btn"
                                        onChange={e => {
                                            setTempSelectedEmployee({ ...tempSelectedEmployee, is_primary: e.target.checked ? 1 : 0 })
                                        }}
                                        disabled={!isEditingEmployee}
                                        checked={isEditingEmployee ? (tempSelectedEmployee.is_primary_admin || 0) === 1 : (employeeSearchCompany?.selectedEmployee?.is_primary_admin || 0) === 1} />
                                    <label htmlFor="cbox-panel-company-employees-primary-btn">
                                        <div className="label-text">Admin</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>

                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingEmployee &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingEmployee(false);
                                            setTempSelectedEmployee({});
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingEmployee &&
                                        <div className="mochi-button" onClick={saveEmployee}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isEditingEmployee &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingEmployee(true);
                                            setTempSelectedEmployee({ ...employeeSearchCompany?.selectedEmployee });
                                        }} style={{
                                            color: employeeSearchCompany?.selectedEmployee?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: employeeSearchCompany?.selectedEmployee?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <div className="mochi-button" onClick={deleteEmployee} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: (employeeSearchCompany?.selectedEmployee?.id !== undefined && employeeSearchCompany?.selectedEmployee?.id > 0) ? 'all' : 'none'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base" style={{ color: (employeeSearchCompany?.selectedEmployee?.id !== undefined && employeeSearchCompany?.selectedEmployee?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    {
                                        ((employeeSearchCompany?.selectedEmployee?.id || 0) > 0) &&
                                        <div className="mochi-button" onClick={setEmployeePassword} style={{
                                            marginLeft: '0.2rem',
                                            pointerEvents: (employeeSearchCompany?.selectedEmployee?.id !== undefined && employeeSearchCompany?.selectedEmployee?.id > 0) ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base" style={{
                                                color: (employeeSearchCompany?.selectedEmployee?.id !== undefined && employeeSearchCompany?.selectedEmployee?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)'
                                            }}>New Password</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                </div>

                                <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {
                                    if ((employeeSearchCompany?.selectedEmployee?.id || 0) > 0) {
                                        let panel = {
                                            panelName: `${props.panelName}-employee-documents`,
                                            component: <Documents
                                                title='Documents'
                                                tabTimes={426000 + props.tabTimes}
                                                panelName={`${props.panelName}-employee-documents`}
                                                origin={props.origin}
                                                suborigin={'company-employee'}
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}
                                                selectedOwner={{ ...employeeSearchCompany.selectedEmployee }}
                                                selectedOwnerDocument={{
                                                    id: 0,
                                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                    date_entered: moment().format('MM/DD/YYYY')
                                                }}
                                                savingDocumentUrl='/saveEmployeeDocument'
                                                deletingDocumentUrl='/deleteEmployeeDocument'
                                                savingDocumentNoteUrl='/saveEmployeeDocumentNote'
                                                deletingDocumentNoteUrl='/deleteEmployeeDocumentNote'
                                                serverDocumentsFolder='/employee-documents/'
                                            />
                                        }

                                        props.openPanel(panel, props.origin);
                                    } else {
                                        window.alert('You must select an employee first!');
                                    }
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Documents</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                        </div>
                        <div className="employee-form-fields">
                            <div className="col-employee-form">
                                <div className="employee-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, prefix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, prefix: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.prefix || '' : employeeSearchCompany?.selectedEmployee?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, first_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, first_name: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.first_name || '' : employeeSearchCompany?.selectedEmployee?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, middle_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, middle_name: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.middle_name || '' : employeeSearchCompany?.selectedEmployee?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, last_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, last_name: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.last_name || '' : employeeSearchCompany?.selectedEmployee?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, suffix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, suffix: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.suffix || '' : employeeSearchCompany?.selectedEmployee?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={employeeSearchCompany?.selectedEmployee?.id !== undefined ? employeeSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, title: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, title: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.title || '' : employeeSearchCompany?.selectedEmployee?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, department: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, department: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.department || '' : employeeSearchCompany?.selectedEmployee?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_work: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_work: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.email_work || '' : employeeSearchCompany?.selectedEmployee?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.email_personal || '' : employeeSearchCompany?.selectedEmployee?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_other: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, email_other: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.email_other || '' : employeeSearchCompany?.selectedEmployee?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_work: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_work: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_work || '' : employeeSearchCompany?.selectedEmployee?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_ext: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_ext: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_ext || '' : employeeSearchCompany?.selectedEmployee?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_work_fax: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_work_fax: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_work_fax || '' : employeeSearchCompany?.selectedEmployee?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_mobile: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_mobile: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_mobile || '' : employeeSearchCompany?.selectedEmployee?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_direct: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_direct: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_direct || '' : employeeSearchCompany?.selectedEmployee?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_other: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, phone_other: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.phone_other || '' : employeeSearchCompany?.selectedEmployee?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, country: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, country: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.country || '' : employeeSearchCompany?.selectedEmployee?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, address1: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, address1: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.address1 || '' : employeeSearchCompany?.selectedEmployee?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, address2: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, address2: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.address2 || '' : employeeSearchCompany?.selectedEmployee?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingEmployee} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, city: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, city: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.city || '' : employeeSearchCompany?.selectedEmployee?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, state: e.target.value.toUpperCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, state: e.target.value.toUpperCase() });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.state || '' : employeeSearchCompany?.selectedEmployee?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, zip_code: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, zip_code: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.zip_code || '' : employeeSearchCompany?.selectedEmployee?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, birthday: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, birthday: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.birthday || '' : employeeSearchCompany?.selectedEmployee?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, website: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, website: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.website || '' : employeeSearchCompany?.selectedEmployee?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingEmployee}
                                            onInput={(e) => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, notes: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedEmployee({ ...tempSelectedEmployee, notes: e.target.value });
                                            }}
                                            value={isEditingEmployee ? tempSelectedEmployee.notes || '' : employeeSearchCompany?.selectedEmployee?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-employee-splitter">

                            </div>
                            <div className="col-employee-permissions">
                                <div className="col-title">Permissions</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className="mochi-button" onClick={() => {
                            setEmployeeSearchCompany({ ...employeeSearchCompany, selectedEmployee: { id: 0, company_id: employeeSearchCompany.id } });
                            setTempSelectedEmployee({ id: 0, company_id: employeeSearchCompany.id });

                            setIsEditingEmployee(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Employee
                            </div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>


                </div>
            </div>

            {
                newPasswordTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <PassModal
                            title="New Password"
                            text={newPassword}
                            close={() => {
                                setNewPassword('')
                            }}
                        />
                    </animated.div>
                ))
            }
        </div>
    )
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

        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedEmployee: state.companySetupReducers.selectedEmployee,
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
    setCompanySetupOpenedPanels,
    setSelectedCompany,
    setSelectedEmployee
})(Employees)