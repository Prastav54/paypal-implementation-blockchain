/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FormModal } from "../../../components/form-modal";
import { Input } from "../../../components/input";
import { useAddName } from "../../../hooks/useAddName";
import { handleError } from "../../../utils/apputils";
import { useNotification } from "web3uikit";
import { SUCCESS, SUCCESS_MESSAGE } from "../../../constants/appConstants";

export const AddNameForm = ({ openModal, handleClose, handleSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useNotification();
  const { addName } = useAddName(name);

  const handleSubmit = (data) => {
    setLoading(true);
    setName(data.name);
  };

  const handleAddNameSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Name added Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setName("");
    setLoading(false);
    handleSuccess();
    handleClose();
  };

  const submitName = () => {
    addName({
      onError: (error) => {
        setLoading(false);
        handleError(error, dispatch);
      },
      onSuccess: (tx) => handleAddNameSuccess(tx),
    });
  };

  useEffect(() => {
    if (name) {
      submitName();
    }
  }, [name]);

  return (
    <FormModal
      openFormModal={openModal}
      title="Add / Update Name"
      handleModalCose={handleClose}
      handleFormSubmit={handleSubmit}
      size="sm"
      loading={loading}
      style={{ width: "100%" }}
    >
      <Input
        name="name"
        label="Name"
        placeholder="Add Name for this account"
        required
      />
    </FormModal>
  );
};
