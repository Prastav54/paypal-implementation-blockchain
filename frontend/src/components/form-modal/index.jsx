/* eslint-disable react/prop-types */
import { Button, Drawer, Form } from "antd";
import classNames from "classnames";
import { useEffect } from "react";

export const FormModal = ({
  handleFormSubmit,
  size = "md",
  openFormModal,
  handleModalCose,
  title = "Form",
  placement = "bottom",
  fullWidth = "false",
  saveBtnText = "Save",
  loading = false,
  children,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!openFormModal) {
      form.resetFields();
    }
  }, [openFormModal, form]);

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      scrollToFirstError={{
        behavior: "smooth",
      }}
    >
      <Drawer
        height={
          size === "md"
            ? "60vh"
            : size === "lg"
            ? "calc(100vh - 80px)"
            : size === "sm"
            ? "30vh"
            : undefined
        }
        open={openFormModal}
        title={title}
        placement={placement}
        closable={false}
        footer={
          <div
            className={classNames(
              "flex justify-end gap-x-3",
              !fullWidth && "mx-auto max-w-screen-xl"
            )}
          >
            <Button
              onClick={handleModalCose}
              className="h-auto border-none bg-[#f1f3f9] px-6 py-1.5"
            >
              Cancel
            </Button>
            <Button
              htmlType="button"
              type="primary"
              loading={loading}
              onClick={form.submit}
              className="flex h-auto items-center px-6 py-1.5 shadow-none"
            >
              {saveBtnText}
            </Button>
          </div>
        }
      >
        {children}
      </Drawer>
    </Form>
  );
};
