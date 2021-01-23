import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { signin, signout, useSession } from "next-auth/client";

import { EditorState } from "draft-js";

const DocumentEditor = dynamic(
  () => {
    return import("react-draft-wysiwyg").then((mod) => mod.Editor);
  },
  { ssr: false }
);

export default function Editor() {
  const [session, loading] = useSession();
  const [showComments, setShowComments] = useState(false);
  const [commentsState, setCommentsState] = useState(() =>
    EditorState.createEmpty()
  );
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleEditorChange = (e) => {
    setEditorState(e);
    console.log(
      e
        .getCurrentContent()
        .getBlocksAsArray()
        .map((i) => i.getText())
    );
  };

  if (!loading && !session) {
    console.log("redirect back");
    signin();
  }

  return (
    <div className="center">
      {!session && (
        <div className="vertical-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
        </div>
      )}
      {session && (
        <>
          <h1> Signed in as {session.user.email} </h1>
          <div>
            <Button onClick={toggleComments}>Toggle Comments</Button>
            <Button onClick={signout}>Sign out</Button>
          </div>

          <div className="editor">
            <div className="editorWrapper">
              <DocumentEditor
                autoCapitalize="sentences"
                spellCheck={true}
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={toolbarOptions}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const toolbarOptions = {
  options: [
    "blockType",
    "fontSize",
    "fontFamily",
    "list",
    "textAlign",
    "history",
  ],
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
  },
  fontFamily: {
    options: [
      "Arial",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana",
    ],
  },
  list: {
    inDropdown: false,
    options: ["unordered", "ordered", "indent", "outdent"],
  },
  textAlign: {
    inDropdown: false,
    options: ["left", "center", "right", "justify"],
  },
  history: {
    inDropdown: false,
    options: ["undo", "redo"],
  },
};
