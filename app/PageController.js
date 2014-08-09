angular.module("app", [])
    .controller("PageController", ['$scope', '$http',
        function ($scope, $http) {

            $scope.setSeq = 1;
            $scope.setDoubleIt = 10;
            $scope.serial = false;

            var clear = function clear() {
                $scope.doubleIt = "";
                $scope.content = "";
                $scope.timestamp = "";
                $scope.seq = "";
            };
            clear();

            $scope.fetchData = function fetchData() {

                if ($scope.serial) {
                    serial();
                }
                else {
                    independent();
                }
            };

            var fetch = function fetch(url, value, f) {
                $http({
                    method: "GET",
                    url: url,
                    params: {
                        n: value
                    }})
                    .success(function (data) {
                        f(data.result);
                    })
                    .error(function (data, status, headers, config, status_text) {
                        console.log("fail <br>" + status + "<br>" + headers() + "<br>" + config + "<br>" + status_text);
                    });
            };

            var independent = function independent() {
                clear();
                $scope.status = "spinning up";
                fetch("http://localhost:3000", $scope.setDoubleIt, function (v) {
                    $scope.doubleIt = v;
                });
                fetch("http://localhost:3001", 7, function (v) {
                    $scope.content = v;
                });
                fetch("http://localhost:3002", 9, function (v) {
                    $scope.timestamp = v;
                });
                fetch("http://localhost:3003", $scope.setSeq, function (v) {
                    $scope.seq = v;
                });
                $scope.status = "all in-flight";
            };

            var serial = function serial() {
                clear();
                $scope.status = "spinning up";
                fetch("http://localhost:3003", $scope.setSeq, function (v) {
                    $scope.seq = v;
                    fetch("http://localhost:3002", 9, function (v) {
                        $scope.timestamp = v;
                        fetch("http://localhost:3001", 7, function (v) {
                            $scope.content = v;
                            fetch("http://localhost:3000", $scope.setDoubleIt, function (v) {
                                $scope.doubleIt = v;
                                $scope.status = "Completed"
                            });
                        });
                    });
                });
            };

        }])
;