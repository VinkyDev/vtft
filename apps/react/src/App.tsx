import { Clipboard } from 'bridge'
import { useState } from 'react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/components'

function App() {
  const [clipboardText, setClipboardText] = useState('')

  const handleGetClipboardText = async () => {
    const result = await Clipboard.getClipboardText()
    if (result.success) {
      setClipboardText(result.data || '')
    }
  }

  const techFeatures = [
    { name: 'Electron', icon: '🖥️', desc: '桌面应用' },
    { name: 'React 19', icon: '⚛️', desc: 'Web界面' },
    { name: 'Vite', icon: '⚡', desc: '构建工具' },
    { name: 'TypeScript', icon: '📘', desc: '类型安全' },
    { name: 'Hono', icon: '🔥', desc: 'API框架' },
    { name: 'Tailwind', icon: '🎨', desc: 'CSS框架' },
    { name: 'pnpm', icon: '📦', desc: 'Monorepo' },
    { name: 'ESLint', icon: '🔧', desc: '代码规范' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">v-monorepo</h1>
          </div>
          <Badge variant="outline" className="text-xs">全栈模板</Badge>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            现代化全栈开发模板
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            集成桌面端、Web端和API服务，采用monorepo架构管理
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {techFeatures.map(tech => (
            <Card key={tech.name} className="p-2 hover:shadow-md transition-shadow">
              <div className="text-center space-y-1">
                <div className="text-base">{tech.icon}</div>
                <div className="font-medium text-xs">{tech.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{tech.desc}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">剪贴板演示</CardTitle>
            <CardDescription className="text-xs">Electron与React集成</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={handleGetClipboardText} size="sm" className="w-full">
              获取剪贴板内容
            </Button>
            {clipboardText && (
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono break-all">
                {clipboardText}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
