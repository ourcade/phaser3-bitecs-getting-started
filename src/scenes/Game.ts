import Phaser from 'phaser'
import {
	createWorld,
	addEntity,
	addComponent,
} from 'bitecs'

import type {
	IWorld,
	System
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Sprite from '../components/Sprite'
import Rotation from '../components/Rotation'
import Player from '../components/Player'
import CPU from '../components/CPU'
import Input from '../components/Input'

import createMovementSystem from '../systems/movement'
import createSpriteSystem from '../systems/sprite'
import createPlayerSystem from '../systems/player'
import createCPUSystem from '../systems/cpu'

enum Textures
{
	TankBlue,
	TankGreen,
	TankRed
}

export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	private world!: IWorld
	private playerSystem!: System
	private cpuSystem!: System
	private movementSystem!: System
	private spriteSystem!: System

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	preload()
    {
        this.load.image('tank-blue', 'assets/tank_blue.png')
		this.load.image('tank-green', 'assets/tank_green.png')
		this.load.image('tank-red', 'assets/tank_red.png')
    }

    create()
    {
		const { width, height } = this.scale

        this.world = createWorld()

		// create the player tank
		const blueTank = addEntity(this.world)

		addComponent(this.world, Position, blueTank)
		addComponent(this.world, Velocity, blueTank)
		addComponent(this.world, Rotation, blueTank)
		addComponent(this.world, Sprite, blueTank)
		addComponent(this.world, Player, blueTank)
		addComponent(this.world, Input, blueTank)

		Position.x[blueTank] = 100
		Position.y[blueTank] = 100
		Sprite.texture[blueTank] = Textures.TankBlue
		Input.speed[blueTank] = 10

		// create random cpu tanks
		for (let i = 0; i < 10; ++i)
		{
			const tank = addEntity(this.world)

			addComponent(this.world, Position, tank)
			Position.x[tank] = Phaser.Math.Between(width * 0.25, width * 0.75)
			Position.y[tank] = Phaser.Math.Between(height * 0.25, height * 0.75)

			addComponent(this.world, Velocity, tank)
			addComponent(this.world, Rotation, tank)
			
			addComponent(this.world, Sprite, tank)
			Sprite.texture[tank] = Phaser.Math.Between(1, 2)

			addComponent(this.world, CPU, tank)
			CPU.timeBetweenActions[tank] = Phaser.Math.Between(0, 500)

			addComponent(this.world, Input, tank)
			Input.speed[tank] = 10
		}

		// create the systems
		this.playerSystem = createPlayerSystem(this.cursors)
		this.cpuSystem = createCPUSystem(this)
		this.movementSystem = createMovementSystem()
		this.spriteSystem = createSpriteSystem(this, ['tank-blue', 'tank-green', 'tank-red'])
    }

	update(t: number, dt: number) {
		// run each system in desired order
		this.playerSystem(this.world)
		this.cpuSystem(this.world)

		this.movementSystem(this.world)

		this.spriteSystem(this.world)
	}
}
