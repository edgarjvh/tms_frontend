import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import Draggable from 'react-draggable';
import './CarrierInfoSearchChanging.css';
import {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
} from './../../../../actions';

const CarrierInfoSearchChanging = (props) => {
    const closePanelBtnClick = (e, name) => {
        props.setOpenedPanels(props.openedPanels.filter((item, index) => {
            return item !== name;
        }));
    }

    const rowDoubleClick = async (e, c) => {
        await props.setNewCarrier(c);
        // await c.contacts.map(async contact => {
        //     if (contact.is_primary === 1){
        //         await props.setSelectedDispatchCarrierInfoContact(contact);
        //     }
        //     return true;
        // });

        // if (c.drivers.length > 0) {
        //     await props.setSelectedDispatchCarrierInfoDriver(c.drivers[0]);
        // }

        closePanelBtnClick(null, props.panelName);
    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="close-btn" title="Close" onClick={e => closePanelBtnClick(e, props.panelName)}><span className="fas fa-times"></span></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div className="input-box-container" style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                {
                    (props.dispatchCarrierInfoCarrierSearchChanging || []).map((item, index) => {

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
                            props.dispatchCarrierInfoCarriersChanging.length > 0
                                ? props.dispatchCarrierInfoCarriersChanging.map((c, i) => {
                                    return (
                                        <div key={i} className="trow" onDoubleClick={(e) => { rowDoubleClick(e, c) }}>
                                            <div className="tcol code">{c.code + (c.code_number === 0 ? '' : c.code_number)}</div>
                                            <div className="tcol name">{c.name}</div>
                                            <div className="tcol address1">{c.address1}</div>
                                            <div className="tcol address2">{c.address2}</div>
                                            <div className="tcol city">{c.city}</div>
                                            <div className="tcol state">{c.state}</div>
                                            <div className="tcol zip">{c.zip}</div>
                                            <div className="tcol contact-name">{c.contact_name}</div>
                                            <div className="tcol contact-phone">{c.contact_phone}</div>
                                            <div className="tcol contact-phone-ext">{c.ext}</div>
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
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        carrierOpenedPanels: state.carrierReducers.carrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
    }
}

export default connect(mapStateToProps, {
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
})(CarrierInfoSearchChanging)