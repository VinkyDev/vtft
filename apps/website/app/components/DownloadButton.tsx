"use client";

import { ReactNode, useState } from "react";
import { Grid2x2, Airplay } from 'lucide-react';
import { withSuspense } from 'react-helper';
import { ShimmerButton } from "ui/components";

interface DownloadInfo {
  platform: "Windows" | "macOS";
  icon: ReactNode;
  label: string;
  url: string;
}

const GITHUB_REPO = "VinkyDev/vtft";
const GITHUB_MIRROR = "https://gh-proxy.com/";

function detectPlatform(): DownloadInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (platform.includes("mac")) {
    const isAppleSilicon = userAgent.includes("arm") ||
      userAgent.includes("aarch64") ||
      platform.includes("arm");

    return {
      platform: "macOS",
      icon: <Airplay />,
      label: isAppleSilicon ? "macOS (Apple Silicon)" : "macOS (Intel)",
      url: isAppleSilicon ? "vtft-arm64.dmg" : "vtft-x64.dmg",
    };
  } else {
    const isARM = userAgent.includes("arm") || userAgent.includes("aarch64");
    return {
      platform: "Windows",
      icon: <Grid2x2 />,
      label: isARM ? "Windows ARM" : "Windows",
      url: isARM ? "vtft-arm64-setup.exe" : "vtft-setup.exe",
    };
  }
}

function DownloadButtonContent() {
  const [downloadInfo] = useState<DownloadInfo>(() => detectPlatform());

  const handleDownload = () => {
    const githubUrl = `https://github.com/${GITHUB_REPO}/releases/latest/download/${downloadInfo.url}`;
    const downloadUrl = `${GITHUB_MIRROR}${githubUrl}`;
    window.location.href = downloadUrl;
  };

  const releasesUrl = `${GITHUB_MIRROR}https://github.com/${GITHUB_REPO}/releases`;

  return (
    <div className="flex flex-col items-center gap-4">
      <ShimmerButton
        onClick={handleDownload}
        className="flex items-center gap-3"
      >
        {downloadInfo.icon}
        <span>下载</span>
      </ShimmerButton>
      <a
        href={releasesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm transition-colors text-slate-400 hover:text-slate-300"
      >
        查看所有版本 →
      </a>
    </div>
  );
}

function DownloadButtonFallback() {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        disabled
        className="flex items-center gap-2 rounded-lg bg-indigo-600/50 px-8 py-2 text-lg font-semibold text-white shadow-lg cursor-not-allowed"
      >
        <div className="h-6 w-6 animate-pulse rounded bg-white/20" />
        <span>加载中...</span>
      </button>
      <div className="text-center">
        <p className="h-5 w-32 animate-pulse rounded bg-slate-700" />
      </div>
      <div className="h-5 w-28 animate-pulse rounded bg-slate-700" />
    </div>
  );
}

export const DownloadButton = withSuspense(
  DownloadButtonContent,
  DownloadButtonFallback,
  { shouldForwardRef: false }
);
