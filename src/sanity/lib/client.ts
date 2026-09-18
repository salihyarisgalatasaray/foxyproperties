import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";
export const client = createClient({ projectId: projectId || "missing", dataset, apiVersion, useCdn: true });
