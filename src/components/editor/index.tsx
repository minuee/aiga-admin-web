'use client';

import { useMemo,useEffect,useState } from "react";
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
// The quill-image-resize-module-react package does not have a ts type defined, so we have to ignore the ts error
//@ts-ignore
const ImageResize = dynamic(() => import('quill-image-resize-module-react'), {
  ssr: false
})
const Quill_NoSSR = dynamic(() => import('react-quill-new'), { ssr: false ,loading: () => <p>Loading...</p>})

import ReactModule from "./ReactModule";

interface ReactEditorProps {
    height: number;
    colorMode:any
}

export default function ReactEditor(props: ReactEditorProps) {

    const [state, setState] = useState({ value: null });
    const handleChange = (value:any) => {
        setState({ value });
    };
    
    useEffect(() => {
        // Dynamically import Quill and register the module
        if (typeof window !== 'undefined') {
            import('react-quill-new').then(({ Quill }) => {
                Quill.register('modules/resize', ImageResize)
            })
        }
    }, [])

    const formats:string[] = [
        "header", "size", "font",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "indent", "link", "image",
        "color", "background", "align",
        "script", "code-block", "clean"
    ];

    const modules:{} = useMemo(() => ({
        toolbar: {
            container: "#toolBar",
            color: ['#ff0000']
        },
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
        },
        ImageResize: {
            modules: ['Resize', 'DisplaySize']
        }
    }), []);

    return (
        <div>
            <div id="toolBar">
                <ReactModule />
            </div>
            <Quill_NoSSR 
                theme="snow" 
                modules={modules} 
                onChange={handleChange}
                //formats={formats} 
            	style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
                className='h-screen max-w-full'
            />
        </div>
    )
}