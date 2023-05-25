import React, { useState, useEffect, useRef } from 'react';
import {connect} from 'react-redux';
// import { Transition, Spring, animated as animated2, config } from 'react-spring/renderprops';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";

function SelectBox(props) {
    const { refInput, refItems, refPopupItems, refDropdown } = props.refs;

    return (
        <div className="select-box-container grow">
            <div className="select-box-wrapper">
                <input
                    style={{
                        textTransform: props.textTransform
                    }}
                    type="text"
                    tabIndex={props.tabIndex || 0}
                    placeholder={props.placeholder}
                    ref={refInput}
                    readOnly={props.readOnly}
                    onKeyDown={async (e) => {
                        let key = e.keyCode || e.which;

                        switch (key) {
                            case 37:
                            case 38: // arrow left | arrow up
                                e.preventDefault();
                                if (props.items.length > 0) {
                                    let selectedIndex = props.items.findIndex((item) => item.selected);

                                    if (selectedIndex === -1) {
                                        await props.setItems(
                                            props.items.map((item, index) => {
                                                item.selected = index === 0;
                                                return item;
                                            })
                                        );
                                    } else {
                                        await props.setItems(
                                            props.items.map((item, index) => {
                                                if (selectedIndex === 0) {
                                                    item.selected =
                                                        index === props.items.length - 1;
                                                } else {
                                                    item.selected =
                                                        index === selectedIndex - 1;
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
                                break;

                            case 39:
                            case 40: // arrow right | arrow down
                                e.preventDefault();
                                if (props.items.length > 0) {
                                    let selectedIndex = props.items.findIndex((item) => item.selected);

                                    if (selectedIndex === -1) {
                                        await props.setItems(props.items.map((item, index) => {
                                            item.selected = index === 0;
                                            return item;
                                        }));
                                    } else {
                                        await props.setItems(props.items.map((item, index) => {
                                            if (selectedIndex === props.items.length - 1) {
                                                item.selected = index === 0;
                                            } else {
                                                item.selected = index === selectedIndex + 1;
                                            }
                                            return item;
                                        }));
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
                                break;

                            case 27: // escape
                                props.setItems([]);
                                break;

                            case 13: // enter
                                props.onEnter();
                                break;

                            case 9: // tab
                                if (props.items.length > 0) {
                                    e.preventDefault();
                                    props.onTab();
                                }
                                break;

                            default:
                                break;
                        }
                    }}
                    onBlur={(e) => props.onBlur(e)}
                    onInput={(e) => props.onInput(e)}
                    onChange={(e) => props.onChange(e)}
                    value={props.value}
                />
                {
                    (props.isAdmin === 1) &&
                    <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        style={{
                            pointerEvents: (props.isAdmin === 1) ? 'all' : 'none'
                        }}
                        onClick={() => props.onDropdownClick()}
                    />
                }
            </div>

            {/* {
                divisionTransition((style, item) => item && (
                    <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-division"
                        style={{
                            ...style,
                            left: "-50%",
                            display: "block",
                        }}
                        ref={refDivisionDropDown}>

                        <div className="mochi-contextual-popup vertical below"
                            style={{ height: 150 }}>
                            <div className="mochi-contextual-popup-content">
                                <div className="mochi-contextual-popup-wrapper">
                                    {props.items.map((item, index) => {
                                        const mochiItemClasses = classnames({
                                            "mochi-item": true,
                                            selected: item.selected,
                                        });

                                        const searchValue = (selectedCustomer?.division?.id || 0) === 0 && (selectedCustomer?.division?.name || "") !== ""
                                            ? selectedCustomer?.division?.name
                                            : undefined;

                                        return (
                                            <div
                                                key={index}
                                                className={mochiItemClasses}
                                                id={item.id}
                                                onClick={() => {
                                                    setSelectedCustomer(selectedCustomer => {
                                                        return {
                                                            ...selectedCustomer,
                                                            division: item,
                                                            division_id: item.id
                                                        }
                                                    })

                                                    window.setTimeout(() => {
                                                        // validateCustomerForSaving({keyCode: 9});
                                                        props.setItems([]);
                                                        refInput.current.focus();
                                                    }, 0);
                                                }}
                                                ref={(ref) => refPopupItems.current.push(ref)}
                                            >
                                                {searchValue === undefined ? (item.name) : (
                                                    <Highlighter
                                                        highlightClassName="mochi-item-highlight-text"
                                                        searchWords={[searchValue]}
                                                        autoEscape={true}
                                                        textToHighlight={item.name}
                                                    />
                                                )}
                                                {item.selected && (
                                                    <FontAwesomeIcon
                                                        className="dropdown-selected"
                                                        icon={faCaretRight}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </animated.div>
                ))
            } */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user
    }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(SelectBox)