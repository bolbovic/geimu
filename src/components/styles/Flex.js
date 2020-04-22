import styled from 'styled-components'

export const Flex = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const FlexH = styled(Flex)`
  flex-direction: row;
`

export const FlexC = styled(Flex)`
  justify-content: center;
  width: 100%;
`

export const FlexCM = styled(FlexC)`
  overflow: hidden;
  > div {
    margin-bottom: 20px;
  }
  > div:last-child {
    margin-bottom: 0;
  }
`

export const FlexCCM = styled(FlexCM)`
  height: 100%;
`
