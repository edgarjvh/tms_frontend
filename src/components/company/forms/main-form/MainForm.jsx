import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import './MainForm.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";

function MainForm(props) {    
    const [showParentEmailCopyBtn, setShowParentEmailCopyBtn] = useState(false);
    const { refCode, refName, refEmail } = props.refs;   
       
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
                <div className="input-box-container input-code">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 0} type="text" placeholder="Code" maxLength="8"
                        id="txt-parent-code"
                        ref={refCode}
                        onKeyDown={props.searchByCode}
                        onInput={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                code: e.target.value,
                                code_number: 0
                            })
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                code: e.target.value,
                                code_number: 0
                            })
                        }}
                        value={(props.selectedParent.code_number || 0) === 0 ? (props.selectedParent.code || '') : props.selectedParent.code + props.selectedParent.code_number} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 1} type="text" placeholder="Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        ref={refName}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            name: e.target.value
                        })}
                        value={props.selectedParent?.name || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 2} type="text" placeholder="Address 1" style={{ textTransform: 'capitalize' }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            address1: e.target.value
                        })}
                        value={props.selectedParent?.address1 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 3} type="text" placeholder="Address 2" style={{ textTransform: 'capitalize' }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            address2: e.target.value
                        })}
                        value={props.selectedParent?.address2 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 4} type="text" placeholder="City"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            city: e.target.value
                        })}
                        value={props.selectedParent?.city || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-state">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 5} type="text" placeholder="State" maxLength="2"
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            state: e.target.value
                        })}
                        value={props.selectedParent?.state || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-zip-code">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 6} type="text" placeholder="Postal Code"
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onKeyDown={props.validateForSaving}
                        onChange={e => props.setSelectedParent({
                            ...props.selectedParent,
                            zip: e.target.value
                        })}
                        value={props.selectedParent?.zip || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 7} type="text" placeholder="Contact Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onInput={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({
                                    ...props.selectedParent,
                                    contact_name: e.target.value
                                })
                            }
                        }}
                        onChange={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({
                                    ...props.selectedParent,
                                    contact_name: e.target.value
                                })
                            }
                        }}
                        value={
                            (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                ? (((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.first_name || '') + ' ' +
                                    ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.last_name || '')).trim()
                                : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                    ? (props.selectedParent?.contact_name || '')
                                    // ? ''
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).first_name + ' ' + props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).last_name

                        }
                    />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                    <MaskedInput
                        tabIndex={props.tabTimesFrom + props.tabTimes + 8}
                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        guide={true}
                        type="text" placeholder="Contact Phone"
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onInput={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({
                                    ...props.selectedParent,
                                    contact_phone: e.target.value
                                })
                            }
                        }}
                        onChange={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({
                                    ...props.selectedParent,
                                    contact_phone: e.target.value
                                })
                            }
                        }}
                        value={
                            (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone === 'work'
                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_work
                                    : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone === 'fax'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_work_fax
                                        : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone === 'mobile'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_mobile
                                            : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone === 'direct'
                                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_direct
                                                : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone === 'other'
                                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_other
                                                    : ''
                                : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                    ? (props.selectedParent?.contact_phone || '')
                                    // ? ''
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone === 'work'
                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_work
                                        : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone === 'fax'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_work_fax
                                            : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone === 'mobile'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_mobile
                                                : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone === 'direct'
                                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_direct
                                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone === 'other'
                                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_other
                                                        : ''

                        }
                    />

                    {
                        ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1) ||
                            ((props.selectedParent?.contacts || []).find(c => c.is_primary === 1) !== undefined)) &&
                        <div
                            className={classnames({
                                'selected-parent-contact-primary-phone': true,
                                'pushed': false
                            })}>
                            {
                                (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                    ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone
                            }
                        </div>
                    }
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-phone-ext">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 9} type="text" placeholder="Ext"
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onInput={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({ ...props.selectedParent, ext: e.target.value })
                            }
                        }}
                        onChange={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({ ...props.selectedParent, ext: e.target.value })
                            }
                        }}
                        value={
                            (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                ? ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_phone || 'work') === 'work'
                                    ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1).phone_ext
                                    : ''
                                : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                    ? (props.selectedParent?.ext || '')
                                    // ? ''
                                    : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'work'
                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).phone_ext
                                        : ''

                        }
                    />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row" style={{
                display: props.withEmail ? 'flex' : 'none'
            }}>
                <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}
                    onMouseEnter={() => {
                        if ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'work'
                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_work
                                : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'personal'
                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_personal
                                    : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'other'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_other
                                        : ''
                            : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                ? (props.selectedParent?.email || '')
                                // ? ''
                                : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'work'
                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_work
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'personal'
                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_personal
                                        : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'other'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_other
                                            : '' !== '') {
                            setShowParentEmailCopyBtn(true);
                        }
                    }}
                    onFocus={() => {
                        if ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'work'
                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_work
                                : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'personal'
                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_personal
                                    : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'other'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_other
                                        : ''
                            : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                ? (props.selectedParent?.email || '')
                                // ? ''
                                : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'work'
                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_work
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'personal'
                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_personal
                                        : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'other'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_other
                                            : '' !== '') {
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
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 10}
                        ref={refEmail}
                        type="text"
                        placeholder="E-Mail"
                        style={{ textTransform: 'lowercase' }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                        }
                        onKeyDown={props.validateForSaving}
                        onInput={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({ ...props.selectedParent, email: e.target.value })
                            }
                        }}
                        onChange={(e) => {
                            if ((props.selectedParent?.contacts || []).length === 0) {
                                props.setSelectedParent({ ...props.selectedParent, email: e.target.value })
                            }
                        }}
                        value={
                            (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'work'
                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_work
                                    : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'personal'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_personal
                                        : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email === 'other'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1).email_other
                                            : ''
                                : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                    ? (props.selectedParent?.email || '')
                                    // ? ''
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'work'
                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_work
                                        : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'personal'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_personal
                                            : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email === 'other'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).email_other
                                                : ''
                        }
                    />
                    {
                        ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1) ||
                            ((props.selectedParent?.contacts || []).find(c => c.is_primary === 1) !== undefined)) &&
                        <div
                            className={classnames({
                                'selected-parent-contact-primary-email': true,
                                'pushed': false
                            })}>
                            {
                                (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                    ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1).primary_email
                                    : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_email
                            }
                        </div>
                    }

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

export default connect(mapStateToProps, null, null, { forwardRef: true })(MainForm)