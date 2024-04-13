import React from "react";
import {connect} from "react-redux";
import {useTransition, animated} from "react-spring";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import './SelectBox.css';
import PropTypes from 'prop-types';

/**
 * @param {object} options - The options for the SelectBox component.
 * @param {string} [options.placeholder='Type'] - The placeholder text for the input field.
 * @param {string} [options.popupId=''] - The id of the popup container.
 * @param {number} [options.tabIndex=0] - The tab index for the input field.
 * @param {object} [options.placeholderStyle={}] - The CSS styles for the fixed placeholder.
 * @param {object} [options.boxStyle={}] - The CSS styles for the select box container.
 * @param {object} [options.inputStyle={}] - The CSS styles for the input field.
 * @param {object} [options.popupStyle={}] - The CSS styles for the popup container.
 * @param {object} [options.refs={}] - The ref objects for the input field, popup items, and dropdown button.
 * @param {boolean} [options.readOnly=false] - True if the input field should be read-only, false otherwise.
 * @param {boolean} [options.isDropdownEnabled=true] - True if the dropdown button is enabled, false otherwise.
 * @param {string} [options.popupPosition='vertical below'] - The position of the popup container.
 * @param {function} [options.onEnter=()=>{}] - The callback function for the enter key event.
 * @param {function} [options.onTab=()=>{}] - The callback function for the tab key event.
 * @param {function} [options.onBlur=()=>{}] - The callback function for the blur event.
 * @param {function} [options.onInput=()=>{}] - The callback function for the input event.
 * @param {function} [options.onChange=()=>{}] - The callback function for the change event.
 * @param {string} [options.value=''] - The current value of the input field.
 * @param {array} [options.items=[]] - The list of items for the dropdown menu.
 * @param {function} [options.getItems=()=>{}] - The function to get the list of items for the dropdown menu.
 * @param {function} [options.setItems=()=>{}] - The function to set the list of items for the dropdown menu.
 * @param {function} [options.onDropdownClick=()=>{}] - The callback function for the dropdown item click event.
 * @param {function} [options.onPopupClick=()=>{}] - The callback function for the popup item click event.
 * @param {string} [options.transitionFromTop='calc(100% + 7px)'] - The initial position of the popup container.
 * @param {string} [options.transitionEnterTop='calc(100% + 12px)'] - The position of the popup container when entering.
 * @param {string} [options.transitionLeaveTop='calc(100% + 7px)'] - The position of the popup container when leaving.
 * @param {string} [options.className=''] - The additional class name for the select box container.
 * @param {boolean} [options.disabled=false] - True if the select box is disabled, false otherwise.
 * @param {boolean} [options.placeholderFixed=false] - True if the placeholder is fixed, false otherwise.
 * @param {boolean} [options.noStopPropagationOnEsc=false] - True if the ESC key event should not propagate, false otherwise.
 * @param {boolean} [options.avoidCheckItemsOnTab=false] - True if the items should not be checked on tab key event, false otherwise.
 * @param {number} [options.triggerField=0] - The trigger field for the tab key event.
 * @param {function} [options.validateToSave=()=>{}] - The function to validate before saving.
 * @param {string} [options.labelType='default'] - The type of label to display for each item (name, contact_first_last, default).
 * @param {string} [options.showHandler='array'] - The way to handle showing the popup items (by array or by a boolean value).
 * @param {boolean} [options.showValue=false] - The value used to show/hide the popup items when the showHandler is set to a boolean value.
 * @param {string} [options.title=''] - The title of the input.
 * @returns {JSX.Element} The SelectBox component.
 */
function SelectBox(
    {
        placeholder = 'Type',
        popupId = '',
        tabIndex = 0,
        placeholderStyle = {},
        boxStyle = {},
        inputStyle = {},
        popupStyle = {},
        refs = {
            refInput: null,
            refPopupItems: null,
            refDropdown: null
        },
        readOnly = false,
        isDropdownEnabled = true,
        popupPosition = 'vertical below',
        onEnter = () => {
        },
        onTab = () => {
        },
        onBlur = () => {
        },
        onInput = () => {
        },
        onChange = () => {
        },
        value = '',
        items = [],
        getItems = () => {
        },
        setItems = () => {
        },
        onDropdownClick = () => {
        },
        onPopupClick = () => {
        },
        transitionFromTop = 'calc(100% + 7px)',
        transitionEnterTop = 'calc(100% + 12px)',
        transitionLeaveTop = 'calc(100% + 7px)',
        className = '',
        disabled = false,
        placeholderFixed = false,
        noStopPropagationOnEsc = false,
        avoidCheckItemsOnTab = false,
        triggerField = 0,
        validateToSave = () => {
        },
        labelType = 'default',
        showHandler = 'array',
        showValue = false,
        title = ''
    }) {
    const {refInput, refPopupItems, refDropdown} = refs;

    const popupTransition = useTransition(isDropdownEnabled && (showHandler === 'array' ? items.length > 0 : showValue), {
        from: {opacity: 0, top: transitionFromTop},
        enter: {opacity: 1, top: transitionEnterTop},
        leave: {opacity: 0, top: transitionLeaveTop},
        config: {duration: 100},
        reverse: isDropdownEnabled && (showHandler === 'array' ? items.length > 0 : showValue)
    });

    return <div className={`select-box-container ${className}`} style={{
        pointerEvents: disabled ? "none" : "all",
        userSelect: disabled ? 'none' : 'all',
        ...boxStyle
    }}>
        <div className="select-box-wrapper" style={{
            gap: 7,
            backgroundColor: disabled ? 'rgba(0,0,0,0.01)' : 'white'
        }}>
            {
                placeholderFixed &&
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    ...placeholderStyle
                }}>{placeholder}</div>
            }
            <input
                type="text"
                tabIndex={tabIndex}
                style={{...inputStyle}}
                title={title}
                placeholder={placeholderFixed ? '' : placeholder}
                ref={refInput}
                readOnly={readOnly}
                onKeyDown={async e => {
                    let key = e.key.toLowerCase();

                    switch (key) {
                        case 'arrowleft':
                        case 'arrowup':
                            if (isDropdownEnabled) {
                                e.preventDefault();
                                if (items.length > 0) {
                                    let selectedIndex = items.findIndex(item => item.selected);

                                    if (selectedIndex === -1) {
                                        await setItems(
                                            items.map((item, index) => {
                                                item.selected = index === 0;
                                                return item;
                                            })
                                        );
                                    } else {
                                        await setItems(
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
                        case 'arrowdown':
                            if (isDropdownEnabled) {
                                e.preventDefault();
                                if (items.length > 0) {
                                    let selectedIndex = items.findIndex(item => item.selected);

                                    if (selectedIndex === -1) {
                                        await setItems(
                                            items.map((item, index) => {
                                                item.selected = index === 0;
                                                return item;
                                            })
                                        );
                                    } else {
                                        await setItems(
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

                        case 'escape':
                            if (!noStopPropagationOnEsc) {
                                setItems([]);
                                e.stopPropagation();
                            }

                            break;

                        case 'enter':
                            onEnter();
                            break;

                        case 'tab':
                            if (avoidCheckItemsOnTab) {
                                onTab(e);
                            } else {
                                if (items.length > 0) {
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
            {isDropdownEnabled && <FontAwesomeIcon
                className="dropdown-button"
                icon={faCaretDown}
                onClick={(e) => {
                    window.setTimeout(() => {
                        if (items.length > 0) {
                            setItems([]);
                        } else {
                            onDropdownClick(e);
                        }
                        refInput.current.focus();
                    }, 100)
                }}
            />}
        </div>
        {popupTransition(
            (style, item) =>
                item && <animated.div
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
                                            {
                                                (labelType || 'default') === 'name'
                                                    ? (item?.name || '')
                                                    : (labelType || 'default') === 'contact_first_last'
                                                        ? (item?.first_name || '') + ' ' + (item?.last_name || '')
                                                        : (item?.name || '')
                                            }
                                            {item.selected && <FontAwesomeIcon className="dropdown-selected"
                                                                               icon={faCaretRight}/>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </animated.div>
        )}
    </div>;
}

SelectBox.propTypes = {
    placeholder: PropTypes.string,
    popupId: PropTypes.string,
    tabIndex: PropTypes.number,
    placeholderStyle: PropTypes.object,
    boxStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    popupStyle: PropTypes.object,
    refs: PropTypes.object,
    readOnly: PropTypes.bool,
    isDropdownEnabled: PropTypes.bool,
    popupPosition: PropTypes.string,
    onEnter: PropTypes.func,
    onTab: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onInput: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    items: PropTypes.array,
    getItems: PropTypes.func,
    setItems: PropTypes.func,
    onDropdownClick: PropTypes.func,
    onPopupClick: PropTypes.func,
    transitionFromTop: PropTypes.string,
    transitionEnterTop: PropTypes.string,
    transitionLeaveTop: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    placeholderFixed: PropTypes.bool,
    noStopPropagationOnEsc: PropTypes.bool,
    avoidCheckItemsOnTab: PropTypes.bool,
    triggerField: PropTypes.number,
    validateToSave: PropTypes.func,
    labelType: PropTypes.string,
    showHandler: PropTypes.string,
    showValue: PropTypes.bool,
    title: PropTypes.string
}

const mapStateToProps = state => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
    };
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(SelectBox);
