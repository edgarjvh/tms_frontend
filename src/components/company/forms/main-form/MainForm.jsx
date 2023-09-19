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
    const { refCode, refName, refEmail, refFieldLastTab } = props.refs;

    return (
        <div className="form-bordered-box" style={{ gap: 2 }}>
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

            {
                ['code', 'name'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('code') &&
                        <div className="input-box-container input-code">
                            <input tabIndex={props.tabTimesFrom + props.tabTimes + 0} type="text" placeholder="Code" maxLength="8"
                                id="txt-parent-code"
                                ref={refCode}
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        props.searchByCode(e);
                                    }
                                }}
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
                    }

                    {
                        (props.fields || []).includes('name') &&
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
                    }
                </div>
            }

            {
                ['address1'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('address1') &&
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
                    }
                </div>
            }

            {
                ['address2'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('address2') &&
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
                    }
                </div>
            }

            {
                ['city', 'state', 'zip'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('city') &&
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
                    }

                    {
                        (props.fields || []).includes('state') &&
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
                    }

                    {
                        (props.fields || []).includes('zip') &&
                        <div className="input-box-container input-zip-code" style={{ width: 'calc(100% - 55% - 2.7rem)' }}>
                            <input tabIndex={props.tabTimesFrom + props.tabTimes + 6} type="text" placeholder="Postal Code"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                                }
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        if ((props.triggerFields || []).includes('zip')) {
                                            props.validateForSaving(e);
                                        }
                                    }
                                }}
                                onChange={e => props.setSelectedParent({
                                    ...props.selectedParent,
                                    zip: e.target.value
                                })}
                                value={props.selectedParent?.zip || ''} />
                        </div>
                    }
                </div>
            }

            {
                ['contact', 'phone', 'ext'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('contact') &&
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
                                            : ((props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.first_name || '') + ' ' + (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.last_name || '')).trim()

                                }
                            />
                        </div>
                    }

                    {
                        (props.fields || []).includes('phone') &&
                        <div className="input-box-container input-phone" style={{ position: 'relative', width: 'calc(100% - 55% - 2.7rem)' }}>
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
                                        ? (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.prary_phone || 'work') === 'work'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_work || ''
                                            : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || 'work') === 'fax'
                                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_work_fax || ''
                                                : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || 'work') === 'mobile'
                                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_mobile || ''
                                                    : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || 'work') === 'direct'
                                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_direct || ''
                                                        : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || 'work') === 'other'
                                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_other || ''
                                                            : ''
                                        : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                            ? (props.selectedParent?.contact_phone || '')
                                            // ? ''
                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'work'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_work || ''
                                                : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'fax'
                                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_work_fax || ''
                                                    : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'mobile'
                                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_mobile || ''
                                                        : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'direct'
                                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_direct || ''
                                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined).primary_phone || 'work') === 'other'
                                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_other || ''
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
                                            ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || ''
                                            : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_phone || ''
                                    }
                                </div>
                            }
                        </div>
                    }

                    {
                        (props.fields || []).includes('ext') &&
                        <div className="input-box-container input-phone-ext">
                            <input tabIndex={props.tabTimesFrom + props.tabTimes + 9} type="text" placeholder="Ext"
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                                }
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        if ((props.triggerFields || []).includes('ext')) {
                                            props.validateForSaving(e);
                                        }
                                    }
                                }}
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
                                        ? ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_phone || 'work') === 'work'
                                            ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.phone_ext || ''
                                            : ''
                                        : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                            ? (props.selectedParent?.ext || '')
                                            // ? ''
                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_phone || 'work') === 'work'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.phone_ext || ''
                                                : ''

                                }
                            />
                        </div>
                    }
                </div>
            }

            {
                ['email', 'notes'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{ gap: 2 }}>
                    {
                        (props.fields || []).includes('email') &&
                        <div className="input-box-container grow" style={{ position: 'relative', minWidth: 'calc(100% - 45% - 4px)' }}
                            onMouseEnter={() => {
                                if ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                    ? (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'work'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_work || ''
                                        : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'personal'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_personal || ''
                                            : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'other'
                                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_other || ''
                                                : ''
                                    : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                        ? (props.selectedParent?.email || '')
                                        // ? ''
                                        : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'work'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_work || ''
                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'personal'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_personal || ''
                                                : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'other'
                                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_other || ''
                                                    : '' !== '') {
                                    setShowParentEmailCopyBtn(true);
                                }
                            }}
                            onFocus={() => {
                                if ((props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)
                                    ? (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'work'
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_work || ''
                                        : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'personal'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_personal || ''
                                            : (props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work') === 'other'
                                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_other || ''
                                                : ''
                                    : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                        ? (props.selectedParent?.email || '')
                                        // ? ''
                                        : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'work'
                                            ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_work || ''
                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'personal'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_personal || ''
                                                : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'other'
                                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_other || ''
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
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        if ((props.triggerFields || []).includes('email')) {
                                            props.validateForSaving(e);                                            
                                        }else{
                                            if (refFieldLastTab){
                                                if ((props.fields || [])[props.fields.length - 1] === 'email'){
                                                    e.preventDefault();
                                                    refFieldLastTab.current.focus();
                                                }
                                            }
                                        }
                                    }
                                }}
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
                                        ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work' === 'work'
                                            ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_work || ''
                                            : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work' === 'personal'
                                                ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_personal || ''
                                                : props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || 'work' === 'other'
                                                    ? props.selectedParent?.contacts.find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.email_other || ''
                                                    : ''
                                        : (props.selectedParent?.contacts || []).find(c => c.is_primary === 1 && c.pivot === undefined) === undefined
                                            ? (props.selectedParent?.email || '')
                                            // ? ''
                                            : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'work'
                                                ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_work || ''
                                                : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'personal'
                                                    ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_personal || ''
                                                    : (props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || 'work') === 'other'
                                                        ? props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.email_other || ''
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
                                            ? (props.selectedParent?.contacts || []).find(x => ((x?.pivot || {})?.is_primary || 0) === 1)?.primary_email || ''
                                            : props.selectedParent?.contacts.find(c => c.is_primary === 1 && c.pivot === undefined)?.primary_email || ''
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
                    }

                    {
                        (props.fields || []).includes('notes') &&
                        <div className="input-box-container grow">
                            <input tabIndex={props.tabTimesFrom + props.tabTimes + 11} type="text" placeholder="Notes"
                                style={{
                                    textTransform: 'capitalize'
                                }}
                                readOnly={
                                    (props.user?.user_code?.is_admin || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.parentInfoPermission)?.pivot?.edit || 0) === 0
                                }
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 9) {
                                        if ((props.triggerFields || []).includes('notes')) {
                                            props.validateForSaving(e);                                            
                                        }else{
                                            if (refFieldLastTab){
                                                if ((props.fields || [])[props.fields.length - 1] === 'notes'){
                                                    e.preventDefault();
                                                    refFieldLastTab.current.focus();
                                                }
                                            }
                                        }
                                    }
                                }}
                                onChange={e => props.setSelectedParent({
                                    ...props.selectedParent,
                                    notes: e.target.value
                                })}
                                value={props.selectedParent?.notes || ''} />
                        </div>
                    }
                </div>
            }

            {
                ['email_driver_btn'].some(x => (props.fields || []).includes(x)) &&
                <div className="form-row" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    flexGrow: 1,
                    paddingBottom: 10,
                }}
                >
                    <div className={(props.user?.user_code?.is_admin || 0) === 0 && ((props.user?.user_code?.permissions || []).find(x => x.name === "carrier drivers")?.pivot?.save || 0) === 0 && ((props.user?.user_code?.permissions || []).find(x => x.name === "carrier drivers")?.pivot?.edit || 0) === 0 ? "mochi-button disabled" : "mochi-button"}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">E-Mail Driver</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
            }
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