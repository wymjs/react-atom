import { ChangeTimes } from './change-times.tsx'
import { atom } from '@wymjs/react-atom'
import { useState } from 'react'

const countAtom = atom<number>(0)
const doubleCountAtom = atom(get => get(countAtom) * 2)

const stop = countAtom.watch((before, after) => {
	console.log(
		`[$count watch] before: ${before}, after: ${after}, doubleCount: ${doubleCountAtom.value}`,
	)
	if (after === 0) {
		alert('countAtom 已經歸 0，清除監聽器(watch)')
		stop()
	}
})

function Count() {
	const count = countAtom.use()

	return (
		<span>
			{count}
			<ChangeTimes />
		</span>
	)
}

function DoubleCount() {
	const doubleCount = doubleCountAtom.use()

	return (
		<span>
			(x2 = {doubleCount}
			<ChangeTimes />)
		</span>
	)
}

function IncBtn() {
	return <button onClick={() => countAtom(e => e + 1)}>+1</button>
}

function SubBtn() {
	return <button onClick={() => countAtom(countAtom.value - 1)}>-1</button>
}

function ResetBtn() {
	return <button onClick={() => countAtom(0)}>歸 0</button>
}

export function BaseSample() {
	const [isShowCount, setIsShowCount] = useState(true)
	const [isShowDoubleCount, setIsShowDoubleCount] = useState(true)

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<h5 style={{ margin: '0 0 8px', textAlign: 'center' }}>
				<div>基本計數器範例</div>
				<div>(components/base-sample.tsx)</div>
			</h5>

			{isShowCount && <Count />}
			{isShowDoubleCount && <DoubleCount />}

			<hr />
			<div style={{ display: 'flex' }}>
				<button onClick={() => setIsShowCount(e => !e)}>
					{isShowCount ? '隱藏' : '顯示'} count
				</button>
				<button onClick={() => setIsShowDoubleCount(e => !e)}>
					{isShowDoubleCount ? '隱藏' : '顯示'} doubleCount
				</button>
			</div>
			<hr />

			<div style={{ display: 'flex' }}>
				<ChangeTimes />
				<div style={{ width: 8 }} />
				<SubBtn />
				<div style={{ width: 8 }} />
				<ResetBtn />
				<div style={{ width: 8 }} />
				<IncBtn />
			</div>
		</div>
	)
}
