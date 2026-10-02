export interface ContactInfo {
  companyName: string;
  shortName: string;
  tagline: string;
  fullTagline: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullFormatted: string;
  };
  phones: Array<{
    display: string;
    numeric: string;
    href: string;
  }>;
  email: string;
  emailHref: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hours: string;
}

export const contactInfo: ContactInfo = {
  companyName: "GoAG Services Private Limited",
  shortName: "GoAG",
  tagline: "DRONES FOR A BRIGHTER INDIA",
  fullTagline: "Technology for Remote Intelligent Sustainable Holistic Unified Land Farming",
  address: {
    line1: "Plot No: 72/P, 3rd Floor, Rajiv Gandhi Nagar, Kukatpally Heights",
    line2: "Industrial Development Area",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500072",
    country: "India",
    fullFormatted: "Plot No: 72/P, 3rd Floor, Rajiv Gandhi Nagar, Kukatpally Heights, Industrial Development Area, Hyderabad, Telangana - 500072",
  },
  phones: [
    {
      display: "+91 98855 89001",
      numeric: "+919885589001",
      href: "tel:+919885589001",
    },
    {
      display: "+91 74169 61414",
      numeric: "+917416961414",
      href: "tel:+917416961414",
    },
  ],
  email: "info@goagservices.com",
  emailHref: "mailto:info@goagservices.com",
  coordinates: {
    latitude: 17.4933,
    longitude: 78.3914,
  },
  hours: "Mon to Sat, 09:00 to 18:30 IST",
};
