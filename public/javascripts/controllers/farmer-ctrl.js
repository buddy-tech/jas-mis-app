/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic.controllers')
    .controller('FarmerListingCtrl', ['$scope', '$routeParams', 'FarmersFactory',
        function ($scope, $routeParams, FarmersFactory) {
            $scope.farmers = FarmersFactory.query($routeParams);
        }
    ]);