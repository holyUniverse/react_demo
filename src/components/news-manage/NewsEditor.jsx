import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState("");

  useEffect(() => {
    const html = props.content;
    const contentBlock = html && htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [props.content]);

  const handleBlur = () => {
    props.getContent(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={handleBlur}
      />
    </div>
  );
}
