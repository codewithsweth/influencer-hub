export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Influencer Hub, you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to these terms, please do not
              use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              Influencer Hub is a platform that allows YouTube content creators (influencers) to
              connect their channels and share analytics with brands. The service displays channel
              statistics, video performance data, and audience demographics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p className="mb-2">As a user, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your YouTube account</li>
              <li>Only connect YouTube channels that you own or have authorization to connect</li>
              <li>Comply with YouTube's Terms of Service</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Usage and Privacy</h2>
            <p>
              When you connect your YouTube channel, your analytics data will be made publicly
              viewable to brands using our platform. Please review our Privacy Policy for detailed
              information about how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. YouTube Terms of Service</h2>
            <p>
              By using Influencer Hub, you also agree to be bound by{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                YouTube's Terms of Service
              </a>
              . Our service uses YouTube API Services to access your channel data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Revoking Access</h2>
            <p>
              You can revoke Influencer Hub's access to your YouTube data at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Clicking the "Disconnect" button in the app</li>
              <li>
                Visiting the{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Google security settings page
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of Influencer Hub are owned by us and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" and "as available" without warranties of any kind,
              either express or implied. We do not guarantee that the service will be uninterrupted,
              secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              In no event shall Influencer Hub be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or inability to use
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our service immediately,
              without prior notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes by posting the new terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:support@yourdomain.com" className="text-red-600 hover:underline">
                support@yourdomain.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
