import React from 'react'
import { inject, observer } from 'mobx-react'

import { Button, ButtonOulineRM } from '../components/styles/Form'
import { Title } from '../components/styles/Texts'
import { FlexCM, FlexH } from '../components/styles/Flex'
import FilledQuestion from '../components/FilledQuestion'
import { UserText } from '../components/User'

export default inject('server')(observer(({ server }) => {
  const m = server.numberOfAnswers > 1
  return (
    <FlexCM>
      <Title>Pick Answer{m ? 's' : ''}</Title>
      <div>{`Please choose ${m ? 'cards' : 'a card'} to fill the blank${m ? 's' : ''} for `}<UserText>{server.picker.name}</UserText>'s question!</div>
      <FilledQuestion question={server.question} answers={server.answers} />
      <FlexH>
        <ButtonOulineRM onClick={() => server.resetAnswers()}>Reset</ButtonOulineRM>
        <Button disabled={server.answers.length !== server.numberOfAnswers} onClick={() => server.chooseAnswers()}>Confirm</Button>
      </FlexH>
    </FlexCM>
  )
}))
