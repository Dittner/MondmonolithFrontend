import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import { useDocsContext } from '../../App'
import { DocLoadStatus, type Page } from '../domain/DomainModel'
import { observer } from 'mobx-react'
import { buildClassName, stylable, type StylableComponentProps } from '../application/NoCSS'
import { VStack } from '../application/NoCSSComponents'

export const DocTopics = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDocTopicsView/>}/>
    <Route path=":docUID" element={<DocTopicsView/>}/>
  </Routes>
})

const EmptyDocTopicsView = () => {
  return <div className="docTopics"/>
}

const DocTopicsView = observer(() => {
  console.log('new DocTopicsView')
  const docsContext = useDocsContext()
  const theme = docsContext.app.theme
  const params = useParams()
  console.log('new DocTopicsView, params: ', params)
  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  if (!doc || doc.loadStatus === DocLoadStatus.LOADING) {
    return <></>
  }
  return (
    <VStack halign="left" valign="top" gap="0"
            width="100%" height="100%"
            paddingHorizontal="10px" paddingTop="5px">
      {doc.pages.map(page => {
        return <TopicLink key={page.uid}
                          page={page}
                          width="100%"
                          textColor={theme.pageTitle}
                          hoverState={state => {
                            state.textColor = theme.text
                          }
                          }/>
      })}
    </VStack>
  )
})

interface TopicLinkProps extends StylableComponentProps {
  page: Page
}

const TopicLink = observer((props: TopicLinkProps) => {
  const page = props.page
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <NavLink className={className} to={page.id}>{page.title}</NavLink>
})
