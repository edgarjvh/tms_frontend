/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import './ContactList.css';

const ContactList = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [list, setList] = useState([]);
    const [filterText, setFilterText] = useState('');

    const refContactListContainer = useRef();
    const refFilterText = useRef();

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    useEffect(() => {
        axios.post(props.serverUrl + '/getContactList', {
            customer_id: props.selectedCustomerId,
            user_type: props.user?.user_code?.type || 'employee',
            user_code: props.user?.user_code?.code || ''
        }).then(res => {
            if (res.data.result === 'OK') {
                setList(res.data.contacts);
            }
        }).finally(() => {
            setIsLoading(false)
        })

        refContactListContainer.current.focus({
            preventScroll: true
        })
    }, [])

    return (
        <div className="panel-content" tabIndex={0} ref={refContactListContainer} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                props.closingCallback();
            }
        }}>
            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
            
            <div className="filtering-section">
                <div className="input-box-container grow">
                    <input tabIndex={1 + props.tabTimes} type="text" placeholder="Filter"
                        ref={refFilterText}
                        onInput={(e) => {

                        }}
                        onChange={e => {
                            setFilterText(e.target.value)
                        }}
                        value={filterText || ''} />
                </div>
            </div>

            <div className="panel-contact-list-container">
                <div className="contact-list-wrapper">
                    <div className="contact-list-header">
                        <div className="contact-list-col first-name">First Name</div>
                        <div className="contact-list-col last-name">Last Name</div>
                        <div className="contact-list-col phone-work">Phone Work</div>
                        <div className="contact-list-col email-work">Email Work</div>
                        <div className="contact-list-col customer-code">Customer Code</div>
                        <div className="contact-list-col customer-name">Customer Name</div>
                    </div>

                    <div className="contact-list-rows">
                        {
                            (list || []).filter((item) => {
                                return filterText.trim() === '' ||
                                    (item?.first_name || '').toLowerCase().includes(filterText.toLowerCase().trim()) ||
                                    (item?.last_name || '').toLowerCase().includes(filterText.toLowerCase().trim()) ||
                                    (item?.phone_work || '').toLowerCase().includes(filterText.toLowerCase().trim()) ||
                                    (item?.email_work || '').toLowerCase().includes(filterText.toLowerCase().trim()) ||
                                    (item?.code || '').toLowerCase().includes(filterText.toLowerCase().trim()) ||
                                    (item?.name || '').toLowerCase().includes(filterText.toLowerCase().trim())
                            }).map((item, i) => {
                                return (
                                    <div className="contact-list-item" key={i} onDoubleClick={() => {
                                        setIsLoading(true);

                                        axios.post(props.serverUrl + '/saveExtCustomerContact', {
                                            customer_id: props.selectedCustomerId,
                                            contact_id: item.id
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                props.setContacts(res.data.customer.contacts);
                                            }
                                        })
                                    }}>
                                        <div className="contact-list-col first-name">{item?.first_name || ''}</div>
                                        <div className="contact-list-col last-name">{item?.last_name || ''}</div>
                                        <div className="contact-list-col phone-work">{item?.phone_work || ''}</div>
                                        <div className="contact-list-col email-work">{item?.email_work || ''}</div>
                                        <div className="contact-list-col customer-code">{(item?.code || '') + ((item?.code_number || 0) === 0 ? '' : item?.code_number)}</div>
                                        <div className="contact-list-col customer-name">{item?.name || ''}</div>
                                    </div>
                                )
                            })
                        }
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

export default connect(mapStateToProps, null)(ContactList)