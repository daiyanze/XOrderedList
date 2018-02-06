import {
  combineTwoArrays,
  removeProperties
} from './utils'

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

  _avoidStrategy (arr, option) {
    if (this.avoidOptions[option].length) {
      arr = arr.filter(a =>
        const id = option === 'remove'
          ? a
          : a[this.property.idAttribute] 
        return this.avoidOptions[option].includes(id)
      )
    }
    return arr
  }

  _insertStrategy (arr, option, reverse = false) {
    arr = this._avoidStrategy(arr, option)
    const incoming = this._normalize(arr)
    return this.merge({ incoming, reverse })
  }

  _mergeStrategy (incoming, reverse = false) {
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

  merge ({ incoming, cb, reverse = false }) {
    if (cb && typeof cb === 'function') {
      this.property = {
        ...this.property,
        cb(incoming, this.property)
      }
    } else {
      this.property = {
        ...this.property,
        this._mergeStrategy(incoming, reverse)
      }
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
      this._reproduce()
    }

    return this
  }

  append (arr = []) {
    if (arr.length) {
      this._insertStrategy(arr, 'unshift')
      this._reproduce()
    }

    return this
  }

  // Only update data and not change the order of the ids
  update (arr = []) {
    if (arr.length) { 
      arr = this._avoidStrategy(arr)
      const incoming = this._normalize(arr)
      this.property = {
        ...this.property,
        entities: incoming.entities
      }
      this._reproduce()
    }

    return this
  }

  remove (ids = []) {
    if (ids.length) {
      ids = this._avoidStrategy(ids)
      this.property.entities = removeProperties(ids, this.property.entities)
      this.property.ids = this.property.ids.filter(id => !ids.includes(id))
      this._reproduce()
    }

    return this
  }

  clearAll () {
    this.property = {
      ...this.property,
      ids: [],
      entities: {}
    }

    return this
  }

  get keys () {
    return this.data.keys
  }

  get size () {
    return this.data.length
  }

  get first () {
    return this.data[0]
  }

  get last () {
    return this.data[this.length - 1]
  }
}