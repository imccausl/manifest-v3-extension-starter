import fs from 'fs'
import path from 'path'
import { cwd } from 'process'

import { type Plugin } from 'vite'

const allowedInputFolderNames = [
    'background',
    'content',
    'popup',
    'service-worker',
]

const entryPlugin = (): Plugin => {
    return {
        name: 'entry-plugin',
        config() {
            const dirPath = path.resolve(cwd(), 'app')
            const names = fs.readdirSync(dirPath)

            const input: Record<string, string> = {}
            for (const name of names) {
                if (!allowedInputFolderNames.includes(name)) {
                    continue
                }

                const potentialPathTs = path.join(dirPath, name, 'index.ts')
                const potentialPathTsx = path.join(dirPath, name, 'index.tsx')

                if (fs.existsSync(potentialPathTs)) {
                    input[name] = potentialPathTs
                } else if (fs.existsSync(potentialPathTsx)) {
                    input[name] = potentialPathTsx
                }
            }

            return {
                build: {
                    rollupOptions: {
                        input,
                    },
                },
            }
        },
    }
}

export default entryPlugin
