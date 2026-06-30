import LegalLayout from '../components/LegalLayout.jsx';
import { LEGAL_META } from '../legal/meta.js';

const { terms, operator, dpc } = LEGAL_META;

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      version={terms.version}
      effectiveDate={terms.effectiveDate}
    >
      <p>
        These Terms of Service (the <strong>&ldquo;Terms&rdquo;</strong>) govern your
        access to and use of the FloodBuddy mobile and web application and related
        services (the <strong>&ldquo;Service&rdquo;</strong>), operated by{' '}
        {operator.legalName}, based in {operator.address}. By creating an account,
        signing in, or otherwise using the Service, you enter into a legally binding
        agreement with the Operator.
      </p>

      <h2>1. Acceptance of these Terms</h2>
      <p>
        You accept these Terms by ticking the acceptance box presented during
        registration and continuing to use the Service. You acknowledge that
        clicking to accept constitutes a valid electronic signature and that this
        agreement, together with the electronic record of your acceptance (including
        the date, time and other metadata), is enforceable in accordance with the
        Electronic Transactions Act, 2008 (Act 772) of the Republic of Ghana. If you
        do not agree, you must not use the Service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least eighteen (18) years old, or the age of majority in your
        jurisdiction, to use the Service. If you are below this age you may use the
        Service only with the verifiable consent and supervision of a parent or legal
        guardian who agrees to be bound by these Terms on your behalf. By using the
        Service you represent that you meet these requirements.
      </p>

      <h2>3. Description of the Service</h2>
      <p>
        FloodBuddy is a community flood-reporting tool. It allows registered users to
        submit reports of flooding, including a photograph, the geographic location
        (latitude and longitude) and a description of severity, and to view reports
        submitted by others. The Service is provided for general informational and
        community-awareness purposes only.
      </p>

      <h2 className="legal__warn">4. The Service is not an emergency service</h2>
      <p>
        <strong>
          FloodBuddy is not an emergency, rescue, early-warning, or life-safety
          service and must never be relied upon as one.
        </strong>{' '}
        It does not dispatch help and is not monitored in real time. In an emergency,
        or where life or property is at risk, contact the Ghana National Fire Service,
        the National Disaster Management Organisation (NADMO), the Police, or the
        national emergency number <strong>112</strong> immediately. You must never
        delay seeking help in order to make a report.
      </p>

      <h2>5. Your account</h2>
      <p>
        You sign in using Google authentication provided through Firebase. You are
        responsible for maintaining the confidentiality of your Google account and
        for all activity that occurs under your FloodBuddy account. You agree to
        provide accurate information and to notify the Operator of any unauthorised
        use.
      </p>

      <h2>6. User content and licence</h2>
      <p>
        You retain ownership of the photographs, descriptions and other content you
        submit (<strong>&ldquo;User Content&rdquo;</strong>). By submitting User
        Content you grant the Operator a non-exclusive, royalty-free, worldwide
        licence to host, store, reproduce, adapt, publish and display that User
        Content for the purpose of operating, improving and promoting the Service and
        for flood-awareness, research and disaster-management purposes, including
        sharing relevant reports with public authorities such as NADMO. You represent
        that you have the right to grant this licence and that your User Content does
        not infringe the rights of any third party.
      </p>

      <h2>7. Acceptable use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>submit false, misleading, fraudulent or malicious reports;</li>
        <li>
          upload content that is unlawful, defamatory, obscene, or that depicts
          identifiable individuals without a lawful basis or their consent;
        </li>
        <li>
          infringe any intellectual-property, privacy or other right of any person;
        </li>
        <li>
          attempt to gain unauthorised access to, interfere with, or disrupt the
          Service, its servers or networks, including any conduct contrary to the
          Cybersecurity Act, 2020 (Act 1038);
        </li>
        <li>use the Service for any unlawful or unauthorised purpose.</li>
      </ul>

      <h2>8. Accuracy and availability — &ldquo;as is&rdquo;</h2>
      <p>
        The Service and all information available through it are provided on an{' '}
        <strong>&ldquo;as is&rdquo;</strong> and{' '}
        <strong>&ldquo;as available&rdquo;</strong> basis without warranties of any
        kind, whether express or implied, including any implied warranties of
        merchantability, fitness for a particular purpose, accuracy or
        non-infringement. The Operator does not warrant that reports are accurate,
        complete, current or reliable, or that the Service will be uninterrupted or
        error-free. Reports are generated by members of the public and are not
        verified by the Operator.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by the laws of {operator.jurisdiction}, the
        Operator, its directors, employees, contractors and agents shall not be liable
        for any indirect, incidental, special, consequential or punitive damages, or
        for any loss of life, personal injury, property damage, loss of profits, data
        or goodwill, arising out of or in connection with your access to, use of, or
        inability to use the Service, or your reliance on any information obtained
        through it, whether based in contract, tort (including negligence), statute or
        otherwise, even if the Operator has been advised of the possibility of such
        damages. Nothing in these Terms excludes or limits liability that cannot be
        excluded or limited under applicable Ghanaian law.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify, defend and hold harmless the Operator and its
        directors, employees, contractors and agents from and against any and all
        claims, demands, actions, liabilities, losses, damages, costs and expenses
        (including reasonable legal fees) arising out of or related to: (a) your User
        Content; (b) your use or misuse of the Service; (c) your breach of these Terms
        or of any applicable law; or (d) your violation of the rights of any third
        party.
      </p>

      <h2>11. Privacy and data protection</h2>
      <p>
        Your use of the Service is also governed by our{' '}
        <a href="#/privacy">Privacy Policy</a>, which explains how we collect and
        process your personal data in accordance with the Data Protection Act, 2012
        (Act 843). By accepting these Terms you confirm that you have also read the
        Privacy Policy.
      </p>

      <h2>12. Intellectual property</h2>
      <p>
        The Service, including its software, design, trademarks and content (excluding
        User Content), is owned by or licensed to the Operator and is protected by
        applicable intellectual-property laws. No rights are granted to you except as
        expressly set out in these Terms.
      </p>

      <h2>13. Suspension and termination</h2>
      <p>
        The Operator may suspend or terminate your access to the Service at any time,
        with or without notice, if you breach these Terms or where required to protect
        the Service or other users. You may stop using the Service and request deletion
        of your account at any time by contacting{' '}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        The Operator may update these Terms from time to time. Where changes are
        material, the version number will be increased and you will be required to
        review and accept the updated Terms before continuing to use the Service. A
        new, timestamped record of your acceptance will be created.
      </p>

      <h2>15. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of the{' '}
        {operator.jurisdiction}. You agree to submit to the exclusive jurisdiction of
        the courts of Ghana in respect of any dispute arising out of or in connection
        with these Terms or the Service. The parties shall first attempt in good faith
        to resolve any dispute amicably before commencing legal proceedings.
      </p>

      <h2>16. General</h2>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable, the
        remaining provisions shall continue in full force and effect. These Terms,
        together with the Privacy Policy, constitute the entire agreement between you
        and the Operator regarding the Service.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms may be sent to{' '}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>. Complaints
        regarding the handling of your personal data may also be made to the{' '}
        {dpc.name} ({' '}
        <a href={`mailto:${dpc.email}`}>{dpc.email}</a>, {dpc.phone}).
      </p>

      <p className="legal__note">
        This document is provided as a starting point and does not constitute legal
        advice. The Operator should have it reviewed by a lawyer qualified in Ghana
        and register as a data controller with the Data Protection Commission before
        relying on it in production.
      </p>
    </LegalLayout>
  );
}
