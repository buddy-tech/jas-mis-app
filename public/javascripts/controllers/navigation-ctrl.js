/**
 * Created by matjames007 on 4/30/15.
 */
angular.module('jasmic.controllers')
/**
 * navigationCtrl is intended to provide quick page changes and should appear on
 * all screens.
 */
    .controller('NavigationCtrl', ['$scope', '$location', 'UserProfileFactory', 'UserSessionDestroyFactory',
        function ($scope, $location, UserProfileFactory, UserSessionDestroyFactory) {
            $scope.add_clicked = false;

            /**
             * Used to display the user currently active in the
             * session.
             */
            UserProfileFactory.show(function(user) {
                $scope.loggedUser = user;
            }, function(fail) {
                console.log(fail);
            });

            /**
             * Go to another section of the angular application
             * @param l
             */
            $scope.goTo = function(l) {
                $location.url('/' + l);
            };
            $scope.addNewButtonClick = function() {
                $scope.add_clicked=!$scope.add_clicked;
            };

            $scope.logout = function() {
                UserSessionDestroyFactory.killSession(function(res) {
                    window.location = "/login";
                });
            };

        }]);