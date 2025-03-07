export const validateField = ({ value, label, required, customValidate }) => {
    if (required && !value) {
      return `${label || "This field"} is required`;
    }
  
    if (customValidate) {
      return customValidate(value);
    }
  };
  