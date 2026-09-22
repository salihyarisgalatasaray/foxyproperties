import { listProperties } from "@/lib/propertiesDb";
import { AdminProperties } from "@/components/admin/AdminProperties";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const items = await listProperties(false);
  return <AdminProperties initial={items} />;
}
