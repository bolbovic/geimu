import React from 'react'
import styled from 'styled-components'

import { Flex } from '../styles/Flex'

const Outer = styled(Flex)`
  box-sizing: border-box;
  height: calc(100vh - 30px);
  max-width: 500px;
  margin: auto;
  position: relative;
  padding-top: 40px;
`

export default ({ children }) => <Outer>{children}</Outer>
