import styled from 'styled-components'

export const Button = styled.button`
  background-color: #d33682;
  border: none;
  border-radius: 10px;
  color: #fdf6e3;
  height: 40px;
  text-decoration: none;
  text-transform: uppercase;
  width: 120px;
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

export const Select = styled.select`
  background: #839496;
  border: none;
  border-radius: 10px;
  color: #073642;
  padding: 10px;
  text-shadow: none;
  width: 300px;
`

export const Label = styled.label`
  margin-bottom: 10px;
`
