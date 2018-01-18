'use strict'

const nano = require('nano')
const { URL } = require('url')

class Store {
  constructor () {
    let url = new URL(process.env.DB_HOST)
    url.username = process.env.DB_USER
    url.password = process.env.DB_PASS
    url.pathname = '/' + process.env.DB_NAME
    this.db = nano(url.href)
  }

  load (key, callback, reviver) {
    this.db.get(key, (err, body) => {
      if (err) {
        if (err.error === 'not_found') {
          this.db.insert({}, key, (err, body) => {
            if (!err) {
              callback(null, new Store.Document({
                _id: body.id,
                _rev: body.rev
              }))
            } else {
              callback(err, null)
              console.error(err)
            }
          })
        } else {
          callback(err, null)
          console.error(err)
        }
      } else {
        if (reviver) { // deserialize custom types
          for (const property in body) {
            body[property] = reviver(property, body[property])
          }
        }
        callback(null, new Store.Document(body))
      }
    })
  }

  save (key, doc) {
    this.db.insert(doc.raw, (err, body) => {
      if (err) {
        console.error(err)
      } else {
        doc.raw._rev = body.rev
      }
    })
  }

  delete (key) {
    this.db.get(key, (err, body) => {
      if (!err) {
        this.db.destroy(body._id, body._rev, (err, body) => {
          if (err) {
            console.error(err)
          }
        })
      } else if (err.error !== 'not_found') {
        console.error(err)
      }
    })
  }
}

Store.Document = class {
  constructor (doc) {
    this.raw = doc
  }

  // use raw to get the document with _id and _rev
  get content () {
    let clean = Object.assign({}, this.raw)
    delete clean._id
    delete clean._rev
    return clean
  }

  set content (clean) {
    this.raw = Object.assign({ _id: this.raw._id, _rev: this.raw._rev }, clean)
  }
}

module.exports = Store
