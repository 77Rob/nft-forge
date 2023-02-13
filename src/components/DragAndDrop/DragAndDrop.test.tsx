import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DragAndDrop from "./index";
import axios from "axios";

beforeEach(() => {
  const mockAxios = jest.spyOn(axios, "post");
  mockAxios.mockResolvedValue({ data: { message: "success" } });
});

test("allows the user to select files", () => {
  render(<DragAndDrop collectionId="1" layerId="1" onCompleted={() => {}} />);
  const input = screen.getByTestId("file-input") as HTMLInputElement;

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  fireEvent.change(input, { target: { files: [file] } });
  expect(input.files).not.toBeNull();
  expect(input.files![0]).toStrictEqual(file);
  expect(input.files).toHaveLength(1);
});

test("allows the user to upload files", async () => {
  const onCompleted = jest.fn();
  render(
    <DragAndDrop collectionId="1" layerId="1" onCompleted={onCompleted} />
  );
  const input = screen.getByTestId("file-input") as HTMLInputElement;
  const button = screen.getByText(/Upload/i) as HTMLButtonElement;
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  fireEvent.change(input, { target: { files: [file] } });
  fireEvent.click(button);

  const mockAxios = jest.spyOn(axios, "post");
  await mockAxios.mockResolvedValue({ data: { message: "success" } });
  // wait for the mock request to resolve
  await waitFor(() => expect(mockAxios).toHaveBeenCalled());
  // check if the onCompleted prop is called
  expect(onCompleted).toHaveBeenCalled();
});
