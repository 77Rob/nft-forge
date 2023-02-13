import React, { useState, useRef, useEffect } from "react";

function HeaderInput({
  value,
  setValue,
}: {
  value: string | undefined;
  setValue: (value: string) => void;
}) {
  const [text, setText] = useState(value || "");

  const [isHeader, setIsHeader] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleHeaderClick = (e: any) => {
    e.stopPropagation();
    setIsHeader(false);
  };

  useEffect(() => {
    console.log("isHeader:", isHeader);
    if (!isHeader) {
      inputRef.current?.focus();
    }
  }, [isHeader]); // add isHeader as a dependency

  const handleInputBlur = (e: any) => {
    setIsHeader(true);
    setValue(text);
  };

  const handleInputChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsHeader(true);
        setValue(text);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return isHeader ? (
    <h1 className="input input-xs my-2 bg-inherit" onClick={handleHeaderClick}>
      {text}
    </h1>
  ) : (
    <input
      type="text"
      className="input input-primary my-2 input-xs max-w-[80%] "
      value={text}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      ref={inputRef}
    />
  );
}

export default HeaderInput;
