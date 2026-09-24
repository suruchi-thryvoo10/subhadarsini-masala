/**
 * Single source of truth for Subhadarshini's own contact details.
 *
 * Every surface (navbar, footer, contact page, wholesale desk, floating
 * WhatsApp) reads from here so the details can never drift apart again.
 */

export const CONTACT = {
  addressLines: ['N3/394, IRC Village, Nayapalli', 'Bhubaneswar - 751015, Odisha, India'],
  addressShort: 'IRC Village, Nayapalli, Bhubaneswar - 751015',
  addressFull: 'N3/394, IRC Village, Nayapalli, Bhubaneswar - 751015, Odisha, India',

  phoneDisplay: '+91 63725 85804',
  phoneHref: 'tel:+916372585804',

  email: 'care@subhadarshini.com',
  emailHref: 'mailto:care@subhadarshini.com',

  website: 'subhadarshini.com',
  websiteHref: 'https://www.subhadarshini.com',

  /**
   * Prefilled WhatsApp enquiry. The number and the message are encoded with
   * encodeURIComponent so punctuation survives on both the mobile app and
   * WhatsApp Web; the previous link carried a Spanish default message.
   */
  whatsapp: `https://api.whatsapp.com/send?phone=916372585804&text=${encodeURIComponent(
    "Hi, I'm interested in Subhadarshini products. I would like to know more about the available spices and place an order."
  )}`,

  social: {
    instagram:
      'https://www.instagram.com/subhadarshini_masala?igsh=MTAzb3AzMzdiNjdhYQ%3D%3D',
    facebook:
      'https://www.facebook.com/profile.php?id=61580545933897'
  }
} as const;
