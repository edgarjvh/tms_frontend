import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './Calendar.css';
import buildCalendar from './helper/build.js';
import dayStyles from './helper/styles.js';
import Header from './helper/Header.jsx';

const Calendar = ({value, onChange, closeCalendar, preDay, onChangePreDay}) => {
    const [calendar, setCalendar] = useState([]);
    
    useEffect(() => {
        setCalendar(buildCalendar(preDay));
    }, [preDay]);

    return (
        <div className="calendar">
            <Header value={preDay} setValue={onChangePreDay} />
            <div className="body">
                <div className="week">
                    {
                        ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((d, i) => {
                            return (
                                <div key={i} className="day">{d}</div>
                            )
                        })
                    }
                </div>
                {calendar.map((week, i) => (
                    <div key={i} className="week">
                        {week.map((day, x) => (
                            <div key={x} className="day">
                                <div className={dayStyles(day, value, preDay)} onClick={(e) => {e.stopPropagation(); onChange(day); closeCalendar()}}>
                                    {day.format('D').toString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Calendar