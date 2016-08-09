import 'angular';
import 'angular-route';
import { IAppOptions, IJoystickOptions } from './IAppOptions';

let app = angular.module('app', ['ngRoute']);

// the app config settings
app.value('appOptions', <IAppOptions>{
    joystickOptions: null
});

app.config(['$routeProvider', '$locationProvider', ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: '/app/main/main.html',
            controller: 'mainCtrl',
            controllerAs: 'ctrl'
        })
        .when('/config', {
            templateUrl: '/app/config/config.html',
            controller: 'configCtrl',
            controllerAs: 'ctrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    // use the hashbang mode
    $locationProvider.html5Mode(false);
}])
.run(['APP_CONFIG', 'appOptions', (config, appOptions: IAppOptions) => {
    // set up appOptions using config
    let joystickOptions = <IJoystickOptions>config.joystick;
    appOptions.joystickOptions = joystickOptions;
}]);
