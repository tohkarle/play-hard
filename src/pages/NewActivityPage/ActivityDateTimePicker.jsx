import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const ActivityDateTimePicker = ({ date, endDate, setDate, setStartTime, setEndDate, setEndTime, setMessage, setVisible }) => {

    const handleStartDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleEndDateChange = (newDate) => {
        setEndDate(newDate);
    };

    const handleEndDateClose = () => {
        if (endDate.isBefore(date)) {
            setMessage("End date must be after start date")
            setVisible(true)
            setEndDate(date)
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Start date"
                value={date}
                onChange={handleStartDateChange}
                inputFormat="dd/MM/yyyy hh:mm a"
                className="w-full"
            />
            <DateTimePicker
                label="End date"
                value={endDate}
                onChange={handleEndDateChange}
                onClose={handleEndDateClose}
                inputFormat="DD/MM/YYYY HH:mm"
                className="w-full"
            />
        </LocalizationProvider>
    )
}

export default ActivityDateTimePicker