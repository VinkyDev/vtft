"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Grid2x2, Airplay } from "lucide-react";
import { ShimmerButton } from "ui/components";

type Platform = "Windows" | "macOS";
type Arch = "x64" | "arm64";

interface DownloadInfo {
  platform: Platform;
  arch: Arch;
  icon: ReactNode;
  label: string;
}

interface NavigatorUAData {
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>;
}

const MINIO_BASE = "https://objectstorageapi.gzg.sealos.run/ggr87o43-vtft/releases";
const GITHUB_RELEASES = "https://github.com/VinkyDev/vtft/releases";

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
  return { platform, arch, icon: meta.icon, label: meta.label(arch) };
};

const DEFAULT_DOWNLOAD_INFO = buildDownloadInfo("Windows", "x64");

async function detectPlatform(): Promise<DownloadInfo> {
  try {
    const uaData = (navigator as { userAgentData?: NavigatorUAData }).userAgentData;
    if (uaData) {
      const { architecture } = await uaData.getHighEntropyValues(["architecture"]);
      const arch = architecture === "arm" ? "arm64" : "x64";
      if (uaData.platform === "macOS") return buildDownloadInfo("macOS", arch);
      if (uaData.platform === "Windows") return buildDownloadInfo("Windows", arch);
    }
  } catch {
    // 降级到传统方法
  }

  try {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const isArm = userAgent.includes("arm") || userAgent.includes("aarch64") || platform.includes("arm");

    if (platform.includes("mac")) return buildDownloadInfo("macOS", isArm ? "arm64" : "x64");
    if (platform.includes("win")) return buildDownloadInfo("Windows", isArm ? "arm64" : "x64");
  } catch {
    // ignore
  }

  return DEFAULT_DOWNLOAD_INFO;
}

async function getDownloadUrl(info: DownloadInfo): Promise<string | null> {
  const ymlFile = info.platform === "Windows" ? "latest.yml" : "latest-mac.yml";

  try {
    const res = await fetch(`${MINIO_BASE}/${ymlFile}`, { cache: "no-store" });
    if (!res.ok) return null;

    const yml = await res.text();
    const versionMatch = yml.match(/^version:\s*(.+)$/m);
    if (!versionMatch?.[1]) return null;

    const version = versionMatch[1].trim();
    const ext = info.platform === "Windows" ? "setup.exe" : "dmg";
    return `${MINIO_BASE}/vtft-${version}-${info.arch}-${ext}`;
  } catch {
    return null;
  }
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

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = await getDownloadUrl(downloadInfo);
      window.location.href = url ?? GITHUB_RELEASES;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ShimmerButton onClick={handleDownload} className="flex items-center gap-3" disabled={isLoading}>
        {downloadInfo.icon}
        <span>下载</span>
      </ShimmerButton>
      <a
        href={GITHUB_RELEASES}
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
