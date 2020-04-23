import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import Icon from './Icon'

const Flex = styled.div`
  display: flex;
  position: fixed;
  top: 0;
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
      <Close onClick={() => server.hideNotification()}><Icon icon='times' /></Close>
    </Error>
  </Flex>
) : null))
