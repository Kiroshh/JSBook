import {useEffect, useRef} from "react";


interface PreviewProps {
    code: string,
    err:string
}

const html = `
        <html
        <head></head>
        <body>
        <div id ='root'></div>
        <script>
        const handleError=(err)=>{
            const root = document.querySelector('#root');
                root.innerHTML='<div style="color:red;"><h4> Runtime Error  </h4>' + err + '</div>'
                console.log(err)
        }
        
        window.addEventListener('message',(event)=>{
            try{
            eval(event.data)}
            catch (err){
               handleError(err) 
            }
        },false)
        
        window.addEventListener('error',(event)=>{
            event.preventDefault();
            handleError(event.error)
        })
        </script>
        </body>
        </html>
`

const Preview: React.FC<PreviewProps> = ({code,err}) => {

    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcDoc = html;
        setTimeout(() => {
            iframe.current.contentWindow.postMessage(code, '*')
        }, 50)

    }, [code])

    return (<div className={"iframe-wrapper"}>

        <iframe title="code preview" ref={iframe} sandbox="allow-scripts"
                srcDoc={html}/>
        {err&& <div className={"preview-error"}>{err}</div>}
    </div>);
};

export default Preview;
