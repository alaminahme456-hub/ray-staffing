'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { ChevronRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

function LegalHero({ title, breadcrumb }: { title: string; breadcrumb: string }) {
  const navigate = useAppStore((s) => s.navigate)
  return (
    <section className="bg-[#0B1D33] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.nav variants={fadeInUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
            <ChevronRight className="size-4" />
            <span className="text-white">{breadcrumb}</span>
          </motion.nav>
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white">{title}</motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-400 text-sm mt-3">Last updated: 1 January 2025</motion.p>
        </motion.div>
      </div>
    </section>
  )
}

const sectionClass = 'py-16 lg:py-24'
const contentClass = 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
const heading2 = 'text-2xl sm:text-3xl font-bold text-[#0B1D33] mb-4 mt-10 first:mt-0'
const heading3 = 'text-lg font-semibold text-[#0B1D33] mb-2 mt-8'
const para = 'text-[#5A6B7F] leading-relaxed mb-4'
const listClass = 'text-[#5A6B7F] leading-relaxed mb-4 space-y-2 ml-4 list-disc [&_li]:pl-2'

// ─── PRIVACY PAGE ───────────────────────────────────────────
export function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <LegalHero title="Privacy Policy" breadcrumb="Privacy Policy" />

      <section className={sectionClass}>
        <div className={contentClass}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className={para}>
              RAY Staffing Consulting Ltd (&ldquo;RAY&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (the &ldquo;Platform&rdquo;) and use our services, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>1. Information We Collect</motion.h2>

            <motion.h3 variants={fadeInUp} className={heading3}>Personal Information You Provide</motion.h3>
            <motion.p variants={fadeInUp} className={para}>
              We collect personal information that you voluntarily provide to us when you:
            </motion.p>
            <ul className={listClass}>
              <li>Register for an account (employer, job seeker, or tenant)</li>
              <li>Complete application forms or enquiry forms</li>
              <li>Upload documents such as CVs, certificates, or identification</li>
              <li>Communicate with us via email, phone, or the Platform messaging system</li>
              <li>Subscribe to job alerts or newsletters</li>
              <li>Participate in surveys or provide feedback</li>
            </ul>
            <motion.p variants={fadeInUp} className={para}>
              This may include your name, email address, phone number, postal address, date of birth, nationality, employment history, qualifications, right to work documentation, and other information relevant to the services you are using.
            </motion.p>

            <motion.h3 variants={fadeInUp} className={heading3}>Information Collected Automatically</motion.h3>
            <motion.p variants={fadeInUp} className={para}>
              When you use the Platform, we automatically collect certain information, including:
            </motion.p>
            <ul className={listClass}>
              <li>Device information (browser type, operating system, device identifiers)</li>
              <li>IP address and general geographic location</li>
              <li>Pages visited, time spent on pages, and navigation paths</li>
              <li>Referral source and search terms used to find the Platform</li>
              <li>Cookies and similar technologies (see our Cookie Policy)</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>2. How We Use Your Information</motion.h2>
            <motion.p variants={fadeInUp} className={para}>We use your personal information for the following lawful purposes:</motion.p>
            <ul className={listClass}>
              <li><strong>Service delivery:</strong> To provide housing management, HR consultancy, recruitment, and staffing services you have requested.</li>
              <li><strong>Recruitment:</strong> To match candidates with vacancies, process applications, and communicate with employers and job seekers.</li>
              <li><strong>Compliance:</strong> To conduct right to work checks, DBS checks, professional registration verification, and other compliance activities required by law or regulation.</li>
              <li><strong>Communication:</strong> To respond to your enquiries, provide customer support, and send service-related notifications.</li>
              <li><strong>Platform improvement:</strong> To analyse usage patterns, improve our services, and enhance user experience.</li>
              <li><strong>Marketing:</strong> With your consent, to send you information about our services, job alerts, and industry news. You can withdraw consent at any time.</li>
              <li><strong>Legal obligations:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>3. Legal Basis for Processing</motion.h2>
            <motion.p variants={fadeInUp} className={para}>We rely on the following legal bases under UK GDPR to process your personal information:</motion.p>
            <ul className={listClass}>
              <li><strong>Consent:</strong> Where you have given clear, affirmative consent for specific processing activities.</li>
              <li><strong>Contractual necessity:</strong> Where processing is necessary for the performance of a contract with you, or to take steps at your request before entering into a contract.</li>
              <li><strong>Legitimate interests:</strong> Where processing is necessary for our legitimate business interests, provided such interests are not overridden by your rights and freedoms.</li>
              <li><strong>Legal obligation:</strong> Where processing is necessary for compliance with a legal obligation to which we are subject.</li>
              <li><strong>Vital interests:</strong> Where processing is necessary to protect the vital interests of an individual.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>4. Data Sharing and Disclosure</motion.h2>
            <motion.p variants={fadeInUp} className={para}>We may share your personal information with:</motion.p>
            <ul className={listClass}>
              <li><strong>Employers and hirers:</strong> When you are a job seeker and have applied for or been placed in a role, we share relevant information with the prospective or current employer.</li>
              <li><strong>Housing providers:</strong> When you are a tenant, we share relevant information with the housing provider managing your property.</li>
              <li><strong>Third-party service providers:</strong> Companies that assist us in operating the Platform, providing services, or performing functions on our behalf (e.g., hosting providers, payment processors, compliance check providers).</li>
              <li><strong>Regulatory bodies:</strong> Where required by law or to comply with regulatory obligations (e.g., the Care Quality Commission, the Information Commissioner&rsquo;s Office).</li>
              <li><strong>Professional advisors:</strong> Solicitors, accountants, and other professional advisors as reasonably necessary.</li>
            </ul>
            <motion.p variants={fadeInUp} className={para}>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>5. Data Retention</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Specific retention periods depend on the nature of the data and the applicable legal requirements. For example, recruitment records may be retained for up to 12 months after the recruitment process concludes, and compliance documentation may be retained for up to 6 years after the end of a placement.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>6. Your Rights</motion.h2>
            <motion.p variants={fadeInUp} className={para}>Under UK GDPR, you have the following rights regarding your personal data:</motion.p>
            <ul className={listClass}>
              <li><strong>Right of access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification:</strong> You can request correction of inaccurate or incomplete personal data.</li>
              <li><strong>Right to erasure:</strong> You can request deletion of your personal data in certain circumstances.</li>
              <li><strong>Right to restriction of processing:</strong> You can request that we limit how we use your data.</li>
              <li><strong>Right to data portability:</strong> You can request your data in a structured, commonly used format.</li>
              <li><strong>Right to object:</strong> You can object to certain types of processing, including direct marketing.</li>
              <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you can withdraw consent at any time.</li>
            </ul>
            <motion.p variants={fadeInUp} className={para}>
              To exercise any of these rights, please contact us at privacy@raystaffing.co.uk. We will respond to your request within one month. We may need to verify your identity before processing your request.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>7. Data Security</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include encryption, access controls, secure hosting environments, and regular security assessments. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>8. Children&rsquo;s Privacy</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child under 18, we will take steps to delete that information promptly.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>9. Changes to This Policy</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>10. Contact Us</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </motion.p>
            <motion.p variants={fadeInUp} className={`${para} not-italic`}>
              <strong>RAY Staffing Consulting Ltd</strong><br />
              Email: privacy@raystaffing.co.uk<br />
              Address: London, England, United Kingdom<br />
              Data Protection Officer: privacy@raystaffing.co.uk
            </motion.p>
            <motion.p variants={fadeInUp} className={para}>
              If you are not satisfied with our response to a data protection concern, you have the right to lodge a complaint with the Information Commissioner&rsquo;s Office (ICO) at ico.org.uk.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// ─── COOKIE PAGE ────────────────────────────────────────────
export function CookiePage() {
  return (
    <main className="min-h-screen">
      <LegalHero title="Cookie Policy" breadcrumb="Cookie Policy" />

      <section className={sectionClass}>
        <div className={contentClass}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className={para}>
              This Cookie Policy explains how RAY Staffing Consulting Ltd (&ldquo;RAY&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar technologies when you visit our Platform. This policy should be read alongside our Privacy Policy, which provides further details on how we handle personal data.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>1. What Are Cookies?</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, to provide a better user experience, and to supply information to the owners of the site. Cookies can be &ldquo;persistent&rdquo; (remaining on your device until they expire or you delete them) or &ldquo;session&rdquo; (deleted when you close your browser).
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>2. How We Use Cookies</motion.h2>
            <motion.p variants={fadeInUp} className={para}>We use cookies for the following purposes:</motion.p>
            <ul className={listClass}>
              <li><strong>Essential cookies:</strong> These are necessary for the Platform to function properly. They enable core functionality such as security, network management, account authentication, and accessibility. You cannot opt out of these cookies as the Platform cannot function without them.</li>
              <li><strong>Functionality cookies:</strong> These allow the Platform to remember choices you make (such as language preferences or region) and provide enhanced, personalised features.</li>
              <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with the Platform by collecting and reporting information anonymously. This helps us improve the Platform and the services we offer.</li>
              <li><strong>Marketing cookies:</strong> These may be used to track visitors across websites and display relevant advertisements. These cookies are only set with your consent.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>3. Types of Cookies We Use</motion.h2>
            <motion.h3 variants={fadeInUp} className={heading3}>Essential Cookies</motion.h3>
            <motion.p variants={fadeInUp} className={para}>
              Essential cookies are required for the operation of the Platform. They include session cookies that maintain your logged-in state, CSRF protection cookies, and preference cookies that remember your cookie consent settings.
            </motion.p>

            <motion.h3 variants={fadeInUp} className={heading3}>Analytics Cookies</motion.h3>
            <motion.p variants={fadeInUp} className={para}>
              We may use analytics services to collect information about how visitors use the Platform. This information is aggregated and anonymised, meaning it does not identify individual users. Analytics cookies help us understand which pages are most popular, how visitors navigate the Platform, and where we can make improvements.
            </motion.p>

            <motion.h3 variants={fadeInUp} className={heading3}>Functionality Cookies</motion.h3>
            <motion.p variants={fadeInUp} className={para}>
              These cookies allow the Platform to remember choices you make and provide enhanced personalisation. For example, they may remember your display preferences or regional settings to provide a more tailored experience.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>4. Third-Party Cookies</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              Some cookies on the Platform are set by third-party services that appear on our pages. We do not control the setting of these cookies. We encourage you to review the privacy policies of these third-party providers on their respective websites. Third-party cookies may be used for analytics, social media integration, or embedded content functionality.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>5. Managing Cookies</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              When you first visit the Platform, you will be presented with a cookie consent banner that allows you to accept or customise your cookie preferences. You can change your preferences at any time through the cookie settings accessible on the Platform.
            </motion.p>
            <motion.p variants={fadeInUp} className={para}>
              You can also control cookies through your browser settings. Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites. Please note that if you disable cookies, some features of the Platform may not function as intended.
            </motion.p>
            <motion.p variants={fadeInUp} className={para}>
              For more information about managing cookies, visit allaboutcookies.org or your browser&rsquo;s help documentation.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>6. Similar Technologies</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              In addition to cookies, we may use similar technologies such as local storage, session storage, and pixel tags (also known as web beacons or clear GIFs). These technologies operate similarly to cookies and help us collect information about how you interact with the Platform. Our use of these technologies is governed by this Cookie Policy.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>7. Changes to This Policy</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>8. Contact Us</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              If you have any questions about our use of cookies, please contact us at privacy@raystaffing.co.uk.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// ─── TERMS PAGE ─────────────────────────────────────────────
export function TermsPage() {
  return (
    <main className="min-h-screen">
      <LegalHero title="Terms & Conditions" breadcrumb="Terms & Conditions" />

      <section className={sectionClass}>
        <div className={contentClass}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className={para}>
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the website and platform operated by RAY Staffing Consulting Ltd (&ldquo;RAY&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), located at the applicable domain (the &ldquo;Platform&rdquo;). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree with these Terms, you must not use the Platform.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>1. Definitions</motion.h2>
            <ul className={listClass}>
              <li><strong>&ldquo;Candidate&rdquo;</strong> means an individual registered on the Platform seeking employment opportunities.</li>
              <li><strong>&ldquo;Employer&rdquo;</strong> means an organisation or individual registered on the Platform to post vacancies and recruit candidates.</li>
              <li><strong>&ldquo;Tenant&rdquo;</strong> means an individual registered on the Platform to access housing management services.</li>
              <li><strong>&ldquo;Services&rdquo;</strong> means the housing management, HR consultancy, recruitment, staffing, and any other services provided by RAY through the Platform.</li>
              <li><strong>&ldquo;User&rdquo;</strong> means any individual or organisation accessing or using the Platform, including Candidates, Employers, Tenants, and visitors.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>2. Registration and Accounts</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              To access certain features of the Platform, you may be required to register for an account. When registering, you agree to:
            </motion.p>
            <ul className={listClass}>
              <li>Provide accurate, current, and complete information as required by the registration form.</li>
              <li>Maintain and promptly update your account information to keep it accurate, current, and complete.</li>
              <li>Maintain the security and confidentiality of your login credentials.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorised use of your account or any other breach of security.</li>
            </ul>
            <motion.p variants={fadeInUp} className={para}>
              You must be at least 18 years of age to create an account and use the Platform. RAY reserves the right to suspend or terminate accounts that violate these Terms.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>3. Acceptable Use</motion.h2>
            <motion.p variants={fadeInUp} className={para}>You agree not to use the Platform to:</motion.p>
            <ul className={listClass}>
              <li>Provide false, misleading, or inaccurate information in your profile, applications, or communications.</li>
              <li>Impersonate any person or entity, or misrepresent your identity or affiliation.</li>
              <li>Upload or transmit any content that is unlawful, defamatory, harassing, threatening, or otherwise objectionable.</li>
              <li>Interfere with or disrupt the Platform, servers, or networks connected to the Platform.</li>
              <li>Attempt to gain unauthorised access to any portion of the Platform or any systems or networks connected to the Platform.</li>
              <li>Use automated means (including bots, scrapers, or spiders) to access the Platform or collect information.</li>
              <li>Solicit personal information from other Users without their consent.</li>
              <li>Use the Platform for any purpose that is unlawful or prohibited by these Terms.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>4. Employer Terms</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              Employers using the Platform agree that:
            </motion.p>
            <ul className={listClass}>
              <li>All vacancy postings must be for genuine roles with accurate descriptions and requirements.</li>
              <li>You will comply with all applicable employment laws, including the Equality Act 2010, in your use of the Platform and interactions with Candidates.</li>
              <li>You will not use information obtained through the Platform for purposes unrelated to recruitment and employment.</li>
              <li>Any placement or hiring decisions are your sole responsibility, and RAY provides no guarantee of candidate suitability.</li>
              <li>Fees for recruitment and staffing services are as agreed in separate commercial terms and are subject to our standard terms of business for recruitment services.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>5. Candidate Terms</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              Candidates using the Platform agree that:
            </motion.p>
            <ul className={listClass}>
              <li>All information provided in your profile, CV, and applications is accurate and truthful.</li>
              <li>You will not apply for roles for which you are not qualified or eligible to work.</li>
              <li>You have the right to work in the UK and will provide appropriate documentation when required.</li>
              <li>RAY may share your information with prospective employers as part of the recruitment process.</li>
              <li>RAY acts as an introducer and is not party to any employment contract between you and an employer.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>6. Intellectual Property</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              All content on the Platform, including text, graphics, logos, images, software, and the overall design and layout, is the property of RAY or its licensors and is protected by UK and international intellectual property laws. You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content from the Platform without our prior written consent.
            </motion.p>
            <motion.p variants={fadeInUp} className={para}>
              By submitting content to the Platform (such as profiles, CVs, and job postings), you grant RAY a non-exclusive, worldwide, royalty-free licence to use, reproduce, and distribute that content for the purpose of providing the Services.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>7. Limitation of Liability</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              To the fullest extent permitted by applicable law, RAY shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or in connection with your use of or inability to use the Platform. RAY&rsquo;s total liability for any claims arising from or related to these Terms or the Platform shall not exceed the fees paid by you to RAY in the twelve (12) months preceding the claim, or £1,000, whichever is greater.
            </motion.p>
            <motion.p variants={fadeInUp} className={para}>
              Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded or limited by applicable law.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>8. Indemnity</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              You agree to indemnify and hold harmless RAY, its directors, employees, agents, and affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with your use of the Platform, your breach of these Terms, or your violation of any rights of a third party.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>9. Termination</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              RAY reserves the right to suspend or terminate your access to the Platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the Platform will immediately cease. Provisions of these Terms that by their nature should survive termination shall remain in effect.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>10. Dispute Resolution and Governing Law</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. Before commencing legal proceedings, you agree to attempt to resolve any dispute with us through good-faith negotiation.
            </motion.p>

            <motion.h2 variants={fadeInUp} className={heading2}>11. General Provisions</motion.h2>
            <ul className={listClass}>
              <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and Cookie Policy, constitute the entire agreement between you and RAY regarding the Platform.</li>
              <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall continue in full force and effect.</li>
              <li><strong>Waiver:</strong> The failure of RAY to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</li>
              <li><strong>Assignment:</strong> You may not assign or transfer these Terms or your rights under them without our prior written consent.</li>
              <li><strong>Changes:</strong> RAY reserves the right to modify these Terms at any time. Changes will be effective upon posting on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.</li>
            </ul>

            <motion.h2 variants={fadeInUp} className={heading2}>12. Contact Us</motion.h2>
            <motion.p variants={fadeInUp} className={para}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </motion.p>
            <motion.p variants={fadeInUp} className={`${para} not-italic`}>
              <strong>RAY Staffing Consulting Ltd</strong><br />
              Email: legal@raystaffing.co.uk<br />
              Address: London, England, United Kingdom
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
