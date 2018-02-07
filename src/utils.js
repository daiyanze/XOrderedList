export const combineTwoArrays = (arr1, arr2, reverse = false) => {
  const frontArr = reverse ? arr2 : arr1
  const backArr = reverse ? arr1 : arr2
  return frontArr.concat(backArr)
}

export const removeProperties = (keys, obj) => {
  for (const k of keys) {
    delete obj[k]
  }
  return obj
}

