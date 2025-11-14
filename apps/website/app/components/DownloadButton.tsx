"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { Grid2x2, Airplay } from 'lucide-react';
import { ShimmerButton } from "ui/components";

interface DownloadInfo {
  platform: "Windows" | "macOS";
  icon: ReactNode;
  label: string;
  url: string;
}

interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<{
    architecture?: string;
    bitness?: string;
    model?: string;
    platform?: string;
    platformVersion?: string;
    uaFullVersion?: string;
    fullVersionList?: Array<{ brand: string; version: string }>;
  }>;
}

const GITHUB_REPO = "VinkyDev/vtft";
const GITHUB_MIRROR = "https://gh-proxy.com/";

async function detectArchitecture(): Promise<{ isARM: boolean; platform: string }> {
  try {
    if ('userAgentData' in navigator) {
      const uaData = (navigator).userAgentData as NavigatorUAData;

      // macOS 检测
      if (uaData.platform === 'macOS') {
        const highEntropyValues = await uaData.getHighEntropyValues(['architecture']);

        // Apple Silicon 检测 (arm 架构)
        if (highEntropyValues.architecture === 'arm') {
          return { isARM: true, platform: 'macOS' };
        }

        // Intel 架构
        if (highEntropyValues.architecture === 'x86') {
          return { isARM: false, platform: 'macOS' };
        }
      }

      // Windows 等其他平台
      if (uaData.platform === 'Windows') {
        const highEntropyValues = await uaData.getHighEntropyValues(['architecture']);
        return { isARM: highEntropyValues.architecture === 'arm', platform: 'Windows' };
      }
    }
  } catch (error) {
    console.warn('无法使用 userAgentData API，降级到 UA 检测:', error);
  }

  // 降级方案：使用 userAgent 检测
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  // Apple Silicon 检测
  if (platform.includes("mac")) {
    const isAppleSilicon = userAgent.includes("arm") ||
      userAgent.includes("aarch64") ||
      platform.includes("arm") ||
      userAgent.includes("apple silicon");

    return { isARM: isAppleSilicon, platform: 'macOS' };
  }

  // Windows ARM 检测
  if (platform.includes("win")) {
    const isARM = userAgent.includes("arm") || userAgent.includes("aarch64");
    return { isARM, platform: 'Windows' };
  }

  return { isARM: false, platform: 'Unknown' };
}

export const DownloadButton = () => {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initPlatform = useCallback(async () => {
    try {
      const { isARM, platform } = await detectArchitecture();

      if (platform === 'macOS') {
        setDownloadInfo({
          platform: "macOS",
          icon: <Airplay />,
          label: isARM ? "macOS (Apple Silicon)" : "macOS (Intel)",
          url: isARM ? "vtft-arm64.dmg" : "vtft-x64.dmg",
        });
      } else if (platform === 'Windows') {
        setDownloadInfo({
          platform: "Windows",
          icon: <Grid2x2 />,
          label: isARM ? "Windows ARM" : "Windows",
          url: isARM ? "vtft-arm64-setup.exe" : "vtft-setup.exe",
        });
      } else {
        // 默认返回 Windows
        setDownloadInfo({
          platform: "Windows",
          icon: <Grid2x2 />,
          label: "Windows",
          url: "vtft-setup.exe",
        });
      }
    } catch (error) {
      console.error("平台检测失败，使用默认值:", error);
      // 降级方案：默认 Windows
      setDownloadInfo({
        platform: "Windows",
        icon: <Grid2x2 />,
        label: "Windows",
        url: "vtft-setup.exe",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initPlatform();
  }, [initPlatform]);

  if (!downloadInfo || isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          disabled
          className="flex items-center gap-2 rounded-lg bg-indigo-600/50 px-8 py-2 text-lg font-semibold text-white shadow-lg cursor-not-allowed"
        >
          <div className="h-6 w-6 animate-pulse rounded bg-white/20" />
          <span>检测中...</span>
        </button>
        <div className="text-center">
          <p className="h-5 w-32 animate-pulse rounded bg-slate-700" />
        </div>
        <div className="h-5 w-28 animate-pulse rounded bg-slate-700" />
      </div>
    );
  }

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
