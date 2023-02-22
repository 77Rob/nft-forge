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
} from "@/store/contractReducer";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { deployContract } from "@/utils";
import { ContractFactory } from "ethers";
import axios from "axios";
import { toVerifyRequest, verifyContract } from "@/utils/verify";
import ContractOptions from "@/components/ContractOptions";
import { Interface } from "@ethersproject/abi";
import PayoutDestinations from "@/components/PayoutDestinations";
import AllowList from "@/components/AllowList";
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
  const { isConnected, status } = useAccount();
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
        console.log("contract.address");
        console.log(contract.address);
        dispatch(handleContractDeployed({ contractAddress: contract.address }));
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
      const { contracts, contractName, sourceName } = state.compiler;

      const contractInterface = new Interface(
        contracts[sourceName][contractName].abi
      );

      const deploymentArguments = contractInterface.encodeDeploy([
        state.contract.tokenURI,
      ]);

      console.log(deploymentArguments);
      const verifyRequest = toVerifyRequest({
        compilerVersion: "v0.8.9+commit.e5eed63a",
        constructorArguments: deploymentArguments,
        contractAddress: state.config.contractAddress || "",
        contractName: state.compiler.contractName,
        sourceCode: createCompilerInput(state.compiler.files),
        sourceName: state.compiler.contractName + ".sol",
      });

      const verificationResult = await verifyContract(
        "https://blockscout.com/poa/sokol/api",
        verifyRequest
      );
      console.log("verificationResult");
      console.log(verificationResult);
    }
    main();
  }, [state.compiler, state.config.contractAddress]);

  return (
    <div className="max-w-4xl mx-auto bg-base-200 rounded-xl p-4 flex items-center justify-center flex-col space-y-4">
      <h1 className="text text-2xl font-semibold">Contract Deployment</h1>
      <ContractOptions />
      <PayoutDestinations />
      <AllowList />
      <div className="flex space-x-4">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => handleCompile()}
        >
          Compile
        </button>
        <button
          disabled={
            !(state.compiler.status === "done") && !(status == "connected")
          }
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
