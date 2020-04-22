import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button } from './styles/Form'
import { FlexC } from './styles/Flex'

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
  width: 100%;
  &:disabled {
    background: #586e75;
    color: #839496;
    cursor: default;
  }
`

const Card = ({ card, disabled, onClick, selectionId }) => (
  <CardStyle
    dangerouslySetInnerHTML={{ __html: `${card}${selectionId !== -1 ? ` [${selectionId + 1}]` : ''}` }}
    disabled={disabled}
    onClick={onClick}
    style={selectionId !== -1 ? { color: '#b58900' } : null}
  />
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

export default inject('server')(observer(({ server }) => {
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
        />
      )) : null}
    </Hand>
  ) : null
}))
