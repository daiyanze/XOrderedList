class Modelizr extends Map {
  
  constructor(arrOfObj, idAttr = 'id') {
    super();
    this.data = this.convertIntoOrderedMap(arrOfObj);
    this.idAttr = idAttr;
  }

  convertIntoOrderedMap(arrOfObj) {
    const data = arrOfObj.map(a => [a[this.idAttr], a]);
    return new Map(data);
  }

  get values() {
    return Array.from(this.data.values());
  }
  
  get keys() {
    return Array.from(this.data.keys());
  }
  
  get size() {
    return this.data.size;
  }
  
  get length() {
    return this.size;
  }
  
  get first() {
    return this.values[0];
  }
  
  get last() {
    return thks.values[this.size - 1];
  }
  
  unshift(arrOfObj) {
    this.data = this.convertIntoOrderedMap(arrOfObj.concat(this.values));
    return this;
  }
  
  push(arrOfObj) {
    this.data = this.convertIntoOrderedMap(this.values.concat(arrOfObj));
    return this;
  }
  
  update(arrOfObj) {
    for (const a of arrOfObj) {
      if (this.data.get(a[this.idAttr])) {
        this.data.set(a[this.idAttr], a);
      }
    }
    return this;
  }
  
  remove(arrOfNum) {
    if (!arrOfNum) {
      this.data.clear();
    } else {
      for (const id of arrOfNum) {
        this.data.delete(id);
      }
    }
    return this;
  }
  
  mutateBy(cb) {
    if (cb) {
      const data = cb(this);
      if (data.length) {
        this.data = this.convertIntoOrderedMap(data); 
      }
    }
    return this;
  }
}