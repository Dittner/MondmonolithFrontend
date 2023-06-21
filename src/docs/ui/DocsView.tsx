import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {DocList} from "./DocList";
import {observer} from "mobx-react";
import {useDocsContext} from "../../App";
import {DocBody} from "./DocBody";
import {DocTopics} from "./DocTopics";
import {Header} from "./Header";
import {AppSize, LayoutLayer} from "../application/Application";
import {HStack, Label, RedButton, StylableContainer, VStack} from "../application/NoCSSComponents";

export const DocsView = observer(() => {
  console.log("DocsView init");
  const {docsLoader, app} = useDocsContext()
  const drawLayoutLines = false

  useEffect(() => {
    docsLoader.fetchDirectories()
  })

  const {pathname, hash, key} = useLocation()

  useEffect(() => {
    app.isDocListShown = false
  }, [pathname]);

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const elementPos = Math.round(element.getBoundingClientRect().top + document.documentElement.scrollTop)
          //element.scrollIntoView();
          console.log("elementPos=", elementPos);
          window.scrollTo(0, elementPos < 100 ? 0 : elementPos - 50);
        }
      }, 0)
    }
  }, [pathname, hash, key]); // do this on route change

  const headerHeight = "50px"

  if (app.size === AppSize.L) {
    return (
      <>
        <Header width="80%"
                height={headerHeight}
                left="20%"
                top="0"
                layer={LayoutLayer.HEADER}
                fixed/>

        <DocList width="20%"
                 height="100vh"
                 left="0"
                 layer={LayoutLayer.DOC_LIST}
                 enableOwnScroller
                 fixed/>

        <DocBody width="60%"
                 top={headerHeight}
                 bottom="0"
                 left="20%"
                 absolute/>

        <DocTopics width="20%"
                   left="80%"
                   top={headerHeight}
                   bottom="0"
                   enableOwnScroller
                   borderLeft={["1px", "solid", app.theme.border]}
                   fixed/>
        <ModalView/>

        {drawLayoutLines &&
        <>
          <StylableContainer className="appLayout L"
                             width="100vw"
                             height="1px"
                             top={headerHeight}
                             fixed/>

          <StylableContainer className="appLayout L"
                             width="1px"
                             height="100vh"
                             left="20vw"
                             fixed/>

          <StylableContainer className="appLayout L"
                             width="1px"
                             height="100vh"
                             left="80vw"
                             fixed/>
        </>
        }
      </>
    )
  }

  if (app.size === AppSize.M) {
    return (
      <>
        <Header width="70%"
                height={headerHeight}
                left="30%"
                top="0"
                layer={LayoutLayer.HEADER}
                fixed/>

        <DocList width="30%"
                 height="100vh"
                 layer={LayoutLayer.DOC_LIST}
                 enableOwnScroller
                 fixed/>

        <DocBody width="70%"
                 height="100%"
                 top={headerHeight}
                 left="30%"
                 absolute/>

        <ModalView/>

        {drawLayoutLines &&
        <>
          <StylableContainer className="appLayout M"
                             width="100vw"
                             height="1px"
                             top={headerHeight}
                             fixed/>

          <StylableContainer className="appLayout M"
                             width="1px"
                             height="100vh"
                             left="30vw"
                             fixed/>
        </>
        }


      </>
    )
  }

  return (
    <>
      <Header width="100%"
              height={headerHeight}
              top="0"
              left="0"
              layer={LayoutLayer.HEADER} //z-Index
              fixed/>

      <DocList left={app.isDocListShown ? "0" : "-300px"}
               width="300px"
               height="100vh"
               layer={LayoutLayer.DOC_LIST}
               animate="left 0.5s"
               enableOwnScroller
               fixed/>

      <DocBody width="100%"
               top={headerHeight}
               bottom="0"
               absolute/>

      <ModalView/>

      {drawLayoutLines &&
      <>
        <StylableContainer className="appLayout S"
                           width="100vw"
                           height="1px"
                           top={headerHeight}
                           fixed/>

        <StylableContainer className="appLayout S"
                           width="1px"
                           height="100vh"
                           left="350px"
                           fixed/>
      </>
      }
    </>
  )


})

export const ModalView = observer(() => {
  console.log("new ModalView")

  const {app} = useDocsContext()

  const apply = () => {
    if (app.infoDialog) {
      app.infoDialog = undefined
    } else if (app.yesNoDialog) {
      app.yesNoDialog.onApply()
      app.yesNoDialog = undefined
    }
  }

  const cancel = () => {
    if (app.yesNoDialog) {
      app.yesNoDialog.onCancel?.()
      app.yesNoDialog = undefined
    }
  }

  if (!app.yesNoDialog && !app.infoDialog)
    return <></>

  return <VStack halign="center"
                 valign="center"
                 width="100%"
                 height="100%"
                 bgColor="#00000050"
                 layer={LayoutLayer.MODAL}
                 fixed>

    <VStack visible={app.yesNoDialog !== undefined}
            halign="stretch"
            valign="center"
            bgColor={app.theme.modalWindowBg}
            cornerRadius="20px"
            shadow="0 10px 20px #00000020"
            width="350px" padding="30px" gap="30px">

      <Label className="mono"
             title={app.yesNoDialog?.text}
             whiteSpace="pre-wrap"
             textColor={app.theme.text}/>

      <HStack halign="center" valign="top" gap="50px">
        <RedButton title="No"
                   theme={app.theme}
                   hideBg
                   onClick={cancel}/>

        <RedButton title="Yes"
                   theme={app.theme}
                   hideBg
                   onClick={apply}/>
      </HStack>
    </VStack>

    {app.infoDialog &&
    <VStack className="yesNoDialog"
            halign="center"
            valign="center"
            width="350px" padding="30px" gap="30px">
      <h2>{app.infoDialog.title}</h2>
      <p>{app.infoDialog.text}</p>

      <button onClick={apply}
              className="btn">OK
      </button>
    </VStack>
    }
  </VStack>
})
