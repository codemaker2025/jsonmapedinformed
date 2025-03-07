import { useField } from "informed";

const CustomCheckboxGroup = ({ id, label, options, required }) => {
  const { fieldState, fieldApi, render ,ref } = useField({
    name: id,
    required,
    initialValue: [],
    validate: (value) =>
      !value || value.length === 0 ? "This field is required" : undefined,
    validateOnChange: true, // Validate on every change
    validateOnBlur: true, // Validate on blur
    validateOnMount: false, // Avoid validating before interaction
  });

  const { setValue, setTouched } = fieldApi;

  const handleChange = (value) => {
    const newValues = fieldState.value || [];
    const updatedValues = newValues.includes(value)
      ? newValues.filter((v) => v !== value)
      : [...newValues, value];
    setValue(updatedValues); // Update the value
    setTouched(true); // Mark as touched to trigger error update
  };

  return render(
    <div style={{ marginBottom: "1rem" }}>
      {label && <label>{label}</label>}
      {options.map((option) => (
        <label key={option.value} style={{ marginRight: "10px" }}>
          <input
          ref={ref}
            type="checkbox"
            value={option.value}
            checked={fieldState.value?.includes(option.value) || false}
            onChange={() => handleChange(option.value)}
            onBlur={() => setTouched(true)} // Ensure validation on blur
          />
          {option.label}
        </label>
      ))}
      {fieldState.error && fieldState.touched && (
        <small style={{ color: "red" }}>{fieldState.error}</small>
      )}
    </div>
  );
};

export default CustomCheckboxGroup;