import { createSlice } from "@reduxjs/toolkit";
import { CompilerOutput } from "hardhat/types";

export type Address = string;

export type TokenParameterType = "uint256" | "string" | "address";
export type ScopedAccessToken = Record<string, string>;

export type TokenParameter = {
  name: string;
  type: TokenParameterType;
};

export type PayoutDestination = {
  address: Address;
  amount: number;
};

export type AllowlistDestination = {
  address: Address;
  amount: number;
};

interface CompilerState {
  status: "idle" | "loading" | "ready" | "error" | "done";
  files?: Record<string, string>;
  contracts?: CompilerOutput["contracts"];
  sourceName?: string;
  contractName?: string;
}

export interface ContractState {
  tokenName: string;
  ticker: string;
  tokenURI: string;
  usesDelegatedContract: boolean;
  supply?: number;
  usesUriStorage: boolean;
  multimint?: number;
  limitPerWallet?: number;
  price?: string;
  royaltyBps?: string;
  activateAutomatically: boolean;
  enumerable: boolean;
  requireAccessToken?: ScopedAccessToken;
  approvalProxyAddress?: ScopedAccessToken;
  tokenParameters: TokenParameter[];
  onlyOwnerCanMint: boolean;
  payoutDestinations: PayoutDestination[];
  amountAllowedForOwner: number;
  usesIdParameter: boolean;
  allowlistDestinations: AllowlistDestination[];
  customMaxTokenId?: number;
  mutableAccessToken: boolean;
  toggleAccessToken: boolean;
  contractURI?: string;
}

export interface ConfigState {
  deployed: boolean;
  contractAddress?: Address;
}

export interface ContractReducerState {
  contract: ContractState;
  compiler: CompilerState;
  config: ConfigState;
}

export const initialState: ContractReducerState = {
  contract: {
    tokenName: "",
    usesIdParameter: false,
    usesUriStorage: false,
    customMaxTokenId: undefined,
    limitPerWallet: undefined,
    multimint: undefined,
    royaltyBps: undefined,
    ticker: "",
    tokenURI: "",
    supply: 0,
    requireAccessToken: undefined,
    tokenParameters: [],
    activateAutomatically: false,
    contractURI: undefined,
    enumerable: false,
    onlyOwnerCanMint: false,
    payoutDestinations: [],
    amountAllowedForOwner: 0,
    price: "0",
    usesDelegatedContract: false,
    allowlistDestinations: [],
    approvalProxyAddress: undefined,
    mutableAccessToken: false,
    toggleAccessToken: false,
  },
  compiler: { status: "idle" },
  config: {
    deployed: false,
  },
};

const contractSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    handleStartCompile: (state) => {
      state.compiler.status = "loading";
    },
    handleCompilerReady: (state, action) => {
      state.compiler.status = "ready";
      console.log("FILES", action.payload.files);
      state.compiler.files = action.payload.files;
    },
    handleCompileSuccess: (state, action) => {
      state.compiler.status = "done";
      state.compiler.contracts = action.payload.value.contracts;
      state.compiler.sourceName = action.payload.sourceName;
      state.compiler.contractName = action.payload.contractName;
    },
    handleCompileError: (state) => {
      state.compiler.status = "error";
    },
    handleContractDeployed: (state, action) => {
      state.config.deployed = true;
      state.config.contractAddress = action.payload.contractAddress;
    },
    handleLoadCollection(state, action) {
      console.log("Loading collection....");
      console.log(action);
      state.contract.tokenURI = action.payload.config.ipfsUrlMetadata;
      state.contract.tokenName = action.payload.config.name;
      state.contract.supply = action.payload.config.amount;
      state.contract.ticker = action.payload.config.name;
    },
    handleChangeTokenName(state, action) {
      state.contract.tokenName = action.payload;
    },
    handleChangeTicker(state, action) {
      state.contract.ticker = action.payload;
    },
    handleChangeSupply(state, action) {
      state.contract.supply = action.payload;
    },
    handleSwitchSupply(state, action) {
      if (action.payload == false) {
        state.contract.supply = undefined;
      } else {
        state.contract.supply = 100;
      }
    },
    handleSwitchPrice(state, action) {
      if (action.payload == false) {
        state.contract.price = undefined;
      } else {
        state.contract.price = "0";
      }
    },
    handleChangePrice(state, action) {
      state.contract.price = action.payload;
    },
    handleSwitchRoyalty(state, action) {
      if (action.payload == false) {
        state.contract.royaltyBps = undefined;
      } else {
        state.contract.royaltyBps = "0";
      }
    },
    handleChangeRoyalty(state, action) {
      state.contract.royaltyBps = action.payload;
    },
    handleChangeTokenUri(state, action) {
      state.contract.tokenURI = action.payload;
    },
    handleSwitchMultimint(state, action) {
      if (action.payload == false) {
        state.contract.multimint = undefined;
      } else {
        state.contract.multimint = 10;
      }
    },
    handleChangeMultimint(state, action) {
      state.contract.multimint = action.payload;
    },
    handleSwitchLimitPerWallet(state, action) {
      if (action.payload == false) {
        state.contract.limitPerWallet = undefined;
      } else {
        state.contract.limitPerWallet = 10;
      }
    },
    handleChangeLimitPerWallet(state, action) {
      state.contract.limitPerWallet = action.payload;
    },
    handleSwitchEnumerable(state, action) {
      if (action.payload == false) {
        state.contract.enumerable = false;
      } else {
        state.contract.enumerable = true;
      }
    },
    handleSwitchOnlyOwnerCanMint(state, action) {
      if (action.payload == false) {
        state.contract.onlyOwnerCanMint = false;
      } else {
        state.contract.onlyOwnerCanMint = true;
      }
    },
  },
});

export const {
  handleStartCompile,
  handleCompilerReady,
  handleCompileSuccess,
  handleContractDeployed,
  handleCompileError,
  handleLoadCollection,
  handleChangeSupply,
  handleChangeTokenName,
  handleSwitchSupply,
  handleSwitchPrice,
  handleChangePrice,
  handleSwitchRoyalty,
  handleChangeRoyalty,
  handleChangeTokenUri,
  handleSwitchMultimint,
  handleChangeMultimint,
  handleSwitchLimitPerWallet,
  handleChangeLimitPerWallet,
  handleSwitchEnumerable,
  handleSwitchOnlyOwnerCanMint,
  handleChangeTicker,
} = contractSlice.actions;

export default contractSlice.reducer;
