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

const Info = styled.div`
  background: #eee8d5;
  color: #073642;
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

export default inject('server')(observer(({ server }) => server.info ? (
  <Flex>
    <Info>
      <div>{server.info}</div>
      <Close onClick={() => server.hideInfo()}><Icon icon='times' /></Close>
    </Info>
  </Flex>
) : null))
