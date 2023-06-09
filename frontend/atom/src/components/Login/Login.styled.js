import styled from "styled-components";
import { Input } from "antd";

export const MainProfileCard = styled.div`
  width: 100%;
  height: 100vh;

  @media (max-width: 768px) {
    height: auto;
  }
`;

export const ProfileChildMainCard = styled.div`
  display: flex;
  justify-content: space-between;
  width: auto;
  height: auto;
  margin: auto;
  flex-wrap: wrap;
`;

export const ProfileChildCard = styled.div`
  border-radius: 12px;
  background-color: #fcfcfc;
  height: auto;
  display: flex;
  margin: 5px;
  flex: 1 1 250px;
  transition: 0.2s linear;
`;

export const ProfileChildCard2 = styled.div`
  width: 200px;
  height: 600px;
  background-color: blue;
  position: absolute;
  left: 20px;
  right: 0;
  top: 20px;
  bottom: 0;
  margin: auto;
  /*Solves a problem in which the content is being cut when the div is smaller than its' wrapper:*/
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
`;

export const BG = styled.div`
  // background-image:
  // url(
  // "./assets/bg2.svg");
  background-image: url("./assets/bg2.svg");
  background-position: center;
  //   width: 2000px;
  //   height: 2000px;
`;

export const RightCard = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoginContainer = styled.article`
  display: grid;
  place-items: center;
  height: 100vh;

  .login-container {
    max-width: 1200px;
    margin: auto;

    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    place-items: center;

    .form-container {
      .welcome-text {
        font-weight: 600;
        margin: 0;
      }

      .logo {
        margin-bottom: 20px;
        width: 256px;
      }

      .greeting-text {
        /* max-width: 370px; */
        line-height: 16px;
        font-weight: 500;
        margin: 0;
      }

      .input-form-wrapper {
        margin: 0;
      }

      .login-form-button {
        background: linear-gradient(
          269.92deg,
          #3d9e47 -32.33%,
          #6fb544 108.19%
        );
        border-radius: 6px;
        color: #fff;
        border: none;
        padding: 12px;
        width: 100%;
        margin-top: 15px;
        font-weight: 500;

        transition: all.3s all linear;
        cursor: pointer;

        &:hover {
          background: #3d9e47;
        }
      }
    }

    .login-gif-wrapper {
      width: 100%;

      img {
        max-width: 100%;
      }
    }
  }
`;

export const LoginStyledInput = styled(Input)`
  height: 2.8rem;

  border-radius: 6px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
  margin-bottom: 18px !important;

  &:focus {
    border: 1px solid #6ab344 !important;
  }

  .ant-input-prefix {
    width: 20px;

    > svg {
      width: 14px;
    }
  }
`;

export const LoginPassStyledInput = styled(Input.Password)`
  height: 2.8rem;
  border-radius: 6px;
  /* border: none !important; */
  box-shadow: none !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;

  &:focus {
    border: 1px solid #6ab344 !important;
  }

  .ant-input-prefix {
    width: 20px;

    > svg {
      width: 14px;
    }
  }
`;
