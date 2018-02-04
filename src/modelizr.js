import { combineTwoArrays } from './utils'

class Modelizr {
  property = {
    entities: {},
    ids: [],
    idAttribute: 'id',
    name: 'default_model'
  }

  avoidOptions = {
    unshift: [],
    append: [],
    update: [],
    remove: []
  }

  data = []

  constructor (args) {
    const {
      name,
      idAttribute,
      data,
      avoidOptions
    } = args

    this.property.name = name
    this.property.idAttribute = idAttribute

    if (avoidOptions) {
      this.avoidOptions = avoidOptions
    }

    if (data) {
      this.append(data)
    }
  }

  _reproduce (ids = this.property.ids) {
    this.data = this._denormalize(ids)
    return this
  }

  _normalize (arr) {
    const res = { ids: [], entities: {} }

    if (arr) {
      for (const a of arr) {
        const id = a[this.property.idAttribute]
        res.ids.push(id)
        res.entities[id] = a
      }
    }

    return res
  }

  _denormalize (ids = this.property.ids) {
    const res = []

    for (const id of ids) {
      const entity = this.property.entities[id]
      if (entity) {
        res.push(entity)
      }
    }

    return res
  }

  _insertStrategy (arr, option, reverse = false) {
    if (this.avoidOptions[option].length) {
      arr = arr.filter(a =>
        !this.avoidOptions[option].includes(
          a[this.property.idAttribute]
        )
      )
    }
    const incoming = this._normalize(arr)
    this.merge({ incoming, reverse })
  }

  _basicMergeStrategy (incoming, reverse = false) {
    const entities = {
      ...this.property.entities,
      ...incoming.property.entities
    }

    const ids = combineTwoArrays(
      this.property.ids,
      incoming.property.ids,
      reverse
    )

    return {
      entities: {
        ...this.property.entities,
        ...incoming.property.entities
      }
      ids: [...new Set(ids)]
    }  
  }

  _customMergeStrategy (cb) {
    return cb(property = this.property)
  }

  merge ({ incoming, mergeStrategy, reverse = false }) {
    if (
      mergeStrategy &&
      typeof mergeStrategy === 'function'
    ) {
      this.property = this._customMergeStrategy(mergeStrategy)
    } else {
      this.property = this._basicMergeStrategy(incoming, reverse)
    }
    return this
  }

  // avoid modifying stored data while manipulating property
  avoid (options) {
    this.avoidOptions = {
      ...this.avoidOptions,
      ...options
    }
    return this
  }

  get (ids = []) {
    if (!ids.length) return []
    this._reproduce()
    return this.data
  }

  unshift (arr = []) {
    if (arr.length) {
      this._insertStrategy(arr, 'unshift', true)
      return this._reproduce()
    }
    return this
  }

  append (arr = []) {
    if (arr.length) {
      this._insertStrategy(arr, 'unshift')
      return this._reproduce()
    }
    return this
  }

  // Only update data and not change the order of the ids
  update (arr = []) {

  }

  remove (ids = []) {

  }

  clearAll () {
    this.property = {
      ...this.property,
      ids: [],
      entities: {}
    }

    return this
  }

  restore () {

  }

  get keys () {
    return this.data.keys
  }

  get values () {
    return this.data.values
  }

  get size () {
    return this.data.keys.length
  }

  get length () {
    return this.data.keys.length
  }

  get first () {
    return this.data.values[0]
  }

  get last () {
    return this.data.values[this.size - 1]
  }
}