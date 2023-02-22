import { useCompiler } from "@/compiler/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import {
  handleAddPayoutDestination,
  handleUpdatePayoutDestinationAddress,
  handleUpdatePayoutDestinationAmount,
  handleRemovePayoutDestination,
  handleChangeAmountAllowedForOwner,
  handleUpdateAllowlistDestinationAddress,
  handleUpdateAllowlistDestinationAmount,
  handleRemoveAllowlistDestination,
  handleAddAllowlistDestination,
} from "@/store/contractReducer";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import IconTrash from "@/components/icons/IconTrash";

const AllowList = () => {
  const state = useAppSelector((state) => state.contract);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full px-12">
      <div className="flex py-4 justify-between">
        <h2
          data-tip="Addresses allowed to mint and amount they can mint, before the sale starts."
          className="text text-xl font-semibold tooltip"
        >
          Allow List
        </h2>
        <button
          onClick={() => dispatch(handleAddAllowlistDestination())}
          className="btn btn-sm btn-primary"
        >
          Add Address
        </button>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <div className="flex space-x-4 ">
            <div className="input input-bordered items-center flex w-full">
              Contract Owner
            </div>
            <label className="input-group w-[110px]">
              <input
                className="input w-[70px] items-center justify-center flex  input-bordered"
                placeholder="Percentage"
                value={state.contract.amountAllowedForOwner}
                type="number"
                onChange={(e) =>
                  dispatch(
                    handleChangeAmountAllowedForOwner({
                      index: 0,
                      amount: e.target.value,
                    })
                  )
                }
              />
            </label>
          </div>
        </div>

        {state.contract.allowlistDestinations.map((destination, index) => (
          <div key={index} className="flex space-x-4">
            <input
              className="input input-bordered w-full"
              placeholder="Address"
              value={destination.address}
              onChange={(e) =>
                dispatch(
                  handleUpdateAllowlistDestinationAddress({
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
                    handleUpdateAllowlistDestinationAmount({
                      index,
                      amount: e.target.value,
                    })
                  )
                }
              />
            </label>

            <button
              className="btn btn-error col-span-1"
              onClick={() => dispatch(handleRemoveAllowlistDestination(index))}
            >
              <IconTrash className="w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllowList;
