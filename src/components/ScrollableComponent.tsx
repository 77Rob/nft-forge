import React, { ReactNode } from "react";

interface ScrollableComponentProps {
  // children prop of type ReactNode
  children: ReactNode;
  // height prop of type string, with a default value of "h-72"
  height?: string;
  // className prop of type string, with a default value of ""
  className?: string;
  // width prop of type string, with a default value of "w-full"
  width?: string;
}

function ScrollableComponent({
  children,
  height = "96px",
  className = "",
  width = "w-full",
}: ScrollableComponentProps) {
  const h = `h-[${height}]`;
  console.log(height, h);
  return (
    <div
      style={{
        height: height,
      }}
      className={width + " overflow-auto" + " p-2 " + className}
    >
      {children}
    </div>
  );
}

export default ScrollableComponent;
