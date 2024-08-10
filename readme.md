wtbx-react-atom
===

> 極簡 react18+ 原子狀態管理

# 快速開始

```typescript jsx
import { watom } from 'wtbx-react-atom'

// 申明原子狀態
const countAtom = watom<number>(0)
// 可以使用 get => T 的方式申明，get 方法傳入其他的原子將達成派生效果
const doubleCountAtom = watom<number>(get => get(countAtom) * 2)

// 返回的為暫停函數，若寫在 useEffect 中可以直接 return countAtom.watch(...)
const stop = countAtom.watch((before, after) => {
  // 可以看到 doubleCountAtom 的值也是跟隨著 after 變化的
  console.log(`[countAtom watch] before: ${before}, after: ${after}, doubleCount: ${doubleCountAtom.value}`)
  
  if (after > 10) {
    alert('已經加超過 10，將取消監聽')
    stop()
    return
  }
  
  if (after % 3 === 0) {
    alert('每到 3 的倍數我就出現一次')
  } 
})

function DefaultCount() {
  // 若不想監聽變化可以使用 .value 取值
  return <div>不監聽變化的 count: {countAtom.value}</div>
}

function CountButton() {
  // 若要在組件中追蹤狀態變化可以使用 .use 以 hook 的方式取出
  // 因為是 hook，得照 react hook 的規則在組件頂部使用
  const count = countAtom.use()

  function onIncrease() {
    // 可以使用以下兩種方式來更新值，類似 react 的 setState
    countAtom(e => e + 1)
    // countAtom(countAtom.value + 1)
  }
  
  return (
    <div>
      <button onClick={onIncrease}>count: {count}</button>
    </div>
  )
}

function DoubleCount() {
  const doubleCount = doubleCountAtom.use()
  
  return (
    <div>doubleCount: {doubleCount}</div>
  )
}

export function Counter() {
  return (
    <>
      <DefaultCount />
      <DoubleCount />
      <CountButton />
    </>
  )
}
```

# API

- `watom(T)` **返回 Proxy(下做 p)** 申明一個原子狀態
- `watom((get: (atom: Atom<T>) => T) => T)` **返回 Proxy(下做 p)** 使用 get 取得其他原子的值並關聯變化
- `p`
  - `p(T)` **返回 void** 以傳入的值替換將原本的值
  - `p((before: T) => T)` **返回 void** 以函數的方式將返的的值替換將原本的值
  - `.use()` **返回 T** 為在組件取值並監聽值變化而重新渲染組件
  - `.value` **返回 T** 取出當前值(其實實現裡沒判斷是否為 value key，只是類型強寫得而已)
  - `.watch(listener: (before: T, after: T) => void)` **返回 () => void** 監聽數據變化，返回的函數為暫停
