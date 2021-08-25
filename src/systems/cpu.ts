import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
} from 'bitecs'

import CPU from '../components/CPU'
import Velocity from '../components/Velocity'
import Rotation from '../components/Rotation'
import Input, { Direction} from '../components/Input'

export default function createCPUSystem(scene: Phaser.Scene) {
	const cpuQuery = defineQuery([CPU, Velocity, Rotation, Input])

	return defineSystem((world) => {
		const entities = cpuQuery(world)
		
		const dt = scene.game.loop.delta
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]
			
			CPU.accumulatedTime[id] += dt

			if (CPU.accumulatedTime[id] < CPU.timeBetweenActions[id])
			{
				continue
			}

			CPU.accumulatedTime[id] = 0

			switch (Phaser.Math.Between(0, 20))
			{
				// left
				case 0:
				{
					Input.direction[id] = Direction.Left
					break
				}

				// right
				case 1:
				{
					Input.direction[id] = Direction.Right
					break					
				}

				// up
				case 2:
				{
					Input.direction[id] = Direction.Up
					break
				}

				// down
				case 3:
				{
					Input.direction[id] = Direction.Down
					break
				}

				default:
				{
					Input.direction[id] = Direction.None
					break
				}
			}
		}
	
		return world
	})
}
