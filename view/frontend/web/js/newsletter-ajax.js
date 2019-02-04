/**
 * @category  Crankycyclops
 * @package   Crankycyclops_Newsletter
 * @author    James Colannino
 * @copyright Copyright (c) 2019 James Colannino
 * @license   https://opensource.org/licenses/OSL-3.0 OSL v3
 */

define([
    'jquery',
	'jquery/ui'
], function ($) {

	'use strict';

	return function (config, elements) {

		$(elements).find('form').submit(function (e) {

			if ($(this).validation('isValid')) {
				alert('TODO: subscribe ' + $(this).find('[name="email"]').val());
			}

			// Suppress the original form submission since we're doing an AJAX
			// request instead.
			e.preventDefault();
		});
	};
});

