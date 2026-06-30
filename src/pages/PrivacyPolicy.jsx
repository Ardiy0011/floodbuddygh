import LegalLayout from '../components/LegalLayout.jsx';
import { LEGAL_META } from '../legal/meta.js';

const { privacy, operator, dpc } = LEGAL_META;

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      version={privacy.version}
      effectiveDate={privacy.effectiveDate}
    >
      <p>
        This Privacy Policy explains how {operator.legalName} (the{' '}
        <strong>&ldquo;Operator&rdquo;</strong>, <strong>&ldquo;we&rdquo;</strong>,{' '}
        <strong>&ldquo;us&rdquo;</strong>) collects, uses, discloses and protects your
        personal data when you use FloodBuddy (the{' '}
        <strong>&ldquo;Service&rdquo;</strong>). We are committed to processing your
        personal data in accordance with the Data Protection Act, 2012 (Act 843) of
        the Republic of Ghana and the eight data-protection principles it establishes.
      </p>

      <h2>1. Who we are (Data Controller)</h2>
      <p>
        The data controller responsible for your personal data is {operator.legalName},{' '}
        {operator.address}. You can contact us about this Policy or your personal data
        at <a href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>

      <h2>2. The personal data we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — when you sign in with Google we receive your
          name, email address, profile photo and a Google/Firebase user identifier.
        </li>
        <li>
          <strong>Report content</strong> — the photographs you upload and the severity
          description you write.
        </li>
        <li>
          <strong>Precise location data</strong> — the latitude and longitude you
          attach to a report. This is collected only when you choose to share your
          location, and is associated with the photographs you submit.
        </li>
        <li>
          <strong>Consent records</strong> — the fact, version, date and time of your
          acceptance of these documents, together with your IP address and device /
          browser information, kept as an audit record of your agreement.
        </li>
        <li>
          <strong>Technical data</strong> — IP address, device and browser type, and
          server log timestamps generated when you use the Service.
        </li>
      </ul>

      <h2>3. Legal basis for processing</h2>
      <p>
        We rely principally on your <strong>consent</strong>, which you give freely and
        on an informed basis when you accept this Policy during registration, as the
        legal basis for collecting and processing your personal data (including your
        photographs and precise location). Where applicable, we may also process data
        to pursue a legitimate interest in operating a community flood-awareness
        service, or to comply with a legal obligation. You may withdraw your consent at
        any time (see section 8).
      </p>

      <h2>4. How we use your personal data</h2>
      <ul>
        <li>to create and manage your account and authenticate you;</li>
        <li>to publish and display flood reports within the Service;</li>
        <li>
          to support community flood-awareness, and to share relevant reports with
          disaster-management authorities such as NADMO where appropriate;
        </li>
        <li>to maintain the security, integrity and proper operation of the Service;</li>
        <li>
          to keep an auditable record of your agreement to our Terms and this Policy;
        </li>
        <li>to comply with applicable law and respond to lawful requests.</li>
      </ul>

      <h2>5. Disclosure and sharing</h2>
      <p>We share personal data only as described below:</p>
      <ul>
        <li>
          <strong>Service providers</strong> — Google LLC / Firebase (authentication),
          and our hosting provider (a Digital Ocean server), who process data on our
          behalf under appropriate terms;
        </li>
        <li>
          <strong>Public authorities</strong> — disaster-management or law-enforcement
          bodies, where we are permitted or required to do so, or to protect life or
          property;
        </li>
        <li>
          <strong>Other users</strong> — flood reports (photograph, location and
          severity) are visible to other users of the Service; do not include
          information in a report that you do not wish to be seen.
        </li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>6. International transfers</h2>
      <p>
        Some of our service providers (such as Google / Firebase) may process and store
        data on servers located outside Ghana. Where personal data is transferred
        outside Ghana, we take reasonable steps to ensure it remains protected to a
        standard consistent with Act 843 and that the transfer is permitted under that
        Act.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We keep your personal data only for as long as necessary for the purposes set
        out in this Policy, or as required by law. Flood reports may be retained for
        historical and disaster-management purposes. Consent records are retained for
        the period necessary to evidence your agreement. When data is no longer needed
        it is securely deleted or anonymised.
      </p>

      <h2>8. Your rights as a data subject</h2>
      <p>Under the Data Protection Act, 2012 (Act 843) you have the right to:</p>
      <ul>
        <li>be informed about, and request access to, the personal data we hold about you;</li>
        <li>request correction of inaccurate or misleading personal data;</li>
        <li>object to processing that causes or is likely to cause unwarranted harm or distress;</li>
        <li>prevent processing of your personal data for direct-marketing purposes;</li>
        <li>withdraw your consent at any time (this does not affect processing already carried out);</li>
        <li>request deletion of your account and associated personal data;</li>
        <li>lodge a complaint with the Data Protection Commission.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{' '}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>. We will respond
        within a reasonable period.
      </p>

      <h2>9. Children</h2>
      <p>
        The Service is not directed at children under eighteen (18). We do not
        knowingly collect personal data from children without the verifiable consent of
        a parent or guardian. If you believe a child has provided us personal data
        without such consent, please contact us so we can delete it.
      </p>

      <h2>10. Security</h2>
      <p>
        We implement appropriate technical and organisational measures to safeguard
        your personal data against loss, misuse, and unauthorised access, disclosure or
        alteration, consistent with the security-safeguards principle under Act 843. No
        method of transmission or storage is completely secure, however, and we cannot
        guarantee absolute security.
      </p>

      <h2>11. Cookies and local storage</h2>
      <p>
        We use browser local storage to keep you signed in (your Firebase
        authentication session). We do not use third-party advertising or tracking
        cookies.
      </p>

      <h2>12. Complaints to the Data Protection Commission</h2>
      <p>
        If you are not satisfied with how we handle your personal data, you may lodge a
        complaint with the {dpc.name}:
      </p>
      <ul>
        <li>Email: <a href={`mailto:${dpc.email}`}>{dpc.email}</a></li>
        <li>Phone: {dpc.phone}</li>
        <li>Website: <a href={dpc.website} target="_blank" rel="noopener noreferrer">{dpc.website}</a></li>
      </ul>

      <h2>13. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. Where changes are material, the
        version number will be increased and you will be asked to review and accept the
        updated Policy before continuing to use the Service, creating a new timestamped
        consent record.
      </p>

      <h2>14. Contact</h2>
      <p>
        For any questions about this Policy or your personal data, contact{' '}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>

      <p className="legal__note">
        This document is provided as a starting point and does not constitute legal
        advice. The Operator should have it reviewed by a lawyer qualified in Ghana and
        register as a data controller with the Data Protection Commission (within the
        period required by Act 843) before relying on it in production.
      </p>
    </LegalLayout>
  );
}
