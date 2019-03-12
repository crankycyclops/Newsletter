<?php
/**
 * @category  Crankycyclops
 * @package   Crankycyclops_Newsletter
 * @author    James Colannino
 * @copyright Copyright (c) 2019 James Colannino
 * @license   https://opensource.org/licenses/OSL-3.0 OSL v3
 */

namespace Crankycyclops\Newsletter\Controller\Subscriber;

use Magento\Customer\Api\AccountManagementInterface as CustomerAccountManagement;
use Magento\Customer\Model\Session;
use Magento\Customer\Model\Url as CustomerUrl;
use Magento\Framework\App\Action\Context;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Newsletter\Model\SubscriberFactory;

// Replaces the original new suscriber action, which requires a full page reload,
// with an AJAX version.
class Newajax extends \Magento\Newsletter\Controller\Subscriber\NewAction {

	/** @var \Magento\Framework\Controller\Result\JsonFactory */
	protected $jsonResultFactory;

	public function __construct(
		Context $context,
		SubscriberFactory $subscriberFactory,
		Session $customerSession,
		StoreManagerInterface $storeManager,
		CustomerUrl $customerUrl,
		CustomerAccountManagement $customerAccountManagement,
		\Magento\Framework\Controller\Result\JsonFactory $jsonResultFactory
	) {
		parent::__construct(
			$context,
			$subscriberFactory,
			$customerSession,
			$storeManager,
			$customerUrl,
			$customerAccountManagement
		);
		$this->jsonResultFactory = $jsonResultFactory;
	}

	/**
	 * New subscription action (AJAX version.) This is mostly identical (i.e.
	 * copy-paste) from Magento\Newsletter\Controller\Subscriber\NewAction with
	 * the exception that I send JSON back to the frontend instead of
	 * redirecting with a message.
	 *
	 * @return \Magento\Framework\Controller\Result\Json
	 */
	public function execute() {

		$result = $this->jsonResultFactory->create();

		if ($this->getRequest()->isPost() && $this->getRequest()->getPost('email')) {

			$message = '';
			$email = (string)$this->getRequest()->getPost('email');

			try {

				$success = false;

				$this->validateEmailFormat($email);
				$this->validateGuestSubscription();
				$this->validateEmailAvailable($email);

				$subscriber = $this->_subscriberFactory->create()->loadByEmail($email);
				if (
					$subscriber->getId()
					&& $subscriber->getSubscriberStatus() == \Magento\Newsletter\Model\Subscriber::STATUS_SUBSCRIBED
				) {
					$message = __('This email address is already subscribed.');
				}

				$status = $this->_subscriberFactory->create()->subscribe($email);
				if ($status == \Magento\Newsletter\Model\Subscriber::STATUS_NOT_ACTIVE) {
					$message = __('A confirmation request has been sent to your email.');
				} else {
					$message = __('Thank you for your subscription.');
					$success = true;
				}
			}

			catch (\Magento\Framework\Exception\LocalizedException $e) {
				$message = $e->getMessage();
			}

			catch (\Exception $e) {
				$message = __('Something went wrong with the subscription. Please try again.');
			}

			$result->setData(['message' => $message, 'success' => $success]);
		}

		else {
			$result->setData([]);
			$result->setHttpResponseCode(\Magento\Framework\Webapi\Exception::HTTP_NOT_FOUND);
		}

		return $result;
	}
}

