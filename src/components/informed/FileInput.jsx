import React, { useState, useRef } from 'react';
import { useField } from 'informed';

const FileInput = ({ field, validate }) => {
  const { id, label, accept, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
  } = useField({
    name: id,
    validate,
    validateOn: 'change',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const prevPreviewUrlRef = useRef(null);

  const handleChange = (event) => {
    const files = event.target.files;
    setValue(files);

    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

      let newFileType = 'unsupported';
      if (imageExtensions.includes(extension)) {
        newFileType = 'image';
      } else if (extension === 'pdf') {
        newFileType = 'pdf';
      }
      setFileType(newFileType);

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      if (prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
      prevPreviewUrlRef.current = newPreviewUrl;
    } else {
      setFileType(null);
      setPreviewUrl(null);
      if (prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
        prevPreviewUrlRef.current = null;
      }
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          name={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px dashed #ccc',
            padding: '16px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
            width: '100%',
          }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Drag and drop files or browse</span>
        </div>
      </div>

      {fileType && (
        <div style={{ marginTop: '16px' }}>
          {fileType === 'image' && (
            <div
              style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          {fileType === 'pdf' && (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          )}
          {fileType === 'unsupported' && (
            <p style={{ color: '#666' }}>Preview not available for this file type.</p>
          )}
        </div>
      )}

      {error && (
        <span style={{ color: 'red', fontSize: '14px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default FileInput;
