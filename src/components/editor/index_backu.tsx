'use client';

import { useMemo,useEffect,useState,useRef } from "react";
import dynamic from 'next/dynamic';
const Quill_NoSSR = dynamic(() => import('react-quill-new'), { ssr: false ,loading: () => <p>Loading...</p>})
import { Box,useColorModeValue, SkeletonText } from '@chakra-ui/react';
import ReactQuill, { Quill } from 'react-quill';
//import { ImageResize } from 'quill-image-resize-module-ts';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
// The quill-image-resize-module-react package does not have a ts type defined, so we have to ignore the ts error
//@ts-ignore

import ReactModule from "./ReactModule";
/* const ImageResize = dynamic(() => import('quill-image-resize-module-ts'), {
  ssr: false
}) */
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);
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
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        // Dynamically import Quill and register the module
        if (typeof window !== 'undefined') {
            import('react-quill-new').then(({ Quill }) => {
                //Quill.register('modules/resize', ImageResize);
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

    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');
        if (!quillRef.current) return;
        const quillInstance: any = quillRef.current.getEditor();
        // 1. 이미지를 저장할 input type=file DOM을 만든다.
        const input = document.createElement('input');
        // 속성 써주기
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
        // input이 클릭되면 파일 선택창이 나타난다.
    
        input.onchange = async () => {
          const file = input.files![0];
          const formData = new FormData();
          formData.append('image', file);
    
          // 이미지를 서버로 전송 (서버 엔드포인트 주소를 사용)
          const response = await axios.post('YOUR_SERVER_API_URL', {
            body: formData,
          });
    
          const imageUrl = await response;
          const range = quillInstance.getSelection(true);
          quillInstance.insertEmbed(range.index, 'image', imageUrl);
        };
      };

      const modules = useMemo(() => {
        return {
          imageActions: {},
          imageFormats: {},
          toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, false] }],
                ['bold', 'italic', 'underline', 'strike' /* , 'blockquote' */],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                [{ background: [] }],
                ['link', 'image'],
                ['clean']
            ],
    
            // 내부 이미지를 url로 받아오는 handler
            handlers: {
              image: imageHandler,
            },
          },
        };
      }, []);

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
                //onChange={handleChange}
                //formats={formats} 
            	//style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
                //className='h-screen max-w-full'
            />
        </div>
    )
}

