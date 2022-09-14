import './code-editor.css'
import MonacoEditor, {EditorDidMount} from '@monaco-editor/react'
import prettier from "prettier"
import parser from "prettier/parser-babel"
import React, {useRef} from "react";


interface CodeEditorProps {
    initialValue: string
    onChange: (value: string) => void,
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {

    const editorRef= useRef<any>();

    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current=monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue())
        });
    };

    const onClick=()=>{
        const unformatted = editorRef.current.getModel().getValue();
        const formatted = prettier.format(unformatted,{
            parser: "babel",
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true,
        }).replace(/\n$/,'');

        editorRef.current.setValue(formatted);
    }

    return(
    <div className="editor-wrapper">
        <button className="button button-format is-primary is-small" onClick={onClick}>Format</button>
        <MonacoEditor
            editorDidMount={onEditorDidMount}
            value={initialValue}
            language="javascript"
            theme="vs-dark"
            height="500px"
            options={{
                minimap: {
                    enabled: false,
                },
                wordWrap: "on",
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 16,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
            }}/>
    </div>)

}

export default CodeEditor;
