import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './ContactList.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';

function ContactList(props) {
    const {
        refContactSearchFirstName,
        refContactNotes,
        refParentMailingCode
    } = props.refs;

    const [contactSearch, setContactSearch] = useState({});

    

    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                    {
                        props.showingContactList &&
                        <div className="mochi-button" onClick={() => {
                            props.setShowingContactList(false);
                            refContactSearchFirstName.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Search</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    }
                    {
                        !props.showingContactList &&
                        <div className="mochi-button" onClick={() => {
                            props.setShowingContactList(true);
                            refContactNotes.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Cancel</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    }

                    {
                        !props.showingContactList &&
                        <div className="mochi-button" onClick={props.searchContactBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Send</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    }
                </div>
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-slider">
                <div className="form-slider-wrapper" style={{ left: props.showingContactList ? 0 : '-100%' }}>
                    <div className="contact-list-box">
                        {
                            (props.selectedParent?.contacts || []).length > 0 &&
                            <div className="contact-list-header">
                                <div className="contact-list-col tcol first-name">First Name</div>
                                <div className="contact-list-col tcol last-name">Last Name</div>
                                <div className="contact-list-col tcol phone-work">Phone</div>
                                <div className="contact-list-col tcol email-work">E-Mail</div>
                                <div className="contact-list-col tcol contact-selected"></div>
                                <div className="contact-list-col tcol pri"></div>
                            </div>
                        }

                        <div className="contact-list-wrapper">
                            {
                                (props.selectedParent?.contacts || []).map((contact, index) => {
                                    return (
                                        <div className="contact-list-item" key={index}
                                            onDoubleClick={async () => {
                                                props.contactListItemDoubleClick(contact)
                                            }} onClick={() => props.setSelectedContact(contact)}>
                                            <div className="contact-list-col tcol first-name" style={{ textTransform: 'capitalize' }}>{contact.first_name}</div>
                                            <div className="contact-list-col tcol last-name" style={{ textTransform: 'capitalize' }}>{contact.last_name}</div>
                                            <div className="contact-list-col tcol phone-work">{
                                                contact.primary_phone === 'work' ? contact.phone_work
                                                    : contact.primary_phone === 'fax' ? contact.phone_work_fax
                                                        : contact.primary_phone === 'mobile' ? contact.phone_mobile
                                                            : contact.primary_phone === 'direct' ? contact.phone_direct
                                                                : contact.primary_phone === 'other' ? contact.phone_other
                                                                    : ''
                                            }</div>
                                            <div className="contact-list-col tcol email-work" style={{ textTransform: 'lowercase' }}>{
                                                contact.primary_email === 'work' ? contact.email_work
                                                    : contact.primary_email === 'personal' ? contact.email_personal
                                                        : contact.primary_email === 'other' ? contact.email_other
                                                            : ''
                                            }</div>
                                            {
                                                (contact.id === (props.selectedContact?.id || 0)) &&
                                                <div className="contact-list-col tcol contact-selected">
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </div>
                                            }
                                            {
                                                (contact.pivot)
                                                    ? (contact?.pivot?.is_primary || 0) === 1 &&
                                                    <div className="contact-list-col tcol pri">
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </div>
                                                    : (contact?.is_primary || 0) === 1 &&
                                                    <div className="contact-list-col tcol pri">
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                    <div className="contact-search-box">
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="First Name"
                                    tabIndex={50 + props.tabTimes}
                                    ref={refContactSearchFirstName}
                                    onKeyDown={e => {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            if (e.shiftKey) {
                                                e.preventDefault();
                                                props.setShowingContactList(true);
                                                refContactNotes.current.focus();
                                            }
                                        }
                                    }}
                                    onChange={e => setContactSearch({
                                        ...contactSearch,
                                        first_name: e.target.value
                                    })} value={contactSearch.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Last Name"
                                    tabIndex={51 + props.tabTimes}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        last_name: e.target.value
                                    })} value={contactSearch.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 1" style={{ textTransform: 'capitalize' }}
                                    tabIndex={52 + props.tabTimes}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        address1: e.target.value
                                    })} value={contactSearch.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 2" style={{ textTransform: 'capitalize' }}
                                    tabIndex={53 + props.tabTimes}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        address2: e.target.value
                                    })} value={contactSearch.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="City"
                                    tabIndex={54 + props.tabTimes}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        city: e.target.value
                                    })} value={contactSearch.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input type="text" placeholder="State" maxLength="2"
                                    tabIndex={55 + props.tabTimes}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        state: e.target.value
                                    })} value={contactSearch.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <MaskedInput
                                    tabIndex={56 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Phone (Work/Mobile/Fax)"
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }} onChange={e => setContactSearch({
                                        ...contactSearch,
                                        phone: e.target.value
                                    })} value={contactSearch.phone || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="E-Mail"
                                    tabIndex={57 + props.tabTimes}
                                    style={{ textTransform: 'lowercase' }}
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            e.preventDefault();
                                            props.setShowingContactList(true)
                                            refParentMailingCode.current.focus();
                                        }
                                    }}
                                    onFocus={() => {
                                        props.setShowingContactList(false)
                                    }}
                                    onChange={e => setContactSearch({
                                        ...contactSearch,
                                        email: e.target.value
                                    })}
                                    value={contactSearch.email || ''} />
                            </div>
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
        user: state.systemReducers.user
    }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(ContactList)