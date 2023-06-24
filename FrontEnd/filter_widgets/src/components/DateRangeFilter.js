import './DateRangeFilter.css'

import React, { useState } from 'react';

import CustomDatePicker from './CustomDatePicker';


function DateRangeFilter(props,childern){

    // const [startDate, setStartDate] = useState(null);
    // const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        props.setStartDate(date);
    };
    
    const handleEndDateChange = (date) => {
        props.setEndDate(date);
    };

    return (
        <div className='date-range-filter-widget'>
            <div className='date-range-filter-header-container'><div className='date-range-filter-header'>Date Range Selector</div></div>
            <div className='date-range-inputs-container'>
                <div className='datepicker from'>
                    <CustomDatePicker
                        showIcon
                        selected={props.startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        startDate={props.startDate}
                        endDate={props.endDate}
                        placeholderText="From"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                <div className='datepicker to'>
                    <CustomDatePicker
                        showIcon
                        selected={props.endDate}
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={props.startDate}
                        endDate={props.endDate}
                        minDate={props.startDate}
                        placeholderText="To"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
            </div>
        </div>
      );
}

export default DateRangeFilter;