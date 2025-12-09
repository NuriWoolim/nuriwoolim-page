import styled from "styled-components";
import { useState, useRef, useEffect, forwardRef } from "react";
import "quill/dist/quill.snow.css";

import Quill from "quill";
const EditorContainer = styled.div`
  /* width: 500px;
  height: 200px; */
`;
// Editor is an uncontrolled React component

const Editor = forwardRef(({ readOnly, defaultValue }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    ref.current?.enable(!readOnly);
  }, [ref, readOnly]);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    //   quill.on(Quill.events.TEXT_CHANGE, (...args) => {
    //     onTextChangeRef.current?.(...args);
    //   });

    //   quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
    //     onSelectionChangeRef.current?.(...args);
    //   });

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <EditorContainer ref={containerRef}></EditorContainer>;
});

// Editor.displayName = "Editor";

const ArticleEditor = () => {
  const quillRef = useRef();
  return (
    <>
      <Editor ref={quillRef} />
    </>
  );
};
export default ArticleEditor;
