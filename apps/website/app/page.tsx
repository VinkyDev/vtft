import Image from "next/image";
import { DownloadButton } from "./components/DownloadButton";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { Zap, Shield, BarChart3 } from "lucide-react";
import { LightRays } from "ui/components";

// 特性数据
const features = [
  {
    icon: Zap,
    title: "快速更新",
    description: "同步最新数据",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "数据精准",
    description: "专业算法分析，确保数据准确性",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "开源透明，不读取游戏数据",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden w-full">

      <section className="relative w-full px-6 pt-20 pb-12">
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-12 flex justify-center animate-fade-in">
            <div className="relative group">
              <Image
                src='https://i.imgs.ovh/2025/11/14/CaAxWL.png'
                alt="VTFT Logo"
                width={120}
                height={120}
                priority
                className="relative"
                unoptimized
              />
            </div>
          </div>

          <h1 className="mb-6 bg-linear-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-center text-7xl sm:text-8xl leading-none font-bold whitespace-pre-wrap text-transparent animate-fade-in">
            VTFT
          </h1>

          <p className="text-center text-xl sm:text-2xl text-slate-300 mb-8 font-light animate-fade-in-up">
            云顶之弈数据助手
          </p>

          <p className="text-center text-base text-slate-400 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            提供最新最准确的阵容、装备、英雄、符文数据，助你轻松上分
          </p>

          <div className="flex justify-center mb-8 animate-fade-in-up">
            <DownloadButton />
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-linear-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* 图标 */}
                  <div className={`mb-4 w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* 装饰线 */}
                  <div className={`absolute bottom-0 left-[10%] h-1 w-0 group-hover:w-[80%] transition-all duration-500 bg-linear-to-r ${feature.gradient} rounded-full`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="relative mx-auto max-w-6xl">
          <InteractiveDemo />
        </div>
      </section>

      <footer className="relative border-t border-slate-800/50 px-6 py-12 bg-linear-to-b from-transparent to-slate-950/50">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src='https://i.imgs.ovh/2025/11/14/CaAxWL.png'
                alt="VTFT"
                width={32}
                height={32}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-slate-500">
                © 2025 VTFT. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8">
              <a
                href="https://github.com/VinkyDev/vtft"
                className="text-sm text-slate-400 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://github.com/VinkyDev/vtft/releases"
                className="text-sm text-slate-400 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                下载
              </a>
              <a
                href="https://github.com/VinkyDev/vtft/issues"
                className="text-sm text-slate-400 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                反馈
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LightRays count={12} speed={1.5} length="80%" />
    </div>
  );
}
