import * as angular from 'angular';
import { Joystick, IJoystickApi } from './Joystick';
import { IJoystickOptions } from '../IAppOptions';
import { directive } from '../../decorators/directive';
import '../app';

interface IJoystickFactory {
    create: (options: IJoystickOptions, api: IJoystickApi, element: angular.IAugmentedJQuery) => Joystick
}

export function joystickFactory(): IJoystickFactory {
    return {
        create: (options, api, element) => {
            return new Joystick(options, api, element[0]);
        }
    };
}

interface IJoystickDirectiveScope extends angular.IScope {
    api: IJoystickApi,
    options: IJoystickOptions
}

@directive()
export class JoystickDirective implements angular.IDirective {
    public template: string = '<div class="joystick"></div>';
    public restrict: string = 'E';
    public replace: boolean = true;
    public scope: Object = {
        options: '<',
        api: '<'
    };

    public link: Function = (scope: IJoystickDirectiveScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void => {
        this.joystickFactory.create(scope.options, scope.api, element);
    };

    constructor(private joystickFactory: IJoystickFactory) {
    }
}

angular.module('app')
    .factory('joystickFactory', [joystickFactory])
    .directive('joystick', ['joystickFactory', JoystickDirective]);
