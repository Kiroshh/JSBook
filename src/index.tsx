import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from 'react-dom';
import {useState} from "react";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler"

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');


    const onClick = async () => {


        try {
            const output = await bundle(input);
            setCode(output);
        } catch (err) {
            console.error(err);
        }
    }


    return <div>
        <CodeEditor initialValue={input} onChange={(value) => setInput(value)}/>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <Preview code={code}/>

    </div>
};

ReactDOM.render(<App/>, document.querySelector('#root'))

