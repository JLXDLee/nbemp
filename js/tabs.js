/**
  * tabs jQuery Plugin
  * Author: Jin Lixiang
  * Version: 1.0
  * 插件配置
  * tabContainer: tab容器
  * tabEvent:触发事件名
  * onStyle:菜单选中样式名
  * tabLayout:布局,'ttb'上下布局,'ltr'左右布局
  * tabTitle:ul的class,'ttb'上下布局为'tab_title','ltr'左右布局为'tab_ltr_title'
  * defaultTab: 默认打开第几个
  */
;(function($) {
	var defaults = {
		tabContainer: '.tabs_container',
		tabEvent: 'click',
		onStyle: 'tabs_current_tab',
		tabLayout: 'ttb',
		tabTitle: 'tab_title',
		defaultTab: 1
	};
	$.fn.tabs = function(options) {
		opts = $.extend({}, defaults, options);
		var _ct = '<div class="tabs_content"></div>';
		return this.each(function(index) {
			$(this).addClass("tabs_container");
			var tabLayout = opts.tabLayout;
			if(tabLayout == 'ltr'){
				opts.tabTitle = 'tab_ltr_title';
				$("ul", this).addClass('tab_ltr_title').after(_ct);
				$(".tabs_content", this).css('margin-left',$("ul", this).width());
			} else {
				_ct = '<div class="tabs_clear"></div>' + _ct;
				$("ul", this).addClass('tab_title').after(_ct);
//				$(this).find(".tabs_content").addClass("tabs_clear")
			}
			var container = $(this);
			var li = container.find("." + opts.tabTitle + ">li");
			setDefaultTab(container, li, tabLayout);
		});
		
		//设置默认显示的tab
		function setDefaultTab(container, li, tabLayout) {
			var defaultTab = opts.defaultTab;
			defaultTab = defaultTab > li.length ? 　1 : defaultTab;
			li.removeClass(opts.onStyle);
			li.eq(defaultTab - 1).addClass(opts.onStyle);
			loadContent(container, tabLayout);
			tabEvent(container, li);
		}
		
		//加载tab内容
		function loadContent(container, tabLayout) {
			var url = container.find("." + opts.onStyle).attr("tabs_url");
			var calback = container.find("." + opts.onStyle).attr("tabs_calback");
			var con = container.find(".tabs_content");
			container.find(".tabs_content").load(url, function() {
				if(tabLayout == 'ltr'){
					var h1 = $(".tabs_content", container).height();
					var h2 = $(".tab_ltr_title", container).height();
					container.height(h1 > h2 ? h1 : h2);
				}
				if (calback) eval(calback);
			});
		}
		
		//添加tab事件，加载对应tab内容
		function tabEvent(container, li) {
			li.each(function() {
				var _self = this;
				_self.addEventListener(opts.tabEvent, function() {
					li.removeClass(opts.onStyle);
					$(_self).addClass(opts.onStyle);
					loadContent(container);
				}, false);
			});
		}
	}
})(jQuery);
