// useValidation.js
import { useCallback } from "react";

const useValidation = () => {
  const validateNameField = useCallback((value, { required, label }) => {
    if (required && !value) {
      return `${label || "This field"} is required`;
    }
    if (value?.toLowerCase() === "john") {
      return `${label} cannot be 'john'`;
    }
    return undefined;
  }, []);

  const genericValidate = useCallback((value, { required, label, type }) => {
    if (required && !value) {
      return `${label || "This field"} is required`;
    }
    if (type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format";
    }
    return undefined;
  }, []);

  const validatePhone = useCallback((value) => {
    if (!value) return undefined;
    if (!/^\+91[6-9]\d{9}$/.test(value)) {
      return "Invalid phone number format. It should start with +91 followed by a valid 10-digit number.";
    }
    return undefined;
  }, []);

  const getValidation = useCallback((field) => {
    if (field.id === "name") return validateNameField;
    return (value, context) =>
      genericValidate(value, { ...context, type: field.type });
  }, [validateNameField, genericValidate]);
  const validateFile = (value) => {
    if (value instanceof File) {
      const validMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validExtensions = [".pdf", ".doc", ".docx"];

      const fileExtension = "." + value.name.split(".").pop().toLowerCase();
      const fileMimeType = value.type;

      if (
        !validMimeTypes.includes(fileMimeType) ||
        !validExtensions.includes(fileExtension)
      ) {
        return "Only PDF, DOC, and DOCX files are allowed";
      }
    }
    return undefined;
  };
  return {
    validateNameField,
    genericValidate,
    validatePhone,
    getValidation,
    validateFile
  };
};

export default useValidation;