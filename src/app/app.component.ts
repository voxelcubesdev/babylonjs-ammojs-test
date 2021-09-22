import { Component } from '@angular/core';
import { GameEngine } from './game-engine';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(private gameEngine: GameEngine) {}

	ngAfterViewInit(): void {
		this.gameEngine.createScene();
		this.gameEngine.update();
	}

	ngOnDestroy(): void {
		this.gameEngine.destroy();
	}
}
