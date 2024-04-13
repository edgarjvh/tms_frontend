import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './CompanyHome.css';
import axios from 'axios';
import { useTransition, animated, config } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Draggable from 'react-draggable'

import {
    setUser,
    setSelectedPageIndex,
    setMainCompanyScreenFocused,
    setLoginScreenFocused
} from './../../../actions';

import {
    Login
} from './../panels';
import LoadInformation from './widgets/load-information/LoadInformation';

const CompanyHome = (props) => {
    const [widgets, setWidgets] = useState([])
    const refLoadInformationGrabber = useRef(null);

    useEffect(() => {
        if (props.user && props.user?.user_code?.id) {
            const userCodeId = props.user.user_code.id;
            const userWidgets = props.user.user_code?.widgets || [];
            let _widgets = [];

            axios.post(props.serverUrl + '/getWidgets').then(res => {
                if (res.data.result === 'OK') {
                    (res.data.widgets || []).map(widget => {
                        const widgetName = widget.name;                        
                        const uWidget = userWidgets.find(x => x?.pivot?.user_code_id === userCodeId && x?.pivot?.widget_id === widget.id);
                        console.log(userWidgets)

                        if (uWidget) {
                            const top = uWidget.pivot?.top || 0;
                            const left = uWidget.pivot?.left || 0;

                            switch (widgetName) {
                                case 'load information':
                                    _widgets = [
                                        ..._widgets,
                                        {
                                            widget_id: widget.id,
                                            top,
                                            left,
                                            component: <LoadInformation refGrab={refLoadInformationGrabber} origin={props.origin} />
                                        }
                                    ]

                                    break;
                                default:
                                    break;
                            }
                        } else {
                            switch (widgetName) {
                                case 'load information':
                                    _widgets = [
                                        ..._widgets,
                                        {
                                            widget_id: widget.id,
                                            top: 100,
                                            left: 100,
                                            component: <LoadInformation refGrab={refLoadInformationGrabber} origin={props.origin} />
                                        }
                                    ]

                                    axios.post(props.serverUrl + '/saveWidget', {
                                        user_code_id: userCodeId,
                                        widget_id: widget.id,
                                        top: 100,
                                        left: 100
                                    })

                                    break;
                                default:
                                    break;
                            }
                        }

                        return widget;
                    })

                    setWidgets(_widgets)
                }
            }).catch(e => {
                console.log('Error getting widgets', e);
            })
        }
    }, [props.user]);

    const transitionWidgets = useTransition(widgets, {
        from: item => {
            return {
                x: '0px',
                y: '-20px',
                opacity: 0,
                transform: item.scale || 'scale(1)'
            }
        },
        enter: item => async (next) => {
            await next({
                x: '0px',
                y: '0px',
                opacity: 1,
                transform: 'scale(1)',
                delay: item.delay || 10,
                config: { duration: item.duration || 400 }
            })
        }

    })

    return (
        <div
            className='company-home-container'
            tabIndex={-1}
            onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {
                    if (e.target.type === undefined) {
                        e.preventDefault();
                        // refCustomerCode.current.focus();
                    }
                }
            }}
        >
            <div className="widgets-container">
                {
                    transitionWidgets((style, item) => item &&
                        <Draggable
                            key={item.widget_id}
                            axis='both'
                            defaultPosition={{ x: item.left, y: item.top }}
                            handle='.drag-widget'
                            onDrag={(_, data) => {
                                if (refLoadInformationGrabber.current) {
                                    refLoadInformationGrabber.current.style.cursor = 'grabbing';
                                }
                            }}
                            onStop={(_, data) => {
                                axios.post(props.serverUrl + '/saveWidget', {
                                    user_code_id: props.user.user_code.id,
                                    widget_id: item.widget_id,
                                    top: data.y,
                                    left: data.x
                                })

                                if (refLoadInformationGrabber.current) {
                                    refLoadInformationGrabber.current.style.cursor = 'grab';
                                }
                            }}
                        >
                            <animated.div style={style}>
                                {item.component}
                            </animated.div>
                        </Draggable>
                    )
                }

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.systemReducers.user,
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        mainCompanyScreenFocused: state.companyReducers.mainCompanyScreenFocused,
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selectedCompany: state.companySetupReducers.selectedCompany,
    }
}

export default connect(mapStateToProps, {
    setUser,
    setSelectedPageIndex,
    setMainCompanyScreenFocused,
    setLoginScreenFocused
})(CompanyHome)
