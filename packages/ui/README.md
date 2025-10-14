# UI 组件库

基于 Shadcn UI ([组件文档](https://ui.shadcn.com/docs/components/))

## 添加组件

在本目录(`packages/ui`)下执行以下命令添加组件：
```bash
pnpm adc ${component} # eg: pnpm adc button-group
```

## 使用

1. 安装依赖

```json
"dependencies": {
  "ui": "workspace:*"
}
```

2. 引入全局样式

```jsx
import 'ui/globals.css'
```

3. 添加 postcss.config.mjs 配置

```js
export { default } from 'ui/postcss.config'
```

4. 引入组件使用

```jsx
import { Button } from 'ui';

function App() {
  return (
    <div>
      <Button>点击我</Button>
    </div>
  );
}
```
