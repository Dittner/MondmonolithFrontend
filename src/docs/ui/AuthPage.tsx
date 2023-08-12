import React, { useState } from 'react'
import { LayoutLayer } from '../application/Application'
import {
  HStack,
  IconButton,
  Input,
  Label, RedButton, Spacer,
  VStack
} from '../application/NoCSSComponents'
import { observer } from '../infrastructure/Observer'
import { useDocsContext } from '../../App'
import { AuthStatus } from '../domain/DomainModel'
import { SmallSpinner } from './common/Loading'
import { useNavigate } from 'react-router-dom'

export const AuthPage = observer(() => {
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState(false)
  console.log('new AuthPage')
  const { theme, user, themeManager, restApi } = useDocsContext()
  const navigate = useNavigate()

  const [nameProtocol, _] = useState({ value: process.env.REACT_APP_DEV_MODE ? 'dev' : '' })
  const [pwdProtocol, __] = useState({ value: process.env.REACT_APP_DEV_MODE ? 'pwd' : '' })

  const logIn = () => {
    console.log('AuthPage.logIn: ' + nameProtocol.value + ':' + pwdProtocol.value)
    restApi.logIn(nameProtocol.value, pwdProtocol.value)
  }

  return <VStack halign="center" valign="center"
                 width='100%' height='100vh'>

    <HStack halign='left' valign='center'
            width="100%" height="50px"
            paddingHorizontal='10px'
            top='0'
            fixed
            layer={LayoutLayer.HEADER}>
      <IconButton icon={theme.isDark ? 'moon' : 'sun'}
                  hideBg
                  popUp="Switch a theme"
                  theme={theme}
                  onClick={() => {
                    themeManager.switchTheme()
                  }}/>

      <Spacer/>

      <RedButton title="Home"
                 hideBg
                 theme={theme}
                 onClick={() => { navigate('/') }}/>
    </HStack>

    <VStack halign="center" valign="top"
            bgColor={theme.panelBg}
            borderColor={theme.border}
            padding='40px'
            paddingBottom='0'
            gap="0" width='100%' maxWidth='400px'>

      <Label className="ibm h4"
             text={isCreatingNewAccount ? 'NEW ACCOUNT' : 'LOG IN'}
             textColor={theme.green}
             paddingBottom='20px'
             layer={LayoutLayer.ONE}/>

      <Input type="text"
             title='Email address'
             protocol={nameProtocol}
             theme={theme}
             onSubmitted={logIn}/>

      <Input type="password"
             title='Password'
             protocol={pwdProtocol}
             theme={theme}
             onSubmitted={logIn}/>

      <HStack halign='stretch' valign='center'
              width='100%' height='75px'>
        <RedButton title="Submit"
                   disabled={user.authStatus === AuthStatus.AUTHORIZING}
                   hideBg
                   theme={theme}
                   onClick={logIn}/>

        <Spacer/>

        <RedButton title={isCreatingNewAccount ? 'Log in' : 'New Account'}
                   disabled={user.authStatus === AuthStatus.AUTHORIZING}
                   hideBg
                   theme={theme}
                   onClick={() => { setIsCreatingNewAccount(!isCreatingNewAccount) }}/>
      </HStack>

      <SmallSpinner opacity={user.authStatus === AuthStatus.AUTHORIZING ? '1' : '0'}/>

    </VStack>

    <Label className='ibm'
           opacity={user.authWithError === '' ? '0' : '1'}
           textAlign='center'
           minHeight='100px'
           text={user.authWithError}
           textColor={theme.green75}/>

  </VStack>
})
