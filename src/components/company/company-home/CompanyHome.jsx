import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './CompanyHome.css';

const CompanyHome = (props) => {
    const refEmail = useRef();
    const refPass = useRef();

    const [loginData, setLoginData] = useState({
        userType: 'employee'
    });
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <div className="login-main-container">
                <div className="login-main-container-wrapper">
                    <div className="login-form-container">
                        <div className="company-logo">
                            <img src='img/et3_logo.png' alt="Company Logo" />
                        </div>

                        <div className="company-name">ET3 Logistics LLC</div>

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
                                <input tabIndex={1 + props.tabTimes} type="text" placeholder="E-mail" id="txt-email"
                                    style={{
                                        textTransform: 'lowercase'
                                    }}
                                    ref={refEmail}
                                    readOnly={isLoading}
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
                                <input tabIndex={2 + props.tabTimes} type="password" placeholder="Password" id="txt-password"
                                    ref={refPass}
                                    readOnly={isLoading}
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
                            <div className="mochi-button" onClick={() => {

                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Log In</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>

                        <div className="forgot-password-row">
                            <a href="#">Forgot your password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(null, null)(CompanyHome)
