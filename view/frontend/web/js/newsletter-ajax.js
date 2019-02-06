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

		// Enable the subscription input and submission elements once an AJAX
		// subscription request is complete (or there was an error.)
		function enableSubscription() {

			$(elements).find('input[type="email"]').attr('disabled', false);
			$(elements).find('.action.subscribe').attr('disabled', false);
			$(elements).find('.newsletter-status').remove();
		}

		// Disable the subscription input and submission elements while submitting
		// an AJAX subscription request.
		function disableSubscription() {

			$(elements).find('input[type="email"]').attr('disabled', true);
			$(elements).find('.action.subscribe').attr('disabled', true);
			$(elements).find('.content').append('<div class="newsletter-status">Subscribing&nbsp;&nbsp;&nbsp;<img src="' + config.loadingImgUrl + '" /></div>');
		}

		let popup = $('#newsletter-status-modal').modal({
			modalClass: 'newsletter-status-modal',
			buttons: {}
		});

		$('#newsletter-status-modal .continue-shopping').on('click', function (e) {
			popup.modal('closeModal');
		});

		$(elements).find('form').submit(function (e) {

			disableSubscription();

			if ($(this).validation('isValid')) {

				$.post(
					'/newsletter/subscriber/newajax',
					{email: $(this).find('[name="email"]').val()},
					function (response) {
						$('#newsletter-status-modal').find('.content').text(response.message);
						enableSubscription();
						popup.modal('openModal');
					}
				).fail(
					function (response) {
						$('#newsletter-status-modal').find('.content').text('An error occurred while trying to subscribe. Please try again.');
						enableSubscription();
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

