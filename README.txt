=== CookieX Consent Management Platform ===
Contributors: cookiexcmp
Tags: Cookie Consent, privacy, DPDPA, Privacy compliance, PDPL
Tested up to: 6.7
Stable tag: 1.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Cookiex is a robust cookie consent management platform (CMP) designed to simplify compliance with privacy regulations such as DPDPA, GDPR, and CCPA.

== Description ==

Cookiex CMP empowers website owners to easily implement privacy compliance solutions. With Cookiex, you can:

* Manage cookie consent in accordance with global privacy laws, including DPDPA, GDPR, and CCPA.
* Provide a customizable cookie banner to ensure user consent.
* Generate detailed audit trails and privacy scan reports to demonstrate compliance.
* Automatically block non-essential cookies until consent is obtained.
* Integrate seamlessly with your existing tech stack for effortless compliance management.

**Key Features:**
* **Customizable Cookie Banner:** Tailor the look and feel of your cookie banner to match your brand.
* **Privacy Scans:** Perform automated scans to identify cookies and trackers used on your website.
* **Granular Consent Management:** Enable users to select specific types of cookies they wish to allow.
* **Compliance Dashboard:** Monitor and manage compliance data from an intuitive dashboard.
* **Multi-language Support:** Cater to users across different geographies with multi-language capabilities.

Cookiex CMP simplifies compliance and builds user trust, ensuring a seamless experience for both you and your website visitors.

== Installation ==

To install and activate Cookiex CMP plugin:

1. Download the Cookiex CMP plugin.
2. Upload the plugin files to the `/wp-content/plugins/` directory or install directly through the WordPress plugin repository.
3. Activate the plugin through the 'Plugins' menu in WordPress.
4. Configure your preferences and settings through the Cookiex CMP dashboard in the WordPress admin panel.

== Frequently Asked Questions ==

= What is Cookiex CMP? =
Cookiex CMP is a comprehensive solution for managing cookie consent and compliance with global privacy regulations.

= How does Cookiex block non-essential cookies? =
Cookiex automatically scans your site and blocks non-essential cookies until user consent is obtained via the cookie banner.

= Does Cookiex support multi-language websites? =
Yes, Cookiex CMP offers multi-language support to cater to users from various regions.

= Where can I contribute to the plugin? =

All development for this plugin is handled via GitHub. Any issues or pull requests should be submitted to our [GitHub repository](https://github.com/cookiex-io/wp-client). Please read our [contributing guidelines](CONTRIBUTING.md) before submitting contributions.

= What development standards does the plugin follow? =

The plugin follows WordPress Coding Standards and uses several quality assurance tools:
* PHPStan for static analysis
* PHPCS for coding standards enforcement
* ESLint for JavaScript/TypeScript linting

= How can I report issues or suggest improvements? =

If you encounter any issues or have suggestions for improvements, please:
1. Check if the issue already exists in our GitHub issue tracker
2. If not, create a new issue with detailed information about the problem or suggestion
3. For bugs, include steps to reproduce, expected behavior, and actual behavior
4. For feature requests, explain the use case and potential benefits

= How can I set up the development environment? =

1. Clone the repository
2. Install dependencies using `composer install` and `npm install`
3. For admin interface development with hot reloading, use `npm run development`
4. Follow the setup instructions in CONTRIBUTING.md for detailed steps

= Does the plugin need to pass all checks before contributing? =

Yes, all contributions should pass:
* PHPStan analysis
* PHPCS checks
* ESLint validation
* All automated tests
* WordPress Plugin Check requirements

This ensures high code quality and maintains compatibility with WordPress standards.

== External Services ==

This plugin connects to CookieX's services (cookiex.io) to provide cookie consent management functionality. The following external connections are made:

1. Cookie Banner Script
- What: The plugin loads the CookieX banner script from CookieX's CDN
- When: The script is loaded when your website pages are accessed
- URL: https://cdn.cookiex.io/banner/cookiex.min.js
- Purpose: To display and manage the cookie consent banner

2. CookieX API Integration
- What: The plugin communicates with CookieX's API to manage cookie preferences and compliance settings
- When: During configuration and when visitors interact with the cookie consent banner
- Data sent: 
  * Domain ID
  * Selected language
  * Cookie preferences
  * GTM configuration (if enabled)
  * Domain name
- Purpose: To manage cookie consent preferences and ensure compliance with privacy regulations

3. CookieX Registration Portal
- What: Links to CookieX's registration page
- When: When users click the "Sign Up" button in the plugin's dashboard
- URL: https://app.cookiex.io/register
- Purpose: To allow users to create a CookieX account for accessing additional features and managing their cookie consent settings

For more information about how CookieX handles your data:
* Terms of Service: https://cookiex.io/terms
* Privacy Policy: https://cookiex.io/privacy

== Changelog ==

= 1.0.2 =
* Fixed the flaws and irregular practices as reported by the wordpress plugin review team

= 1.0.1 =
* Now using wordpress assigned plugin name: cookiex-consent-management-platform

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.2 =
Upgrade to the latest version for enhanced performance, usability improvements, and bug fixes.
