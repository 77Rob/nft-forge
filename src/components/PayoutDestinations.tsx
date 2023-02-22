import { useCompiler } from "@/compiler/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import {
  handleAddPayoutDestination,
  handleUpdatePayoutDestinationAddress,
  handleUpdatePayoutDestinationAmount,
  handleRemovePayoutDestination,
} from "@/store/contractReducer";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import IconTrash from "@/components/icons/IconTrash";

const PayoutDestinations = () => {
  const compiler = useCompiler();
  const state = useAppSelector((state) => state.contract);
  const dispatch = useAppDispatch();
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const { isConnected, status } = useAccount();
  const collection = useAppSelector((state) => state.generativeCollection);

  const ownerPayoutAmount = useMemo(() => {
    const ownerPayout = state.contract.payoutDestinations.reduce((a, b) => {
      console.log(a, b.amount);
      return a - b.amount;
    }, 100);
    if (ownerPayout > 0 && ownerPayout < 100) {
      return ownerPayout;
    }
    if (ownerPayout >= 100) {
      return 100;
    }
    return 0;
  }, [state.contract.payoutDestinations]);

  return (
    <div className="w-full px-12">
      <div className="flex py-4 justify-between">
        <h2
          data-tip="If you set a price for your NFT, you can use the split payment function to distribute the Ether paid to the contract to multiple addresses. This allows you to split revenue among multiple parties."
          className="text text-xl font-semibold tooltip"
        >
          Payout Destinations
        </h2>
        <button
          onClick={() => dispatch(handleAddPayoutDestination())}
          className="btn btn-sm btn-primary"
        >
          Add Recipient
        </button>
      </div>

      <div className="mb-4 space-y-4">
        {state.contract.payoutDestinations.length > 0 && (
          <div>
            <div className="flex space-x-4 ">
              <div className="input input-bordered items-center flex w-full">
                Contract Owner
              </div>
              <label className="input-group w-[110px]">
                <div
                  className="input w-[70px] items-center justify-center flex  input-bordered"
                  placeholder="Percentage"
                >
                  {ownerPayoutAmount}
                </div>
                <span>%</span>
              </label>
            </div>
          </div>
        )}

        {state.contract.payoutDestinations.map((destination, index) => (
          <div key={index} className="flex space-x-4">
            <input
              className="input input-bordered w-full"
              placeholder="Address"
              value={destination.address}
              onChange={(e) =>
                dispatch(
                  handleUpdatePayoutDestinationAddress({
                    index,
                    address: e.target.value,
                  })
                )
              }
            />
            <label className="input-group w-[110px]">
              <input
                className="input w-[70px] input-bordered"
                placeholder="Percentage"
                value={destination.amount}
                type="number"
                onChange={(e) =>
                  dispatch(
                    handleUpdatePayoutDestinationAmount({
                      index,
                      amount: e.target.value,
                    })
                  )
                }
              />
              <span>%</span>
            </label>

            <button
              className="btn btn-error col-span-1"
              onClick={() => dispatch(handleRemovePayoutDestination(index))}
            >
              <IconTrash className="w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutDestinations;
