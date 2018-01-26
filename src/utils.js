export const groupBy = (arrOfObj, prop) => {
  return arrOfObj.reduce((groups, item) => {
    const value = prop.reduce((prev, next) => prev[next], item)
    groups[value] = groups[value] || []
    groups[value].push(item)
    return groups
  }, {})
}

export const deepAttribute = (obj, indexes) => {
  return obj.reduce(item => {
    return indexes.reduce((prev, next) => prev[next], item)
  })
}
