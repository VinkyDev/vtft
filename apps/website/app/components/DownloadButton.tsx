"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Grid2x2, Airplay } from "lucide-react";
import { ShimmerButton } from "ui/components";
import logger from "logger";

type Platform = "Windows" | "macOS";
type Arch = "x64" | "arm64";

interface DownloadInfo {
  platform: Platform;
  arch: Arch;
  icon: ReactNode;
  label: string;
}

interface LatestFile {
  url: string;
  sha256?: string;
  size?: number;
}

interface LatestJson {
  version: string;
  notes?: string;
  files: {
    windows?: Record<Arch, LatestFile>;
    macos?: Record<Arch, LatestFile>;
  };
}

interface NavigatorUAData {
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>;
}

const GITHUB_REPO = "VinkyDev/vtft";
const LATEST_URL = "https://static-host-ggr87o43-vtft.sealosgzg.site/latest.json";
const releasesUrl = `https://github.com/${GITHUB_REPO}/releases`;

const PLATFORM_META: Record<Platform, { icon: ReactNode; label: (arch: Arch) => string }> = {
  Windows: {
    icon: <Grid2x2 />,
    label: (arch) => (arch === "arm64" ? "Windows ARM" : "Windows"),
  },
  macOS: {
    icon: <Airplay />,
    label: (arch) => (arch === "arm64" ? "macOS (Apple Silicon)" : "macOS (Intel)"),
  },
};

const buildDownloadInfo = (platform: Platform, arch: Arch): DownloadInfo => {
  const meta = PLATFORM_META[platform];
  return {
    platform,
    arch,
    icon: meta.icon,
    label: meta.label(arch),
  };
};

const DEFAULT_DOWNLOAD_INFO = buildDownloadInfo("Windows", "x64");

async function detectPlatform(): Promise<DownloadInfo> {
  // 优先使用 User-Agent Client Hints
  try {
    const uaData = (navigator as { userAgentData?: NavigatorUAData }).userAgentData;
    if (uaData) {
      const { architecture } = await uaData.getHighEntropyValues(["architecture"]);
      const arch = architecture === "arm" ? "arm64" : "x64";
      if (uaData.platform === "macOS") return buildDownloadInfo("macOS", arch);
      if (uaData.platform === "Windows") return buildDownloadInfo("Windows", arch);
    }
  } catch (error) {
    logger.error("User-Agent Client Hints API 检测失败，降级到传统方法:", error as Error);
  }

  // 兜底：传统 UA 检测
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const isArm = userAgent.includes("arm") || userAgent.includes("aarch64") || platform.includes("arm");

    if (platform.includes("mac")) return buildDownloadInfo("macOS", isArm ? "arm64" : "x64");
    if (platform.includes("win")) return buildDownloadInfo("Windows", isArm ? "arm64" : "x64");
  } catch (error) {
    logger.warn(`平台检测失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  return DEFAULT_DOWNLOAD_INFO;
}

function InstallTip({ platform }: { platform: Platform }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (platform === "Windows") {
    return (
      <div className="text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto"
        >
          <span>⚠️ 无法安装？</span>
          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
        </button>
        {isExpanded && (
          <div className="mt-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 max-w-xs mx-auto">
            <p className="mb-1">由于软件未签名，Windows 可能会拦截：</p>
            <p>
              1. 点击 <span className="text-slate-300">「更多信息」</span>
            </p>
            <p>
              2. 点击 <span className="text-slate-300">「仍要运行」</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto"
      >
        <span>⚠️ 打开时提示「已损坏」？</span>
        <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    detectPlatform().then(setDownloadInfo);
  }, []);

  const fetchLatest = async (): Promise<LatestJson> => {
    const res = await fetch(LATEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`获取 latest.json 失败: ${res.status}`);
    return res.json();
  };

  const resolveDownloadUrl = (latest: LatestJson): string | null => {
    const platformKey = downloadInfo.platform === "Windows" ? "windows" : "macos";
    const matched = latest.files?.[platformKey]?.[downloadInfo.arch];
    return matched?.url ?? null;
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const latest = await fetchLatest();
      const downloadUrl = resolveDownloadUrl(latest);
      if (downloadUrl) {
        window.location.href = downloadUrl;
      } else {
        throw new Error("下载链接不存在");
      }
    } catch (error) {
      logger.error("获取 latest.json 失败", error as Error);
      window.location.href = releasesUrl;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ShimmerButton onClick={handleDownload} className="flex items-center gap-3" disabled={isLoading}>
        {downloadInfo.icon}
        <span>{isLoading ? "准备下载..." : "下载"}</span>
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
};
