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

  const [requested, setRequested] = useState(false);

  const analysis = async () => {
    if (editorState?.getCurrentContent()?.getBlocksAsArray()?.length) {
      setRequested(true);

      const data = JSON.stringify({
        oldData: editorState
          .getCurrentContent()
          .getBlocksAsArray()
          .map((i) => i.getText().split("\n"))
          .flat(1)
          .filter((i) => i.replace(/\s*/g, "").length > 0),
        email: session.user.email,
      });
      fetch("/api/analysis", {
        method: "PUT",
        body: data,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  };

  if (!loading && !session) {
    signin();
  }

  if (requested) {
    return (
      <div className="center">
        <img src="/logo.jpg" alt="Logo" className="logo" />
        <h1>Thanks for using Essay Editor Pro!</h1>
        <h2 style={{ marginBottom: "1rem" }}>
          An email was sent to {session.user.email} with your analysis
        </h2>
        <Button
          onClick={() => {
            setRequested(false);
          }}
        >
          Make More Changes
        </Button>
      </div>
    );
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
          <img src="/logo.jpg" alt="Logo" className="logo corner" />
          <h1 className="session">
            {" "}
            Signed in as {session.user.email}{" "}
            <Button size="small" onClick={signout}>
              Sign out
            </Button>
          </h1>

          <h1 className="title">Essay Editor Pro</h1>

          <div className="editor">
            <div className="editorWrapper">
              <DocumentEditor
                autoCapitalize="sentences"
                spellCheck={true}
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbar={toolBarOptions}
                toolbarCustomButtons={[
                  <Button onClick={analysis}>Request Analysis</Button>,
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
