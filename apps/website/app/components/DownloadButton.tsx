"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Grid2x2, Airplay } from 'lucide-react';
import { ShimmerButton } from "ui/components";
import logger from 'logger';

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

// 默认兜底配置：Windows Intel/AMD
const DEFAULT_DOWNLOAD_INFO: DownloadInfo = {
  platform: "Windows",
  icon: <Grid2x2 />,
  label: "Windows",
  url: "vtft-setup.exe",
};

async function detectPlatform(): Promise<DownloadInfo> {
  try {
    // 尝试使用现代 User-Agent Client Hints API
    if ('userAgentData' in navigator) {
      const uaData = navigator.userAgentData as NavigatorUAData;
      const highEntropyValues = await uaData.getHighEntropyValues(['architecture']);
      const arch = highEntropyValues.architecture;

      if (uaData.platform === 'macOS') {
        const isARM = arch === 'arm';
        return {
          platform: "macOS",
          icon: <Airplay />,
          label: isARM ? "macOS (Apple Silicon)" : "macOS (Intel)",
          url: isARM ? "vtft-arm64.dmg" : "vtft-x64.dmg",
        };
      }

      if (uaData.platform === 'Windows') {
        const isARM = arch === 'arm';
        return {
          platform: "Windows",
          icon: <Grid2x2 />,
          label: isARM ? "Windows ARM" : "Windows",
          url: isARM ? "vtft-arm64-setup.exe" : "vtft-setup.exe",
        };
      }
    }
  } catch (error) {
    logger.error('User-Agent Client Hints API 检测失败，降级到传统方法:', error as Error);
  }

  // 降级方案：使用传统 userAgent 检测
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    // macOS 检测
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
    }

    // Windows 检测
    if (platform.includes("win")) {
      const isARM = userAgent.includes("arm") || userAgent.includes("aarch64");
      return {
        platform: "Windows",
        icon: <Grid2x2 />,
        label: isARM ? "Windows ARM" : "Windows",
        url: isARM ? "vtft-arm64-setup.exe" : "vtft-setup.exe",
      };
    }
  } catch (error) {
    logger.warn(`平台检测失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  // 最终兜底：返回 Windows Intel/AMD
  return DEFAULT_DOWNLOAD_INFO;
}

export const DownloadButton = () => {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>(DEFAULT_DOWNLOAD_INFO);

  useEffect(() => {
    detectPlatform().then(setDownloadInfo);
  }, []);

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
