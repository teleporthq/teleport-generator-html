import { ProjectGenerator, Generator, FileSet } from 'teleport-lib-js'

import TeleportGeneratorHtml from '../index'
import HtmlComponentGenerator from './component'

export default class HtmlProjectGenerator extends ProjectGenerator {
  public generator: TeleportGeneratorHtml
  public componentGenerator: HtmlComponentGenerator

  constructor(generator: TeleportGeneratorHtml, componentGenerator: HtmlComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  // tslint:disable-next-line:no-shadowed-variable
  public generate(project: any, options: any = {}): FileSet {
    const { name, components, pages } = project

    const result = new FileSet()

    if (components) {
      Object.keys(components).map(componentName => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component, project)
        componentResults.getFileNames().map(fileName => {
          result.addFile(
            `components/${fileName}`,
            componentResults.getContent(fileName)
          )
        })
      })
    }

    if (pages) {
      Object.keys(pages).map(pageName => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page, project)
        pageResults.getFileNames().map(fileName => {
          result.addFile(
            `pages/${fileName}`,
            pageResults.getContent(fileName)
          )
        })
      })
    }

    return result
  }
}
