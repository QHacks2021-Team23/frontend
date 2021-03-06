import { providers, signIn } from "next-auth/client";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState } from "react";

import { Card, Button, Divider, Input, Form, Alert } from "antd";
import { GithubFilled, FacebookFilled } from "@ant-design/icons";

const SignIn = ({ providers }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  if (session && !loading) {
    router.push("/editor");
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const submitEmail = () => {
    if (validateEmail(email)) {
      setValidEmail(true);
      signIn("email", { email: email });
    } else {
      setValidEmail(false);
    }
  };

  return (
    <div className="center login">
      <div className="content">
        <img src="/logo.jpg" alt="Logo" className="logo" />
        <h1>Welcome to Essay Editor Pro!</h1>
        <p>Please use one of the following sign-in options to begin.</p>
      </div>
      <div className="card-wrapper">
        <Card title="Log In">
          <div>
            <label className="input-wrapper">
              <h3>Passwordless Sign In</h3>
              <span hidden={validEmail}>
                <Alert
                  message="Please use a Valid Email Address"
                  size="small"
                  type="error"
                  style={{ fontSize: "0.7rem" }}
                />
              </span>
              <Input
                type="email"
                defaultValue=""
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onPressEnter={submitEmail}
              />
            </label>
            <Button
              style={{ width: "200px" }}
              type="primary"
              onClick={submitEmail}
            >
              Passwordless Sign In
            </Button>
          </div>
          <Divider />
          <Button
            style={{ width: "200px", marginBottom: "1rem" }}
            onClick={() => signIn("github")}
            icon={<GithubFilled />}
          >
            Using Github
          </Button>
          <Button
            style={{ width: "200px" }}
            onClick={() => signIn("facebook")}
            icon={<FacebookFilled />}
          >
            Using Facebook
          </Button>
        </Card>
      </div>
    </div>
  );
};

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
  };
};

export default SignIn;
