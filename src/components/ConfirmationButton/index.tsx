import React, { useState } from "react";

type ConfirmationButtonProps = {
  onConfirmed: () => void; // the function to execute when the user confirms the action
  children: any; // the title of the button
  confirmationText: string; // the text to display in the confirmation window
  className?: string;
  title: string;
};

const ConfirmationButton = ({
  onConfirmed,
  children,
  className = "",
  title,
  confirmationText,
}: ConfirmationButtonProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false); // a state to toggle the confirmation window

  // a function to handle the click event on the button
  const handleClick = () => {
    setShowConfirmation(true); // show the confirmation window
  };

  // a function to handle the confirm event on the confirmation window
  const handleConfirm = () => {
    onConfirmed(); // execute the onConfirmed function
    setShowConfirmation(false); // hide the confirmation window
  };

  // a function to handle the cancel event on the confirmation window
  const handleCancel = () => {
    setShowConfirmation(false); // hide the confirmation window
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={`btn btn-error font-bold rounded ${className}`}
        onClick={handleClick}
      >
        {children}
      </button>
      {showConfirmation && ( // render the confirmation window only if showConfirmation is true
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4  text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-base-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-base-100 px-4 pt-5 pb-8 sm:p-8 sm:pb-12">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-base-300 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium "
                      id="modal-headline"
                    >
                      {title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm ">{confirmationText}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-base-200 px-4 py-3 sm:px-6 gap-2 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className=" btn btn-error "
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-outline "
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationButton;
