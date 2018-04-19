export function filter(model, conditions) {
  const keys = Object.keys(conditions)
  return model, conditions.values.filter(v => {
    let res = true
    for (const k of keys) {
      const c = conditions[k].contain
      const e = conditions[k].exclude
      if (c) {
        res = c.some(d => d === v[k])
      }
      if (e) {
        res = e.every(d => d !== v[k])
      }
    }
    return res
  })
}

export const removeProperties = (keys, obj) => {
  for (const k of keys) {
    delete obj[k]
  }
  return obj
}

