'use client';

import { useMemo,useEffect,useState,useRef } from "react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// The quill-image-resize-module-react package does not have a ts type defined, so we have to ignore the ts error
//@ts-ignore
//import ReactQuill, { Quill } from 'react-quill-new';
const ImageResize = dynamic(() => import('quill-image-resize-module-ts'), {
  ssr: false
})
/* const ImageDrop = dynamic(() => import('quill-image-drop-module'), {
    ssr: false
}) */
//import { ImageResize } from 'quill-image-resize-module-ts';
//const Quill_NoSSR = dynamic(async() => await import('react-quill-new'), { ssr: false ,loading: () => <p>Loading...</p>});
const Quill_NoSSR = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill-new');
    
        const Component = ({ forwardedRef, ...props }:any) => (
            <RQ ref={forwardedRef} {...props} />
        );
    
        Component.displayName = 'Quill_NoSSR';
        return Component;
    },
    {
      ssr: false,
    }
);
  
Quill_NoSSR.displayName = 'ReactQuillComponent';
//const Parchment = Quill_NoSSR.import('parchment');
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

import ReactModule from "./ReactModule";

interface ReactEditorProps {
    height: number;
    colorMode:any
}

export default function ReactEditor(props: ReactEditorProps) {
    const QuillRef = useRef<typeof Quill_NoSSR | any>(null);
    const [quillReady, setQuillReady] = useState(false);
    const [state, setState] = useState({ value: null });
    const handleChange = (value:any) => {
        setState({ value });
    };
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
          import('react-quill-new').then(({ Quill }: any) => {
            Quill.register('modules/imageResize', ImageResize);
            Quill.register('modules/imageActions', ImageActions);
            Quill.register('modules/imageFormats', ImageFormats);
      
            /* const Parchment = Quill.import('parchment');
            const Align = new Parchment.Attributor.Style('align', 'text-align', {
              whitelist: ['right', 'center', 'justify'],
            });
            Quill.register(Align);
       */
            setQuillReady(true);
          });
        }
      }, []);


    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'link',
        'image',
        'color',
        'background',
        'align',
      ];

    useEffect(() => {
        // @ts-ignore
       if (!QuillRef.current) return;
        QuillRef.current
          .getEditor()
          .getModule('toolbar')
          .addHandler('image', () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()
            input.onchange = async () => {
              if (!input.files || !input?.files?.length || !input?.files?.[0])
                return
              // @ts-ignore
              const editor = QuillRef?.current?.getEditor()
              const file = input.files[0]
    
               // Do what you want with the file 
    
              const range = editor.getSelection(true)
              editor.insertEmbed(
                range.index,
                'image',
                '<image-url>'
              )
            }
          })
      }, [QuillRef])

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

    const modules = useMemo(() => {
        if (!quillReady) return {};
        
        return {
            toolbar: {
                imageActions: {},
                //imageFormats: {},
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ['image'],['link'],
                    ['float','height','width']
                ]
                //handlers: { image: imageHandler},
                //color: ['#ff0000']
            },
            imageResize: {
                //parchment: QuillRef.current.getEditor().import('parchment'),
                modules: ['Resize', 'DisplaySize']
            },
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true,
            } 
        };
    }, [quillReady]);

   

    return (
        <div>
           {/*  <div id="toolBar">
                <ReactModule />
            </div> */}
            {
                quillReady && (
                <Quill_NoSSR
                    forwardedRef={QuillRef}
                    theme="snow" 
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

