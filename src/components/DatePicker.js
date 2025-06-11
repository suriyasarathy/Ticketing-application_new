import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangeFilter = ({ onFilterChange}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate:new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    key: "selection",
  });
 const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();

  const handleDateChange = (range) => {
    setDateRange(range.selection);
    onFilterChange(range.selection);
  };

  const resetDates = () => {
    setDateRange({
      startDate: startOfYear,
      endDate:today,
      key: "selection",
    });
    setShowPicker(false)
    onFilterChange({
      startDate: startOfYear,
      endDate: today,
      key: "selection",
    });
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{
          padding: "10px 15px",
          border: "1px solid #ccc",
          background: "#f0f0f0",
          cursor: "pointer",
          borderRadius: "6px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        📅 {format(dateRange.startDate, "MMM dd, yyyy")} - {format(dateRange.endDate, "MMM dd, yyyy")}
      </button>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "0",
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            months={2} // Show two calendars
            direction="horizontal"
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={resetDates}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={() => setShowPicker(false)}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
