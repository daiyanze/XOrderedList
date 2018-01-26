import { groupBy, deepAttribute } from './utils.js'

class Model {
  props = {
    entities: {},
    idAttribute: 'id',
    ids: [],
    name: 'default_model'
  }

  // Avoid changing props by putting entities ids into whiteList
  whiteList = { add: [], removal: [] }

  constructor(args) {
    const { name = 'default_model', idAttribute = 'id', data } = args
    this.props.name = name
    this.props.idAttribute = idAttribute
    if (data) {
      this.addEntities(data)
    }
  }

  addEntities(listOfObj = [], old = false) {
    const res = this._normalize(listOfObj.filter(d => this._avoidStrategy(d.id, 'add')))
    this.merge(res, (prev, res) => this._basicMergeStrategy(prev, res, old))
    return this
  }

  removeEntities(list = []) {
    const { ids } = this.props
    const filteredIds = ids.filter(id => list.indexOf(id) < 0)
    if (filteredIds.length === ids.length) return this
    const res = this._reproduce(filteredIds.filter(id => this._avoidStrategy(id, 'removal')))
    this.merge(res, (prev, res) => ({ entities: res.props.entities, ids: res.props.ids }))
    return this
  }

  resetEntities(list = []) {
    const res = this._reproduce(list)
    this.merge(res, (prev, res) => ({ entities: res.props.entities, ids: res.props.ids }))
    return this
  }

  avoidEntities(list = [], on = null) {
    // on : 'add' or 'removal'
    // Avoid changing entities while updating props
    this.whiteList[on] = list
    return this
  }

  _avoidStrategy(id, mode) {
    // all modes are 'add' or 'removal' or 'both' ['add', 'removal', 'both']
    if (mode && this.whiteList[mode] && this.whiteList[mode].length > 0) {
      return this.whiteList[mode].indexOf(id) < 0
    }
    return true
  }

  clearAll() {
    this.props = { ...this.props, ids: [], entities: {} }
    return this
  }

  merge(target, cb) {
    // target needs to have the same property type of 'props'
    this._mergeStrategy(this, target, cb)
    return this
  }

  _mergeStrategy(prev, next, cb) {
    // cb's return should contain { entities, ids }
    if (cb) {
      this.props = { ...this.props, ...cb(prev, next) }
    } else {
      this._basicMergeStrategy(prev, next)
    }
    return this
  }

  _basicMergeStrategy(prev, next, reverse = false) {
    this.props.entities = { ...prev.props.entities, ...next.props.entities }
    this.props.ids = reverse
      ? [...new Set([...prev.props.ids, ...next.props.ids])]
      : [...new Set([...next.props.ids, ...prev.props.ids])]
    return { entities: this.props.entities, ids: this.props.ids }
  }

  _normalize(listOfObj) {
    const nm = listOfObj.reduce((group, item) => {
      const id = item[this.props.idAttribute]
      if (group.ids.indexOf(id) < 0) {
        group.ids.push(id)
        group.entities[id] = item
      }
      return group
    }, { ids: [], entities: {} })
    return { props: { ...this.props, ids: nm.ids, entities: nm.entities } }
  }

  _denormalize(list = this.props.ids) {
    return list.map(id => this.props.entities[id])
  }

  _reproduce(list = this.props.ids) {
    return this._normalize(this._denormalize(list))
  }
}

class Modelizr extends Model {
  data = { keys: [], values: [] }
  result = []

  constructor(args) {
    super(args)
    this.restore()
  }

  get keys() {
    return this.data.keys
  }

  get values() {
    return this.data.values
  }

  get size() {
    return this.data.keys.length
  }

  get first() {
    return this.data.values[0]
  }

  get last() {
    return this.data.values[this.size - 1]
  }

  find(list = []) {
    if (typeof list !== 'object') return null
    if (list.length < 1) return null
    return this._denormalize(list)
  }

  findOne(id) {
    if (this.props.ids.indexOf(id) < 0) return null
    return this.props.entities[id]
  }

  filterBy({ cond = {}, cb, override = false }) {
    // e.g. cond = { id: { list: [1], exclude: false }, timestamp: { list: ['2017-01-01', '2017-02-02'], exclude: true } }
    const res = cb && typeof cb === 'function'
      ? cb(this.data.values, cond)
      : this.data.values.filter(
        d => Object.keys(cond).every(
          e => cond[e].list.length > 0
          ? (cond[e].exclude
            ? cond[e].list.every(f => f !== d[e])
            : cond[e].list.some(f => f === d[e]))
          : true
        )
      )
    if (override && typeof override === 'boolean') {
      this.data = this._keysValues(res)
    }
    this.result = res
    return this
  }

  groupBy({ index = [], cb, override = false }) {
    // { location : { address1: "some place interesting" } }
    // needs to be written into deeply nested `index` like this ['location', 'address1']
    const res = cb && typeof cb === 'function'
      ? cb(this.data.values, index)
      : groupBy(this.data.values, index)
    if (override && typeof override === 'boolean') {
      this.data = this._keysValues(res)
    }
    this.result = res
    return this
  }

  sortBy({ index = [], cb, override = false }) {
    // the way to use `index` is the same to groupBy
    const res = cb && typeof cb === 'function'
      ? cb(this.data.values, index)
      : this.data.values.sort((a, b) => deepAttribute(b, index) - deepAttribute(a, index))
    if (override && typeof override === 'boolean') {
      this.data = this._keysValues(res)
    }
    this.result = res
    return this
  }

  restore() {
    this.data = this._generate()
    return this
  }

  _generate() {
    if (this.props.ids.length < 1) return this._keysValues()
    const res = this._denormalize()
    return this._keysValues(res)
  }

  _keysValues(res = {}) {
    const keys = Object.keys(res)
    const values = keys.length > 0 ? Object.values(res) : []
    return { keys, values }
  }
}

export default Modelizr
