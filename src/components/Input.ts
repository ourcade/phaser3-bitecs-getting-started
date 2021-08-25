import { defineComponent, Types } from 'bitecs'

export const Input = defineComponent({
	direction: Types.ui8,
	speed: Types.ui8
})

export enum Direction
{
	None,
	Left,
	Right,
	Up,
	Down
}

export default Input