import React from "react";
import Image from "next/image";
import styles from "./Nav.module.scss";

const Nav = (props) => {
  const { account, ethBalance, onWalletConnect } = props;

  const getButtonText = () => {
    if (account != undefined) {
      let address = account;
      let firstSix = address.slice(0, -36);
      let lastFour = address.slice(-4);
      let slicedAdress = firstSix + "..." + lastFour;
      return slicedAdress;
    } else {
      return "Connect Wallet";
    }
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.content}>
        <Image src="/logo.svg" width={127} height={26.54} alt="logo" />
        <div>
          <button
            className={styles.balance}
            style={!account ? { display: "none" } : {}}
          >
            {(Math.round(ethBalance * 10000) / 10000).toFixed(4)} ETH
          </button>
          <button className="button" onClick={onWalletConnect}>
            {getButtonText()}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Nav;
