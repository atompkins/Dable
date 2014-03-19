define(['text!../templates/navbar.html', 'mustache', 'jquery', 'bootstrap'],
	function(navbar, mustache, $) {
	
		function loadCss(url) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
		
		var examples = [
			{ name: 'Alternating', url: 'Alternating' },
			{ name: 'Bootstrap Style', url: 'BootstrapStyle' },
			{ name: 'Default', url: 'Default' },
			{ name: 'Deleting And Adding Rows', url: 'DeletingAndAddingRows' },
			{ name: 'From Table', url: 'FromTable' },
			{ name: 'From Table With Class', url: 'FromTableWithClass' },
			{ name: 'JQueryUI Style', url: 'JQueryUIStyle' },
			{ name: 'Large Data', url: 'LargeData' },
			{ name: 'Paging', url: 'Paging' },
			{ name: 'Paging Tester', url: 'PagingTester' }
		];
		var page = window.location.pathname.substr(1);
		page = page.substr(0, page.indexOf('.'));
		var navBarData = mustache.render(navbar, { examples: examples, faq: (page == 'faq'), dropdown: (page && page != '/') });
		var results = { navbar: navBarData };
		
		$(document).ready(function() {
			//LOAD CSS
			loadCss('css/bootstrap.min.css');
			loadCss('css/site.css');
			loadCss('css/toastr.min.css');
			
			//Render Body Template
			var template = $('body').html();
			$('body').html(mustache.render(template,results));
			
			//refresh scrollspy from Bootstrap
			$('[data-spy="scroll"]').each(function () {
				var $spy = $(this).scrollspy('refresh');
			});
		});
});