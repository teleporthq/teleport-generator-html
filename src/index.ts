import { Generator } from '../teleport-lib-js'
import HtmlComponentGenerator from './generators/component'
import HtmlProjectGenerator from './generators/project'

export default class TeleportGeneratorHtml extends Generator {
  constructor() {
    super('html-generator', 'html')

    this.componentGenerator = new HtmlComponentGenerator(this)
    this.projectGenerator = new HtmlProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent(component: any, options: any): string {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): string {
    return this.projectGenerator.generate(component, options)
  }
}
