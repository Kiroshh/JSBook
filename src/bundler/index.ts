import * as esbuild from 'esbuild-wasm'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";

let initialized: boolean = false;
export default async (rawCode: string) => {
    if (!initialized) {
        try {
            await esbuild.initialize({
                worker: true,
                wasmURL: '/esbuild.wasm'
                // wasmURL: 'https:unpkg.com/esbuild-wasm@0.8.7/esbuild.wasm'
            });
            initialized = true;
        } catch (err) {
        }
    }


    const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    })

    return result.outputFiles[0].text;
}