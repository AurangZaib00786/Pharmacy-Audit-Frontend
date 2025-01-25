import React from "react";
import Select from "react-select";
import "./select.css";

function Select_field({
  options,
  placeholder,
  value,
  funct,
  required,
  disable,
  disable_margin,
  formatOptionLabel,
}) {
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: "none", // Removes the border
      backgroundColor: "transparent", // Makes the background transparent
      boxShadow: state.isFocused ? "none" : "none", // Removes shadow effect
      cursor: disable ? "not-allowed" : "pointer", // Cursor adjustment
      padding: "4px", // Add custom padding
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0", // Remove default padding for the container
    }),
    input: (base) => ({
      ...base,
      color: "inherit", // Matches the text color to the custom CSS
    }),
    placeholder: (base) => ({
      ...base,
      color: "#000", // Placeholder color
      fontSize: "20px", // Adjust this value to make the placeholder text larger
      fontWeight: "500",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100, // Ensures dropdown visibility
    }),
    singleValue: (base) => ({
      ...base,
      color: "inherit", // Matches text color to the custom CSS
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "black", // Sets the dropdown arrow color to black
      "&:hover": {
        color: "black", // Ensures it remains black on hover
      },
    }),
  };

  return (
    <div className={`wrapper ${disable_margin ? "" : "mb-3"}`}>
      <div
        className={`select-wrapper ${value ? "select-filled" : ""}`}
        data-content={placeholder ? `${placeholder}${required ? " *" : ""}` : ""}
      >
        <Select
          className="custom-select"
          styles={selectStyles}
          options={options}
          placeholder={placeholder}
          value={value}
          onChange={funct}
          formatOptionLabel={formatOptionLabel}
          isDisabled={disable}
        />
      </div>
    </div>
  );
}

export default Select_field;
