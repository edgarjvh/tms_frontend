import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

function TextInput(props) {
    const { refInput } = props.refs;

    return (
        <div className={`input-box-container ${props.className || ''}`} style={{
            pointerEvents: props.disabled ? 'none' : 'all',
            backgroundColor: props.disabled ? 'rgba(0,0,0,0.01)' : 'white',
            userSelect: props.disabled ? 'none' : 'all',
            ...(props.containerStyle || {})
        }}>
            {
                props.fixedPlaceholder &&
                <label
                    htmlFor={props.id || ''}
                    style={{ ...(props.placeholderStyle || {}) }}
                >
                    {props.placeholder || ''}
                </label>
            }

            {
                (props.isDataSplitted && (props.dataToSplit || '').trim() !== '') &&
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    {
                        (props.dataToSplit || '').toString().split('|').map((item, index) => {
                            if (item.trim() !== '') {
                                return (
                                    <div key={index} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.7rem",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        padding: "2px 10px",
                                        borderRadius: "10px",
                                        marginRight: "2px",
                                        cursor: "default",
                                    }}
                                        title={item}
                                    >
                                        <span className="fas fa-trash-alt" style={{
                                            marginRight: "5px",
                                            cursor: "pointer"
                                        }} onClick={() => {
                                            props.removeItem(item);
                                        }}
                                        ></span>

                                        <span className="automatic-email-inputted" style={{ whiteSpace: "nowrap" }}>{item}</span>
                                    </div>)
                            } else {
                                return ''
                            }

                        })
                    }
                </div>
            }

            <input
                ref={refInput}
                type="text"
                id={props.id || ''}
                tabIndex={props.tabIndex || 0}
                maxLength={props.maxLength || 1000}
                readOnly={props.readOnly}
                placeholder={props.fixedPlaceholder ? '' : (props.placeholder || '')}
                style={{ ...(props.inputStyle || {}) }}
                value={props.value || ''}
                onChange={props.onChange}
                onInput={props.onInput}
                onKeyDown={props.onKeyDown}
                onBlur={props.onBlur}
                autoFocus={props.autoFocus}
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
    };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(TextInput);