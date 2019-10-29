/**
 * @category  Crankycyclops
 * @package   Crankycyclops_Newsletter
 * @author    James Colannino
 * @copyright Copyright (c) 2019 James Colannino
 * @license   https://opensource.org/licenses/OSL-3.0 OSL v3
 */

define([
    'jquery',
	'jquery-ui-modules/dialog'
], function ($) {

	'use strict';

	return {

		// Enable the subscription input and submission elements once an AJAX
		// subscription request is complete (or there was an error.)
		enableSubscription: function () {

			$(this.elements).find('input[type="email"]').attr('disabled', false);
			$(this.elements).find('.action.subscribe').attr('disabled', false);
			$(this.elements).find('.newsletter-status').remove();
		},

		// Disable the subscription input and submission elements while submitting
		// an AJAX subscription request.
		disableSubscription: function () {

			$(this.elements).find('input[type="email"]').attr('disabled', true);
			$(this.elements).find('.action.subscribe').attr('disabled', true);
			$(this.elements).find('.content').append('<div class="newsletter-status">Subscribing&nbsp;&nbsp;&nbsp;<img src="' + this.config.loadingImgUrl + '" /></div>');
		},

		// Called after a successful post (doesn't necessarily mean the user was
		// successfully subscribed.)
		postSuccess: function (response) {

			$('#newsletter-status-modal').find('.content').text(response.message);
			this.enableSubscription();
			$(this.elements).find('[name="email"]').val('');
			this.popup.modal('openModal');
		},

		// An error occurred during the post request.
		postError: function (response) {

			$('#newsletter-status-modal').find('.content').text('An error occurred while trying to subscribe. Please try again.');
			this.enableSubscription();
			this.popup.modal('openModal');
		},

		// Called when the user clicks the "Subscribe" button.
		subscribeAction: function (e) {

			var that = this;
			this.disableSubscription();

			$.post(
				'/newsletter/subscriber/newajax',
				{email: $(this.elements).find('[name="email"]').val()},
				function (response) {
					that.postSuccess(response);
				}
			).fail(
				function (response) {
					that.postError(response);
				}
			);
		},

		// Initialization method
		newsletterAjax: function (config, elements) {

			var that = this;

			this.config = config;
			this.elements = elements;

			this.popup = $('#newsletter-status-modal').modal({
				modalClass: 'newsletter-status-modal',
				buttons: {}
			});

			$('#newsletter-status-modal .continue-shopping').on('click', function (e) {
				that.popup.modal('closeModal');
			});

			$(elements).find('form').submit(function (e) {

				if ($(this).validation('isValid')) {
					that.subscribeAction(e);
				}

				// Suppress the original form submission since we're doing an AJAX
				// request instead.
				e.preventDefault();
			});
		}
	};
});

