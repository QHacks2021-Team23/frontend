import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { signin, signout, useSession } from "next-auth/client";

import { EditorState } from "draft-js";

import toolBarOptions from "../utils/toolbar";

import fetch from "cross-fetch";

const DocumentEditor = dynamic(
  () => {
    return import("react-draft-wysiwyg").then((mod) => mod.Editor);
  },
  { ssr: false }
);

export default function Editor() {
  const [session, loading] = useSession();

  const [editorState, setEditorState] = useState(() =>
    //TODO get state from backend
    // and update with use effect
    EditorState.createEmpty()
  );

  const [showComments, setShowComments] = useState(false);

  const [commentsState, setCommentsState] = useState(() =>
    EditorState.createEmpty()
  );

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const refreshComments = async () => {
    console.log(
      "run",
      editorState?.getCurrentContent()?.getBlocksAsArray()?.length
    );
    // TODO get comments from API
    if (editorState?.getCurrentContent()?.getBlocksAsArray()?.length) {
      const data = await JSON.stringify(
        editorState
          .getCurrentContent()
          .getBlocksAsArray()
          .map((i) => i.getText())
      );
      fetch("http://localhost:5000/", {
        method: "POST",
        mode: "no-cors",
        body: data
      })
        .then((res) => res.json())
        .then(console.log);

      //   fetch("http://localhost:5000/hello", {})
      //     .then((res) => res.json())
      //     .then((res) => console.log(res));
    }
  };

  useEffect(() => {
    //TODO update comments
  }, [editorState]);

  if (!loading && !session) {
    signin();
  }

  return (
    <div className="center bottom">
      {!session && (
        <div className="vertical-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
        </div>
      )}
      {session && (
        <>
          <h1 className="session">
            {" "}
            Signed in as {session.user.email}{" "}
            <Button size="small" onClick={signout}>
              Sign out
            </Button>
          </h1>

          <h1 className="title">
            {showComments ? "Viewing Comments" : "Editing Essay"}
          </h1>

          <div className="editor">
            <div className="editorWrapper">
              <DocumentEditor
                autoCapitalize="sentences"
                spellCheck={true}
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbar={toolBarOptions}
                toolbarCustomButtons={[
                  <Button onClick={toggleComments}>Toggle Comments</Button>,
                  <Button onClick={refreshComments}>Refresh Comments</Button>,
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
