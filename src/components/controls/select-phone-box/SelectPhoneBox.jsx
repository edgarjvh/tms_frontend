import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import MaskedInput from "react-text-mask";
import './SelectPhoneBox.css';

function SelectPhoneBox(props) {
    const { refInput, refPopupItems, refDropdown } = props.refs;

    const popupTransition = useTransition(props.isShowing, {
        from: { opacity: 0, top: props.transitionFromTop || "calc(100% + 7px)" },
        enter: { opacity: 1, top: props.transitionEnterTop || "calc(100% + 12px)" },
        leave: { opacity: 0, top: props.transitionLeaveTop || "calc(100% + 7px)" },
        config: { duration: 100 },
        reverse: props.isShowing,
    });

    return (
        <div className={`select-box-container phone-box ${props.className || ''}`} style={{
            pointerEvents: props.disabled ? 'none' : 'all',
            userSelect: props.disabled ? 'none' : 'all',
            ...(props.boxStyle || {})
        }}>
            <div className="select-box-wrapper" style={{
                gap: 7,
                backgroundColor: props.disabled ? 'rgba(0,0,0,0.01)' : 'white',
                ...(props.wrapperStyle || {})
            }}>
                {
                    props.placeholderFixed &&
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>{props.placeholder}</div>
                }
                <MaskedInput
                    type="text"
                    mask={[/[0-9]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]}
                    guide={true}
                    tabIndex={props.tabIndex || 0}
                    style={{ ...(props.inputStyle || {}) }}
                    placeholder={props.placeholderFixed ? '' : props.placeholder}
                    ref={refInput}
                    readOnly={props.readOnly}
                    onKeyDown={async e => {
                        let key = e.keyCode || e.which;

                        switch (key) {
                            case 37:
                            case 38: // arrow left | arrow up
                                if (props.isDropdownEnabled) {
                                    e.preventDefault();
                                    if (props.isShowing) {
                                        let selectedIndex = (props.items || []).findIndex(item => item.selected);

                                        if (selectedIndex === -1) {
                                            await props.setItems(
                                                (props.items || []).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                })
                                            );
                                        } else {
                                            await props.setItems(
                                                (props.items || []).map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (props.items || []).length - 1;
                                                    } else {
                                                        item.selected = index === selectedIndex - 1;
                                                    }
                                                    return item;
                                                })
                                            );
                                        }

                                        refPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    } else {
                                        props.getItems();
                                    }
                                }
                                break;

                            case 39:
                            case 40: // arrow right | arrow down
                                if (props.isDropdownEnabled) {
                                    e.preventDefault();
                                    if (props.isShowing) {
                                        let selectedIndex = (props.items || []).findIndex(item => item.selected);

                                        if (selectedIndex === -1) {
                                            await props.setItems(
                                                (props.items || []).map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                })
                                            );
                                        } else {
                                            await props.setItems(
                                                (props.items || []).map((item, index) => {
                                                    if (selectedIndex === (props.items || []).length - 1) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === selectedIndex + 1;
                                                    }
                                                    return item;
                                                })
                                            );
                                        }

                                        refPopupItems.current.map((r, i) => {
                                            if (r && r.classList.contains("selected")) {
                                                r.scrollIntoView({
                                                    behavior: "auto",
                                                    block: "center",
                                                    inline: "nearest",
                                                });
                                            }
                                            return true;
                                        });
                                    } else {
                                        props.getItems();
                                    }
                                }
                                break;

                            case 27: // escape
                                props.setIsShowing(false);
                                e.stopPropagation();
                                break;

                            case 13: // enter
                                props.onEnter();
                                break;

                            case 9: // tab
                                if (props.avoidCheckItemsOnTab) {
                                    props.onTab(e);
                                } else {
                                    if (props.isShowing) {
                                        e.preventDefault();
                                        props.onTab(e);
                                    } else {
                                        if (props.triggerField === 1) {
                                            props.validateToSave(e);
                                        }
                                    }
                                }

                                break;

                            default:
                                break;
                        }
                    }}
                    onBlur={e => {
                        props.onBlur(e);
                    }}
                    onInput={e => {
                        props.onInput(e);
                    }}
                    onChange={e => {
                        props.onChange(e);
                    }}
                    value={props.value}
                />
                {((props.primaryPhone || '') !== '' && (props.value || '').trim() !== '') && (
                    <div className={classnames({
                        "selected-contact-primary-phone": true,
                        'pushed': (props.primaryPhone || '') !== ''
                    })} style={{ ...(props.phoneTypeStyles || {}) }}>
                        {(props.primaryPhone || '')}
                    </div>
                )}
                {props.isDropdownEnabled && (
                    <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={(e) => {

                            if (props.isShowing) {
                                props.setIsShowing(false);
                            } else {
                                props.onDropdownClick(e);
                            }
                            refInput.current.inputElement.focus();
                        }}
                    />
                )}
            </div>
            {popupTransition(
                (style, item) =>
                    item && (
                        <animated.div
                            className="mochi-contextual-container"
                            id={`mochi-contextual-container-${props.popupId || "id"}`}
                            style={{
                                ...style,
                                left: "-50%",
                                display: "block",
                                ...(props.popupStyle || {}),
                            }}
                            ref={refDropdown}
                        >
                            <div
                                className={`mochi-contextual-popup ${props.popupPosition || ""}`}
                                style={{
                                    height: props.popupStyle?.height || 150,
                                }}
                            >
                                <div className="mochi-contextual-popup-content">
                                    <div className="mochi-contextual-popup-wrapper">
                                        {(props.items || []).map((item, index) => {
                                            const mochiItemClasses = classnames({
                                                "mochi-item": true,
                                                selected: item.selected,
                                            });

                                            return (
                                                <div
                                                    key={index}
                                                    className={mochiItemClasses}
                                                    id={item.id || ""}
                                                    onClick={() => {
                                                        props.onPopupClick(item)
                                                    }}
                                                    ref={(element) => refPopupItems.current.push(element)}
                                                >
                                                    {item.selected && <FontAwesomeIcon className="dropdown-selected"
                                                        icon={faCaretRight} />}
                                                    <span className='phone-type'>{(item?.type || '') === 'work'
                                                        ? 'Phone Work'
                                                        : (item?.type || '') === 'fax'
                                                            ? 'Phone Work Fax'
                                                            : (item?.type || '') === 'mobile'
                                                                ? 'Phone Mobile'
                                                                : (item?.type || '') === 'direct'
                                                                    ? 'Phone Direct'
                                                                    : (item?.type || '') === 'other'
                                                                        ? 'Phone Other'
                                                                        : ''
                                                    }</span> (<span className='phone-text'>{item?.phone || ''}</span>)
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    )
            )}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
    };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(SelectPhoneBox);
