import { useCompiler } from "@/compiler/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  handleChangeTokenName,
  handleChangeTicker,
  handleSwitchSupply,
  handleChangeSupply,
  handleSwitchMultimint,
  handleChangeMultimint,
  handleSwitchLimitPerWallet,
  handleChangeLimitPerWallet,
  handleSwitchOnlyOwnerCanMint,
  handleSwitchEnumerable,
  handleSwitchActivateAutomatically,
} from "@/store/contractReducer";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

const ContractOptions = () => {
  const compiler = useCompiler();
  const state = useAppSelector((state) => state.contract);
  const dispatch = useAppDispatch();
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const { isConnected } = useAccount();
  const collection = useAppSelector((state) => state.generativeCollection);

  return (
    <div className="space-y-2">
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
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={state.contract.enumerable ? true : false}
          onChange={(e) => dispatch(handleSwitchEnumerable(e.target.checked))}
        />
        <label
          data-tip="Consider using the ERC721Enumerable extension to provide an API for looking up the list of NFTs owned by an address. This is particularly useful if you plan to build projects that utilize the NFTs. Keep in mind that using this extension will increase transaction fees by approximately 50% when minting and transferring NFTs. Note that this option is not available with the reduced deployment cost option. Due to rising gas fees, many developers avoid using this extension, and instead provide similar functionality on their website using indexing services. However, this approach requires additional effort and relies on off-chain data."
          className="label tooltip block label-text"
        >
          Enumerable
        </label>
        <input className="input input-primary" disabled />
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={state.contract.activateAutomatically ? true : false}
          onChange={(e) =>
            dispatch(handleSwitchActivateAutomatically(e.target.checked))
          }
        />
        <label
          data-tip="Use the setSaleIsActive function to activate or deactivate the sale of your NFT. By checking this option, the sale will be activated automatically when you deploy the contract."
          className="label tooltip block label-text"
        >
          Initialize minting active
        </label>
        <input className="input input-primary" disabled />
      </div>
    </div>
  );
};

export default ContractOptions;
