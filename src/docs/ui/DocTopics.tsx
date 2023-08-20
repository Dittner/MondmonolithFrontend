import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import { DocLoadStatus, type Page } from '../domain/DomainModel'
import { buildClassName, stylable, type StylableComponentProps } from '../application/NoCSS'

import { observeDirList } from '../DocsContext'
import { observe, observer } from '../infrastructure/Observer'
import { useDocsContext } from '../../App'
import { VStack } from './common/Container'

export const DocTopics = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDocTopicsView/>}/>
    <Route path=":docId" element={<DocTopicsView/>}/>
  </Routes>
})

const EmptyDocTopicsView = () => {
  return <div className="docTopics"/>
}

const DocTopicsView = observer(() => {
  console.log('new DocTopicsView')
  const dirList = observeDirList()
  const { theme } = useDocsContext()

  const params = useParams()
  const doc = dirList.findDoc(d => params.docId === d.id)
  if (!doc || doc.loadStatus === DocLoadStatus.LOADING) {
    return <></>
  }

  observe(doc)

  return (
    <VStack halign="left" valign="top" gap="0"
            width="100%" height="100%"
            paddingHorizontal="10px" paddingTop="5px">
      {doc.pages.map(page => {
        return <TopicLink key={page.uid}
                          page={page}
                          width="100%"
                          textColor={theme.topic}
                          hoverState={state => {
                            state.textColor = theme.topicHover
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
  const page = observe(props.page)
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <NavLink className={className} to={page.key}>{page.title}</NavLink>
})
