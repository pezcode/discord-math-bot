'use strict'

const nano = require('nano')
const { URL } = require('url')

class Document {
  constructor (doc) {
    this.id = doc._id
    this.rev = doc._rev
    this._content = doc
  }

  // use _content to get the document with _id and _rev

  get content () {
    let clean = Object.assign({}, this._content)
    delete clean._id
    delete clean._rev
    return clean
  }

  set content (clean) {
    this._content = Object.assign({}, clean)
    this._content._id = this.id
    this._content._rev = this.rev
  }
}

class Store {
  constructor () {
    // TODO https for secure cross-domain access to DB
    let url = new URL(process.env.DB_HOST)
    url.username = process.env.DB_USER
    url.password = process.env.DB_PASS
    url.pathname = '/' + process.env.DB_NAME
    this.db = nano(url.href)
  }

  load (id, callback) {
    this.db.get(id, (err, body) => {
      let content
      if (err) {
        content = { _id: id }
        if (err.error === 'not_found') {
          console.log('No document with this id')
        } else {
          console.error(err)
        }
      } else {
        content = body
      }
      callback(new Document(content))
    })
  }

  save (id, doc) {
    this.db.insert(doc._content, doc.id, (err, body) => {
      if (err) {
        console.error(err)
      }
    })
  }

  delete (id) {
    this.db.get(id, (err, body) => {
      if (!err) {
        this.db.destroy(body._id, body._rev, (err, body) => {
          if (err) {
            console.error(err)
          }
        })
      } else {
        console.error(err)
      }
    })
  }
}

module.exports = Store
