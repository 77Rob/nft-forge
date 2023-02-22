/* eslint-disable react-hooks/exhaustive-deps */
import { createCompilerInput, useCompiler } from "@/compiler/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getValidContractName,
  downloadDependenciesForSource,
  generateContractSource,
  getBaseURI,
} from "@/solidity-codegen";
import {
  ContractState,
  handleCompileSuccess,
  handleStartCompile,
  initialState,
  handleContractDeployed,
  handleLoadCollection,
  handleCompilerReady,
  ScopedAccessToken,
  handleChangeTokenName,
  handleChangeTicker,
  handleSwitchSupply,
  handleChangeSupply,
  handleSwitchMultimint,
  handleChangeMultimint,
  handleSwitchLimitPerWallet,
  handleChangeLimitPerWallet,
  handleSwitchOnlyOwnerCanMint,
} from "@/store/contractReducer";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { deployContract } from "@/utils";
import { ContractFactory } from "ethers";
import axios from "axios";
import { toVerifyRequest, verifyContract } from "@/utils/verify";
type Address = string;

export const OPEN_ZEPPELIN_VERSION = "4.3.2";

const erc721DelegatedAddress: ScopedAccessToken = {
  mantle: "0xa0Fa87a0805874948494C1544E968e9D11498101",
};

const Contract = () => {
  const compiler = useCompiler();
  const state = useAppSelector((state) => state.contract);
  const dispatch = useAppDispatch();
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const { isConnected } = useAccount();
  const collection = useAppSelector((state) => state.generativeCollection);
  useEffect(() => {
    dispatch(handleLoadCollection(collection));
  }, [collection]);

  const configJSON = useMemo(() => {
    const clone = { ...state.contract };

    (
      Object.entries(initialState.contract) as [keyof ContractState, any][]
    ).forEach(([key, value]) => {
      if (JSON.stringify(clone[key]) === JSON.stringify(value)) {
        delete clone[key];
      }
    });

    return JSON.stringify({
      ...clone,
      ["schemaVersion"]: "1.0.0",
    });
  }, [state.contract]);

  const handleCompile = useCallback(() => {
    async function main() {
      dispatch(handleStartCompile());
      const contractName = getValidContractName(state.contract.tokenName);
      const sourceName = contractName + ".sol";

      const source = generateContractSource(state.contract);

      const files = await downloadDependenciesForSource(
        fetch,
        sourceName,
        source,
        {
          "@openzeppelin/contracts": OPEN_ZEPPELIN_VERSION,
        }
      );

      dispatch(handleCompilerReady({ files: files }));
      console.log("files");
      console.log(files);
      const output = await compiler.compile(files);
      console.log(state.compiler.files);
      console.log(
        output.contracts[sourceName][contractName].evm.bytecode.object
      );
      dispatch(
        handleCompileSuccess({
          value: output,
          sourceName,
          contractName,
        })
      );
    }

    main();
  }, [compiler, state.contract]);
  console.log(state.contract);
  const handleDeploy = useCallback(() => {
    async function main() {
      const { sourceName, contractName, contracts } = state.compiler;
      const mainContract = contracts[sourceName][contractName];
      console.log(mainContract);
      const {
        abi,
        evm: { bytecode },
      } = mainContract;

      dispatch({
        type: "setDeploying",
      });

      let deploymentAddress: Address;

      try {
        const factory = new ContractFactory(abi, bytecode, signer);
        const contract = await factory.deploy(state.contract.tokenURI);
        await contract.deployed();
        console.log(contract.address);
        dispatch(handleContractDeployed(contract.address));
      } catch (e) {
        console.log("deploy failure", e);
      }
    }

    main();
  }, [
    state.compiler,
    state.contract.usesDelegatedContract,
    state.contract.tokenURI,
    state.contract.requireAccessToken,
    state.contract.approvalProxyAddress,
    provider,
  ]);

  const handleVerifyContract = useCallback(() => {
    async function main() {
      const verifyRequest = toVerifyRequest({
        compilerVersion: "v0.8.9+commit.e5eed63a",
        constructorArguments: "test",
        contractAddress: "0x3460931e72951a7635362B150d6c2F831f3598c0",
        contractName: state.compiler.contractName,
        sourceCode: JSON.stringify(createCompilerInput(state.compiler.files)),
        sourceName: state.compiler.contractName + ".sol",
      });

      const verificationResult = await verifyContract(
        "https://blockscout.com/poa/sokol/api",
        verifyRequest
      );
      console.log(verificationResult);
    }
    main();
  }, [state.compiler, state.config.contractAddress]);

  return (
    <div className="max-w-3xl bg-base-200 rounded-xl p-4 flex items-center justify-center flex-col space-y-4">
      <h1 className="text text-2xl font-semibold">Contract Deployment</h1>
      <div className="flex items-center space-x-4">
        <label
          data-tip="The name of your NFT will also serve as the name of the smart contract. Be sure to choose a unique and memorable name as it may be automatically detected by marketplaces."
          className="label tooltip block label-text"
        >
          Token Name
        </label>
        <input
          className="input input-primary"
          aria-label="Token Name"
          value={state.contract.tokenName}
          onChange={(e) => dispatch(handleChangeTokenName(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label
          data-tip="Provide a 3-4 letter abbreviation for your token, which may appear on rarity tracking tools. While it is not typically used for much with NFTs, it can help to make your token easily recognizable and searchable."
          className="label block label-text tooltip"
        >
          Token Ticker
        </label>
        <input
          className="input input-primary"
          aria-label="Token Ticker"
          required
          value={state.contract.ticker}
          onChange={(e) => dispatch(handleChangeTicker(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={state.contract.supply ? true : false}
          onChange={(e) => dispatch(handleSwitchSupply(e.target.checked))}
        />
        <label
          data-tip="Specify the maximum number of NFTs that can be minted. If you prefer not to set a limit, simply leave this option unchecked."
          className="tooltip label block label-text"
        >
          Supply
        </label>
        <input
          className="input input-primary"
          aria-label="Supply"
          disabled={!state.contract.supply ? true : false}
          value={state.contract.supply ? state.contract.supply : ""}
          onChange={(e) => dispatch(handleChangeSupply(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          onChange={(e) => dispatch(handleSwitchMultimint(e.target.checked))}
        />
        <label
          data-tip="Consider enabling batch NFT minting to save time and transaction fees. Keep in mind that this may result in a more concentrated distribution of ownership."
          className="label tooltip block label-text"
        >
          Multimint
        </label>
        <input
          className="input input-primary"
          aria-label="Supply"
          disabled={!state.contract.multimint}
          value={state.contract.multimint ? state.contract.multimint : ""}
          onChange={(e) => dispatch(handleChangeMultimint(e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={state.contract.limitPerWallet ? true : false}
          onChange={(e) =>
            dispatch(handleSwitchLimitPerWallet(e.target.checked))
          }
        />
        <label
          data-tip="Set a limit on the number of NFTs that can be minted per wallet/address to prevent bots from dominating the supply. Keep in mind that this is a precautionary measure that can be circumvented by splitting Ether into multiple wallets. If you have an allowlist, listed addresses can mint up to their maximum allowance or the overall limit, whichever is greater once the sale begins."
          className="label tooltip block label-text"
        >
          Limit per wallet
        </label>
        <input
          className="input input-primary"
          aria-label="Supply"
          disabled={!state.contract.limitPerWallet ? true : false}
          value={
            state.contract.limitPerWallet ? state.contract.limitPerWallet : ""
          }
          onChange={(e) => dispatch(handleChangeLimitPerWallet(e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={state.contract.onlyOwnerCanMint ? true : false}
          onChange={(e) =>
            dispatch(handleSwitchOnlyOwnerCanMint(e.target.checked))
          }
        />
        <label
          data-tip="Enable the mint function to be accessible only to the contract owner. This is helpful if you want to mint the NFTs yourself and then sell or transfer them later. By default, you are the contract owner, but you can use the transferOwnership function to transfer ownership to another address if needed."
          className="label tooltip block label-text"
        >
          Only owner can mint
        </label>
        <input className="input input-primary" disabled />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => handleCompile()}
        >
          Compile
        </button>
        <button
          disabled={!(state.compiler.status === "done") && isConnected}
          className="btn btn-primary"
          onClick={() => handleDeploy()}
        >
          Deploy
        </button>
        <button
          className="btn btn-primary"
          disabled={!state.config.deployed}
          onClick={() => handleVerifyContract()}
        >
          Verify
        </button>
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Contract;
