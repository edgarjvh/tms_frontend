import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './Login.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import {
    setUser,
    setSelectedPageIndex,
    setMainCompanyScreenFocused
} from './../../../../actions';

const Login = (props) => {
    const refEmail = useRef();
    const refPass = useRef();
    const [message, setMessage] = useState('');

    const [loginData, setLoginData] = useState({
        userType: 'employee',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    useEffect(() => {
        if (props.screenFocused) {
            if ((props.user?.id || 0) === 0) {
                refEmail.current.focus({
                    preventScroll: true
                });
            }
        }
    }, [props.screenFocused])

    const submitLogin = (e = null) => {
        const { userType, email, password } = loginData;

        if (userType !== 'employee' && userType !== 'agent') {
            window.alert('You must select the user type!');
            return;
        }

        if (email.trim() === '') {
            window.alert('You must enter the email!');
            refEmail.current.focus();
            return;
        }

        if (password.trim() === '') {
            window.alert('You must enter the password!');
            refPass.current.focus();
            return;
        }

        setIsLoading(true);
        setMessage('');

        axios.post(props.serverUrl + '/login', loginData, {
            withCredentials: true
        }).then(res => {
            window.location.reload();
            // props.setUser(res.data.user);
            // setLoginData({
            //     userType: 'employee',
            //     email: '',
            //     password: ''
            // });
            // setIsLoading(false);
            // setMessage('');
        }).catch(error => {
            setIsLoading(false);
            props.setUser({});
            setLoginData({
                userType: 'employee',
                email: '',
                password: ''
            });
            console.error(error.response);
            setMessage(error.response.data.message);
            refEmail.current.focus();
        });
    }

    const forgotPasswordClick = () => {
        axios.get(props.serverUrl + '/user', {
            withCredentials: true
        }).then(res => {
            console.log(res);
        }).catch((error) => {
            props.setUser({});
        });
    }

    return (
        <div className="login-main-container">
            <div className="login-main-container-wrapper">
                <div className="login-form-container">
                    {
                        loadingTransition((style, item) => item &&
                            <animated.div className='loading-container' style={style} >
                                <div className="loading-container-wrapper" style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    paddingBottom: 5,
                                    paddingLeft: 10
                                }}>
                                    <Loader type="Circles" color="#009bdd" height={20} width={20} visible={item} />
                                </div>
                            </animated.div>
                        )
                    }

                    <div className="company-logo">
                        <img src={((props.selectedCompany?.id || 0) > 0 && (props.selectedCompany?.logo || '') !== '') ? props.serverUrl + '/company-logo/' + props.selectedCompany.logo : 'img/company-logo-default.png'} alt="Company Logo" />
                    </div>

                    <div className="company-name">{props.selectedCompany?.name || ''}</div>

                    <div className="user-type-row">
                        <div className="user-type employee">
                            <input type="radio" name="user-type" id="user-type-employee" checked={(loginData?.userType || '') === 'employee'} onChange={(e) => {
                                setLoginData(loginData => {
                                    return {
                                        ...loginData,
                                        userType: e.target.checked && 'employee'
                                    }
                                })
                            }} />
                            <label htmlFor="user-type-employee">Employee</label>
                        </div>

                        <div className="user-type agent">
                            <input type="radio" name="user-type" id="user-type-agent" checked={(loginData?.userType || '') === 'agent'} onChange={(e) => {
                                setLoginData(loginData => {
                                    return {
                                        ...loginData,
                                        userType: e.target.checked && 'agent'
                                    }
                                })
                            }} />
                            <label htmlFor="user-type-agent">Agent</label>
                        </div>
                    </div>

                    <div className="login-form">
                        <div className="input-box-container">
                            <input tabIndex={1} type="text" placeholder="E-mail" id="txt-email"
                                style={{
                                    textTransform: 'lowercase'
                                }}
                                ref={refEmail}
                                readOnly={isLoading}
                                onKeyDown={e => {
                                    let key = e.keyCode || e.which;

                                    if (key === 13) {
                                        submitLogin();
                                    }
                                }}
                                onInput={e => {
                                    setLoginData(loginData => {
                                        return {
                                            ...loginData,
                                            email: e.target.value
                                        }
                                    })
                                }}
                                onChange={e => {
                                    setLoginData(loginData => {
                                        return {
                                            ...loginData,
                                            email: e.target.value
                                        }
                                    })
                                }}
                                value={loginData?.email || ''} />
                        </div>

                        <div className="input-box-container">
                            <input tabIndex={2} type="password" placeholder="Password" id="txt-password"
                                ref={refPass}
                                readOnly={isLoading}
                                onKeyDown={e => {
                                    let key = e.keyCode || e.which;

                                    if (key === 13) {
                                        submitLogin();
                                    }
                                }}
                                onInput={e => {
                                    setLoginData(loginData => {
                                        return {
                                            ...loginData,
                                            password: e.target.value
                                        }
                                    })
                                }}
                                onChange={e => {
                                    setLoginData(loginData => {
                                        return {
                                            ...loginData,
                                            password: e.target.value
                                        }
                                    })
                                }}
                                value={loginData?.password || ''} />
                        </div>
                    </div>

                    <div className="login-button-row">
                        <div className="mochi-button" onClick={submitLogin}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Log In</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>

                    <div className="forgot-password-row">
                        <div className="login-message">{message}</div>
                        <a href="#">Forgot your password?</a>
                    </div>
                </div>
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
    setMainCompanyScreenFocused
})(Login)