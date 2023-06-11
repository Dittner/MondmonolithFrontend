import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {DocList} from "./docList/DocList";
import {observer} from "mobx-react";
import {useDocsContext} from "../../App";
import {DocBody} from "./docBody/DocBody";
import {DocTopics} from "./docTopics/DocTopics";
import {Header} from "./header/Header";
import {HAlign, HStack, StylableContainer, VAlign, VStack} from "../../docs/application/NoCSS";
import {AppSize, LayoutLayer} from "../application/Application";

export const DocsView = observer(() => {
  console.log("DocsView init");
  const docsContext = useDocsContext()
  const drawLayoutLines = false

  useEffect(() => {
    docsContext.docsLoader.fetchDirectories()
  })

  const {pathname, hash, key} = useLocation()

  useEffect(() => {
    docsContext.app.isDocListShown = false
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

  if (docsContext.app.size === AppSize.L) {
    return (
      <div>
        <Header width="80%"
                height={headerHeight}
                left="20%"
                top="0"
                layer={LayoutLayer.HEADER}
                fixed/>

        <DocList width="20%"
                 height="100vh"
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
      </div>
    )
  }

  if (docsContext.app.size === AppSize.M) {
    return (
      <div>
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


      </div>
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

      <DocList left={docsContext.app.isDocListShown ? "0" : "-350px"}
               width="350px"
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

  return <VStack className={"modalView"}
                 halign={HAlign.CENTER}
                 valign={VAlign.CENTER}
                 width="100%"
                 height="100%"
                 layer={LayoutLayer.MODAL}
                 fixed>

    {app.yesNoDialog &&
    <VStack className="yesNoDialog"
            halign={HAlign.STRETCH}
            valign={VAlign.CENTER}
            width="350px" padding="30px" gap="30px">
      <p>{app.yesNoDialog.text}</p>

      <HStack halign={HAlign.CENTER} valign={VAlign.TOP} gap="50px">
        <button onClick={cancel}
                className="btn">No
        </button>
        <button className="btn"
                onClick={apply}>Yes
        </button>
      </HStack>
    </VStack>
    }

    {app.infoDialog &&
    <VStack className="yesNoDialog"
            halign={HAlign.CENTER}
            valign={VAlign.CENTER}
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
