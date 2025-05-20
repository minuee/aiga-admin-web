'use client';

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

const Quill_NoSSR = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        RQ.Quill.register('modules/imageResize', ImageResize);
        RQ.Quill.register("modules/imageActions", ImageActions);
        RQ.Quill.register("modules/imageFormats", ImageFormats);
        //const Parchment = RQ.Quill.import('parchment');
        const Align = new Parchment.Attributor.Style('align', 'text-align', {
            whitelist: ['right', 'center', 'justify'],
        });

        const Height = new Parchment.Attributor.Style('height', 'height', {
            
        });
        const Width = new Parchment.Attributor.Style('width', 'width', {
            
        });
     
        const Float = new Parchment.Attributor.Style('float', 'float', {
            scope: Parchment.Scope.INLINE_BLOT,
            whitelist: ['left','center' ,'right']
        });
        RQ.Quill.register(Align,true);
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

interface ReactEditorProps {
    height: number;
    colorMode:any
}

export default function ReactEditor(props: ReactEditorProps) {
    const QuillRef = useRef<typeof Quill_NoSSR | any>(null);
    const [value, setValue] = useState("<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s' alt='' width='200px' height='200px' />");
    const [quillReady, setQuillReady] = useState(false);
    const [state, setState] = useState({ value: null });
    const handleChange = (value:any) => {
        //setState({ value });
    };
    
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
        'code-block',
        'color',
        'background',
        'image',
        'link',
        'height',
        'width'
    ];

    const modules = useMemo(() => {
        //if (!quillReady && !QuillRef.current) return;
        
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ color: [] } , { background: [] }],
                    [{ align: [] }],['clean'],
                    ['image','link']
                ],
                //handlers: { image: imageHandler},
                color: ['#ff0000']
            },
            imageResize: {
                modules: ['Resize', 'DisplaySize']
            },
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
   

    return (
        <div>
             {/* { quillReady && ( 
                <div id="toolBar">
                    <ReactModule />
                </div>
             )} */}
            {
                quillReady && (
                <Quill_NoSSR
                    forwardedRef={QuillRef}
                    theme="snow" 
                    /* value={
                        "<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s' alt='' width='200px' height='200px' />"
                    } */
                    value={value}
                    modules={modules} 
                    onChange={handleChange}
                    formats={formats} 
                    style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
                    className='h-screen max-w-full'
                />
                )
            }
        </div>
    )
}

