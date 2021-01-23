import { Button } from "antd";
import { signin, signout, useSession } from "next-auth/client";
import tinyMCE, { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [session, loading] = useSession();
  const [winH, setWinH] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setWinH(window.innerHeight);
  }, [winH]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleEditorChange = (str, a) => {
    const getMatches = (exp) => {
      return Array.from(str.matchAll(exp)).map((i) =>
        i[1].replaceAll(/(<[^>]+>)/g, "")
      );
    };

    const headers = getMatches(/<h[1-6]>(.+)<\/h[1-6]>/g);
    const paragraphs = getMatches(/<p>(.+)<\/p>/g);
    paragraphs.forEach((i) => console.log(i));
  };

  const editorOptions = {
    resize: false,
    branding: false,
    height: winH - 150,
    menubar: false,
    indent: false,
  };

  return (
    <div className="center">
      {!session && (
        <>
          <h1>Not signed in</h1>
          <div>
            <Button onClick={signin}>Sign in</Button>
          </div>
        </>
      )}
      {session && (
        <>
          <h1> Signed in as {session.user.email} </h1>
          <div>
            <Button onClick={toggleComments}>Toggle Comments</Button>
            <Button onClick={signout}>Sign out</Button>
          </div>

          <div
            className="editor"
            style={{ gridTemplateColumns: `repeat(${1 + showComments}, 1fr)` }}
          >
            <Editor
              apiKey={process.env.TINY_KEY}
              initialValue=""
              tagName="div"
              init={{
                ...editorOptions,
                plugins: ["searchreplace paste wordcount"],
                toolbar: "undo redo | bold italic backcolor | removeformat",
              }}
              onEditorChange={handleEditorChange}
            />
            {showComments && (
              <div className="comments">
                <Editor
                  id="commentEditor"
                  apiKey={process.env.TINY_KEY}
                  initialValue="Content"
                  init={{
                    ...editorOptions,
                    readonly: true,
                    menubar: true,
                    removed_menuitems: "file",
                    plugins: [],
                    toolbar: "help",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
