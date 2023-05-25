import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import './EmergencyContactForm.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";

function EmergencyContactForm(props) {
    const [showParentEmailCopyBtn, setShowParentEmailCopyBtn] = useState(false);
    const { refName, refEmail } = props.refs;
    
    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                {
                    (props.formTitle || '') !== '' &&
                    <div className="form-title">{props.formTitle}</div>
                }
                <div className="top-border top-border-middle"></div>
                {
                    (props.formButtons || []).length > 0 &&
                    <div className="form-buttons">
                        {
                            (props.formButtons || []).map((item, index) => {
                                if (item.isEnabled) {
                                    return (
                                        <div className="mochi-button" onClick={item.onClick} key={index}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">{item.title}</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    )
                                } else {
                                    return ''
                                }
                            })
                        }
                    </div>
                }
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 0} type="text" placeholder="Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        ref={refName}
                        id="txt-parent-name"
                        onKeyDown={props.searchByCode}
                        onInput={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    name: e.target.value
                                }
                            })
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    name: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.name || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 1} type="text" placeholder="Relationship"
                        style={{
                            textTransform: 'capitalize'
                        }}

                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    relationship: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.relationship || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 2} type='number' placeholder="Priority" min={1} max={10} maxLength={2}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    priority: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.priority || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 3} type="text" placeholder="Address 1" style={{ textTransform: 'capitalize' }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    address1: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.address1 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 4} type="text" placeholder="Address 2" style={{ textTransform: 'capitalize' }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    address2: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.address2 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 5} type="text" placeholder="City"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    city: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.city || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-state">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 6} type="text" placeholder="State" maxLength="2"
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    state: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.state || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-zip-code">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 7} type="text" placeholder="Postal Code"                        
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    zip: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.zip || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container input-phone" style={{ position: 'relative', width: 'calc(100% - 13.1rem)' }}>
                    <MaskedInput
                        tabIndex={props.tabTimesFrom + props.tabTimes + 8}
                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        guide={true}
                        type="text" placeholder="Contact Phone"
                        onInput={(e) => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    contact_phone: e.target.value
                                }
                            })
                        }}
                        onChange={(e) => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    contact_phone: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.contact_phone || ''} />                    
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}
                    onMouseEnter={() => {
                        if ((props.selectedParent?.emergencyContact?.contact_phone || '') !== '') {
                            setShowParentEmailCopyBtn(true);
                        }
                    }}
                    onFocus={() => {
                        if ((props.selectedParent?.emergencyContact?.contact_phone || '') !== '') {
                            setShowParentEmailCopyBtn(true);
                        }
                    }}
                    onBlur={() => {
                        window.setTimeout(() => {
                            setShowParentEmailCopyBtn(false);
                        }, 1000);
                    }}
                    onMouseLeave={() => {
                        setShowParentEmailCopyBtn(false);
                    }}
                >
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 9}
                        ref={refEmail}
                        type="text"
                        placeholder="E-Mail"
                        style={{ textTransform: 'lowercase' }}
                        onKeyDown={props.validateForSaving}
                        onInput={(e) => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    email: e.target.value
                                }
                            })
                        }}
                        onChange={(e) => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                emergencyContact: {
                                    ...props.selectedParent || {},
                                    email: e.target.value
                                }
                            })
                        }}
                        value={props.selectedParent?.emergencyContact?.email || ''} />        
                    
                    {
                        showParentEmailCopyBtn &&
                        <FontAwesomeIcon style={{
                            position: 'absolute',
                            top: '50%',
                            right: 30,
                            zIndex: 1,
                            cursor: 'pointer',
                            transform: 'translateY(-50%)',
                            color: '#2bc1ff',
                            margin: 0,
                            transition: 'ease 0.2s',
                            fontSize: '1rem'
                        }} icon={faCopy} onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(refEmail.current.value);
                        }} />
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user
    }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(EmergencyContactForm)