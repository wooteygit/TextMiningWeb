
var app = angular.module("TextMining", ['ui.router', 'ngRoute', 'ngDialog', 'ngMaterial', 'ui.grid', 'ui.grid.selection'
, 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.grouping', 'ui.grid.pagination', 'ui.grid.autoResize']);

app.config(function($stateProvider, $urlRouterProvider, $routeProvider, $qProvider, $httpProvider) {
  $qProvider.errorOnUnhandledRejections(false);
  $urlRouterProvider.otherwise(
    function($injector, $location) {
      $location.path('/homepage');
    }
  );

  $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'index.html',
      controller: 'main'
  }).state('homepage', {
    url: '/homepage',
    views: {
      'homepage': {
        templateUrl: 'templates/home.html',
        controller: 'main'
      }
    }
  }).state('KmeansAll', {
    url: '/KmeansAll',
    views: {
      'KmeansAll': {
        templateUrl: 'templates/menulist/KmeansAll.html',
        controller: 'kmeans'
      },
      'blackToHome': {
        templateUrl: 'templates/menubar/blackToHome.html',
        controller: 'kmeans'
      }
    }
  }).state('SvmAll', {
    url: '/SvmAll',
    views: {
      'SvmAll': {
        templateUrl: 'templates/menulist/SvmAll.html',
        controller: 'SvmAll'
      },
      'blackToHome': {
        templateUrl: 'templates/menubar/blackToHome.html',
        controller: 'SvmAll'
      }
    }
  }).state('BestSvmAll', {
    url: '/BestSvmAll',
    views: {
      'BestSvmAll': {
        templateUrl: 'templates/menulist/BestSvmAll.html',
        controller: 'BestSvmAll'
      },
      'blackToHome': {
        templateUrl: 'templates/menubar/blackToHome.html',
        controller: 'BestSvmAll'
      }
    }
  }).state('ClusterKmeans', {
    url: '/ClusterKmeans',
    views: {
      'ClusterKmeans': {
        templateUrl: 'templates/ClusterKmeans.html',
        controller: 'kmeans'
      },
      'MenuClusterKmeans': {
        templateUrl: 'templates/menubar/MenuClusterKmeans.html',
        controller: 'kmeans'
      }
    },
  }).state('ScoreAns', {
    url: '/ScoreAns',
    views: {
      'ScoreAns': {
        templateUrl: 'templates/ScoreAns.html',
        controller: 'scoreans'
      },
      'MenuScoreAns': {
        templateUrl: 'templates/menubar/MenuScoreAns.html',
        controller: 'scoreans'
      }
    },
  }).state('TestSVM', {
    url: '/TestSVM',
    views: {
      'TestSVM': {
        templateUrl: 'templates/TestSVM.html',
        controller: 'TestSVM'
      },
      'MenuTestSVM': {
        templateUrl: 'templates/menubar/MenuTestSVM.html',
        controller: 'TestSVM'
      }
    },
  }).state('WriterTrainTest', {
    url: '/WriterTrainTest',
    views: {
      'WriterTrainTest': {
        templateUrl: 'templates/WriterTrainTest.html',
        controller: 'WriterTrainTest'
      },
      'MenuWriterTrainTest': {
        templateUrl: 'templates/menubar/MenuWriterTrainTest.html',
        controller: 'WriterTrainTest'
      }
    },
  }).state('SetAll', {
    url: '/SetAll',
    views: {
      'SetAll': {
        templateUrl: 'templates/menulist/SetAll.html',
        controller: 'SetAll'
      },
      'blackToHome': {
        templateUrl: 'templates/menubar/blackToHome.html',
        controller: 'SetAll'
      }
    }
  }).state('SetConn', {
    url: '/SetConn',
    views: {
      'SetConn': {
        templateUrl: 'templates/SetConn.html',
        controller: 'SetConn'
      },
      'blackToHome': {
        templateUrl: 'templates/menubar/MenuSetConn.html',
        controller: 'SetConn'
      }
    }
  }).state('SaveModel', {
    url: '/SaveModel',
    views: {
      'SaveModel': {
        templateUrl: 'templates/SaveModel.html',
        controller: 'saveModel'
      },
      'MenuSaveModel': {
        templateUrl: 'templates/menubar/MenuSaveModel.html',
        controller: 'saveModel'
      }
    }
  }).state('LoadModel', {
    url: '/LoadModel',
    views: {
      'LoadModel': {
        templateUrl: 'templates/LoadModel.html',
        controller: 'LoadModel'
      },
      'MenuLoadModel': {
        templateUrl: 'templates/menubar/MenuLoadModel.html',
        controller: 'LoadModel'
      }
    }
  }).state('setSubject', {
    url: '/setSubject',
    views: {
      'setSubject': {
        templateUrl: 'templates/setSubject.html',
        controller: 'setSubject'
      },
      'MenuSetSubject': {
        templateUrl: 'templates/menubar/MenuSetSubject.html',
        controller: 'setSubject'
      }
    }
  }).state('LoadScoreFromFile', {
    url: '/LoadScoreFromFile',
    views: {
      'LoadScoreFromFile': {
        templateUrl: 'templates/LoadScoreFromFile.html',
        controller: 'LoadScoreFromFile'
      },
      'MenuLoadScoreFromFile': {
        templateUrl: 'templates/menubar/MenuLoadScoreFromFile.html',
        controller: 'LoadScoreFromFile'
      }
    }
  });
});

// app.run(function($rootScope, $templateCache) {
//    $rootScope.$on('$viewContentLoaded', function() {
//       $templateCache.removeAll();
//    });
// });

