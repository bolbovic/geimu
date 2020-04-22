import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { Button, ButtonOulineRM, RoundOutlinedButton } from './styles/Form'
import { FlexCM, FlexCCM, FlexH } from './styles/Flex'

const B = styled(RoundOutlinedButton)`
  position: fixed;
  right:0;
`

const Modal = styled(FlexCCM)`
  background: rgba(0, 0, 0, 0.3);
  display: none;
  height: 100wh;
  position: fixed;
  width: 100vw;
  z-index: 1;
  &.show {
    display: flex;
  }
`

const Content = styled(FlexCM)`
  background: #073642;
  border: 3px solid #dc322f;
  border-radius: 10px;
  color: #dc322f;
  max-width: 400px;
  padding: 20px;
  width: 80%;
`

export default inject('server')(observer(({ server }) => {
  const [show, setShow] = useState(false)
  return server.roomName ? (
    <>
      <B><FontAwesomeIcon icon='times' onClick={() => setShow(true)} /></B>
      <Modal className={show ? 'show' : ''}>
        <Content>
          <FlexCM>
            <div>Are you sure you want to quit the game, loser?</div>
          </FlexCM>
          <FlexH>
            <ButtonOulineRM onClick={() => setShow(false)}>Nevermind</ButtonOulineRM>
            <Button onClick={() => { server.stop(); setShow(false) }}>Yup</Button>
          </FlexH>
        </Content>
      </Modal>
    </>
  ) : null
}))
