import React, { useState } from 'react'
import { LayoutLayer } from '../../application/Application'
import { observer } from '../../infrastructure/Observer'
import { useDocsContext } from '../../../App'
import { AuthStatus } from '../../domain/DomainModel'
import { LargeSpinner } from '../common/Loading'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from '../common/Container'
import { IconButton, LargeButton, RedButton, TextButton } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { Label } from '../common/Label'
import { TextInput, InputForm, type InputFormProps, type TextInputProps } from '../common/Input'
import { type StylableComponentProps } from '../../application/NoCSS'
import { type Theme } from '../../application/ThemeManager'

const FORM_WIDTH = '40rem'
const USER_EMAIL = 'USER_EMAIL'
const TITLE_FONT_SIZE = '1.25rem'
const LBL_FONT_SIZE = '1.1rem'

interface ColorScheme {
  header: string
  inputTitle: string
  inputText: string
  errColor: string
  errBgColor: string
}

const darkColorScheme = (theme: Theme): ColorScheme => {
  return {
    header: theme.h2,
    inputTitle: theme.p,
    inputText: theme.h4,
    errColor: theme.h3,
    errBgColor: theme.panelBg
  }
}

const lightColorScheme = (theme: Theme): ColorScheme => {
  return {
    header: theme.h2,
    inputTitle: theme.p,
    inputText: theme.h3,
    errColor: theme.h1,
    errBgColor: '#444444'
  }
}

export const AuthPage = observer(() => {
  console.log('new AuthPage')
  const {
    theme,
    user,
    themeManager,
    restApi
  } = useDocsContext()
  const navigate = useNavigate()

  const colorScheme = theme.isDark ? darkColorScheme(theme) : lightColorScheme(theme)

  const email = user.email || (window.localStorage.getItem(USER_EMAIL) ?? '')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [emailProtocol, _] = useState({ value: email ?? '' })
  const [pwdProtocol, __] = useState({ value: email === 'dev' || email === 'demo' ? 'pwd' : '' })
  const [codeProtocol, ___] = useState({ value: '' })

  let isProcessing = false
  if (user.authStatus === AuthStatus.AUTHORIZING) {
    isProcessing = true
  } else if (user.authStatus === AuthStatus.REQUESTING_VERIFICATION_CODE) {
    isProcessing = true
  } else if (user.authStatus === AuthStatus.CHECKING_CODE) isProcessing = true

  const submit = () => {
    if (isProcessing) return
    if (isCreatingAccount) {
      restApi.requestVerificationCode(emailProtocol.value, pwdProtocol.value)
    } else {
      restApi.auth(emailProtocol.value, pwdProtocol.value)
    }
    window.localStorage.setItem(USER_EMAIL, emailProtocol.value)
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
                 bgColor={theme.appBg}>

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
            padding='40px'
            paddingTop='100px'
            gap="15px">

      <Label fontSize={TITLE_FONT_SIZE}
             text={isCreatingAccount ? 'NEW ACCOUNT' : 'LOG IN'}
             width='100%'
             textAlign='center'
             paddingBottom='30px'
             textColor={colorScheme.header}
             layer={LayoutLayer.ONE}/>

      {(user.authStatus === AuthStatus.SIGNED_OUT ||
          user.authStatus === AuthStatus.AUTHORIZING ||
          user.authStatus === AuthStatus.REQUESTING_VERIFICATION_CODE) &&
        <>
          <LInput type="text"
                  placeHolder='Email:'
                  protocol={emailProtocol}
                  titleColor={colorScheme.inputTitle}
                  textColor={colorScheme.inputText}
                  onSubmitted={submit}/>

          <LInput type="password"
                  placeHolder='Password:'
                  protocol={pwdProtocol}
                  titleColor={colorScheme.inputTitle}
                  textColor={colorScheme.inputText}
                  onSubmitted={submit}/>

          <Spacer height='30px'/>

          <LargeButton className='mono' title="Submit"
                       width='100%' height='45px'
                       fontSize={TITLE_FONT_SIZE}
                       disabled={isProcessing}
                       onClick={submit}/>
        </>
      }

      {(user.authStatus === AuthStatus.VERIFICATION_CODE_GENERATED ||
        user.authStatus === AuthStatus.CHECKING_CODE) && <>
        <Label text='We ask you to enter a verification code that we have sent to your email:'
               textColor={theme.p}
               fontSize={LBL_FONT_SIZE}
               paddingBottom='20px'
               layer={LayoutLayer.ONE}/>

        <InputForm type="text"
                   width='175px'
                   placeHolder='000000'
                   className='mono'
                   fontSize='40px'
                   textColor={colorScheme.inputText}
                   height='60px'
                   protocol={codeProtocol}
                   border={['1px', 'solid', theme.text75]}
                   focusState={state => {
                     state.border = ['1px', 'solid', theme.red]
                   }}
                   onSubmitted={sendVerificationCode}/>

        <Spacer height='30px'/>

        <LargeButton title="Send code"
                     className='mono'
                     width='100%' height='45px'
                     fontSize={TITLE_FONT_SIZE}
                     disabled={isProcessing}
                     onClick={sendVerificationCode}/>

        <Label text='If you are not receiving a verification code by email during registration: check your spam folder.'
               textColor={theme.h6}
               paddingBottom='20px'
               layer={LayoutLayer.ONE}/>

      </>

      }

      <HStack halign='stretch' valign='center'
              width='100%' paddingTop='30px'>

        <Spacer/>

        <TextButton className='mono'
                    fontSize={LBL_FONT_SIZE}
                    title={isCreatingAccount ? 'I have already an account' : 'Create new account'}
                    disabled={isProcessing}
                    onClick={switchMode}/>
      </HStack>

      <LargeSpinner opacity={isProcessing ? '1' : '0'}/>

      <Label className='mono'
             fontSize={LBL_FONT_SIZE}
             padding='20px'
             opacity={user.authWithError === '' ? '0' : '1'}
             bgColor={colorScheme.errBgColor}
             textAlign='left'
             width='100%' minHeight='100px'
             text={user.authWithError}
             textColor={colorScheme.errColor}/>
    </VStack>
  </VStack>
})

const defLInputProps = (theme: Theme): any => {
  return {
    className: 'mono',
    width: '100%',
    paddingVertical: '10px',
    caretColor: theme.caretColor,
    fontSize: TITLE_FONT_SIZE,
    borderBottom: ['2px', 'solid', theme.text75],
    focusState: (state: StylableComponentProps) => {
      state.borderBottom = ['2px', 'solid', theme.red]
    }
  }
}

const LInput = (props: InputFormProps) => {
  console.log('new LInput')
  const theme = useDocsContext().theme
  const style = { ...defLInputProps(theme), ...props }

  return <HStack halign='left' valign='base'
                 width='100%'>
    <Label className='mono'
           textAlign='left'
           width='160px'
           fontSize={TITLE_FONT_SIZE}
           text={style.placeHolder}
           textColor={style.titleColor}/>

    <TextInput {...style} placeHolder='' border='none'/>
  </HStack>
}
