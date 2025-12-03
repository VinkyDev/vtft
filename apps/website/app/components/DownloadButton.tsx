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

// 默认兜底配置：Windows Intel/AMD
const DEFAULT_DOWNLOAD_INFO: DownloadInfo = {
  platform: "Windows",
  icon: <Grid2x2 />,
  label: "Windows",
  url: "vtft-x64-setup.exe",
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
          url: isARM ? "vtft-arm64-setup.exe" : "vtft-x64-setup.exe",
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
        url: isARM ? "vtft-arm64-setup.exe" : "vtft-x64-setup.exe",
      };
    }
  } catch (error) {
    logger.warn(`平台检测失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  // 最终兜底：返回 Windows Intel/AMD
  return DEFAULT_DOWNLOAD_INFO;
}

// 安装提示组件
function InstallTip({ platform }: { platform: "Windows" | "macOS" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (platform === "Windows") {
    return (
      <div className="text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto"
        >
          <span>⚠️ 无法安装？</span>
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isExpanded && (
          <div className="mt-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 max-w-xs mx-auto">
            <p className="mb-1">由于软件未签名，Windows 可能会拦截：</p>
            <p>1. 点击 <span className="text-slate-300">「更多信息」</span></p>
            <p>2. 点击 <span className="text-slate-300">「仍要运行」</span></p>
          </div>
        )}
      </div>
    );
  }

  // macOS
  return (
    <div className="text-center">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto"
      >
        <span>⚠️ 打开时提示「已损坏」？</span>
        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="mt-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 max-w-xs mx-auto">
          <p className="mb-2">在终端运行以下命令：</p>
          <code className="block p-2 rounded bg-slate-900/50 text-slate-300 text-[10px] break-all">
            sudo xattr -r -d com.apple.quarantine /Applications/vtft.app
          </code>
        </div>
      )}
    </div>
  );
}

export const DownloadButton = () => {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>(DEFAULT_DOWNLOAD_INFO);

  useEffect(() => {
    detectPlatform().then(setDownloadInfo);
  }, []);

  const handleDownload = () => {
    const downloadUrl = `https://static-host-ggr87o43-vtft.sealosgzg.site/${downloadInfo.url}`;
    window.location.href = downloadUrl;
  };

  const releasesUrl = `https://github.com/${GITHUB_REPO}/releases`;

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
      <InstallTip platform={downloadInfo.platform} />
    </div>
  );
}
