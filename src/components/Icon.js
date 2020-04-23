import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = styled.span`
  svg {
    height: 1em !important;
    width: 1em !important;
  }
`
export default (props) => (
  <Icon><FontAwesomeIcon {...props} /></Icon>
)
