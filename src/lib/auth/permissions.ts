export const roles=["ADMIN","PROPERTY","FINANCE","MARKETING","CONTENT"] as const;
export type Role=(typeof roles)[number];
export type Permission="dashboard:read"|"leads:read"|"leads:update"|"finance:read"|"content:edit"|"properties:edit"|"audit:read";
const matrix:Record<Role,Permission[]>={
 ADMIN:["dashboard:read","leads:read","leads:update","finance:read","content:edit","properties:edit","audit:read"],
 PROPERTY:["dashboard:read","leads:read","leads:update","properties:edit"],
 FINANCE:["dashboard:read","leads:read","leads:update","finance:read"],
 MARKETING:["dashboard:read","content:edit"],
 CONTENT:["dashboard:read","content:edit"]
};
export const can=(role:Role,permission:Permission)=>matrix[role].includes(permission);
