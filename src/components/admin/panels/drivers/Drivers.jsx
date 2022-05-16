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
    setSelectedCompanyDriver as setSelectedDriver
} from './../../../../actions';

const Drivers = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [tempSelectedDriver, setTempSelectedDriver] = useState({});
    const [isEditingDriver, setIsEditingDriver] = useState(false);
    const [driverSearchCompany, setDriverSearchCompany] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingDriver
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

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>

            <div className="driver-container" style={{ overflow: 'initial' }}>
                <div className="driver-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="driver-list">
                        <div className="driver-list-wrapper">
                            {
                                (driverSearchCompany.drivers || []).map((driver, index) => {
                                    let curLetter = driver.last_name.substring(0, 1).toLowerCase();
                                    if (curLetter !== lastLetter) {
                                        lastLetter = curLetter;
                                        return (
                                            <div key={index}>
                                                <div className="letter-header">{curLetter}</div>

                                                <div className="row-driver" onClick={async () => {
                                                    await setDriverSearchCompany({ ...driverSearchCompany, selectedDriver: driver });
                                                    setIsEditingDriver(false);
                                                }}>
                                                    <div className="driver-avatar-container">
                                                        <img src={driver.avatar ? props.serverUrl + '/avatars/' + driver.avatar : 'img/avatar-user-default.png'} alt="" />
                                                    </div>

                                                    <div className="driver-data">
                                                        <div className="driver-name" style={{
                                                            display: 'flex', alignItems: 'center'
                                                        }}>
                                                            <div style={{ flexGrow: 1 }}>
                                                                {(driver.prefix || '') + " " + driver.first_name + " " + (driver.middle_name || '') + " " + driver.last_name}
                                                            </div>
                                                            {
                                                                (driver.is_primary === 1) &&
                                                                <div className="driver-list-col tcol pri">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </div>
                                                            }</div>
                                                        <div className="online-status">
                                                            <div className={driver.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
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
                                            <div key={index} className="row-driver" onClick={async () => {
                                                await setDriverSearchCompany({ ...driverSearchCompany, selectedDriver: driver });
                                                setIsEditingDriver(false);
                                            }}>
                                                <div className="driver-avatar-container">
                                                    <img src={driver.avatar ? props.serverUrl + '/avatars/' + driver.avatar : 'img/avatar-user-default.png'} alt="" />
                                                </div>

                                                <div className="driver-data">
                                                    <div className="driver-name">{(driver.prefix || '') + " " + driver.first_name + " " + (driver.middle_name || '') + " " + driver.last_name}</div>
                                                    <div className="online-status">
                                                        <div className={driver.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
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
                                <div className="driver-code">
                                    {
                                        (driverSearchCompany?.selectedDriver?.id || 0) > 0 &&
                                        <span>
                                            {driverSearchCompany?.selectedDriver?.id !== undefined
                                                ? 'DV' + driverSearchCompany?.selectedDriver.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }
                                </div>
                                <div className="driver-username-info">
                                    <div className="driver-username">@username</div>
                                    <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Chat</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
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
                            </div>
                        </div>
                        <div className="driver-form-fields">
                            <div className="col-driver-form">
                                <div className="driver-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={driverSearchCompany?.selectedDriver?.id !== undefined ? driverSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                        <input type="text" readOnly={!isEditingDriver}
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
                                                setTempSelectedDriver({ ...tempSelectedDriver, website: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedDriver({ ...tempSelectedDriver, website: e.target.value });
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
                            <div className="col-driver-emails">
                                <div className="col-title">E-mails</div>
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
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,

        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedDriver: state.companySetupReducers.selectedDriver,
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
    setSelectedDriver
})(Drivers)