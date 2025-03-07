import React from "react";
import { useField } from "informed";

const CustomSelect = ({ label, name, options, required }) => {
  const { fieldState, fieldApi, render, ref } = useField({
    name,
    required,
    validate: (value) => (!value ? `${label} is required` : undefined),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
  });

  const { value, error, touched } = fieldState;
  const { setValue, setTouched } = fieldApi;

  return render(
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label htmlFor={name} style={{ display: "block", fontWeight: "bold" }}>
          {label}
        </label>
      )}
      <select
        id={name}
        ref={ref}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        onBlur={() => setTouched(true)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#fff",
          color: "#333",
        }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && (
        <div style={{ color: "red", marginTop: "4px", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
