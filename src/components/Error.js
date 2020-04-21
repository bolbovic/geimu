import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Flex = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
`

const Error = styled.div`
  background: #dc322f;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: auto;
  padding: 10px;
  width: 80%;
`

const Close = styled.div`
  cursor: pointer;
`

export default inject('server')(observer(({ server }) => server.error ? (
  <Flex>
    <Error>
      <div>{server.error}</div>
      <Close onClick={() => server.hideNotification()}><FontAwesomeIcon icon='times' /></Close>
    </Error>
  </Flex>
) : null))
