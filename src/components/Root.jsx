import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Company from './company/Company.jsx';
import Admin from './admin/Admin.jsx';
import Login from './company/panels/login/Login';
import './Root.css';
import classnames from 'classnames';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import {
    setSelectedCompany,
    setUser,
    setMainScreen,
    setLoginMessage
} from './../actions';
import { HotkeysProvider } from 'react-hotkeys-hook';

function Root(props) {
    const [isLoading, setIsLoading] = useState(true);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    useEffect(() => {
        function checkUser() {
            axios.post(props.serverUrl + '/getCompanyById', { id: props.companyId }).then(async res => {
                if (res.data.result === 'OK') {
                    props.setSelectedCompany(res.data.company);

                    axios.get(props.serverUrl + '/user', {
                        withCredentials: true
                    }).then(res => {
                        props.setUser(res.data);

                    }).catch((error) => {
                        props.setUser({});
                        props.setMainScreen('company');
                        console.error(error.response);
                    }).finally(() => {
                        setIsLoading(false);
                    });
                }
            }).catch(error => {
                console.log(error)
            });
        }

        checkUser();
    }, []);

    const rootCls = classnames({
        'root-container': true
    });

    const companyClasses = classnames({
        'is-shown': props.mainScreen === 'company',
        'main-screen-container': true
    })

    const adminClasses = classnames({
        'is-shown': props.mainScreen === 'admin',
        'main-screen-container': true
    })

    return (
        <div className={rootCls}>
            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                            <div style={{ marginLeft: 10 }}>Loading System Data...</div>
                        </div>
                    </animated.div>
                )
            }

            {
                !isLoading ?
                    ((props.user?.id || 0) > 0)
                        ?
                        <HotkeysProvider initiallyActiveScopes={['company']}>
                            <div>
                                <Company className={companyClasses} />
                                <Admin className={adminClasses} />
                            </div>
                        </HotkeysProvider>
                        :
                        <Login />
                    : ''
            }

            {
                isLoading &&
                <img src="/img/anchor_logo.png" alt="" style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    transform: 'scale(1.5)'

                }} />
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        companyId: state.systemReducers.companyId,
        user: state.systemReducers.user,
        serverUrl: state.systemReducers.serverUrl,
        mainScreen: state.systemReducers.mainScreen
    }
}

export default connect(mapStateToProps, {
    setMainScreen,
    setSelectedCompany,
    setUser,
    setMainScreen,
    setLoginMessage
})(Root)