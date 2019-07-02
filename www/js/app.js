angular.module("amaya_tower", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","amaya_tower.controllers", "amaya_tower.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Amaya Tower" ;
		$rootScope.appLogo = "data/images/background/logo(2).png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = true ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_menu = false ;
		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_about_us = false ;
		$rootScope.hide_menu_account = false ;
		$rootScope.hide_menu_profile = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "amaya_tower",
				storeName : "amaya_tower",
				description : "The offline datastore for Amaya Tower app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/amaya_tower/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("95a516ed-2cc5-44dc-a307-898e4705417c").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("amaya_tower.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("amaya_tower",{
		url: "/amaya_tower",
			abstract: true,
			templateUrl: "templates/amaya_tower-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("amaya_tower.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("amaya_tower.files", {
		url: "/files",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-files.html",
						controller: "filesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.floor_plan", {
		url: "/floor_plan",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-floor_plan.html",
						controller: "floor_planCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.form_login", {
		url: "/form_login",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-form_login.html",
						controller: "form_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.form_user", {
		url: "/form_user",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-form_user.html",
						controller: "form_userCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.images", {
		url: "/images",
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-images.html",
						controller: "imagesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.language", {
		url: "/language",
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.menu_1", {
		url: "/menu_1",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-menu_1.html",
						controller: "menu_1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.profile", {
		url: "/profile",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.sitestackplan", {
		url: "/sitestackplan",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-sitestackplan.html",
						controller: "sitestackplanCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.sunday_school", {
		url: "/sunday_school",
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-sunday_school.html",
						controller: "sunday_schoolCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.video", {
		url: "/video",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-video.html",
						controller: "videoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.video_singles", {
		url: "/video_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-video_singles.html",
						controller: "video_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("amaya_tower.welcome", {
		url: "/welcome",
		cache:false,
		views: {
			"amaya_tower-side_menus" : {
						templateUrl:"templates/amaya_tower-welcome.html",
						controller: "welcomeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/amaya_tower/dashboard");
});
