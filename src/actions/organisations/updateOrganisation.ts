"use server";

import { ActionResponse } from "@/lib/utils/actionResponse";
import { getServerUser } from "@/lib/utils/getServerUser";
import {
  OrganisationData,
  organisationSchema,
} from "@/lib/validations/organisations/organisationSchema";
import getPayloadClient from "@/payload/payloadClient";

export const updateOrganisation = async (
  data: OrganisationData
): ActionResponse => {
  const validation = organisationSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: "Bad request." };
  }

  const user = await getServerUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const payload = await getPayloadClient();

  await payload.update({
    collection: "organisations",
    id: user.organisation as string,
    data: {
      name: validation.data.name,
      members: validation.data.members,
    },
  });

  return { success: true };
};
