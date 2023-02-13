import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationButton from "./index";
import "@testing-library/jest-dom";

describe("ConfirmationButton component", () => {
  test("renders the button with the given title", () => {
    render(
      <ConfirmationButton
        onConfirmed={() => {}}
        title="Delete account"
        confirmationText="Are you sure you want to delete your account?"
      >
        Delete account
      </ConfirmationButton>
    );
    expect(screen.getByText("Delete account")).toBeInTheDocument();
  });

  test("shows the confirmation window when the button is clicked", () => {
    render(
      <ConfirmationButton
        onConfirmed={() => {}}
        title="Delete account"
        confirmationText="Are you sure you want to delete your account?"
      >
        Delete account
      </ConfirmationButton>
    );
    fireEvent.click(screen.getByText("Delete account"));
    expect(
      screen.getByText("Are you sure you want to delete your account?")
    ).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("calls the onConfirmed function when the confirm button is clicked", () => {
    const mockOnConfirmed = jest.fn();
    render(
      <ConfirmationButton
        onConfirmed={mockOnConfirmed}
        title="Delete account"
        confirmationText="Are you sure you want to delete your account?"
      >
        Delete account
      </ConfirmationButton>
    );
    fireEvent.click(screen.getByText("Delete account"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirmed).toHaveBeenCalledTimes(1);
  });

  test("hides the confirmation window when the cancel button is clicked", () => {
    render(
      <ConfirmationButton
        onConfirmed={() => {}}
        title="Delete account"
        confirmationText="Are you sure you want to delete your account?"
      >
        Delete account
      </ConfirmationButton>
    );
    fireEvent.click(screen.getByText("Delete account"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText("Are you sure you want to delete your account?")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });
});
