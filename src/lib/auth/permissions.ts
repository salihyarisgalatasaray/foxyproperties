export const roles=["ADMIN","AGENT","PROPERTY","FINANCE","MARKETING","CONTENT"] as const;
export type Role=(typeof roles)[number];
export const assignableRoles=["ADMIN","AGENT"] as const;
export type Permission="dashboard:read"|"leads:read"|"leads:update"|"finance:read"|"content:edit"|"properties:edit"|"audit:read"|"enquiries:read"|"enquiries:update"|"users:manage";
const matrix:Record<Role,Permission[]>={
 ADMIN:["dashboard:read","leads:read","leads:update","finance:read","content:edit","properties:edit","audit:read","enquiries:read","enquiries:update","users:manage"],
 AGENT:["enquiries:read","enquiries:update"],
 PROPERTY:["dashboard:read","leads:read","leads:update","properties:edit","enquiries:read","enquiries:update"],
 FINANCE:["dashboard:read","leads:read","leads:update","finance:read","enquiries:read","enquiries:update"],
 MARKETING:["dashboard:read","content:edit"],
 CONTENT:["dashboard:read","content:edit"]
};
export const can=(role:Role,permission:Permission)=>(matrix[role]??[]).includes(permission);
export const homeFor=(role:Role)=>can(role,"dashboard:read")?"/backoffice":"/backoffice/enquiries";
