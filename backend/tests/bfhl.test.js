const assert = require('node:assert/strict');
const test = require('node:test');
const request = require('supertest');

const app = require('../src/app');

test('returns the expected result for the challenge sample', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: [
        'A->B',
        'A->C',
        'B->D',
        'C->E',
        'E->F',
        'X->Y',
        'Y->Z',
        'Z->X',
        'P->Q',
        'Q->R',
        'G->H',
        'G->H',
        'G->I',
        'hello',
        '1->2',
        'A->',
      ],
    })
    .expect(200);

  assert.equal(response.body.summary.total_trees, 3);
  assert.equal(response.body.summary.total_cycles, 1);
  assert.equal(response.body.summary.largest_tree_root, 'A');
  assert.deepEqual(response.body.invalid_entries, ['hello', '1->2', 'A->']);
  assert.deepEqual(response.body.duplicate_edges, ['G->H']);
  assert.deepEqual(response.body.hierarchies, [
    {
      root: 'A',
      tree: {
        A: {
          B: {
            D: {},
          },
          C: {
            E: {
              F: {},
            },
          },
        },
      },
      depth: 4,
    },
    {
      root: 'G',
      tree: {
        G: {
          H: {},
          I: {},
        },
      },
      depth: 2,
    },
    {
      root: 'P',
      tree: {
        P: {
          Q: {
            R: {},
          },
        },
      },
      depth: 3,
    },
    {
      root: 'X',
      tree: {},
      has_cycle: true,
    },
  ]);
});

test('rejects malformed edges and self loops after trimming', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: [' A->A ', ' a->B ', 'AB->C', 'A=>B', '', '   '],
    })
    .expect(200);

  assert.deepEqual(response.body.invalid_entries, ['A->A', 'a->B', 'AB->C', 'A=>B', '', '']);
  assert.deepEqual(response.body.hierarchies, []);
  assert.deepEqual(response.body.duplicate_edges, []);
});

test('records each duplicate edge once even when repeated many times', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: ['A->B', 'A->B', 'A->B', 'A->B'],
    })
    .expect(200);

  assert.deepEqual(response.body.duplicate_edges, ['A->B']);
  assert.equal(response.body.summary.total_trees, 1);
  assert.equal(response.body.summary.total_cycles, 0);
});

test('ignores later parent assignments and keeps accepted edges deterministic', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: ['A->B', 'C->B', 'C->D'],
    })
    .expect(200);

  assert.deepEqual(response.body.hierarchies, [
    {
      root: 'A',
      tree: {
        A: {
          B: {},
        },
      },
      depth: 2,
    },
    {
      root: 'C',
      tree: {
        C: {
          D: {},
        },
      },
      depth: 2,
    },
  ]);
});

test('marks a pure cycle as cyclic and picks the lexicographically smallest fallback root', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: ['Y->Z', 'Z->X', 'X->Y'],
    })
    .expect(200);

  assert.deepEqual(response.body.hierarchies, [
    {
      root: 'X',
      tree: {},
      has_cycle: true,
    },
  ]);
  assert.equal(response.body.summary.total_trees, 0);
  assert.equal(response.body.summary.total_cycles, 1);
  assert.equal(response.body.summary.largest_tree_root, '');
});

test('returns hierarchies in deterministic root order and resolves largest tree ties lexicographically', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      data: ['M->N', 'A->B', 'Q->R'],
    })
    .expect(200);

  assert.deepEqual(
    response.body.hierarchies.map((hierarchy) => hierarchy.root),
    ['A', 'M', 'Q']
  );
  assert.equal(response.body.summary.largest_tree_root, 'A');
});

test('returns a validation error when the payload is missing the data array', async () => {
  const response = await request(app)
    .post('/bfhl')
    .send({
      edges: ['A->B'],
    })
    .expect(400);

  assert.deepEqual(response.body, {
    error: 'Request body must include a data array.',
  });
});
