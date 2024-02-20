import { Button } from "antd";
import { PlusOutlined, EditOutlined, WalletOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AddNameForm } from "./helpers/AddNameForm";
import { useGetName } from "../../hooks/useGetName";
import { useOutletContext } from "react-router-dom";
import { CreateRequestForm } from "./helpers/CreateRequestForm";
import { Tabs } from "antd";
import { PendingRequests } from "./helpers/PendingRequests";
import { IncomingRequests } from "./helpers/IncomingRequests";
import { useGetCollectedAmount } from "../../hooks/useGetCollectedAmount";
import { ethers } from "ethers";
import { useWithdrawAmount } from "../../hooks/useWithDrawAmount";
import { handleError } from "../../utils/apputils";
import { SUCCESS, SUCCESS_MESSAGE } from "../../constants/appConstants";
import { useNotification } from "web3uikit";

export const Dashboard = () => {
  const [openAddNameModal, setOpenAddNameModal] = useState(false);
  const [openCreateRequestModal, setOpenCreateRequestModal] = useState(false);
  const [refetchPendingRequest, setRefetchPendingRequest] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [nameDetails, setNameDetails] = useState({});
  const { account } = useOutletContext();
  const { getName } = useGetName();
  const { getCollectedAmount } = useGetCollectedAmount();
  const { withdrawAmount } = useWithdrawAmount();
  const dispatch = useNotification();

  useEffect(() => {
    getAccountHolderName();
    getTotalAmountCollected();
  }, [account]);

  const getAccountHolderName = async () => {
    const response = await getName();
    setNameDetails(response);
  };

  const getTotalAmountCollected = async () => {
    const response = await getCollectedAmount();
    setCollectedAmount(response);
  };

  const handleAddName = () => {
    setOpenAddNameModal(true);
  };

  const handleAddNameModalClose = () => {
    setOpenAddNameModal(false);
  };

  const handleAddNameSuccess = () => {
    getAccountHolderName();
  };

  const handleCreateRequest = () => {
    setOpenCreateRequestModal(true);
  };

  const handleCreateRequestModalClose = () => {
    setOpenCreateRequestModal(false);
  };

  const handleCreateRequestSuccess = () => {
    setRefetchPendingRequest(true);
  };

  const handleWithDrawSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Amount Withdrawn Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setLoading(false);
    getTotalAmountCollected();
  };

  const handleWithdrawAmount = () => {
    setLoading(true);
    withdrawAmount({
      onError: (error) => {
        setLoading(false);
        handleError(error, dispatch);
      },
      onSuccess: (tx) => handleWithDrawSuccess(tx),
    });
  };

  const tabItems = [
    {
      key: "1",
      label: `Pending Requests`,
      children: (
        <PendingRequests
          refetchData={refetchPendingRequest}
          setRefetchData={setRefetchPendingRequest}
        />
      ),
    },
    {
      key: "2",
      label: `Incoming Requests`,
      children: <IncomingRequests />,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center border-b-2 border-[#808B96] z-2">
        <div className="flex items-center space-x-2 m-2">
          <p className="text-xl">
            {nameDetails.hasName ? `Hi ${nameDetails.name}` : "Hello Pal"}
          </p>
          <EditOutlined
            type="check-circle"
            onClick={handleAddName}
            style={{ fontSize: "20px" }}
          />
        </div>
        <div className="flex p-2 space-x-2">
          <Button
            icon={<WalletOutlined />}
            className="flex h-auto items-center px-3 py-1.5 shadow-none"
            onClick={handleWithdrawAmount}
            disabled={!+collectedAmount?.toString()}
            loading={loading}
          >
            Withdraw{" "}
            {` ${
              +collectedAmount
                ? ethers.utils.formatUnits(collectedAmount, "ether")
                : ""
            } MATIC`}
          </Button>
          <Button
            icon={<PlusOutlined />}
            className="flex h-auto items-center px-3 py-1.5 shadow-none"
            type="primary"
            onClick={handleCreateRequest}
          >
            Create Request
          </Button>
        </div>
      </div>
      <AddNameForm
        openModal={openAddNameModal}
        handleClose={handleAddNameModalClose}
        handleSuccess={handleAddNameSuccess}
      />
      <CreateRequestForm
        openModal={openCreateRequestModal}
        handleClose={handleCreateRequestModalClose}
        handleSuccess={handleCreateRequestSuccess}
      />
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        tabBarStyle={{
          padding: "0 1rem",
        }}
      />
    </>
  );
};
