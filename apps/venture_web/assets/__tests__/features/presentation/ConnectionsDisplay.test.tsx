import React from "react";
import ConnectionsDisplay from "js/features/presentation/ConnectionsDisplay";
import { RootState } from "js/store";

const store = useStore();

const mockState: RootState = {
  presentation: {
    connections: {
      presenters: 1,
      attendees: 3
    }
  }
}

let originalGetState: typeof store.getState;

beforeEach(() => {
  originalGetState = store.getState;
  store.getState = () => mockState;
});

afterEach(() => {
  store.getState = originalGetState;
});

test("displays connection counts", () => {
  render(<ConnectionsDisplay />);
  const display = document.getElementById("connections");
  expect(display).toContainHTML("<dt>Presenters:</dt><dd>1</dd>");
  expect(display).toContainHTML("<dt>Attendees:</dt><dd>3</dd>");
});
