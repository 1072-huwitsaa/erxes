/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import utils from '../data/utils';

describe('test utils', () => {
  test('test readFile', async () => {
    const data = await utils.readFile('notification');
    expect(data).toBeDefined();
  });
});
