import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import './DispatchBillToForm.css';
import moment from 'moment';
import { SelectPhoneBox, TextInput } from '../../../controls';
import Customers from '../../customers/Customers';
import { RatingScreen } from '../../panels';

function DispatchBillToForm(props) {
    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Bill To</div>
                <div className="top-border top-border-middle"></div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                    <div className={`mochi-button${((props.selectedParent?.id || 0) === 0 || (props.selectedParent?.bill_to_customer_id || 0) > 0) ? ' disabled' : ''}`} onClick={() => {
                        searchBillToCompany();
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Search</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className={`mochi-button${(props.selectedParent?.bill_to_customer_id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                        let panel = {
                            panelName: `${props.panelName}-customer`,
                            component: (
                                <Customers
                                    pageName={"Customer"}
                                    title={"Bill-To Company"}
                                    panelName={`${props.panelName}-customer`}
                                    tabTimes={2000 + props.tabTimes}
                                    componentId={moment().format("x")}
                                    isOnPanel={true}
                                    isAdmin={props.isAdmin}
                                    origin={props.origin}
                                    customer_id={props.selectedParent?.bill_to_customer_id}
                                />
                            ),
                        };

                        openPanel(panel, props.origin);
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Company Info</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className={`mochi-button${(props.selectedParent?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                        let panel = {
                            panelName: `${props.panelName}-rating`,
                            component: (
                                <RatingScreen
                                    panelName={`${props.panelName}-rating`}
                                    title="Rating Screen"
                                    tabTimes={3400087 + props.tabTimes}
                                    componentId={moment().format("x")}
                                    origin={props.origin}
                                    selectedOrder={props.selectedParent}
                                    owner='template'
                                    callback={(data) => {
                                        if (data?.type === 'customer') {
                                            props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    order_customer_ratings: data.order_customer_ratings,
                                                    total_customer_rating: data.total_customer_rating
                                                }
                                            })
                                        } else {
                                            props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    order_carrier_ratings: data.order_carrier_ratings,
                                                    total_carrier_rating: data.total_carrier_rating
                                                }
                                            })
                                        }
                                    }}
                                />
                            ),
                        };

                        openPanel(panel, props.origin);
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Rate Load</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className={`mochi-button${(props.selectedParent?.id || 0) === 0 ? ' disabled' : ''}`} onClick={() => {
                        props.setSelectedParent(prev => {
                            return {
                                ...prev,
                                bill_to_customer_id: null,
                                bill_to_company: null,
                                bill_to_contact_id: null,
                                bill_to_contact_name: '',
                                bill_to_contact_phone: '',
                                bill_to_contact_primary_phone: 'work'
                            }
                        })

                        refBillToCode.current.focus();
                        setTimeout(() => { setIsSavingTemplate(true) }, 100);
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-wrapper">
                <div className="form-row">
                    <TextInput
                        refs={{
                            refInput: refBillToCode
                        }}
                        className='input-code'
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder='Code'
                        maxLength={8}
                        tabIndex={4 + props.tabTimes}
                        onKeyDown={(e) => {
                            let key = e.keyCode || e.which;

                            if (key === 9) {
                                getBillToCustomerByCode();
                            }
                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        code: e.target.value,
                                        code_number: 0
                                    }
                                }
                            })
                        }}
                        value={
                            (props.selectedParent?.bill_to_company?.code_number || 0) === 0
                                ? (props.selectedParent?.bill_to_company?.code || '')
                                : (props.selectedParent?.bill_to_company?.code || '') + props.selectedParent.bill_to_company.code_number
                        }
                    />

                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        placeholder='Name'
                        disabled={(props.selectedParent?.id || 0) === 0}
                        tabIndex={5 + props.tabTimes}
                        boxStyle={{
                            flexGrow: 1,

                        }}
                        inputStyle={{
                            textTransform: 'capitalize',

                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        name: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.name || '')}
                    />

                </div>
                <div className="form-row">
                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder='Address 1'
                        tabIndex={6 + props.tabTimes}
                        boxStyle={{
                            flexGrow: 1
                        }}
                        inputStyle={{
                            textTransform: 'capitalize'
                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        address1: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.address1 || '')}
                    />
                </div>
                <div className="form-row">
                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder='Address 2'
                        tabIndex={7 + props.tabTimes}
                        boxStyle={{
                            flexGrow: 1
                        }}
                        inputStyle={{
                            textTransform: 'capitalize'
                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        address2: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.address2 || '')}
                    />
                </div>
                <div className="form-row">
                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder='City'
                        tabIndex={8 + props.tabTimes}
                        boxStyle={{
                            flexGrow: 1
                        }}
                        inputStyle={{
                            textTransform: 'capitalize'
                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        city: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.city || '')}
                    />

                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        className='input-state'
                        placeholder='State'
                        tabIndex={9 + props.tabTimes}
                        maxLength={2}
                        inputStyle={{
                            textDecoration: 'uppercase'
                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        state: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.state || '')}
                    />

                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        className='input-zip-code'
                        placeholder='Postal Code'
                        tabIndex={10 + props.tabTimes}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_company: {
                                        ...(props.selectedParent?.bill_to_company || {}),
                                        zip: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.bill_to_company?.zip || '')}
                    />
                </div>
                <div className="form-row">
                    <SelectBox
                        className={'template-bill-to-contact-name'}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder="Contact Name"
                        popupId="template-bill-to-contact-name"
                        tabIndex={11 + props.tabTimes}
                        boxStyle={{
                            flexGrow: 1,
                        }}
                        inputStyle={{
                            textTransform: 'capitalize'
                        }}
                        refs={{
                            refInput: refBillToContactNames,
                            refPopupItems: refBillToContactNamePopupItems,
                            refDropdown: refBillToContactNameDropdown,
                        }}
                        readOnly={false}
                        isDropdownEnabled={(props.selectedParent?.bill_to_company?.id || 0) > 0 && (props.selectedParent?.bill_to_company?.contacts || []).length > 0}
                        popupPosition="vertical below right"
                        popupStyle={{
                            left: '0%'
                        }}
                        onEnter={e => {
                            if (billToContactNameItems.length > 0 && billToContactNameItems.findIndex(item => item.selected) > -1) {
                                let item = billToContactNameItems[billToContactNameItems.findIndex(item => item.selected)];

                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_id: item.id,
                                        bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                        bill_to_contact_phone: item.id === props.selectedParent?.bill_to_contact_id
                                            ? props.selectedParent?.bill_to_contact_phone
                                            : (item?.primary_phone || '') === 'work'
                                                ? item?.phone_work || ''
                                                : (item?.primary_phone || '') === 'fax'
                                                    ? item?.phone_work_fax || ''
                                                    : (item?.primary_phone || '') === 'mobile'
                                                        ? item?.phone_mobile || ''
                                                        : (item?.primary_phone || '') === 'direct'
                                                            ? item?.phone_direct || ''
                                                            : (item?.primary_phone || '') === 'other'
                                                                ? item?.phone_other || ''
                                                                : '',
                                        bill_to_contact_primary_phone: item.id === props.selectedParent?.bill_to_contact_id
                                            ? props.selectedParent?.bill_to_contact_primary_phone
                                            : item?.primary_phone || ''
                                    }
                                })

                                setBillToContactNameItems([]);
                                refBillToContactNames.current.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }
                        }}
                        onTab={e => {
                            if (billToContactNameItems.length > 0 && billToContactNameItems.findIndex(item => item.selected) > -1) {
                                let item = billToContactNameItems[billToContactNameItems.findIndex(item => item.selected)];

                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_id: item.id,
                                        bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                        bill_to_contact_phone: item.id === props.selectedParent?.bill_to_contact_id
                                            ? props.selectedParent?.bill_to_contact_phone
                                            : (item?.primary_phone || '') === 'work'
                                                ? item?.phone_work || ''
                                                : (item?.primary_phone || '') === 'fax'
                                                    ? item?.phone_work_fax || ''
                                                    : (item?.primary_phone || '') === 'mobile'
                                                        ? item?.phone_mobile || ''
                                                        : (item?.primary_phone || '') === 'direct'
                                                            ? item?.phone_direct || ''
                                                            : (item?.primary_phone || '') === 'other'
                                                                ? item?.phone_other || ''
                                                                : '',
                                        bill_to_contact_primary_phone: item.id === props.selectedParent?.bill_to_contact_id
                                            ? props.selectedParent?.bill_to_contact_primary_phone
                                            : item?.primary_phone || ''
                                    }
                                })

                                setBillToContactNameItems([]);
                                refBillToContactNames.current.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }
                        }}
                        onBlur={e => {
                            let contact = (props.selectedParent?.bill_to_company?.contacts || []).find(x => ((x.first_name || '') + ' ' + (x.last_name)).trim().toLowerCase() === (props.selectedParent?.bill_to_contact_name || '').trim().toLowerCase());

                            if (contact) {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_id: contact?.id
                                    }
                                })
                            } else {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_id: null,
                                        bill_to_contact_name: '',
                                        bill_to_contact_phone: '',
                                        bill_to_contact_primary_phone: ''
                                    }
                                })
                            }
                        }}
                        onInput={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: null,
                                    bill_to_contact_name: e.target.value,
                                    bill_to_contact_phone: '',
                                    bill_to_contact_primary_phone: ''
                                }
                            })

                            if (e.target.value.trim() === "") {
                                setBillToContactNameItems([]);
                            } else {
                                setBillToContactNameItems((props.selectedParent?.bill_to_company?.contacts || []).filter(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase().startsWith((props.selectedParent?.bill_to_contact_name || '').trim().toLowerCase())).map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                }))
                            }
                        }}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: null,
                                    bill_to_contact_name: e.target.value,
                                    bill_to_contact_phone: '',
                                    bill_to_contact_primary_phone: ''
                                }
                            })
                        }}
                        value={props.selectedParent?.bill_to_contact_name || ""}
                        items={billToContactNameItems}
                        getItems={() => {
                            let selectedIndex = (props.selectedParent?.bill_to_company?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (props.selectedParent?.bill_to_contact_name || '').trim().toLowerCase());

                            if (selectedIndex > -1) {
                                setBillToContactNameItems((props.selectedParent?.bill_to_company?.contacts || []).map((item, index) => {
                                    item.selected = index === selectedIndex;
                                    return item;
                                }))
                            } else {
                                setBillToContactNameItems((props.selectedParent?.bill_to_company?.contacts || []).map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                }))
                            }

                            window.setTimeout(() => {
                                refBillToContactNamePopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }, 10)

                        }}
                        setItems={setBillToContactNameItems}
                        onDropdownClick={e => {
                            window.setTimeout(() => {
                                let selectedIndex = (props.selectedParent?.bill_to_company?.contacts || []).findIndex(x => ((x?.first_name || '') + ' ' + (x?.last_name || '')).trim().toLowerCase() === (props.selectedParent?.bill_to_contact_name || '').trim().toLowerCase());

                                if (selectedIndex > -1) {
                                    setBillToContactNameItems((props.selectedParent?.bill_to_company?.contacts || []).map((item, index) => {
                                        item.selected = index === selectedIndex;
                                        return item;
                                    }))
                                } else {
                                    setBillToContactNameItems((props.selectedParent?.bill_to_company?.contacts || []).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    }))
                                }

                                refBillToContactNamePopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }, 100)
                        }}
                        onPopupClick={item => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_name: (item?.first_name || '') + ' ' + (item?.last_name || ''),
                                    bill_to_contact_id: item?.id,
                                    bill_to_contact_phone: item.id === props.selectedParent?.bill_to_contact_id
                                        ? props.selectedParent?.bill_to_contact_phone
                                        : (item?.primary_phone || '') === 'work'
                                            ? item?.phone_work || ''
                                            : (item?.primary_phone || '') === 'fax'
                                                ? item?.phone_work_fax || ''
                                                : (item?.primary_phone || '') === 'mobile'
                                                    ? item?.phone_mobile || ''
                                                    : (item?.primary_phone || '') === 'direct'
                                                        ? item?.phone_direct || ''
                                                        : (item?.primary_phone || '') === 'other'
                                                            ? item?.phone_other || ''
                                                            : '',
                                    bill_to_contact_primary_phone: item.id === props.selectedParent?.bill_to_contact_id
                                        ? props.selectedParent?.bill_to_contact_primary_phone
                                        : item?.primary_phone || ''
                                }
                            })

                            setBillToContactNameItems([]);
                            refBillToContactNames.current.focus();
                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                        }}
                        labelType='contact_first_last'
                    />

                    <SelectPhoneBox
                        className={'input-phone'}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        placeholder="Contact Phone"
                        popupId="template-bill-to-contact-phone"
                        tabIndex={12 + props.tabTimes}
                        boxStyle={{
                            width: '10.25rem',
                        }}
                        refs={{
                            refInput: refBillToContactPhones,
                            refPopupItems: refBillToContactPhonePopupItems,
                            refDropdown: refBillToContactPhoneDropdown,
                        }}
                        isDropdownEnabled={(props.selectedParent?.bill_to_company?.id || 0) > 0 && (props.selectedParent?.bill_to_contact_id || 0) > 0}
                        popupPosition="vertical below right"
                        popupStyle={{
                            left: '0%'
                        }}
                        onEnter={e => {
                            if (showBillToContactPhones && billToContactPhoneItems.findIndex(item => item.selected) > -1) {
                                let item = billToContactPhoneItems[billToContactPhoneItems.findIndex(item => item.selected)];

                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_primary_phone: item.type,
                                        bill_to_contact_phone: item.phone
                                    }
                                })

                                setShowBillToContactPhones(false);
                                refBillToContactPhones.current.inputElement.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }
                        }}
                        onTab={async e => {
                            if (showBillToContactPhones && billToContactPhoneItems.findIndex(item => item.selected) > -1) {
                                let item = billToContactPhoneItems[billToContactPhoneItems.findIndex(item => item.selected)];

                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_primary_phone: item.type,
                                        bill_to_contact_phone: item.phone
                                    }
                                })

                                setShowBillToContactPhones(false);
                                refBillToContactPhones.current.inputElement.focus();
                                setTimeout(() => { setIsSavingTemplate(true) }, 100);
                            }
                        }}
                        onBlur={e => {
                            let phone = billToContactPhoneItems.find(x => x.phone === props.selectedParent?.bill_to_contact_phone);

                            if (phone) {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_primary_phone: phone.type
                                    }
                                })
                            } else {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_primary_phone: '',
                                        bill_to_contact_phone: ''
                                    }
                                })
                            }
                        }}
                        onInput={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    _bill_to_contact_phone: ''
                                }
                            })
                        }}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    _bill_to_contact_phone: ''
                                }
                            })
                        }}
                        value={props.selectedParent?.bill_to_contact_phone || ""}
                        items={billToContactPhoneItems}
                        getItems={() => {
                            let selectedIndex = (billToContactPhoneItems || []).findIndex(x => x.phone === props.selectedParent?.bill_to_contact_phone);

                            if (selectedIndex > 0) {
                                setBillToContactPhoneItems(billToContactPhoneItems.map((item, index) => {
                                    item.selected = index === selectedIndex;
                                    return item;
                                }))
                            } else {
                                setBillToContactPhoneItems(billToContactPhoneItems.map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                }))
                            }

                            window.setTimeout(() => {
                                setShowBillToContactPhones(true);

                                refBillToContactPhonePopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }, 50)
                        }}
                        setItems={setBillToContactPhoneItems}
                        onDropdownClick={e => {
                            if (showBillToContactPhones) {
                                setShowBillToContactPhones(false);
                            } else {
                                setBillToContactPhoneItems((billToContactPhoneItems || []).map((item, index) => {
                                    item.selected = item.phone === props.selectedParent?.bill_to_contact_phone;
                                    return item;
                                }))

                                window.setTimeout(() => {
                                    setShowBillToContactPhones(true);

                                    refBillToContactPhonePopupItems.current.map((r, i) => {
                                        if (r && r.classList.contains("selected")) {
                                            r.scrollIntoView({
                                                behavior: "auto",
                                                block: "center",
                                                inline: "nearest",
                                            });
                                        }
                                        return true;
                                    });
                                }, 100)
                            }
                        }}
                        onPopupClick={item => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_phone: item.phone,
                                    bill_to_contact_primary_phone: item.type
                                }
                            })

                            setShowBillToContactPhones(false);
                            refBillToContactPhones.current.inputElement.focus();
                            setTimeout(() => { setIsSavingTemplate(true) }, 100);
                        }}
                        isShowing={showBillToContactPhones}
                        setIsShowing={setShowBillToContactPhones}
                        primaryPhone={props.selectedParent?.bill_to_contact_primary_phone || ''}
                    />

                    <TextInput
                        refs={{
                            refInput: null
                        }}
                        disabled={(props.selectedParent?.id || 0) === 0}
                        className='input-state'
                        placeholder='Ext'
                        tabIndex={13 + props.tabTimes}
                        onKeyDown={(e) => {

                        }}
                        onChange={(e) => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    _bill_to_contact_phone_ext: ''
                                }
                            })
                        }}
                        value={
                            (props.selectedParent?.bill_to_contact_id || 0) > 0 && (props.selectedParent?.bill_to_contact_primary_phone || '') === 'work'
                                ? (props.selectedParent?.bill_to_company?.contacts || []).find(x => x.id === props.selectedParent?.bill_to_contact_id)?.phone_ext || ''
                                : ''
                        }
                    />
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(DispatchBillToForm)