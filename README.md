# XOrderedList
[![Build Status](https://travis-ci.org/daiyanze/XOrderedList.svg?branch=master)](https://travis-ci.org/daiyanze/XOrderedList)
[![npm version](https://badge.fury.io/js/xorderedlist.svg)](https://badge.fury.io/js/xorderedlist)

A useful tool to manage array of object.


### Introduction
Sometimes it would be a headache to maintain and to manipulate an array of object. ListStore is just a `Map` wrapper Object that enhances the original `Map` object. It looks like a small "database" which will help you manage arrays in a rather comfortable way.

### How to use it

install
```
npm install xorderedlist
```

example
```javascript
import OrderedList from 'xorderedlist'

const list = new OrderedList([{ id: 1, name: 'one' }])
console.log(list.size) // 1

list.push([{ id: 2, name: 'two' }])

list.unshift([{ id: 0, name: 'zero' }])

list.update([{ id: 1, name: 'update one'}])

list.delete([2])

list.findOne(0)

list.findList([1, 2])

list.mutate((orderedList) => {
  return orderedList.values.map(v => {
    v.name = 'mutate ' + v.name
  })
})
```

### APIs 
##### Properties
| Name          | Type              | default   |
| ------------- |:----------------- |:----------|
| data          | Map               | []        |
| idAttr        | String            | 'id'      |
| values        | Array             | []        |
| keys          | Array             | []        |
| size          | number            | []        |
| length        | number            | []        |
| first         | Object/undefined  | undefined |
| last          | Object/undefined  | undefined |

##### Methods
| Name          | argument           | return | description  |
| ------------- |:-------------------|:-------|:-------------|
| findOne       | id: Any            | Object | Same to Map.get. Query one result from list |
| findList      | idList: Array      | Object | Query results |
| unshift       | arrOfObject: Array | this   | Add data to the start of list |
| push          | arrOfObject: Array | this   | Add data at the end of list |
| update        | arrOfObject: Array | this   | Update the given data |
| delete        | idList: Array      | this   | Delete data by the given id list |
| mutate        | callback: Function, argument: Object | Array | change the data by your own method. Support one extra argument |

### License
MIT
