const { createUser } = require('../service/auth/db');
const { addUserRoles } = require('../service/roles/db');

async function seedSuperUser({ email, username, password }) {
    if (!email || !username || !password) {
        console.error('Missing argument for an email, username or password');
        return;
    }

    const { id } = await createUser({ email, username, password });
    const { addedCount } = await addUserRoles(id, ['super_admin']);
    if (!id || !addedCount) {
        console.error('Error creating user');
        return;
    }

    // eslint-disable-next-line no-console
    console.log(
        `Super admin account created for ${username} with the email address ${email}`
    );
}

const argsv = process.argv.slice(2);
const scriptArgs = {};

argsv.forEach(arg => {
    const parsedArg = arg.split('=');
    scriptArgs[parsedArg[0]] = parsedArg[1];
});

seedSuperUser(scriptArgs);
