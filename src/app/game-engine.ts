import { Injectable, NgZone } from '@angular/core';
import {
	Scene,
	Engine,
	Vector3,
	Color4,
	AmmoJSPlugin,
	ArcRotateCamera,
	HemisphericLight,
	MeshBuilder,
	PhysicsImpostor,
} from 'babylonjs';
// import * as Ammo from 'ammo.js';

@Injectable()
export class GameEngine {
	public engine: any = null;
	public canvas: any = null;
	public scene: any = null;
	public rollingAverage = null;

	private static CANVAS_NAME = 'renderCanvas';

	constructor(private ngZone: NgZone) {}

	protected resizeCanvas(): void {
		if (this.canvas) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}

	protected resizeEngine(): void {
		this.resizeCanvas();
		this.engine.resize();
	}

	protected addPhysicsToScene(scene: Scene): void {
		/*
		Ammo().then((ammo: any) => {
			scene.enablePhysics(new Vector3(0, -9.81, 0), new AmmoJSPlugin(true, ammo));
		});
		*/
	}

	public createScene(): void {
		this.canvas = document.getElementById(GameEngine.CANVAS_NAME) as HTMLCanvasElement;
		this.resizeCanvas();

		this.engine = new Engine(this.canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true,
		});

		this.scene = new Scene(this.engine);
		this.scene.clearColor = new Color4(44 / 255, 122 / 255, 239 / 255, 1);
		this.addPhysicsToScene(this.scene);

		const camera = new ArcRotateCamera('Camera', 0, 1.2, 15, new Vector3(0, 0, 0), this.scene);
		camera.wheelPrecision = 150;

		// This attaches the camera to the canvas
		camera.attachControl(this.canvas, true);

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;

		// Our built-in 'sphere' shape.
		const sphere = MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: 2, segments: 32 },
			this.scene
		);
		sphere.physicsImpostor = new PhysicsImpostor(
			sphere,
			PhysicsImpostor.BoxImpostor,
			{
				mass: 1,
				friction: 0.1,
				restitution: 0.1,
			},
			this.scene
		);

		// Move the sphere upward 1/2 its height
		sphere.position.y = 5;

		// Our built-in 'ground' shape.
		const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, this.scene);
		ground.physicsImpostor = new PhysicsImpostor(
			ground,
			PhysicsImpostor.BoxImpostor,
			{
				mass: 0,
				friction: 0.1,
				restitution: 0.1,
			},
			this.scene
		);

		// this.scene.registerBeforeRender(() => {});
	}

	protected renderLoop(): void {
		if (this.scene) {
			this.scene.render();
		}
	}

	public update(): void {
		this.ngZone.runOutsideAngular(() => {
			this.engine.runRenderLoop(this.renderLoop.bind(this));
		});
		window.addEventListener('resize', this.resizeEngine.bind(this));
	}

	public destroy(): void {
		window.removeEventListener('resize', this.resizeEngine.bind(this));
		this.canvas = null;
		if (this.engine) {
			this.engine.dispose();
		}
	}
}
