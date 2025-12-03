"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type WindowMode = "standard" | "compact" | "floating";
type ScreenZone = "left" | "center" | "right";

interface WindowConfig {
  width: number;
  height: number;
  label: string;
  description: string;
}

const WINDOW_CONFIGS: Record<WindowMode, WindowConfig> = {
  standard: {
    width: 600,
    height: 480,
    label: "标准模式",
    description: "完整功能界面，展示所有游戏数据",
  },
  compact: {
    width: 330,
    height: 250,
    label: "紧凑模式",
    description: "精简视图，节省屏幕空间",
  },
  floating: {
    width: 40,
    height: 40,
    label: "悬浮球模式",
    description: "最小化，随时唤起",
  },
};

const SNAP_ZONE_SIZE = 150; // 吸附区域大小（相对于容器，实际应用中是280px）

export function InteractiveDemo() {
  const [mode, setMode] = useState<WindowMode>("standard");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSnapZone, setShowSnapZone] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [activeTab, setActiveTab] = useState("comps");
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowOffset = useRef({ x: 0, y: 0 });

  // 初始化窗口位置（居中）和容器宽度
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const config = WINDOW_CONFIGS.standard;

      setContainerWidth(width);
      setPosition({
        x: (width - config.width) / 2,
        y: (height - config.height) / 2,
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    windowOffset.current = {
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y,
    };

    setIsDragging(true);
    setShowSnapZone(true);
  };

  const handleFloatingBallClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 检查是否真的是点击而不是拖动
    const currentPos = dragStartPos.current;
    const clickPos = containerRef.current
      ? {
        x: e.clientX - containerRef.current.getBoundingClientRect().left,
        y: e.clientY - containerRef.current.getBoundingClientRect().top,
      }
      : { x: 0, y: 0 };

    const distance = Math.sqrt(
      Math.pow(clickPos.x - currentPos.x, 2) + Math.pow(clickPos.y - currentPos.y, 2)
    );

    // 如果移动距离小于 5px，认为是点击而不是拖动
    if (distance < 5 && mode === "floating") {
      // 切换到标准模式并居中
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const standardConfig = WINDOW_CONFIGS.standard;

        setMode("standard");
        setPosition({
          x: (width - standardConfig.width) / 2,
          y: (height - standardConfig.height) / 2,
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - windowOffset.current.x;
      const y = e.clientY - rect.top - windowOffset.current.y;

      setPosition({ x, y });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 辅助函数：检查是否在吸附区域
      const isInSnapZone = (x: number, y: number): boolean => {
        return x <= SNAP_ZONE_SIZE && y <= SNAP_ZONE_SIZE;
      };

      // 辅助函数：获取窗口中心点所在的屏幕区域
      const getScreenZone = (x: number, width: number): ScreenZone => {
        const centerX = x + width / 2;
        const leftThird = containerWidth / 3;
        const rightThird = (containerWidth * 2) / 3;

        if (centerX < leftThird) return "left";
        if (centerX > rightThird) return "right";
        return "center";
      };

      // 辅助函数：根据屏幕区域获取对应的窗口模式
      const getModeByZone = (zone: ScreenZone): WindowMode => {
        switch (zone) {
          case "left": return "compact";
          case "center": return "standard";
          case "right": return "floating";
        }
      };

      // 检查是否在吸附区域
      const inSnapZone = isInSnapZone(mouseX, mouseY);

      // 获取窗口所在区域
      const config = WINDOW_CONFIGS[mode];
      const zone = getScreenZone(position.x, config.width);
      const targetMode = getModeByZone(zone);

      // 切换模式
      if (targetMode !== mode) {
        const newConfig = WINDOW_CONFIGS[targetMode];

        // 保持水平中心点不变
        const currentCenterX = position.x + config.width / 2;
        const newX = currentCenterX - newConfig.width / 2;

        // 如果是切换到紧凑模式且在吸附区域，吸附到左上角
        if (inSnapZone && targetMode === "compact") {
          setPosition({ x: 0, y: 0 });
        } else {
          setPosition({ x: newX, y: position.y });
        }

        setMode(targetMode);
      } else if (inSnapZone && mode === "compact") {
        // 当前模式不变，但如果在吸附区域且是紧凑模式，也要吸附
        setPosition({ x: 0, y: 0 });
      }

      setIsDragging(false);
      setShowSnapZone(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, mode, position, containerWidth]);

  const config = WINDOW_CONFIGS[mode];
  const leftThird = containerWidth / 3;
  const rightThird = (containerWidth * 2) / 3;

  return (
    <div className="hidden md:block w-full">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold bg-linear-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4">智能窗口模式</h2>
        <p className="text-lg text-slate-300">
          拖动窗口到不同区域，自动切换模式 - 左侧紧凑，中间标准，右侧悬浮
        </p>
      </div>

      {/* 模拟桌面容器 */}
      <div
        ref={containerRef}
        className="relative w-full h-[600px] bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl overflow-hidden border border-slate-700/70 shadow-2xl backdrop-blur-sm"
      >
        {/* 拖动时的全屏遮罩层（模拟 overlay） */}
        {isDragging && (
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[10px] z-10" />
        )}

        {/* 区域分隔线 */}
        {isDragging && (
          <>
            {/* 左侧分隔线 - 标记紧凑/标准模式边界 */}
            <div
              className="absolute w-0 border-l-2 border-dashed border-gray-400/50 z-20"
              style={{
                left: `${leftThird}px`,
                top: '10%',
                bottom: '10%'
              }}
            />
            {/* 右侧分隔线 - 标记标准/悬浮模式边界 */}
            <div
              className="absolute w-0 border-l-2 border-dashed border-gray-400/50 z-20"
              style={{
                left: `${rightThird}px`,
                top: '10%',
                bottom: '10%'
              }}
            />
          </>
        )}

        {/* 吸附区域提示 */}
        {showSnapZone && (
          <div
            className="absolute top-0 left-0 border-2 border-dashed border-gray-400/60 bg-gray-700/10 rounded-xl backdrop-blur-sm z-20"
            style={{
              width: `${SNAP_ZONE_SIZE}px`,
              height: `${SNAP_ZONE_SIZE}px`,
            }}
          />
        )}

        {/* 可拖动窗口 */}
        <motion.div
          className="absolute cursor-move select-none z-30"
          style={{
            x: position.x,
            y: position.y,
            width: config.width,
            height: config.height,
          }}
          onMouseDown={handleMouseDown}
          onClick={mode === "floating" ? handleFloatingBallClick : undefined}
        >
          {/* 窗口内容 */}
          <div className={`w-full h-full shadow-2xl overflow-hidden flex flex-col ${mode === "floating"
              ? "rounded-full bg-transparent"
              : "rounded-2xl bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 border border-slate-700"
            }`}>
            {/* 悬浮球模式 */}
            {mode === "floating" ? (
              <div className="flex-1 flex items-center justify-center cursor-pointer">
                <Image
                  src='https://i.imgs.ovh/2025/11/14/CaAxWL.png'
                  alt="VTFT Logo"
                  className="w-full h-full object-contain p-0.5"
                  width={100}
                  height={100}
                  draggable={false}
                />
              </div>
            ) : (
              <>
                {/* 标准/紧凑模式 - Tab导航栏 */}
                <div className="p-2">
                  <div className="flex items-center justify-center">
                    <div className="bg-black/30 border border-white/20 rounded-lg p-1 flex gap-1">
                      {["阵容", "装备", "英雄", "符文"].map((label, idx) => (
                        <button
                          key={label}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(["comps", "items", "champions", "augments"][idx] || "comps");
                          }}
                          className={`px-3 py-1 text-xs font-medium rounded transition-all ${activeTab === ["comps", "items", "champions", "augments"][idx]
                              ? "bg-blue-500/80 text-white shadow-sm"
                              : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 内容区 */}
                <div className="flex-1 px-2 pb-2 overflow-hidden">
                  <div className="h-full bg-black/20 rounded-lg border border-white/10 p-2 overflow-auto">
                    {/* 模拟游戏数据卡片 */}
                    <div className={`grid gap-2 ${mode === "compact" ? "grid-cols-1" : "grid-cols-2"}`}>
                      {(mode === "compact" ? [1, 2] : [1, 2, 3, 4, 5, 6]).map((i) => (
                        <div
                          key={i}
                          className="bg-linear-to-br from-slate-800/80 to-slate-900/80 rounded-lg border border-slate-700/50 p-3 hover:border-blue-500/30 transition-colors"
                        >
                          {/* 模拟标题 */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded ${i % 3 === 0 ? "bg-linear-to-br from-blue-500 to-purple-500" :
                                i % 3 === 1 ? "bg-linear-to-br from-green-500 to-teal-500" :
                                  "bg-linear-to-br from-orange-500 to-red-500"
                              }`} />
                            <div className="h-3 w-20 bg-slate-600/50 rounded" />
                            <div className="ml-auto text-xs text-slate-500">#{i}</div>
                          </div>
                          {/* 模拟描述文字 */}
                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-slate-700/30 rounded" />
                            <div className="h-2 w-4/5 bg-slate-700/30 rounded" />
                            {mode === "standard" && (
                              <div className="h-2 w-2/3 bg-slate-700/30 rounded" />
                            )}
                          </div>
                          {/* 模拟底部标签 */}
                          {mode === "standard" && (
                            <div className="flex gap-1 mt-2">
                              <div className="h-1.5 w-8 bg-blue-500/30 rounded-full" />
                              <div className="h-1.5 w-8 bg-purple-500/30 rounded-full" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
