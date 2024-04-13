import React from "react";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import MaskedInput from "react-text-mask";
import './SelectPhoneBox.css';
import PropTypes from 'prop-types';

/**
 * This phone selection box component provides an interface for the user to select a phone number
 * from a dropdown list and also allows manual input of phone numbers. The component is designed
 * to be customizable and supports various configurations and styles.
 * @param refs - References to DOM elements within the component.
 * @param isShowing - State indicating whether the dropdown list is visible.
 * @param setIsShowing - Function to set the visibility state of the dropdown list.
 * @param transitionFromTop - Initial position of the enter animation.
 * @param transitionEnterTop - Final position of the enter animation.
 * @param transitionLeaveTop - Final position of the leave animation.
 * @param disabled - State indicating whether the component is disabled.
 * @param className - Additional CSS classes for the component.
 * @param boxStyle - CSS styles for the selection box container.
 * @param wrapperStyle - CSS styles for the selection box wrapper.
 * @param placeholderFixed - State indicating whether the placeholder is fixed.
 * @param placeholder - Placeholder text.
 * @param tabIndex - Tab index of the component.
 * @param inputStyle - CSS styles for the input field.
 * @param readOnly - State indicating whether the input field is read-only.
 * @param isDropdownEnabled - State indicating whether the dropdown list is enabled.
 * @param items - List of items to display in the dropdown list.
 * @param setItems - Function to set the items for the dropdown list.
 * @param onEnter - Callback function when Enter key is pressed.
 * @param avoidCheckItemsOnTab - State indicating whether items should be checked on tab.
 * @param onTab - Callback function when Tab key is pressed.
 * @param triggerField - Numeric value that indicates whether the field should trigger the saving action (0=disabled, 1=enabled).
 * @param validateToSave - Validation function before saving.
 * @param onBlur - Callback function when focus is lost.
 * @param onInput - Callback function when text is input.
 * @param onChange - Callback function when value changes.
 * @param value - Value of the input field.
 * @param primaryPhone - Primary phone number (work|fax|mobile|direct|other).
 * @param phoneTypeStyles - CSS styles for phone types.
 * @param popupStyle - CSS styles for the dropdown list container.
 * @param onDropdownClick - Callback function when dropdown button is clicked.
 * @param onPopupClick - Callback function when an item in the dropdown list is clicked.
 * @param popupId - ID of the dropdown list container.
 * @param popupPosition - Position of the dropdown list.
 * @param getItems - Callback function to get the list of items.
 * @returns {Element}
 * @constructor
 */
function SelectPhoneBox(
    {
        refs = {
            refInput: null,
            refPopupItems: null,
            refDropdown: null
        },
        isShowing = true,
        setIsShowing = () => {},
        transitionFromTop = 'calc(100% + 7px)',
        transitionEnterTop = 'calc(100% + 12px)',
        transitionLeaveTop = 'calc(100% + 7px)',
        disabled = false,
        className = '',
        boxStyle = {},
        wrapperStyle = {},
        placeholderFixed = false,
        placeholder = '',
        tabIndex = 0,
        inputStyle = {},
        readOnly = false,
        isDropdownEnabled = true,
        items = [],
        setItems = () => {},
        onEnter = () => {},
        avoidCheckItemsOnTab = false,
        onTab = () => {},
        triggerField = 0,
        validateToSave = () => {},
        onBlur = () => {},
        onInput = () => {},
        onChange = () => {},
        value = '',
        primaryPhone = '',
        phoneTypeStyles = {},
        popupStyle = {},
        onDropdownClick = () => {},
        onPopupClick = () => {},
        popupId = '',
        popupPosition = '',
        getItems = () => {}
    }
) {
    const { refInput, refPopupItems, refDropdown } = refs;

    const popupTransition = useTransition(isShowing, {
        from: { opacity: 0, top: transitionFromTop },
        enter: { opacity: 1, top: transitionEnterTop },
        leave: { opacity: 0, top: transitionLeaveTop },
        config: { duration: 100 },
        reverse: isShowing,
    });

    return (
        <div className={`select-box-container phone-box ${className || ''}`} style={{
            pointerEvents: disabled ? 'none' : 'all',
            userSelect: disabled ? 'none' : 'all',
            ...boxStyle
        }}>
            <div className="select-box-wrapper" style={{
                gap: 7,
                backgroundColor: disabled ? 'rgba(0,0,0,0.01)' : 'white',
                ...wrapperStyle
            }}>
                {
                    placeholderFixed &&
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                    }}>{placeholder}</div>
                }
                <MaskedInput
                    type="text"
                    mask={[/[0-9]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]}
                    guide={true}
                    tabIndex={tabIndex}
                    style={{ ...(inputStyle || {}) }}
                    placeholder={placeholderFixed ? '' : placeholder}
                    ref={refInput}
                    readOnly={readOnly}
                    onKeyDown={e => {
                        let key = e.key.toLowerCase();

                        switch (key) {
                            case 'arrowleft':
                            case 'arrowup': // arrow left | arrow up
                                if (isDropdownEnabled) {
                                    e.preventDefault();
                                    if (isShowing) {
                                        let selectedIndex = items.findIndex(item => item.selected);

                                        if (selectedIndex === -1) {
                                            setItems(
                                                items.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                })
                                            );
                                        } else {
                                            setItems(
                                                items.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === items.length - 1;
                                                    } else {
                                                        item.selected = index === selectedIndex - 1;
                                                    }
                                                    return item;
                                                })
                                            );
                                        }

                                        refPopupItems.current.map((r) => {
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
                                        getItems();
                                    }
                                }
                                break;

                            case 'arrowright':
                            case 'arrowdown': // arrow right | arrow down
                                if (isDropdownEnabled) {
                                    e.preventDefault();
                                    if (isShowing) {
                                        let selectedIndex = items.findIndex(item => item.selected);

                                        if (selectedIndex === -1) {
                                            setItems(
                                                items.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                })
                                            );
                                        } else {
                                            setItems(
                                                items.map((item, index) => {
                                                    if (selectedIndex === items.length - 1) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === selectedIndex + 1;
                                                    }
                                                    return item;
                                                })
                                            );
                                        }

                                        refPopupItems.current.map((r) => {
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
                                        getItems();
                                    }
                                }
                                break;

                            case 27: // escape
                                setIsShowing(false);
                                e.stopPropagation();
                                break;

                            case 13: // enter
                                onEnter();
                                break;

                            case 9: // tab
                                if (avoidCheckItemsOnTab) {
                                    onTab(e);
                                } else {
                                    if (isShowing) {
                                        e.preventDefault();
                                        onTab(e);
                                    } else {
                                        if (triggerField === 1) {
                                            validateToSave(e);
                                        }
                                    }
                                }

                                break;
                            default:
                                break;
                        }
                    }}
                    onBlur={e => {
                        onBlur(e);
                    }}
                    onInput={e => {
                        onInput(e);
                    }}
                    onChange={e => {
                        onChange(e);
                    }}
                    value={value}
                />
                {(primaryPhone !== '' && (value || '').trim() !== '') && (
                    <div className={classnames({
                        "selected-contact-primary-phone": true,
                        'pushed': isDropdownEnabled && primaryPhone !== ''
                    })} style={{ ...phoneTypeStyles }}>
                        {primaryPhone}
                    </div>
                )}
                {isDropdownEnabled && (
                    <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={() => {
                            if (isShowing) {
                                setIsShowing(false);
                            } else {
                                onDropdownClick();
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
                            id={`mochi-contextual-container-${popupId}`}
                            style={{
                                ...style,
                                left: "-50%",
                                display: "block",
                                ...popupStyle,
                            }}
                            ref={refDropdown}
                        >
                            <div
                                className={`mochi-contextual-popup ${popupPosition}`}
                                style={{
                                    height: popupStyle?.height || 150,
                                }}
                            >
                                <div className="mochi-contextual-popup-content">
                                    <div className="mochi-contextual-popup-wrapper">
                                        {items.map((item, index) => {
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
                                                        onPopupClick(item)
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

SelectPhoneBox.propTypes = {
    refs: PropTypes.object,
    isShowing: PropTypes.bool,
    setIsShowing: PropTypes.func,
    transitionFromTop: PropTypes.string,
    transitionEnterTop: PropTypes.string,
    transitionLeaveTop: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    boxStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    placeholderFixed: PropTypes.bool,
    placeholder: PropTypes.string,
    tabIndex: PropTypes.number,
    inputStyle: PropTypes.object,
    readOnly: PropTypes.bool,
    isDropdownEnabled: PropTypes.bool,
    items: PropTypes.array,
    setItems: PropTypes.func,
    onEnter: PropTypes.func,
    avoidCheckItemsOnTab: PropTypes.bool,
    onTab: PropTypes.func,
    triggerField: PropTypes.number,
    validateToSave: PropTypes.func,
    onBlur: PropTypes.func,
    onInput: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    primaryPhone: PropTypes.string,
    phoneTypeStyles: PropTypes.object,
    popupStyle: PropTypes.object,
    onDropdownClick: PropTypes.func,
    onPopupClick: PropTypes.func,
    popupId: PropTypes.string,
    popupPosition: PropTypes.string,
    getItems: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
    };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(SelectPhoneBox);
