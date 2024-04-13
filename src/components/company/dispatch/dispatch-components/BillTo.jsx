import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {Customers} from "../../index";
import moment from "moment/moment";
import {CustomerSearch, RatingScreen} from "../../panels";
import axios from "axios";
import MaskedInput from "react-text-mask";
import classnames from "classnames";
import {SelectBox, SelectPhoneBox} from "../../../controls";
import {useDetectClickOutside} from "react-detect-click-outside";

const BillTo = (
    {
        selectedOrder,
        selectedBillToCustomer,
        setSelectedOrder,
        setSelectedBillToCustomer,
        refs,
        user,
        isLoading,
        setIsLoading,
        tabTimes,
        contactId,
        contactName,
        contactPhone,
        contactPrimaryPhone,
        openPanel,
        closePanel
    }
) => {
    const [contactNameItems, setContactNameItems] = useState([]);
    const [contactPhoneItems, setContactPhoneItems] = useState([]);
    const [showContactPhoneItems, setShowContactPhoneItems] = useState(false);

    const refContactName = useRef();
    const refContactNamePopupItems = useRef([]);
    const refContactNameDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setContactNameItems([])
        }
    });

    const refContactPhone = useRef();
    const refContactPhonePopupItems = useRef([]);
    const refContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowContactPhoneItems(false)
        }
    });

    const refContactPhoneExt = useRef();

    let {
        refBillToCustomerCode,
        refShipperCompanyCode
    } = refs;

    useEffect(() => {

    }, [])

    useEffect(() => {
        let phones = [];

        if (contactId) {
            let contact = (selectedBillToCustomer?.contacts || []).find(x => x.id === contactId);

            if ((contact?.phone_work || '') !== '') {
                phones.push({
                    id: 1,
                    type: 'work',
                    phone: contact.phone_work
                })
            }

            if ((contact?.phone_work_fax || '') !== '') {
                phones.push({
                    id: 2,
                    type: 'fax',
                    phone: contact.phone_work_fax
                })
            }

            if ((contact?.phone_mobile || '') !== '') {
                phones.push({
                    id: 3,
                    type: 'mobile',
                    phone: contact.phone_mobile
                })
            }

            if ((contact?.phone_direct || '') !== '') {
                phones.push({
                    id: 4,
                    type: 'direct',
                    phone: contact.phone_direct
                })
            }

            if ((contact?.phone_other || '') !== '') {
                phones.push({
                    id: 5,
                    type: 'other',
                    phone: contact.phone_other
                })
            }
        } else if ((selectedBillToCustomer?.contacts || []).find(x => x.is_primary === 1)) {
            let contact = (selectedBillToCustomer?.contacts || []).find(x => x.is_primary === 1);

            if ((contact?.phone_work || '') !== '') {
                phones.push({
                    id: 1,
                    type: 'work',
                    phone: contact.phone_work
                })
            }

            if ((contact?.phone_work_fax || '') !== '') {
                phones.push({
                    id: 2,
                    type: 'fax',
                    phone: contact.phone_work_fax
                })
            }

            if ((contact?.phone_mobile || '') !== '') {
                phones.push({
                    id: 3,
                    type: 'mobile',
                    phone: contact.phone_mobile
                })
            }

            if ((contact?.phone_direct || '') !== '') {
                phones.push({
                    id: 4,
                    type: 'direct',
                    phone: contact.phone_direct
                })
            }

            if ((contact?.phone_other || '') !== '') {
                phones.push({
                    id: 5,
                    type: 'other',
                    phone: contact.phone_other
                })
            }
        }

        setContactPhoneItems(phones);

    }, [contactId])

    const handleSearch = () => {
        let companySearch = [
            {
                field: "Code",
                data: (selectedBillToCustomer?.code || "").toLowerCase(),
            },
            {
                field: "Name",
                data: (selectedBillToCustomer?.name || "").toLowerCase(),
            },
            {
                field: "City",
                data: (selectedBillToCustomer?.city || "").toLowerCase(),
            },
            {
                field: "State",
                data: (selectedBillToCustomer?.state || "").toLowerCase(),
            },
            {
                field: "Postal Code",
                data: selectedBillToCustomer?.zip || "",
            },
            {
                field: "Contact Name",
                data: (selectedBillToCustomer?.contact_name || "").toLowerCase(),
            },
            {
                field: "Contact Phone",
                data: selectedBillToCustomer?.contact_phone || "",
            },
            {
                field: "E-Mail",
                data: (selectedBillToCustomer?.email || "").toLowerCase(),
            },
            {
                field: 'User Code',
                data: (user?.user_code?.type || 'employee') === 'agent' ? user.user_code.code : ''
            }
        ];

        let panel = {
            panelName: `${props.panelName}-customer-search`,
            component: (
                <CustomerSearch
                    title="Customer Search Results"
                    tabTimes={29000}
                    panelName={`${props.panelName}-customer-search`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    customerSearch={companySearch}
                    callback={(id) => {
                        if ((id || 0) > 0) {
                            axios.post(props.serverUrl + '/getCustomerById', {id: id}).then(res => {
                                if (res.data.result === 'OK') {
                                    let customer = res.data?.customer;

                                    if (customer) {
                                        setSelectedBillToCustomer(customer);
                                        setSelectedBillToCustomerContact((customer.contacts || []).find((c) => c.is_primary === 1) || {});

                                        let selected_order = {...selectedOrder} || {
                                            order_number: 0,
                                        };
                                        selected_order.bill_to_customer_id = customer.id;

                                        setSelectedOrder(selected_order);

                                        setIsLoading(true);
                                        validateOrderForSaving({keyCode: 9});
                                        refShipperCompanyCode.current.focus();

                                        closePanel(`${props.panelName}-customer-search`, props.origin);
                                    } else {
                                        closePanel(`${props.panelName}-customer-search`, props.origin);
                                        setSelectedBillToCustomer({});
                                        setSelectedBillToCustomerContact({});
                                        refBillToCompanyCode.current.focus();
                                    }
                                } else {
                                    closePanel(`${props.panelName}-customer-search`, props.origin);
                                    setSelectedBillToCustomer({});
                                    setSelectedBillToCustomerContact({});
                                    refBillToCompanyCode.current.focus();
                                }
                            }).catch(e => {
                                closePanel(`${props.panelName}-customer-search`, props.origin);
                                setSelectedBillToCustomer({});
                                setSelectedBillToCustomerContact({});
                                refBillToCompanyCode.current.focus();
                            })
                        } else {
                            closePanel(`${props.panelName}-customer-search`, props.origin);
                            setSelectedBillToCustomer({});
                            setSelectedBillToCustomerContact({});
                            refBillToCompanyCode.current.focus();
                        }
                    }}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const handleCompanyInfo = () => {
        if ((selectedBillToCustomer.id || 0) === 0) {
            window.alert("You must select a customer first!");
            return;
        }

        let panel = {
            panelName: `${props.panelName}-customer`,
            component: (
                <Customers
                    pageName={"Customer"}
                    title={"Bill-To Company"}
                    panelName={`${props.panelName}-customer`}
                    tabTimes={2000 + tabTimes}
                    componentId={moment().format("x")}
                    isOnPanel={true}
                    isAdmin={props.isAdmin}
                    origin={props.origin}


                    customer_id={selectedBillToCustomer.id}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const handleRateLoad = () => {
        if ((selectedOrder?.id || 0) === 0) {
            window.alert("You must create or load an order first!");
            return;
        }

        if ((selectedOrder?.load_type_id || 0) === 0) {
            window.alert("You must select a load type first!");
            return;
        }

        let panel = {
            panelName: `${props.panelName}-rating`,
            component: (
                <RatingScreen
                    panelName={`${props.panelName}-rating`}
                    title="Rating Screen"
                    tabTimes={34000 + tabTimes}
                    componentId={moment().format("x")}
                    origin={props.origin}
                    selectedOrder={selectedOrder}
                />
            ),
        };

        openPanel(panel, props.origin);
    }

    const handleClear = () => {
        setSelectedBillToCustomer({});
        refBillToCompanyCode.current.focus();

        if ((selectedOrder?.id || 0) > 0) {
            let order = {...selectedOrder};

            setSelectedOrder(prev => {
                return {
                    ...prev,
                    bill_to_customer_id: null,
                    bill_to_company: {}
                }
            })

            if (!isCreatingTemplate && !isEditingTemplate) {
                axios.post(props.serverUrl + '/saveOrder', {
                    ...order,
                    bill_to_customer_id: null,
                    bill_to_company: {}
                }).then(res => {

                }).catch(e => {
                    console.log('error clearing bill to company')
                })
            }
        }
    }

    const getBillToCustomerByCode = (e) => {
        let key = e.key;

        if (key === 'tab') {
            if (e.target.value !== "") {
                axios.post(props.serverUrl + "/customers", {
                    code: e.target.value.toLowerCase(),
                    user_code: (props.user?.user_code?.type || 'employee') === 'agent' ? props.user.user_code.code : ''
                }).then(async (res) => {
                    if (res.data.result === "OK") {
                        if (res.data.customers.length > 0) {
                            setSelectedBillToCustomer(res.data.customers[0]);
                            setSelectedBillToCustomerContact(
                                (res.data.customers[0].contacts || []).find(
                                    (c) => c.is_primary === 1
                                ) || {}
                            );

                            let selected_order = {...selectedOrder} || {
                                order_number: 0,
                            };
                            selected_order.bill_to_customer_id = res.data.customers[0].id;

                            setSelectedOrder(selected_order);

                            validateOrderForSaving({keyCode: 9});
                        } else {
                            setSelectedBillToCustomer({});
                            setSelectedBillToCustomerContact({});
                        }
                    } else {
                        setSelectedBillToCustomer({});
                        setSelectedBillToCustomerContact({});
                    }
                }).catch((e) => {
                    console.log("error getting customers", e);
                });
            } else {
                setSelectedBillToCustomer({});
                setSelectedBillToCustomerContact({});
            }
        }
    }

    return (
        <div className="form-bordered-box" style={{minWidth: "38%", maxWidth: "38%", marginRight: 10}}>
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Bill To</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                    {
                        (selectedOrder?.is_cancelled || 0) === 0 &&
                        <div className="mochi-button" onClick={handleSearch}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Search</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    }
                    <div className="mochi-button" onClick={handleCompanyInfo}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Company info</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className="mochi-button" onClick={handleRateLoad}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Rate load</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className="mochi-button" onClick={handleClear}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-row">
                <div className="input-box-container input-code">
                    <input
                        tabIndex={0 + tabTimes}
                        type='text'
                        placeholder='Code'
                        title='Code'
                        maxLength={8}
                        ref={refBillToCustomerCode}
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onKeyDown={(e) => {
                            if ((selectedOrder?.is_cancelled || 0) === 0) {
                                getBillToCustomerByCode(e)
                            }
                        }}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    code: e.target.value,
                                    code_number: 0,
                                }
                            });
                        }}
                        value={
                            (selectedBillToCustomer?.code_number || 0) === 0
                                ? (selectedBillToCustomer?.code || '')
                                : (selectedBillToCustomer?.code || '') + (selectedBillToCustomer?.code_number || '')
                        }
                    />
                </div>

                <div className="input-box-container grow">
                    <input
                        tabIndex={1 + tabTimes}
                        style={{textTransform: 'capitalize'}}
                        type='text'
                        placeholder='Name'
                        title='Name'
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    name: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.name || ''}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="input-box-container grow">
                    <input
                        tabIndex={2 + tabTimes}
                        style={{textTransform: 'capitalize'}}
                        type='text'
                        placeholder='Address 1'
                        title='Address 1'
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    address1: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.address1 || ''}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="input-box-container grow">
                    <input
                        tabIndex={3 + tabTimes}
                        style={{textTransform: 'capitalize'}}
                        type='text'
                        placeholder='Address 2'
                        title='Address 2'
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    address2: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.address2 || ''}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="input-box-container grow">
                    <input
                        tabIndex={4 + tabTimes}
                        style={{textTransform: 'capitalize'}}
                        type='text'
                        placeholder='City'
                        title='City'
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    city: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.city || ''}
                    />
                </div>

                <div className="input-box-container input-state">
                    <input
                        tabIndex={5 + tabTimes}
                        style={{textTransform: 'uppercase'}}
                        type='text'
                        placeholder='State'
                        title='State'
                        maxLength={2}
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    state: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.state || ''}
                    />
                </div>

                <div className="input-box-container input-zip-code">
                    <input
                        tabIndex={6 + tabTimes}
                        type='text'
                        placeholder='Postal Code'
                        title='Postal Code'
                        readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                        onChange={(e) => {
                            setSelectedBillToCustomer(prev => {
                                return {
                                    ...prev,
                                    zip: e.target.value,
                                }
                            });
                        }}
                        value={selectedBillToCustomer?.zip || ''}
                    />
                </div>
            </div>

            <div className="form-row">
                <SelectBox
                    tabIndex={7 + tabTimes}
                    popupId={'bill-to-contact-name' + tabTimes}
                    className='grow'
                    readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                    isDropdownEnabled={(selectedOrder?.is_cancelled || 0) === 0}
                    placeholder='Contact Name'
                    title='Contact Name'
                    labelType='contact_first_last'
                    refs={{
                        refInput: refContactName,
                        refPopupItems: refContactNamePopupItems,
                        refDropdown: refContactNameDropDown
                    }}
                    items={contactNameItems}
                    setItems={setContactNameItems}
                    getItems={() => {
                        let _contacts = [];
                        let _name = (contactName || '').trim().toLowerCase();

                        if (_name !== '') {
                            _contacts = (selectedBillToCustomer?.contacts | []).filter(x => {
                                return `${x?.first_name || ''} ${x?.last_name || ''}`.trim().toLowerCase().includes(_name)
                            })

                            if (_contacts.length > 0) {
                                _contacts[0].selected = true
                            }
                        }else{
                            _contactas = (selectedBillToCustomer?.contactas || []).map((x,i) => {
                                x.selected = i === 0;
                                return x;
                            })
                        }

                        setContactNameItems(_contacts);
                    }}
                    value={contactName || ''}
                    onInput={(e) => {
                        let value = e.target.value.trim();

                        if ((selectedBillToCustomer?.id || 0) > 0){
                            if (value === '') {
                                setContactNameItems([]);
                            }else{
                                let contacts = selectedBillToCustomer?.contacts || [];

                                if (contacts.length > 0) {
                                    let _items = contacts.filter(item => {
                                        return (item?.first_name || '').includes(value) || (item?.last_name || '').includes(value);
                                    });

                                    if (_items.length > 0) {
                                        _items[0].selected = true;

                                        setContactNameItems(_items);
                                    }else{
                                        setContactNameItems([]);
                                    }
                                }
                            }
                        }

                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                bill_to_contact_name: e.target.value
                            }
                        })

                        refContactNamePopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                })
                            }
                            return true;
                        });
                    }}
                    onChange={(e) => {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                bill_to_contact_name: e.target.value
                            }
                        })
                    }}
                    onEnter={() => {
                        let selectedContact = (contactNameItems || []).find(x => x.selected);

                        // validate if the contact names popup is shown and there's one selected.
                        if (contactNameItems.length > 0 && selectedContact) {
                            // getting the id of the selected contact.
                            let _contact_id = selectedContact?.id;

                            // getting the full name of the selected contact.
                            let _contact_name = `${(selectedContact?.first_name || '')} ${(selectedContact?.last_name || '')}`.trim();

                            // validate the primary phone of the selected contact and its corresponding phone number to not be empty,
                            // otherwise it will be set to 'work' as default.
                            let _contact_primary_phone = (selectedContact?.primary_phone || '') === 'work' && (selectedContact?.phone_work || '') === ''
                                ? (selectedContact?.phone_work_fax || '') !== ''
                                    ? 'fax'
                                    : (selectedContact?.phone_mobile || '') !== ''
                                        ? 'mobile'
                                        : (selectedContact?.phone_direct || '') !== ''
                                            ? 'direct'
                                            : (selectedContact?.phone_other || '') !== ''
                                                ? 'other'
                                                : 'work'
                                : (selectedContact?.primary_phone || '') === 'fax' && (selectedContact?.phone_work_fax || '') === ''
                                    ? (selectedContact?.phone_work || '') !== ''
                                        ? 'work'
                                        : (selectedContact?.phone_mobile || '') !== ''
                                            ? 'mobile'
                                            : (selectedContact?.phone_direct || '') !== ''
                                                ? 'direct'
                                                : (selectedContact?.phone_other || '') !== ''
                                                    ? 'other'
                                                    : 'work'
                                    : (selectedContact?.primary_phone || '') === 'mobile' && (selectedContact?.phone_mobile || '') === ''
                                        ? (selectedContact?.phone_work || '') !== ''
                                            ? 'work'
                                            : (selectedContact?.phone_work_fax || '') !== ''
                                                ? 'fax'
                                                : (selectedContact?.phone_direct || '') !== ''
                                                    ? 'direct'
                                                    : (selectedContact?.phone_other || '') !== ''
                                                        ? 'other'
                                                        : 'work'
                                        : (selectedContact?.primary_phone || '') === 'direct' && (selectedContact?.phone_direct || '') === ''
                                            ? (selectedContact?.phone_work || '') !== ''
                                                ? 'work'
                                                : (selectedContact?.phone_work_fax || '') !== ''
                                                    ? 'fax'
                                                    : (selectedContact?.phone_mobile || '') !== ''
                                                        ? 'mobile'
                                                        : (selectedContact?.phone_other || '') !== ''
                                                            ? 'other'
                                                            : 'work'
                                            : (selectedContact?.primary_phone || '') === 'other' && (selectedContact?.phone_other || '') === ''
                                                ? (selectedContact?.phone_work || '') !== ''
                                                    ? 'work'
                                                    : (selectedContact?.phone_work_fax || '') !== ''
                                                        ? 'fax'
                                                        : (selectedContact?.phone_mobile || '') !== ''
                                                            ? 'mobile'
                                                            : (selectedContact?.phone_direct || '') !== ''
                                                                ? 'direct'
                                                                : 'work'
                                                : 'work';

                            let _contact_phone = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_work || '')
                                : _contact_primary_phone === 'fax'
                                    ? (selectedContact?.phone_work_fax || '')
                                    : _contact_primary_phone === 'mobile'
                                        ? (selectedContact?.phone_mobile || '')
                                        :_contact_primary_phone === 'direct'
                                            ? (selectedContact?.phone_direct || '')
                                            :_contact_primary_phone === 'other'
                                                ? (selectedContact?.phone_other || '')
                                                : '';

                            let _contact_phone_ext = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_ext || '')
                                : '';

                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: _contact_id,
                                    bill_to_contact_primary_phone: _contact_primary_phone,
                                    bill_to_contact_name: _contact_name,
                                    bill_to_contact_phone: _contact_phone,
                                    bill_to_contact_phone_ext: _contact_phone_ext
                                }
                            })

                            setContactNameItems([]);
                        }
                    }}
                    onTab={(e) => {
                        let selectedContact = (contactNameItems || []).find(x => x.selected);

                        // validate if the contact names popup is shown and there's one selected.
                        if (contactNameItems.length > 0 && selectedContact) {
                            e.preventDefault();
                            // getting the id of the selected contact.
                            let _contact_id = selectedContact?.id;

                            // getting the full name of the selected contact.
                            let _contact_name = `${(selectedContact?.first_name || '')} ${(selectedContact?.last_name || '')}`.trim();

                            // validate the primary phone of the selected contact and its corresponding phone number to not be empty,
                            // otherwise it will be set to 'work' as default.
                            let _contact_primary_phone = (selectedContact?.primary_phone || '') === 'work' && (selectedContact?.phone_work || '') === ''
                                ? (selectedContact?.phone_work_fax || '') !== ''
                                    ? 'fax'
                                    : (selectedContact?.phone_mobile || '') !== ''
                                        ? 'mobile'
                                        : (selectedContact?.phone_direct || '') !== ''
                                            ? 'direct'
                                            : (selectedContact?.phone_other || '') !== ''
                                                ? 'other'
                                                : 'work'
                                : (selectedContact?.primary_phone || '') === 'fax' && (selectedContact?.phone_work_fax || '') === ''
                                    ? (selectedContact?.phone_work || '') !== ''
                                        ? 'work'
                                        : (selectedContact?.phone_mobile || '') !== ''
                                            ? 'mobile'
                                            : (selectedContact?.phone_direct || '') !== ''
                                                ? 'direct'
                                                : (selectedContact?.phone_other || '') !== ''
                                                    ? 'other'
                                                    : 'work'
                                    : (selectedContact?.primary_phone || '') === 'mobile' && (selectedContact?.phone_mobile || '') === ''
                                        ? (selectedContact?.phone_work || '') !== ''
                                            ? 'work'
                                            : (selectedContact?.phone_work_fax || '') !== ''
                                                ? 'fax'
                                                : (selectedContact?.phone_direct || '') !== ''
                                                    ? 'direct'
                                                    : (selectedContact?.phone_other || '') !== ''
                                                        ? 'other'
                                                        : 'work'
                                        : (selectedContact?.primary_phone || '') === 'direct' && (selectedContact?.phone_direct || '') === ''
                                            ? (selectedContact?.phone_work || '') !== ''
                                                ? 'work'
                                                : (selectedContact?.phone_work_fax || '') !== ''
                                                    ? 'fax'
                                                    : (selectedContact?.phone_mobile || '') !== ''
                                                        ? 'mobile'
                                                        : (selectedContact?.phone_other || '') !== ''
                                                            ? 'other'
                                                            : 'work'
                                            : (selectedContact?.primary_phone || '') === 'other' && (selectedContact?.phone_other || '') === ''
                                                ? (selectedContact?.phone_work || '') !== ''
                                                    ? 'work'
                                                    : (selectedContact?.phone_work_fax || '') !== ''
                                                        ? 'fax'
                                                        : (selectedContact?.phone_mobile || '') !== ''
                                                            ? 'mobile'
                                                            : (selectedContact?.phone_direct || '') !== ''
                                                                ? 'direct'
                                                                : 'work'
                                                : 'work';

                            let _contact_phone = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_work || '')
                                : _contact_primary_phone === 'fax'
                                    ? (selectedContact?.phone_work_fax || '')
                                    : _contact_primary_phone === 'mobile'
                                        ? (selectedContact?.phone_mobile || '')
                                        :_contact_primary_phone === 'direct'
                                            ? (selectedContact?.phone_direct || '')
                                            :_contact_primary_phone === 'other'
                                                ? (selectedContact?.phone_other || '')
                                                : '';

                            let _contact_phone_ext = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_ext || '')
                                : '';

                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: _contact_id,
                                    bill_to_contact_primary_phone: _contact_primary_phone,
                                    bill_to_contact_name: _contact_name,
                                    bill_to_contact_phone: _contact_phone,
                                    bill_to_contact_phone_ext: _contact_phone_ext
                                }
                            })

                            setContactNameItems([]);
                        }
                    }}
                    onBlur={(e) => {
                        if ((selectedBillToCustomer?.id || 0) > 0) {
                            let contacts = selectedBillToCustomer?.contacts || [];

                            if (contacts.length > 0) {
                                let selectedContact = contacts.find(x => `${x?.first_name || ''} ${x?.last_name || ''}`.trim().toLowerCase() === (e.target.value || '').toLowerCase());

                                if (selectedContact) {
                                    if ((selectedContact?.id || 0) !== selectedOrder?.bill_to_contact_id) {
                                        // getting the id of the selected contact.
                                        let _contact_id = selectedContact?.id;

                                        // getting the full name of the selected contact.
                                        let _contact_name = `${(selectedContact?.first_name || '')} ${(selectedContact?.last_name || '')}`.trim();

                                        // validate the primary phone of the selected contact and its corresponding phone number to not be empty,
                                        // otherwise it will be set to 'work' as default.
                                        let _contact_primary_phone = (selectedContact?.primary_phone || '') === 'work' && (selectedContact?.phone_work || '') === ''
                                            ? (selectedContact?.phone_work_fax || '') !== ''
                                                ? 'fax'
                                                : (selectedContact?.phone_mobile || '') !== ''
                                                    ? 'mobile'
                                                    : (selectedContact?.phone_direct || '') !== ''
                                                        ? 'direct'
                                                        : (selectedContact?.phone_other || '') !== ''
                                                            ? 'other'
                                                            : 'work'
                                            : (selectedContact?.primary_phone || '') === 'fax' && (selectedContact?.phone_work_fax || '') === ''
                                                ? (selectedContact?.phone_work || '') !== ''
                                                    ? 'work'
                                                    : (selectedContact?.phone_mobile || '') !== ''
                                                        ? 'mobile'
                                                        : (selectedContact?.phone_direct || '') !== ''
                                                            ? 'direct'
                                                            : (selectedContact?.phone_other || '') !== ''
                                                                ? 'other'
                                                                : 'work'
                                                : (selectedContact?.primary_phone || '') === 'mobile' && (selectedContact?.phone_mobile || '') === ''
                                                    ? (selectedContact?.phone_work || '') !== ''
                                                        ? 'work'
                                                        : (selectedContact?.phone_work_fax || '') !== ''
                                                            ? 'fax'
                                                            : (selectedContact?.phone_direct || '') !== ''
                                                                ? 'direct'
                                                                : (selectedContact?.phone_other || '') !== ''
                                                                    ? 'other'
                                                                    : 'work'
                                                    : (selectedContact?.primary_phone || '') === 'direct' && (selectedContact?.phone_direct || '') === ''
                                                        ? (selectedContact?.phone_work || '') !== ''
                                                            ? 'work'
                                                            : (selectedContact?.phone_work_fax || '') !== ''
                                                                ? 'fax'
                                                                : (selectedContact?.phone_mobile || '') !== ''
                                                                    ? 'mobile'
                                                                    : (selectedContact?.phone_other || '') !== ''
                                                                        ? 'other'
                                                                        : 'work'
                                                        : (selectedContact?.primary_phone || '') === 'other' && (selectedContact?.phone_other || '') === ''
                                                            ? (selectedContact?.phone_work || '') !== ''
                                                                ? 'work'
                                                                : (selectedContact?.phone_work_fax || '') !== ''
                                                                    ? 'fax'
                                                                    : (selectedContact?.phone_mobile || '') !== ''
                                                                        ? 'mobile'
                                                                        : (selectedContact?.phone_direct || '') !== ''
                                                                            ? 'direct'
                                                                            : 'work'
                                                            : 'work';

                                        let _contact_phone = _contact_primary_phone === 'work'
                                            ? (selectedContact?.phone_work || '')
                                            : _contact_primary_phone === 'fax'
                                                ? (selectedContact?.phone_work_fax || '')
                                                : _contact_primary_phone === 'mobile'
                                                    ? (selectedContact?.phone_mobile || '')
                                                    :_contact_primary_phone === 'direct'
                                                        ? (selectedContact?.phone_direct || '')
                                                        :_contact_primary_phone === 'other'
                                                            ? (selectedContact?.phone_other || '')
                                                            : '';

                                        let _contact_phone_ext = _contact_primary_phone === 'work'
                                            ? (selectedContact?.phone_ext || '')
                                            : '';

                                        setSelectedOrder(prev => {
                                            return {
                                                ...prev,
                                                bill_to_contact_id: _contact_id,
                                                bill_to_contact_primary_phone: _contact_primary_phone,
                                                bill_to_contact_name: _contact_name,
                                                bill_to_contact_phone: _contact_phone,
                                                bill_to_contact_phone_ext: _contact_phone_ext
                                            }
                                        })
                                    }
                                }else{
                                    setSelectedOrder(prev => {
                                        return {
                                            ...prev,
                                            bill_to_contact_id: null,
                                            bill_to_contact_primary_phone: 'work',
                                            bill_to_contact_name: '',
                                            bill_to_contact_phone: '',
                                            bill_to_contact_phone_ext: ''
                                        }
                                    })
                                }
                            }else{
                                setSelectedOrder(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_id: null,
                                        bill_to_contact_primary_phone: 'work',
                                        bill_to_contact_name: '',
                                        bill_to_contact_phone: '',
                                        bill_to_contact_phone_ext: ''
                                    }
                                })
                            }
                        }else {
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: null,
                                    bill_to_contact_primary_phone: 'work',
                                    bill_to_contact_name: '',
                                    bill_to_contact_phone: '',
                                    bill_to_contact_phone_ext: ''
                                }
                            })
                        }
                    }}
                    onDropdownClick={() => {
                        let _contacts = [];
                        let _name = (contactName || '').trim().toLowerCase();

                        if (_name !== '') {
                            _contacts = (selectedBillToCustomer?.contacts | []).filter(x => {
                                return `${x?.first_name || ''} ${x?.last_name || ''}`.trim().toLowerCase().includes(_name)
                            })

                            if (_contacts.length > 0) {
                                _contacts[0].selected = true
                            }
                        }else{
                            _contacts = (selectedBillToCustomer?.contactas || []).map((x,i) => {
                                x.selected = i === 0;
                                return x;
                            })
                        }

                        setContactNameItems(_contacts);
                    }}
                    onPopupClick={(selectedContact) => {
                        // validate if the contact names popup is shown and there's one selected.
                        if (contactNameItems.length > 0 && selectedContact) {
                            // getting the id of the selected contact.
                            let _contact_id = selectedContact?.id;

                            // getting the full name of the selected contact.
                            let _contact_name = `${(selectedContact?.first_name || '')} ${(selectedContact?.last_name || '')}`.trim();

                            // validate the primary phone of the selected contact and its corresponding phone number to not be empty,
                            // otherwise it will be set to 'work' as default.
                            let _contact_primary_phone = (selectedContact?.primary_phone || '') === 'work' && (selectedContact?.phone_work || '') === ''
                                ? (selectedContact?.phone_work_fax || '') !== ''
                                    ? 'fax'
                                    : (selectedContact?.phone_mobile || '') !== ''
                                        ? 'mobile'
                                        : (selectedContact?.phone_direct || '') !== ''
                                            ? 'direct'
                                            : (selectedContact?.phone_other || '') !== ''
                                                ? 'other'
                                                : 'work'
                                : (selectedContact?.primary_phone || '') === 'fax' && (selectedContact?.phone_work_fax || '') === ''
                                    ? (selectedContact?.phone_work || '') !== ''
                                        ? 'work'
                                        : (selectedContact?.phone_mobile || '') !== ''
                                            ? 'mobile'
                                            : (selectedContact?.phone_direct || '') !== ''
                                                ? 'direct'
                                                : (selectedContact?.phone_other || '') !== ''
                                                    ? 'other'
                                                    : 'work'
                                    : (selectedContact?.primary_phone || '') === 'mobile' && (selectedContact?.phone_mobile || '') === ''
                                        ? (selectedContact?.phone_work || '') !== ''
                                            ? 'work'
                                            : (selectedContact?.phone_work_fax || '') !== ''
                                                ? 'fax'
                                                : (selectedContact?.phone_direct || '') !== ''
                                                    ? 'direct'
                                                    : (selectedContact?.phone_other || '') !== ''
                                                        ? 'other'
                                                        : 'work'
                                        : (selectedContact?.primary_phone || '') === 'direct' && (selectedContact?.phone_direct || '') === ''
                                            ? (selectedContact?.phone_work || '') !== ''
                                                ? 'work'
                                                : (selectedContact?.phone_work_fax || '') !== ''
                                                    ? 'fax'
                                                    : (selectedContact?.phone_mobile || '') !== ''
                                                        ? 'mobile'
                                                        : (selectedContact?.phone_other || '') !== ''
                                                            ? 'other'
                                                            : 'work'
                                            : (selectedContact?.primary_phone || '') === 'other' && (selectedContact?.phone_other || '') === ''
                                                ? (selectedContact?.phone_work || '') !== ''
                                                    ? 'work'
                                                    : (selectedContact?.phone_work_fax || '') !== ''
                                                        ? 'fax'
                                                        : (selectedContact?.phone_mobile || '') !== ''
                                                            ? 'mobile'
                                                            : (selectedContact?.phone_direct || '') !== ''
                                                                ? 'direct'
                                                                : 'work'
                                                : 'work';

                            let _contact_phone = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_work || '')
                                : _contact_primary_phone === 'fax'
                                    ? (selectedContact?.phone_work_fax || '')
                                    : _contact_primary_phone === 'mobile'
                                        ? (selectedContact?.phone_mobile || '')
                                        :_contact_primary_phone === 'direct'
                                            ? (selectedContact?.phone_direct || '')
                                            :_contact_primary_phone === 'other'
                                                ? (selectedContact?.phone_other || '')
                                                : '';

                            let _contact_phone_ext = _contact_primary_phone === 'work'
                                ? (selectedContact?.phone_ext || '')
                                : '';

                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_id: _contact_id,
                                    bill_to_contact_primary_phone: _contact_primary_phone,
                                    bill_to_contact_name: _contact_name,
                                    bill_to_contact_phone: _contact_phone,
                                    bill_to_contact_phone_ext: _contact_phone_ext
                                }
                            })

                            setContactNameItems([]);
                        }
                    }}
                />

                <SelectPhoneBox
                    tabIndex={8 + tabTimes}
                    popupId={'bill-to-contact-phone' + tabTimes}
                    readOnly={(selectedOrder?.is_cancelled || 0) === 1}
                    isDropdownEnabled={(selectedOrder?.is_cancelled || 0) === 0}
                    placeholder='Contact Phone'
                    title='Contact Phone'
                    refs={{
                        refInput: refContactPhone,
                        refPopupItems: refContactPhonePopupItems,
                        refDropdown: refContactPhoneDropDown
                    }}
                    items={contactPhoneItems}
                    setItems={setContactPhoneItems}
                    value={contactPhone}
                    primaryPhone={contactPrimaryPhone}
                    isShowing={showContactPhoneItems}
                    setIsShowing={setContactPhoneItems}
                    onInput={(e) => {
                        if ((selectedBillToCustomer?.id || 0) > 0 && contactPhoneItems.length > 0) {
                            let selectedIndex = contactPhoneItems.findIndex(x => x.phone.startsWith(e.target.value.toString()));

                            if (selectedIndex > -1){
                                setContactPhoneItems(contactPhoneItems.map((x, i) => {
                                    x.selected = i === selectedIndex;
                                    return x;
                                }))
                            }else{
                                setContactPhoneItems(contactPhoneItems.map((x, i) => {
                                    x.selected = i === 0;
                                    return x;
                                }))
                            }

                            setShowContactPhoneItems(true);
                        }
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                bill_to_contact_phone: e.target.value
                            }
                        })
                    }}
                    onChange={(e) => {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                bill_to_contact_phone: e.target.value
                            }
                        })
                    }}
                    onBlur={(e) => {
                        if ((selectedBillToCustomer?.id || 0) > 0 && contactPhoneItems.length > 0) {
                            let selectedPhone = contactPhoneItems.find(x => x.phone === e.target.value);

                            if (selectedPhone){
                                if (selectedPhone.type !== contactPrimaryPhone){
                                    setSelectedOrder(prev => {
                                        return {
                                            ...prev,
                                            bill_to_contact_phone: selectedPhone.phone,
                                            bill_to_contact_primary_phone: selectedPhone.type,
                                            bill_to_contact_phone_ext: selectedPhone.type === 'work'
                                                ? (selectedBillToCustomer?.contacts || []).find(x => x.id === contactId)?.phone_ext || ''
                                                : ''
                                        }
                                    })
                                }
                            }else{
                                setSelectedOrder(prev => {
                                    return {
                                        ...prev,
                                        bill_to_contact_phone: '',
                                        bill_to_contact_primary_phone: 'work',
                                        bill_to_contact_phone_ext: ''
                                    }
                                })
                            }
                        }else{
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_phone: '',
                                    bill_to_contact_primary_phone: 'work',
                                    bill_to_contact_phone_ext: ''
                                }
                            })
                        }
                    }}
                    onEnter={() => {
                        let selectedPhone = (contactPhoneItems || []).find(x => x.selected);

                        if (showContactPhoneItems && selectedPhone){
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_phone: selectedPhone.phone,
                                    bill_to_contact_primary_phone: selectedPhone.type,
                                    bill_to_contact_phone_ext: selectedPhone.type === 'work'
                                        ? (selectedBillToCustomer?.contacts || []).find(x => x.id === contactId)?.phone_ext || ''
                                        : ''
                                }
                            })

                            setShowContactPhoneItems(false);
                            refContactPhoneExt.current.focus();
                        }
                    }}
                    onTab={(e) => {
                        let selectedPhone = (contactPhoneItems || []).find(x => x.selected);

                        if (showContactPhoneItems && selectedPhone){
                            setSelectedOrder(prev => {
                                return {
                                    ...prev,
                                    bill_to_contact_phone: selectedPhone.phone,
                                    bill_to_contact_primary_phone: selectedPhone.type,
                                    bill_to_contact_phone_ext: selectedPhone.type === 'work'
                                        ? (selectedBillToCustomer?.contacts || []).find(x => x.id === contactId)?.phone_ext || ''
                                        : ''
                                }
                            })
                        }

                        setShowContactPhoneItems(false);
                        refContactPhoneExt.current.focus();
                    }}
                    onDropdownClick={() => {
                        if ((selectedBillToCustomer?.id || 0) > 0 && contactPhoneItems.length > 0 && !showContactPhoneItems) {
                            setContactPhoneItems(contactPhoneItems.map((x, i) => {
                                x.selected = i === 0;
                                return x;
                            }))

                            setShowContactPhoneItems(true);
                        }
                    }}
                    onPopupClick={(selectedPhone) => {
                        setSelectedOrder(prev => {
                            return {
                                ...prev,
                                bill_to_contact_phone: selectedPhone.phone,
                                bill_to_contact_primary_phone: selectedPhone.type,
                                bill_to_contact_phone_ext: selectedPhone.type === 'work'
                                    ? (selectedBillToCustomer?.contacts || []).find(x => x.id === contactId)?.phone_ext || ''
                                    : ''
                            }
                        })

                        setShowContactPhoneItems(false);
                        refContactPhoneExt.current.focus();
                    }}
                    getItems={() => {
                        setContactPhoneItems(contactPhoneItems.map((x, i) => {
                            x.selected = i === 0;
                            return x;
                        }))

                        setShowContactPhoneItems(true);
                    }}
                />

                <div className="input-box-container input-phone-ext">
                    <input
                        tabIndex={9 + tabTimes}
                        type="text"
                        placeholder="Ext"
                        onKeyDown={(e) => {
                            if ((selectedOrder?.is_cancelled || 0) === 0) {
                                validateOrderForSaving(e)
                            }
                        }}
                        onInput={(e) => {
                            if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                setSelectedBillToCustomer({
                                    ...selectedBillToCustomer,
                                    ext: e.target.value,
                                });
                            }
                        }}
                        onChange={(e) => {
                            if ((selectedBillToCustomer?.contacts || []).length === 0) {
                                setSelectedBillToCustomer({
                                    ...selectedBillToCustomer,
                                    ext: e.target.value,
                                });
                            }
                        }}
                        value={

                        }
                    />
                </div>
            </div>
        </div>
    );
}

BillTo.propTypes = {};

export default BillTo;