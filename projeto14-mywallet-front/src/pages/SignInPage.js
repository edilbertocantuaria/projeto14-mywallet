import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"

import useAppContext from '../hook/useAppContext';

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios"
import { ThreeDots } from "react-loader-spinner";

export default function SignInPage() {
  const { setToken,
    setUsername,
    setIdUser } = useAppContext();




  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [disableInputs, setDisableInputs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enter, setEnter] = useState("Entrar")

  const navigate = useNavigate();


  /*useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (token && username && userId) {
      navigate("/home");
    }
    return;
  }, [])*/




  /*useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (token && username && userId) {
      navigate("/home");
    }
  }, []);*/

  function login(event) {
    event.preventDefault();

    setDisableInputs(true);

    setEnter("");
    setIsLoading(true);

    if (email === "" || password === "") {
      alert("os campos não podem ficar em branco!")

      setDisableInputs(false);
      setIsLoading(false);
      setEnter("Entrar");
      return;
    }

    const user = {
      email: email.toLowerCase(),
      password: password
    }

    const request = axios.post("https://mywallet-api-3sqt.onrender.com/", user)

    request.then(response => {
      console.log(response.data)
      setToken(response.data.token);
      setUsername(response.data.user.name);
      setIdUser(response.data.user._id);


      /*localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.name);
      localStorage.setItem("userId", response.data.user._id);*/

      navigate("/home");
    })

    request.catch(error => {
      console.log(error.response.status);
      let complementaryInfo;
      switch (error.response.status) {
        case 401:
          complementaryInfo = "a senha está incorreta!";
          break;

        case 404:
          complementaryInfo = "usuário não cadastrado!";
          break;

        case 422:
          complementaryInfo = `\n\nO formato do email está inválido!`
          break;


        default:
          complementaryInfo = error.response.status;
          break;
      }
      alert(`Não foi possível realizar seu login: ${complementaryInfo}`)

      setDisableInputs(false);
      setIsLoading(false);
      setEnter("Entrar");

    })



  }

  return (
    <SingInContainer>
      <form onSubmit={login}>
        <MyWalletLogo />

        <input type="email"
          disabled={disableInputs}
          value={email}
          placeholder="email"
          data-test="email-input"
          onChange={e => setEmail(e.target.value)} />

        <input
          type="password"
          disabled={disableInputs}
          value={password}
          placeholder="senha"
          data-test="password-input"
          onChange={e => setPassword(e.target.value.trim())}
        />

        <button
          type="submit"
          disabled={disableInputs}
          data-test="login-btn">

          {enter}
          {isLoading && (
            <ThreeDots
              color="#FFFFFF"
              height="13px"
              width="51px"
              visible={isLoading} />
          )}

        </button>
      </form>

      <Link to="/singupUser">
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  width: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
