import Navigation from '@src/components/navigation';
import { createClient } from '@src/lib/supabase';

export default async function PrivacyPolicy() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    const lastUpdated = "March 3, 2025"
    const supportEmail = "ryxavyer@gmail.com"
    return (
        <div className='flex justify-center'>
            <Navigation user={data.user}/>
            <div className='mt-[110px] w-3/4 pt-4 pb-12 px-6 md:px-10 text-sm'>
                <h1 className='text-3xl font-bold'>Privacy Policy</h1>
                <br/>
                <p className='text-md'>Last updated: {lastUpdated}</p>
                <br/>
                <p>PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY ACCESSING OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO BE BOUND BY ALL THE TERMS OF THIS PRIVACY POLICY AND OUR TERMS OF SERVICE. IF YOU DO NOT AGREE TO SUCH TERMS, EXIT THIS PAGE AND DO NOT ACCESS OR USE THE SERVICE.</p>
                <br/>
                <p>We are committed to respect and protect the privacy of the personal information we obtain from you through the Service and we have created this Privacy Policy to inform you about how we collect, use and share your personal information, and about our privacy practices in general.</p>
                <br/>
                <p>We are always ready to address your questions and concerns regarding this policy and our privacy practices. If you would like to contact customer service, please contact us using the email linked at the end of this Privacy Policy.</p>
                <br/>
                <p>We continually strive to find new ways to enhance your experience with the Service and we may modify this Privacy Policy from time to time to reflect changes in our privacy practices. You are encouraged to review this Privacy Policy periodically and to check the “Last Updated” date at the top of the Privacy Policy for the most recent version. If we make changes to this Privacy Policy, we will notify you here and in our discretion, by means of notice through the Website, the Application, or any other part of the Service.</p>
                <br/>
                <h2 className='text-xl font-bold'>Terms of Service</h2>
                <br/>
                <p>Use of the Service is subject to our <a href='https://valvod.gg/terms'>Terms of Service</a> which is hereby incorporated and made part of our Site disclosures which shall include this Privacy Policy the Terms of Service and any other disclosures posted to the Site (collectively the “Site Disclosures”). By using the Service, you agree to be bound by our Site Disclosures.</p>
                <br/>
                <h2 className='text-xl font-bold'>Application of this Privacy Policy</h2>
                <br/>
                <p> This policy applies where we are acting as a data controller with respect to your personal data, in other words, where we determine the purposes and means of the processing of that personal data.</p>
                <br/>
                <p>This policy applies where we are collecting Personally Identifiable Information (as further described below) from individuals and sole proprietors and does not apply to the collection of data from corporate entities.</p>
                <br/>
                <p>This policy applies however we collect Personally Identifiable Information however accessed and / or used, whether via personal computers, mobile devices or otherwise.</p>
                <br/>
                <p>In the event while using the Service you may be directed to other websites that are operated and controlled by third parties that are beyond our control. This policy does not apply to the privacy practices of these third-party websites.</p>
                <br/>
                <p>The terms contained in this Privacy Policy are in accordance with various privacy policy laws and regulations including those applicable in the United States including the California Online Privacy Protection Act (“COPPA”), the Nevada privacy law SB-220 and the General Data Protection Regulation 2016/679.</p>
                <br/>
                <h2 className='text-xl font-bold'>Personal Information Collected and How It Is Used</h2>
                <br/>
                <p>Personally Identifiable Information. When you engage in certain activities via the Service you may provide information to us which may include personal information, which is information that may reasonably be used to identify you, such as your name, address, zip code, e-mail address, telephone number, credit card number, images you upload and other content you upload or provide to us. We may also collect information available on the web. In the event you enroll in the Service through a third party, such as Facebook or Google, or another party we may receive Personally Identifiable Information from such third party and by using the Service, you consent to our receipt and sharing of Personally Identifiable Information. We may use or share Personally Identifiable Information to provide products and/or services to you, to enable third-parties to provide products and/or services to you, to enter a sweepstakes or contest, to enhance the operation of the Service, improve our marketing and promotional efforts, analyze use of the Service, and tailor your experience with third parties as provided below in this Privacy Policy. We may also use Personally Identifiable Information to troubleshoot, resolve disputes, accomplish administrative tasks, contact you, enforce our agreements with you, including our Terms and Conditions and this Privacy Policy, and to comply with applicable laws and cooperate with law enforcement activities. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and service.</p>
                <br/>
                <p>We may process data about your use of our website and services ("usage data"). The usage data may include your IP address, geographical location, browser type and version, operating system, referral source, length of visit, page views and website navigation paths, as well as information about the timing, frequency and pattern of your service use. The source of the usage data is our analytics tracking system. This usage data may be processed for the purposes of analyzing the use of the website and services. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>We may process your account data ("account data"). In the event you register to use the Service, the account data may include your name and email address. The source of the account data is you. The account data may be processed for the purposes of operating our website, providing our services, ensuring the security of our website and services, maintaining back-ups of our databases and communicating with you. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>We may process information that you post for publication on our website or through our services ("publication data"). The publication data may be processed for the purposes of enabling such publication and administering our website and services. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>We may process information contained in any inquiry you submit to us regarding goods and/or services ("inquiry data"). The inquiry data may be processed for the purposes of offering, marketing and selling relevant goods and/or services to you. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>We may process information that you provide to us for the purpose of subscribing to our email notifications and/or newsletters ("notification data"). The notification data may be processed [for the purposes of sending you the relevant notifications and/or newsletters. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>We may process information contained in or relating to any communication that you send to us ("correspondence data"). The correspondence data may include the communication content and metadata associated with the communication. Our website will generate the metadata associated with communications made using the website contact forms. The correspondence data may be processed for the purposes of communicating with you and record-keeping. The legal basis for this processing is your consent or our legitimate interests, namely monitoring and improving our website and services.</p>
                <br/>
                <p>In addition to the specific purposes for which we may process your personal data set out in this Section we may also process any of your personal data where such processing is necessary for compliance with a legal obligation to which we are subject, or in order to protect your vital interests or the vital interests of another natural person.</p>
                <br/>
                <p>Please do not supply any other person's personal data to us unless we prompt you to do so.</p>
                <br/>
                <h2 className='text-xl font-bold'>Providing Personal Data to Others</h2>
                <br/>
                <p>We do not sell or disclose your personal data to others except as noted below.</p>
                <br/>
                <p>As our business changes, we may buy or sell various assets. In the event all or a portion of the assets owned or controlled by us, our parent or any subsidiary or affiliated entity are sold, assigned, transferred or acquired by another company, the information from and/or about our Service users may be among the transferred assets.</p>
                <br/>
                <p>In addition to the specific disclosures of personal data set out in this Section we may disclose your personal data where such disclosure is necessary for compliance with a legal obligation to which we are subject, or in order to protect your vital interests or the vital interests of another natural person. We may also disclose your personal data where such disclosure is necessary for the establishment, exercise or defense of legal claims, whether in court proceedings or in an administrative or out-of-court procedure.</p>
                <br/>
                <h2 className='text-xl font-bold'>Cookies</h2>
                <br/>
                <p>A cookie is a file containing an identifier (a string of letters and numbers) that is sent by a web server to a web browser and is stored by the browser. The identifier is then sent back to the server each time the browser requests a page from the server.</p>
                <br/>
                <p>Cookies may be either "persistent" cookies or "session" cookies: a persistent cookie will be stored by a web browser and will remain valid until its set expiry date, unless deleted by the user before the expiry date; a session cookie, on the other hand, will expire at the end of the user session, when the web browser is closed.</p>
                <br/>
                <p>Cookies do not typically contain any information that personally identifies a user, but personal information that we store about you may be linked to the information stored in and obtained from cookies.</p>
                <br/>
                <p>We may use cookies for the following purposes:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>authentication - we use cookies to identify you when you visit our website and as you navigate our website.</li>
                    <li>status - we use cookies to help us to determine if you are logged into our website.</li>
                    <li>personalization - we use cookies to store information about your preferences and to personalize the website for you.</li>
                    <li>security - we use cookies as an element of the security measures used to protect user accounts, including preventing fraudulent use of login credentials, and to protect our website and services generally.</li>
                    <li>advertising - we use cookies to help us to display advertisements that will be relevant to you.</li>
                    <li>analysis - we use cookies to help us to analyze the use and performance of our website and services; and</li>
                    <li>cookie consent - we use cookies to store your preferences in relation to the use of cookies more generally.</li>
                </ol>
                <br/>
                <p>Our service providers use cookies and those cookies may be stored on your computer when you visit our website.</p>
                <br/>
                <p> We may use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered relating to our website is used to create reports about the use of our website. Google's privacy policy is available at: https://www.google.com/policies/privacy/</p>
                <br/>
                <h2 className='text-xl font-bold'>Use of the Service</h2>
                <br/>
                <p>Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via these links:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>https://support.google.com/chrome/answer/95647?hl=en (Chrome);</li>
                    <li>https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences (Firefox);</li>
                    <li>http://www.opera.com/help/tutorials/security/cookies/ (Opera);</li>
                    <li>https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-deletemanage-cookies (Internet Explorer);</li>
                    <li>https://support.apple.com/kb/PH21411 (Safari); and</li>
                    <li>https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy (Edge).</li>
                </ol>
                <br/>
                <p>Blocking all cookies will have a negative impact upon the usability of many websites.  If you block cookies, you will not be able to use all the features on our website.</p>
                <br/>
                <h2 className='text-xl font-bold'>Consent to Transfer of Information</h2>
                <br/>
                <p>Your information may be transferred to, and maintained on, servers and databases located outside of your state, province, country or other governmental jurisdiction where the privacy laws may not be as protective as your jurisdiction. Please be advised that we may transfer your information to and from any state, province, country or other governmental jurisdiction, and process it in the United States or elsewhere. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to any such transfer.</p>
                <br/>
                <h2 className='text-xl font-bold'>Security of Information</h2>
                <br/>
                <p>In the event you are provided with an opportunity to establish and account or profile on our Site, you may be able to access your Personally Identifiable Information via the Service with your password and username. This password is encrypted. We advise against sharing your password with anyone.  If you access your account via a third-party site or service, you may have additional or different sign-in protections via that third-party site or service. You need to prevent unauthorized access to your account and Personal Information by selecting and protecting your password and/or other sign-in mechanism appropriately and limiting access to your computer, browser, or mobile device by signing off after you have finished accessing your account. Unauthorized entry or use, hardware or software failure, and other factors, may compromise the security of user information at any time. If we believe that the security of your information may have been compromised, we may seek to notify you of that development.</p>
                <br/>
                <p>We are committed to taking all reasonable precautions to safeguard the privacy of personal information which has been provided by its users. We use technical, contractual, administrative and physical security steps to protect your personal information. Security measures such as restricted access and the use of passwords and encryption have been adopted to protect your personal information against loss or theft, as well as unauthorized access, disclosure, copying, use or modification. Our employees have been trained to respect your privacy at all times and those employees with access to your personal information shall use your personal information strictly in accordance with this Privacy Policy. We will protect your credit card information by using industry standard encryption technology.</p>
                <br/>
                <p>Please be aware that no data transmission over the Internet or via e-mail is completely secure and therefore we cannot guarantee protection of all personal information in all cases. For example, we cannot guarantee protection against interception, misappropriation, misuse, or alteration, or that your information will not be disclosed or accessed by the unauthorized acts of others. Consequently, we cannot ensure or warrant the security of any information you transmit to us, and you do so at your own risk. If you provide us with your credit card number, you should not send it electronically unless the email is encrypted, or your browser indicates that the access to our website is secure. Materials posted to online forums such as bulletin boards or chat rooms are public, not secure, and may be viewed by anyone. Any personal information you post may be collected and used by anyone and may result in unsolicited messages from other parties.</p>
                <br/>
                <h2 className='text-xl font-bold'>Terminations</h2>
                <br/>
                <p>Subject to this section, the Terms herein will remain in full force and effect while you use the Service. You may terminate your use of the Company Service at any time.</p>
                <br/>
                <p>We may suspend or terminate your rights to use the Service (including your account) at any time for any reason, or no reason, at our sole discretion, including for any use of the Service in violation of these Terms.</p>
                <br/>
                <p>Upon termination of your rights under these Terms, by you or by us, your Account and right to access and use the Service will terminate immediately. You understand that any termination of your account may involve deletion of your User Content associated with your account from our live databases.</p>
                <br/>
                <p>The Company will not have any liability whatsoever to you for any termination of your rights under these Terms, including for termination of your account or deletion of your User Content.</p>
                <br/>
                <h2 className='text-xl font-bold'>Age</h2>
                <br/>
                <p>The Service is not directed to children under the age of thirteen (13). If you become aware that your child has provided us with personal information please contact us at the email address listed below. If we become aware that a child under this age has provided us with personal information, we will take steps to remove such information and terminate the child's account.</p>
                <br/>
                <h2 className='text-xl font-bold'>Rights</h2>
                <br/>
                <p>California law requires that we provide you with a summary of your privacy rights under the California Online Privacy Protection Act (“COPPA”) and the California Business and Professions Code. As required by COPPA, we will provide you with the categories of Personally Identifiable Information that we collect through the Service and the categories of third-party persons or entities with whom such Personally Identifiable Information may be shared for direct marketing purposes at your request. California law requires us to inform you, at your request, (1) the categories of Personally Identifiable Information we collect and what third parties we share that information with; (2) the names and addresses of those third parties; and (3) examples of the products marketed by those companies. COPPA further requires us to allow you to control who you do not want us to share that information with. To obtain this information, please send a request by email or physical mail to the address found below. When contacting us, please indicate your name, address, email address, and what Personally Identifiable Information you do not want us to share with our marketing partners. The request should be sent to the attention of our legal department and labeled “California Customer Choice Notice.” Please allow 30 days for a response. Also, please note that there is no charge for controlling the sharing of your Personally Identifiable Information or requesting this notice.</p>
                <br/>
                <p>Other California Privacy Rights. California’s “Shine the Light” law (Civil Code Section § 1798.83) permits users of our Site that are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please contact us via phone, email, or write to us as provided below in our Contact Us Section.</p>
                <br/>
                <p>Nevada Privacy Rights. Nevada law (SB 220) permits customers in Nevada to opt-out of the sale of certain kinds of personal information. As previously mentioned above, we do not sell your personal information to third parties. If you are a Nevada resident and have questions, please contact us via phone, email, or write to us as provided below in our Contact Us Section.</p>
                <br/>
                <p>Additional terms that apply to some residents of the European Economic Area (EEA).</p>
                <br/>
                <p>In addition to the rights already recorded above, if you are based in the EEA, you may have the following additional rights in relation to the personal information we hold about you, in accordance with The General Data Protection Regulation 2016/67.</p>
                <br/>
                <h2 className='text-xl font-bold'>Additional Rights</h2>
                <br/>
                <p>In this Section we have summarized the rights that you have under data protection law. Some of the rights are complex, and not all of the details have been included in our summaries. Accordingly, you should read the relevant laws and guidance from the regulatory authorities for a full explanation of these rights.</p>
                <br/>
                <p>Your principal rights under data protection law are:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>the right to access;</li>
                    <li>the right to rectification;</li>
                    <li>the right to erasure;</li>
                    <li>the right to restrict processing;</li>
                    <li>the right to object to processing;</li>
                    <li>the right to data portability;</li>
                    <li>the right to complain to a supervisory authority; and</li>
                    <li>the right to withdraw consent.</li>
                </ol>
                <br/>
                <p>You have the right to confirmation as to whether we process your personal data and, where we do, access to the personal data, together with certain additional information. That additional information includes details of the purposes of the processing, the categories of personal data concerned and the recipients of the personal data. Providing the rights and freedoms of others are not affected, we will supply to you a copy of your personal data. The first copy will be provided free of charge, but additional copies may be subject to a reasonable fee.</p>
                <br/>
                <p>You have the right to have any inaccurate personal data about you rectified and, considering the purposes of the processing, to have any incomplete personal data about you completed.</p>
                <br/>
                <p>In some circumstances you have the right to the erasure of your personal data without undue delay. Those circumstances include: the personal data are no longer necessary in relation to the purposes for which they were collected or otherwise processed; you withdraw consent to consent-based processing; you object to the processing under certain rules of applicable data protection law; the processing is for direct marketing purposes; and the personal data have been unlawfully process. However, there are exclusions of the right to erasure. The general exclusions include where processing is necessary: for exercising the right of freedom of expression and information; for compliance with a legal obligation; or for the establishment, exercise or defense of legal claims.</p>
                <br/>
                <p>In some circumstances you have the right to restrict the processing of your personal data. Those circumstances are: you contest the accuracy of the personal data; processing is unlawful but you oppose erasure; we no longer need the personal data for the purposes of our processing, but you require personal data for the establishment, exercise or defense of legal claims; and you have objected to processing, pending the verification of that objection. Where processing has been restricted on this basis, we may continue to store your personal data. However, we will only otherwise process it: with your consent; for the establishment, exercise or defense of legal claims; for the protection of the rights of another natural or legal person; or for reasons of important public interest.</p>
                <br/>
                <p>You have the right to object to our processing of your personal data on grounds relating to your particular situation, but only to the extent that the legal basis for the processing is that the processing is necessary for: the performance of a task carried out in the public interest or in the exercise of any official authority vested in us; or the purposes of the legitimate interests pursued by us or by a third party. If you make such an objection, we will cease to process the personal information unless we can demonstrate compelling legitimate grounds for the processing which override your interests, rights and freedoms, or the processing is for the establishment, exercise or defense of legal claims.</p>
                <br/>
                <p>You have the right to object to our processing of your personal data for direct marketing purposes (including profiling for direct marketing purposes). If you make such an objection, we will cease to process your personal data for this purpose.</p>
                <br/>
                <p>You have the right to object to our processing of your personal data for scientific or historical research purposes or statistical purposes on grounds relating to your particular situation, unless the processing is necessary for the performance of a task carried out for reasons of public interest.</p>
                <br/>
                <p>To the extent that the legal basis for our processing of your personal data is:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>consent; or</li>
                    <li>that the processing is necessary for the performance of a contract to which you are party or in order to take steps at your request prior to entering into a contract, and such processing is carried out by automated means, you have the right to receive your personal data from us in a structured, commonly used and machine-readable format. However, this right does not apply where it would adversely affect the rights and freedoms of others.</li>
                </ol>
                <br/>
                <p>To the extent that the legal basis for our processing of your personal information is consent, you have the right to withdraw that consent at any time. Withdrawal will not affect the lawfulness of processing before the withdrawal.</p>
                <br/>
                <p>If you consider that our processing of your personal information infringes data protection laws, you have a legal right to lodge a complaint with a supervisory authority responsible for data protection.</p>
                <br/>
                <p>You may access your personal information that we hold by contacting us using the contact details below. We will provide you with a copy of the personal information we keep about you. However, we reserve the right to charge you a reasonable amount for providing copies of any personal information you request, to take into account the time, cost and effort involved.</p>
                <br/>
                <p>You may request that the personal information we hold about you be corrected by contacting us. If we do not agree to your request for a correction, you may then request that we take reasonable steps to attach to the information a statement of the correction sought but not made.</p>
                <br/>
                <p>Please be aware that some of these rights may be limited or unavailable where we have an overriding interest or legal obligation to continue to process the data, or where data may be exempt from disclosure.</p>
                <br/>
                <h2 className='text-xl font-bold'>Contact</h2>
                <br/>
                <p>For additional inquiries about the privacy of your information, you can contact us by emailing us at {supportEmail}</p>
            </div>
        </div>
    );
};
