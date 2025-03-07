import React from "react";
import NumberInput from "../informed/NumberInput";

export default function PhoneNumber({ validatePhone }) {
  return (
    <div className="form-group">
      <div style={{ display: "flex", alignItems: "center" }}>
        <NumberInput
          id="phoneNumber"
          validateOn="change"
          type="text"
          label="Phone"
          name="phone"
          placeholder="Enter your number"
          validate={validatePhone}
          showErrorIfError
          formatter="+91##########"
        />
      </div>
    </div>
  );
}
