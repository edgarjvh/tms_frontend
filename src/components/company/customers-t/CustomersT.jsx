import React from 'react';
import { connect } from 'react-redux';
import './CustomersT.css';
import moment from 'moment';

import {
    setCustomersTPanels
} from './../../../actions/companyActions';

import { PanelT } from '../panels';

const CustomersT = (props) => {
    const openPanel = (panel, origin) => {
        if (origin === 'customers-t') {
            if (props.customersTPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCustomersTPanels([...props.customersTPanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'customers-t') {
            props.setCustomersTPanels(props.customersTPanels.filter(panel => panel.panelName !== panelName));
        }       
    }
    
    return (
        <div style={{
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: 10
        }}>
            <div></div>
            <div style={{
                width: '130px',
                display: 'flex',
                flexDirection: 'column',
                gap: 15
            }}>
                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='AAAAAA'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">AAAAAA</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='BBBBBB'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">BBBBBB</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='CCCCCC'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">CCCCCC</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='DDDDDD'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">DDDDDD</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='EEEEEE'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">EEEEEE</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }} onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-xxxxxx`,
                        component: <PanelT
                            title='FFFFFF'
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-xxxxxx`}
                            origin={props.origin}
            
            
                            componentId={moment().format('x')}
                        />
                    }
            
                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">FFFFFF</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,

        customersTPanels: state.companyReducers.customersTPanels
    }
}

const mapDispatchToProps = {
    setCustomersTPanels
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersT)