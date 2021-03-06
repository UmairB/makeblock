import * as angular from "angular";
import "angular-route";
import { IAppOptions } from "./IAppOptions";

let app = angular.module("app", ["ngRoute"]);

// the app config settings
app.value("appOptions", <IAppOptions>{
    joystickOptions: <any>{ motor: null, servo: null },
    camera: <any>null
});

app.config(["$routeProvider", "$locationProvider", ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
    $routeProvider
        .when("/", {
            templateUrl: "/app/main/main.html",
            controller: "mainCtrl",
            controllerAs: "ctrl"
        })
        .when("/config", {
            templateUrl: "/app/config/config.html",
            controller: "configCtrl",
            controllerAs: "ctrl"
        })
        .otherwise({
            redirectTo: "/"
        });

    // use the hashbang mode
    $locationProvider.html5Mode(false);
}])
.run(["APP_CONFIG", "appOptions", (config, appOptions: IAppOptions) => {
    // set up appOptions using config
    let joystickOptions = config.joystick;
    appOptions.joystickOptions.motor = joystickOptions.motor;
    appOptions.joystickOptions.servo = joystickOptions.servo;
    appOptions.camera = config.camera;
}]);
