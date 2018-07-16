import upperFirst = require('lodash/upperFirst')
import pretty from 'pretty'

import { ComponentGenerator, Generator, FileSet } from '@teleporthq/teleport-lib-js'

import TeleportGeneratorHtml from '../index'
import HTMLrenderer from '../renderers/html'
import COMPONENTrenderer from '../renderers/component'

function findNextIndexedKeyInObject(object, key) {
  if (!object[key]) return key
  let i = 1
  while (object[key + '_' + i] !== undefined) {
    i++
  }
  return key + '_' + i
}

export default class HtmlComponentGenerator extends ComponentGenerator {
  public generator: TeleportGeneratorHtml
  private project = null

  constructor(generator: TeleportGeneratorHtml) {
    super(generator as Generator)
  }

  public processStyles(componentContent: any, styles: any, parentsArray: string[]): any {
    const content = JSON.parse(JSON.stringify(componentContent))
    const parents = parentsArray.slice()

    if (content.style) {
      const stylePath = parents.length > 0 ? `${parents.join(' > ')} >` : ''
      const styleName = findNextIndexedKeyInObject(styles, content.name || content.type)
      styles[`${stylePath} .${styleName}`] = content.style
      content.style = [styleName]
      // @todo: handle platform
    }

    let htmlTag: string
    const mapping = this.generator.target.map(content.source, content.type)
    if (mapping) htmlTag = mapping.type
    parents.push(htmlTag)

    // if has children, do the same for children
    if (content.children && content.children.length > 0) {
      if (typeof content.children !== 'string') {
        content.children = content.children.map((child) => {
          if (child.source === 'components') {
            child = this.project.components[`${child.type}`].content
          }
          const childStyledResults = this.processStyles(child, styles, parents)
          styles = {
            ...styles,
            ...childStyledResults.styles,
          }
          return childStyledResults.content
        })
      }
    }

    return { styles, content }
  }

  public renderComponentHTML(content: any): any {
    const { source, type, ...props } = content

    // retrieve the target type from the lib
    let mapping: any = null
    let mappedType: string = type
    if (source !== 'components' && source !== 'pages') {
      mapping = this.generator.target.map(source, type)
      if (mapping) mappedType = mapping.type
    }

    let styleNames = null

    if (props.style) styleNames = props.style
    delete props.style

    // there are cases when no children are passed via structure, so the deconstruction will fail
    let children = null
    if (props.children) children = props.children
    // remove the children from props
    delete props.children

    let childrenTags: any = []
    if (children && children.length > 0) {
      childrenTags = typeof children === 'string' ? children : children.map((child) => this.renderComponentHTML(child))
    }

    if (Array.isArray(childrenTags)) {
      childrenTags = childrenTags.join('')
    }

    styleNames = styleNames ? styleNames.join(' ') : null

    const { name, props: componentProps, ...otherProps } = props // this is to cover img uri props; aka static props

    let mappedProps = { ...componentProps, ...otherProps }

    if (mapping && typeof mapping.props === 'function') {
      mappedProps = mapping.props(mappedProps)
    }

    return HTMLrenderer(mappedType, childrenTags, styleNames, mappedProps)
  }

  public generate(component: any, project: any): FileSet {
    const { name } = component
    let { content } = component
    this.project = project

    const stylingResults = this.processStyles(content, {}, [])
    const styles = stylingResults.styles
    content = stylingResults.content

    const html = this.renderComponentHTML(content)

    const props = component.editableProps ? Object.keys(component.editableProps) : null

    const result = new FileSet()
    result.addFile(`${upperFirst(component.name)}.html`, pretty(COMPONENTrenderer(name, html, styles, props)))

    return result
  }
}
