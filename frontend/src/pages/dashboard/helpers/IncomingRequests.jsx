import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import { INCOMING_REQUEST_QUERY } from "../../../constants/graphQueries";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { Button, Table } from "antd";
import { loadingHandler } from "../../../utils/loadinghandlers";
import { usePayAmount } from "../../../hooks/usePayAmount";
import { handleError } from "../../../utils/apputils";
import { useNotification } from "web3uikit";
import { SUCCESS, SUCCESS_MESSAGE } from "../../../constants/appConstants";

export const IncomingRequests = () => {
  const { account } = useOutletContext();
  const [amount, setAmount] = useState();
  const [receiver, setReceiver] = useState();
  const [loadingButton, setLoadingButton] = useState(false);
  const { data, loading, refetch } = useQuery(INCOMING_REQUEST_QUERY, {
    variables: { receiver: account },
  });

  const { payAmount } = usePayAmount(amount, receiver);
  const dispatch = useNotification();

  const handlePay = (record) => {
    setLoadingButton(record.sender);
    setAmount(record.amount);
    setReceiver(record.sender);
  };

  const handlePaymentSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Payment Successful",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setLoadingButton(false);
    setAmount();
    setReceiver();
    refetch();
  };

  useEffect(() => {
    if (amount && receiver) {
      payAmount({
        onError: (error) => {
          setLoadingButton(false);
          handleError(error, dispatch);
        },
        onSuccess: (tx) => handlePaymentSuccess(tx),
      });
    }
  }, [amount, receiver]);

  const columns = useMemo(() => {
    return [
      {
        title: "Requested By",
        dataIndex: "sender",
      },
      { title: "Requester Name", dataIndex: "senderName" },
      {
        title: "Amount (in MATIC)",
        dataIndex: "amount",
        render: (_, record) =>
          record.amount
            ? ethers.utils.formatUnits(record.amount, "ether")
            : "-",
      },
      {
        title: "Message",
        dataIndex: "message",
      },
      {
        title: "Action",
        key: "actions",
        render: (_, record) => (
          <Button
            onClick={() => handlePay(record)}
            loading={record.sender === loadingButton}
          >
            Pay
          </Button>
        ),
      },
    ];
  }, [loadingButton]);

  return loadingHandler(
    loading,
    <Table
      columns={columns}
      dataSource={data?.currentRequests}
      rowKey="sender"
    />
  );
};
