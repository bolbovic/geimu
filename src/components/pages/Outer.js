import React from 'react'
import styled from 'styled-components'

import { Flex } from '../styles/Flex'

const Outer = styled(Flex)`
  box-sizing: border-box;
  border: 1px solid #2aa198;
  height: 100vh;
  max-width: 500px;
  margin: auto;
  position: relative;
`

export default ({ children }) => <Outer>{children}</Outer>
