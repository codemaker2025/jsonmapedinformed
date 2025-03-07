import React from "react";
import { useField } from "informed";
import Form from "react-bootstrap/Form";

const NumberInput = (props) => {
  const {
    render,
    userProps,
    fieldApi,
    fieldState,
    ref,
  } = useField({
    type: props.type || "text",
    ...props,
  });

  const { value, error } = fieldState;
  const { setValue, setTouched } = fieldApi;
  const { label, id, ...rest } = userProps;

  // Show error only if there's a value and an error exists
  const shouldShowError = value !== "" && error;

  return render(
    <Form.Group className="mb-3">
      {label && <Form.Label htmlFor={id}>{label}</Form.Label>}
      <Form.Control
        {...rest}
        id={id}
        ref={ref}
        value={value ?? ""}
        isInvalid={shouldShowError}
        onChange={(e) => {
          setValue(e.target.value, e);
        }}
        onBlur={(e) => {
          setTouched(true, e);
        }}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default NumberInput;
