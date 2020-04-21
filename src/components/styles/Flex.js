import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  flex-direction: column;
`

export const FlexH = styled(Flex)`
  flex-direction: row;
`

export const FlexC = styled(Flex)`
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const FlexCM = styled(FlexC)`
  height: 100%;
  div {
    margin-bottom: 20px;
  }
  div:last-child {
    margin-bottom: 0;
  }
`
