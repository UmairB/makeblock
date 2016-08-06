import * as angular from 'angular';
import { Joystick, IJoystickApi } from './Joystick';
import { IAppOptions } from '../IAppOptions';
import { directive } from '../../decorators/directive';
import '../app';

interface IJoystickFactory {
    create: (api: IJoystickApi, element: angular.IAugmentedJQuery) => Joystick
}

export function joystickFactory(appOptions: IAppOptions): IJoystickFactory {
    return {
        create: (api, element) => {
            return new Joystick(appOptions.joystickOptions, api, element[0]);
        }
    };
}

interface IJoystickDirectiveScope extends angular.IScope {
    api: IJoystickApi
}

@directive('joystickFactory')
export class JoystickDirective implements angular.IDirective {
    public template: string = '<div class="joystick"></div>';
    public restrict: string = 'E';
    public replace: boolean = true;
    public scope: Object = {
        api: '<'
    };

    public link: Function = (scope: IJoystickDirectiveScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void => {
        this.joystickFactory.create(scope.api, element);
    };

    constructor(private joystickFactory: IJoystickFactory) {
    }
}

angular.module('app')
    .factory('joystickFactory', ['appOptions', joystickFactory])
    .directive('joystick', ['joystickFactory', JoystickDirective]);
