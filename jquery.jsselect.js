/*\
 *  --------------------------------
 *  jQuery JS Select Plugin
 *  --------------------------------
 *  + Plugin boilerplate derived from work by @ajpiano and @addyosmani
 *  + This plugin written by Ben Duncan.
\*/

;(function ($, window, document, undefined) {
	var pluginName = 'jsSelect';

	function Plugin(element, options) {
		this.element = element;
		this.shown = false;
		this._name = pluginName;
		this.init();
		$(this.element).hide();
	}

	Plugin.prototype.init = function() {
		var newSelect,
			newOptions = '<ul class="jsSelectOpts">',
			self = this,
			$el = $(this.element);

		newSelect = '<div class="jsselect">';
		$el.find('option').each(function() {
			var classes = this.className;
			if ($(this).is(':selected')) {
				classes += ' selected';
				newOptions = '<div class="showSelect">' + this.innerHTML + '</div>' + newOptions;
			}
			newOptions += '<li class="jsSelectOpt ' + classes + '" data-value="' + this.value + '">' + this.innerHTML + '</li>';
		});
		newSelect += newOptions + '</ul></div>';

		self.$newEl = $(newSelect);
		self.$opts = self.$newEl.find('.jsSelectOpts');
		self.$current = self.$newEl.find('.selected');
		self.$newEl.attr('tabindex', 0)
			.bind('blur', function() {
				self.hide();
			}).bind('keydown', function(e) {
				if (e.which === 37 /*LEFT*/ || e.which === 38 /*UP*/) self.select('previous');
				else if (e.which === 39 /*RIGHT*/ || e.which === 40 /*DOWN*/) self.select('next');
				else self.hide();
			}).delegate('div.showSelect', 'click', function() {
				if (!self.shown) self.show();
				else self.hide();
			});
		self.$opts.delegate('li.jsSelectOpt', 'activate', function() {
				self.select($(this));
			}).delegate('li.jsSelectOpt', 'click', function() {
				$(this).trigger('activate');
				self.hide();
			});
		$el.before(self.$newEl);
	};

	Plugin.prototype.select = function($dest) {
		if (typeof $dest !== 'string') {
			this.$current = $dest;
		} else if ($dest === 'previous') {
			if (this.$opts.find('>li').first().hasClass('selected')) return false;
			this.$current = this.$newEl.find('.selected').prev();
		} else if ($dest === 'next') {
			if (this.$opts.find('>li').last().hasClass('selected')) return false;
			this.$current = this.$newEl.find('.selected').next();
		}
		var val = this.$current.attr('data-value');
		this.renderChoice(val);
		$(this.element).val(val).trigger('change');
	};

	Plugin.prototype.renderChoice = function(value) {
		var newDisplay = this.$newEl.find('.selected').removeClass('selected')
			.end().find('[data-value="'+value+'"]').addClass('selected').html();

		this.$newEl.find('>div').html(newDisplay);
	};

	Plugin.prototype.show = function() {
		this.shown = true;
		this.$opts.slideDown('fast');
	};

	Plugin.prototype.hide = function() {
		this.shown = false;
		this.$opts.slideUp('fast');
	};

	$.fn[pluginName] = function (options) {
		return $(this).each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
				new Plugin( this, options ));
			}
		});
	};
}(jQuery, window, document));