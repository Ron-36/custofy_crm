import assert from "node:assert/strict";
import test from "node:test";
import * as icons from "lucide-react";

test("lucide-react provides the icons added in 1.81.0", () => {
  const addedIcons = [
    "Elevator",
    "SteeringWheel",
    "GlobeClock",
    "BowlChopsticks",
  ];

  for (const iconName of addedIcons) {
    assert.ok(
      iconName in icons,
      `${iconName} should be exported by lucide-react`,
    );
  }

  // The icons whose shapes changed in 1.81.0 must keep their public names.
  const reshapedIcons = [
    "SquareSigma",
    "Smartphone",
    "RectangleHorizontal",
    "RectangleVertical",
  ];

  for (const iconName of reshapedIcons) {
    assert.ok(
      iconName in icons,
      `${iconName} should still be exported by lucide-react`,
    );
  }
});
