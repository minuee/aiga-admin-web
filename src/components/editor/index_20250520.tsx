'use client';

import { useMemo,useEffect,useState } from "react";
import dynamic from 'next/dynamic';
const Quill_NoSSR = dynamic(() => import('react-quill-new'), { ssr: false ,loading: () => <p>Loading...</p>})
import { Box,useColorModeValue, SkeletonText } from '@chakra-ui/react';

//import { ImageResize } from 'quill-image-resize-module-ts';
import 'react-quill-new/dist/quill.snow.css'
// The quill-image-resize-module-react package does not have a ts type defined, so we have to ignore the ts error
//@ts-ignore


const ImageResize = dynamic(() => import('quill-image-resize-module-ts'), {
  ssr: false
})

import ReactModule from "./ReactModule";

interface ReactEditorProps {
    height: number;
    colorMode:any
}

export default function ReactEditor(props: ReactEditorProps) {

    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({ value: null });
    const handleChange = (value:any) => {
        setState({ value });
    };
    const skeletonColor = useColorModeValue('white', 'navy.700');


    useEffect(() => {
        // Dynamically import Quill and register the module
        if (typeof window !== 'undefined') {
            import('react-quill-new').then(({ Quill }) => {
                Quill.register('modules/resize', ImageResize);
                setIsLoading(false)
                //Quill.register('modules/imageActions', ImageActions);
                //Quill.register('modules/imageFormats', ImageFormats);
            })
        }
    }, [])

    const formats:string[] = [
        "header", "size", "font",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "indent", "link", "image",
        "color", "background", "align","float",
        "script", "code-block", "clean"
    ];

    /* const modules:{} = useMemo(() => ({
        toolbar: {
            container: [
                "#toolBar",
                [{ align: [] }], //추가
                ["clean"],	//추가
            ],
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
    }), []); */

    const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, false] }],
              ['bold', 'italic', 'underline', 'strike' /* , 'blockquote' */],
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
              [{ background: [] }],
              ['link', 'image', 'video'],
              ['clean']
            ],  
          },
            ImageResize: {
            modules: ['Resize', 'DisplaySize']
          }//4.Quill 이미지 Resize 옵션 설정(Resize:이미지 드래그 크기 조절/DisplaySize:현재 이미지 크기 표시)
        }),
        []
    );

    if ( isLoading ) {
        return (
            <Box padding='6' boxShadow='lg' bg={skeletonColor}>
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
            </Box>
        )
    }

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
            	//style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
                //className='h-screen max-w-full'
            />
        </div>
    )
}

