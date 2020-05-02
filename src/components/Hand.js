import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button, RoundOutlinedButton } from './styles/Form'
import { FlexC } from './styles/Flex'
import Icon from './Icon'

const Hand = styled(FlexC)`
  position: fixed;
  bottom: 0;
  width: 100%;
  button {
    height: auto;
    padding-top: 10px;
    padding-bottom: 20px;
    margin-bottom: -10px;
  }
  button:last-child {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
`

const CardStyle = styled(Button)`
  background: #586e75;
  color: #fdf6e3;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 2px solid #fdf6e3;
  border-bottom: none;
  max-width: 500px;
  position: relative;
  width: 100%;
  &:disabled {
    background: #586e75;
    color: #839496;
    cursor: default;
  }
`

const S = styled(RoundOutlinedButton)`
  position: absolute;
  right: 5px;
  top: 5px;
`

const Card = ({ card, disabled, onClick, onSwitch, selectionId }) => (
  <CardStyle
    disabled={disabled}
    onClick={onClick}
    style={selectionId !== -1 ? { color: '#b58900' } : null}
  >
    <div dangerouslySetInnerHTML={{ __html: `${card}${selectionId !== -1 ? ` [${selectionId + 1}]` : ''}` }} />
    {onSwitch && selectionId === -1 ? <S onClick={onSwitch}><Icon icon='times' /></S> : null}
  </CardStyle>
)

const ShowHide = styled.div`
  background: #073642;
  border: 2px solid #b58900;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: none;
  color: #b58900;
  cursor: pointer;
  line-height: 16px;
  padding: 5px;
`

export default inject('modals', 'server')(observer(({ modals, server }) => {
  const switchCard = (e, c) => {
    e.stopPropagation()
    e.preventDefault()

    modals.showSwitch(c)

    return false
  }

  return server.hand.length > 0 ? (
    <Hand>
      <ShowHide onClick={() => server.toggleHand()}>{server.showingHand ? 'Hide cards' : 'Show cards'}</ShowHide>
      {server.showingHand ? (server.hand || []).map((c, i) => (
        <Card
          card={c}
          disabled={server.currentPage !== 'pick-answer'}
          key={i}
          onClick={() => server.answerClicked(c)}
          selectionId={server.answers.indexOf(c)}
          onSwitch={server.self.canChange ? e => switchCard(e, c) : null}
        />
      )) : null}
    </Hand>
  ) : null
}))
