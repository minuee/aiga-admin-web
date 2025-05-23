'use client';
import { Box,Flex,useColorModeValue } from '@chakra-ui/react'
// The below import defines which components come from formik
import styled from "@emotion/styled";
import { useMemo,useEffect,useState,useRef } from "react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

//@ts-ignore
const ImageResize = dynamic(() => import('quill-image-resize-module-ts'), {
  ssr: false
})
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

/* const Quill_NoSSR = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill-new');
        //RQ.Quill.register('modules/imageResize', ImageResize);
        RQ.Quill.register('modules/imageActions', ImageActions);
        RQ.Quill.register('modules/imageFormats', ImageFormats);
        const Component = ({ forwardedRef, ...props }:any) => (
            <RQ ref={forwardedRef} {...props} />
        );
    
        Component.displayName = 'Quill_NoSSR';
        return Component;
    },
    {
      ssr: false,
    }
); */

import Parchment from 'parchment';
import dompurify from "dompurify";
const Quill_NoSSR = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        //const Parchment = await import("parchment");
        RQ.Quill.register('modules/imageResize', ImageResize);
        RQ.Quill.register("modules/imageActions", ImageActions);
        RQ.Quill.register("modules/imageFormats", ImageFormats);
        //const Parchment = RQ.Quill.import('parchment');
        /* const Align = new Parchment.Attributor.Style('align', 'text-align', {
            whitelist: ["left", "center", "right", "justify"],
        }); */
        const Height = new Parchment.Attributor.Style('height', 'height', {
            
        });
        const Width = new Parchment.Attributor.Style('width', 'width', {
            
        });

        const Float = new Parchment.Attributor.Style('float', 'float', {
            //scope: Parchment.Scope.INLINE_BLOT,
            whitelist: ['left','center' ,'right']
        });

        
       // RQ.Quill.register(Align,true);
        RQ.Quill.register(Float,true);
        RQ.Quill.register(Height,true);
        RQ.Quill.register(Width,true);

        const DynamicReactQuill = ({
            forwardedRef,
            ...props
        }: {
            forwardedRef: React.Ref<any>;
            [key: string]: any;
        }) => <RQ ref={forwardedRef} {...props} />;
    
        DynamicReactQuill.displayName = "Quill_NoSSR";
        return DynamicReactQuill;
    },
    {
      ssr: false,
    }
)

import ReactModule from "./ReactModule";
import functions from "utils/functions";

interface ReactEditorProps {
    height: number;
    colorMode:any;
    content : any
}

export default function ReactEditor(props: ReactEditorProps) {
    const QuillRef = useRef<typeof Quill_NoSSR | any>(null);
    const [value, setValue] = useState("<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s' alt='' width='200px' height='200px' />");
    const [quillReady, setQuillReady] = useState(false);
    const [state, setState] = useState({ value: null });
    const handleChange = (value:any) => {
        //setState({ value });
    };
    const sanitizer = dompurify.sanitize;
    useEffect(() => {
        if (typeof window !== 'undefined') {
          import('react-quill-new').then(({ Quill }: any) => {
                Quill.register('modules/imageResize', ImageResize);
                Quill.register('modules/imageActions', ImageActions);
                Quill.register('modules/imageFormats', ImageFormats);        
                setQuillReady(true);
            });
        }
    }, []);

    useEffect(() => {
        if ( !functions.isEmpty(props.content)) {
            setValue(props.content);
        }
    }, [props.content]);

    const imageHandler = async () => {
        if (!QuillRef.current) return;
    
        const quillInstance: any = QuillRef.current.getEditor();
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    
        // input 클릭 시 파일 선택창이 나타남
        input.onchange = async () => {
          //이미지를 담아 전송할 formData
          const file = input.files?.[0];
    
          try {
            //업로드 된 S3 이미지 url을 가져오기
            const url2 = "";//await PostAPI.uploadImg(file); //api연결하기
            const url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s'; //더미 url
            const range = quillInstance.getSelection(true); //useRef를 통해 에디터에 접근한 후 현재 커서 위치를 얻음(true:만약 선택된 영역이 없으면 커서가 깜빡이고 있는 위치를 얻음)
            quillInstance.insertEmbed(range.index, 'image', url); //  에디터의 현재 커서 위치에 이미지를 삽입
            quillInstance.setSelection(range.index + 1); //이미지를 삽입한 후 커서를 이미지 뒤로 이동시키는 코드
          } catch (error) {
            console.log(error);
          }
        };
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'code',
        'code-block',
        'script',
        'color',
        'background',
        'image',
        'link',
        'height',
        'width',
        'align',
        'float',
    ];

    const modules = useMemo(() => {
        //if (!quillReady && !QuillRef.current) return;
        
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote'],
                    ['list'],
                    [
                        { color: [] },
                        { background: [] }
                    ],
                    [{ script: 'sub' }, { script: 'super' }], // 첨자
                    ['code', 'code-block'], // 코드 블록 및 인라인 코드를 위한 기능 추가
                    ['image','link'],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    ['clean']
                    
                ],
                //handlers: { image: imageHandler},
            },
            /* imageResize: {
                modules: ['Resize', 'DisplaySize']
            }, */
            imageActions: {},
            //imageFormats: {},
            
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true,
            } 
        };
    }, []);
/* 
    useEffect(() => {
        if (!QuillRef.current) return;
      
        const quill = QuillRef.current.getEditor();
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
      
            // ✅ 실제 이미지 업로드 URL로 바꾸세요
            const url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s';
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
          };
        });
      }, [quillReady]); */
   
/* 
      const imageHandler = async () => {
        const input: any = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    //formData로 이미지 구현
        input.addEventListener('change', async () => {
          const formData = new FormData();
          const file = input.files;
          const fileUrl: any = [...file];
          for (let i = 0; i < file.length; i++) {
            const nowUrl = URL.createObjectURL(file[i]);
            fileUrl.push(nowUrl);
          }
          for (let i = 0; i < file.length; i++) {
            formData.append('file', fileUrl[i]);
          }
    
          formData.append('type', props.type);
          formData.append('targetId', props.targetId);
    //이미지를 formData로 서버에 api post로 보내고 다시 api get하여 받은 
          // url값을 에디터 태그로 활용
          //이렇게 안하고 이미지를 그냥 에디터에 넣어버리면
          // 64bit 태그로 html tag로 저장된다.
          // 이 태크는 너무 길기에 좋지 않다.
          await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/file/upload`,
            headers: {
              Authorization: jwt,
              'Content-Type': 'multipart/form-data',
            },
            data: formData,
          }).then((res) => {
            axios({
              method: 'get',
              url: `${process.env.REACT_APP_API_URL}/file/list/${props.type}/
    ${props.targetId}`,
              headers: {
                Authorization: jwt,
                'Content-Type': 'multipart/form-data',
              },
            }).then((res) => {
              const IMG_URL = [];
              for (let i = 0; i < res.data.length; i++) {
                const URL =
                  process.env.REACT_APP_BASE_URL + 
                      res.data[i].filePath + res.data[i].fileName;
                IMG_URL.push(URL);
              }
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
    
              editor.insertEmbed(range.index, 'image', IMG_URL[res.data.length - 1]);
            });
          });
        });
      };
       */
    return (
        <div>
             {/* { quillReady && ( 
                <div id="toolBar">
                    <ReactModule />
                </div>
             )} */}
            {
                quillReady && (
                    <>
                        <Quill_NoSSR
                            forwardedRef={QuillRef}
                            theme="snow" 
                            /* value={
                                "<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s' alt='' width='200px' height='200px' />"
                            } */
                            value={value}
                            modules={modules} 
                            onChange={setValue}
                            formats={formats} 
                            style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
                            className='h-screen max-w-full'
                        />
                        <Flex my={{base : 20, md : 12}} flexDirection={{base : "column", md : "row"}}>
                            <Box flex={1} padding={5} border={"1px solid #ccc"} mr={{base : 0, md : 1}} wordBreak={'break-all'}>
                                {value}
                            </Box>
                            <Box flex={1} padding={5} border={"1px solid #ccc"} ml={{base : 0, md : 1}}>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html : sanitizer(`${value}`) }} />
                            </Box>
                            
                        </Flex>
                    </>
                )
            }
        </div>
    )
}
