import React, { useState, useEffect, useRef } from 'react'
import './ACHWiringInfo.css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import axios from 'axios';
import NumberFormat from "react-number-format";
import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';

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
} from './../../../../actions';

const ACHWiringInfo = (props) => {
    const [selectedOwner, setSelectedOwner] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const refACHWiringInfoContainer = useRef();
    const refAchBankingInfo = useRef();
    const refAchAccountInfo = useRef();
    const refAchAbaRouting = useRef();
    const refAchRemittenceEmail = useRef();
    const refWiringBankingInfo = useRef();
    const refWiringAccountInfo = useRef();
    const refWiringAbaRouting = useRef();
    const refWiringRemittenceEmail = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const [showAchRemittenceEmailBtn, setShowAchRemittenceEmailBtn] = useState(false);
    const [showWiringRemittenceEmailBtn, setShowWiringRemittenceEmailBtn] = useState(false);

    useEffect(() => {
        setSelectedOwner({
            ...props.selectedOwner,
            ach_type: (props.selectedOwner?.ach_type || '') === '' ? 'checking' : props.selectedOwner.ach_type,
            wiring_type: (props.selectedOwner?.wiring_type || '') === '' ? 'checking' : props.selectedOwner.wiring_type
        });

        refACHWiringInfoContainer.current.focus({
            preventScroll: true
        })
    }, [])

    const updateOwner = () => {
        if ((selectedOwner?.id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + props.savingUrl, {
                factoring_company_id: selectedOwner.id,
                carrier_id: selectedOwner.id,
                agent_id: selectedOwner.id,
                ach_banking_info: selectedOwner?.ach_banking_info || '',
                ach_account_info: selectedOwner?.ach_account_info || '',
                ach_aba_routing: selectedOwner?.ach_aba_routing || '',
                ach_remittence_email: (selectedOwner?.ach_remittence_email || '').toLowerCase(),
                ach_type: selectedOwner?.ach_type || 'checking',
                wiring_banking_info: selectedOwner?.wiring_banking_info || '',
                wiring_account_info: selectedOwner?.wiring_account_info || '',
                wiring_aba_routing: selectedOwner?.wiring_aba_routing || '',
                wiring_remittence_email: (selectedOwner?.wiring_remittence_email || '').toLowerCase(),
                wiring_type: selectedOwner?.wiring_type || 'checking'
            }).then(res => {
                if (res.data.result === 'OK') {
                    if (props.owner === 'carrier') {
                        props.setSelectedOwner(selectedOwner => {
                            return {
                                ...selectedOwner,
                                ach_aba_routing: res.data.carrier.ach_aba_routing,
                                ach_account_info: res.data.carrier.ach_account_info,
                                ach_banking_info: res.data.carrier.ach_banking_info,
                                ach_remittence_email: res.data.carrier.ach_remittence_email,
                                ach_type: res.data.carrier.ach_type,
                                wiring_aba_routing: res.data.carrier.wiring_aba_routing,
                                wiring_account_info: res.data.carrier.wiring_account_info,
                                wiring_banking_info: res.data.carrier.wiring_banking_info,
                                wiring_remittence_email: res.data.carrier.wiring_remittence_email,
                                wiring_type: res.data.carrier.wiring_type
                            }
                        });
                    }

                    if (props.owner === 'factoring-company') {
                        props.setSelectedOwner(selectedOwner => {
                            return {
                                ...selectedOwner,
                                ach_aba_routing: res.data.factoring_company.ach_aba_routing,
                                ach_account_info: res.data.factoring_company.ach_account_info,
                                ach_banking_info: res.data.factoring_company.ach_banking_info,
                                ach_remittence_email: res.data.factoring_company.ach_remittence_email,
                                ach_type: res.data.factoring_company.ach_type,
                                wiring_aba_routing: res.data.factoring_company.wiring_aba_routing,
                                wiring_account_info: res.data.factoring_company.wiring_account_info,
                                wiring_banking_info: res.data.factoring_company.wiring_banking_info,
                                wiring_remittence_email: res.data.factoring_company.wiring_remittence_email,
                                wiring_type: res.data.factoring_company.wiring_type
                            }
                        });
                    }

                    if (props.owner === 'agent') {
                        props.setSelectedOwner(selectedOwner => {
                            return {
                                ...selectedOwner,
                                ach_aba_routing: res.data.agent.ach_aba_routing,
                                ach_account_info: res.data.agent.ach_account_info,
                                ach_banking_info: res.data.agent.ach_banking_info,
                                ach_remittence_email: res.data.agent.ach_remittence_email,
                                ach_type: res.data.agent.ach_type,
                                wiring_aba_routing: res.data.agent.wiring_aba_routing,
                                wiring_account_info: res.data.agent.wiring_account_info,
                                wiring_banking_info: res.data.agent.wiring_banking_info,
                                wiring_remittence_email: res.data.agent.wiring_remittence_email,
                                wiring_type: res.data.agent.wiring_type
                            }
                        });
                    }
                }
            }).catch(e => {
                console.log('error saving ach/wiring info');
            }).finally(() => {
                setIsLoading(false);
                setIsEditing(false);
            });
        }
    }

    const buttonClasses = classnames({
        'mochi-button': true,
        'disabled': isLoading || !isEditing
    });

    const cancelButtonClasses = classnames({
        'mochi-button': true,
        'disabled': isLoading
    });

    const buttonClassesReverse = classnames({
        'mochi-button': true,
        'disabled': isLoading || isEditing
    });

    const inputBoxClasses = classnames({
        'input-box-container': true,
        'disabled': !isEditing
    })

    const inputRadioClasses = classnames({
        'input-radio-container': true,
        'disabled': !isEditing
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
        <div className="ach-wiring-info-content" tabIndex={0} ref={refACHWiringInfoContainer} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                props.closeModal();
            }
        }}>
            <div className="form-container">
                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">ACH Info</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={buttonClasses} onClick={() => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_banking_info: '',
                                        ach_account_info: '',
                                        ach_aba_routing: '',
                                        ach_remittence_email: '',
                                        ach_type: 'checking'
                                    }
                                });

                                refAchBankingInfo.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="Banking Info"
                            readOnly={!isEditing}
                            ref={refAchBankingInfo}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_banking_info: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.ach_banking_info || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="Account Info"
                            readOnly={!isEditing}
                            ref={refAchAccountInfo}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_account_info: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.ach_account_info || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="ABA/Routing"
                            readOnly={!isEditing}
                            ref={refAchAbaRouting}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_aba_routing: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.ach_aba_routing || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}
                        style={{ position: 'relative' }}
                        onMouseEnter={() => {
                            if ((selectedOwner?.ach_remittence_email || '') !== '') {
                                setShowAchRemittenceEmailBtn(true);
                            }
                        }}
                        onFocus={() => {
                            if ((selectedOwner?.ach_remittence_email || '') !== '') {
                                setShowAchRemittenceEmailBtn(true);
                            }
                        }}
                        onBlur={() => {
                            window.setTimeout(() => {
                                setShowAchRemittenceEmailBtn(false);
                            }, 1000);
                        }}
                        onMouseLeave={() => {
                            setShowAchRemittenceEmailBtn(false);
                        }}
                    >
                        <input type="text" placeholder="Remittence E-mail" style={{ textTransform: 'lowercase' }}
                            readOnly={!isEditing}
                            ref={refAchRemittenceEmail}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_remittence_email: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.ach_remittence_email || '')}
                        />
                        {
                            showAchRemittenceEmailBtn &&
                            <FontAwesomeIcon style={{
                                position: 'absolute',
                                top: '50%',
                                right: 5,
                                zIndex: 1,
                                cursor: 'pointer',
                                transform: 'translateY(-50%)',
                                color: '#2bc1ff',
                                margin: 0,
                                transition: 'ease 0.2s',
                                fontSize: '0.8rem'
                            }} icon={faCopy} onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(refAchRemittenceEmail.current.value);
                            }} />
                        }
                    </div>

                    <div className={inputRadioClasses}>
                        <input type="radio" id="fc-ach-type-checking"
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_type: e.target.checked ? 'checking' : 'saving'
                                    }
                                })
                            }}
                            checked={(selectedOwner?.ach_type || '') === 'checking'}
                        />
                        <label htmlFor="fc-ach-type-checking" style={{ marginLeft: 5 }}>Checking</label>
                    </div>

                    <div className={inputRadioClasses}>
                        <input type="radio" id="fc-ach-type-saving"
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        ach_type: e.target.checked ? 'saving' : 'checking'
                                    }
                                })
                            }}
                            checked={(selectedOwner?.ach_type || '') === 'saving'}
                        />
                        <label htmlFor="fc-ach-type-saving" style={{ marginLeft: 5 }}>Saving</label>
                    </div>

                </div>

                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Wiring Info</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className={buttonClasses} onClick={() => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_banking_info: selectedOwner?.ach_banking_info || '',
                                        wiring_account_info: selectedOwner?.ach_account_info || '',
                                        wiring_aba_routing: selectedOwner?.ach_aba_routing || '',
                                        wiring_remittence_email: selectedOwner?.ach_remittence_email || '',
                                        wiring_type: selectedOwner?.ach_type || 'checking'
                                    }
                                });

                                refWiringBankingInfo.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Same as above</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={buttonClasses} onClick={() => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_banking_info: '',
                                        wiring_account_info: '',
                                        wiring_aba_routing: '',
                                        wiring_remittence_email: '',
                                        wiring_type: 'checking'
                                    }
                                });

                                refWiringBankingInfo.current.focus();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Clear</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="Banking Info"
                            readOnly={!isEditing}
                            ref={refWiringBankingInfo}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_banking_info: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.wiring_banking_info || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="Account Info"
                            readOnly={!isEditing}
                            ref={refWiringAccountInfo}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_account_info: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.wiring_account_info || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}>
                        <input type="text" placeholder="ABA/Routing"
                            readOnly={!isEditing}
                            ref={refWiringAbaRouting}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_aba_routing: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.wiring_aba_routing || '')}
                        />
                    </div>

                    <div className={inputBoxClasses}
                        style={{ position: 'relative' }}
                        onMouseEnter={() => {
                            if ((selectedOwner?.wiring_remittence_email || '') !== '') {
                                setShowWiringRemittenceEmailBtn(true);
                            }
                        }}
                        onFocus={() => {
                            if ((selectedOwner?.wiring_remittence_email || '') !== '') {
                                setShowWiringRemittenceEmailBtn(true);
                            }
                        }}
                        onBlur={() => {
                            window.setTimeout(() => {
                                setShowWiringRemittenceEmailBtn(false);
                            }, 1000);
                        }}
                        onMouseLeave={() => {
                            setShowWiringRemittenceEmailBtn(false);
                        }}
                    >
                        <input type="text" placeholder="Remittence E-mail" style={{ textTransform: 'lowercase' }}
                            readOnly={!isEditing}
                            ref={refWiringRemittenceEmail}
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_remittence_email: e.target.value
                                    }
                                })
                            }}
                            value={(selectedOwner?.wiring_remittence_email || '')}
                        />
                        {
                            showWiringRemittenceEmailBtn &&
                            <FontAwesomeIcon style={{
                                position: 'absolute',
                                top: '50%',
                                right: 5,
                                zIndex: 1,
                                cursor: 'pointer',
                                transform: 'translateY(-50%)',
                                color: '#2bc1ff',
                                margin: 0,
                                transition: 'ease 0.2s',
                                fontSize: '0.8rem'
                            }} icon={faCopy} onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(refWiringRemittenceEmail.current.value);
                            }} />
                        }
                    </div>

                    <div className={inputRadioClasses}>
                        <input type="radio" id="fc-wiring-type-checking"
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_type: e.target.checked ? 'checking' : 'saving'
                                    }
                                })
                            }}
                            checked={(selectedOwner?.wiring_type || '') === 'checking'}
                        />
                        <label htmlFor="fc-wiring-type-checking" style={{ marginLeft: 5 }}>Checking</label>
                    </div>

                    <div className={inputRadioClasses}>
                        <input type="radio" id="fc-wiring-type-saving"
                            onChange={e => {
                                setSelectedOwner(selectedOwner => {
                                    return {
                                        ...selectedOwner,
                                        wiring_type: e.target.checked ? 'saving' : 'checking'
                                    }
                                })
                            }}
                            checked={(selectedOwner?.wiring_type || '') === 'saving'}
                        />
                        <label htmlFor="fc-wiring-type-saving" style={{ marginLeft: 5 }}>Saving</label>
                    </div>
                </div>
            </div>

            <div className="button-container" tabIndex={-1} onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}>
                <div className={cancelButtonClasses} onClick={() => {
                    props.closeModal();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Cancel</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={buttonClassesReverse} onClick={() => {
                    setIsEditing(true);
                    refAchBankingInfo.current.focus();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Edit</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={buttonClasses} onClick={updateOwner}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Update</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
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

})(ACHWiringInfo)