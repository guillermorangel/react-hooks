// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// function Greeting({initialName = ''}) {
//   // 🐨 initialize the state to the value from localStorage
//   // 💰 window.localStorage.getItem('name') ?? initialName

//   const [name, setName] = React.useState(() => window.localStorage.getItem('name') ?? initialName)

//   // 🐨 Here's where you'll use `React.useEffect`.
//   // The callback should set the `name` in localStorage.
//   // 💰 window.localStorage.setItem('name', name)

//   React.useEffect(() => {
//     window.localStorage.setItem('name', name)
//   }, [name])

//   function handleChange(event) {
//     setName(event.target.value)
//   }
//   return (
//     <div>
//       <form>
//         <label htmlFor="name">Name: </label>
//         <input value={name} onChange={handleChange} id="name" />
//       </form>
//       {name ? <strong>Hello {name}</strong> : 'Please type your name'}
//     </div>
//   )
// }

// extra custom hook

// const useLocalStorageState = function(key, defaultValue = '') {
//   const [state, setState] = React.useState(() => window.localStorage.getItem(key) ?? defaultValue)

//   React.useEffect(() => {
//     window.localStorage.setItem(key, JSON.stringify(state))
//   }, [key, state])

//   return [state, setState]
// }

// extra custom hook with any data

const useLocalStorageState = function(key, defaultValue = '', {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {

  const [state, setState] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key)
    if (localStorageValue) return deserialize(localStorageValue)

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) window.localStorage.removeItem(prevKey)
    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}


function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='George'/>
}

export default App
