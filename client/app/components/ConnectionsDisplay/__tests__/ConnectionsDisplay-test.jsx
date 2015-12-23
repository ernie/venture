import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import ConnectionsDisplay from '../ConnectionsDisplay';

let fakeConnections = { presenters: 1, attendees: 42 };

let mockConnectionsStore = {

  connections: fakeConnections,

  get() {
    return this.connections;
  }

}

describe('ConnectionsDisplay', () => {

  before( () => {
    ConnectionsDisplay.__Rewire__('ConnectionsStore', mockConnectionsStore);
  });

  after( () => {
    ConnectionsDisplay.__ResetDependency__('ConnectionsStore');
  });

  describe('Rendering', () => {

    it('renders a dl with count of presenters and attendees', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<ConnectionsDisplay />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'dl');
      assert.deepEqual(
        result.props.children,
        [
          <dt>Presenters:</dt>,
          <dd>{1}</dd>,
          <dt>Attendees:</dt>,
          <dd>{42}</dd>
        ]
      );
    });

  });

});
