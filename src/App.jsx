import React from "react";
import InformInput from "./components/informed/InformInput";
import CustomSelect from "./components/informed/CustomSelect";
import CustomCheckboxGroup from "./components/informed/CustomCheckboxGroup";
import CustomCheckbox from "./components/informed/CustomCheckbox";
import CustomRadioGroup from "./components/informed/CustomRadioGroup";
import CustomFileInput from "./components/informed/CustomFileInput";
import NumberInput from "./components/informed/NumberInput";
import { Form } from "informed";
import formFields from "./json/data.json";
import toast, { Toaster } from "react-hot-toast";
import useValidation from "./components/utils/useValidation.js"; // Import the custom hook

export default function App() {
  const { getValidation , validatePhone} = useValidation(); // Use the custom hook

  function handleSubmit(formState, formApi) {
    console.log("Form Values:", formState.values);

    const hasEmptyRequiredFields = formFields.some((field) => {
      if (field.required) {
        const value = formState.values[field.id];
        if (field.type === "checkbox-group" || field.type === "radio") {
          return !value || value.length === 0;
        } else if (field.type === "file") {
          return value === null || value === undefined;
        } else {
          return !value;
        }
      }
      return false;
    });

    if (hasEmptyRequiredFields) {
      toast.error("Some required fields are empty.");
      return;
    }

    formApi.reset({});
    toast.success("Form submitted successfully and reset.");
  }

  return (
    <>
      <Toaster />
      <Form focusOnInvalid={true}>
        {({ formApi, formState }) => (
          <>
            {formFields.map((field) => (
              <div key={field.id} style={{ marginBottom: "1rem" }}>
                {(() => {
                  const commonProps = {
                    name: field.id,
                    label: field.label,
                    required: field.required,
                  };

                  switch (field.type) {
                    case "text":
                    case "email":
                    case "date":
                    case "textarea":
                      return (
                        <InformInput
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          validatefield={getValidation(field)}
                          {...commonProps}
                        />
                      );

                    case "tel":
                      return (
                        <NumberInput
                          id={field.id}
                          placeholder={field.placeholder}
                          validateOn="change"
                          type="text"
                          validate={validatePhone}
                          showErrorIfError
                          formatter="+91##########"
                          {...commonProps}
                        />
                      );

                    case "checkbox-group":
                      return (
                        <CustomCheckboxGroup
                          id={field.id}
                          options={field.options}
                          {...commonProps}
                        />
                      );

                    case "select":
                      return (
                        <CustomSelect
                          id={field.id}
                          options={field.options}
                          {...commonProps}
                        />
                      );

                    case "checkbox":
                      return <CustomCheckbox id={field.id} {...commonProps} />;

                    case "radio":
                      return (
                        <CustomRadioGroup
                          id={field.id}
                          options={field.options}
                          {...commonProps}
                        />
                      );

                    case "file":
                      return (
                        <CustomFileInput
                          id={field.id}
                          key={field.id}
                          {...commonProps}
                          accept={field.accept}
                        />
                      );

                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
            <button onClick={() => handleSubmit(formState, formApi)}>
              {" "}
              submit
            </button>
          </>
        )}
      </Form>
    </>
  );
}