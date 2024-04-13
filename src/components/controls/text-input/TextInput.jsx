import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';

function TextInput(
    {
        id = '',
        refs = {
            refInput: null
        },
        type = 'text',
        className = '',
        disabled = false,
        boxStyle = {},
        fixedPlaceholder = false,
        placeholderStyle = {},
        placeholder = '',
        isDataSplitted = false,
        dataToSplit = '',
        removeItem = () => {},
        tabIndex = 0,
        maxLength = 1000,
        readOnly = false,
        inputStyle = {},
        value = '',
        onChange = () => {},
        onInput = () => {},
        onKeyDown = () => {},
        onBlur = () => {},
        autoFocus = false
    }
) {
    const {refInput} = refs;

    return (
        <div className={`input-box-container ${className || ''}`} style={{
            pointerEvents: disabled ? 'none' : 'all',
            backgroundColor: disabled ? 'rgba(0,0,0,0.01)' : 'white',
            userSelect: disabled ? 'none' : 'all',
            ...boxStyle
        }}>
            {
                fixedPlaceholder &&
                <label
                    htmlFor={id }
                    style={{...placeholderStyle}}
                >
                    {placeholder}
                </label>
            }

            {
                (isDataSplitted && dataToSplit.trim() !== '') &&
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    {
                        dataToSplit.toString().split('|').map((item, index) => {
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
                                            removeItem(item);
                                        }}
                                        ></span>

                                        <span className="automatic-email-inputted"
                                              style={{whiteSpace: "nowrap"}}>{item}</span>
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
                type={type}
                id={id}
                tabIndex={tabIndex}
                maxLength={maxLength}
                readOnly={readOnly}
                placeholder={fixedPlaceholder ? '' : placeholder}
                style={{...inputStyle}}
                value={value}
                onChange={onChange}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                autoFocus={autoFocus}
            />
        </div>
    )
}

TextInput.propTypes = {
    id: PropTypes.string,
    refs: PropTypes.object,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    boxStyle: PropTypes.object,
    fixedPlaceholder: PropTypes.bool,
    placeholderStyle: PropTypes.object,
    placeholder: PropTypes.string,
    isDataSplitted: PropTypes.string,
    dataToSplit: PropTypes.string,
    removeItem: () => {},
    tabIndex: PropTypes.number,
    maxLength: PropTypes.number,
    readOnly: PropTypes.bool,
    inputStyle: PropTypes.object,
    onChange: () =>  {},
    onInput: () =>  {},
    onKeyDown: () =>  {},
    onBlur: () =>  {},
    value: PropTypes.string,
    autoFocus: PropTypes.bool
}

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
    };
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(TextInput);