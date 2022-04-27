import Web3 from "web3";
import palPoolABI from "./abi/palPoolABI";
import ERC20ABI from "./abi/ERC20ABI";
import { BigNumber } from "ethers";

export const connectWalletHandler = async () => {
  //user  has metamask installed
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    var web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const networkId = await ethereum.request({
        method: "net_version",
      });
      if (networkId != 42) {
        console.log("Change Network to Kovan");
        alert("Change Network to Kovan");
        return;
      }
      let ethBalance = await getEthBalance(web3, accounts[0]);

      return {
        account: accounts[0],
        networkId: networkId,
        ethBalance: ethBalance,
      };
    } catch (err) {
      console.log(err);
      return undefined;
    }
  } else {
    alert("Please Install Metamask");
  }
};

const getEthBalance = async (web3, account) => {
  let balance = await web3.eth.getBalance(account);
  return balance / 1000000000000000000;
};

export const getTokenBalance = async (account, tokenAddress) => {
  if (account !== undefined && tokenAddress !== undefined) {
    let web3 = new Web3(window.ethereum);
    var tokenContract = await new web3.eth.Contract(ERC20ABI, tokenAddress);
    var balance = await tokenContract.methods.balanceOf(account).call();
    return balance / 1e18;
  }
};

export const getPoolStats = async (poolAddress) => {
  if (poolAddress !== undefined) {
    let web3 = new Web3(window.ethereum);
    var tokenContract = await new web3.eth.Contract(palPoolABI, poolAddress);
    var totalSupply = await tokenContract.methods.underlyingBalance().call();
    var totalBorrowed = await tokenContract.methods.totalBorrowed().call();
    var activeLoans = await tokenContract.methods.numberActiveLoans().call();
    return {
      totalSupply: totalSupply / 1e18,
      totalBorrowed: totalBorrowed / 1e18,
      activeLoans: activeLoans,
      minimumBorrowPeriod: 7,
    };
  }
};

export const getDashboardStats = async (poolAddress) => {
  if (poolAddress !== undefined) {
    let web3 = new Web3(window.ethereum);
    var tokenContract = await new web3.eth.Contract(palPoolABI, poolAddress);
    var conversionRate = await tokenContract.methods
      .exchangeRateCurrent()
      .call();
    var totalReserve = await tokenContract.methods.totalReserve().call();
    var borrowRate = await tokenContract.methods.borrowRatePerBlock().call();
    return {
      conversion: conversionRate / 1e18,
      totalReserve: totalReserve / 1e18,
      currentBorrowRate: borrowRate / 1e18,
    };
  }
};

export const approveToken = async (tokenAddress, walletAddress) => {
  if (tokenAddress !== undefined && walletAddress !== undefined) {
    let web3 = new Web3(window.ethereum);
    var tokenContract = await new web3.eth.Contract(ERC20ABI, tokenAddress);
    await tokenContract.methods
      .approve(walletAddress, 100000000000)
      .send({ from: walletAddress });
  }
};

export const deposit = async (poolAddress, walletAddress, amount) => {
  if (
    poolAddress !== undefined &&
    walletAddress !== undefined &&
    amount !== undefined
  ) {
    let web3 = new Web3(window.ethereum);

    const wei = amount * 1e18;

    const amountBN = BigNumber.from(String(wei));

    var tokenContract = await new web3.eth.Contract(palPoolABI, poolAddress);
    await tokenContract.methods.deposit(amountBN).send({
      from: walletAddress,
      gasLimit: String(285000),
    });
  }
};
export const withdraw = async (poolAddress, walletAddress, amount) => {
  if (poolAddress !== undefined && amount !== undefined) {
    let web3 = new Web3(window.ethereum);
    const wei = amount * 1e18;
    const amountBN = BigNumber.from(String(wei));
    var tokenContract = await new web3.eth.Contract(palPoolABI, poolAddress);
    await tokenContract.methods
      .withdraw(amountBN)
      .send({ from: walletAddress, gasLimit: String(285000) });
  }
};

export const getAllowance = async (tokenAddress, walletAddress) => {
  if (tokenAddress !== undefined && walletAddress !== undefined) {
    let web3 = new Web3(window.ethereum);
    var tokenContract = await new web3.eth.Contract(ERC20ABI, tokenAddress);
    let allowance = await tokenContract.methods
      .allowance(walletAddress, walletAddress)
      .call();
    return allowance;
  }
};

export const TOKENS = [
  {
    name: "UNI",
    address: "0x075A36BA8846C6B6F53644fDd3bf17E5151789DC",
    pool: "0xca7924020aa36e3c8b4e16fC2ACF1BdeA4d6fb12",
    image: "/uni.svg",
  },
  {
    name: "AAVE",
    address: "0xB597cd8D3217ea6477232F9217fa70837ff667Af",
    pool: "0xd9Fe6DD7A09029710Cfd8660F2EcED1788a36beE",
    image: "/aave.svg",
  },
  {
    name: "COMP",
    address: "0x61460874a7196d6a22D1eE4922473664b3E95270",
    pool: "0xa21fa099e94A2cF52Eb7425E02Bfff62d1E610C9",
    image: "/comp.svg",
  },
  {
    name: "stkAAVE",
    address: "0xf2fbf9A6710AfDa1c4AaB2E922DE9D69E0C97fd2",
    pool: "0xeef13A28b0dBE30a4C6c128819B651697CE7961d",
    image: "/aave.svg",
  },
];

export const POOL_TOKENS = [
  {
    name: "palUNI",
    address: "0xFE32e7B30de865882f0DcDA353D40c40969F4531",
    pool: "0xca7924020aa36e3c8b4e16fC2ACF1BdeA4d6fb12",
    image: "/uni.svg",
  },
  {
    name: "palAAVE",
    address: "0xbeda4e6081E09F7B8dc2b79B33aB1c60bDFa6a0C",
    pool: "0xd9Fe6DD7A09029710Cfd8660F2EcED1788a36beE",
    image: "/aave.svg",
  },
  {
    name: "palCOMP",
    address: "0xB2224F5653b2b5094E465e3f676479763a015916",
    pool: "0xa21fa099e94A2cF52Eb7425E02Bfff62d1E610C9",
    image: "/comp.svg",
  },
  {
    name: "palStkAAVE",
    address: "0xeF89a9C8DF770A8964c339AA1073FB97F13BB943",
    pool: "0xeef13A28b0dBE30a4C6c128819B651697CE7961d",
    image: "/aave.svg",
  },
];
