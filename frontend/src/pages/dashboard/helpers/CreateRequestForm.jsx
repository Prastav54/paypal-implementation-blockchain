/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { FormModal } from "../../../components/form-modal";
import { Input } from "../../../components/input";
import { NumberInput } from "../../../components/number-input";
import { SUCCESS, SUCCESS_MESSAGE } from "../../../constants/appConstants";
import { useCreateRequest } from "../../../hooks/useCreateRequest";
import { handleError } from "../../../utils/apputils";

export const CreateRequestForm = ({
  openModal,
  handleClose,
  handleSuccess,
}) => {
  const [payload, setPayload] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useNotification();
  const { createRequest } = useCreateRequest(payload);

  const handleSubmit = (data) => {
    setLoading(true);
    setPayload(data);
  };

  const handleAddNameSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Request Created Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setLoading(false);
    setPayload();
    handleSuccess();
    handleClose();
  };

  useEffect(() => {
    if (payload) {
      createRequest({
        onError: (error) => {
          setLoading(false);
          handleError(error, dispatch);
        },
        onSuccess: (tx) => handleAddNameSuccess(tx),
      });
    }
  }, [payload]);

  return (
    <FormModal
      openFormModal={openModal}
      title="Create Request"
      handleModalCose={handleClose}
      handleFormSubmit={handleSubmit}
      loading={loading}
    >
      <Input
        name="user"
        label="Account Number"
        placeholder="Add acc. number to whom you want to request"
        rules={[
          {
            pattern: new RegExp(/^(0x)?[0-9a-fA-F]{40}$/),
            message: "Please provide correct account number",
          },
        ]}
        required
      />
      <NumberInput
        name="amount"
        label="Amount"
        placeholder="Enter Amount"
        required
      />
      <Input
        name="message"
        label="Message"
        placeholder="Add message"
        required
      />
    </FormModal>
  );
};
