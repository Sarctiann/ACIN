const strFormat = (str, regexs, args) => {


  let mut_str = str
  if (regexs !== undefined) {
    regexs.forEach(({ pattern, replacement }) => {
      mut_str = mut_str.replace(RegExp(pattern, 'ig'), replacement)
    })
  }
  return mut_str.replace(/{([\w\s]+)}/g,
  (match, index) => {
      return typeof args[index] === 'undefined' ? match : args[index]
    }
  )
}

export default strFormat