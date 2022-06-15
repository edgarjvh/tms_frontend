import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './Agents.css';
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
    setSelectedAgent
} from './../../../../actions';

import { PassModal } from './../../panels';

import { Documents } from './../../../company/panels';

const Agents = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [tempSelectedAgent, setTempSelectedAgent] = useState({});
    const [isEditingAgent, setIsEditingAgent] = useState(false);
    const [agentSearchCompany, setAgentSearchCompany] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const [newPassword, setNewPassword] = useState('');

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingAgent
    });

    const newPasswordTransition = useTransition(newPassword !== '', {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: newPassword !== '',
        config: { duration: 100 }
    });


    useEffect(async () => {
        setAgentSearchCompany(props.agentSearchCompany || {});

        if (props.isEditingAgent) {
            setIsEditingAgent(true);
            refPrefix.current.focus({
                preventScroll: true
            });
        }

    }, [])

    const saveAgent = () => {
        let agent = agentSearchCompany?.selectedAgent;

        if ((tempSelectedAgent.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((tempSelectedAgent.last_name || '').trim() === '') {
            window.alert('You must enter the last name!');
            return;
        }

        if ((tempSelectedAgent.phone_work || '').trim() === '' &&
            (tempSelectedAgent.phone_work_fax || '').trim() === '' &&
            (tempSelectedAgent.phone_mobile || '').trim() === '' &&
            (tempSelectedAgent.phone_direct || '').trim() === '' &&
            (tempSelectedAgent.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempSelectedAgent.primary_phone) {
            case 'work':
                if ((tempSelectedAgent.phone_work || '').trim() === '') {
                    tempSelectedAgent.primary_phone = (tempSelectedAgent.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedAgent.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedAgent.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedAgent.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempSelectedAgent.phone_work_fax || '').trim() === '') {
                    tempSelectedAgent.primary_phone = (tempSelectedAgent.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedAgent.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedAgent.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempSelectedAgent.phone_mobile || '').trim() === '') {
                    tempSelectedAgent.primary_phone = (tempSelectedAgent.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedAgent.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedAgent.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempSelectedAgent.phone_direct || '').trim() === '') {
                    tempSelectedAgent.primary_phone = (tempSelectedAgent.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedAgent.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedAgent.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedAgent.phone_other || '').trim() === '') {
                    tempSelectedAgent.primary_phone = (tempSelectedAgent.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedAgent.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedAgent.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempSelectedAgent.primary_phone = 'work'
                break;
        }

        switch (tempSelectedAgent.primary_email) {
            case 'work':
                if ((tempSelectedAgent.email_work || '').trim() === '') {
                    tempSelectedAgent.primary_email = (tempSelectedAgent.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedAgent.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempSelectedAgent.email_personal || '').trim() === '') {
                    tempSelectedAgent.primary_email = (tempSelectedAgent.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedAgent.email_other || '').trim() === '') {
                    tempSelectedAgent.primary_email = (tempSelectedAgent.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedAgent.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempSelectedAgent.primary_email = 'work'
                break;
        }

        if ((tempSelectedAgent.address1 || '').trim() === '' && (tempSelectedAgent.address2 || '').trim() === '') {
            tempSelectedAgent.address1 = agentSearchCompany.address1;
            tempSelectedAgent.address2 = agentSearchCompany.address2;
            tempSelectedAgent.city = agentSearchCompany.city;
            tempSelectedAgent.state = agentSearchCompany.state;
            tempSelectedAgent.zip_code = agentSearchCompany.zip;
        }

        axios.post(props.serverUrl + props.savingAgentUrl, tempSelectedAgent).then(res => {
            if (res.data.result === 'OK') {
                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.agent.company_id || 0), agents: res.data.agents });
                props.setSelectedAgent(res.data.agent);

                setAgentSearchCompany({ ...agentSearchCompany, selectedAgent: res.data.agent, agents: res.data.agents });
                setIsEditingAgent(false);
            }
        }).catch(e => {
            console.log('error saving agent', e);
        });
    }

    const deleteAgent = () => {
        let agent = agentSearchCompany?.selectedAgent;

        if (window.confirm('Are you sure to delete this agent?')) {
            axios.post(props.serverUrl + props.deletingAgentUrl, agent).then(res => {
                if (res.data.result === 'OK') {
                    props.setSelectedCompany({ ...props.selectedCompany, agents: res.data.agents });
                    props.setSelectedAgent({ id: agent.id, deleted: true });

                    setAgentSearchCompany({ ...agentSearchCompany, selectedAgent: {}, agents: res.data.agents });
                    setIsEditingAgent(false);
                }
            }).catch(e => {
                console.log('error deleting agent', e);
            });
        }
    }

    const agentAvatarChange = (e) => {
        let files = e.target.files;
        const maxSize = 3145728;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 3mb");
                return;
            }

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("agent_id", agentSearchCompany?.selectedAgent?.id);
            formData.append("company_id", agentSearchCompany.id);

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
                            agents: res.data.agents
                        });

                        await setAgentSearchCompany(agentSearchCompany => {
                            return {
                                ...agentSearchCompany,
                                selectedAgent: res.data.agent,
                                agents: res.data.agents
                            }
                        });
                    }
                    refInputAvatar.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing agent avatar", err);
                    refInputAvatar.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeAgentAvatar = (e) => {
        axios.post(props.serverUrl + props.removeAvatarUrl, agentSearchCompany?.selectedAgent).then(async res => {
            if (res.data.result === "OK") {
                props.setSelectedCompany({ ...props.selectedCompany, agents: res.data.agents });

                await setAgentSearchCompany(agentSearchCompany => {
                    return {
                        ...agentSearchCompany,
                        selectedAgent: res.data.agent,
                        agents: res.data.agents
                    }
                });
            }
        }).catch(e => {
            console.log('error removig agent avatar', e);
        });
    }

    const setAgentPassword = () => {
        if (window.confirm('Are you sure you want to proceed?')) {
            axios.post(props.serverUrl + '/resetAgentPassword', { id: (agentSearchCompany?.selectedAgent?.id || 0) }).then(res => {
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

            <div className="agent-container" style={{ overflow: 'initial' }}>
                <div className="agent-list-container">
                    <div className="title">{props.title}</div><div className="side-title" style={{ left: '-45px' }}><div>{props.title}</div></div>

                    <div className="agent-list">
                        <div className="agent-list-wrapper">
                            <div className="row-agent" style={{
                                marginTop: 10
                            }}>
                                <div className="agent-avatar-container">
                                    <img src={agentSearchCompany?.selectedAgent?.avatar ? props.serverUrl + '/avatars/' + agentSearchCompany?.selectedAgent?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                                <div className="agent-data">
                                    <div className="agent-name">
                                        {(agentSearchCompany?.selectedAgent?.prefix || '') + " " + (agentSearchCompany?.selectedAgent?.first_name || '') + " " + (agentSearchCompany?.selectedAgent?.middle_name || '') + " " + (agentSearchCompany?.selectedAgent?.last_name || '')}
                                    </div>
                                    <div className="online-status">
                                        {isEditingAgent ? tempSelectedAgent.prefix || '' : agentSearchCompany?.selectedAgent?.prefix || ''}
                                        <div className={(isEditingAgent ? tempSelectedAgent.is_online : agentSearchCompany?.selectedAgent?.is_online) === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row-agent-info">
                                <div className="info-row">
                                    <div className="info-row-label">Agent Number:</div>
                                    <div className="info-row-input">
                                        {agentSearchCompany?.selectedAgent?.id !== undefined
                                            ? 'AG' + agentSearchCompany?.selectedAgent.id.toString().padStart(4, '0')
                                            : ''}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">E-mail Address:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.email_work || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Phone Number:</div>
                                    <div className="info-row-input">
                                        <div>{agentSearchCompany?.selectedAgent?.phone_work || '-'}</div>
                                        <div><span>ext:</span> {agentSearchCompany?.selectedAgent?.phone_ext || '-'}</div>
                                    </div>
                                </div>

                                {/* <div className="info-row">
                                    <div className="info-row-label">Department:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.department || '-'}</div>
                                </div> */}

                                <div className="info-row">
                                    <div className="info-row-label">Phone Mobile:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.phone_mobile || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Regional Manager:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.regional_manager || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Division:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.division || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Agent Pay Brokerage:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.aget_pay_brokerage || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Agent Pay Company Trucks:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.regional_manager || '-'}</div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Does Agent Own Units?:</div>
                                    <div className="info-row-input">
                                        <div className="input-option">
                                            <input type="radio" id='agent-own-unit-yes' name='agent-own-unit' checked={(agentSearchCompany?.selectedAgent?.agent_own_units || 0) === 1}
                                                onChange={e => {
                                                    setAgentSearchCompany(agentSearchCompany => {
                                                        return {
                                                            ...agentSearchCompany,
                                                            selectedAgent: {
                                                                ...agentSearchCompany.selectedAgent,
                                                                agent_own_units: e.target.checked ? 1 : 0
                                                            }
                                                        }
                                                    })

                                                    if ((agentSearchCompany?.selectedAgent?.id || 0) > 0){
                                                        axios.post(props.serverUrl + props.savingAgentUrl, {
                                                            ...agentSearchCompany.selectedAgent,
                                                            agent_own_units: e.target.checked ? 1 : 0
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.agent.company_id || 0), agents: res.data.agents });
                                                                props.setSelectedAgent(res.data.agent);
    
                                                                setAgentSearchCompany({ ...agentSearchCompany, selectedAgent: res.data.agent, agents: res.data.agents });
                                                                setIsEditingAgent(false);
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving agent', e);
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="agent-own-unit-yes">Yes</label>
                                        </div>

                                        <div className="input-option" style={{ marginLeft: 15 }}>
                                            <input type="radio" id='agent-own-unit-no' name='agent-own-unit' checked={(agentSearchCompany?.selectedAgent?.agent_own_units || 0) === 0}
                                                onChange={e => {
                                                    setAgentSearchCompany(agentSearchCompany => {
                                                        return {
                                                            ...agentSearchCompany,
                                                            selectedAgent: {
                                                                ...agentSearchCompany.selectedAgent,
                                                                agent_own_units: e.target.checked ? 0 : 1
                                                            }
                                                        }
                                                    })

                                                    if ((agentSearchCompany?.selectedAgent?.id || 0) > 0){
                                                        axios.post(props.serverUrl + props.savingAgentUrl, {
                                                            ...agentSearchCompany.selectedAgent,
                                                            agent_own_units: e.target.checked ? 0 : 1
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                props.setSelectedCompany({ ...props.selectedCompany, id: (res.data.agent.company_id || 0), agents: res.data.agents });
                                                                props.setSelectedAgent(res.data.agent);
    
                                                                setAgentSearchCompany({ ...agentSearchCompany, selectedAgent: res.data.agent, agents: res.data.agents });
                                                                setIsEditingAgent(false);
                                                            }
                                                        }).catch(e => {
                                                            console.log('error saving agent', e);
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor="agent-own-unit-no">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Carrier Code:</div>
                                    <div className="info-row-input">
                                        {(agentSearchCompany?.selectedAgent?.carrier_code || '') === '' ? '-' : agentSearchCompany?.selectedAgent?.carrier_code + ((agentSearchCompany?.selectedAgent?.carrier_code_number || 0) === 0 ? '' : agentSearchCompany?.selectedAgent?.carrier_code_number)}
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-row-label">Agent Pay Own Units:</div>
                                    <div className="info-row-input">{agentSearchCompany?.selectedAgent?.agent_pay_own_units || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="agent-form-bg">
                    <div className="agent-form">
                        <div className="agent-form-header">
                            <div className="agent-avatar-container">

                                {
                                    (isEditingAgent && (agentSearchCompany?.selectedAgent?.id || 0) > 0 && (agentSearchCompany?.selectedAgent?.avatar || '') !== '') && <span className="fas fa-trash-alt remove-agent-avatar-btn" onClick={removeAgentAvatar}></span>
                                }
                                {
                                    (isEditingAgent && (agentSearchCompany?.selectedAgent?.id || 0) > 0) && <span className="fas fa-plus change-agent-avatar-btn" onClick={() => { refInputAvatar.current.click() }}></span>
                                }

                                <form encType='multipart/form-data' style={{ display: 'none' }}>
                                    <input type="file" ref={refInputAvatar} accept='image/*' onChange={agentAvatarChange} />
                                </form>

                                <div className="agent-avatar-wrapper">
                                    <img src={agentSearchCompany?.selectedAgent?.avatar ? props.serverUrl + '/avatars/' + agentSearchCompany?.selectedAgent?.avatar : 'img/avatar-user-default.png'} alt="" />
                                </div>

                            </div>
                            <div className="agent-info">
                                <div className="agent-name">
                                    {(agentSearchCompany?.selectedAgent?.prefix || '') + " " + (agentSearchCompany?.selectedAgent?.first_name || '') + " " + (agentSearchCompany?.selectedAgent?.middle_name || '') + " " + (agentSearchCompany?.selectedAgent?.last_name || '')}
                                </div>
                                {/* <div className="agent-code">
                                    {
                                        (agentSearchCompany?.selectedAgent?.id || 0) > 0 &&
                                        <span>
                                            {agentSearchCompany?.selectedAgent?.id !== undefined
                                                ? 'AG' + agentSearchCompany?.selectedAgent.id.toString().padStart(4, '0')
                                                : ''}
                                        </span>
                                    }
                                </div> */}

                                <div className="agent-company">
                                    <span>
                                        {agentSearchCompany?.selectedAgent?.id !== undefined ? agentSearchCompany.name : ''}
                                    </span>

                                    <span>
                                        {(agentSearchCompany?.selectedAgent?.title || '')}
                                    </span>

                                    <span>
                                        {(agentSearchCompany?.selectedAgent?.department || '')}
                                    </span>
                                </div>

                                <div className="agent-username-info">
                                    <div className="username-chat">
                                        <div className="agent-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Chat</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>

                                    <div className="username-video">
                                        <div className="agent-username">@username</div>
                                        <div className="mochi-button" onClick={(e) => { e.stopPropagation() }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Video</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="agent-buttons">
                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingAgent &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingAgent(false);
                                            setTempSelectedAgent({});
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingAgent &&
                                        <div className="mochi-button" onClick={saveAgent}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isEditingAgent &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingAgent(true);
                                            setTempSelectedAgent({ ...agentSearchCompany?.selectedAgent });
                                        }} style={{
                                            color: agentSearchCompany?.selectedAgent?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: agentSearchCompany?.selectedAgent?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <div className="mochi-button" onClick={deleteAgent} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: (agentSearchCompany?.selectedAgent?.id !== undefined && agentSearchCompany?.selectedAgent?.id > 0) ? 'all' : 'none'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base" style={{ color: (agentSearchCompany?.selectedAgent?.id !== undefined && agentSearchCompany?.selectedAgent?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    {
                                        ((agentSearchCompany?.selectedAgent?.id || 0) > 0) &&
                                        <div className="mochi-button" onClick={setAgentPassword} style={{
                                            marginLeft: '0.2rem',
                                            pointerEvents: (agentSearchCompany?.selectedAgent?.id !== undefined && agentSearchCompany?.selectedAgent?.id > 0) ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base" style={{
                                                color: (agentSearchCompany?.selectedAgent?.id !== undefined && agentSearchCompany?.selectedAgent?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)'
                                            }}>New Password</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                </div>

                                <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {
                                    if ((agentSearchCompany?.selectedAgent?.id || 0) > 0) {
                                        let panel = {
                                            panelName: `${props.panelName}-agent-documents`,
                                            component: <Documents
                                                title='Documents'
                                                tabTimes={426000 + props.tabTimes}
                                                panelName={`${props.panelName}-agent-documents`}
                                                origin={props.origin}
                                                suborigin={'company-agent'}
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}
                                                selectedOwner={{ ...agentSearchCompany.selectedAgent }}
                                                selectedOwnerDocument={{
                                                    id: 0,
                                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                    date_entered: moment().format('MM/DD/YYYY')
                                                }}
                                                savingDocumentUrl='/saveAgentDocument'
                                                deletingDocumentUrl='/deleteAgentDocument'
                                                savingDocumentNoteUrl='/saveAgentDocumentNote'
                                                serverDocumentsFolder='/agent-documents/'
                                            />
                                        }

                                        props.openPanel(panel, props.origin);
                                    } else {
                                        window.alert('You must select an agent first!');
                                    }
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Documents</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                        </div>
                        <div className="agent-form-fields">
                            <div className="col-agent-form">
                                <div className="agent-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, prefix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, prefix: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.prefix || '' : agentSearchCompany?.selectedAgent?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, first_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, first_name: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.first_name || '' : agentSearchCompany?.selectedAgent?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, middle_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, middle_name: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.middle_name || '' : agentSearchCompany?.selectedAgent?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, last_name: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, last_name: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.last_name || '' : agentSearchCompany?.selectedAgent?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, suffix: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, suffix: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.suffix || '' : agentSearchCompany?.selectedAgent?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => { }}
                                            onChange={e => { }}
                                            value={agentSearchCompany?.selectedAgent?.id !== undefined ? agentSearchCompany.name : ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, title: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, title: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.title || '' : agentSearchCompany?.selectedAgent?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, department: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, department: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.department || '' : agentSearchCompany?.selectedAgent?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_work: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_work: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.email_work || '' : agentSearchCompany?.selectedAgent?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_personal: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.email_personal || '' : agentSearchCompany?.selectedAgent?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_other: e.target.value.toLowerCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, email_other: e.target.value.toLowerCase() });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.email_other || '' : agentSearchCompany?.selectedAgent?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_work: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_work: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_work || '' : agentSearchCompany?.selectedAgent?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_ext: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_ext: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_ext || '' : agentSearchCompany?.selectedAgent?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_work_fax: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_work_fax: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_work_fax || '' : agentSearchCompany?.selectedAgent?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_mobile: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_mobile: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_mobile || '' : agentSearchCompany?.selectedAgent?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_direct: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_direct: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_direct || '' : agentSearchCompany?.selectedAgent?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_other: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, phone_other: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.phone_other || '' : agentSearchCompany?.selectedAgent?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, country: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, country: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.country || '' : agentSearchCompany?.selectedAgent?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, address1: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, address1: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.address1 || '' : agentSearchCompany?.selectedAgent?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, address2: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, address2: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.address2 || '' : agentSearchCompany?.selectedAgent?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, city: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, city: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.city || '' : agentSearchCompany?.selectedAgent?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, state: e.target.value.toUpperCase() });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, state: e.target.value.toUpperCase() });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.state || '' : agentSearchCompany?.selectedAgent?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, zip_code: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, zip_code: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.zip_code || '' : agentSearchCompany?.selectedAgent?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, birthday: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, birthday: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.birthday || '' : agentSearchCompany?.selectedAgent?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, website: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, website: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.website || '' : agentSearchCompany?.selectedAgent?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingAgent}
                                            onInput={(e) => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, notes: e.target.value });
                                            }}
                                            onChange={e => {
                                                setTempSelectedAgent({ ...tempSelectedAgent, notes: e.target.value });
                                            }}
                                            value={isEditingAgent ? tempSelectedAgent.notes || '' : agentSearchCompany?.selectedAgent?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-agent-splitter">

                            </div>
                            <div className="col-agent-permissions">
                                <div className="col-title">Permissions</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className="mochi-button" onClick={() => {
                            setAgentSearchCompany({ ...agentSearchCompany, selectedAgent: { id: 0, company_id: agentSearchCompany.id } });
                            setTempSelectedAgent({ id: 0, company_id: agentSearchCompany.id });

                            setIsEditingAgent(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Agent
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
        selectedAgent: state.companySetupReducers.selectedAgent,
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
    setSelectedAgent
})(Agents)