export const dependScript = (address: string) => {
  return new Promise((resolve, reject) => {
    const srcNode = document.createElement('script')

    srcNode.src = address

    srcNode.onload = resolve
    srcNode.onerror = reject

    document.body.appendChild(srcNode)
  })
}

export const dependStyle = (address: string) => {
  return new Promise((resolve, reject) => {
    const linkNode = document.createElement('link')

    linkNode.rel = 'stylesheet'
    linkNode.href = address

    linkNode.onload = resolve
    linkNode.onerror = reject

    document.getElementsByTagName('head')[0].appendChild(linkNode)
  })
}
