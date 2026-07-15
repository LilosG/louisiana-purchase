// src/data/events-config.ts
// Louisiana Purchase — Private Events Inquiry Integration
//
// Toast (not Tripleseat, retired) powers private event inquiries via an
// embedded lead-form iframe rather than a link-out platform. This is the
// single source of truth for that embed — no page should hardcode the URL.

export const PRIVATE_EVENTS_IFRAME_URL =
  'https://www.toasttab.com/invoice/lead?rx=35bea021-1fe0-4713-aa83-5dcf0be8e2e7&ot=21ae477f-1a5f-4f5a-a619-8f1e359e1e30&form=1';

// Anchor id (no leading '#') that every "Inquire About Your Event" CTA
// scrolls to. Pages that embed <ToastEventForm /> get this id on the
// section automatically; pages that don't embed the form link out to
// /private-events#<this> instead.
export const PRIVATE_EVENTS_FORM_ANCHOR = 'event-inquiry';
