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

const ACHWiringInfo = (props) => {
    const [selectedOwner, setSelectedOwner] = useState({});
    const [isEditing, setIsEditing] = useState(false);

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

        refAchBankingInfo.current.focus({
            preventScroll: true
        })
    }, [])

    const updateOwner = () => {
        if ((selectedOwner?.id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + props.savingUrl, {
                factoring_company_id: selectedOwner.id,
                carrier_id: selectedOwner.id,
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
                                ...res.data.carrier
                            }
                        });
                    }

                    if (props.owner === 'factoring-company') {
                        props.setSelectedOwner(selectedOwner => {
                            return {
                                ...selectedOwner,
                                ...res.data.factoring_company
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

    return (
        <div className="ach-wiring-info-content" onKeyDown={e => {
            let key = e.keyCode || e.which;

            if (key === 27) {
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
                        style={{position: 'relative'}}
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
                    style={{position: 'relative'}}
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
        serverUrl: state.systemReducers.serverUrl
    }
}

export default connect(mapStateToProps, null)(ACHWiringInfo)