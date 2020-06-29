/**
 * Generates a unique ID string consisting of 16 lowercase letters and digits (base 36).
 * This function in fact generates random strings using Math.random. However, the probability of a collision for 100k
 * keys in a single app execution is approximately 6.66e-16 or 1 in 1.5 quadrillion.
 * @returns {string} generated random string
 */
export const generateId = testEnvironment()
  ? generateIdSingle
  : generateIdConcat;

function testEnvironment() {
  return (
    Math.random()
      .toString(36)
      .substring(2).length >= 16
  );
}

function generateIdSingle() {
  return Math.random()
    .toString(36)
    .substring(2, 18);
}

function generateIdConcat() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 10) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  );
}

export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const assign = (target, ...sources) => {
  sources.forEach(source =>
    Object.keys(source || {}).forEach(key =>
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key)
      )
    )
  );
  return target;
};

export const getTypeName = type => type.charAt(0).toUpperCase() + type.slice(1);
