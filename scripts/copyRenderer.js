import fs from 'fs-extra';
import path from 'path';

async function copyRenderer() {
  const rendererDir = path.join(process.cwd(), 'apps/electron/out/renderer');
  const sourceDir = path.join(process.cwd(), 'apps/react/dist');

  try {
    await fs.remove(rendererDir);
    await fs.ensureDir(rendererDir);
    await fs.copy(sourceDir, rendererDir);
    console.log('✨ Renderer files copied successfully');
  } catch (err) {
    console.error('Error copying renderer files:', err);
    process.exit(1);
  }
}

copyRenderer();
