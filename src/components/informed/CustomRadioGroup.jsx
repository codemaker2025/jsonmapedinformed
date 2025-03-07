import React from "react";
import { useField } from "informed";

const CustomRadioGroup = ({ id, label, options, required }) => {
  const { fieldState, fieldApi, render } = useField({
    name: id,
    required,
    validate: (value) => (!value ? "This field is required" : undefined),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
  });

  const { setValue, setTouched } = fieldApi;

  const styles = {
    container: { marginBottom: "12px" },
    label: { display: "block", fontWeight: "bold", color: "#333", marginBottom: "8px" },
    optionsWrapper: { display: "flex", flexWrap: "wrap", gap: "12px" },
    option: { display: "flex", alignItems: "center", gap: "6px" },
    input: { cursor: "pointer" },
    optionLabel: { color: "#333", cursor: "pointer" },
    error: { color: "#dc3545", marginTop: "6px", fontSize: "13px", display: "block" },
  };

  return render(
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.optionsWrapper}>
        {options.map((option) => (
          <div key={option.value} style={styles.option}>
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={fieldState.value === option.value}
              onChange={() => {
                setValue(option.value);
                setTouched(true);
              }}
              onBlur={() => setTouched(true)}
              style={styles.input}
              id={`${id}-${option.value}`}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              style={styles.optionLabel}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {fieldState.error && fieldState.touched && (
        <small style={styles.error}>{fieldState.error}</small>
      )}
    </div>
  );
};

export default CustomRadioGroup;
