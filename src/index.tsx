import ReactDOM from 'react-dom';
import {useEffect, useState, useRef} from "react";
import * as esbuild from 'esbuild-wasm'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('')
    const [isEsbuildInitialized, setEsEsbuildInitialized] = useState(false)


    const startService = async () => {
        try {
            await esbuild.initialize({
                worker: true,
                wasmURL: '/esbuild.wasm'
            });
            setEsEsbuildInitialized(true)

        } catch (err) {
            console.error(err);

        }
    }

    const onClick = async () => {
        if (!isEsbuildInitialized) {
            return;
        }
        try {
            // const result = await esbuild.transform(input, {
            //     loader: 'jsx',
            //     target: 'es2015'
            // });

            const result = await esbuild.build({
                entryPoints: ['index.js'],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin()],
                define: {
                    'process.env.NODE_ENV': '"production"',
                    global: 'window'
                }
            })

            setCode(result.outputFiles[0].text);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        startService().then(() => console.log("initialized the esbuild"));
    }, [])

    return <div>
        <textarea value={input} onChange={(e) => {
            setInput(e.target.value)
        }}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <div>
            <pre>{code}</pre>
        </div>

    </div>
};

ReactDOM.render(<App/>, document.querySelector('#root'))

