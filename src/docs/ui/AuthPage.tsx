import React, { useState } from 'react'
import { LayoutLayer } from '../application/Application'
import { observer } from '../infrastructure/Observer'
import { IS_DEV_MODE, useDocsContext } from '../../App'
import { AuthStatus } from '../domain/DomainModel'
import { SmallSpinner } from './common/Loading'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from './common/Container'
import { IconButton, RedButton } from './common/Button'
import { Spacer } from './common/Spacer'
import { Label } from './common/Label'
import { Input } from './common/Input'

export const AuthPage = observer(() => {
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState(false)
  console.log('new AuthPage')
  const { theme, user, themeManager, restApi } = useDocsContext()
  const navigate = useNavigate()

  const [nameProtocol, _] = useState({ value: IS_DEV_MODE ? 'dev' : '' })
  const [pwdProtocol, __] = useState({ value: IS_DEV_MODE ? 'pwd' : '' })

  const logIn = () => {
    console.log('AuthPage.logIn: ' + nameProtocol.value + ':' + pwdProtocol.value)
    if (isCreatingNewAccount) {
      restApi.signup(nameProtocol.value, pwdProtocol.value)
    } else {
      restApi.logIn(nameProtocol.value, pwdProtocol.value)
    }
  }

  return <VStack halign="center" valign="center"
                 width='100%' height='100vh'
                 bgColor={theme.inputBg}>

    <HStack halign='left' valign='center'
            width="100%" height="50px"
            paddingHorizontal='10px'
            top='0'
            fixed
            layer={LayoutLayer.HEADER}>
      <IconButton icon={theme.isDark ? 'moon' : 'sun'}
                  popUp="Switch a theme"
                  onClick={() => {
                    themeManager.switchTheme()
                  }}/>

      <Spacer/>

      <RedButton title="Home"
                 onClick={() => { navigate('/') }}/>
    </HStack>

    <VStack halign="center" valign="top"
            bgColor={theme.panelBg}
            borderColor={theme.border}
            padding='40px'
            paddingBottom='0'
            gap="10px" width='100%' maxWidth='400px'>

      <Label className="ibm h4"
             text={isCreatingNewAccount ? 'NEW ACCOUNT' : 'LOG IN'}
             textColor={theme.green}
             paddingBottom='20px'
             layer={LayoutLayer.ONE}/>

      <Input type="text"
             title='Email address'
             protocol={nameProtocol}
             onSubmitted={logIn}/>

      <Input type="password"
             title='Password'
             protocol={pwdProtocol}
             onSubmitted={logIn}/>

      <HStack halign='stretch' valign='center'
              width='100%' height='75px'>
        <RedButton title="Submit"
                   disabled={user.authStatus === AuthStatus.AUTHORIZING}
                   onClick={logIn}/>

        <Spacer/>

        <RedButton title={isCreatingNewAccount ? 'Log in' : 'New Account'}
                   disabled={user.authStatus === AuthStatus.AUTHORIZING}
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
