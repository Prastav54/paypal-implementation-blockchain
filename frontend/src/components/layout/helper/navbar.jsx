/* eslint-disable react/prop-types */
import { MenuOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import { ConnectButton } from "web3uikit";

export const Navbar = ({ openMenu, showMenuIcon }) => {
  const screens = Grid.useBreakpoint();
  return (
    <div className="sticky top-0 z-10 h-[80px] bg-white">
      <div className="flex h-full items-center justify-between px-4">
        {!screens.lg && showMenuIcon && (
          <MenuOutlined
            role="button"
            onClick={openMenu}
            className="cursor-pointer"
          />
        )}
        <div className="text-2xl">
          <b>Paypal</b>
        </div>
        <div className="flex space-x-3 items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
