import { siteConfig } from "../config";

export const legalPages = {
  terms: {
    title: "Terms",
    description: "Working terms page for the directory framework.",
    sections: [
      ["Framework notice", "This is placeholder legal copy for a pre-launch framework. Replace it with market-specific terms reviewed before the public launch."],
      ["Directory role", "The site describes and links to independent third-party destinations. A listing does not transfer control of, or responsibility for, a third-party service to this directory."],
      ["Adults only", siteConfig.legalNotice],
      ["Accuracy", "Directory information can change. Visitors should verify current pricing, availability, terms, and technical requirements directly with the destination."]
    ]
  },
  privacy: {
    title: "Privacy",
    description: "Working privacy page for the directory framework.",
    sections: [
      ["Framework notice", "This placeholder must be replaced with a privacy notice that matches the analytics, advertising, hosting, forms, and consent tools actually used at launch."],
      ["Local preferences", "The age confirmation is stored in localStorage in the visitor's browser. The static framework does not send that confirmation to a server."],
      ["Outbound links", "Third-party destinations apply their own privacy practices. Review those practices before submitting personal information."],
      ["Contact", `Pre-launch contact placeholder: ${siteConfig.contactEmail}`]
    ]
  },
  copyright: {
    title: "Copyright",
    description: "Working copyright page for the directory framework.",
    sections: [
      ["Framework notice", "Replace this page with a complete notice and removal process appropriate for the launch jurisdiction and hosting setup."],
      ["Original material", "Directory layout, original reviews, and editorial summaries should be created for this project. Do not import another site's text, screenshots, logos, or ranking data without permission."],
      ["Third-party destinations", "Requests concerning material hosted by a listed destination generally need to be directed to that destination's operator."],
      ["Contact", `Pre-launch contact placeholder: ${siteConfig.contactEmail}`]
    ]
  }
} as const;

