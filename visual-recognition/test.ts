import * as V3 from './v3'

const v = new V3({
  version: '1'
})

v.classify({ return_response: false }).then((res) => res)
