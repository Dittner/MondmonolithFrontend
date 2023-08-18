import React, { useState } from 'react'
import { LayoutLayer } from '../application/Application'
import { observer } from '../infrastructure/Observer'
import { IS_DEV_MODE, useDocsContext } from '../../App'
import { AuthStatus } from '../domain/DomainModel'
import { SmallSpinner } from './common/Loading'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from './common/Container'
import { IconButton, LargeButton, RedButton, TextButton } from './common/Button'
import { Spacer } from './common/Spacer'
import { Label } from './common/Label'
import { AuthInput, Input } from './common/Input'

const FORM_WIDTH = '420px'
export const AuthPage = observer(() => {
  console.log('new AuthPage')
  const {
    theme,
    user,
    themeManager,
    restApi
  } = useDocsContext()
  const navigate = useNavigate()

  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [nameProtocol, _] = useState({ value: IS_DEV_MODE ? 'dev' : '' })
  const [pwdProtocol, __] = useState({ value: IS_DEV_MODE ? 'pwd' : '' })
  const [codeProtocol, ___] = useState({ value: '' })

  let isProcessing = false
  if (user.authStatus === AuthStatus.AUTHORIZING) isProcessing = true
  else if (user.authStatus === AuthStatus.REQUESTING_VERIFICATION_CODE) isProcessing = true
  else if (user.authStatus === AuthStatus.CHECKING_CODE) isProcessing = true

  const submit = () => {
    if (isProcessing) return
    if (isCreatingAccount) {
      restApi.requestVerificationCode(nameProtocol.value, pwdProtocol.value)
    } else {
      restApi.auth(nameProtocol.value, pwdProtocol.value)
    }
  }

  const sendVerificationCode = () => {
    if (user.authStatus !== AuthStatus.AUTHORIZING) {
      restApi.sendVerificationCode(user, codeProtocol.value)
    }
  }

  const switchMode = () => {
    if (isCreatingAccount) {
      setIsCreatingAccount(false)
      user.authStatus = AuthStatus.SIGNED_OUT
    } else {
      setIsCreatingAccount(true)
    }
  }

  return <VStack halign="center" valign="center"
                 width='100%' height='100vh'
                 bgColor={theme.authPageBg}>

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
                 onClick={() => {
                   navigate('/')
                 }}/>
    </HStack>

    <VStack halign="center" valign="top"
            width='100%' maxWidth={FORM_WIDTH}
            bgColor={theme.panelBg}
            borderColor={theme.border}
            padding='40px'
            paddingBottom='10px'
            gap="15px">

      <Label className="h1"
             text={isCreatingAccount ? 'NEW ACCOUNT' : 'LOG IN'}
             textAlign='center'
             textColor={theme.green}
             paddingBottom='20px'
             layer={LayoutLayer.ONE}/>

      {(user.authStatus === AuthStatus.SIGNED_OUT ||
          user.authStatus === AuthStatus.AUTHORIZING ||
          user.authStatus === AuthStatus.REQUESTING_VERIFICATION_CODE) &&
        <>
          <AuthInput type="text"
                     placeHolder='Email'
                     protocol={nameProtocol}
                     onSubmitted={submit}/>

          <AuthInput type="password"
                     placeHolder='Password'
                     protocol={pwdProtocol}
                     onSubmitted={submit}/>

          <Spacer height='20px'/>

          <LargeButton title="Submit"
                       width='100%'
                       disabled={isProcessing}
                       onClick={submit}/>
        </>
      }

      {(user.authStatus === AuthStatus.VERIFICATION_CODE_GENERATED ||
        user.authStatus === AuthStatus.CHECKING_CODE) && <>
        <Label text='We ask you to enter a verification code that we have sent to your email:'
               textColor={theme.green}
               paddingBottom='20px'
               layer={LayoutLayer.ONE}/>

        <Input type="text"
               width='9rem'
               placeHolder='------'
               className='mono'
               fontSize='2rem'
               height='50px'
               protocol={codeProtocol}
               onSubmitted={sendVerificationCode}/>

        <Spacer height='20px'/>

        <LargeButton title="Send code"
                     width='100%'
                     disabled={isProcessing}
                     onClick={sendVerificationCode}/>

        <Label fontSize='0.8rem'
               text='If you are not receiving a verification code by email during registration: check your spam folder.'
               textColor={theme.green75}
               paddingBottom='20px'
               layer={LayoutLayer.ONE}/>

      </>

      }

      <SmallSpinner opacity={isProcessing ? '1' : '0'}/>

      <HStack halign='stretch' valign='center'
              width='100%'>

        <Spacer/>

        <TextButton title={isCreatingAccount ? 'I have already an account' : 'Create new account'}
                    disabled={isProcessing}
                    onClick={switchMode}/>
      </HStack>
    </VStack>

    <Label className='ibm'
           opacity={user.authWithError === '' ? '0' : '1'}
           textAlign='center'
           width={FORM_WIDTH} minHeight='100px'
           text={user.authWithError}
           textColor={theme.green75}/>

  </VStack>
})
