/* eslint-disable react/prop-types */
import { Layout as AntLayout, Grid } from "antd";
import classNames from "classnames";
import React from "react";
import { Navbar } from "./helper/navbar";
import { Sider } from "./helper/sider";
import { useMoralis } from "react-moralis";
import Addresses from "../../constants/addresses.json";

export const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const screens = Grid.useBreakpoint();

  const openMenu = () => !isMenuOpen && setIsMenuOpen(true);
  const closeMenu = () => isMenuOpen && setIsMenuOpen(false);

  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const showSidebar = account && Object.keys(Addresses).includes(`${chainId}`);

  return (
    <>
      <AntLayout>
        {/* Desktop sider start */}
        <Navbar openMenu={openMenu} showMenuIcon={showSidebar} />
        <AntLayout>
          {screens.lg && showSidebar && (
            <AntLayout.Sider
              trigger={null}
              width={240}
              className="fixed bottom-0 left-0 top-[2px] z-[9] !bg-[#819EBE] h-[calc(100vh-82px)]"
            >
              <Sider closeMenu={closeMenu} />
            </AntLayout.Sider>
          )}
          {/* Desktop sider end */}

          {/* Mobile menu overlay start */}
          <div
            onClick={closeMenu}
            className={classNames(
              "absolute inset-0 z-[999] cursor-pointer bg-[rgba(0,0,0,0.5)] transition-opacity duration-300",
              isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
            )}
          />
          {/* Mobile menu overlay end */}

          {/* Mobile menu start */}
          {showSidebar && (
            <div
              className={classNames(
                "fixed inset-0 z-[999] w-[240px] overflow-hidden bg-[#1d0049] transition-transform duration-300",
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="h-full overflow-auto whitespace-nowrap">
                <Sider closeMenu={closeMenu} />
              </div>
            </div>
          )}
          {/* Mobile menu end */}
          <AntLayout.Content>
            <div className="top-[2px] ml-3 overflow-auto h-[calc(100vh-82px)]">
              {children}
            </div>
          </AntLayout.Content>
        </AntLayout>
      </AntLayout>
    </>
  );
};
