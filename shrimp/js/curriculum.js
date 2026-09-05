// Assembles the belts. Each belt has 4 stripes; completing the units listed in
// `stripeAfterUnits` earns the next stripe. Finishing every unit promotes you to the next belt.

const CURRICULUM = [
  {
    id: "white",
    name: "White belt",
    shortName: "White",
    color: "white",
    swatch: "#F6F3EC",
    swatchEdge: "#DAD5C8",
    stripeAfterUnits: [2, 4, 6, 8],
    units: WHITE_UNITS,
  },
  {
    id: "blue",
    name: "Blue belt",
    shortName: "Blue",
    color: "blue",
    swatch: "#2C6FD1",
    swatchEdge: "#1F55A6",
    stripeAfterUnits: [2, 4, 6, 8],
    units: BLUE_UNITS,
  },
];
