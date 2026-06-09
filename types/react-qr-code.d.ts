declare module "react-qr-code" {
  import React from "react";
  interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    style?: React.CSSProperties;
    className?: string;
  }
  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
}
