const { addRolePermissions } = require('../service/roles/db');
const rolePermissionData = require('./permissions.json');

async function seedPermissions() {
    Object.entries(rolePermissionData).map(async ([permission, roles]) => {
        roles.forEach(async role => {
            const result = await addRolePermissions(role, permission);
            // eslint-disable-next-line no-console
            console.log(`${permission}: ${role}`, result);
        });
    });
}

seedPermissions();
