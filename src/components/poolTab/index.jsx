import React, { useState, useEffect } from "react";
import styles from "./Pool_Tab.module.scss";
import Image from "next/image";
import {
  approveToken,
  getPoolStats,
  getTokenBalance,
  getAllowance,
  deposit,
  TOKENS,
} from "blockchain/utils";

const PoolTab = (props) => {
  const { poolStats, account, onWalletConnect, setPoolStats, tab } = props;
  const [amount, setAmount] = useState();
  const [selectedToken, setSelectedToken] = useState(
    TOKENS.find((token) => token.name === "UNI")
  );
  const [tokenSelectOpen, setTokenSelectOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState();
  const [allowance, setAllowance] = useState(0);
  if (typeof window !== "undefined") {
    document.addEventListener("mouseup", function (e) {
      var popup = document.getElementById("popup");
      var openButton = document.getElementById("openButton");
      if (
        !popup.contains(e.target) &&
        tokenSelectOpen &&
        !openButton.contains(e.target)
      ) {
        setTokenSelectOpen(false);
      }
    });
  }

  const handleAmountChange = (e) => {
    if (e.target.value < 0) {
      setAmount(0);
    } else {
      setAmount(e.target.value);
    }
  };

  const getButtonText = () => {
    if (!account) {
      return "CONNECT TO A WALLET";
    } else {
      if (allowance > 0 && amount > 0) {
        return "DEPOSIT";
      } else {
        return "APPROVE";
      }
    }
  };

  const handleButtonClick = async () => {
    if (!account) {
      onWalletConnect();
    } else {
      if (allowance > 0) {
        await deposit(selectedToken.pool, account, amount);
      } else {
        await approveToken(selectedToken.address, account);
        setAllowance(await getAllowance(selectedToken.address, account));
      }
    }
  };

  useEffect(() => {
    (async () => {
      setPoolStats(await getPoolStats(selectedToken.pool));
      setTokenBalance(await getTokenBalance(account, selectedToken.address));
      setAllowance(await getAllowance(selectedToken.address, account));
    })();
  }, [account, selectedToken, setPoolStats]);

  return (
    <section
      className={styles.section}
      style={tab === "pool" ? { display: "flex" } : { display: "none" }}
    >
      <div className={styles.container}>
        {/*  <section className={styles.selector}>
          <button className="button"> Pool</button>
          <button className="button-unselected"> Dashboard</button>
        </section> */}
        <section className={styles.display}>
          pal{selectedToken.name} Pool
          <section className={styles.brownBox}>
            <div className={styles.tokensRow}>
              <div className={styles.leftContainer}>
                <div className={styles.tokensSelector}>
                  <button
                    id="openButton"
                    className={styles.tokenButton}
                    onClick={() => setTokenSelectOpen((prev) => !prev)}
                  >
                    <Image
                      src={selectedToken.image}
                      width={27}
                      height={27}
                      layout="fixed"
                      alt={selectedToken.name}
                    />
                    <p className={styles.tokenButtonElement}>
                      {selectedToken.name}
                    </p>{" "}
                    <Image
                      src="/dropDownIcon.svg"
                      width={30}
                      height={30}
                      alt="arrow down"
                      style={
                        tokenSelectOpen
                          ? {
                              transform: "rotate(-90deg)",
                              transition: "transform .2s ease-in-out",
                            }
                          : {
                              transform: "rotate(0deg)",
                              transition: "transform .2s ease-in-out",
                            }
                      }
                    />
                    <div className={styles.icon}></div>
                  </button>
                  <div
                    id="popup"
                    className={styles.popUp}
                    style={
                      tokenSelectOpen
                        ? {}
                        : { visibility: "hidden", opacity: "0" }
                    }
                  >
                    {TOKENS.filter((token) => token !== selectedToken).map(
                      (token, index) => (
                        <button
                          key={index}
                          className={styles.tokenListButton}
                          onClick={() => {
                            setSelectedToken(token);
                            setTokenSelectOpen(false);
                          }}
                        >
                          <Image
                            src={token.image}
                            width={27}
                            height={27}
                            layout="raw"
                            alt={token.name}
                          />
                          <div className={styles.tokenListName}>
                            {token.name}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
                <button
                  className={styles.maxButton}
                  onClick={() => setAmount(tokenBalance)}
                >
                  MAX
                </button>
              </div>
              <div className={styles.rightContainer}>
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  minLength="1"
                  maxLength="79"
                  className={styles.input}
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <p className={styles.balance}>
              Balance: {tokenBalance} {selectedToken.name}
            </p>
          </section>
          <section className={styles.brownBox}>
            <div>
              <div className={styles.poolStatsTitle}>
                {" "}
                <p>Pool Stats</p>
              </div>
              <div className={styles.poolStats}>
                Total Supply{" "}
                <p>
                  {poolStats?.totalSupply !== undefined
                    ? (Math.round(poolStats.totalSupply * 1000) / 1000).toFixed(
                        2
                      ) +
                      " " +
                      selectedToken.name +
                      " / " +
                      "$" +
                      (
                        Math.round(
                          selectedToken.price * poolStats.totalBorrowed * 1000
                        ) / 1000
                      ).toFixed(2)
                    : "-"}
                </p>
              </div>
              <div className={styles.poolStats}>
                Total Borrowed{" "}
                <p>
                  {poolStats?.totalBorrowed !== undefined
                    ? (
                        Math.round(poolStats.totalBorrowed * 1000) / 1000
                      ).toFixed(2) +
                      " " +
                      selectedToken.name +
                      " / " +
                      "$" +
                      (
                        Math.round(
                          selectedToken.price * poolStats.totalBorrowed * 1000
                        ) / 1000
                      ).toFixed(2)
                    : "-"}
                </p>
              </div>
              <div className={styles.poolStats}>
                Active Loans{" "}
                <p>
                  {poolStats?.activeLoans !== undefined
                    ? poolStats.activeLoans
                    : "-"}
                </p>
              </div>
              <div className={styles.poolStats}>
                Minimum Borrow Period{" "}
                <p>
                  {poolStats?.minimumBorrowPeriod !== undefined
                    ? poolStats?.minimumBorrowPeriod
                    : "-"}
                </p>
              </div>
            </div>
          </section>
          <button className={styles.mainButton} onClick={handleButtonClick}>
            {getButtonText()}
          </button>
        </section>
      </div>
    </section>
  );
};

export default PoolTab;
