import { unitStringToValue, valueToUnitString } from "./RoomPlanner";

describe("valueTounittring", () => {
  it("returns the expected value given a number", () => {
    const value = 10;
    return expect(valueToUnitString(value)).toBe(`${value}cm`);
  });
});

describe("unittringToValue", () => {
  it("returns the expected value given a number", () => {
    const string = "10";
    return expect(unitStringToValue(string)).toBe(10);
  });

  it("returns the expected value given a decimal number", () => {
    const string = "10.12";
    return expect(unitStringToValue(string)).toBeCloseTo(10.12, 5);
  });

  it("returns the expected value given cm unit", () => {
    const string = "10cm";
    return expect(unitStringToValue(string)).toBe(10);
  });

  it("returns the expected value given cm unit (decimal number)", () => {
    const string = "10.1234cm";
    return expect(unitStringToValue(string)).toBeCloseTo(10.1234, 5);
  });

  it("returns the expected value given mm unit", () => {
    const string = "10mm";
    return expect(unitStringToValue(string)).toBe(1);
  });

  it("returns the expected value given mm unit (decimal number)", () => {
    const string = "10.1234mm";
    return expect(unitStringToValue(string)).toBeCloseTo(1.01234, 5);
  });

  it("returns the expected value given m unit", () => {
    const string = "10m";
    return expect(unitStringToValue(string)).toBe(1000);
  });

  it("returns the expected value given m unit (decimal number)", () => {
    const string = "10.1234m";
    return expect(unitStringToValue(string)).toBeCloseTo(1012.34, 5);
  });

  it("returns the expected value given dm unit", () => {
    const string = "10dm";
    return expect(unitStringToValue(string)).toBe(100);
  });

  it("returns the expected value given dm unit (decimal number)", () => {
    const string = "10.1234dm";
    return expect(unitStringToValue(string)).toBeCloseTo(101.234, 5);
  });

  it("returns the expected value with a space between value and unit", () => {
    const string = "10 mm";
    return expect(unitStringToValue(string)).toBe(1);
  });

  it("returns the expected value with two spaces between value and unit", () => {
    const string = "10  mm";
    return expect(unitStringToValue(string)).toBe(1);
  });
});
