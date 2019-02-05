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

		let popup = $('#newsletter-status-modal').modal({
			modalClass: 'newsletter-status-modal',
			buttons: {}
		});

		$('#newsletter-status-modal .continue-shopping').on('click', function (e) {
			popup.modal('closeModal');
		});

		$(elements).find('form').submit(function (e) {

			if ($(this).validation('isValid')) {

				$.post(
					'/newsletter/subscriber/newajax',
					{email: $(this).find('[name="email"]').val()},
					function (response) {
						$('#newsletter-status-modal').find('.content').text(response.message);
						popup.modal('openModal');
					}
				).fail(
					function (response) {
						$('#newsletter-status-modal').find('.content').text('An error occurred while trying to subscribe. Please try again.');
						popup.modal('openModal');
					}
				);
			}

			// Suppress the original form submission since we're doing an AJAX
			// request instead.
			e.preventDefault();
		});
	};
});

