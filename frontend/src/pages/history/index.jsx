import { useOutletContext } from "react-router-dom";
import { HISTORY_QUERY } from "../../constants/graphQueries";
import { useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { loadingHandler } from "../../utils/loadinghandlers";
import { Table } from "../../components/table";
import { useMemo } from "react";

export const History = () => {
  const { account } = useOutletContext();

  const { data, loading } = useQuery(HISTORY_QUERY, {
    variables: { account },
  });

  const columns = useMemo(() => {
    return [
      { title: "Account Number", dataIndex: "otherAccountNumber" },
      { title: "Account Name", dataIndex: "otherAccountName" },
      {
        title: "Amount (in MATIC)",
        dataIndex: "amount",
        render: (_, record) =>
          record.amount
            ? ethers.utils.formatUnits(record.amount, "ether")
            : "-",
      },
      { title: "Message", dataIndex: "message" },
      { title: "Send / Receive", dataIndex: "action" },
    ];
  }, []);

  return (
    <>
      <div className="items-center border-b-2 border-[#808B96] z-2 m-3">
        <p className="text-xl p-3">Transaction History</p>
      </div>
      {loadingHandler(
        loading,
        <Table columns={columns} dataSource={data?.histories} rowKey="id" />
      )}
    </>
  );
};
