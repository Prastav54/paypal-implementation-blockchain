/* eslint-disable react/prop-types */
import { Input as AntdInput, Form } from "antd";
import { REQUIRED_VALIDATION_MESSAGE } from "../../constants/appConstants";

export const Input = ({
  name,
  label,
  placeholder,
  size = "large",
  required = false,
  rules = [],
  allowClear = true,
  inputClassName = "basis-[588px]",
}) => {
  const getRules = () => {
    return [...rules, { required, message: REQUIRED_VALIDATION_MESSAGE }];
  };
  return (
    <div className={"flex items-center gap-x-2"}>
      <label className="mb-6 text-[#1e1e1e]">{label}</label>
      <div className="mb-6 flex-[1] basis-6 border border-dashed border-[#bbb]" />
      <div className={inputClassName}>
        <Form.Item name={name} rules={getRules()}>
          <AntdInput
            size={size}
            allowClear={allowClear}
            placeholder={placeholder}
            className="bg-[#f1f3f9]"
          />
        </Form.Item>
      </div>
    </div>
  );
};
