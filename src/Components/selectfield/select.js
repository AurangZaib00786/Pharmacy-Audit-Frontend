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
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const customSelectProps = {
    menuPortalTarget: document.getElementById("root"),
    customStyles: {
      menuPortal: (base) => {
        const { zIndex, ...rest } = base;
        return { ...rest, zIndex: 9999 };
      },
    },
  };
  return (
    <div className={`wrapper ${disable_margin ? "" : "mb-3"}`}>
      {required ? (
        <div
          className={value && "select_class"}
          data-content={placeholder ? `${placeholder} *` : ""}
        >
          <Select
            className="form-control p-0"
            styles={selectStyles}
            options={options}
            placeholder={placeholder ? `${placeholder} *` : ""}
            value={value}
            onChange={funct}
            required
            formatOptionLabel={formatOptionLabel}
            isDisabled={disable}
          ></Select>
        </div>
      ) : (
        <div className={value && "select_class"} data-content={placeholder}>
          <Select
            className="form-control p-0"
            styles={selectStyles}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={funct}
            isDisabled={disable}
            formatOptionLabel={formatOptionLabel}
          ></Select>
        </div>
      )}
    </div>
  );
}

export default Select_field;
