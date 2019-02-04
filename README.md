A Magento 2 module that improves on the original Magento_Newsletter module. In particular, this replaces the original subscription method, which requires a full page reload, with an AJAX request that will allow the user to stay on the page without a reload.

To install:

```
mkdir -p /path/to/store/thirdparty/Crankycyclops
cd /path/to/store/thirdparty/Crankycyclops
git clone git@github.com:crankycyclops/Newsletter.git
ln -s /path/to/store/app/code/Crankycyclops /path/to/store/thirdparty/Crankycyclops
php bin/magento module:enable Crankycyclops_Newsletter
php bin/magento setup:upgrade
```

Make sure to clear your cache, and also to run di:compile if you're in production mode.

TODO: composer package coming soon!
