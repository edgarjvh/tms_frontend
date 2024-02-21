import React from 'react';
import { connect } from 'react-redux';
import './PanelT.css';
import moment from 'moment';

import {
    setCustomersTPanels
} from './../../../../actions/companyActions';

import { PanelT as _PanelT } from './../../panels';

const PanelT = (props) => {
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
        <div className='panel-content' style={{
            backgroundColor: 'white'
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            <div className="header-buttons" style={{
                padding: '20px 0',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div className="mochi-button" onClick={() => {
                    let panel = {
                        panelName: `${props.panelName}-${props.title}`,
                        component: <_PanelT
                            title={props.title}
                            tabTimes={19000 + props.tabTimes}
                            panelName={`${props.panelName}-${props.title}`}
                            origin={props.origin}


                            componentId={moment().format('x')}
                        />
                    }

                    openPanel(panel, props.origin);
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">XX</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PanelT)