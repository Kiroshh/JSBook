import ReactDOM from 'react-dom';
import {useEffect, useState, useRef} from "react";
import * as esbuild from 'esbuild-wasm'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";

const App = () => {
    const iframe = useRef<any>();
    const [input, setInput] = useState('');
    const [isEsbuildInitialized, setEsEsbuildInitialized] = useState(false)


    const startService = async () => {
        try {
            await esbuild.initialize({
                worker: true,
                wasmURL: '/esbuild.wasm'
                // wasmURL: 'https:unpkg.com/esbuild-wasm@0.8.7/esbuild.wasm'
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

        iframe.current.srcDoc = html;
        try {
            // const result = await esbuild.transform(input, {
            //     loader: 'jsx',
            //     target: 'es2015'
            // });

            const result = await esbuild.build({
                entryPoints: ['index.js'],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin(), fetchPlugin(input)],
                define: {
                    'process.env.NODE_ENV': '"production"',
                    global: 'window'
                }
            })

            // setCode(result.outputFiles[0].text);
            iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        startService().then(() => console.log("initialized the esbuild"));
    }, [])

    const html = `
<html
<head></head>
<body>
<div id ='root'></div>
<script>
window.addEventListener('message',(event)=>{
    try{
    eval(event.data)}
    catch (err){
        const root = document.querySelector('#root');
        root.innerHTML='<div style="color:red;"><h4> Runtime Error  </h4>' + err + '</div>'
        console.log(err)
    }
},false)
</script>
</body>


</html>

`

    return <div>
        <textarea value={input} onChange={(e) => {
            setInput(e.target.value)
        }}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <iframe title="code preview" ref={iframe} sandbox="allow-scripts" srcDoc={html}/>

    </div>
};

ReactDOM.render(<App/>, document.querySelector('#root'))

