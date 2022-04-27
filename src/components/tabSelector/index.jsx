import React from "react";
import styles from "./TabSelector.module.scss";

const TabSelector = (props) => {
  const { tab, setTab } = props;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.selector}>
          <button
            id="pool"
            className={tab === "pool" ? "button" : "button-unselected"}
            onClick={() => setTab("pool")}
          >
            Pool
          </button>
          <button
            id="dashboard"
            className={tab === "dashboard" ? "button" : "button-unselected"}
            onClick={() => setTab("dashboard")}
          >
            {" "}
            Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};
export default TabSelector;
