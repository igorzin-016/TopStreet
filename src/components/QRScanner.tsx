import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type QRScannerProps = { onRead: (value: string) => void };

export default function QRScanner({ onRead }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 260, height: 260 } }, (decoded) => {
      if (handledRef.current) return;
      handledRef.current = true;
      onRead(decoded);
    }, () => undefined).catch(() => undefined);

    return () => {
      if (scanner.isScanning) scanner.stop().catch(() => undefined);
      scanner.clear();
    };
  }, [onRead]);

  return <div id="qr-reader" className="min-h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black" />;
}
