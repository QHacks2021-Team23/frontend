import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { signin, signout, useSession } from "next-auth/client";

import { EditorState } from "draft-js";

import unescape from "lodash.unescape";

import toolBarOptions from "../utils/toolbar";

const DocumentEditor = dynamic(
  () => {
    return import("react-draft-wysiwyg").then((mod) => mod.Editor);
  },
  { ssr: false }
);

export default function Editor() {
  const [session, loading] = useSession();

  const [editorState, setEditorStateState] = useState(() =>
    //TODO get state from backend
    // and update with use effect
    EditorState.createEmpty()
  );
  const [editorStateLength, setEditorStateLengthState] = useState(0);

  const [showComments, setShowComments] = useState(false);

  const [commentsState, setCommentsState] = useState(() =>
    EditorState.createEmpty()
  );

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const refreshComments = async () => {
    // TODO get comments from API
  };

  useEffect(() => {
    //TODO update comments
    const state = editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .map((i) => {
        return unescape(i.getText());
      });
  }, [editorStateLength]);

  const setEditorStateLength = (e) => {
    setEditorStateLengthState(e.getCurrentContent().getBlocksAsArray().length);
  };

  const setEditorState = (e) => {
    setEditorStateState(e);
    setEditorStateLength(e);
  };

  const handleEditorChange = (e) => {
    setEditorState(e);
    // console.log(
    //   e
    //     .getCurrentContent()
    //     .getBlocksAsArray()
    //     .map((i) => i.getText())
    // );
  };

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
                onEditorStateChange={handleEditorChange}
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
