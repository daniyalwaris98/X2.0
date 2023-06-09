import styled from "styled-components";

export const MainProfileCard = styled.div`
  width: 100%;
  height: auto;

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
