import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import { useDetectClickOutside } from "react-detect-click-outside";
import moment from "moment";
import MaskedInput from "react-text-mask";

import {
    Calendar
} from './../../company/panels';

function DateInput(props) {
    const { refInputDate, refCalendarDropDown } = props.refs;

    const getFormattedDates = date => {
        let formattedDate = date;

        try {
            if (moment(date.trim(), "MM/DD/YY").format("MM/DD/YY") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/DD/YY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/DD/").format("MM/DD/") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/DD/").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/DD").format("MM/DD") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/DD").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/").format("MM/") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM").format("MM") === date.trim()) {
                formattedDate = moment(date.trim(), "MM").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/D/Y").format("M/D/Y") === date.trim()) {
                formattedDate = moment(date.trim(), "M/D/Y").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/D/Y").format("MM/D/Y") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/D/Y").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/DD/Y").format("MM/DD/Y") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/DD/Y").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/DD/Y").format("M/DD/Y") === date.trim()) {
                formattedDate = moment(date.trim(), "M/DD/Y").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/D/YY").format("M/D/YY") === date.trim()) {
                formattedDate = moment(date.trim(), "M/D/YY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/D/YYYY").format("M/D/YYYY") === date.trim()) {
                formattedDate = moment(date.trim(), "M/D/YYYY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/D/YYYY").format("MM/D/YYYY") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/D/YYYY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/DD/YYYY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/DD/YYYY").format("M/DD/YYYY") === date.trim()) {
                formattedDate = moment(date.trim(), "M/DD/YYYY").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/D/").format("M/D/") === date.trim()) {
                formattedDate = moment(date.trim(), "M/D/").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M/D").format("M/D") === date.trim()) {
                formattedDate = moment(date.trim(), "M/D").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "MM/D").format("MM/D") === date.trim()) {
                formattedDate = moment(date.trim(), "MM/D").format("MM/DD/YYYY");
            }

            if (moment(date.trim(), "M").format("M") === date.trim()) {
                formattedDate = moment(date.trim(), "M").format("MM/DD/YYYY");
            }
        } catch (e) {
            console.log(e);
        }

        return formattedDate;
    };

    const calendarTransition = useTransition(props.isCalendarShown, {
        from: {opacity: 0, display: "block", top: "calc(100% + 7px)"},
        enter: {opacity: 1, display: "block", top: "calc(100% + 12px)"},
        leave: {opacity: 0, display: "none", top: "calc(100% + 7px)"},
        reverse: props.isCalendarShown,
        config: {duration: 100},
    });

    return (
        <div className="select-box-container" style={{ ...(props.boxStyle || {}) }}>
            <div className="select-box-wrapper">
                <MaskedInput
                    tabIndex={props.tabIndex || 0}
                    readOnly={props.readOnly}
                    mask={[/[0-9]/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                    guide={false}
                    type="text"
                    placeholder={props.placeholder}
                    onKeyDown={(e) => {
                        props.onKeyDown(e);
                    }}
                    onBlur={(e) => {
                        props.onBlur(getFormattedDates(props.value));
                    }}
                    onInput={(e) => {
                        props.onInput(e.target.value);
                    }}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                    }}
                    value={props.value}
                    ref={refInputDate}
                />

                <FontAwesomeIcon
                    className="dropdown-button calendar"
                    icon={faCalendarAlt}
                    onClick={e => {
                        e.stopPropagation();
                        props.onDropDownClick(e);
                    }}
                />

            </div>
            {calendarTransition(
                (style, item) =>
                    item && (
                        <animated.div
                            className="mochi-contextual-container"
                            id={`mochi-contextual-container-${props.popupId}`}
                            style={{
                                ...style,
                                left: "-100px",
                                display: "block",
                                ...(props.popupStyle || {}),
                            }}
                            ref={refCalendarDropDown}
                        >
                            <div className={`mochi-contextual-popup ${props.popupPosition}`} style={{ height: 275 }}>
                                <div className="mochi-contextual-popup-content">
                                    <div className="mochi-contextual-popup-wrapper">
                                        <Calendar
                                            value={props.calendarValue}
                                            onChange={day => {
                                                props.onCalendarChange(day);
                                            }}
                                            closeCalendar={() => {
                                                props.setIsCalendarShown(false);
                                            }}
                                            preDay={props.preDay}
                                            onChangePreDay={preDay => {
                                                props.setPreDay(preDay);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    )
            )}
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(DateInput);
