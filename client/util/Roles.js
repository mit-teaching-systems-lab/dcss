export const rolesToHumanReadableString = (type, roles) => {
  if (!roles || (roles && !roles.length)) {
    return `You are not in this ${type}.`;
  }
  const rolesSlice = roles.slice();
  const ownerIndex = rolesSlice.indexOf('owner');
  const isOwner = ownerIndex !== -1;
  let returnValue = '';

  if (isOwner) {
    returnValue = 'the owner';
  } else {
    // The user is not the owner...
    //
    if (rolesSlice.length === 1) {
      // The user is just a "participant"
      returnValue = `a ${rolesSlice[0]}`;
    } else {
      // This user is more than just a "participant", so
      // "participant" is implied, but not necessary to display.
      rolesSlice.splice(rolesSlice.indexOf('participant'), 1);
      returnValue = `a ${rolesSlice[0]} and ${rolesSlice[1]}`;
    }
  }

  return `You are ${returnValue}.`;
};
