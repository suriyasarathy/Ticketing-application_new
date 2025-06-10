import React from "react";
import Select from "react-select";

const MDBSelect = ({ data, multiple, value, onValueChange }) => {
  const handleChange = (selectedOptions) => {
    onValueChange(selectedOptions || []);
  };

  return (
    <Select
      options={data}
      isMulti={multiple}
      getOptionLabel={(e) => e.text}
      getOptionValue={(e) => e.value}
      value={value} // ✅ Ensure the default values are set here
      onChange={handleChange}
    />
  );
};

export default MDBSelect;
