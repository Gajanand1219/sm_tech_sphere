<div align="center">

# 🧪 WORKFLOW TEST PLAN

### Enviquo SM Pvt. Ltd.

**End-to-end functional tests for Buyer, Admin, Vendor, Quotations, Email, and Mutual Handshake**

</div>

---

## 📌 1. Purpose

This document defines a practical test plan for validating the project workflow described in `project_workflow.md`.

The checklist is a **test plan**, not evidence that tests have already passed. Run each test against the application and record the actual result.

## 🧭 2. Test Scope

- Buyer and Vendor registration
- Email OTP verification and login
- Buyer technical enquiry creation and submission
- Admin enquiry review, approval, and rejection
- Vendor matching and matching limit
- Vendor dossier access and quotation submission
- Buyer quotation decisions
- Vendor connection decision and mutual handshake
- Email notifications
- Contact-detail privacy
- API authentication and production configuration

## 🏷️ 3. Test Result Legend

| Result | Meaning |
|---|---|
| `PASS` | Actual result matches the expected result |
| `FAIL` | Actual result differs from the expected result |
| `BLOCKED` | Test cannot run because a dependency or configuration is missing |
| `NOT RUN` | Test has not yet been executed |

> [!IMPORTANT]
> Mark a test `PASS` only after verifying the behavior in the running application. Do not treat this template as a completed test report.

---

## 🔐 4. Registration & Authentication Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| AUTH-01 | Buyer registration | Submit a valid buyer registration form | Buyer account is created or enters the OTP verification step according to implementation | NOT RUN |
| AUTH-02 | Vendor registration | Submit a valid vendor registration form | Vendor account is created or enters the OTP verification step according to implementation | NOT RUN |
| AUTH-03 | Buyer email OTP | Request an OTP and submit the correct, unexpired code | Email verification succeeds | NOT RUN |
| AUTH-04 | Vendor email OTP | Request an OTP and submit the correct, unexpired code | Email verification succeeds | NOT RUN |
| AUTH-05 | Incorrect OTP | Submit an incorrect code | Verification is rejected with a safe error message | NOT RUN |
| AUTH-06 | Expired OTP | Submit an expired code, if expiry is implemented | Verification is rejected | NOT RUN |
| AUTH-07 | Registration approval rule | Register as buyer and vendor without admin registration approval | Registration flow does not require admin approval | NOT RUN |
| AUTH-08 | Valid login | Log in with valid registered credentials | Login succeeds and the correct panel is accessible | NOT RUN |
| AUTH-09 | Invalid login | Use an incorrect password | Login is rejected without exposing sensitive details | NOT RUN |
| AUTH-10 | Protected endpoint | Call a protected API without a valid JWT | Request is rejected | NOT RUN |
| AUTH-11 | Invalid or expired JWT | Call a protected API with an invalid or expired token | Request is rejected | NOT RUN |
| AUTH-12 | Role access | Attempt to open a panel or API outside the user's role | Access is denied where role-based authorization is required | NOT RUN |

---

## 🛒 5. Buyer Enquiry Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| BUY-01 | Create enquiry | Log in as buyer and create a technical enquiry | Enquiry is saved | NOT RUN |
| BUY-02 | Select CleanTech domain | Select a valid service domain | Selected domain is saved with the enquiry | NOT RUN |
| BUY-03 | Complete questionnaire | Submit valid questionnaire responses | Responses are saved and associated with the enquiry | NOT RUN |
| BUY-04 | Technical dossier | Prepare or generate the dossier using the application's flow | Dossier is available for review | NOT RUN |
| BUY-05 | Submit enquiry | Submit a completed enquiry | Enquiry enters admin review | NOT RUN |
| BUY-06 | Required-field validation | Submit with required information missing | Submission is rejected with field-level validation | NOT RUN |
| BUY-07 | Buyer data isolation | Attempt to view another buyer's enquiry | Access is denied unless explicitly permitted by the application | NOT RUN |
| BUY-08 | Admin notification | Submit a new enquiry with email configured | Admin notification is sent or logged by configured fallback | NOT RUN |

---

## 🛡️ 6. Admin Review Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| ADM-01 | View pending enquiries | Log in as admin and open the enquiry queue | Pending enquiries are visible | NOT RUN |
| ADM-02 | Review dossier | Open an enquiry and inspect questionnaire/dossier data | Relevant submitted data is displayed | NOT RUN |
| ADM-03 | Approve enquiry | Approve a pending enquiry | Enquiry becomes approved and matching is triggered according to implementation | NOT RUN |
| ADM-04 | Reject enquiry | Reject a pending enquiry | Enquiry is marked rejected in CRM | NOT RUN |
| ADM-05 | Rejection notification | Reject an enquiry with email configured | Buyer receives or is logged for a rejection notification | NOT RUN |
| ADM-06 | Approval notification | Approve an enquiry with email configured | Buyer receives or is logged for an approval notification | NOT RUN |
| ADM-07 | Repeat decision | Attempt to approve/reject an already decided enquiry | Duplicate or invalid transition is safely handled | NOT RUN |
| ADM-08 | Role protection | Attempt admin action using a non-admin account | Action is denied | NOT RUN |

---

## 🎯 7. Vendor Matching Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| MAT-01 | Match approved enquiry | Approve an enquiry with eligible vendors available | Matching suggestions are created | NOT RUN |
| MAT-02 | Domain relevance | Include vendors with matching and non-matching service domains | Matching follows configured domain logic | NOT RUN |
| MAT-03 | Vendor specialization | Use vendors with different specializations | Matching follows configured specialization logic | NOT RUN |
| MAT-04 | Vendor work area | Use vendors with different work areas | Matching follows configured area-of-work logic | NOT RUN |
| MAT-05 | Inactive vendor | Include an inactive vendor | Inactive vendor is not eligible for matching | NOT RUN |
| MAT-06 | Unverified vendor | Include a vendor without verified email | Unverified vendor is not eligible for matching | NOT RUN |
| MAT-07 | Matching cap | Provide more than 10 otherwise eligible vendors | No more than 10 vendor slots are created for the enquiry | NOT RUN |
| MAT-08 | Matched-vendor notification | Match an enquiry | Only matched vendors are notified | NOT RUN |
| MAT-09 | No eligible vendors | Approve an enquiry with no eligible vendors | No invalid suggestions are created; empty-match behavior is handled safely | NOT RUN |
| MAT-10 | Duplicate matching | Trigger matching again for the same enquiry | Duplicate suggestions are prevented or handled according to implementation | NOT RUN |

---

## 🏭 8. Vendor Dossier & Quotation Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| VEN-01 | View matched enquiry | Log in as a matched vendor | Vendor can view the relevant matching suggestion | NOT RUN |
| VEN-02 | Unmatched enquiry access | Attempt to access an enquiry without a matching suggestion | Access is denied unless explicitly permitted | NOT RUN |
| VEN-03 | Masked dossier | Open a matched enquiry before handshake | Buyer identity and contact details remain masked | NOT RUN |
| VEN-04 | Submit quotation | Submit a valid technical quotation | Quotation is saved and associated with the enquiry | NOT RUN |
| VEN-05 | Invalid quotation | Submit missing or invalid quotation data | Validation error is returned | NOT RUN |
| VEN-06 | Quotation window | Test before and after the 240-hour deadline | Submission is allowed or rejected according to the configured deadline rule | NOT RUN |
| VEN-07 | Buyer notification | Submit a quotation with email configured | Buyer is notified or notification is logged by fallback | NOT RUN |
| VEN-08 | Vendor data isolation | Attempt to access another vendor's private quotation data | Access is denied unless explicitly permitted | NOT RUN |

---

## 💬 9. Buyer Decision & Mutual Handshake Tests

| Test ID | Test case | Steps / test data | Expected result | Actual result |
|---|---|---|---|---|
| HSK-01 | Buyer accepts quotation | Buyer accepts a submitted quotation | Acceptance is recorded and vendor is notified | NOT RUN |
| HSK-02 | Buyer rejects quotation | Buyer rejects a submitted quotation | Rejection is recorded according to implementation | NOT RUN |
| HSK-03 | Vendor accepts connection | After buyer acceptance, vendor accepts connection | Vendor decision is recorded | NOT RUN |
| HSK-04 | Vendor declines connection | After buyer acceptance, vendor declines connection | Decline is recorded and buyer is notified where configured | NOT RUN |
| HSK-05 | Mutual acceptance | Buyer and vendor both accept the connection | Mutual handshake is completed | NOT RUN |
| HSK-06 | Contact details before handshake | Check both parties' views before mutual acceptance | Contact details remain masked | NOT RUN |
| HSK-07 | Contact details after handshake | Check both parties' views after completed handshake | Contact details unlock according to the application's rules | NOT RUN |
| HSK-08 | Unauthorized handshake | Attempt to accept another user's connection | Action is denied | NOT RUN |
| HSK-09 | Repeated decision | Submit the same acceptance/decline action more than once | Duplicate or conflicting transitions are handled safely | NOT RUN |

---

## 📧 10. Email Notification Tests

Run these tests with valid SMTP settings in a test environment. If console fallback is used, verify the event is logged and mark actual inbox delivery as blocked/not tested.

| Test ID | Email event | Expected result | Actual result |
|---|---|---|---|
| MAIL-01 | Buyer registration OTP | OTP notification is generated and delivered/logged | NOT RUN |
| MAIL-02 | Vendor registration OTP | OTP notification is generated and delivered/logged | NOT RUN |
| MAIL-03 | New enquiry to admin | Admin notification is generated and delivered/logged | NOT RUN |
| MAIL-04 | Enquiry approval to buyer | Approval email is generated and delivered/logged | NOT RUN |
| MAIL-05 | Enquiry rejection to buyer | Rejection email is generated and delivered/logged | NOT RUN |
| MAIL-06 | Matching notice to vendors | Only matched vendors receive notices | NOT RUN |
| MAIL-07 | Quotation notice to buyer | Buyer receives or is logged for a quotation notice | NOT RUN |
| MAIL-08 | Buyer acceptance to vendor | Vendor receives or is logged for acceptance notice | NOT RUN |
| MAIL-09 | Vendor connection decision to buyer | Buyer receives or is logged for the decision notice | NOT RUN |
| MAIL-10 | Mutual handshake to both parties | Both parties receive or are logged for confirmation | NOT RUN |

---

## 🔒 11. Security & Configuration Tests

| Test ID | Test case | Expected result | Actual result |
|---|---|---|---|
| SEC-01 | JWT secret configuration | A secure, non-default secret is used outside local development | NOT RUN |
| SEC-02 | Default admin credentials | Default credentials are changed before deployment | NOT RUN |
| SEC-03 | Secret exposure | Secrets are not present in committed source files or frontend bundles | NOT RUN |
| SEC-04 | CORS configuration | Only required frontend origins are allowed in production | NOT RUN |
| SEC-05 | HTTPS | Production traffic uses HTTPS | NOT RUN |
| SEC-06 | Input validation | Invalid API inputs are rejected safely | NOT RUN |
| SEC-07 | Contact privacy | API responses do not expose contact details before mutual handshake | NOT RUN |
| SEC-08 | Database persistence | Data remains available after the application restarts, according to configured storage | NOT RUN |
| SEC-09 | SMTP failure | Email-service failure is handled without leaking credentials or sensitive data | NOT RUN |
| SEC-10 | Error responses | Errors do not expose stack traces or secrets to end users in production | NOT RUN |

---

## 🧾 12. Test Execution Summary

Fill in this summary after running the tests.

| Metric | Count |
|---|---:|
| Total test cases | 75 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not run | 75 |

> Update the counts above based on actual execution. The initial values indicate that no tests have been recorded yet.

### Test run details

- **Environment:** `Local / Staging / Production`
- **Build or commit:** `Enter version or commit ID`
- **Executed by:** `Enter tester name`
- **Execution date:** `YYYY-MM-DD`
- **Backend URL:** `Enter test backend URL`
- **Frontend URL:** `Enter test frontend URL`

### Defect log

| Defect ID | Related test ID | Issue description | Severity | Status |
|---|---|---|---|---|
| BUG-001 | `TEST-ID` | `Describe observed issue` | `Low / Medium / High / Critical` | `Open` |

---

## 📌 13. Test Completion Criteria

The workflow test cycle can be considered complete when:

- All critical registration, authorization, approval, matching, quotation, and handshake tests have been executed.
- Any failed tests have documented defects and retest results.
- The 10-vendor matching cap and 240-hour quotation window have been verified.
- Contact details remain masked until the mutual handshake is complete.
- Required email notifications have been verified using the configured delivery method.
- Production security and configuration checks have been completed.

**Reminder:** Expected results should be checked against the actual API routes, database models, and implemented business rules. This plan does not claim that the application has been executed or tested.

---

<div align="center">

**Enviquo SM Pvt. Ltd.**  
*Workflow Test Plan • Functional Validation • Quality Assurance*

</div>
