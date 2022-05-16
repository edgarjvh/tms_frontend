import React, { useState, useEffect, useRef } from 'react';
import './OperatorSearch.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Operators } from './../../panels';
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

let timer = 0;
let delay = 300;
let prevent = false;

const OperatorSearch = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [operators, setOperators] = useState([]);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const handleClick = (e, x) => {
        timer = setTimeout(function () {
            if (!prevent) {                            

                let panel = {
                    panelName: `${props.panelName}-operators`,
                    component: <Operators
                        title='Operators'
                        tabTimes={422000 + props.tabTimes}
                        panelName={`${props.panelName}-operators`}
                        savingOperatorUrl={`/saveOperator`}
                        deletingOperatorUrl={`/deleteOperator`}
                        uploadAvatarUrl={`/uploadOperatorAvatar`}
                        removeAvatarUrl={`/removeOperatorAvatar`}
                        suborigin={props.suborigin}
                        origin={props.origin}
                        owner={props.owner}

                        operatorSearchCompany={{
                            ...x.company,
                            selectedOperator: ((x.company.operators || []).find(operator => operator.id === x.id) || {})
                        }}
                    />
                }
                    
                props.openPanel(panel, props.origin);
            }
            prevent = false;
        }, delay);
    }

    const handleDoubleClick = (e, x) => {
        clearTimeout(timer);
        prevent = true;

        props.callback(x);
        // props.closePanel(props.panelName, props.origin);
    }

    useEffect(() => {
        let url = '/companyOperatorsSearch';        

        setIsLoading(true);
        axios.post(props.serverUrl + url, props.operatorSearch).then(async res => {
            if (res.data.result === 'OK') {
                setOperators(res.data.operators);
            }
            setIsLoading(false);
        }).catch(e => {
            console.log('error searching operators', e);
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
                    (props.operatorSearch.filters || []).map((item, index) => {

                        if (index > 0) {
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
                        }

                        return false;
                    })
                }
            </div>

            <div className="tbl">
                <div className="thead">
                    <div className="trow">
                        <div className="tcol first-name">First Name</div>
                        <div className="tcol last-name">Last Name</div>
                        <div className="tcol address1">Address 1</div>
                        <div className="tcol address2">Address 2</div>
                        <div className="tcol city">City</div>
                        <div className="tcol state">State</div>
                        <div className="tcol phone-work">Phone Work</div>
                        <div className="tcol email-work">E-mail Work</div>
                    </div>
                </div>
                <div className="tbody">
                    <div className="tbody-wrapper">
                        {
                            operators.length > 0
                                ? operators.map((c, i) => {
                                    return (
                                        <div className="trow" onClick={(e) => { handleClick(e, c) }} onDoubleClick={(e) => { handleDoubleClick(e, c) }} key={i}>
                                            <div className="tcol first-name">{c.first_name}</div>
                                            <div className="tcol last-name">{c.last_name}</div>
                                            <div className="tcol address1">{c.address1}</div>
                                            <div className="tcol address2">{c.address2}</div>
                                            <div className="tcol city">{c.city}</div>
                                            <div className="tcol state">{c.state}</div>
                                            <div className="tcol phone-work">{c.phone_work}</div>
                                            <div className="tcol email-work">{c.email_work}</div>
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
})(OperatorSearch)