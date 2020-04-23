import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button, ButtonOulineRM } from './styles/Form'
import { FlexCM, FlexCCM, FlexH } from './styles/Flex'

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

export default inject('modals', 'server')(observer(({ modals, server }) => (
  <>
    <Modal className={modals.userToKick ? 'show' : ''}>
      <Content>
        <FlexCM>
          <div>{`Are you sure you want to kick ${modals.userToKick ? modals.userToKick.name : ''} from the game?`}</div>
        </FlexCM>
        <FlexH>
          <ButtonOulineRM onClick={() => modals.hideKick()}>Nevermind</ButtonOulineRM>
          <Button onClick={() => { server.kick(modals.userToKick); modals.hideKick() }}>Yup</Button>
        </FlexH>
      </Content>
    </Modal>
    <Modal className={modals.quit ? 'show' : ''}>
      <Content>
        <FlexCM>
          <div>Are you sure you want to quit the game, loser?</div>
        </FlexCM>
        <FlexH>
          <ButtonOulineRM onClick={() => modals.hideQuit()}>Nevermind</ButtonOulineRM>
          <Button onClick={() => { server.stop(); modals.hideQuit() }}>Yup</Button>
        </FlexH>
      </Content>
    </Modal>
  </>
)))
