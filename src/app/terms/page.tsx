import Navigation from '@src/components/navigation';
import { createClient } from '@src/lib/supabase';

export const metadata = {
    title: "Terms of Service | VALVOD",
    description: "Review our Terms of Service."
}

export default async function TermsOfService() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    const lastUpdated = "March 3, 2025"
    const supportEmail = "ryxavyer@gmail.com"
    return (
        <div className='flex justify-center'>
            <Navigation user={data.user}/>
            <div className='mt-[110px] w-3/4 pt-4 pb-12 px-6 md:px-10 text-sm'>
                <h1 className='text-3xl font-bold'>Terms of Service</h1>
                <br/>
                <p className='text-md'>Last updated: {lastUpdated}</p>
                <br/>
                <p>VALVOD (“Company”, “we”, “us”) provides a platform (the “Service”) where users can watch video game vods for the purpose of studying and improving their gameplay. The Service is accessible via our website at https://valvod.gg (collectively, the “Site”). Your use of the Service is subject to these Terms of Service (the “Terms of Service”). PLEASE READ THESE TERMS CAREFULLY. BY ACCESSING OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THE SERVICE.</p>
                <br/>
                <p>We reserve the right to modify these Terms at any time by posting updates on the Site or notifying users via email. The “Last Updated” date above reflects the most recent version. Your continued use of the Service after any changes constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.</p>
                <br/>
                <h2 className='text-xl font-bold'>Service Availability</h2>
                <br/>
                <p>The Service may be modified, updated, interrupted, suspended or discontinued at any time, in the sole discretion of the Company, without notice or liability. The Service may be unavailable at certain periods, including but not limited to systems failures, anticipated or unanticipated maintenance work, upgrades or force majeure events.</p>
                <br/>
                <p>The Company reserves the right, at any time, in its sole discretion to modify, temporarily or permanently block access to, suspend, or discontinue the Service, in whole or in part, with or without notice and effective immediately to any User.</p>
                <br/>
                <p>The Company will have no liability whatsoever for any losses, liabilities or damages you may incur as the result of any modification, suspension, or discontinuation of the Service or any part thereof.</p>
                <br/>
                <h2 className='text-xl font-bold'>Privacy Policy</h2>
                <br/>
                <p>Use of the Company Service is subject to the terms of our Privacy Policy which is hereby incorporated into and made part of these Terms of Service. Please carefully review our Privacy Policy. By using or accessing the Company Service, you agree to be bound by the terms of our Privacy Policy.</p>
                <br/>
                <h2 className='text-xl font-bold'>Age</h2>
                <br/>
                <p>The Service is meant for those at least thirteen (13) years of age. Use of the Service by anyone under the age of thirteen (13) is a violation of the Terms of Service. You may not use the Service if you are a competitor of the Service, or if we have previously banned you from use of the Service or closed your account.</p>
                <br/>
                <h2 className='text-xl font-bold'>Intellectual Property</h2>
                <br/>
                <p>You acknowledge that all materials on the Company Service, including, but not limited to, the Website design, Application design, graphics, text, sounds, pictures, and other files and the selection and arrangement thereof (collectively, “Materials”), are the property of Company and/or its licensors, and are subject to and protected by United States and international copyright and other intellectual property laws and rights. All rights to Materials not expressly granted in these Terms of Service are reserved to their respective copyright owners. Company authorizes you to view, download and/or print the Materials only for personal, non-commercial use, provided that you keep intact all copyright and other proprietary notices contained in the original Materials. Except as expressly authorized by the Terms of Service, you may not copy, reproduce, distribute, republish, download, perform, display, post, transmit, scrape, copy, exploit, create derivative works or otherwise use any of the Materials in any form or by any means, without the prior written authorization of Company or the respective copyright owner. In the absence of a written agreement, you may not modify or adapt the Materials in any way or otherwise use them for any public or commercial purposes. The trademarks, service marks, trade names, trade dress and logos (collectively, “Marks”) contained or described in the Company Service are the sole property of Company and/or its licensors and may not be copied, altered or otherwise used, in whole or in part, without the prior written authorization of Company and/or its licensors. Company reserves the right to enforce its intellectual property rights fully under the law.</p>
                <br/>
                <p>Your use of the Company Service is solely and exclusively under the limited license granted herein and you will not obtain any ownership interest therein through the Terms of Service or otherwise. All trademarks, service marks, trade names, domain names, slogans, logos, and other indicia of origin that appear on or in connection with any aspect of the Company Service are either the property of Company, its affiliates or licensors. Company retains the right to rescind and terminate the limited license granted hereunder at any point, for any reason. All rights not expressly granted herein by Company to you are fully reserved by Company, its advertisers and licensors.</p>
                <br/>
                <p>Some of the company and product names, logos, brands, and other trademarks featured or referred to within the Company Service may not be owned by us and are the property of their respective trademark holders. These trademark holders are not affiliated with, nor do they sponsor or endorse the Company Service.</p>
                <br/>
                <h2 className='text-xl font-bold'>Third Party Websites</h2>
                <br/>
                <p>In the event we include links via the Service to Third-Party websites (including advertisements) which may include products, goods, services or information offered therein, these are provided only as a convenience. If you clickthrough using these links to other websites, you may leave our Site. We do not control nor endorse any such Third-Party websites. You agree that the Company Parties, as defined below, will not be responsible or liable for any content, products, goods, services or information provided or available via any Third-Party website or for your use or inability to use a Third-Party website.</p>
                <br/>
                <p>You will use such links at your own risk. You are advised that other websites on the Internet, including Third-Party websites linked from our Site, might contain material or information:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>that some people may find offensive or inappropriate;</li>
                    <li>that is inaccurate, untrue, misleading or deceptive; or,</li>
                    <li>that is defamatory, libelous, infringing of others' rights or otherwise unlawful.</li>
                </ol>
                <br/>
                <p>We expressly disclaim any responsibility for the content, legality, decency or accuracy of any information, and for any content, products, goods, services or information, that appear on any Third-Party website or in advertisements or content that Third Parties may have listed or offered on our Site.</p>
                <br/>
                <p>Your interactions with Third Parties found on or through the Service, including payment and delivery of goods or services, if any, conditions, warranties or representations associated with such matters are solely between you and the Third Parties, except as may be otherwise stated herein. You acknowledge and agree that Company is not a party to any transactions you may enter into, except as may be stated herein, using the Service and we shall not under any circumstances be liable for any damages of any kind arising out of, or in connection with, or relating to, the content, products, goods, services or information of a Thirty-Party.</p>
                <br/>
                <p>Our Services make use of the YouTube Data API Services. Users agree to be bound to the YouTube Terms of Service (Available here: https://www.youtube.com/t/terms) when they make use of funtionality on our services that use the YouTube API Services.</p>
                <br/>
                <h2 className='text-xl font-bold'>Use of the Service</h2>
                <br/>
                <p>You may wish to register to take advantage of certain features. If so, you agree:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>To provide true, accurate, current and complete information about yourself as prompted by the Company Service;</li>
                    <li>that your account is for your personal and/or business use. You may not resell the Service;</li>
                    <li>that by creating an account, you agree to receive certain communications in connection with the Service;</li>
                    <li>as permitted, maintain and promptly update such information. If you provide any information that is false, inaccurate or outdated, or Company has reasonable grounds to suspect that such information is false, inaccurate or outdated, Company has the right to suspend or terminate your account and prohibit all current or future use of the Company Service by you; and</li>
                    <li>as permitted, maintain and promptly update such information. If you provide any information that is false, inaccurate or outdated, or Company has reasonable grounds to suspect that such information is false, inaccurate or outdated, Company has the right to suspend or terminate your account and prohibit all current or future use of the Company Service by you; and</li>
                    <li>that you are responsible for maintaining the confidentiality of the password and account and are fully responsible for all activities that occur under your account. Your account is meant to be private and you shall not share accounts for any reason. You agree to immediately notify us of any unauthorized use of your password or account or any other breach of security. You agree to be responsible for all charges resulting from the use of your account via the Company Service, including charges resulting from unauthorized use of your account.</li>
                </ol>
                <br/>
                <p>You may not impersonate someone else, create or use an account for anyone other than yourself, provide an email address other than your own, or create multiple accounts. If you use a pseudonym, take care to note that others may still be able to identify you if, for example, you include identifying information in your reviews, use the same account information on other sites, or allow other sites to share information about you with the Company Service.</p>
                <br/>
                <p>You agree to use the Company Service only for lawful purposes and that you are responsible for your use of and communications and content you may post via the Company Service. You agree not to post or transmit any unlawful, infringing, threatening, harassing, defamatory, vulgar, obscene, profane, indecent, offensive, hateful or otherwise objectionable material of any kind, including any material that encourages criminal conduct or conduct that would give rise to civil liability, infringes upon others’ intellectual property rights, impersonates any individual or entity, or otherwise violates any applicable law. You agree not to solicit personal information from minors. You agree not to use the Company Service in any manner that interferes with its normal operation or with any other user’s use of the Company Service.</p>
                <br/>
                <p>You may not do any of the following while accessing or using the Company Service:</p>
                <br/>
                <ol className='list-[lower-roman] list-inside'>
                    <li>access, tamper with, or use non-public areas of the Company Service, our computer systems, or the technical delivery systems of our providers;</li>
                    <li>probe, scan, or test the vulnerability of any system or network or breach or circumvent any security or authentication measures;</li>
                    <li>access or search or attempt to access or search the Company Service by any means other than through our currently available, published interfaces that are provided by us, unless you have been specifically allowed to do so in a separate agreement with us;</li>
                    <li>forge any TCP/IP packet header or any part of the header information in any email or posting, or in any way use the Company Service to send altered, deceptive or false source-identifying information; or</li>
                    <li>disrupt or interfere with the access of any user, host or network, including, without limitation, sending a virus, overloading, flooding, spamming, mail-bombing the Company Service, or otherwise creating an undue burden on the Company Service.</li>
                    <li>You may not use manual or automated software, devices, or other processes to “crawl,” “scrape,” or “spider” any page of the Company Service. You will not decompile, reverse engineer, or otherwise attempt to obtain the source code of any part of the Company Service.</li>
                    <li>You further agree that you will not access the Company Service by any means except through the interface provided by Company for access to the Company Service. Creating or maintaining any link from another application to any page at the Company Service without the prior authorization of Company is prohibited. Running or displaying the Company Service, or any information or material displayed via the Company Service in frames or through similar means on another website or application without the prior authorization of Company is prohibited. Any permitted links to the Company Service must comply with all applicable laws, rule and regulations.</li>
                    <li>Company makes no representation that Materials contained, described or offered via the Company Service are accurate, appropriate or available for use in jurisdictions outside the United States, or that these Terms of Service comply with the laws of any other country. Visitors who use the Company Service and reside outside the United States do so on their own initiative and are responsible for compliance with all applicable law. You agree that you will not access the Company Service from any territory where its contents are illegal, and that you, and not the Company Parties, are responsible for compliance with applicable law.</li>
                    <li>Your use of the Company Service is at your own risk, including the risk that you might be exposed to Content that is offensive, indecent, inaccurate, objectionable, or otherwise inappropriate.</li>
                    <li>Furthermore, you herein agree not to make use of the Services for:</li>
                    <li>uploading, posting, emailing, transmitting, or otherwise making available any content that shall be deemed unlawful, harmful, threatening, abusive, harassing, tortious, vulgar, obscene, libelous, or invasive of another's privacy or which is hateful, and/or racially, ethnically, or otherwise objectionable;</li>
                    <li>causing harm to minors in any manner whatsoever;</li>
                    <li>impersonating any individual or entity, including, but not limited to, any Company, forum leaders, guides or hosts or falsely stating or otherwise misrepresenting any affiliation with an individual or entity;</li>
                    <li>forging captions, headings or titles or otherwise offering any content that you personally have no right to pursuant to any law nor having any contractual or fiduciary relationship with;</li>
                    <li>uploading, posting, emailing, transmitting or otherwise offering any such content that may infringe upon any patent, copyright, trademark, or any other proprietary or intellectual rights of any other party;</li>
                    <li>uploading, posting, emailing, transmitting or otherwise offering any content that you do not personally have any right to offer pursuant to any law or in accordance with any contractual or fiduciary relationship;</li>
                    <li>uploading, posting, emailing, transmitting, or otherwise offering any unsolicited or unauthorized advertising, promotional flyers, "junk mail," "spam," or any other form of solicitation, except in any such areas that may have been designated for such purpose;</li>
                    <li>uploading, posting, emailing, transmitting, or otherwise offering any source that may contain a software virus or other computer code, any files and/or programs which have been designed to interfere, destroy and/or limit the operation of any computer software, hardware, or telecommunication equipment;</li>
                    <li>disrupting the normal flow of communication, or otherwise acting in any manner that would negatively affect other users' ability to participate in any real-time interactions;</li>
                    <li>interfering with or disrupting any of the Services, servers and/or networks that may be connected or related to our website, including, but not limited to, the use of any software and/or routine to bypass the robot exclusion headers;</li>
                    <li>intentionally or unintentionally violating any local, state, federal, national or international law, including, but not limited to, rules, guidelines, and/or regulations decreed by the Securities and Exchange Commission, in addition to any rules of any nation or other securities exchange, that would include without limitation, the New York Stock Exchange, the American Stock Exchange, or the NASDAQ, and any regulations having the force of law;</li>
                    <li>providing informational support or resources, concealing and/or disguising the character, location, and or source to any organization delegated by the United States government as a "foreign terrorist organization" in accordance to Section 219 of the Nationality Act;</li>
                    <li>stalking or with the intent to otherwise harass another individual; and/or,</li>
                    <li>collecting or storing of any personal data relating to any other user in connection with the prohibited conduct and/or activities which have been set forth in the aforementioned paragraphs.</li>
                </ol>
                <br/>
                <h2 className='text-xl font-bold'>Suggestions and Improvements</h2>
                <br/>
                <p>By sending us any ideas, suggestions, documents or proposals (“Feedback”), you agree that (i) your Feedback does not contain the confidential or proprietary information of third parties, (ii) we are under no obligation of confidentiality, express or implied, with respect to the Feedback, (iii) we may have something similar to the Feedback already under consideration or in development, and (iv) you grant us an irrevocable, non-exclusive, royalty-free, perpetual, worldwide license to use, modify, prepare derivative works, publish, distribute and sublicense the Feedback, and you irrevocably waive, and cause to be waived, against Company and its users any claims and assertions of any moral rights contained in such Feedback.</p>
                <br/>
                <h2 className='text-xl font-bold'>User Content</h2>
                <br/>
                <p>“User Content” means any and all information and content that a user submits to, or uses with, the Services, including but not limited to, content in the user’s profile or postings. You may choose to enter this information manually or, where available, synchronize with a third-party website. The Company does not verify the accuracy or completeness of User Content and these may therefore be subject to errors.</p>
                <br/>
                <p>You are solely responsible for your User Content. You assume all risks associated with use of your User Content, including any reliance on its accuracy, completeness or usefulness by others, or any disclosure of your User Content that personally identifies you or any third party. You hereby represent and warrant that your User Content does not violate any of the Terms of Service.</p>
                <br/>
                <p>You may not represent or imply to others that your User Content is in any way provided, sponsored or endorsed by Us. Because you alone are responsible for your User Content, you may expose yourself to liability if, for example, your User Content violates this Terms of Service in any way.</p>
                <br/>
                <p>Company does not and is not obligated to backup any User Content, and your User Content may be deleted at any time without prior notice. You are solely responsible for creating and maintaining your own backup copies of your User Content.</p>
                <br/>
                <p>We may, at our discretion, pre-screen User Content submission and may choose to remove User Content at any time we see fit. You agree that the Company is not responsible for any financial loss, liability or damage of any kind that you may incur as a result of our removing or refusing to publish User Content.</p>
                <br/>
                <p>We reserve the right, but have no obligation, to review any User Content, and to investigate and/or take appropriate action against you in our sole discretion if you violate these Terms of Service or otherwise create liability for Us or any other person. Such action may include removing or modifying your User Content, terminating your Account, and/or reporting you to law enforcement authorities.</p>
                <br/>
                <p>You understand that the Company is not liable for any third-party communications that you may receive from third parties or affiliates of the Company, in connection with your account. You are solely responsible for evaluating and verifying the identity and trustworthiness of any correspondence you receive. The Company makes no representations or warranties with regards to the accuracy, trustworthiness or identity of third-party communications.</p>
                <br/>
                <p>We may from time to time allow you to share Site content via social media share buttons. Such sharing must include attribution to the Site.</p>
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
                <h2 className='text-xl font-bold'>Representations</h2>
                <br/>
                <p>You expressly acknowledge, represent, warrant, and agree that you understand:</p>
                <br/>
                <p>The information contained herein is for informational purposes only and is not intended as nor should be construed as advice or recommendations and are not guaranteed to produce results.</p>
                <br/>
                <p>Company does not warrant or guarantee the suitability or availability of any material or content, including without limitation any, data, products or services, found through the Service.</p>
                <br/>
                <p>Company does not screen the authenticity or quality of any material or content or any provider of material or content, including, data, products or services found through the Service.</p>
                <br/>
                <p>Company makes no representations or promises regarding any material or content, and that some of the material or content provided via the Service may be owned or licensed by Third Parties.</p>
                <br/>
                <p>Company is not a party to any transaction between you and any provider of products or services via the Service except as may be specifically stated herein. Any dispute shall be resolved between yourself and the provider of such products or services or your customer.</p>
                <br/>
                <p>Any information, including any data, Company Materials, or content on the Site, including on any Company Facebook, Instagram or Twitter or other social media pages, are for informational purposes only.</p>
                <br/>
                <p>You assume all risk when using the Service, including all the risks associated with any online or offline interactions with other users, providers of products and services, and from additional fees or charges from your mobile carrier.</p>
                <br/>
                <p>You are of legal age to form a binding contract and are at least the age as noted earlier herein, or of the age of majority where you reside, or you have the authority of such legal entity to form a binding contract; all registration information you submit is accurate and truthful; you will maintain the accuracy of such information; and you are legally permitted to use and access the Service and take full responsibility for the selection and use of and access to the Service.</p>
                <br/>
                <h2 className='text-xl font-bold'>Indemnification</h2>
                <br/>
                <p>You agree to indemnify, defend and hold harmless the Company, its parents, subsidiaries and other affiliated companies, and their respective officers, directors, employees, agents and other representatives (collectively, the “Company Parties”) against all claims, demands, causes of action, losses, expenses, damages and costs (including any reasonable attorneys’ fees), resulting or arising from or relating to your use of the Service, any activity related to your account by you or any other person permitted by you, any Content that you submit to, post on or transmit through the Service, your breach of this Terms of Service, your infringement or violation of any rights of another, or termination of your access to the Service. We reserve the right to assume, at our sole expense, the exclusive defense and control of any such claim or action and all negotiations for settlement or compromise, and you agree to fully cooperate with Us in the defense of any such claim, action, settlement or compromise negotiations, as requested by Us.</p>
                <br/>
                <p>You hereby release and forever discharge the Company Parties from, and hereby waive and relinquish, each and every past, present and future dispute, claim, controversy, demand, right, obligation, liability, action and cause of action of every kind and nature (including personal injuries, death, and property damage), that has arisen or arises directly or indirectly out of, or that relates directly or indirectly to, the Service, including any interactions with, or act or omission of, other Service users or any Third-Party sites, including but not limited to: (i) your use of the Service, (ii) any activity related to your accounts by you or any other person, (iii) your violation of this Terms; (iv) your infringement or violation of any rights of another, (v) your violation of applicable laws or regulations, or (vi) your User Content.</p>
                <br/>
                <p>Company reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify Us, and you agree to cooperate with our defense of these claims. You agree not to settle any matter without the prior written consent of Company. Company will use reasonable efforts to notify you of any such claim, action or proceeding upon becoming aware of it.</p>
                <br/>
                <h2 className='text-xl font-bold'>Warranties, Disclaimers and Limitations of Liability</h2>
                <br/>
                <p>You expressly understand and agree that:</p>
                <br/>
                <p>Your use of the Service is at your sole risk. The Service and the associated materials and content are provided on an “as is” and “as available” basis. The Company, its parents, subsidiaries and other affiliated companies, and their respective officers, directors, employees, agents and other representatives (collectively, the “Company Parties”), expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a purpose and non-infringement. Without limiting the generality of the foregoing, the Company Parties make no warranty that: (i) the Service will meet your requirements; (ii) the Service will be uninterrupted, timely, secure, or error-free; (iii) information that may be obtained via the Service will be accurate or reliable; (iv) the quality of any and all products, services, information or other materials, including all merchandise, products, goods or services, obtained or purchased by you directly or indirectly through the company Service will meet your expectations or needs; and (v) any errors in the Service will be corrected.</p>
                <br/>
                <p>The Company Parties shall not under any circumstances be liable for any damages of any kind arising out of, in connection with or relating to the use of or inability to use the Service, including any liability: (i) as a publisher of information; (ii) for any incorrect or inaccurate information or any ‘bug’ of the Service; (iii) for any unauthorized access to or disclosure of your transmissions or data; (iv) for statements or conduct of any third party on or via the Service; (v) for any disputes between users of the Service or between a user of the Service and a Third Party; or (vi) for any other matter relating to the Service or any Third Party. This is a comprehensive limitation of liability that applies to all damages of any kind, including any direct, indirect, special, incidental or consequential damages, whether based on breach of contract, breach of warranty, tort (including negligence), product liability or otherwise, even if an individual advises the Company Parties of the possibility of such damages. The limitations of liability set forth herein are fundamental elements of the basis of the bargain between Company and you. The products, information and services offered on and through the Service would not be provided to you without such limitations.</p>
                <br/>
                <p>Notwithstanding the foregoing, the sole and entire maximum liability of the Company Parties for any reason, and your sole and exclusive remedy for any cause or claim whatsoever, shall be limited to the charges paid by you directly to company via the service, if any, for services provided solely and directly by Company to you in the three (3) months prior to such cause or claim or alternatively if there were no charges paid to the Company a maximum of One Hundred Dollars ($100).</p>
                <br/>
                <p>You agree that regardless of any statute or law to the contrary, any claim you may bring must be filed within one (1) year after the cause of action occurred or it will be permanently barred.</p>
                <br/>
                <p>Some jurisdictions do not allow the disclaimer of certain warranties or the limitation or exclusion of liability for certain types of damages. Accordingly, some of the above disclaimers and limitations may not apply to you. If you are a California resident, you shall and hereby do waive California Civil Code Section 1542, which says: “A general release does not extend to claims which the creditor does not know or suspect to exist in his favor at the time of executing the release, which, if known by him must have materially affected his settlement with the debtor.”</p>
                <br/>
                <h2 className='text-xl font-bold'>Miscellaneous</h2>
                <br/>
                <p>These Terms of Service constitute the entire agreement between Company and each user of the Company Service with respect to the subject matter of these Terms of Service.</p>
                <br/>
                <p>If any provision of these Terms of Service shall be deemed unlawful, void or for any reason unenforceable by a court of competent jurisdiction, the validity and enforceability of any remaining provisions will not be affected.</p>
                <br/>
                <p>The failure of the Company Parties to insist upon strict adherence to any term of these Terms of Service shall not constitute a waiver of such term and shall not be considered a waiver or limit that party’s right thereafter to insist upon strict adherence to that term or any other term contained in these Terms of Service. You may not assign your obligations or rights hereunder to another entity or individual. We may transfer, assign or delegate these Terms of Service and its rights and obligations without your consent.</p>
                <br/>
                <p>We shall have no liability to you hereunder if we are prevented from or delayed in performing our obligations, or from carrying on our business, by acts, events, omissions or accidents beyond our reasonable control, including, without limitation, strikes, lock-outs or other industrial disputes (whether involving the workforce of us or any other party), failure of a utility service or transport or telecommunications network, act of God, war, riot, civil commotion, malicious damage, compliance with any law or governmental order, rule, regulation or direction, accident, breakdown of plant or machinery, fire, flood or storm.</p>
                <br/>
                <p>No agency, partnership, joint venture, or employment is created as a result of these Terms of Service and you do not have any authority of any kind to bind us in any respect whatsoever.</p>
                <br/>
                <p>No action arising out of these Terms of Service or your use of the Company Service, regardless of form or the basis of the claim, may be brought by you more than one (1) year after the cause of action has arisen (or if multiple causes, from the date the first such cause arose).</p>
                <br/>
                <h2 className='text-xl font-bold'>Arbitration</h2>
                <br/>
                <p>Any controversy or claim related to the Service or this Terms of Service shall be first be settled by binding arbitration in accordance with the commercial arbitration rules of the American Arbitration Association then in effect and before a single arbitrator located in the aforementioned jurisdiction. You agree that printed copies of any and all agreements and/or notices in electronic form are admissible in any legal or regulatory proceedings. Company may seek any interim or preliminary relief from a court of competent jurisdiction in the State listed above necessary to protect its rights pending the completion of arbitration. Each party shall assume its own costs of arbitration.</p>
                <br/>
                <h2 className='text-xl font-bold'>Contact</h2>
                <br/>
                <p>If you have any comments or questions regarding these Terms of Service or wish to report any violation of these Terms of Service, you may contact us at the addresses below.</p>
                <br/>
                <p>Email: {supportEmail}</p>
            </div>
        </div>
    );
};
