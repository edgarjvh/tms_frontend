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
    setSelectedOwnerOperator as setSelectedOperator,
} from './../../../../actions';

const Operators = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
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

    useEffect(async () => {
        setOperatorSearchCompany(props.operatorSearchCompany || {});

        if (props.isEditingOperator) {
            setIsEditingOperator(true);
            refPrefix.current.focus({
                preventScroll: true
            });
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

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>

            <div className="operator-container" style={{ overflow: 'initial' }}>
                <div className="operator-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="operator-list">
                        <div className="operator-list-wrapper">
                            {
                                (operatorSearchCompany.operators || []).map((operator, index) => {
                                    let curLetter = operator.last_name.substring(0, 1).toLowerCase();
                                    if (curLetter !== lastLetter) {
                                        lastLetter = curLetter;
                                        return (
                                            <div key={index}>
                                                <div className="letter-header">{curLetter}</div>

                                                <div className="row-operator" onClick={async () => {
                                                    await setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: operator });
                                                    setIsEditingOperator(false);
                                                }}>
                                                    <div className="operator-avatar-container">
                                                        <img src={operator.avatar ? props.serverUrl + '/avatars/' + operator.avatar : 'img/avatar-user-default.png'} alt="" />
                                                    </div>

                                                    <div className="operator-data">
                                                        <div className="operator-name" style={{
                                                            display: 'flex', alignItems: 'center'
                                                        }}>
                                                            <div style={{ flexGrow: 1 }}>
                                                                {(operator.prefix || '') + " " + operator.first_name + " " + (operator.middle_name || '') + " " + operator.last_name}
                                                            </div>
                                                            {
                                                                (operator.is_primary === 1) &&
                                                                <div className="operator-list-col tcol pri">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </div>
                                                            }</div>
                                                        <div className="online-status">
                                                            <div className={operator.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                            <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                                <div className="mochi-button-base">Chat</div>
                                                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="row-operator" onClick={async () => {
                                                await setOperatorSearchCompany({ ...operatorSearchCompany, selectedOperator: operator });
                                                setIsEditingOperator(false);
                                            }}>
                                                <div className="operator-avatar-container">
                                                    <img src={operator.avatar ? props.serverUrl + '/avatars/' + operator.avatar : 'img/avatar-user-default.png'} alt="" />
                                                </div>

                                                <div className="operator-data">
                                                    <div className="operator-name">{(operator.prefix || '') + " " + operator.first_name + " " + (operator.middle_name || '') + " " + operator.last_name}</div>
                                                    <div className="online-status">
                                                        <div className={operator.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                            <div className="mochi-button-base">Chat</div>
                                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
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
                                <div className="operator-code">
                                    {
                                        (operatorSearchCompany?.selectedOperator?.id || 0) > 0 &&
                                        <span>
                                            {operatorSearchCompany?.selectedOperator?.id !== undefined
                                                ? 'OO' + operatorSearchCompany?.selectedOperator.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }
                                </div>
                                <div className="operator-username-info">
                                    <div className="operator-username">@username</div>
                                    <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Chat</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
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
                            </div>
                        </div>
                        <div className="operator-form-fields">
                            <div className="col-operator-form">
                                <div className="operator-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={operatorSearchCompany?.selectedOperator?.id !== undefined ? operatorSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                                        <input type="text" readOnly={!isEditingOperator}
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
                            <div className="col-operator-emails">
                                <div className="col-title">E-mails</div>
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
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,

        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedOperator: state.companySetupReducers.selectedOperator,
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
    setSelectedOperator
})(Operators)