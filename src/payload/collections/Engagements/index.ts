import { CollectionConfig } from "payload/types";
import { admins } from "../../access/admins";

export const Engagements: CollectionConfig = {
  slug: "engagements",
  admin: {
    defaultColumns: ["user", "enterprise", "contacted", "connected", "engaged"],
  },
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "enterprise",
      type: "relationship",
      relationTo: "enterprises",
      required: true,
    },
    {
      name: "contacted",
      type: "checkbox",
    },
    {
      name: "connected",
      type: "checkbox",
    },
    {
      name: "engaged",
      type: "checkbox",
    },
  ],
};
