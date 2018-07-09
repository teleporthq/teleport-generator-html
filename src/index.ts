import { Generator, FileSet } from '@teleporthq/teleport-lib-js'
import HtmlComponentGenerator from './generators/component'
import HtmlProjectGenerator from './generators/project'

export default class TeleportGeneratorHtml extends Generator {
  public componentGenerator: HtmlComponentGenerator
  public projectGenerator: HtmlProjectGenerator

  constructor() {
    super('html-generator', 'html')

    this.componentGenerator = new HtmlComponentGenerator(this)
    this.projectGenerator = new HtmlProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent<T, U>(component: T, options: U): FileSet {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options)
  }
}
