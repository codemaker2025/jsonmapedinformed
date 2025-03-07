import React, { useRef, useState, useEffect } from "react";
import { useField } from "informed";

const CustomFileInput = ({ id, label, required, accept }) => {
  const validateFile = (value) => {
    if (id === "resume") {
      if (value instanceof File) {
        const maxSizeInBytes = 10 * 1024 * 1024; // 5MB
        if (value.size > maxSizeInBytes) {
          return "File size must not exceed 10MB";
        }
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

  const { setValue, setTouched, setError } = fieldApi;
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [prevValue, setPrevValue] = useState(fieldState.value);

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
      return;
    }

    const validationResult = validateFile(file);

    if (validationResult) {
      setError(validationResult);
      resetFileInput();
    } else {
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
    setError(undefined);
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

          {previewUrl && fileType?.startsWith("image/") && (
            <div>
              <p style={{ margin: "0 0 4px", color: "#333" }}>Preview:</p>
              <img
                src={previewUrl}
                alt="File Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}

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
      {fieldState.error && fieldState.touched && (
        <small style={{ color: "red", marginTop: "4px", display: "block" }}>
          {fieldState.error}
        </small>
      )}
    </div>
  );
};

export default CustomFileInput;
