import styled from 'styled-components'

export const Button = styled.button`
  background-color: #d33682;
  border: none;
  border-radius: 10px;
  color: #fdf6e3;
  cursor: pointer;
  flex-shrink: 0;
  height: 40px;
  text-decoration: none;
  text-transform: uppercase;
  width: 120px;
  &:disabled {
    background: #6c71c4;
    color: #839496;
  }
`

export const ButtonOutline = styled(Button)`
  background-color: transparent;
  border: 3px solid #d33682;
`

export const ButtonOulineRM = styled(ButtonOutline)`
  margin-right: 20px;
`

export const Input = styled.input`
  background: #839496;
  border: none;
  border-radius: 10px;
  color: #073642;
  padding: 10px;
  text-shadow: none;
  width: 280px;
`

export const Label = styled.label`
  margin-bottom: 10px;
`

export const QuestionButton = styled.div`
  background: #eee8d5;
  border-radius: 10px;
  border: 4px solid #eee8d5;
  box-sizing: border-box;
  color: #268bd2;
  cursor: pointer;
  height: auto;
  padding: 10px;
  width: 100%;
  &.selected {
    border-color: #d33682;
  }
`

export const RoundOutlinedButton = styled.div`
  align-items: center;
  border: 3px solid #d33682;
  border-radius: 15px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 30px;
  width: 30px;
  svg {
    height: 1em !important;
    width: 1em !important;
  }
`

export const Select = styled.select`
  background: #839496;
  border: none;
  border-radius: 10px;
  color: #073642;
  padding: 10px;
  text-shadow: none;
  width: 300px;
`
