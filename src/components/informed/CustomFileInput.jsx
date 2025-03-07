import React, { useRef, useState, useEffect } from "react";
import { useField } from "informed";

const CustomFileInput = ({ id, label, required, accept }) => {
  const validateFile = (value) => {
    // Handle the "required" case
    if (required && !value) {
      return "This field is required";
    }

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

  const { fieldState, fieldApi, render } = useField({
    name: id,
    required,
    validate: validateFile,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
  });

  const { setValue, setTouched } = fieldApi;
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [prevValue, setPrevValue] = useState(fieldState.value);
  const [errorMessage, setErrorMessage] = useState(null); // Local error state

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      resetFileInput();
      setErrorMessage(required ? "This field is required" : null); // Set required error if applicable
      return;
    }

    const validationResult = validateFile(file);

    if (validationResult) {
      setErrorMessage(validationResult); // Set local error
      setTouched(true);
      resetFileInput();
    } else {
      setErrorMessage(null); // Clear error on success
      setValue(file);
      setTouched(true);
      setPrevValue(file);
      setFileType(file.type);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetFileInput = () => {
    setValue(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPrevValue(null);
  };

  // Sync fieldState.error with local errorMessage when no file is selected
  useEffect(() => {
    if (!fieldState.value && fieldState.touched && fieldState.error) {
      setErrorMessage(fieldState.error); // Reflect "required" error
    }
  }, [fieldState.value, fieldState.touched, fieldState.error]);

  if (
    !fieldState.value &&
    prevValue &&
    fileInputRef.current &&
    fileInputRef.current.value
  ) {
    fileInputRef.current.value = "";
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  return render(
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        onBlur={() => setTouched(true)}
        id={id}
        ref={fileInputRef}
        style={{
          display: "block",
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          color: "#333",
          fontSize: "14px",
        }}
      />
      {fieldState.value && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ margin: "0 0 4px", color: "#333" }}>
            Uploaded File:{" "}
            <span style={{ fontWeight: "bold" }}>{fieldState.value.name}</span>
          </p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#007bff",
              textDecoration: "underline",
              display: "inline-block",
              marginBottom: "8px",
            }}
          >
            View File
          </a>

          {previewUrl && fileType === "application/pdf" && (
            <div>
              <p style={{ margin: "0 0 4px", color: "#333" }}>PDF Preview:</p>
              <iframe
                src={previewUrl}
                title="PDF Preview"
                style={{
                  width: "100%",
                  height: "400px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
        </div>
      )}
      {/* Display errorMessage if present */}
      {errorMessage && (
        <small style={{ color: "red", marginTop: "4px", display: "block" }}>
          {errorMessage}
        </small>
      )}
    </div>
  );
};

export default CustomFileInput;