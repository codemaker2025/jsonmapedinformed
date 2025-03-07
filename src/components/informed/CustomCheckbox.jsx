import React from "react";
import { useField } from "informed";

const CustomCheckbox = ({ id, label, required }) => {
  const { fieldState, fieldApi, render } = useField({
    name: id,
    required,
    validate: (value) => (!value ? "This field is required" : undefined),
    validateOnChange: true,
    validateOnMount: false,
  });

  const { setValue, setTouched } = fieldApi;

  const containerStyle = {
    marginBottom: "12px",
  };

  const formCheckStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const inputStyle = {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#212529",
    cursor: "pointer",
  };

  const errorStyle = {
    fontSize: "12px",
    color: "#dc3545",
    marginTop: "4px",
  };

  return render(
    <div style={containerStyle}>
      <div style={formCheckStyle}>
        <input
          type="checkbox"
          checked={fieldState.value || false}
          onChange={(e) => {
            setValue(e.target.checked);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          style={inputStyle}
          id={id}
        />
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      </div>
      {fieldState.error && fieldState.touched && (
        <small style={errorStyle}>{fieldState.error}</small>
      )}
    </div>
  );
};

export default CustomCheckbox;
