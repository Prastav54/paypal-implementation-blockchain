import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import { PENDING_REQUEST_QUERY } from "../../../constants/graphQueries";
import { useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { Table } from "../../../components/table";
import { loadingHandler } from "../../../utils/loadinghandlers";

export const PendingRequests = ({ refetchData, setRefetchData }) => {
  const { account } = useOutletContext();
  const { data, loading, refetch } = useQuery(PENDING_REQUEST_QUERY, {
    variables: { sender: account },
  });

  useEffect(() => {
    if (refetchData) {
      refetch();
      setRefetchData(false);
    }
  }, [refetchData]);

  const columns = useMemo(() => {
    return [
      {
        title: "Requested To",
        dataIndex: "receiver",
      },
      {
        title: "Amount (in MAITC)",
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
    ];
  }, []);

  return loadingHandler(
    loading,
    <Table
      columns={columns}
      dataSource={data?.currentRequests}
      rowKey="receiver"
    />
  );
};
