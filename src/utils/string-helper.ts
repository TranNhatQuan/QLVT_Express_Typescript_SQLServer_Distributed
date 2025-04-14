export const obscureEmail = (email: string) => {
  const [name, domain] = email.split("@", 2);

  return `${name.slice(0, 2)}${new Array(name.length - 1).join("*")}@${domain}`;
};

export const obscurePhoneNumber = (phoneNumber: string) =>
  `${phoneNumber.slice(0, 3)}${new Array(phoneNumber.length - 5).join(
    "*"
  )}${phoneNumber.slice(-2)}`;

export const normalizeStreetType = (streetType: string) => {
  streetType = streetType.toLowerCase();

  return streetType[0].toUpperCase() + streetType.substring(1);
};
