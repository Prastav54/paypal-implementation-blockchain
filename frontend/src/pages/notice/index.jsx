import notice from "../../assets/notice.png";

export const NoticePage = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="  w-full px-4  z-1 max-w-md h-auto py-10">
        <div className="mx-auto max-w-[400px] text-center">
          <img src={notice} className="w-96" alt="notice image" />
          <p className="my-6  text-[#1E1E1E] text-base font-albert font-normal">
            Before starting, please connect your wallet and make sure you have
            connected to the correct blockchain. For now we only support Sepolia
            network.
          </p>
        </div>
      </div>
    </div>
  );
};
