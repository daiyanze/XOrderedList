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

export const combineTwoArrays = (arr1, arr2, reverse = false) => {
  const frontArr = reverse ? arr2 : arr1
  const backArr = reverse ? arr1 : arr2
  return frontArr.concat(backArr)
}
