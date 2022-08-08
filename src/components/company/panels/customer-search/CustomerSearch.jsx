import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerSearch.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { connect } from 'react-redux';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
} from './../../../../actions';

const CustomerSearch = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const rowDoubleClick = (e, c) => {
        props.callback(c.id);
        // props.closePanel(props.panelName, props.origin);
    }

    useEffect(() => {
        setIsLoading(true);
        let url = '/customerSearch';

        switch (props.suborigin) {
            case 'carrier':
                url = '/carrierSearch';
                break;

            case 'factoring-company':
                url = '/factoringCompanySearch';
                break;

            case 'division':
                url = '/divisionSearch';
                break;
            default:
                url = '/customerSearch';
                break;
        }

        axios.post(props.serverUrl + url, { search: props.customerSearch }).then(async res => {
            if (res.data.result === 'OK') {
                let {customers, carriers, factoring_companies, divisions, agents, owner_operators, drivers} = res.data;
                setCustomers(customers || carriers || factoring_companies || divisions || agents || owner_operators || drivers || []);
            }

            setIsLoading(false);
        }).catch(e => {
            console.log('error searching for customers', e);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="input-box-container" style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                {
                    (props.customerSearch || []).map((item, index) => {

                        if (item.data.trim() !== '') {
                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.7rem',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    padding: '2px 10px',
                                    borderRadius: '10px',
                                    marginRight: '10px',
                                    cursor: 'default'
                                }} title={item}>
                                    <span style={{ fontWeight: 'bold', marginRight: 5 }}>{item.field}: </span>
                                    <span style={{ whiteSpace: 'nowrap' }}>{item.data}</span>
                                </div>
                            )
                        }

                        return false;
                    })
                }
            </div>

            <div className="tbl">
                <div className="thead">
                    <div className="trow">
                        <div className="tcol code">Code</div>
                        <div className="tcol name">Company Name</div>
                        <div className="tcol address1">Address 1</div>
                        <div className="tcol address2">Address 2</div>
                        <div className="tcol city">City</div>
                        <div className="tcol state">State</div>
                        <div className="tcol zip">Postal Code</div>
                        <div className="tcol contact-name">Contact Name</div>
                        <div className="tcol contact-phone">Contact Phone</div>
                        <div className="tcol contact-phone-ext">Ext</div>
                    </div>
                </div>
                <div className="tbody">
                    <div className="tbody-wrapper">
                        {
                            customers.length > 0
                                ? customers.map((c, i) => {
                                    return (
                                        <div key={i} className="trow" onDoubleClick={(e) => { rowDoubleClick(e, c) }}>
                                            <div className="tcol code">{c.code + (c.code_number === 0 ? '' : c.code_number)}</div>
                                            <div className="tcol name">{c.name}</div>
                                            <div className="tcol address1">{c.address1}</div>
                                            <div className="tcol address2">{c.address2}</div>
                                            <div className="tcol city">{c.city}</div>
                                            <div className="tcol state">{c.state}</div>
                                            <div className="tcol zip">{c.zip}</div>
                                            <div className="tcol contact-name">{
                                                (c.contacts || []).find(con => con.is_primary === 1) === undefined
                                                    ? c.contact_name
                                                    : c.contacts.find(con => con.is_primary === 1).first_name + ' ' + c.contacts.find(con => con.is_primary === 1).last_name
                                            }</div>
                                            <div className="tcol contact-phone">{
                                                (c.contacts || []).find(con => con.is_primary === 1) === undefined
                                                    ? c.contact_phone
                                                    : c.contacts.find(con => con.is_primary === 1).primary_phone === 'work'
                                                        ? c.contacts.find(con => con.is_primary === 1).phone_work
                                                        : c.contacts.find(con => con.is_primary === 1).primary_phone === 'fax'
                                                            ? c.contacts.find(con => con.is_primary === 1).phone_work_fax
                                                            : c.contacts.find(con => con.is_primary === 1).primary_phone === 'mobile'
                                                                ? c.contacts.find(con => con.is_primary === 1).phone_mobile
                                                                : c.contacts.find(con => con.is_primary === 1).primary_phone === 'direct'
                                                                    ? c.contacts.find(con => con.is_primary === 1).phone_direct
                                                                    : c.contacts.find(con => con.is_primary === 1).primary_phone === 'other'
                                                                        ? c.contacts.find(con => con.is_primary === 1).phone_other
                                                                        : ''
                                            }</div>

                                        </div>
                                    )
                                })
                                : <div className="trow"><div className="tcol empty">Nothing to show!</div></div>
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
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
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
})(CustomerSearch)