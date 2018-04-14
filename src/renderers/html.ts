export default function html(tag: string, childrenTags?: string, classNames?: string, props?: any): string {
  let stylesString = ''
  if (classNames) {
    stylesString = `class="${classNames}"`
  }

  const propsArray = []
  if (props) {
    Object.keys(props).map(propName => {
      const propValue = props[propName]
      propsArray.push(`${propName}=${JSON.stringify(propValue)}`)
    })
  }

  const propsString = (propsArray.length ? ' ' + propsArray.join(' ') : '')

  if (childrenTags && childrenTags.length > 0) {
    return `<${tag} ${stylesString} ${propsString}>${childrenTags}</${tag}>`
  } else {
    return `<${tag} ${stylesString} ${propsString}/>`
  }
}

