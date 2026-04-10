"use client";

import { useState } from "react";
import Image from "next/image";

interface InstallExtensionDialogProps {
  open: boolean;
  onClose?: () => void;
  onTryDirect?: () => Promise<void>;
}

const STORE_URL =
  "https://chromewebstore.google.com/detail/office-viewer/TODO";

export default function InstallExtensionDialog({
  open,
  onClose,
  onTryDirect,
}: InstallExtensionDialogProps) {
  const [directError, setDirectError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleTryDirect = async () => {
    if (!onTryDirect) return;
    setDirectError("");
    setLoading(true);
    try {
      await onTryDirect();
      onClose?.();
    } catch (e) {
      setDirectError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Office Viewer"
            width={56}
            height={56}
            className="mb-4"
          />
          <h2 className="text-lg font-semibold text-slate-800">
            Install Office Viewer
          </h2>
          <p className="text-sm text-slate-500 mt-1 text-center leading-relaxed">
            The browser extension is required to open this file.
            It enables local file access and cross-origin fetching.
          </p>
        </div>

        <div className="px-8 pb-4 space-y-3">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2.5 bg-[#FF5900] text-white rounded-lg hover:bg-[#e04f00] transition-colors text-sm font-medium"
          >
            Install Extension
          </a>
          <button
            onClick={() => {
              onClose?.();
              window.location.href = "/";
            }}
            className="w-full px-4 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {onTryDirect && (
          <div className="px-8 pb-6 pt-2 border-t border-slate-100">
            <button
              onClick={handleTryDirect}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors mx-auto block disabled:opacity-50"
            >
              {loading ? "Loading..." : "Try opening without extension"}
            </button>
            {directError && (
              <p className="text-xs text-red-500 text-center mt-2">
                {directError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
