import * as _ from 'lodash'

export default function component(name: string, html: string, styles, props): any {
  let stylesString = ''
  if (styles) {
    const styleNames = Object.keys(styles)
    if (styleNames && styleNames.length) {
      const stylesArray = []
      styleNames.map((styleName) => {
        let styleLinesArray = JSON.stringify(styles[styleName], null, 4).split('\n')
        // filter out the empty lines
        styleLinesArray = styleLinesArray.filter((styleLine) => styleLine.length)
        // add the first line in the same line as the name; it will be the opening "{" of the definition
        stylesArray.push(`${styleName} ${styleLinesArray[0]}`)
        // add the rest of the lines, except the last
        styleLinesArray.slice(1, styleLinesArray.length - 1).map((stylePropertyString) => {
          stylesArray.push(`${stylePropertyString.replace(',', '')};`)
        })
        // add the last line, as it needs an extra coma at the end
        stylesArray.push(`${styleLinesArray[styleLinesArray.length - 1]} `)
      })
      // add each attribute on a new line, and remove double quotes
      stylesString = stylesArray.join('\n  ').replace(/"/g, '')
    }
  }

  return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${_.upperFirst(name)}</title>   
    </head>
    <style>${stylesString}</style>
    <body>
      ${html}
    </body>
    </html>
  `
}
