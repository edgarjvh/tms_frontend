import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './RatingModal.css';
import ReactHtmlParser from 'react-html-parser';

const RatingModal = (props) => {

    return (
        <div className="rating-modal" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 2
        }}>
            <div className="rating-modal-wrapper" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div className="rating-modal-content" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 15,
                    borderRadius: 15,
                    boxShadow: '0 0 5px 2px rgba(0,0,0,0.5)',
                    width: '90%',
                    maxWidth: '400px'
                }}>

                    <div className="rating-modal-title" style={{
                        fontWeight: 'bold',
                        width: '100%',
                        textAlign: 'center',                        
                        paddingBottom: 10,
                        fontSize: 16
                    }}>{props.title}</div>

                    <div className="rating-modal-text" style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        color:'darkred',
                        border: '1px dashed rgba(0,0,0,0.5)',
                        padding: '50px 30px',
                        borderRadius: 5                        
                    }}>
                        {ReactHtmlParser(props.text)}
                    </div>

                    <div className="modal-buttons" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 5
                    }}>
                        <div className="mochi-button" onClick={() => { props.close() }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Close</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
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

export default connect(mapStateToProps, null)(RatingModal)