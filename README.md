# STORM: Simplified Transaction & Optimized Relational Mappings

* An enhanced alternative to Redux

Example

```webpack.config.js
module.exports = {
    ...
  resolve: {
    alias: {
      '😈': path.resolve(__dirname, 'client/utils/store.js'),
    }
  }
}
```

```item.js
import store from '😈'

const Item = ({  }) => {

    const { app } = store()

    return <div>
        <button onClick={()=>store.actionFoo.bar({something:""})}>
            click me
        </button>
    </div>
})
```