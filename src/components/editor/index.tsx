'use client';
import { Box,Flex,useColorModeValue,Textarea,Button,Text } from '@chakra-ui/react'
import styled from "@emotion/styled";
import { useMemo,useEffect,useState,useRef, useCallback } from "react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

import Parchment from 'parchment';
import dompurify from "dompurify";


const Quill_NoSSR = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const BlotFormatter = (await import('quill-blot-formatter')).default;
   
    RQ.Quill.register('modules/blotFormatter', BlotFormatter);

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
  onHandSaveContent: (data: any) => void;
  height: number;
  colorMode:any;
  content : any
}

export default function ReactEditor(props: ReactEditorProps) {

  const QuillRef = useRef<typeof Quill_NoSSR | any>(null);
  const [value, setValue] = useState("<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s' alt='' width='200px' height='200px' />");
  const [quillReady, setQuillReady] = useState(false);
  const [state, setState] = useState({ value: null });
  const [htmlView, setHtmlView] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const toggleHtmlView = () => {
    if (!htmlView) {
      setHtmlContent(value);
    } else {
      setValue(htmlContent);
    }
    setHtmlView(!htmlView);
  };


  const sanitizer = dompurify.sanitize;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQuillReady(true);
    }
  }, []);

  useEffect(() => {
    if ( !functions.isEmpty(props.content)) {
      setValue(props.content);
    }else{
      setValue(null)
    }
  }, [props.content]);

  useEffect(() => {
    props.onHandSaveContent(value)
  }, [value]);

  const imageHandler = useCallback(async () => {
      if (!QuillRef.current) return;
  
      const quillInstance: any = QuillRef.current.getEditor();
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
  
      input.onchange = async () => {
        const file = input.files?.[0];
  
        try {
          // TODO: API연동
          const url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s'; //더미 url
          const range = quillInstance.getSelection(true);
          quillInstance.insertEmbed(range.index, 'image', url);
          quillInstance.setSelection(range.index + 1);
        } catch (error) {
          console.log(error);
        }
      };
  },[]);

  const tableHandler = useCallback(() => {
    if (!QuillRef.current) return;

    const quill = QuillRef.current.getEditor();
    const rowsStr = prompt("몇 행을 만드시겠습니까?");
    const colsStr = prompt("몇 열을 만드시겠습니까?");

    const rows = rowsStr ? parseInt(rowsStr, 10) : 0;
    const cols = colsStr ? parseInt(colsStr, 10) : 0;

    if (rows > 0 && cols > 0) {
      const tableModule = quill.getModule('table');
      if (tableModule) {
        tableModule.insertTable(rows, cols);
      } else {
        alert('테이블 모듈을 찾을 수 없습니다.');
      }
    } else {
      alert('유효한 행과 열의 개수를 입력해주세요.');
    }
  }, []);

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
  ];

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          ['list'],
          [
            { color:[]},
            { background: [] }
          ],
          [{ script: 'sub' }, { script: 'super' }],
          ['code', 'code-block'],
          ['link'],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          ['clean'] ,
          ['table', 'image']       
        ],
        handlers: { 
          image: imageHandler,
          table: tableHandler,
        },
      },
      table: true, // Use the default table module
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      blotFormatter: {}
    }
  }, [imageHandler, tableHandler]);
   
  return (
    <div>
      <Button onClick={toggleHtmlView}>
        <Text>{htmlView ? "에디터 보기" : "HTML 보기"}</Text>
      </Button>
      {
        quillReady && (
          <>
          {
          htmlView ? (
            <Textarea
              value={htmlContent || "<p>/<p>"}
              onChange={(e) => setHtmlContent(e.target.value)}
              style={{ width: "100%", height: "400px" }}
            />
          ) : (
            <Quill_NoSSR
              forwardedRef={QuillRef}
              theme="snow" 
              value={value}
              modules={modules} 
              onChange={setValue}
              formats={formats} 
              style={{height: props.height ? `${props.height}px` :"300px", width: "100%",}}
              className='h-screen max-w-full'
            />
          )
          }
          </>
        )
      }
    </div>
  )
}
