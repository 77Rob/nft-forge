import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const WalletConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected && address)
    return (
      <button className="btn btn-primary" onClick={() => disconnect()}>
        Disconnect
      </button>
    );
  return (
    <button className="btn btn-ghost" onClick={() => connect()}>
      Connect Wallet
    </button>
  );
};

export default WalletConnectButton;
